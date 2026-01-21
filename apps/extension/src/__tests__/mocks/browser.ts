import { vi } from 'vitest';

/**
 * Mock for webextension-polyfill browser API
 * Works for both Chrome and Firefox since we use the polyfill
 *
 * Uses a shared state object to persist data across module re-imports
 */

// Shared state that persists across module re-imports
const state = {
  syncStorage: {} as Record<string, unknown>,
  localStorage: {} as Record<string, unknown>,
  storageListeners: [] as Array<(changes: Record<string, { oldValue?: unknown; newValue?: unknown }>, areaName: string) => void>,
  messageListeners: [] as Array<(message: unknown, sender: unknown) => unknown>,
  commandListeners: [] as Array<(command: string) => void>,
  contextMenuListeners: [] as Array<(info: unknown, tab: unknown) => void>,
  installedListeners: [] as Array<() => void>,
};

export const mockBrowser = {
  storage: {
    sync: {
      get: vi.fn(async (keys: string[]) => {
        const result: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in state.syncStorage) {
            result[key] = state.syncStorage[key];
          }
        }
        return result;
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        const changes: Record<string, { oldValue?: unknown; newValue?: unknown }> = {};
        for (const [key, value] of Object.entries(items)) {
          changes[key] = { oldValue: state.syncStorage[key], newValue: value };
          state.syncStorage[key] = value;
        }
        // Notify listeners
        for (const listener of state.storageListeners) {
          listener(changes, 'sync');
        }
      }),
      remove: vi.fn(async (keys: string[]) => {
        for (const key of keys) {
          delete state.syncStorage[key];
        }
      }),
    },
    local: {
      get: vi.fn(async (keys: string[]) => {
        const result: Record<string, unknown> = {};
        for (const key of keys) {
          if (key in state.localStorage) {
            result[key] = state.localStorage[key];
          }
        }
        return result;
      }),
      set: vi.fn(async (items: Record<string, unknown>) => {
        const changes: Record<string, { oldValue?: unknown; newValue?: unknown }> = {};
        for (const [key, value] of Object.entries(items)) {
          changes[key] = { oldValue: state.localStorage[key], newValue: value };
          state.localStorage[key] = value;
        }
        // Notify listeners
        for (const listener of state.storageListeners) {
          listener(changes, 'local');
        }
      }),
      remove: vi.fn(async (keys: string[]) => {
        for (const key of keys) {
          delete state.localStorage[key];
        }
      }),
    },
    onChanged: {
      addListener: vi.fn((callback: (typeof state.storageListeners)[0]) => {
        state.storageListeners.push(callback);
      }),
      removeListener: vi.fn((callback: (typeof state.storageListeners)[0]) => {
        const index = state.storageListeners.indexOf(callback);
        if (index > -1) {
          state.storageListeners.splice(index, 1);
        }
      }),
    },
  },

  runtime: {
    onMessage: {
      addListener: vi.fn((callback: (typeof state.messageListeners)[0]) => {
        state.messageListeners.push(callback);
      }),
      removeListener: vi.fn((callback: (typeof state.messageListeners)[0]) => {
        const index = state.messageListeners.indexOf(callback);
        if (index > -1) {
          state.messageListeners.splice(index, 1);
        }
      }),
    },
    onInstalled: {
      addListener: vi.fn((callback: (typeof state.installedListeners)[0]) => {
        state.installedListeners.push(callback);
      }),
    },
    sendMessage: vi.fn(async (message: unknown) => {
      // Simulate sending to all listeners and returning first response
      for (const listener of state.messageListeners) {
        const response = listener(message, {});
        if (response !== undefined) {
          return response;
        }
      }
      return undefined;
    }),
    openOptionsPage: vi.fn(),
  },

  tabs: {
    query: vi.fn(async () => [{ id: 1, url: 'https://example.com' }]),
    sendMessage: vi.fn(async (_tabId: number, message: unknown) => {
      // Simulate content script response
      for (const listener of state.messageListeners) {
        const response = listener(message, { tab: { id: 1 } });
        if (response !== undefined) {
          return response;
        }
      }
      return undefined;
    }),
  },

  commands: {
    getAll: vi.fn(async () => [{ name: 'start-reading', shortcut: 'Ctrl+Shift+R' }]),
    onCommand: {
      addListener: vi.fn((callback: (typeof state.commandListeners)[0]) => {
        state.commandListeners.push(callback);
      }),
    },
  },

  contextMenus: {
    create: vi.fn(),
    onClicked: {
      addListener: vi.fn((callback: (typeof state.contextMenuListeners)[0]) => {
        state.contextMenuListeners.push(callback);
      }),
    },
  },

  scripting: {
    executeScript: vi.fn(async () => [{ result: undefined }]),
  },
};

// Helper to trigger events in tests
export const testHelpers = {
  triggerMessage: (message: unknown, sender = {}) => {
    const responses: unknown[] = [];
    for (const listener of state.messageListeners) {
      const response = listener(message, sender);
      if (response !== undefined) {
        responses.push(response);
      }
    }
    return responses;
  },

  triggerCommand: (command: string) => {
    for (const listener of state.commandListeners) {
      listener(command);
    }
  },

  triggerInstalled: () => {
    for (const listener of state.installedListeners) {
      listener();
    }
  },

  triggerContextMenuClick: (info: unknown, tab: unknown) => {
    for (const listener of state.contextMenuListeners) {
      listener(info, tab);
    }
  },

  clearStorage: () => {
    state.syncStorage = {};
    state.localStorage = {};
  },

  clearListeners: () => {
    state.messageListeners.length = 0;
    state.commandListeners.length = 0;
    state.contextMenuListeners.length = 0;
    state.installedListeners.length = 0;
    state.storageListeners.length = 0;
  },

  getSyncStorage: () => state.syncStorage,
  setSyncStorage: (data: Record<string, unknown>) => {
    state.syncStorage = data;
  },
  getLocalStorage: () => state.localStorage,
  setLocalStorage: (data: Record<string, unknown>) => {
    state.localStorage = data;
  },
  getMessageListeners: () => state.messageListeners,
};

// Export as default to match webextension-polyfill import
export default mockBrowser;
