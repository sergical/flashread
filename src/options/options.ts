import { loadSettings, saveSettings, resetSettings } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';
import type { FlashReadSettings } from '../types';

/**
 * Options Page Script
 */

// DOM Elements
const defaultWpmSlider = document.getElementById('default-wpm') as HTMLInputElement;
const defaultWpmValue = document.getElementById('default-wpm-value') as HTMLSpanElement;
const autoRampToggle = document.getElementById('auto-ramp') as HTMLInputElement;
const autoRampSettings = document.getElementById('auto-ramp-settings') as HTMLDivElement;
const rampIntervalInput = document.getElementById('ramp-interval') as HTMLInputElement;
const rampIncrementInput = document.getElementById('ramp-increment') as HTMLInputElement;
const punctuationPauseToggle = document.getElementById('punctuation-pause') as HTMLInputElement;
const fontSizeSlider = document.getElementById('font-size') as HTMLInputElement;
const fontSizeValue = document.getElementById('font-size-value') as HTMLSpanElement;
const themeBtns = document.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;
const showGuideLinesToggle = document.getElementById('show-guide-lines') as HTMLInputElement;
const showProgressBarToggle = document.getElementById('show-progress-bar') as HTMLInputElement;
const showWpmCounterToggle = document.getElementById('show-wpm-counter') as HTMLInputElement;
const resetSettingsBtn = document.getElementById('reset-settings') as HTMLButtonElement;

let currentSettings: FlashReadSettings;

// Initialize
async function init() {
  currentSettings = await loadSettings();
  populateUI(currentSettings);
  setupEventListeners();
}

// Populate UI with current settings
function populateUI(settings: FlashReadSettings) {
  defaultWpmSlider.value = String(settings.wpm);
  defaultWpmValue.textContent = `${settings.wpm} WPM`;
  
  autoRampToggle.checked = settings.autoRamp;
  autoRampSettings.classList.toggle('visible', settings.autoRamp);
  rampIntervalInput.value = String(settings.autoRampInterval);
  rampIncrementInput.value = String(settings.autoRampIncrement);
  
  punctuationPauseToggle.checked = settings.punctuationPause;
  
  fontSizeSlider.value = String(settings.fontSize);
  fontSizeValue.textContent = `${settings.fontSize}px`;
  
  // Update theme buttons
  themeBtns.forEach(btn => {
    const isActive = btn.dataset.theme === settings.theme;
    btn.classList.toggle('active', isActive);
  });
  
  showGuideLinesToggle.checked = settings.showGuideLines;
  showProgressBarToggle.checked = settings.showProgressBar;
  showWpmCounterToggle.checked = settings.showWpmCounter;
}

// Setup event listeners
function setupEventListeners() {
  // Default WPM
  defaultWpmSlider.addEventListener('input', async () => {
    const wpm = parseInt(defaultWpmSlider.value, 10);
    defaultWpmValue.textContent = `${wpm} WPM`;
    await saveSettings({ wpm });
  });
  
  // Auto-ramp toggle
  autoRampToggle.addEventListener('change', async () => {
    const autoRamp = autoRampToggle.checked;
    autoRampSettings.classList.toggle('visible', autoRamp);
    await saveSettings({ autoRamp });
  });
  
  // Ramp interval
  rampIntervalInput.addEventListener('change', async () => {
    const autoRampInterval = parseInt(rampIntervalInput.value, 10);
    await saveSettings({ autoRampInterval });
  });
  
  // Ramp increment
  rampIncrementInput.addEventListener('change', async () => {
    const autoRampIncrement = parseInt(rampIncrementInput.value, 10);
    await saveSettings({ autoRampIncrement });
  });
  
  // Punctuation pause
  punctuationPauseToggle.addEventListener('change', async () => {
    await saveSettings({ punctuationPause: punctuationPauseToggle.checked });
  });
  
  // Font size
  fontSizeSlider.addEventListener('input', async () => {
    const fontSize = parseInt(fontSizeSlider.value, 10);
    fontSizeValue.textContent = `${fontSize}px`;
    await saveSettings({ fontSize });
  });
  
  // Theme buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const theme = btn.dataset.theme as 'dark' | 'light';
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      await saveSettings({ theme });
    });
  });
  
  // Guide lines
  showGuideLinesToggle.addEventListener('change', async () => {
    await saveSettings({ showGuideLines: showGuideLinesToggle.checked });
  });
  
  // Progress bar
  showProgressBarToggle.addEventListener('change', async () => {
    await saveSettings({ showProgressBar: showProgressBarToggle.checked });
  });
  
  // WPM counter
  showWpmCounterToggle.addEventListener('change', async () => {
    await saveSettings({ showWpmCounter: showWpmCounterToggle.checked });
  });
  
  // Reset settings
  resetSettingsBtn.addEventListener('click', async () => {
    if (confirm('Reset all settings to defaults?')) {
      await resetSettings();
      populateUI(DEFAULT_SETTINGS);
      showToast('Settings reset to defaults');
    }
  });
}

// Show toast notification
function showToast(message: string) {
  const toast = document.getElementById('toast') as HTMLDivElement;
  toast.textContent = message;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}

// Run initialization
init();
