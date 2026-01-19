import type { FlashReadSettings, ReadingSession } from '@flashread/core';
import { DEFAULT_SETTINGS } from '@flashread/core';

/**
 * Storage wrapper for Chrome extension storage API
 */

const SETTINGS_KEY = 'flashread_settings';
const SESSIONS_KEY = 'flashread_sessions';
const MAX_SESSIONS = 50; // Keep last 50 sessions

/**
 * Load settings from Chrome storage
 */
export async function loadSettings(): Promise<FlashReadSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([SETTINGS_KEY], (result) => {
      const stored = result[SETTINGS_KEY];
      if (stored) {
        // Merge with defaults to ensure all keys exist
        resolve({ ...DEFAULT_SETTINGS, ...stored });
      } else {
        resolve(DEFAULT_SETTINGS);
      }
    });
  });
}

/**
 * Save settings to Chrome storage
 */
export async function saveSettings(settings: Partial<FlashReadSettings>): Promise<void> {
  const current = await loadSettings();
  const updated = { ...current, ...settings };
  
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [SETTINGS_KEY]: updated }, () => {
      resolve();
    });
  });
}

/**
 * Reset settings to defaults
 */
export async function resetSettings(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.remove([SETTINGS_KEY], () => {
      resolve();
    });
  });
}

/**
 * Listen for settings changes
 */
export function onSettingsChange(
  callback: (settings: FlashReadSettings) => void
): () => void {
  const listener = (
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) => {
    if (areaName === 'sync' && changes[SETTINGS_KEY]) {
      callback({ ...DEFAULT_SETTINGS, ...changes[SETTINGS_KEY].newValue });
    }
  };
  
  chrome.storage.onChanged.addListener(listener);
  
  // Return unsubscribe function
  return () => {
    chrome.storage.onChanged.removeListener(listener);
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
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ [SESSIONS_KEY]: trimmed }, () => {
      resolve();
    });
  });
}

/**
 * Load all reading sessions from history
 */
export async function loadSessions(): Promise<ReadingSession[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([SESSIONS_KEY], (result) => {
      resolve(result[SESSIONS_KEY] || []);
    });
  });
}

/**
 * Clear all reading history
 */
export async function clearSessions(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([SESSIONS_KEY], () => {
      resolve();
    });
  });
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
