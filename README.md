# 🎮 Avoidance Game

A modern JavaScript/TypeScript migration of the classic Visual Basic 6.0 avoidance game, featuring authentic gameplay and original graphics.

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Styling-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
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

### Adding Sound Effects

```javascript
// Create audio context
const audioContext = new AudioContext();

// Play sound effect
function playSound(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}
```

## 🐛 Bug Reports

If you encounter any issues, please check:

1. **Browser Console**: Open developer tools (F12) and check for errors
2. **Canvas Support**: Ensure your browser supports HTML5 Canvas
3. **JavaScript Enabled**: Make sure JavaScript is enabled in your browser
4. **File Permissions**: Ensure all game files are accessible

## 📈 Future Enhancements

- [ ] **Mobile Support**: Touch controls for mobile devices
- [ ] **Online Leaderboards**: Save scores to cloud
- [ ] **Power-ups**: Special abilities and items
- [ ] **Multiple Levels**: Different difficulty modes
- [ ] **Sound Effects**: Audio feedback for actions
- [ ] **Particle Effects**: Visual enhancements
- [ ] **Progressive Web App**: Offline support
- [ ] **Multiplayer**: Real-time multiplayer gameplay
- [ ] **Performance Monitoring**: Real-time performance metrics
- [ ] **Accessibility**: Screen reader support and keyboard navigation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Quality Standards

- **Error Handling**: All new code must include proper error handling
- **Type Safety**: TypeScript version should maintain strict type checking
- **Bounds Checking**: Array access must include bounds validation
- **Performance**: New features should not impact frame rate
- **Testing**: Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original VB6 Game**: Created by the original developer
- **HTML5 Canvas**: For modern web graphics
- **JavaScript Community**: For excellent documentation and tools

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the browser console for error messages
2. **Review** the [Issues](../../issues) page
3. **Create** a new issue with detailed information

---

**Enjoy the game!** 🎮

*Built with ❤️ using modern web technologies* 