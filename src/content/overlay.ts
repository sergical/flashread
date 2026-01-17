import type { Word, FlashReadSettings, ReadingStats } from '../types';
import { RSVPEngine, type RSVPEvent } from '../lib/rsvp-engine';
import { splitWordAtORP } from '../lib/orp';
import { loadSettings } from '../lib/storage';
import { MIN_WPM, MAX_WPM, DEMO_TEXT } from '../utils/constants';
import { formatDuration } from '../lib/text-processor';

/**
 * FlashRead Overlay
 * 
 * Creates a full-screen reading overlay using Shadow DOM for style isolation.
 * The key feature: the red pivot letter is ALWAYS at the exact center of the screen.
 */
export class FlashReadOverlay {
  private shadowHost: HTMLElement | null = null;
  private shadowRoot: ShadowRoot | null = null;
  private engine: RSVPEngine | null = null;
  private settings: FlashReadSettings | null = null;
  private isVisible = false;
  private controlsTimeout: number | null = null;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private charWidth: number = 0; // Measured character width for offset calculation
  
  // DOM elements
  private overlay: HTMLElement | null = null;
  private wordContainer: HTMLElement | null = null;
  private wordBefore: HTMLElement | null = null;
  private wordPivot: HTMLElement | null = null;
  private wordAfter: HTMLElement | null = null;
  private progressBar: HTMLElement | null = null;
  private progressFill: HTMLElement | null = null;
  private wpmDisplay: HTMLElement | null = null;
  private controls: HTMLElement | null = null;
  private playPauseBtn: HTMLElement | null = null;
  private wpmSlider: HTMLInputElement | null = null;
  private wpmValue: HTMLElement | null = null;
  
  /**
   * Show the overlay and start reading
   */
  async show(text?: string): Promise<void> {
    if (this.isVisible) {
      this.hide();
    }
    
    // Load settings
    this.settings = await loadSettings();
    
    // Create engine
    this.engine = new RSVPEngine(this.settings);
    
    // Create DOM
    this.createOverlay();
    
    // Setup event listeners
    this.setupEngineEvents();
    this.setupKeyboardControls();
    this.setupMouseControls();
    
    // Load text
    const textToRead = text || DEMO_TEXT;
    this.engine.loadText(textToRead);
    
    this.isVisible = true;
    
    // Auto-start after a brief delay
    setTimeout(() => {
      this.engine?.play();
    }, 500);
  }
  
  /**
   * Hide the overlay and stop reading
   */
  hide(): void {
    if (!this.isVisible) return;
    
    // Get stats before cleanup
    const stats = this.engine?.getStats();
    
    // Stop engine
    this.engine?.stop();
    this.engine = null;
    
    // Remove keyboard handler
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    
    // Remove DOM
    if (this.shadowHost) {
      this.shadowHost.remove();
      this.shadowHost = null;
      this.shadowRoot = null;
    }
    
    // Clear references
    this.overlay = null;
    this.wordContainer = null;
    this.wordBefore = null;
    this.wordPivot = null;
    this.wordAfter = null;
    this.progressBar = null;
    this.progressFill = null;
    this.wpmDisplay = null;
    this.controls = null;
    this.playPauseBtn = null;
    this.wpmSlider = null;
    this.wpmValue = null;
    this.charWidth = 0;
    
    this.isVisible = false;
    
    // Show stats if reading was completed or significant
    if (stats && stats.wordsRead > 10) {
      this.showStatsModal(stats);
    }
  }
  
  /**
   * Check if overlay is currently visible
   */
  getIsVisible(): boolean {
    return this.isVisible;
  }
  
  /**
   * Create the overlay DOM structure
   */
  private createOverlay(): void {
    const theme = this.settings?.theme || 'dark';
    const isDark = theme === 'dark';
    const fontSize = this.settings?.fontSize || 72;
    
    // Color palette
    const colors = isDark ? {
      bg: '#000000',
      text: '#ffffff',
      pivot: '#ef4444',
      muted: '#404040',
      subtle: '#1a1a1a',
      accent: '#ef4444',
      controlBg: 'rgba(20, 20, 20, 0.95)',
      controlBorder: 'rgba(255, 255, 255, 0.08)',
    } : {
      bg: '#fafafa',
      text: '#0a0a0a',
      pivot: '#dc2626',
      muted: '#a0a0a0',
      subtle: '#e5e5e5',
      accent: '#dc2626',
      controlBg: 'rgba(255, 255, 255, 0.95)',
      controlBorder: 'rgba(0, 0, 0, 0.08)',
    };
    
    // Create shadow host
    this.shadowHost = document.createElement('div');
    this.shadowHost.id = 'flashread-overlay-host';
    this.shadowHost.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
    `;
    
    // Attach shadow DOM
    this.shadowRoot = this.shadowHost.attachShadow({ mode: 'closed' });
    
    // Inject Google Font
    const fontLink = document.createElement('style');
    fontLink.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
    `;
    
    // Create styles
    const styles = document.createElement('style');
    styles.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: ${colors.bg};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        user-select: none;
        overflow: hidden;
        cursor: pointer;
      }
      
      /* Subtle focus marker - small notch at center */
      .focus-marker {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1;
      }
      
      .focus-marker::before,
      .focus-marker::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 12px;
        background: ${colors.muted};
        opacity: 0.5;
      }
      
      .focus-marker::before {
        bottom: 50px;
      }
      
      .focus-marker::after {
        top: 50px;
      }
      
      /* Progress bar */
      .progress-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: ${colors.subtle};
        cursor: pointer;
        z-index: 10;
      }
      
      .progress-fill {
        height: 100%;
        background: ${colors.accent};
        width: 0%;
        transition: width 0.15s linear;
      }
      
      .progress-bar:hover .progress-fill {
        background: ${colors.pivot};
      }
      
      /* 
       * WORD DISPLAY - FIXED PIVOT CENTERING
       * 
       * Structure:
       * - .word-area: positioned at center of screen
       * - .word-container: flexbox row with before/pivot/after
       * - We measure the 'before' width and offset the container left by that amount
       *   plus half the pivot width, so the pivot center is exactly at screen center
       */
      .word-area {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        pointer-events: none;
        z-index: 5;
      }
      
      .word-container {
        display: flex;
        align-items: center;
        font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
        font-size: ${fontSize}px;
        font-weight: 500;
        letter-spacing: -0.01em;
        line-height: 1;
        white-space: nowrap;
      }
      
      .word-before {
        color: ${colors.text};
      }
      
      .word-pivot {
        color: ${colors.pivot};
        font-weight: 700;
      }
      
      .word-after {
        color: ${colors.text};
      }
      
      /* Status displays */
      .status-bar {
        position: absolute;
        bottom: 24px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        padding: 0 32px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        font-weight: 500;
        color: ${colors.muted};
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
      }
      
      .status-bar.visible {
        opacity: 1;
      }
      
      .wpm-display {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .wpm-number {
        color: ${colors.text};
        font-weight: 600;
      }
      
      /* Controls panel */
      .controls {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: ${colors.controlBg};
        border: 1px solid ${colors.controlBorder};
        border-radius: 16px;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateX(-50%) translateY(10px);
        pointer-events: none;
        z-index: 20;
      }
      
      .controls.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
      
      .control-btn {
        width: 44px;
        height: 44px;
        border: none;
        background: transparent;
        color: ${colors.text};
        cursor: pointer;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }
      
      .control-btn:hover {
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
      }
      
      .control-btn:active {
        transform: scale(0.95);
      }
      
      .control-btn svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
      
      .control-btn.play-pause {
        width: 56px;
        height: 56px;
        background: ${colors.accent};
        color: white;
        border-radius: 50%;
        margin: 0 8px;
      }
      
      .control-btn.play-pause:hover {
        background: ${isDark ? '#f87171' : '#b91c1c'};
        transform: scale(1.05);
      }
      
      .control-btn.play-pause:active {
        transform: scale(0.98);
      }
      
      .control-btn.play-pause svg {
        width: 24px;
        height: 24px;
      }
      
      .control-divider {
        width: 1px;
        height: 32px;
        background: ${colors.controlBorder};
        margin: 0 8px;
      }
      
      .wpm-control {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 8px;
      }
      
      .wpm-slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
        border-radius: 2px;
        cursor: pointer;
      }
      
      .wpm-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        background: ${colors.text};
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.15s ease;
      }
      
      .wpm-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
      }
      
      .wpm-slider-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 600;
        color: ${colors.text};
        min-width: 36px;
      }
      
      /* Exit button */
      .exit-btn {
        position: absolute;
        top: 24px;
        right: 24px;
        width: 40px;
        height: 40px;
        border: 1px solid ${colors.controlBorder};
        background: ${colors.controlBg};
        color: ${colors.muted};
        cursor: pointer;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 20;
      }
      
      .exit-btn:hover {
        color: ${colors.text};
        background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
        border-color: ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
      }
      
      .exit-btn.visible {
        opacity: 1;
      }
      
      .exit-btn svg {
        width: 18px;
        height: 18px;
        stroke: currentColor;
        stroke-width: 2;
        fill: none;
      }
      
      /* Keyboard hints */
      .hints {
        position: absolute;
        bottom: 160px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 24px;
        font-size: 12px;
        color: ${colors.muted};
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        z-index: 10;
      }
      
      .hints.visible {
        opacity: 0.7;
      }
      
      .hint {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .hint-key {
        padding: 3px 8px;
        background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        font-weight: 500;
      }
    `;
    
    // Create overlay structure
    this.overlay = document.createElement('div');
    this.overlay.className = 'overlay';
    
    // Focus marker (subtle center indicator)
    if (this.settings?.showGuideLines) {
      const focusMarker = document.createElement('div');
      focusMarker.className = 'focus-marker';
      this.overlay.appendChild(focusMarker);
    }
    
    // Progress bar
    if (this.settings?.showProgressBar) {
      this.progressBar = document.createElement('div');
      this.progressBar.className = 'progress-bar';
      
      this.progressFill = document.createElement('div');
      this.progressFill.className = 'progress-fill';
      
      this.progressBar.appendChild(this.progressFill);
      this.overlay.appendChild(this.progressBar);
    }
    
    // Word display area
    const wordArea = document.createElement('div');
    wordArea.className = 'word-area';
    
    this.wordContainer = document.createElement('div');
    this.wordContainer.className = 'word-container';
    
    this.wordBefore = document.createElement('span');
    this.wordBefore.className = 'word-before';
    
    this.wordPivot = document.createElement('span');
    this.wordPivot.className = 'word-pivot';
    
    this.wordAfter = document.createElement('span');
    this.wordAfter.className = 'word-after';
    
    this.wordContainer.appendChild(this.wordBefore);
    this.wordContainer.appendChild(this.wordPivot);
    this.wordContainer.appendChild(this.wordAfter);
    wordArea.appendChild(this.wordContainer);
    this.overlay.appendChild(wordArea);
    
    // Assemble shadow DOM first so we can measure
    this.shadowRoot!.appendChild(fontLink);
    this.shadowRoot!.appendChild(styles);
    this.shadowRoot!.appendChild(this.overlay);
    document.body.appendChild(this.shadowHost!);
    
    // Measure character width for monospace font (used for jitter-free offset calculation)
    // We do this after appending to DOM so styles are applied
    const measureEl = document.createElement('span');
    measureEl.style.cssText = `
      font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      font-size: ${fontSize}px;
      font-weight: 500;
      letter-spacing: -0.01em;
      visibility: hidden;
      position: absolute;
      white-space: pre;
    `;
    measureEl.textContent = 'M'; // Use 'M' as reference character
    this.overlay.appendChild(measureEl);
    this.charWidth = measureEl.getBoundingClientRect().width;
    measureEl.remove();
    
    // Status bar
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar visible';
    statusBar.id = 'status-bar';
    
    const wordCounter = document.createElement('div');
    wordCounter.className = 'word-counter';
    wordCounter.id = 'word-counter';
    wordCounter.textContent = '0 / 0';
    
    if (this.settings?.showWpmCounter) {
      this.wpmDisplay = document.createElement('div');
      this.wpmDisplay.className = 'wpm-display';
      this.wpmDisplay.innerHTML = `<span class="wpm-number">${this.settings.wpm}</span> wpm`;
    }
    
    statusBar.appendChild(wordCounter);
    if (this.wpmDisplay) statusBar.appendChild(this.wpmDisplay);
    this.overlay.appendChild(statusBar);
    
    // Controls
    this.controls = document.createElement('div');
    this.controls.className = 'controls';
    
    // Rewind button
    const rewindBtn = document.createElement('button');
    rewindBtn.className = 'control-btn';
    rewindBtn.title = 'Rewind 10 words';
    rewindBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`;
    rewindBtn.onclick = (e) => {
      e.stopPropagation();
      this.engine?.rewind();
    };
    
    // Play/Pause button
    this.playPauseBtn = document.createElement('button');
    this.playPauseBtn.className = 'control-btn play-pause';
    this.playPauseBtn.title = 'Play/Pause';
    this.playPauseBtn.innerHTML = this.getPauseIcon();
    this.playPauseBtn.onclick = (e) => {
      e.stopPropagation();
      this.engine?.toggle();
    };
    
    // Forward button
    const forwardBtn = document.createElement('button');
    forwardBtn.className = 'control-btn';
    forwardBtn.title = 'Forward 10 words';
    forwardBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`;
    forwardBtn.onclick = (e) => {
      e.stopPropagation();
      this.engine?.forward();
    };
    
    // Divider
    const divider = document.createElement('div');
    divider.className = 'control-divider';
    
    // WPM control
    const wpmControl = document.createElement('div');
    wpmControl.className = 'wpm-control';
    
    this.wpmSlider = document.createElement('input');
    this.wpmSlider.type = 'range';
    this.wpmSlider.className = 'wpm-slider';
    this.wpmSlider.min = String(MIN_WPM);
    this.wpmSlider.max = String(MAX_WPM);
    this.wpmSlider.step = '50';
    this.wpmSlider.value = String(this.settings?.wpm || 300);
    this.wpmSlider.onclick = (e) => e.stopPropagation();
    this.wpmSlider.oninput = () => {
      const wpm = parseInt(this.wpmSlider!.value, 10);
      this.engine?.setWpm(wpm);
    };
    
    this.wpmValue = document.createElement('span');
    this.wpmValue.className = 'wpm-slider-value';
    this.wpmValue.textContent = String(this.settings?.wpm || 300);
    
    wpmControl.appendChild(this.wpmSlider);
    wpmControl.appendChild(this.wpmValue);
    
    this.controls.appendChild(rewindBtn);
    this.controls.appendChild(this.playPauseBtn);
    this.controls.appendChild(forwardBtn);
    this.controls.appendChild(divider);
    this.controls.appendChild(wpmControl);
    this.overlay.appendChild(this.controls);
    
    // Exit button
    const exitBtn = document.createElement('button');
    exitBtn.className = 'exit-btn';
    exitBtn.title = 'Exit (Esc)';
    exitBtn.innerHTML = `<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    exitBtn.onclick = (e) => {
      e.stopPropagation();
      this.hide();
    };
    this.overlay.appendChild(exitBtn);
    
    // Keyboard hints
    const hints = document.createElement('div');
    hints.className = 'hints';
    hints.innerHTML = `
      <div class="hint"><span class="hint-key">Space</span> pause</div>
      <div class="hint"><span class="hint-key">←</span><span class="hint-key">→</span> skip</div>
      <div class="hint"><span class="hint-key">↑</span><span class="hint-key">↓</span> speed</div>
      <div class="hint"><span class="hint-key">Esc</span> exit</div>
    `;
    this.overlay.appendChild(hints);
  }
  
  /**
   * Setup engine event handlers
   */
  private setupEngineEvents(): void {
    if (!this.engine) return;
    
    this.engine.on((event: RSVPEvent) => {
      switch (event.type) {
        case 'word':
          this.updateWord(event.word!);
          this.updateWordCounter(event.index!, event.total!);
          break;
          
        case 'progress':
          this.updateProgress(event.progress!);
          break;
          
        case 'wpmChange':
          this.updateWpmDisplay(event.wpm!);
          break;
          
        case 'play':
          this.updatePlayPauseButton(true);
          this.hideControlsDelayed();
          break;
          
        case 'pause':
          this.updatePlayPauseButton(false);
          this.showControls();
          break;
          
        case 'complete':
          this.hide();
          break;
      }
    });
  }
  
  /**
   * Setup keyboard controls
   */
  private setupKeyboardControls(): void {
    this.keydownHandler = (e: KeyboardEvent) => {
      if (!this.isVisible) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          e.stopPropagation();
          this.engine?.toggle();
          break;
          
        case 'ArrowLeft':
          e.preventDefault();
          this.engine?.rewind();
          break;
          
        case 'ArrowRight':
          e.preventDefault();
          this.engine?.forward();
          break;
          
        case 'ArrowUp':
          e.preventDefault();
          this.engine?.increaseWpm();
          break;
          
        case 'ArrowDown':
          e.preventDefault();
          this.engine?.decreaseWpm();
          break;
          
        case 'Escape':
          e.preventDefault();
          this.hide();
          break;
      }
    };
    
    document.addEventListener('keydown', this.keydownHandler, true);
  }
  
  /**
   * Setup mouse controls
   */
  private setupMouseControls(): void {
    if (!this.overlay) return;
    
    // Show controls on mouse move
    this.overlay.addEventListener('mousemove', () => {
      this.showControls();
      this.hideControlsDelayed();
    });
    
    // Progress bar seeking
    if (this.progressBar) {
      this.progressBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = this.progressBar!.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        this.engine?.seekToProgress(progress);
      });
    }
    
    // Click on overlay to pause/play
    this.overlay.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      // Don't toggle if clicking interactive elements
      if (target.closest('.controls') || 
          target.closest('.exit-btn') || 
          target.closest('.progress-bar') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'INPUT') {
        return;
      }
      this.engine?.toggle();
    });
  }
  
  /**
   * Show controls
   */
  private showControls(): void {
    const controls = this.shadowRoot?.querySelector('.controls');
    const exitBtn = this.shadowRoot?.querySelector('.exit-btn');
    const hints = this.shadowRoot?.querySelector('.hints');
    
    controls?.classList.add('visible');
    exitBtn?.classList.add('visible');
    hints?.classList.add('visible');
  }
  
  /**
   * Hide controls after delay
   */
  private hideControlsDelayed(): void {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    
    this.controlsTimeout = window.setTimeout(() => {
      if (this.engine?.getState().isPlaying) {
        const controls = this.shadowRoot?.querySelector('.controls');
        const exitBtn = this.shadowRoot?.querySelector('.exit-btn');
        const hints = this.shadowRoot?.querySelector('.hints');
        
        controls?.classList.remove('visible');
        exitBtn?.classList.remove('visible');
        hints?.classList.remove('visible');
      }
    }, 2000);
  }
  
  /**
   * Update the displayed word with FIXED PIVOT CENTERING (jitter-free)
   * 
   * The word is displayed as [before][pivot][after] in a flex row.
   * We calculate the offset based on character count × measured char width.
   * This is synchronous - no requestAnimationFrame needed - eliminating jitter.
   */
  private updateWord(word: Word): void {
    if (!this.wordBefore || !this.wordPivot || !this.wordAfter || !this.wordContainer) return;
    
    const { before, pivot, after } = splitWordAtORP(word.text);
    
    // Calculate offset using character count (synchronous, no DOM measurement)
    // Offset = -(beforeChars * charWidth + pivotChars * charWidth / 2)
    const offset = -(before.length * this.charWidth + (pivot.length * this.charWidth) / 2);
    
    // Apply transform BEFORE updating text to prevent any flash of wrong position
    this.wordContainer.style.transform = `translateX(${offset}px)`;
    
    // Update text content
    this.wordBefore.textContent = before;
    this.wordPivot.textContent = pivot;
    this.wordAfter.textContent = after;
  }
  
  /**
   * Update word counter
   */
  private updateWordCounter(index: number, total: number): void {
    const counter = this.shadowRoot?.getElementById('word-counter');
    if (counter) {
      counter.textContent = `${index + 1} / ${total}`;
    }
  }
  
  /**
   * Update progress bar
   */
  private updateProgress(progress: number): void {
    if (!this.progressFill) return;
    this.progressFill.style.width = `${progress * 100}%`;
  }
  
  /**
   * Update WPM display
   */
  private updateWpmDisplay(wpm: number): void {
    if (this.wpmDisplay) {
      const numberSpan = this.wpmDisplay.querySelector('.wpm-number');
      if (numberSpan) numberSpan.textContent = String(wpm);
    }
    if (this.wpmSlider) {
      this.wpmSlider.value = String(wpm);
    }
    if (this.wpmValue) {
      this.wpmValue.textContent = String(wpm);
    }
  }
  
  /**
   * Update play/pause button
   */
  private updatePlayPauseButton(isPlaying: boolean): void {
    if (!this.playPauseBtn) return;
    this.playPauseBtn.innerHTML = isPlaying ? this.getPauseIcon() : this.getPlayIcon();
  }
  
  private getPlayIcon(): string {
    return `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
  }
  
  private getPauseIcon(): string {
    return `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
  }
  
  /**
   * Show reading statistics modal
   */
  private showStatsModal(stats: ReadingStats): void {
    const isDark = this.settings?.theme === 'dark';
    
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: ${isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)'};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: fadeIn 0.3s ease;
    `;
    
    const estimatedNormalTime = (stats.wordsRead / 250) * 60 * 1000;
    const timeSaved = Math.max(0, estimatedNormalTime - stats.timeSpentMs);
    const percentFaster = estimatedNormalTime > 0 
      ? Math.round(((estimatedNormalTime - stats.timeSpentMs) / estimatedNormalTime) * 100)
      : 0;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: ${isDark ? '#0a0a0a' : '#ffffff'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
      border-radius: 24px;
      padding: 40px 48px;
      color: ${isDark ? '#ffffff' : '#0a0a0a'};
      text-align: center;
      max-width: 420px;
      animation: slideUp 0.4s ease;
    `;
    
    content.innerHTML = `
      <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      </style>
      <div style="font-size: 48px; margin-bottom: 8px;">🎉</div>
      <h2 style="margin: 0 0 8px; font-size: 28px; font-weight: 700;">Session Complete</h2>
      <p style="margin: 0 0 32px; font-size: 15px; color: ${isDark ? '#666' : '#888'};">
        You read ${percentFaster > 0 ? `${percentFaster}% faster than average` : 'at a great pace'}
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px;">
        <div style="background: ${isDark ? '#141414' : '#f5f5f5'}; padding: 20px; border-radius: 16px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: #10b981;">${stats.wordsRead.toLocaleString()}</div>
          <div style="font-size: 13px; color: ${isDark ? '#555' : '#888'}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Words</div>
        </div>
        <div style="background: ${isDark ? '#141414' : '#f5f5f5'}; padding: 20px; border-radius: 16px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: #3b82f6;">${stats.averageWpm}</div>
          <div style="font-size: 13px; color: ${isDark ? '#555' : '#888'}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Avg WPM</div>
        </div>
        <div style="background: ${isDark ? '#141414' : '#f5f5f5'}; padding: 20px; border-radius: 16px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: #f472b6;">${formatDuration(stats.timeSpentMs)}</div>
          <div style="font-size: 13px; color: ${isDark ? '#555' : '#888'}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Duration</div>
        </div>
        <div style="background: ${isDark ? '#141414' : '#f5f5f5'}; padding: 20px; border-radius: 16px;">
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: #fbbf24;">${timeSaved > 0 ? formatDuration(timeSaved) : '-'}</div>
          <div style="font-size: 13px; color: ${isDark ? '#555' : '#888'}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Time Saved</div>
        </div>
      </div>
      
      <button id="flashread-stats-close" style="
        background: #ef4444;
        color: white;
        border: none;
        padding: 14px 40px;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      ">Done</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close handlers
    const close = () => modal.remove();
    const closeBtn = content.querySelector('#flashread-stats-close') as HTMLButtonElement;
    closeBtn?.addEventListener('click', close);
    closeBtn?.addEventListener('mouseenter', () => {
      closeBtn.style.background = '#dc2626';
      closeBtn.style.transform = 'scale(1.02)';
    });
    closeBtn?.addEventListener('mouseleave', () => {
      closeBtn.style.background = '#ef4444';
      closeBtn.style.transform = 'scale(1)';
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });
    
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        close();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    document.addEventListener('keydown', keyHandler);
  }
}

// Singleton instance
let overlayInstance: FlashReadOverlay | null = null;

export function getOverlay(): FlashReadOverlay {
  if (!overlayInstance) {
    overlayInstance = new FlashReadOverlay();
  }
  return overlayInstance;
}

export function showOverlay(text?: string): Promise<void> {
  return getOverlay().show(text);
}

export function hideOverlay(): void {
  getOverlay().hide();
}

export function isOverlayVisible(): boolean {
  return getOverlay().getIsVisible();
}
