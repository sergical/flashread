import browser from 'webextension-polyfill';
import { loadSettings, saveSettings } from '../lib/storage';

/**
 * Popup Script
 *
 * Handles popup UI interactions with a polished UX.
 */

// DOM Elements
const readPageBtn = document.getElementById('read-page') as HTMLButtonElement;
const demoBtn = document.getElementById('demo') as HTMLButtonElement;
const customTextArea = document.getElementById('custom-text') as HTMLTextAreaElement;
const readCustomBtn = document.getElementById('read-custom') as HTMLButtonElement;
const charCount = document.getElementById('char-count') as HTMLSpanElement;
const wpmSlider = document.getElementById('wpm-slider') as HTMLInputElement;
const wpmValue = document.getElementById('wpm-value') as HTMLSpanElement;
const openOptionsLink = document.getElementById('open-options') as HTMLAnchorElement;
const presetBtns = document.querySelectorAll('.preset') as NodeListOf<HTMLButtonElement>;

// Initialize
async function init() {
  // Load saved settings
  const settings = await loadSettings();
  wpmSlider.value = String(settings.wpm);
  wpmValue.textContent = String(settings.wpm);
  updateActivePreset(settings.wpm);
  
  // Setup event listeners
  setupEventListeners();
}

function setupEventListeners() {
  // Read page button
  readPageBtn.addEventListener('click', async () => {
    await browser.runtime.sendMessage({ type: 'READ_PAGE_FROM_POPUP' });
    window.close();
  });

  // Demo button
  demoBtn.addEventListener('click', async () => {
    await browser.runtime.sendMessage({ type: 'OPEN_DEMO_FROM_POPUP' });
    window.close();
  });
  
  // Custom text area
  customTextArea.addEventListener('input', () => {
    const text = customTextArea.value;
    const hasText = text.trim().length > 0;
    readCustomBtn.disabled = !hasText;
    
    // Update character count
    const chars = text.length;
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (chars === 0) {
      charCount.textContent = '0 characters';
    } else {
      charCount.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
    }
  });
  
  // Read custom text button
  readCustomBtn.addEventListener('click', async () => {
    const text = customTextArea.value.trim();
    if (text) {
      await browser.runtime.sendMessage({
        type: 'START_READING_FROM_POPUP',
        payload: { text },
      });
      window.close();
    }
  });
  
  // WPM slider
  wpmSlider.addEventListener('input', async () => {
    const wpm = parseInt(wpmSlider.value, 10);
    wpmValue.textContent = String(wpm);
    updateActivePreset(wpm);
    await saveSettings({ wpm });
  });
  
  // Preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const wpm = parseInt(btn.dataset.wpm || '300', 10);
      wpmSlider.value = String(wpm);
      wpmValue.textContent = String(wpm);
      updateActivePreset(wpm);
      await saveSettings({ wpm });
    });
  });
  
  // Open options
  openOptionsLink.addEventListener('click', (e) => {
    e.preventDefault();
    browser.runtime.openOptionsPage();
  });
  
  // Handle paste
  customTextArea.addEventListener('paste', () => {
    setTimeout(() => {
      const text = customTextArea.value;
      const hasText = text.trim().length > 0;
      readCustomBtn.disabled = !hasText;
      
      const chars = text.length;
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (chars > 0) {
        charCount.textContent = `${chars.toLocaleString()} chars · ${words.toLocaleString()} words`;
      }
    }, 10);
  });
}

function updateActivePreset(wpm: number) {
  presetBtns.forEach(btn => {
    const presetWpm = parseInt(btn.dataset.wpm || '0', 10);
    // Find the closest preset
    const diff = Math.abs(presetWpm - wpm);
    if (diff <= 75) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Run initialization
init();
