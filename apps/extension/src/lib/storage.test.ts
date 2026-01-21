import { describe, it, expect, vi } from 'vitest';
import { testHelpers } from '../__tests__/mocks/browser';
import {
  loadSettings,
  saveSettings,
  resetSettings,
  onSettingsChange,
  saveSession,
  loadSessions,
  clearSessions,
  getAggregateStats,
} from './storage';
import { DEFAULT_SETTINGS } from '@flashread/core';
import type { ReadingSession } from '@flashread/core';

describe('storage', () => {
  describe('loadSettings', () => {
    it('returns default settings when storage is empty', async () => {
      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });

    it('returns stored settings merged with defaults', async () => {
      // Pre-populate storage
      testHelpers.getSyncStorage()['flashread_settings'] = { wpm: 500 };

      const settings = await loadSettings();
      expect(settings.wpm).toBe(500);
      // Other defaults should still be present
      expect(settings.theme).toBe(DEFAULT_SETTINGS.theme);
      expect(settings.fontSize).toBe(DEFAULT_SETTINGS.fontSize);
    });
  });

  describe('saveSettings', () => {
    it('saves partial settings merged with existing', async () => {
      await saveSettings({ wpm: 600 });

      const stored = testHelpers.getSyncStorage()['flashread_settings'] as Record<string, unknown>;
      expect(stored.wpm).toBe(600);
      // Should have merged with defaults
      expect(stored.theme).toBe(DEFAULT_SETTINGS.theme);
    });

    it('updates existing settings', async () => {
      await saveSettings({ wpm: 400 });
      await saveSettings({ wpm: 800, theme: 'light' });

      const stored = testHelpers.getSyncStorage()['flashread_settings'] as Record<string, unknown>;
      expect(stored.wpm).toBe(800);
      expect(stored.theme).toBe('light');
    });
  });

  describe('resetSettings', () => {
    it('removes settings from storage', async () => {
      await saveSettings({ wpm: 999 });
      await resetSettings();

      const settings = await loadSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('onSettingsChange', () => {
    it('calls callback when settings change', async () => {
      const callback = vi.fn();
      const unsubscribe = onSettingsChange(callback);

      await saveSettings({ wpm: 700 });

      expect(callback).toHaveBeenCalled();
      const calledWith = callback.mock.calls[0][0];
      expect(calledWith.wpm).toBe(700);

      unsubscribe();
    });

    it('unsubscribe stops notifications', async () => {
      const callback = vi.fn();
      const unsubscribe = onSettingsChange(callback);

      unsubscribe();
      await saveSettings({ wpm: 700 });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('sessions', () => {
    const mockSession: ReadingSession = {
      id: 'test-1',
      startTime: Date.now() - 60000,
      endTime: Date.now(),
      wordsRead: 500,
      totalWords: 600,
      averageWpm: 450,
      startWpm: 400,
      endWpm: 500,
    };

    describe('saveSession', () => {
      it('saves a session to local storage', async () => {
        await saveSession(mockSession);

        const sessions = await loadSessions();
        expect(sessions).toHaveLength(1);
        expect(sessions[0].id).toBe('test-1');
      });

      it('adds new sessions at the beginning', async () => {
        const session1 = { ...mockSession, id: 'test-1' };
        const session2 = { ...mockSession, id: 'test-2' };

        await saveSession(session1);
        await saveSession(session2);

        const sessions = await loadSessions();
        expect(sessions[0].id).toBe('test-2');
        expect(sessions[1].id).toBe('test-1');
      });

      it('limits sessions to MAX_SESSIONS (50)', async () => {
        // Save 55 sessions
        for (let i = 0; i < 55; i++) {
          await saveSession({ ...mockSession, id: `test-${i}` });
        }

        const sessions = await loadSessions();
        expect(sessions).toHaveLength(50);
        // Most recent should be first
        expect(sessions[0].id).toBe('test-54');
      });
    });

    describe('loadSessions', () => {
      it('returns empty array when no sessions', async () => {
        const sessions = await loadSessions();
        expect(sessions).toEqual([]);
      });
    });

    describe('clearSessions', () => {
      it('removes all sessions', async () => {
        await saveSession(mockSession);
        await clearSessions();

        const sessions = await loadSessions();
        expect(sessions).toEqual([]);
      });
    });

    describe('getAggregateStats', () => {
      it('returns zeros when no sessions', async () => {
        const stats = await getAggregateStats();
        expect(stats).toEqual({
          totalSessions: 0,
          totalWordsRead: 0,
          totalTimeMs: 0,
          averageWpm: 0,
        });
      });

      it('calculates aggregate stats correctly', async () => {
        const session1: ReadingSession = {
          ...mockSession,
          id: 'test-1',
          startTime: 0,
          endTime: 60000, // 1 minute
          wordsRead: 300,
        };
        const session2: ReadingSession = {
          ...mockSession,
          id: 'test-2',
          startTime: 0,
          endTime: 120000, // 2 minutes
          wordsRead: 700,
        };

        await saveSession(session1);
        await saveSession(session2);

        const stats = await getAggregateStats();
        expect(stats.totalSessions).toBe(2);
        expect(stats.totalWordsRead).toBe(1000);
        expect(stats.totalTimeMs).toBe(180000); // 3 minutes total
        // Average WPM = 1000 words / 3 minutes = 333 WPM
        expect(stats.averageWpm).toBe(333);
      });
    });
  });
});
