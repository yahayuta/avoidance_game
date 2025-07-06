package main

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"log"
	"math"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/hajimehoshi/ebiten/v2"
	"github.com/hajimehoshi/ebiten/v2/audio"
	"github.com/hajimehoshi/ebiten/v2/audio/wav"
	"github.com/hajimehoshi/ebiten/v2/ebitenutil"
)

const (
	screenWidth    = 256
	screenHeight   = 256
	playerSize     = 32
	projectileSize = 10
	maxProjectiles = 41
)

type Player struct {
	X, Y   float64
	Pose   int // 0-7 for 8 directions
	Sprite *ebiten.Image
}

type Projectile struct {
	X, Y         float64
	MoveX, MoveY float64
	Active       bool
}

type Game struct {
	Player           Player
	Projectiles      []Projectile
	Score            int
	GameRunning      bool
	GameOver         bool
	PlayerSprite     *ebiten.Image
	ProjectileSprite *ebiten.Image
	shotMax          int
	shotCounter      int
	shotAddCounter   int
	frameCount       int
	fps              int
	lastFpsTime      time.Time
	audioContext     *audio.Context
	hitPlayer        *audio.Player
	bgmPlayer        *audio.Player
	flashTimer       int // frames left to flash red
}

func loadImage(path string) *ebiten.Image {
	f, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	img, _, err := image.Decode(f)
	if err != nil {
		log.Fatal(err)
	}
	return ebiten.NewImageFromImage(img)
}

func NewGame() *Game {
	playerSprite := loadImage(filepath.Join("assets", "My.png"))
	projectileSprite := loadImage(filepath.Join("assets", "Shot.png"))
	audioContext := audio.NewContext(44100)
	// Load hit.wav
	data, err := os.ReadFile("hit.wav")
	if err != nil {
		log.Fatal(err)
	}
	d, err := wav.DecodeWithSampleRate(44100, bytes.NewReader(data))
	if err != nil {
		log.Fatal(err)
	}
	hitPlayer, err := audio.NewPlayer(audioContext, d)
	if err != nil {
		log.Fatal(err)
	}
	// Load BGM
	bgmData, err := os.ReadFile("bgm.wav")
	if err != nil {
		log.Fatal(err)
	}
	bgmDecoded, err := wav.DecodeWithSampleRate(44100, bytes.NewReader(bgmData))
	if err != nil {
		log.Fatal(err)
	}
	bgmPlayer, err := audio.NewPlayer(audioContext, bgmDecoded)
	if err != nil {
		log.Fatal(err)
	}
	return &Game{
		Player: Player{
			X:      float64((screenWidth - playerSize) / 2),
			Y:      float64((screenHeight - playerSize) / 2),
			Sprite: playerSprite,
		},
		Projectiles:      make([]Projectile, maxProjectiles),
		GameRunning:      false,
		GameOver:         false,
		PlayerSprite:     playerSprite,
		ProjectileSprite: projectileSprite,
		shotMax:          4,
		lastFpsTime:      time.Now(),
		audioContext:     audioContext,
		hitPlayer:        hitPlayer,
		bgmPlayer:        bgmPlayer,
		flashTimer:       0,
	}
}

func (g *Game) Update() error {
	if ebiten.IsKeyPressed(ebiten.KeySpace) && !g.GameRunning {
		g.GameRunning = true
		g.GameOver = false
		g.Score = 0
		g.shotMax = 4
		g.shotCounter = 0
		g.shotAddCounter = 0
		for i := range g.Projectiles {
			g.Projectiles[i].Active = false
		}
		g.Player.X = float64((screenWidth - playerSize) / 2)
		g.Player.Y = float64((screenHeight - playerSize) / 2)
		g.Player.Pose = 0
		if g.bgmPlayer != nil {
			g.bgmPlayer.Rewind()
			g.bgmPlayer.Play()
		}
	}
	if ebiten.IsKeyPressed(ebiten.KeyEscape) {
		g.GameRunning = false
		g.GameOver = true
		if g.bgmPlayer != nil {
			g.bgmPlayer.Pause()
		}
	}
	if g.GameRunning {
		speed := 4.0
		up := ebiten.IsKeyPressed(ebiten.KeyArrowUp)
		down := ebiten.IsKeyPressed(ebiten.KeyArrowDown)
		left := ebiten.IsKeyPressed(ebiten.KeyArrowLeft)
		right := ebiten.IsKeyPressed(ebiten.KeyArrowRight)
		direction := -1
		if up && right {
			direction = 1
			g.Player.X += speed
			g.Player.Y -= speed
		} else if up && left {
			direction = 7
			g.Player.X -= speed
			g.Player.Y -= speed
		} else if down && right {
			direction = 3
			g.Player.X += speed
			g.Player.Y += speed
		} else if down && left {
			direction = 5
			g.Player.X -= speed
			g.Player.Y += speed
		} else if up {
			direction = 0
			g.Player.Y -= speed
		} else if right {
			direction = 2
			g.Player.X += speed
		} else if down {
			direction = 4
			g.Player.Y += speed
		} else if left {
			direction = 6
			g.Player.X -= speed
		}
		if direction != -1 {
			g.Player.Pose = direction
		}
		// Clamp player position
		if g.Player.X < 0 {
			g.Player.X = 0
		}
		if g.Player.Y < 0 {
			g.Player.Y = 0
		}
		if g.Player.X > screenWidth-playerSize {
			g.Player.X = screenWidth - playerSize
		}
		if g.Player.Y > screenHeight-playerSize {
			g.Player.Y = screenHeight - playerSize
		}

		// Projectile spawning logic
		if g.shotAddCounter >= 100 && g.shotMax < maxProjectiles-1 {
			g.shotAddCounter = 0
			g.shotMax++
		} else {
			g.shotAddCounter++
		}
		if g.shotCounter >= 4 {
			g.shotCounter = 0
			for i := 0; i < g.shotMax; i++ {
				if !g.Projectiles[i].Active {
					g.createProjectile(i)
				}
			}
		} else {
			g.shotCounter++
		}

		// Update projectiles
		for i := 0; i < g.shotMax; i++ {
			if g.Projectiles[i].Active {
				g.Projectiles[i].X += g.Projectiles[i].MoveX
				g.Projectiles[i].Y += g.Projectiles[i].MoveY
				// Collision check
				if g.checkCollision(&g.Projectiles[i]) {
					g.GameOver = true
					g.GameRunning = false
					if g.hitPlayer != nil {
						g.hitPlayer.Rewind()
						g.hitPlayer.Play()
					}
					if g.bgmPlayer != nil {
						g.bgmPlayer.Pause()
					}
					g.flashTimer = 18 // 0.3 seconds at 60 FPS
				}
				// Deactivate if out of bounds
				if g.Projectiles[i].X+projectileSize < 0 || g.Projectiles[i].X > screenWidth ||
					g.Projectiles[i].Y+projectileSize < 0 || g.Projectiles[i].Y > screenHeight {
					g.Projectiles[i].Active = false
				}
			}
		}

		// Score
		g.Score++
	}

	// FPS calculation
	g.frameCount++
	if time.Since(g.lastFpsTime) >= time.Second {
		g.fps = g.frameCount
		g.frameCount = 0
		g.lastFpsTime = time.Now()
	}

	if g.flashTimer > 0 {
		g.flashTimer--
	}

	if g.bgmPlayer != nil && !g.bgmPlayer.IsPlaying() && g.GameRunning {
		g.bgmPlayer.Rewind()
		g.bgmPlayer.Play()
	}

	return nil
}

func (g *Game) createProjectile(index int) {
	// Random spawn side (1-4: top, right, bottom, left)
	spawnSide := rand.Intn(4) + 1
	var x, y float64
	switch spawnSide {
	case 1: // Top
		x = 1
		y = rand.Float64()*(screenHeight-10) + 10
	case 2: // Right
		x = screenWidth - 10
		y = rand.Float64()*(screenHeight-10) + 10
	case 3: // Bottom
		x = rand.Float64()*(screenWidth-10) + 10
		y = screenHeight - 10
	case 4: // Left
		x = rand.Float64()*(screenWidth-10) + 10
		y = 1
	}
	targetX := g.Player.X + playerSize/2 + (rand.Float64()*64 - 32)
	targetY := g.Player.Y + playerSize/2 + (rand.Float64()*64 - 32)
	moveX := targetX - x
	moveY := targetY - y
	distance := math.Sqrt(moveX*moveX + moveY*moveY)
	speed := float64(rand.Intn(2) + 1)
	var normMoveX, normMoveY float64
	if distance > 0 {
		normMoveX = moveX / distance
		normMoveY = moveY / distance
	}
	g.Projectiles[index] = Projectile{
		X:      x,
		Y:      y,
		MoveX:  speed * normMoveX,
		MoveY:  speed * normMoveY,
		Active: true,
	}
}

func (g *Game) checkCollision(p *Projectile) bool {
	return g.Player.X < p.X+projectileSize &&
		g.Player.X+playerSize > p.X &&
		g.Player.Y < p.Y+projectileSize &&
		g.Player.Y+playerSize > p.Y
}

func (g *Game) Draw(screen *ebiten.Image) {
	if g.flashTimer > 0 {
		screen.Fill((color.RGBA{255, 0, 0, 255}))
	} else {
		screen.Fill((color.RGBA{0, 0, 0, 255}))
	}
	// Draw player (draw correct pose from sprite sheet)
	sx := g.Player.Pose * playerSize
	sy := 0
	subImg := g.Player.Sprite.SubImage(image.Rect(sx, sy, sx+playerSize, sy+playerSize)).(*ebiten.Image)
	op := &ebiten.DrawImageOptions{}
	op.GeoM.Translate(g.Player.X, g.Player.Y)
	screen.DrawImage(subImg, op)
	// Draw projectiles
	for i := 0; i < g.shotMax; i++ {
		if g.Projectiles[i].Active {
			op := &ebiten.DrawImageOptions{}
			op.GeoM.Translate(g.Projectiles[i].X, g.Projectiles[i].Y)
			screen.DrawImage(g.ProjectileSprite, op)
		}
	}
	// UI
	ui := fmt.Sprintf("FPS: %03d  SCORE: %06d", g.fps, g.Score)
	ebitenutil.DebugPrint(screen, ui)
	if !g.GameRunning && !g.GameOver {
		ebitenutil.DebugPrintAt(screen, "ARROW KEYS: Move | SPACE: Start | ESC: Exit", 10, screenHeight-20)
	}
	if g.GameOver {
		ebitenutil.DebugPrintAt(screen, "GAME OVER", screenWidth/2-40, screenHeight/2-10)
	}
}

func (g *Game) Layout(outsideWidth, outsideHeight int) (int, int) {
	return screenWidth, screenHeight
}

func main() {
	rand.Seed(time.Now().UnixNano())
	ebiten.SetWindowSize(screenWidth*2, screenHeight*2)
	ebiten.SetWindowTitle("Avoidance Game (Go/Ebiten)")
	game := NewGame()
	if err := ebiten.RunGame(game); err != nil {
		log.Fatal(err)
	}
}
