import type { Word, RSVPState, ReadingStats, FlashReadSettings } from './types';
import { processText, getWordDuration } from './text-processor';
import { DEFAULT_SETTINGS, MIN_WPM, MAX_WPM, WPM_STEP, REWIND_WORDS, FORWARD_WORDS } from './constants';

export type RSVPEventType = 
  | 'word'
  | 'play'
  | 'pause'
  | 'complete'
  | 'progress'
  | 'wpmChange';

export interface RSVPEvent {
  type: RSVPEventType;
  word?: Word;
  index?: number;
  total?: number;
  wpm?: number;
  progress?: number;
}

export type RSVPEventHandler = (event: RSVPEvent) => void;

/**
 * RSVP Engine
 * 
 * Core timing engine for displaying words at the specified WPM.
 * Uses requestAnimationFrame for smooth, accurate timing.
 */
export class RSVPEngine {
  private words: Word[] = [];
  private currentIndex = 0;
  private isPlaying = false;
  private wpm: number;
  private settings: FlashReadSettings;
  
  private startTime: number | null = null;
  private wordsDisplayed = 0;
  private lastWordTime = 0;
  
  private animationFrameId: number | null = null;
  private eventHandlers: Set<RSVPEventHandler> = new Set();
  
  // Auto-ramp state
  private autoRampStartTime: number | null = null;
  private autoRampLastIncrease: number | null = null;
  
  constructor(settings: Partial<FlashReadSettings> = {}) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings };
    this.wpm = this.settings.wpm;
  }
  
  /**
   * Load text into the engine
   */
  loadText(text: string): void {
    this.words = processText(text, this.settings.punctuationPause);
    this.currentIndex = 0;
    this.wordsDisplayed = 0;
    this.startTime = null;
    this.autoRampStartTime = null;
    this.autoRampLastIncrease = null;
    
    // Emit initial word
    if (this.words.length > 0) {
      this.emit({
        type: 'word',
        word: this.words[0],
        index: 0,
        total: this.words.length,
      });
      this.emit({
        type: 'progress',
        progress: 0,
        index: 0,
        total: this.words.length,
      });
    }
  }
  
  /**
   * Start or resume playback
   */
  play(): void {
    if (this.isPlaying || this.words.length === 0) return;
    if (this.currentIndex >= this.words.length) {
      this.currentIndex = 0;
    }
    
    this.isPlaying = true;
    this.lastWordTime = performance.now();
    
    if (this.startTime === null) {
      this.startTime = Date.now();
    }
    
    if (this.settings.autoRamp && this.autoRampStartTime === null) {
      this.autoRampStartTime = performance.now();
      this.autoRampLastIncrease = this.autoRampStartTime;
    }
    
    this.emit({ type: 'play', wpm: this.wpm });
    this.tick();
  }
  
  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.emit({ type: 'pause', wpm: this.wpm });
  }
  
  /**
   * Toggle play/pause
   */
  toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  /**
   * Stop and reset
   */
  stop(): void {
    this.pause();
    this.currentIndex = 0;
    this.wordsDisplayed = 0;
    this.startTime = null;
    this.autoRampStartTime = null;
    this.autoRampLastIncrease = null;
  }
  
  /**
   * Seek to a specific word index
   */
  seekTo(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.words.length - 1));
    
    if (this.words.length > 0) {
      this.emit({
        type: 'word',
        word: this.words[this.currentIndex],
        index: this.currentIndex,
        total: this.words.length,
      });
      this.emit({
        type: 'progress',
        progress: this.currentIndex / this.words.length,
        index: this.currentIndex,
        total: this.words.length,
      });
    }
  }
  
  /**
   * Seek by progress percentage (0-1)
   */
  seekToProgress(progress: number): void {
    const index = Math.floor(progress * this.words.length);
    this.seekTo(index);
  }
  
  /**
   * Rewind by N words
   */
  rewind(count: number = REWIND_WORDS): void {
    this.seekTo(this.currentIndex - count);
  }
  
  /**
   * Fast forward by N words
   */
  forward(count: number = FORWARD_WORDS): void {
    this.seekTo(this.currentIndex + count);
  }
  
  /**
   * Increase WPM
   */
  increaseWpm(amount: number = WPM_STEP): void {
    this.setWpm(this.wpm + amount);
  }
  
  /**
   * Decrease WPM
   */
  decreaseWpm(amount: number = WPM_STEP): void {
    this.setWpm(this.wpm - amount);
  }
  
  /**
   * Set WPM directly
   */
  setWpm(wpm: number): void {
    this.wpm = Math.max(MIN_WPM, Math.min(MAX_WPM, wpm));
    this.emit({ type: 'wpmChange', wpm: this.wpm });
  }
  
  /**
   * Get current WPM
   */
  getWpm(): number {
    return this.wpm;
  }
  
  /**
   * Get current state
   */
  getState(): RSVPState {
    return {
      words: this.words,
      currentIndex: this.currentIndex,
      isPlaying: this.isPlaying,
      wpm: this.wpm,
      startTime: this.startTime,
      wordsDisplayed: this.wordsDisplayed,
    };
  }
  
  /**
   * Get reading statistics
   */
  getStats(): ReadingStats {
    const endTime = Date.now();
    const timeSpentMs = this.startTime ? endTime - this.startTime : 0;
    
    return {
      wordsRead: this.wordsDisplayed,
      averageWpm: timeSpentMs > 0 
        ? Math.round((this.wordsDisplayed / timeSpentMs) * 60000)
        : this.wpm,
      timeSpentMs,
      startWpm: this.settings.wpm,
      endWpm: this.wpm,
    };
  }
  
  /**
   * Subscribe to events
   */
  on(handler: RSVPEventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => this.eventHandlers.delete(handler);
  }
  
  /**
   * Update settings
   */
  updateSettings(settings: Partial<FlashReadSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }
  
  /**
   * Main timing loop
   */
  private tick = (): void => {
    if (!this.isPlaying) return;
    
    const now = performance.now();
    const elapsed = now - this.lastWordTime;
    const currentWord = this.words[this.currentIndex];
    const wordDuration = getWordDuration(currentWord, this.wpm);
    
    // Check for auto-ramp
    if (this.settings.autoRamp && this.autoRampLastIncrease !== null) {
      const timeSinceLastIncrease = now - this.autoRampLastIncrease;
      if (timeSinceLastIncrease >= this.settings.autoRampInterval * 1000) {
        this.wpm = Math.min(MAX_WPM, this.wpm + this.settings.autoRampIncrement);
        this.autoRampLastIncrease = now;
        this.emit({ type: 'wpmChange', wpm: this.wpm });
      }
    }
    
    if (elapsed >= wordDuration) {
      // Move to next word
      this.currentIndex++;
      this.wordsDisplayed++;
      this.lastWordTime = now;
      
      if (this.currentIndex >= this.words.length) {
        // Completed
        this.isPlaying = false;
        this.emit({
          type: 'complete',
          index: this.words.length,
          total: this.words.length,
        });
        return;
      }
      
      // Emit new word
      this.emit({
        type: 'word',
        word: this.words[this.currentIndex],
        index: this.currentIndex,
        total: this.words.length,
      });
      
      // Emit progress
      this.emit({
        type: 'progress',
        progress: this.currentIndex / this.words.length,
        index: this.currentIndex,
        total: this.words.length,
      });
    }
    
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
  
  /**
   * Emit event to all handlers
   */
  private emit(event: RSVPEvent): void {
    for (const handler of this.eventHandlers) {
      handler(event);
    }
  }
}
