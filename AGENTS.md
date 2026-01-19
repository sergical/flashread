# AGENTS.md - FlashRead Chrome Extension

Guidelines for AI coding agents working in this repository.

## Project Overview

FlashRead is an RSVP (Rapid Serial Visual Presentation) speed reader Chrome Extension built with TypeScript and Vite. It displays text one word at a time at customizable speeds (100-1200 WPM) using Chrome Extension Manifest V3.

## Build Commands

```bash
npm run dev      # Development build with watch mode
npm run build    # Production build
npm run preview  # Preview built extension
```

## Testing

No test framework is currently configured. To manually test:

```bash
node test-full.mjs  # Test Readability extraction
```

To test the extension:
1. Run `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder

## Project Structure

```
src/
├── background/          # Service worker
│   └── service-worker.ts
├── content/             # Content scripts injected into pages
│   ├── content.ts       # Message handling, article extraction
│   └── overlay.ts       # RSVP reader overlay UI
├── lib/                 # Core libraries
│   ├── orp.ts           # Optimal Recognition Point algorithm
│   ├── rsvp-engine.ts   # RSVP timing engine class
│   ├── storage.ts       # Chrome storage wrapper
│   └── text-processor.ts # Text tokenization
├── options/             # Options page (HTML/CSS/TS)
├── popup/               # Extension popup (HTML/CSS/TS)
├── types/               # TypeScript type definitions
│   └── index.ts
└── utils/               # Constants and utilities
    └── constants.ts
public/
├── manifest.json        # Chrome Extension Manifest V3
└── icons/               # Extension icons
```

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2020
- Strict mode enabled (`strict: true`)
- No unused locals (`noUnusedLocals: true`)
- No unused parameters (`noUnusedParameters: true`)
- No fallthrough in switch cases (`noFallthroughCasesInSwitch: true`)
- Module resolution: bundler
- Types: `["chrome"]`

### Import Style

Use `import type` for type-only imports:

```typescript
// Correct
import type { FlashReadSettings, ReadingSession } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

// Incorrect
import { FlashReadSettings, ReadingSession } from '../types';
```

### Naming Conventions

- **Functions/variables**: camelCase (`loadSettings`, `currentIndex`)
- **Types/interfaces/classes**: PascalCase (`FlashReadSettings`, `RSVPEngine`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_SETTINGS`, `MAX_WPM`)
- **Private class members**: camelCase with no prefix (`this.words`, not `this._words`)

### Type Definitions

Define all types in `src/types/index.ts`:

```typescript
export interface FlashReadSettings {
  wpm: number;
  fontSize: number;
  fontFamily: 'serif' | 'sans' | 'mono';
  theme: 'dark' | 'light';
}

export type MessageType = 
  | 'START_READING'
  | 'STOP_READING'
  | 'GET_SELECTION';
```

### Function Documentation

Use JSDoc comments for exported functions:

```typescript
/**
 * Load settings from Chrome storage
 */
export async function loadSettings(): Promise<FlashReadSettings> {
  // ...
}
```

### Class Architecture

Use classes for complex stateful components:

```typescript
export class RSVPEngine {
  private words: Word[] = [];
  private isPlaying = false;
  private eventHandlers: Set<RSVPEventHandler> = new Set();
  
  /**
   * Subscribe to events
   */
  on(handler: RSVPEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }
}
```

### Async Patterns

Wrap Chrome APIs with Promises:

```typescript
export async function loadSettings(): Promise<FlashReadSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([SETTINGS_KEY], (result) => {
      resolve(result[SETTINGS_KEY] || DEFAULT_SETTINGS);
    });
  });
}
```

### Error Handling

Use try-catch for external operations, log with prefix:

```typescript
try {
  const reader = new Readability(documentClone);
  const article = reader.parse();
} catch (error) {
  console.error('FlashRead: Error extracting article:', error);
  return null;
}
```

### Event Handling

Use typed event systems with unsubscribe pattern:

```typescript
export type RSVPEventHandler = (event: RSVPEvent) => void;

// Subscribe returns unsubscribe function
const unsubscribe = engine.on((event) => {
  if (event.type === 'word') { /* handle */ }
});
```

### Chrome Extension Patterns

- Use Manifest V3 with service workers (not background pages)
- Message passing between background, content, and popup scripts
- Settings in `chrome.storage.sync`, session data in `chrome.storage.local`
- Return `true` from message listeners for async responses

```typescript
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  switch (message.type) {
    case 'START_READING': {
      handleStartReading();
      sendResponse({ success: true });
      break;
    }
  }
  return true; // Keep channel open for async
});
```

### UI Patterns

- Use Shadow DOM for style isolation in overlays
- Use `requestAnimationFrame` for smooth timing/animations
- Support keyboard shortcuts for accessibility

### Constants

Define related constants together in `src/utils/constants.ts`:

```typescript
export const MIN_WPM = 100;
export const MAX_WPM = 1200;
export const WPM_STEP = 50;

export const PAUSE_MULTIPLIERS: Record<string, number> = {
  '.': 2.5,
  ',': 1.7,
};
```

## Dependencies

- `@mozilla/readability` - Article content extraction
- `@types/chrome` - Chrome extension type definitions
- `typescript` - TypeScript compiler
- `vite` + `vite-plugin-web-extension` - Build tooling
- `jsdom` - DOM testing utility
