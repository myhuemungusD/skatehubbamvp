// src/types/firestore.ts

// User profile
export interface UserDoc {
  displayName: string;
  avatarUrl?: string;
  createdAt: string;  // ISO timestamp
  updatedAt: string;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    points: number;
  };
}

// Game document
export interface GameDoc {
  players: {
    A: { uid: string; displayName: string };
    B: { uid: string; displayName: string };
  };
  status: "active" | "finished" | "canceled";
  turn: "A" | "B";
  allowSpectators: boolean;
  createdAt: string;
  updatedAt: string;
  score: {
    A: string; // e.g. "S", "SK"
    B: string;
  };
  videos: {
    player: "A" | "B";
    storagePath: string;
  }[];
}

// Lobby document
export interface LobbyDoc {
  hostUid: string;
  hostDisplayName: string;
  status: "open" | "inProgress" | "closed";
  allowSpectators: boolean;
  createdAt: string;
  gameId: string | null;
}

// Rate limit document
export interface RateLimitDoc {
  lastAction: string;
  actions: number;
}
