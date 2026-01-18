import { loadSettings, saveSettings, resetSettings, loadSessions, clearSessions, getAggregateStats } from '../lib/storage';
import { DEFAULT_SETTINGS } from '../utils/constants';
import type { FlashReadSettings, ReadingSession } from '../types';

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
const fontBtns = document.querySelectorAll('.font-btn') as NodeListOf<HTMLButtonElement>;
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
  await loadHistory();
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
  
  // Update font buttons
  fontBtns.forEach(btn => {
    const isActive = btn.dataset.font === settings.fontFamily;
    btn.classList.toggle('active', isActive);
  });
  
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
  
  // Font family buttons
  fontBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const fontFamily = btn.dataset.font as 'serif' | 'sans' | 'mono';
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      await saveSettings({ fontFamily });
    });
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
  
  // Clear history
  const clearHistoryBtn = document.getElementById('clear-history');
  clearHistoryBtn?.addEventListener('click', async () => {
    if (confirm('Clear all reading history?')) {
      await clearSessions();
      await loadHistory();
      showToast('History cleared');
    }
  });
}

// Load and display reading history
async function loadHistory() {
  const [sessions, stats] = await Promise.all([
    loadSessions(),
    getAggregateStats(),
  ]);
  
  // Update aggregate stats
  const totalSessionsEl = document.getElementById('total-sessions');
  const totalWordsEl = document.getElementById('total-words');
  const totalTimeEl = document.getElementById('total-time');
  const avgWpmEl = document.getElementById('avg-wpm');
  
  if (totalSessionsEl) totalSessionsEl.textContent = String(stats.totalSessions);
  if (totalWordsEl) totalWordsEl.textContent = formatNumber(stats.totalWordsRead);
  if (totalTimeEl) totalTimeEl.textContent = formatDuration(stats.totalTimeMs);
  if (avgWpmEl) avgWpmEl.textContent = String(stats.averageWpm);
  
  // Update session list
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  
  if (sessions.length === 0) {
    historyList.innerHTML = '<p class="history-empty">No reading sessions yet. Start reading to track your progress!</p>';
    return;
  }
  
  historyList.innerHTML = sessions.map(session => {
    const date = new Date(session.startTime);
    const duration = session.endTime ? session.endTime - session.startTime : 0;
    
    return `
      <div class="history-item">
        <div class="history-item-date">
          <span class="date">${formatDate(date)}</span>
          <span class="time">${formatTime(date)}</span>
        </div>
        <div class="history-item-stats">
          <div class="history-item-stat">
            <span class="value">${session.wordsRead}</span>
            <span class="label">words</span>
          </div>
          <div class="history-item-stat">
            <span class="value">${session.averageWpm}</span>
            <span class="label">wpm</span>
          </div>
          <div class="history-item-stat">
            <span class="value">${formatDuration(duration)}</span>
            <span class="label">time</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Format number with commas
function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return String(num);
}

// Format duration
function formatDuration(ms: number): string {
  if (ms < 1000) return '0s';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return `${hours}h ${remainingMins}m`;
}

// Format date
function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
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
