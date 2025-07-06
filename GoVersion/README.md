# Avoidance Game (Go/Ebiten Version)

A faithful Go/Ebiten port of the classic Visual Basic 6.0 avoidance game. Dodge projectiles, survive as long as possible, and enjoy retro gameplay with modern enhancements!

---

## 🎮 Features
- 8-directional player movement
- Player sprite with correct pose (8 directions)
- Projectile spawning, movement, and collision
- Score and FPS display
- Game over detection and message
- Keyboard controls (arrows, SPACE to start, ESC to exit)
- Sound effect on collision/game over (`hit.wav`)
- Background music (BGM, `bgm.wav`) with manual looping
- Red flash visual effect on game over

---

## 🟢 Status: **Feature Parity with Original VB6 Game**
- All core gameplay and audiovisual features are implemented.
- Modern codebase, easy to extend or port to other platforms.

---

## 🛠️ How to Build and Run

1. **Install Go** ([https://go.dev/dl/](https://go.dev/dl/))
2. **Install Ebiten**
   ```sh
   go get github.com/hajimehoshi/ebiten/v2
   go get github.com/hajimehoshi/ebiten/v2/audio
   go get github.com/hajimehoshi/ebiten/v2/audio/wav
   ```
3. **Generate or provide sound files**
   - `hit.wav` (collision/game over sound)
   - `bgm.wav` (background music)
   - You can use the provided Go scripts (`gen_beep.go`, `gen_bgm.go`) to generate simple sounds.
4. **Run the game**
   ```sh
   go run main.go
   ```

---

## 🗂️ Project Structure
```
GoVersion/
  main.go         # Main game code
  hit.wav         # Collision/game over sound
  bgm.wav         # Background music
  gen_beep.go     # Script to generate hit.wav
  gen_bgm.go      # Script to generate bgm.wav
  assets/         # Sprites (My.png, Shot.png, etc.)
```

---

## 📝 Feature Summary Table
| Feature                | Status     |
|------------------------|------------|
| 8-way movement         | ✔️ Complete|
| Sprites/poses          | ✔️ Complete|
| Projectiles            | ✔️ Complete|
| Score/FPS display      | ✔️ Complete|
| Game over detection    | ✔️ Complete|
| Sound effects          | ✔️ Complete|
| Background music       | ✔️ Complete|
| Visual effects (flash) | ✔️ Complete|
| High score             | ❌ Optional|
| Title screen           | ❌ Optional|
| Pause                  | ❌ Optional|
| Mobile/gamepad         | ❌ Optional|

---

## 🚀 Optional Enhancements
- High score tracking
- Title/start screen
- Pause/resume
- Mobile or gamepad support
- More sound effects or music
- Visual polish (explosions, particles, etc.)

---

## 📄 License
MIT License. See [LICENSE](../LICENSE).

---

## 🙏 Credits
- Original VB6 game by Yahaya Yuta
- Go/Ebiten port and enhancements by [Your Name]
- Ebiten game library by Hajime Hoshi 