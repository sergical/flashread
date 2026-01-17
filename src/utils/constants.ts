import type { FlashReadSettings } from '../types';

// Default settings
export const DEFAULT_SETTINGS: FlashReadSettings = {
  wpm: 300,
  fontSize: 72,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  theme: 'dark',
  showGuideLines: true,
  showProgressBar: true,
  showWpmCounter: true,
  autoRamp: false,
  autoRampInterval: 30, // 30 seconds
  autoRampIncrement: 50, // +50 WPM
  punctuationPause: true,
};

// WPM constraints
export const MIN_WPM = 100;
export const MAX_WPM = 1200;
export const WPM_STEP = 50;

// Timing
export const REWIND_WORDS = 10;
export const FORWARD_WORDS = 10;

// Punctuation pause multipliers
export const PAUSE_MULTIPLIERS: Record<string, number> = {
  '.': 2.5,
  '!': 2.5,
  '?': 2.5,
  ',': 1.7,
  ':': 1.7,
  ';': 1.7,
  '—': 1.5,
  '–': 1.5,
  '\n': 4.0, // Paragraph break
};

// Colors
export const COLORS = {
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    pivot: '#FF0000',
    guideLine: '#333333',
    progressBar: '#FFFFFF',
    progressBarBg: '#222222',
    controlsBg: 'rgba(30, 30, 30, 0.9)',
    controlsText: '#FFFFFF',
  },
  light: {
    background: '#FFFFFF',
    text: '#000000',
    pivot: '#FF0000',
    guideLine: '#CCCCCC',
    progressBar: '#000000',
    progressBarBg: '#DDDDDD',
    controlsBg: 'rgba(240, 240, 240, 0.9)',
    controlsText: '#000000',
  },
};

// Demo text - explains RSVP speed reading
export const DEMO_TEXT = `Welcome to FlashRead, your personal speed reading trainer.

This technology is called RSVP, which stands for Rapid Serial Visual Presentation. It works by showing you one word at a time, exactly where your eyes are already looking.

Traditional reading is slow because your eyes must jump from word to word, a movement called a saccade. Each jump takes time and mental effort. By eliminating these eye movements, RSVP allows your brain to process words much faster.

Notice the red letter in each word. This is the Optimal Recognition Point, or ORP. Research shows that your brain recognizes words fastest when focused on this specific position. The word shifts left or right so this red letter always stays centered on your screen.

Most people read around 200 to 250 words per minute. With practice, RSVP readers commonly reach 500 to 700 words per minute while maintaining good comprehension. Some experienced users report speeds of 900 words per minute or higher.

Start at a comfortable pace, perhaps 300 words per minute. As your brain adapts, gradually increase the speed. The auto-ramp feature can help by automatically increasing speed every 30 seconds.

The key to success is consistent practice. Just 15 to 20 minutes per day can dramatically improve your reading speed within a few weeks. Your brain will learn to process information more efficiently, and you'll find that you can read faster even without this tool.

Use the keyboard shortcuts to control playback. Press Space to pause or resume. Use the arrow keys to adjust speed or skip words. Press Escape to exit at any time.

Happy speed reading! You are now on your way to consuming information faster than ever before.`;
