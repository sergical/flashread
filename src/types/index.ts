// Type definitions for FlashRead

export interface FlashReadSettings {
  wpm: number;
  fontSize: number;
  fontFamily: string;
  theme: 'dark' | 'light';
  showGuideLines: boolean;
  showProgressBar: boolean;
  showWpmCounter: boolean;
  autoRamp: boolean;
  autoRampInterval: number; // seconds between speed increases
  autoRampIncrement: number; // WPM to add each interval
  punctuationPause: boolean;
}

export interface ReadingSession {
  id: string;
  startTime: number;
  endTime?: number;
  wordsRead: number;
  totalWords: number;
  averageWpm: number;
  startWpm: number;
  endWpm: number;
}

export interface ReadingStats {
  wordsRead: number;
  averageWpm: number;
  timeSpentMs: number;
  startWpm: number;
  endWpm: number;
}

export interface Word {
  text: string;
  orpIndex: number;
  pauseMultiplier: number;
}

export interface RSVPState {
  words: Word[];
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;
  startTime: number | null;
  wordsDisplayed: number;
}

export type MessageType = 
  | 'START_READING'
  | 'STOP_READING'
  | 'GET_SELECTION'
  | 'GET_ARTICLE'
  | 'OPEN_DEMO';

export interface Message {
  type: MessageType;
  payload?: unknown;
}

export interface StartReadingPayload {
  text: string;
  wpm?: number;
}
