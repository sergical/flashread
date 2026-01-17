/**
 * ORP (Optimal Recognition Point) Algorithm
 * 
 * Calculates the optimal letter position in a word for fastest recognition.
 * The word will be positioned so this letter aligns with the center of the screen.
 */

/**
 * Get the ORP index (0-based) for a word based on its length.
 * 
 * Algorithm (from spec):
 * - Words ≤1 letter: center whole (index 0)
 * - 2–5 letters: position 1 (index 1)
 * - 6–9 letters: position 2 (index 2)
 * - 10–13 letters: position 3 (index 3)
 * - 14+ letters: position 4 (index 4)
 */
export function getORPIndex(word: string): number {
  // Strip punctuation for length calculation but keep the original word
  const cleanWord = word.replace(/[^\w]/g, '');
  const length = cleanWord.length;
  
  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

/**
 * Find the actual character index in the original word that corresponds to the ORP.
 * This accounts for leading punctuation (like quotes).
 */
export function getORPCharIndex(word: string): number {
  const orpIndex = getORPIndex(word);
  
  // Find the start of the actual word (skip leading punctuation)
  let letterCount = 0;
  for (let i = 0; i < word.length; i++) {
    if (/\w/.test(word[i])) {
      if (letterCount === orpIndex) {
        return i;
      }
      letterCount++;
    }
  }
  
  // Fallback: return the ORP index clamped to word length
  return Math.min(orpIndex, word.length - 1);
}

/**
 * Split a word into three parts: before ORP, ORP character, after ORP.
 * Used for rendering with the red pivot letter.
 */
export function splitWordAtORP(word: string): {
  before: string;
  pivot: string;
  after: string;
} {
  if (word.length === 0) {
    return { before: '', pivot: '', after: '' };
  }
  
  const orpCharIndex = getORPCharIndex(word);
  
  return {
    before: word.slice(0, orpCharIndex),
    pivot: word[orpCharIndex] || '',
    after: word.slice(orpCharIndex + 1),
  };
}

/**
 * Calculate the pixel offset needed to center the ORP character.
 * Returns the offset to apply to the word container (negative = shift left).
 */
export function calculateORPOffset(
  word: string,
  charWidth: number
): number {
  const orpCharIndex = getORPCharIndex(word);
  // Calculate how many characters the ORP is from the start
  // We need to shift left by (orpCharIndex + 0.5) characters to center the pivot
  const charsBeforeCenter = orpCharIndex + 0.5;
  return -charsBeforeCenter * charWidth;
}
