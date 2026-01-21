import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { testHelpers } from '../__tests__/mocks/browser';

// Mock the overlay module before importing content
vi.mock('./overlay', () => ({
  showOverlay: vi.fn(() => Promise.resolve()),
  hideOverlay: vi.fn(),
  isOverlayVisible: vi.fn(() => false),
}));

// Mock DOM APIs
const mockSelection = {
  toString: vi.fn(() => ''),
};

vi.stubGlobal('window', {
  getSelection: vi.fn(() => mockSelection),
});

vi.stubGlobal('document', {
  cloneNode: vi.fn(() => ({})),
  createElement: vi.fn(() => ({
    innerHTML: '',
    textContent: '',
  })),
});

describe('content script', () => {
  // Import content script once to register listeners
  beforeAll(async () => {
    await import('./content');
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockSelection.toString.mockReturnValue('');
  });

  describe('message handling', () => {
    it('handles GET_SELECTION message with selected text', async () => {
      mockSelection.toString.mockReturnValue('  Selected text  ');

      const responses = testHelpers.triggerMessage({ type: 'GET_SELECTION' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ text: 'Selected text' });
    });

    it('handles GET_SELECTION message with no selection', async () => {
      mockSelection.toString.mockReturnValue('');

      const responses = testHelpers.triggerMessage({ type: 'GET_SELECTION' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ text: null });
    });

    it('handles START_READING message', async () => {
      const responses = testHelpers.triggerMessage({
        type: 'START_READING',
        payload: { text: 'Test content' },
      });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
    });

    it('handles STOP_READING message', async () => {
      const { hideOverlay } = await import('./overlay');

      const responses = testHelpers.triggerMessage({ type: 'STOP_READING' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
      expect(hideOverlay).toHaveBeenCalled();
    });

    it('handles OPEN_DEMO message', async () => {
      const { showOverlay } = await import('./overlay');

      const responses = testHelpers.triggerMessage({ type: 'OPEN_DEMO' });

      expect(responses.length).toBeGreaterThan(0);
      const result = await responses[0];
      expect(result).toEqual({ success: true });
      expect(showOverlay).toHaveBeenCalled();
    });

    it('returns undefined for unknown messages', () => {
      const responses = testHelpers.triggerMessage({ type: 'UNKNOWN_TYPE' });

      const definedResponses = responses.filter((r) => r !== undefined);
      expect(definedResponses).toHaveLength(0);
    });
  });
});
