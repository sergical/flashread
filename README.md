# FlashRead - RSVP Speed Reader

A Chrome extension that lets you speed read at 500-900+ WPM using RSVP (Rapid Serial Visual Presentation). Words are displayed one at a time, centered on the optimal recognition point (ORP) for maximum reading efficiency.

## Features

- **RSVP Reading**: Display text one word at a time at customizable speeds (100-1200 WPM)
- **ORP Highlighting**: Red pivot letter stays fixed at screen center for optimal eye focus
- **Smart Pauses**: Automatic pauses at sentence endings and punctuation
- **Page Extraction**: Automatically extract article content from any webpage
- **Custom Text**: Paste any text to speed read
- **Keyboard Controls**: Space (play/pause), arrows (seek), up/down (speed)
- **Progress Tracking**: Visual progress bar and WPM counter

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/flashread.git
   cd flashread
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist/` folder

### From Chrome Web Store

Coming soon!

## Usage

1. **Read a webpage**: Click the FlashRead icon → "Read This Page"
2. **Read selected text**: Select text on any page → Right-click → "Speed Read with FlashRead"
3. **Read custom text**: Click the FlashRead icon → Paste text → Click play
4. **Keyboard shortcut**: `Alt+Shift+R` (Option+Shift+R on Mac)

### Reader Controls

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` | Rewind 10 words |
| `→` | Forward 10 words |
| `↑` | Speed up (+50 WPM) |
| `↓` | Slow down (-50 WPM) |
| `Esc` | Exit reader |

## Development

```bash
# Watch mode (auto-rebuild on changes)
npm run dev

# Production build
npm run build
```

## Tech Stack

- TypeScript
- Vite + vite-plugin-web-extension
- Chrome Extension Manifest V3
- @mozilla/readability (for article extraction)

## License

MIT
