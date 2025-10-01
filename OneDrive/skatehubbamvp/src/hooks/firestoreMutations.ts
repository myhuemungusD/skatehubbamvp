// src/hooks/firestoreMutations.ts

import { useState } from "react";
import { 
  signup, 
  ensureUserProfile, 
  updateUserProfile, 
  updateUserStats 
} from "@/lib/userManagement";
import { 
  createRound, 
  playerMissedTrick, 
  playerLandedTrick, 
  initializeGame 
} from "@/lib/gameLogic";
import { handleTrickUpload } from "@/lib/gameFlow";
import { 
  sendTurnEmailByUid, 
  sendInviteEmail, 
  sendGameFinishedEmailByUid 
} from "@/lib/notify";
import { 
  clearAllData, 
  seedUsers, 
  seedGames 
} from "@/lib/dbUtils";
import { 
  collection, 
  addDoc, 
  setDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  User, 
  Game, 
  CreateGameData, 
  CreateUserData, 
  CreateRoundData,
  COLLECTIONS,
  nowTimestamp 
} from "@/types/firestore";

// --- USER MUTATIONS ---

export function useSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(email: string, password: string, displayName?: string) {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signup(email, password, displayName);
      setLoading(false);
      return userCredential;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}

export function useCreateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(uid: string, userData: Omit<CreateUserData, 'createdAt' | 'updatedAt' | 'stats'>) {
    setLoading(true);
    setError(null);
    try {
      const now = nowTimestamp();
      const userProfile: CreateUserData = {
        ...userData,
        createdAt: now,
        updatedAt: now,
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          tricksLanded: 0,
          tricksMissed: 0
        }
      };
      
      await setDoc(doc(db, COLLECTIONS.USERS, uid), userProfile);
      setLoading(false);
      return uid;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(uid: string, updates: Partial<User>) {
    setLoading(true);
    setError(null);
    try {
      await updateUserProfile(uid, updates);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function useUpdateUserStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(
    uid: string, 
    gameResult: 'won' | 'lost', 
    tricksLanded: number = 0, 
    tricksMissed: number = 0
  ) {
    setLoading(true);
    setError(null);
    try {
      await updateUserStats(uid, gameResult, tricksLanded, tricksMissed);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

// --- GAME MUTATIONS ---

export function useCreateGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameData: CreateGameData) {
    setLoading(true);
    setError(null);
    try {
      const now = nowTimestamp();
      const game: Game = {
        createdBy: gameData.createdBy,
        opponent: gameData.opponent || '',
        letters: {},
        turn: gameData.createdBy,
        status: gameData.opponent ? 'in-progress' : 'waiting',
        createdAt: now,
        updatedAt: now
      };
      
      const gameRef = await addDoc(collection(db, COLLECTIONS.GAMES), game);
      
      // If there's an opponent, initialize the game
      if (gameData.opponent) {
        await initializeGame(gameRef.id, gameData.createdBy, gameData.opponent);
      }
      
      setLoading(false);
      return gameRef.id;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}

export function useJoinGame() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameId: string, playerUid: string) {
    setLoading(true);
    setError(null);
    try {
      // Update game with opponent and change status
      await updateDoc(doc(db, COLLECTIONS.GAMES, gameId), {
        opponent: playerUid,
        status: 'in-progress',
        updatedAt: nowTimestamp()
      });
      
      // Initialize the game logic
      const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
      // const gameDoc = await getDoc(gameRef);
      // if (gameDoc.exists()) {
      //   const game = gameDoc.data() as Game;
      //   await initializeGame(gameId, game.createdBy, playerUid);
      // }
      
      setLoading(false);
      return gameId;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}

export function useUpdateGameStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameId: string, status: Game['status']) {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, COLLECTIONS.GAMES, gameId), {
        status,
        updatedAt: nowTimestamp()
      });
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

// --- GAME ROUND MUTATIONS ---

export function useAddRound() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameId: string, roundData: CreateRoundData) {
    setLoading(true);
    setError(null);
    try {
      const roundRef = await createRound(
        gameId,
        roundData.player,
        roundData.videoUrl,
        roundData.trickName,
        roundData.isResponse,
        roundData.landed
      );
      setLoading(false);
      return roundRef; // createRound returns the ref, not ref.id
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}

export function useHandleTrickUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(
    gameId: string,
    playerId: string,
    videoFile: File,
    trickName: string,
    isResponse: boolean,
    landed: boolean
  ) {
    setLoading(true);
    setError(null);
    try {
      // handleTrickUpload expects (gameId, playerId, videoUrl, trickName?)
      // For now, we'll need to upload the file first or modify the function
      throw new Error('handleTrickUpload needs to be adapted for file uploads');
      // setLoading(false);
      // return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function usePlayerMissedTrick() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameId: string, playerId: string) {
    setLoading(true);
    setError(null);
    try {
      await playerMissedTrick(gameId, playerId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function usePlayerLandedTrick() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(gameId: string, playerId: string) {
    setLoading(true);
    setError(null);
    try {
      await playerLandedTrick(gameId, playerId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

// --- NOTIFICATION MUTATIONS ---

export function useSendTurnNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(playerUid: string, gameId: string) {
    setLoading(true);
    setError(null);
    try {
      await sendTurnEmailByUid(playerUid, gameId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function useSendInviteNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(toEmail: string, fromEmail: string, gameId: string) {
    setLoading(true);
    setError(null);
    try {
      await sendInviteEmail(toEmail, fromEmail, gameId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function useSendGameFinishedNotification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(playerUid: string, won: boolean, opponentUid: string, gameId: string) {
    setLoading(true);
    setError(null);
    try {
      await sendGameFinishedEmailByUid(playerUid, won, opponentUid, gameId);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

// --- DATABASE UTILITY MUTATIONS ---

export function useClearDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate() {
    setLoading(true);
    setError(null);
    try {
      await clearAllData();
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

export function useSeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate() {
    setLoading(true);
    setError(null);
    try {
      await seedUsers();
      await seedGames();
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }

  return { mutate, loading, error };
}

// --- COMPOSITE MUTATIONS (Multiple operations) ---

export function useCompleteGameSetup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mutate(creatorUid: string, opponentEmail?: string) {
    setLoading(true);
    setError(null);
    try {
      // Create the game
      const gameData: CreateGameData = {
        createdBy: creatorUid,
        opponent: undefined // Will be filled when opponent joins
      };
      
      const gameId = await useCreateGame().mutate(gameData);
      
      if (!gameId) {
        throw new Error('Failed to create game');
      }
      
      // Send invite if opponent email provided
      if (opponentEmail) {
        // Get creator's email for the invite
        // This would need to be implemented based on your user management
        // await sendInviteEmail(opponentEmail, creatorEmail, gameId);
      }
      
      setLoading(false);
      return gameId;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  return { mutate, loading, error };
}