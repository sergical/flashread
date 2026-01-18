import type { Word } from '../types';
import { getORPIndex } from './orp';
import { PAUSE_MULTIPLIERS } from '../utils/constants';

/**
 * Text Processor
 * 
 * Handles tokenization of text into words, including:
 * - Word splitting
 * - ORP calculation per word
 * - Punctuation pause detection
 */

/**
 * Check if a character is sentence-ending punctuation
 * Handles trailing quotes like ." or !"
 */
function getSentenceEndPause(word: string): number {
  if (word.length === 0) return 1.0;
  
  const lastChar = word.slice(-1);
  const lastTwo = word.slice(-2);
  
  // Check for closing quotes/brackets after punctuation: ." !" ?) "] etc.
  if (lastTwo.length === 2 && /[.!?]['"""')\]]$/.test(lastTwo)) {
    const punct = lastTwo[0];
    return PAUSE_MULTIPLIERS[punct] || 1.0;
  }
  
  // Check for ellipsis (...)
  if (word.endsWith('...') || word.endsWith('…')) {
    return PAUSE_MULTIPLIERS['.'] || 2.5;
  }
  
  return PAUSE_MULTIPLIERS[lastChar] || 1.0;
}

/**
 * Check if word ends with a comma or other mid-sentence pause
 */
function getMidSentencePause(word: string): number {
  const lastChar = word.slice(-1);
  if ([',', ':', ';', '—', '–'].includes(lastChar)) {
    return PAUSE_MULTIPLIERS[lastChar] || 1.0;
  }
  return 1.0;
}

/**
 * Clean and normalize text before processing
 */
function normalizeText(text: string): string {
  return text
    .replace(/\s+/g, ' ')  // Normalize all whitespace to single space
    .trim();
}

/**
 * Process text into an array of Word objects ready for RSVP display
 */
export function processText(text: string, usePunctuationPause = true): Word[] {
  const normalized = normalizeText(text);
  const words: Word[] = [];
  
  // Simple split by space
  const parts = normalized.split(' ');
  
  for (const word of parts) {
    if (word.length === 0) continue;
    
    // Calculate pause multiplier based on punctuation
    let pauseMultiplier = 1.0;
    if (usePunctuationPause) {
      const sentencePause = getSentenceEndPause(word);
      const midPause = getMidSentencePause(word);
      pauseMultiplier = Math.max(sentencePause, midPause);
    }
    
    words.push({
      text: word,
      orpIndex: getORPIndex(word),
      pauseMultiplier,
    });
  }
  
  return words;
}

/**
 * Calculate the display duration for a word in milliseconds
 */
export function getWordDuration(word: Word, wpm: number): number {
  const baseMs = 60000 / wpm;
  return baseMs * word.pauseMultiplier;
}

/**
 * Get estimated reading time for text at given WPM
 */
export function getEstimatedReadingTime(words: Word[], wpm: number): number {
  let totalMs = 0;
  for (const word of words) {
    totalMs += getWordDuration(word, wpm);
  }
  return totalMs;
}

/**
 * Format milliseconds as human-readable time
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}
