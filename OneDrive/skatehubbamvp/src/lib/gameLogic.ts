// src/lib/gameLogic.ts
import { doc, updateDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { sendGameFinishedEmailByUid } from "./notify";
import { updateUserStats } from "./userManagement";

export type SkateLetters = '' | 'S' | 'SK' | 'SKA' | 'SKAT' | 'SKATE';

interface Game {
  createdBy: string;
  createdByEmail?: string;
  opponent: string;
  opponentEmail?: string;
  letters: Record<string, string>;
  turn: string;
  status: "waiting" | "in-progress" | "finished";
}

/**
 * Add a letter to a player's SKATE score
 */
export function addLetterToPlayer(currentLetters: string): SkateLetters {
  const progression = ['', 'S', 'SK', 'SKA', 'SKAT', 'SKATE'];
  const currentIndex = progression.indexOf(currentLetters as SkateLetters);
  
  if (currentIndex === -1 || currentIndex >= progression.length - 1) {
    return 'SKATE'; // Already at SKATE or invalid
  }
  
  return progression[currentIndex + 1] as SkateLetters;
}

/**
 * Check if a player has lost (spelled SKATE)
 */
export function hasPlayerLost(letters: string): boolean {
  return letters === 'SKATE';
}

/**
 * Switch turn to the other player
 */
export function getNextPlayer(currentPlayer: string, createdBy: string, opponent: string): string {
  return currentPlayer === createdBy ? opponent : createdBy;
}

/**
 * Create a round when a player uploads a trick
 */
export async function createRound(
  gameId: string, 
  playerId: string, 
  videoUrl: string, 
  trickName?: string,
  isResponse = false,
  landed = false
) {
  try {
    const roundData = {
      player: playerId,
      videoUrl,
      trickName: trickName || "Unnamed Trick",
      isResponse,
      landed: isResponse ? landed : true, // Setting trick = always landed, response can be missed
      createdAt: Date.now(),
    };

    const roundRef = await addDoc(collection(db, "games", gameId, "rounds"), roundData);
    return roundRef.id;
  } catch (error) {
    console.error("Error creating round:", error);
    throw error;
  }
}

/**
 * Handle when a player misses a trick (give them a letter)
 */
export async function playerMissedTrick(gameId: string, playerId: string) {
  try {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (!gameSnap.exists()) {
      throw new Error("Game not found");
    }

    const game = gameSnap.data() as Game;
    const currentLetters = game.letters[playerId] || "";
    const newLetters = addLetterToPlayer(currentLetters);
    
    // Update player's letters
    const updates: any = {
      [`letters.${playerId}`]: newLetters,
      updatedAt: Date.now(),
    };

    // Check if player lost
    if (hasPlayerLost(newLetters)) {
      updates.status = "finished";
      updates.winner = getNextPlayer(playerId, game.createdBy, game.opponent);
      updates.loser = playerId;
    } else {
      // Continue game, switch turn
      updates.turn = getNextPlayer(playerId, game.createdBy, game.opponent);
    }

    await updateDoc(gameRef, updates);

    // Send email notifications and update stats if game finished
    if (hasPlayerLost(newLetters)) {
      const winnerId = updates.winner;
      const loserId = playerId;
      
      try {
        // Send email notifications
        await Promise.all([
          sendGameFinishedEmailByUid(winnerId, true, loserId, gameId),
          sendGameFinishedEmailByUid(loserId, false, winnerId, gameId)
        ]);

        // Update user stats
        await Promise.all([
          updateUserStats(winnerId, 'won'),
          updateUserStats(loserId, 'lost')
        ]);
        
        console.log("Game finished notifications and stats updated");
      } catch (error) {
        console.warn("Failed to send game finished notifications or update stats:", error);
      }
    }
    
    return {
      newLetters,
      gameFinished: hasPlayerLost(newLetters),
      winner: updates.winner,
      loser: updates.loser,
    };
  } catch (error) {
    console.error("Error handling missed trick:", error);
    throw error;
  }
}

/**
 * Handle when a player lands a trick (no letter, switch turn)
 */
export async function playerLandedTrick(gameId: string, currentPlayerId: string) {
  try {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (!gameSnap.exists()) {
      throw new Error("Game not found");
    }

    const game = gameSnap.data() as Game;
    const nextPlayer = getNextPlayer(currentPlayerId, game.createdBy, game.opponent);
    
    await updateDoc(gameRef, {
      turn: nextPlayer,
      updatedAt: Date.now(),
    });

    return { nextPlayer };
  } catch (error) {
    console.error("Error handling landed trick:", error);
    throw error;
  }
}

/**
 * Initialize a new game when opponent joins
 */
export async function initializeGame(gameId: string, createdBy: string, opponent: string) {
  try {
    const gameRef = doc(db, "games", gameId);
    
    await updateDoc(gameRef, {
      opponent,
      status: "in-progress",
      letters: {
        [createdBy]: "",
        [opponent]: "",
      },
      turn: createdBy, // Creator starts
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error initializing game:", error);
    throw error;
  }
}

/**
 * Get game statistics for a player
 */
export function calculateGameStats(letters: Record<string, string>, playerId: string) {
  const playerLetters = letters[playerId] || "";
  
  return {
    lettersCount: playerLetters.length,
    isClose: playerLetters.length >= 4, // SKAT = danger zone
    hasLost: hasPlayerLost(playerLetters),
  };
}

/**
 * Format letters for display with styling
 */
export function formatLettersDisplay(letters: string): string[] {
  const skateArray = ['S', 'K', 'A', 'T', 'E'];
  const playerLetters = letters.split('');
  
  return skateArray.map((letter, index) => {
    if (index < playerLetters.length) {
      return letter; // Player has this letter (red)
    }
    return ''; // Player doesn't have this letter yet (gray)
  });
}

/**
 * Validate if a game move is legal
 */
export function isValidGameMove(
  game: Game, 
  playerId: string, 
  moveType: 'set_trick' | 'respond_to_trick'
): { valid: boolean; reason?: string } {
  
  // Check if it's player's turn
  if (game.turn !== playerId) {
    return { valid: false, reason: "It's not your turn" };
  }

  // Check if game is still active
  if (game.status !== "in-progress") {
    return { valid: false, reason: "Game is not in progress" };
  }

  // Check if player is in the game
  if (playerId !== game.createdBy && playerId !== game.opponent) {
    return { valid: false, reason: "You are not a player in this game" };
  }

  return { valid: true };
}