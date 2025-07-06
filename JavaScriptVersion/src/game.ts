// Avoidance Game - TypeScript Migration from VB6
// Original VB6 game converted to modern TypeScript with HTML5 Canvas

interface Player {
    x: number;
    y: number;
    pose: number;
    moveSpeed: number;
    width: number;
    height: number;
}

interface Projectile {
    x: number;
    y: number;
    moveX: number;
    moveY: number;
    active: boolean;
    width: number;
    height: number;
}

interface GameState {
    gameRunning: boolean;
    endFlag: boolean;
    score: number;
    fps: number;
}

class AvoidanceGame {
    private canvas: HTMLCanvasElement;
    private ctx!: CanvasRenderingContext2D;
    
    // Game dimensions (same as VB6: 32 * 8 = 256)
    private readonly CRT_WIDTH = 256;
    private readonly CRT_HEIGHT = 256;
    
    // Game state
    private gameState: GameState = {
        gameRunning: false,
        endFlag: false,
        score: 0,
        fps: 0
    };
    
    // Timing (replacing VB6 timeGetTime)
    private lastFrameTime = 0;
    private frameCount = 0;
    private lastFpsUpdate = 0;
    
    // Player (replacing VB6 MyType)
    private player: Player = {
        x: (this.CRT_WIDTH - 32) / 2,
        y: (this.CRT_HEIGHT - 32) / 2,
        pose: 0,
        moveSpeed: 4,
        width: 32,
        height: 32
    };
    
    private readonly X_MAX = this.CRT_WIDTH - 32;
    private readonly Y_MAX = this.CRT_HEIGHT - 32;
    
    // Projectiles (replacing VB6 ShotType array)
    private projectiles: Projectile[] = [];
    private shotMax = 4;
    private shotCounter = 0;
    private shotAddCounter = 0;
    
    // Input handling (replacing VB6 GetAsyncKeyState)
    private keys: { [key: string]: boolean } = {};
    
    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            console.error('Canvas 2D context not available!');
            return;
        }
        
        this.setupInput();
        this.gameLoop();
    }
    
    private setupInput(): void {
        // Replace VB6 GetAsyncKeyState with modern event listeners
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys[e.code] = true;
            
            // Start game with SPACE
            if (e.code === 'Space' && !this.gameState.gameRunning) {
                this.startGame();
            }
            
            // Exit with ESC
            if (e.code === 'Escape') {
                this.endGame();
            }
        });
        
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys[e.code] = false;
        });
    }
    
    // Replace VB6 Stick() function
    private getStickDirection(): number {
        let direction = 0;
        
        if (this.keys['ArrowUp']) direction = 1;
        if (this.keys['ArrowRight']) direction = 3;
        if (this.keys['ArrowDown']) direction = 5;
        if (this.keys['ArrowLeft']) direction = 7;
        
        // Diagonal combinations
        if (this.keys['ArrowUp'] && this.keys['ArrowRight']) direction = 2;
        if (this.keys['ArrowUp'] && this.keys['ArrowLeft']) direction = 8;
        if (this.keys['ArrowDown'] && this.keys['ArrowRight']) direction = 4;
        if (this.keys['ArrowDown'] && this.keys['ArrowLeft']) direction = 6;
        
        return direction;
    }
    
    private startGame(): void {
        this.gameState.gameRunning = true;
        this.gameState.endFlag = false;
        this.gameState.score = 0;
        this.shotMax = 4;
        this.projectiles = [];
        
        // Reset player position
        this.player.x = (this.CRT_WIDTH - 32) / 2;
        this.player.y = (this.CRT_HEIGHT - 32) / 2;
        this.player.pose = 0;
        
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'none';
        }
    }
    
    private endGame(): void {
        this.gameState.gameRunning = false;
        this.gameState.endFlag = true;
    }
    
    // Replace VB6 MyMove()
    private updatePlayer(): void {
        const direction = this.getStickDirection();
        
        switch (direction) {
            case 1: // Up
                this.player.pose = 0;
                this.player.y -= this.player.moveSpeed;
                if (this.player.y <= 0) this.player.y = 0;
                break;
                
            case 2: // Up-Right
                this.player.pose = 1;
                this.player.x += this.player.moveSpeed;
                this.player.y -= this.player.moveSpeed;
                if (this.player.x >= this.X_MAX) this.player.x = this.X_MAX;
                if (this.player.y <= 0) this.player.y = 0;
                break;
                
            case 3: // Right
                this.player.pose = 2;
                this.player.x += this.player.moveSpeed;
                if (this.player.x >= this.X_MAX) this.player.x = this.X_MAX;
                break;
                
            case 4: // Down-Right
                this.player.pose = 3;
                this.player.x += this.player.moveSpeed;
                this.player.y += this.player.moveSpeed;
                if (this.player.x >= this.X_MAX) this.player.x = this.X_MAX;
                if (this.player.y >= this.Y_MAX) this.player.y = this.Y_MAX;
                break;
                
            case 5: // Down
                this.player.pose = 4;
                this.player.y += this.player.moveSpeed;
                if (this.player.y >= this.Y_MAX) this.player.y = this.Y_MAX;
                break;
                
            case 6: // Down-Left
                this.player.pose = 5;
                this.player.x -= this.player.moveSpeed;
                this.player.y += this.player.moveSpeed;
                if (this.player.x <= 0) this.player.x = 0;
                if (this.player.y >= this.Y_MAX) this.player.y = this.Y_MAX;
                break;
                
            case 7: // Left
                this.player.pose = 6;
                this.player.x -= this.player.moveSpeed;
                if (this.player.x <= 0) this.player.x = 0;
                break;
                
            case 8: // Up-Left
                this.player.pose = 7;
                this.player.x -= this.player.moveSpeed;
                this.player.y -= this.player.moveSpeed;
                if (this.player.x <= 0) this.player.x = 0;
                if (this.player.y <= 0) this.player.y = 0;
                break;
        }
    }
    
    // Replace VB6 ShotHappen()
    private spawnProjectiles(): void {
        // Increase max projectiles over time
        if (this.shotAddCounter >= 100 && this.shotMax < 40) {
            this.shotAddCounter = 0;
            this.shotMax++;
        } else {
            this.shotAddCounter++;
        }
        
        // Spawn projectiles every 4 frames
        if (this.shotCounter >= 4) {
            this.shotCounter = 0;
            
            // Find inactive projectile slot
            for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
                if (!this.projectiles[i] || !this.projectiles[i].active) {
                    this.createProjectile(i);
                    break;
                }
            }
        } else {
            this.shotCounter++;
        }
    }
    
    private createProjectile(index: number): void {
        // Random spawn side (1-4: top, right, bottom, left)
        const spawnSide = Math.floor(Math.random() * 4) + 1;
        let x: number, y: number;
        
        switch (spawnSide) {
            case 1: // Top
                x = 1;
                y = Math.random() * (this.CRT_HEIGHT - 10) + 10;
                break;
            case 2: // Right
                x = this.CRT_WIDTH - 10;
                y = Math.random() * (this.CRT_HEIGHT - 10) + 10;
                break;
            case 3: // Bottom
                x = Math.random() * (this.CRT_WIDTH - 10) + 10;
                y = this.CRT_HEIGHT - 10;
                break;
            case 4: // Left
                x = Math.random() * (this.CRT_WIDTH - 10) + 10;
                y = 1;
                break;
            default:
                x = 0;
                y = 0;
        }
        
        // Calculate direction towards player with randomization
        const targetX = this.player.x + 16 + (Math.random() * 64 - 32);
        const targetY = this.player.y + 16 + (Math.random() * 64 - 32);
        
        const moveX = targetX - x;
        const moveY = targetY - y;
        const distance = Math.sqrt(moveX * moveX + moveY * moveY);
        
        const speed = Math.floor(Math.random() * 2) + 1;
        
        // Fix division by zero error
        const normalizedMoveX = distance > 0 ? moveX / distance : 0;
        const normalizedMoveY = distance > 0 ? moveY / distance : 0;
        
        this.projectiles[index] = {
            x: x,
            y: y,
            moveX: speed * normalizedMoveX,
            moveY: speed * normalizedMoveY,
            active: true,
            width: 10,
            height: 10
        };
    }
    
    // Replace VB6 ShotMove()
    private updateProjectiles(): void {
        for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
            if (this.projectiles[i] && this.projectiles[i].active) {
                const proj = this.projectiles[i];
                
                // Update position
                proj.x += proj.moveX;
                proj.y += proj.moveY;
                
                // Check collision with player
                if (this.checkCollision(proj)) {
                    this.gameOver();
                    return;
                }
                
                // Deactivate if out of bounds
                if (proj.x < 0 || proj.x > this.CRT_WIDTH || 
                    proj.y < 0 || proj.y > this.CRT_HEIGHT) {
                    proj.active = false;
                }
            }
        }
    }
    
    // Replace VB6 ShotHitJudge()
    private checkCollision(projectile: Projectile): boolean {
        // AABB collision detection
        return (
            this.player.x < projectile.x + projectile.width &&
            this.player.x + this.player.width > projectile.x &&
            this.player.y < projectile.y + projectile.height &&
            this.player.y + this.player.height > projectile.y
        );
    }
    
    private gameOver(): void {
        this.gameState.endFlag = true;
        this.gameState.gameRunning = false;
        
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'block';
        }
        
        // Flash screen red (replacing VB6 BackColor = &HFF)
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT);
    }
    
    // Replace VB6 MyShow() and ShotShow()
    private render(): void {
        // Clear canvas (replacing VB6 Cls)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT);
        
        // Draw player (replacing BitBlt)
        this.drawPlayer();
        
        // Draw projectiles (replacing BitBlt)
        this.drawProjectiles();
    }
    
    private drawPlayer(): void {
        // Simple rectangle for player (can be replaced with sprite)
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw direction indicator
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x + 14, this.player.y + 14, 4, 4);
    }
    
    private drawProjectiles(): void {
        this.ctx.fillStyle = '#ff0000';
        
        for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
            if (this.projectiles[i] && this.projectiles[i].active) {
                const proj = this.projectiles[i];
                this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
            }
        }
    }
    
    // Replace VB6 ScoreShow()
    private updateUI(): void {
        // Update FPS
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastFpsUpdate >= 1000) {
            this.gameState.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
        
        // Update score
        if (this.gameState.gameRunning) {
            this.gameState.score++;
        }
        
        // Update UI elements
        const fpsElement = document.getElementById('fps');
        const scoreElement = document.getElementById('score');
        
        if (fpsElement) {
            fpsElement.textContent = this.gameState.fps.toString().padStart(3, '0');
        }
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score.toString().padStart(6, '0');
        }
    }
    
    // Main game loop (replacing VB6 MainRoutine)
    private gameLoop(): void {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        
        // Target 30 FPS (same as VB6 CycleTime = 30)
        const targetFrameTime = 1000 / 30;
        
        if (deltaTime >= targetFrameTime) {
            this.lastFrameTime = currentTime;
            
            if (this.gameState.gameRunning) {
                // Update game logic
                this.spawnProjectiles();
                this.updateProjectiles();
                this.updatePlayer();
            }
            
            // Always render and update UI
            this.render();
            this.updateUI();
        }
        
        // Continue game loop (replacing VB6 Do/Loop)
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new AvoidanceGame();
}); 