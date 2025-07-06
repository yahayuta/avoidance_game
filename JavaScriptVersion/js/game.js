// Avoidance Game - JavaScript Migration from VB6
// Original VB6 game converted to modern JavaScript with HTML5 Canvas

class AvoidanceGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas 2D context not available!');
            return;
        }
        
        // Game dimensions (same as VB6: 32 * 8 = 256)
        this.CRT_WIDTH = 256;
        this.CRT_HEIGHT = 256;
        
        // Game state
        this.gameRunning = false;
        this.endFlag = false;
        this.score = 0;
        this.fps = 0;
        
        // Timing (replacing VB6 timeGetTime)
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        // Player (replacing VB6 MyType)
        this.player = {
            x: (this.CRT_WIDTH - 32) / 2,
            y: (this.CRT_HEIGHT - 32) / 2,
            pose: 0,
            moveSpeed: 4,
            width: 32,
            height: 32
        };
        
        this.X_MAX = this.CRT_WIDTH - 32;
        this.Y_MAX = this.CRT_HEIGHT - 32;
        
        // Projectiles (replacing VB6 ShotType array)
        this.projectiles = Array.from({length: 41}, () => ({
            x: 0, y: 0, moveX: 0, moveY: 0, active: false, width: 10, height: 10
        }));
        this.shotMax = 4;
        this.shotCounter = 0;
        this.shotAddCounter = 0;
        
        // Input handling (replacing VB6 GetAsyncKeyState)
        this.keys = {};
        
        // New for red flash effect
        this.flashTimer = 0;
        
        // Audio
        this.bgm = new Audio('assets/bgm.wav');
        this.bgm.loop = true;
        this.hitSound = new Audio('assets/hit.wav');
        
        console.log('Game constructor called');
        this.loadSprites();
        this.setupInput();
        this.gameLoop();
        console.log('Game setup complete');
    }
    
    loadSprites() {
        console.log('Loading sprites...');
        this.playerSprite = new Image();
        this.playerSprite.onload = () => {
            console.log('Player sprite loaded successfully');
        };
        this.playerSprite.onerror = () => {
            console.log('Player sprite failed to load, using fallback');
        };
        this.playerSprite.src = 'assets/My.png';
        
        this.projectileSprite = new Image();
        this.projectileSprite.onload = () => {
            console.log('Projectile sprite loaded successfully');
        };
        this.projectileSprite.onerror = () => {
            console.log('Projectile sprite failed to load, using fallback');
        };
        this.projectileSprite.src = 'assets/Shot.png';
    }
    
    setupInput() {
        console.log('Setting up input handlers');
        document.addEventListener('keydown', (e) => {
            console.log('Key pressed:', e.code);
            this.keys[e.code] = true;
            if (e.code === 'Space' && !this.gameRunning) {
                console.log('Starting game...');
                this.startGame();
            }
            if (e.code === 'Escape') {
                console.log('Ending game...');
                this.endGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        console.log('Input handlers set up');
    }
    
    // Replace VB6 Stick() function
    getStickDirection() {
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
    
    startGame() {
        console.log('startGame called, current state:', this.gameRunning);
        this.gameRunning = true;
        this.endFlag = false;
        this.score = 0;
        this.shotMax = 4;
        this.shotCounter = 0;
        this.shotAddCounter = 0;
        
        // Reset all projectiles
        for (let i = 0; i < 41; i++) {
            this.projectiles[i].active = false;
        }
        
        this.player.x = (this.CRT_WIDTH - 32) / 2;
        this.player.y = (this.CRT_HEIGHT - 32) / 2;
        this.player.pose = 0;
        
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'none';
        }
        
        this.flashTimer = 0;
        if (this.bgm) {
            this.bgm.currentTime = 0;
            this.bgm.play();
        }
        
        console.log('Game started successfully');
    }
    
    endGame() {
        this.gameRunning = false;
        this.endFlag = true;
        if (this.bgm) {
            this.bgm.pause();
        }
    }
    
    // Replace VB6 MyMove()
    updatePlayer() {
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
    spawnProjectiles() {
        if (this.shotAddCounter >= 100 && this.shotMax < 40) {
            this.shotAddCounter = 0;
            this.shotMax++;
        } else {
            this.shotAddCounter++;
        }
        
        if (this.shotCounter >= 4) {
            this.shotCounter = 0;
            
            // Try to fill all available slots up to shotMax
            for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
                if (!this.projectiles[i].active) {
                    this.createProjectile(i);
                }
            }
        } else {
            this.shotCounter++;
        }
    }
    
    createProjectile(index) {
        // Random spawn side (1-4: top, right, bottom, left)
        const spawnSide = Math.floor(Math.random() * 4) + 1;
        let x, y;
        
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
    updateProjectiles() {
        for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
            if (this.projectiles[i].active) {
                const proj = this.projectiles[i];
                
                // Update position
                proj.x += proj.moveX;
                proj.y += proj.moveY;
                
                // Check collision with player
                if (this.checkCollision(proj)) {
                    this.gameOver();
                    // Play hit sound
                    if (this.hitSound) {
                        this.hitSound.currentTime = 0;
                        this.hitSound.play();
                    }
                    // Red flash for 0.3s (assume 60 FPS)
                    this.flashTimer = 18;
                    return;
                }
                
                // Deactivate if out of bounds
                if (proj.x + proj.width < 0 || proj.x > this.CRT_WIDTH || 
                    proj.y + proj.height < 0 || proj.y > this.CRT_HEIGHT) {
                    proj.active = false;
                }
            }
        }
    }
    
    // Replace VB6 ShotHitJudge()
    checkCollision(projectile) {
        // AABB collision
        return (
            this.player.x < projectile.x + projectile.width &&
            this.player.x + this.player.width > projectile.x &&
            this.player.y < projectile.y + projectile.height &&
            this.player.y + this.player.height > projectile.y
        );
    }
    
    gameOver() {
        this.endFlag = true;
        this.gameRunning = false;
        
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'block';
        }
        
        // Flash screen red (replacing VB6 BackColor = &HFF)
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT);
    }
    
    // Replace VB6 MyShow() and ShotShow()
    render() {
        // Red flash effect
        if (this.flashTimer > 0) {
            this.ctx.fillStyle = 'rgb(255,0,0)';
            this.ctx.fillRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT);
            this.flashTimer--;
        } else {
            // Clear canvas (replacing VB6 Cls)
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(0, 0, this.CRT_WIDTH, this.CRT_HEIGHT);
        }
        
        // Draw player (replacing BitBlt)
        this.drawPlayer();
        
        // Draw projectiles (replacing BitBlt)
        this.drawProjectiles();
    }
    
    drawPlayer() {
        // Use sprite if loaded, otherwise fallback to rectangle
        if (this.playerSprite && this.playerSprite.complete) {
            // Draw the specific pose frame (8 directions, 32x32 each)
            const spriteX = this.player.pose * 32;
            this.ctx.drawImage(this.playerSprite, spriteX, 0, 32, 32, this.player.x, this.player.y, this.player.width, this.player.height);
        } else {
            // Fallback to colored rectangle
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
            
            // Draw direction indicator
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(this.player.x + 14, this.player.y + 14, 4, 4);
        }
    }
    
    drawProjectiles() {
        if (this.projectileSprite && this.projectileSprite.complete) {
            for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
                if (this.projectiles[i].active) {
                    const proj = this.projectiles[i];
                    this.ctx.drawImage(this.projectileSprite, proj.x, proj.y, proj.width, proj.height);
                }
            }
        } else {
            // Fallback to colored rectangles
            this.ctx.fillStyle = '#ff0000';
            for (let i = 0; i < this.shotMax && i < this.projectiles.length; i++) {
                if (this.projectiles[i].active) {
                    const proj = this.projectiles[i];
                    this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
                }
            }
        }
    }
    
    // Replace VB6 ScoreShow()
    updateUI() {
        // Update FPS
        const now = performance.now();
        this.frameCount++;
        
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
        
        // Update score
        if (this.gameRunning) {
            this.score++;
        }
        
        // Update UI elements
        const fpsElement = document.getElementById('fps');
        const scoreElement = document.getElementById('score');
        
        if (fpsElement) {
            fpsElement.textContent = this.fps.toString().padStart(3, '0');
        }
        if (scoreElement) {
            scoreElement.textContent = this.score.toString().padStart(6, '0');
        }
    }
    
    // Main game loop (replacing VB6 MainRoutine)
    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        
        // Target 30 FPS (same as VB6 CycleTime = 30)
        const targetFrameTime = 1000 / 30;
        
        if (deltaTime >= targetFrameTime) {
            this.lastFrameTime = currentTime;
            
            if (this.gameRunning) {
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
    console.log('Game initializing...');
    new AvoidanceGame();
    console.log('Game initialized, press SPACE to start');
}); 