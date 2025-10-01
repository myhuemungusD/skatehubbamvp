// src/lib/gameFlow.ts
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { sendTurnEmailByUid } from "./notify";
import { createRound } from "./gameLogic";

/**
 * Complete game flow handler that demonstrates the UID→email system
 */
export async function handleTrickUpload(
  gameId: string,
  playerId: string,
  videoUrl: string,
  trickName?: string
) {
  try {
    console.log("🎥 Processing trick upload for game:", gameId);
    
    // 1. Get current game state
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (!gameSnap.exists()) {
      throw new Error("Game not found");
    }
    
    const game = gameSnap.data();
    console.log("📋 Current game state:", game);
    
    // 2. Create the round record
    const roundId = await createRound(gameId, playerId, videoUrl, trickName);
    console.log("✅ Round created:", roundId);
    
    // 3. Switch turn to opponent
    const nextPlayer = playerId === game.createdBy ? game.opponent : game.createdBy;
    await updateDoc(gameRef, {
      turn: nextPlayer,
      updatedAt: Date.now(),
    });
    console.log("🔄 Turn switched to:", nextPlayer);
    
    // 4. 🔑 KEY: Notify opponent using UID→email lookup
    // This is where the magic happens - we only know the UID,
    // but the notification system looks up their email from Firestore
    await notifyOpponent(nextPlayer, gameId);
    
    return { success: true, nextPlayer, roundId };
  } catch (error) {
    console.error("❌ Error handling trick upload:", error);
    throw error;
  }
}

/**
 * Notify opponent of their turn using UID→email lookup
 * This demonstrates the complete flow:
 * 1. Receive UID (from game state)
 * 2. Look up email in Firestore users collection
 * 3. Send email via Firebase extension
 */
export async function notifyOpponent(opponentUid: string, gameId: string) {
  try {
    console.log("📧 Notifying opponent:", opponentUid);
    
    // The sendTurnEmailByUid function will:
    // 1. Query users/{opponentUid} to get email
    // 2. Create document in mail/ collection
    // 3. Firebase extension sends email automatically
    await sendTurnEmailByUid(opponentUid, gameId);
    
    console.log("✅ Turn notification queued for:", opponentUid);
  } catch (error) {
    console.error("❌ Failed to notify opponent:", error);
    // Don't throw - game should continue even if notification fails
  }
}

/**
 * Example of the complete data flow:
 * 1. Player uploads trick → handleTrickUpload()
 * 2. Game state updated → turn switches
 * 3. notifyOpponent(uid, gameId) called
 * 4. sendTurnEmailByUid() looks up email from users/{uid}
 * 5. Email document created in mail/ collection
 * 6. Firebase extension sends email to opponent
 * 7. Opponent gets notification: "Your turn in SKATE"
 */