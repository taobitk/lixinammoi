export interface PrizeTier {
  id: string;
  amount: number;
  probability: number; // Percentage (0-100)
  color: string;
}

export interface PrizeResult {
  amount: number;
  timestamp: number;
  wish: string;
}

export enum AppState {
  SETUP = 'SETUP',
  PLAYING = 'PLAYING',
}

export enum OpeningState {
  IDLE = 'IDLE',
  SHAKING = 'SHAKING', // The suspense phase
  REVEALED = 'REVEALED',
}