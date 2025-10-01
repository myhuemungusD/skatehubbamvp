// src/types/game.ts
export interface Player {
  uid: string;
  email: string;
  displayName?: string;
  letters: string; // "S", "SK", "SKA", "SKAT", "SKATE"
}

export interface Round {
  id: string;
  roundNumber: number;
  createdAt: number;
  createdBy: string; // uid of player who set the trick
  
  // Trick information
  trickName: string;
  trickVideoUrl: string;
  trickVideoPath: string; // Storage path
  
  // Response information (if this is a response round)
  isResponse?: boolean;
  respondingTo?: string; // roundId of the trick being responded to
  responseVideoUrl?: string;
  responseVideoPath?: string;
  
  // Scoring
  landed: boolean; // true if trick was landed, false if missed
  letterGiven?: boolean; // true if opponent gets a letter for missing
  
  // Status
  status: 'setting_trick' | 'awaiting_response' | 'completed';
}

export interface Game {
  id: string;
  createdAt: number;
  updatedAt: number;
  
  // Players
  createdBy: string; // uid
  opponent?: string; // uid (null until accepted)
  players: {
    [uid: string]: Player;
  };
  
  // Game state
  status: 'waiting_for_opponent' | 'in_progress' | 'finished';
  currentTurn: string; // uid of player whose turn it is
  winner?: string; // uid of winner (first to not spell SKATE)
  loser?: string; // uid of loser (first to spell SKATE)
  
  // Game data
  rounds: Round[];
  currentRound?: string; // roundId of active round
  
  // Settings
  isPublic: boolean; // true for spectator mode
  maxRounds?: number; // optional limit
}

export interface GameInvite {
  id: string;
  createdAt: number;
  from: string; // uid
  to?: string; // uid (null for open invites)
  gameId: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
}

// Helper types for game logic
export type SkateLetters = '' | 'S' | 'SK' | 'SKA' | 'SKAT' | 'SKATE';

export interface GameMove {
  type: 'set_trick' | 'respond_to_trick';
  trickName?: string;
  videoUrl: string;
  videoPath: string;
  landed?: boolean; // for responses
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  tricksLanded: number;
  tricksMissed: number;
  averageLettersPerGame: number;
}