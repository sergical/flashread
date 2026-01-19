/**
 * Background Service Worker
 * 
 * Handles context menu, keyboard shortcuts, and message routing.
 */

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'flashread-selection',
    title: 'Speed Read with FlashRead',
    contexts: ['selection'],
  });
  
  // Create context menu for page
  chrome.contextMenus.create({
    id: 'flashread-page',
    title: 'Speed Read this Page',
    contexts: ['page'],
  });
  
  // Debug: Log registered commands
  chrome.commands.getAll((commands) => {
    console.log('FlashRead: Registered commands:', commands);
    for (const { name, shortcut } of commands) {
      if (shortcut === '') {
        console.warn(`FlashRead: Command "${name}" has no shortcut assigned!`);
      } else {
        console.log(`FlashRead: Command "${name}" = ${shortcut}`);
      }
    }
  });
  
  console.log('FlashRead: Extension installed, context menus created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !tab.url) return;
  
  // Check if we can inject into this page
  if (!isValidPage(tab.url)) {
    console.log('FlashRead: Cannot inject into this page:', tab.url);
    return;
  }
  
  try {
    switch (info.menuItemId) {
      case 'flashread-selection':
        await sendMessageToTab(tab.id, {
          type: 'START_READING',
          payload: { text: info.selectionText },
        });
        break;
        
      case 'flashread-page':
        await sendMessageToTab(tab.id, {
          type: 'START_READING',
        });
        break;
    }
  } catch (error) {
    console.error('FlashRead: Error handling context menu:', error);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  console.log('FlashRead: Command received:', command);
  
  if (command === 'start-reading') {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    
    if (!tab?.id || !tab.url) return;
    
    // Check if we can inject into this page
    if (!isValidPage(tab.url)) {
      console.log('FlashRead: Cannot inject into this page:', tab.url);
      return;
    }
    
    try {
      const response = await sendMessageToTab(tab.id, { type: 'GET_SELECTION' });
      
      if (response?.text) {
        await sendMessageToTab(tab.id, {
          type: 'START_READING',
          payload: { text: response.text },
        });
      } else {
        await sendMessageToTab(tab.id, { type: 'START_READING' });
      }
    } catch (error) {
      console.error('FlashRead: Error handling keyboard shortcut:', error);
    }
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_READING_FROM_POPUP') {
    handlePopupStartReading(message.payload?.text)
      .then(sendResponse)
      .catch(() => sendResponse({ success: false }));
    return true;
  }
  
  if (message.type === 'OPEN_DEMO_FROM_POPUP') {
    handleOpenDemo()
      .then(sendResponse)
      .catch(() => sendResponse({ success: false }));
    return true;
  }
  
  if (message.type === 'READ_PAGE_FROM_POPUP') {
    handleReadPage()
      .then(sendResponse)
      .catch(() => sendResponse({ success: false }));
    return true;
  }
});

/**
 * Check if we can inject content scripts into this URL
 */
function isValidPage(url: string): boolean {
  // Cannot inject into chrome:// pages, chrome-extension:// pages, etc.
  if (url.startsWith('chrome://') || 
      url.startsWith('chrome-extension://') ||
      url.startsWith('about:') ||
      url.startsWith('edge://') ||
      url.startsWith('brave://') ||
      url.startsWith('devtools://')) {
    return false;
  }
  return true;
}

/**
 * Handle start reading request from popup
 */
async function handlePopupStartReading(text?: string): Promise<{ success: boolean }> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  
  if (!tab?.id || !tab.url || !isValidPage(tab.url)) {
    return { success: false };
  }
  
  try {
    await sendMessageToTab(tab.id, {
      type: 'START_READING',
      payload: { text },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Handle open demo request from popup
 */
async function handleOpenDemo(): Promise<{ success: boolean }> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  
  if (!tab?.id || !tab.url || !isValidPage(tab.url)) {
    return { success: false };
  }
  
  try {
    await sendMessageToTab(tab.id, { type: 'OPEN_DEMO' });
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Handle read page request from popup
 */
async function handleReadPage(): Promise<{ success: boolean }> {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tab = tabs[0];
  
  if (!tab?.id || !tab.url || !isValidPage(tab.url)) {
    return { success: false };
  }
  
  try {
    await sendMessageToTab(tab.id, { type: 'START_READING' });
    return { success: true };
  } catch {
    return { success: false };
  }
}

/**
 * Send message to a tab's content script
 * First ensures the content script is injected, then sends the message.
 */
async function sendMessageToTab(tabId: number, message: unknown): Promise<unknown> {
  // First, try to inject the content script (it may already be loaded)
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['src/content/content.js'],
    });
  } catch (e) {
    // Script might already be injected, or page doesn't allow injection
    // This is often fine, continue to try sending the message
    console.log('FlashRead: Script injection note:', (e as Error).message);
  }
  
  // Now send the message
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (e) {
    const error = e as Error;
    // "Receiving end does not exist" means content script isn't there
    if (error.message?.includes('Receiving end does not exist')) {
      console.log('FlashRead: Content script not available on this page');
    } else {
      console.error('FlashRead: Error sending message:', error.message);
    }
    throw error;
  }
}

console.log('FlashRead: Background service worker started');
