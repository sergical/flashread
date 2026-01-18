import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

const url = 'https://paulgraham.com/foundermode.html';
const response = await fetch(url);
const html = await response.text();

const dom = new JSDOM(html, { url });
const reader = new Readability(dom.window.document);
const article = reader.parse();

console.log('=== article.content (first 2000 chars) ===');
console.log(article.content.substring(0, 2000));

console.log('\n\n=== After replacing <br> with space ===');
const withSpaces = article.content.replace(/<br\s*\/?>/gi, ' ');
console.log(withSpaces.substring(0, 2000));

// Create DOM to get textContent
const temp = new JSDOM(`<div>${withSpaces}</div>`);
const text = temp.window.document.querySelector('div').textContent;
const normalized = text.replace(/\s+/g, ' ').trim();

console.log('\n\n=== Final normalized text (first 500 chars) ===');
console.log(normalized.substring(0, 500));

console.log('\n\n=== First 30 words ===');
const words = normalized.split(' ').slice(0, 30);
words.forEach((w, i) => console.log(`${i}: "${w}"`));

// Check for problem patterns
console.log('\n\n=== Checking for concatenated words (no space between) ===');
const allWords = normalized.split(' ');
allWords.forEach((w, i) => {
  // Check if word has lowercase followed by uppercase (like "raised.The")
  if (/[a-z][A-Z]/.test(w) || /\.[A-Za-z]/.test(w)) {
    console.log(`PROBLEM at ${i}: "${w}"`);
  }
});
