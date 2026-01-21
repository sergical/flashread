import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import browser, { testHelpers } from '../__tests__/mocks/browser';

describe('service-worker', () => {
  // Import service worker once to register listeners
  beforeAll(async () => {
    await import('./service-worker');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    testHelpers.clearStorage();
    // Note: We don't clear listeners because the service worker registered them once
  });

  describe('onInstalled', () => {
    it('creates context menus on install', async () => {
      // Clear mocks before triggering to get accurate counts
      vi.clearAllMocks();
      testHelpers.triggerInstalled();

      // Wait for async operations
      await vi.waitFor(() => {
        expect(browser.contextMenus.create).toHaveBeenCalledTimes(2);
      });

      // Verify both context menus were created
      expect(browser.contextMenus.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'flashread-selection',
          contexts: ['selection'],
        })
      );
      expect(browser.contextMenus.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'flashread-page',
          contexts: ['page'],
        })
      );
    });

    it('fetches registered commands', async () => {
      vi.clearAllMocks();
      testHelpers.triggerInstalled();

      // Wait for async commands.getAll
      await vi.waitFor(() => {
        expect(browser.commands.getAll).toHaveBeenCalled();
      });
    });
  });

  describe('message handling', () => {
    it('handles START_READING_FROM_POPUP message with valid tab', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'https://example.com' }]);
      browser.tabs.sendMessage = vi.fn(async () => ({ success: true }));
      browser.scripting.executeScript = vi.fn(async () => [{ result: undefined }]);

      const responses = testHelpers.triggerMessage({ type: 'START_READING_FROM_POPUP' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
    });

    it('handles OPEN_DEMO_FROM_POPUP message with valid tab', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'https://example.com' }]);
      browser.tabs.sendMessage = vi.fn(async () => ({ success: true }));
      browser.scripting.executeScript = vi.fn(async () => [{ result: undefined }]);

      const responses = testHelpers.triggerMessage({ type: 'OPEN_DEMO_FROM_POPUP' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
    });

    it('handles READ_PAGE_FROM_POPUP message with valid tab', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'https://example.com' }]);
      browser.tabs.sendMessage = vi.fn(async () => ({ success: true }));
      browser.scripting.executeScript = vi.fn(async () => [{ result: undefined }]);

      const responses = testHelpers.triggerMessage({ type: 'READ_PAGE_FROM_POPUP' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
    });

    it('returns undefined for unknown messages', () => {
      const responses = testHelpers.triggerMessage({ type: 'UNKNOWN_MESSAGE' });

      // Filter out undefined responses
      const definedResponses = responses.filter((r) => r !== undefined);
      expect(definedResponses).toHaveLength(0);
    });
  });

  describe('URL validation', () => {
    it('rejects chrome:// URLs', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'chrome://extensions' }]);

      const responses = testHelpers.triggerMessage({ type: 'READ_PAGE_FROM_POPUP' });
      const result = await responses[0];

      expect(result).toEqual({ success: false });
    });

    it('rejects moz-extension:// URLs (Firefox)', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'moz-extension://abc123/popup.html' }]);

      const responses = testHelpers.triggerMessage({ type: 'READ_PAGE_FROM_POPUP' });
      const result = await responses[0];

      expect(result).toEqual({ success: false });
    });

    it('rejects about: URLs', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'about:blank' }]);

      const responses = testHelpers.triggerMessage({ type: 'READ_PAGE_FROM_POPUP' });
      const result = await responses[0];

      expect(result).toEqual({ success: false });
    });

    it('accepts https:// URLs and attempts to send message', async () => {
      browser.tabs.query = vi.fn(async () => [{ id: 1, url: 'https://example.com' }]);
      browser.scripting.executeScript = vi.fn(async () => [{ result: undefined }]);

      const responses = testHelpers.triggerMessage({ type: 'READ_PAGE_FROM_POPUP' });
      await responses[0];

      // Should attempt to inject script on valid page
      expect(browser.scripting.executeScript).toHaveBeenCalled();
    });
  });
});
