# 🎮 Avoidance Game

A modern JavaScript/TypeScript and Go/Ebiten migration of the classic Visual Basic 6.0 avoidance game, featuring authentic gameplay and original graphics.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Go](https://img.shields.io/badge/Go-1.22+-blue.svg)](https://go.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📖 About

This project migrates a classic VB6 arcade-style avoidance game to modern web technologies. Players control a character and dodge incoming projectiles while the difficulty increases over time.

### ✨ Features

- **🎯 Authentic Gameplay**: Preserves original VB6 mechanics and feel
- **🎨 Original Graphics**: Uses converted original BMP sprites
- **⌨️ 8-Directional Controls**: Smooth movement with arrow keys
- **📈 Progressive Difficulty**: Increasing projectile count over time
- **📊 Real-time Stats**: FPS counter and score tracking
- **🌐 Cross-platform**: Runs in any modern browser
- **📱 Responsive**: Works on desktop and mobile devices
- **🛡️ Error-Resistant**: Robust error handling and bounds checking
- **🔒 Type-Safe**: TypeScript version with full type safety

## 🚨 Recent Critical Fixes

### ✅ Fixed Issues (Latest Update)

- **Division by Zero Error**: Fixed potential `NaN` values in projectile movement calculations
- **Array Bounds Checking**: Added proper bounds checking for all array accesses
- **Canvas Initialization**: Added null checks for canvas and context availability
- **Collision Detection**: Fixed incorrect collision detection in TypeScript version
- **Type Safety**: Improved TypeScript type definitions and error handling

### 🛡️ Error Prevention

The game now includes robust error handling:
- **Null Checks**: All DOM element access is validated
- **Bounds Checking**: Array access is protected against out-of-bounds errors
- **Division Safety**: Mathematical operations are protected against division by zero
- **Graceful Degradation**: Fallback rendering when sprites fail to load

## 🟢 Go/Ebiten Version (Native Desktop)

A faithful Go/Ebiten port with full feature parity:
- 8-directional movement, sprite poses, projectiles
- Score/FPS display, game over detection
- Sound effects (`hit.wav`), background music (`bgm.wav`)
- Red flash visual effect on game over
- Keyboard controls (arrows, SPACE, ESC)

See [GoVersion/README.md](GoVersion/README.md) for full details and build instructions.

### Quickstart (Go/Ebiten)
```sh
cd GoVersion
# (Optional: generate sound files)
go run gen_beep.go
go run gen_bgm.go
# Run the game
go run main.go
```

## 📝 Feature Comparison Table
| Feature                | VB6 | JS/TS | Go/Ebiten |
|------------------------|:---:|:-----:|:---------:|
| 8-way movement         | ✔️  | ✔️    | ✔️        |
| Sprites/poses          | ✔️  | ✔️    | ✔️        |
| Projectiles            | ✔️  | ✔️    | ✔️        |
| Score/FPS display      | ✔️  | ✔️    | ✔️        |
| Game over detection    | ✔️  | ✔️    | ✔️        |
| Sound effects          | ✔️  | ❌    | ✔️        |
| Background music       | ✔️  | ❌    | ✔️        |
| Visual effects (flash) | ✔️  | ✔️    | ✔️        |
| High score             | ❓  | ❌    | ❌        |
| Title screen           | ❓  | ❌    | ❌        |
| Pause                  | ❓  | ❌    | ❌        |
| Mobile/gamepad         | ❌  | ❌    | ❌        |

## 🚀 Quick Start

### Option 1: Direct Play
1. Open `index.html` in any modern web browser
2. Press **SPACE** to start the game
3. Use **ARROW KEYS** to move and dodge projectiles
4. Press **ESC** to exit

### Option 2: Development Server
```bash
# Install dependencies
npm install

# Start development server
npm start

# Or use live reload
npm run dev
```

## 🎮 Controls

| Key | Action |
|-----|--------|
| `SPACE` | Start game |
| `↑` | Move up |
| `↓` | Move down |
| `←` | Move left |
| `→` | Move right |
| `ESC` | Exit game |

## 📁 Project Structure

```
JavaScriptVersion/
├── index.html              # Main HTML file
├── js/
│   └── game.js            # Core game logic (439 lines)
├── src/
│   └── game.ts            # TypeScript version (421 lines)
├── assets/
│   ├── My.png             # Player sprite sheet
│   ├── Shot.png           # Projectile sprite
│   ├── player.png         # Alternative player sprite
│   └── projectile.png     # Alternative projectile sprite
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # This file
```

## 🔄 Migration Details

### VB6 → JavaScript Mapping

| VB6 Component | JavaScript Equivalent | Improvement |
|---------------|----------------------|-------------|
| `GetAsyncKeyState()` | `addEventListener()` | Modern event handling |
| `BitBlt()` | Canvas 2D Context | Hardware acceleration |
| `timeGetTime()` | `performance.now()` | Higher precision |
| `Do/Loop` | `requestAnimationFrame()` | Smooth 60fps potential |
| `MyType` | `Player` interface | Better encapsulation |
| `ShotType` | `Projectile` interface | Type safety |
| `mciSendString()` | Web Audio API | Cross-platform audio |

### Key Improvements

- **Modern Architecture**: Class-based design with proper separation
- **Type Safety**: TypeScript version prevents runtime errors
- **Performance**: Optimized rendering and memory management
- **Maintainability**: Clean, modular code structure
- **Accessibility**: Works across all modern browsers
- **Error Resilience**: Comprehensive error handling and validation

## 🛠️ Development

### Prerequisites

- Node.js (for development tools)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd JavaScriptVersion

# Install dependencies
npm install

# Start development server
npm start

# Build TypeScript version
npm run build
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run dev` | Start with live reload |
| `npm run build` | Compile TypeScript |
| `npm run watch` | Watch for changes |

## 🔧 Technical Details

### Performance Optimizations

- **Frame Rate Limiting**: Target 30 FPS for consistent gameplay
- **Efficient Rendering**: Optimized canvas operations
- **Memory Management**: Proper cleanup of inactive projectiles
- **Asset Preloading**: Sprites loaded before game start
- **Bounds Checking**: Protected array access prevents crashes

### Error Handling

- **Canvas Validation**: Checks for canvas and context availability
- **Sprite Fallbacks**: Graceful degradation when sprites fail to load
- **Mathematical Safety**: Protected against division by zero
- **Array Protection**: Bounds checking for all array operations
- **Type Validation**: TypeScript version with strict type checking

### Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Recommended |
| Firefox | ✅ Full | Excellent performance |
| Safari | ✅ Full | Good compatibility |
| Edge | ✅ Full | Modern Edge versions |

## 🎨 Customization

### Adding Custom Sprites

Replace the sprite files in `assets/`:

```javascript
// Load custom sprite
const customSprite = new Image();
customSprite.src = 'assets/custom-sprite.png';
this.ctx.drawImage(customSprite, x, y, width, height);
```