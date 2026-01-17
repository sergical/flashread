import { Readability } from '@mozilla/readability';
import type { Message, StartReadingPayload } from '../types';
import { showOverlay, hideOverlay, isOverlayVisible } from './overlay';

/**
 * Content Script
 * 
 * Handles text extraction and communication with the background script.
 */

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  switch (message.type) {
    case 'START_READING': {
      const payload = message.payload as StartReadingPayload | undefined;
      handleStartReading(payload?.text);
      sendResponse({ success: true });
      break;
    }
    
    case 'STOP_READING': {
      hideOverlay();
      sendResponse({ success: true });
      break;
    }
    
    case 'GET_SELECTION': {
      const selection = window.getSelection()?.toString().trim();
      sendResponse({ text: selection || null });
      break;
    }
    
    case 'GET_ARTICLE': {
      const article = extractArticle();
      sendResponse({ text: article });
      break;
    }
    
    case 'OPEN_DEMO': {
      showOverlay(); // Shows demo text when no text provided
      sendResponse({ success: true });
      break;
    }
  }
  
  return true; // Keep message channel open for async response
});

/**
 * Handle start reading request
 */
async function handleStartReading(text?: string): Promise<void> {
  // If already visible, hide first
  if (isOverlayVisible()) {
    hideOverlay();
    return;
  }
  
  let textToRead = text;
  
  // Try to get selected text if no text provided
  if (!textToRead) {
    const selection = window.getSelection()?.toString().trim();
    if (selection && selection.length > 0) {
      textToRead = selection;
    }
  }
  
  // Try to extract article if no selection
  if (!textToRead) {
    textToRead = extractArticle();
  }
  
  // Show overlay (will use demo text if textToRead is still empty)
  await showOverlay(textToRead || undefined);
}

/**
 * Extract article content from page using Readability
 */
function extractArticle(): string | null {
  try {
    // Clone the document to avoid modifying the original
    const documentClone = document.cloneNode(true) as Document;
    
    const reader = new Readability(documentClone);
    const article = reader.parse();
    
    if (article && article.textContent) {
      // Clean up the text
      return article.textContent
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
    }
    
    return null;
  } catch (error) {
    console.error('FlashRead: Error extracting article:', error);
    return null;
  }
}

/**
 * Get selected text on the page
 */
export function getSelectedText(): string | null {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    return selection.toString().trim();
  }
  return null;
}

// Log that content script is loaded
console.log('FlashRead: Content script loaded');
