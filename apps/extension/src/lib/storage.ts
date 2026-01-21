import browser from 'webextension-polyfill';
import type { FlashReadSettings, ReadingSession } from '@flashread/core';
import { DEFAULT_SETTINGS } from '@flashread/core';

/**
 * Storage wrapper for browser extension storage API
 */

const SETTINGS_KEY = 'flashread_settings';
const SESSIONS_KEY = 'flashread_sessions';
const MAX_SESSIONS = 50; // Keep last 50 sessions

/**
 * Load settings from browser storage
 */
export async function loadSettings(): Promise<FlashReadSettings> {
  const result = await browser.storage.sync.get([SETTINGS_KEY]);
  const stored = result[SETTINGS_KEY];
  if (stored) {
    // Merge with defaults to ensure all keys exist
    return { ...DEFAULT_SETTINGS, ...stored };
  }
  return DEFAULT_SETTINGS;
}

/**
 * Save settings to browser storage
 */
export async function saveSettings(settings: Partial<FlashReadSettings>): Promise<void> {
  const current = await loadSettings();
  const updated = { ...current, ...settings };
  await browser.storage.sync.set({ [SETTINGS_KEY]: updated });
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  await browser.storage.sync.remove([SETTINGS_KEY]);
}

/**
 * Listen for settings changes
 */
export function onSettingsChange(
  callback: (settings: FlashReadSettings) => void
): () => void {
  const listener = (
    changes: { [key: string]: browser.Storage.StorageChange },
    areaName: string
  ) => {
    if (areaName === 'sync' && changes[SETTINGS_KEY]) {
      callback({ ...DEFAULT_SETTINGS, ...changes[SETTINGS_KEY].newValue });
    }
  };

  browser.storage.onChanged.addListener(listener);

  // Return unsubscribe function
  return () => {
    browser.storage.onChanged.removeListener(listener);
  };
}

/**
 * Save a reading session to history
 */
export async function saveSession(session: ReadingSession): Promise<void> {
  const sessions = await loadSessions();
  sessions.unshift(session); // Add to beginning

  // Keep only the last MAX_SESSIONS
  const trimmed = sessions.slice(0, MAX_SESSIONS);
  await browser.storage.local.set({ [SESSIONS_KEY]: trimmed });
}

/**
 * Load all reading sessions from history
 */
export async function loadSessions(): Promise<ReadingSession[]> {
  const result = await browser.storage.local.get([SESSIONS_KEY]);
  return result[SESSIONS_KEY] || [];
}

/**
 * Clear all reading history
 */
export async function clearSessions(): Promise<void> {
  await browser.storage.local.remove([SESSIONS_KEY]);
}

/**
 * Get aggregate stats from all sessions
 */
export async function getAggregateStats(): Promise<{
  totalSessions: number;
  totalWordsRead: number;
  totalTimeMs: number;
  averageWpm: number;
}> {
  const sessions = await loadSessions();
  
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalWordsRead: 0,
      totalTimeMs: 0,
      averageWpm: 0,
    };
  }
  
  const totalWordsRead = sessions.reduce((sum, s) => sum + s.wordsRead, 0);
  const totalTimeMs = sessions.reduce((sum, s) => sum + (s.endTime ? s.endTime - s.startTime : 0), 0);
  const averageWpm = totalTimeMs > 0 
    ? Math.round((totalWordsRead / totalTimeMs) * 60000)
    : 0;
  
  return {
    totalSessions: sessions.length,
    totalWordsRead,
    totalTimeMs,
    averageWpm,
  };
}
