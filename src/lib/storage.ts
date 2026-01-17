import type { FlashReadSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

/**
 * Storage wrapper for Chrome extension storage API
 */

const SETTINGS_KEY = 'flashread_settings';

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
