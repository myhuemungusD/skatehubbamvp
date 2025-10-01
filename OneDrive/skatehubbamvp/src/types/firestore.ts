// src/types/firestore.ts

/**
 * User profile stored in users/{uid} collection
 * Enables UID→email mapping for privacy-safe notifications
 */
export interface User {
  email: string;
  displayName?: string;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    tricksLanded: number;
    tricksMissed: number;
  };
}

/**
 * Game document stored in games/{gameId} collection
 * Uses UIDs only (no emails) for privacy
 */
export interface Game {
  createdBy: string; // UID of game creator
  opponent: string; // UID of opponent (empty string if waiting)
  letters: Record<string, string>; // { uid: "SK", uid2: "S" } - SKATE letter progression
  turn: string; // UID of whose turn it is
  status: "waiting" | "in-progress" | "finished";
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

/**
 * Game round stored in games/{gameId}/rounds/{roundId} subcollection
 * Contains trick videos and attempt results
 */
export interface GameRound {
  player: string; // UID of player who uploaded
  videoUrl: string; // Firebase Storage URL
  trickName: string; // Name of trick attempted
  isResponse: boolean; // true if responding to opponent's trick
  landed: boolean; // whether the trick was successfully landed
  createdAt: number; // Unix timestamp
}

/**
 * Email queue document for Firebase Trigger Email extension
 * Created in mail/{emailId} collection
 */
export interface EmailDocument {
  to: string[]; // Array of recipient email addresses
  message: {
    subject: string;
    text?: string;
    html?: string;
  };
  template?: {
    name: string;
    data: Record<string, any>;
  };
}

/**
 * Client-side game data with resolved email addresses
 * Used in UI components after UID→email lookup
 */
export interface GameWithProfiles extends Omit<Game, 'createdBy' | 'opponent'> {
  id: string; // Firestore document ID
  createdBy: string; // UID
  createdByProfile?: User; // Resolved user profile
  opponent: string; // UID
  opponentProfile?: User; // Resolved user profile
}

/**
 * SKATE letter progression constants
 */
export const SKATE_LETTERS = ['S', 'K', 'A', 'T', 'E'] as const;
export type SkateLetterPosition = 0 | 1 | 2 | 3 | 4;

/**
 * Game status type guards
 */
export function isGameWaiting(game: Game): boolean {
  return game.status === 'waiting';
}

export function isGameInProgress(game: Game): boolean {
  return game.status === 'in-progress';
}

export function isGameFinished(game: Game): boolean {
  return game.status === 'finished';
}

/**
 * Helper to get next SKATE letter
 */
export function getNextSkateLetter(currentLetters: string): string {
  const nextIndex = currentLetters.length;
  if (nextIndex >= SKATE_LETTERS.length) {
    return 'SKATE'; // Game over
  }
  return currentLetters + SKATE_LETTERS[nextIndex];
}

/**
 * Check if player has spelled SKATE (lost the game)
 */
export function hasPlayerLost(letters: string): boolean {
  return letters === 'SKATE';
}

/**
 * Firebase Timestamp conversion helpers
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp);
}

export function dateToTimestamp(date: Date): number {
  return date.getTime();
}

export function nowTimestamp(): number {
  return Date.now();
}

// Service Functions and Utilities

/**
 * Collection references and paths
 */
export const COLLECTIONS = {
  USERS: 'users',
  GAMES: 'games',
  ROUNDS: 'rounds',
  MAIL: 'mail'
} as const;

/**
 * Game creation data (for creating new games)
 */
export interface CreateGameData {
  createdBy: string; // UID
  opponent?: string; // Optional UID if inviting specific player
}

/**
 * Game update data (for game state changes)
 */
export interface UpdateGameData {
  opponent?: string;
  letters?: Record<string, string>;
  turn?: string;
  status?: Game['status'];
  updatedAt: number;
}

/**
 * User profile creation data
 */
export interface CreateUserData {
  email: string;
  displayName?: string;
  createdAt: number;
  updatedAt: number;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    tricksLanded: number;
    tricksMissed: number;
  };
}

/**
 * Round creation data
 */
export interface CreateRoundData {
  player: string; // UID
  videoUrl: string;
  trickName: string;
  isResponse: boolean;
  landed: boolean;
  createdAt: number;
}

/**
 * Game state helpers
 */
export function getGameWinner(game: Game): string | null {
  if (game.status !== 'finished') return null;
  
  const players = [game.createdBy, game.opponent];
  
  // Find player who hasn't spelled SKATE
  for (const player of players) {
    const playerLetters = game.letters[player] || '';
    if (!hasPlayerLost(playerLetters)) {
      return player;
    }
  }
  
  return null; // Shouldn't happen in normal game flow
}

/**
 * Get player's current SKATE letters
 */
export function getPlayerLetters(game: Game, playerId: string): string {
  return game.letters[playerId] || '';
}

/**
 * Check if it's a player's turn
 */
export function isPlayerTurn(game: Game, playerId: string): boolean {
  return game.turn === playerId && game.status === 'in-progress';
}

/**
 * Get opponent's UID
 */
export function getOpponentId(game: Game, playerId: string): string {
  return playerId === game.createdBy ? game.opponent : game.createdBy;
}

/**
 * Email notification data structure
 */
export interface NotificationData {
  type: 'game_invite' | 'turn_notification' | 'game_finished' | 'round_completed';
  gameId: string;
  recipientEmail: string;
  senderEmail?: string;
  gameUrl?: string;
  additionalData?: Record<string, any>;
}

/**
 * Database paths helper
 */
export class FirestorePaths {
  static user(uid: string): string {
    return `${COLLECTIONS.USERS}/${uid}`;
  }
  
  static game(gameId: string): string {
    return `${COLLECTIONS.GAMES}/${gameId}`;
  }
  
  static round(gameId: string, roundId: string): string {
    return `${COLLECTIONS.GAMES}/${gameId}/${COLLECTIONS.ROUNDS}/${roundId}`;
  }
  
  static rounds(gameId: string): string {
    return `${COLLECTIONS.GAMES}/${gameId}/${COLLECTIONS.ROUNDS}`;
  }
  
  static email(emailId: string): string {
    return `${COLLECTIONS.MAIL}/${emailId}`;
  }
}

/**
 * Validation helpers
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateTrickName(trickName: string): boolean {
  return trickName.trim().length > 0 && trickName.length <= 100;
}

export function validateGameStatus(status: string): status is Game['status'] {
  return ['waiting', 'in-progress', 'finished'].includes(status);
}

/**
 * Game statistics helpers
 */
export function calculateWinRate(gamesWon: number, gamesPlayed: number): number {
  if (gamesPlayed === 0) return 0;
  return Math.round((gamesWon / gamesPlayed) * 100);
}

export function calculateTrickSuccessRate(tricksLanded: number, tricksMissed: number): number {
  const totalTricks = tricksLanded + tricksMissed;
  if (totalTricks === 0) return 0;
  return Math.round((tricksLanded / totalTricks) * 100);
}

/**
 * Error types for better error handling
 */
export class GameError extends Error {
  constructor(
    message: string,
    public code: 'GAME_NOT_FOUND' | 'INVALID_TURN' | 'GAME_FINISHED' | 'UNAUTHORIZED' | 'INVALID_DATA'
  ) {
    super(message);
    this.name = 'GameError';
  }
}

export class UserError extends Error {
  constructor(
    message: string, 
    public code: 'USER_NOT_FOUND' | 'INVALID_EMAIL' | 'UNAUTHORIZED'
  ) {
    super(message);
    this.name = 'UserError';
  }
}