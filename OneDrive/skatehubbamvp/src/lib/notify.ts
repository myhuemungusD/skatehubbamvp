import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getUserEmail } from "./userManagement";

/**
 * Send turn notification email by UID
 */
export async function sendTurnEmailByUid(playerUid: string, gameId: string) {
  try {
    const email = await getUserEmail(playerUid);
    if (!email) {
      console.error("No email found for user:", playerUid);
      return;
    }

    await addDoc(collection(db, "mail"), {
      to: [email],
      message: {
        subject: "Your turn in SKATE",
        text: `Opponent uploaded a trick. Respond here: https://skatehubba.com/game/${gameId}`
      }
    });
    console.log("Turn email sent to:", email);
  } catch (err) {
    console.error("Error sending turn email:", err);
  }
}

/**
 * Send an email via the Firestore Trigger Email extension (direct email)
 */
export async function sendTurnEmail(to: string, gameId: string) {
  try {
    await addDoc(collection(db, "mail"), {
      to: [to],
      message: {
        subject: "Your turn in SKATE",
        text: `Opponent uploaded a trick. Respond here: https://skatehubba.com/game/${gameId}`
      }
    });
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

/**
 * Send game invitation email
 */
export async function sendInviteEmail(to: string, fromEmail: string, gameId: string) {
  try {
    await addDoc(collection(db, "mail"), {
      to: [to],
      message: {
        subject: "🛹 You're invited to a SKATE game!",
        text: `${fromEmail} has challenged you to a game of SKATE on SkateHubba! Join here: https://skatehubba.com/game/${gameId}`
      }
    });
  } catch (err) {
    console.error("Error sending invite email:", err);
  }
}

/**
 * Send game finished notification by UID
 */
export async function sendGameFinishedEmailByUid(playerUid: string, won: boolean, opponentUid: string, gameId: string) {
  try {
    const playerEmail = await getUserEmail(playerUid);
    const opponentEmail = await getUserEmail(opponentUid);
    
    if (!playerEmail) {
      console.error("No email found for player:", playerUid);
      return;
    }

    const subject = won ? "🏆 You won the SKATE game!" : "😅 Game over - Better luck next time!";
    const text = won 
      ? `Congratulations! You won the SKATE game${opponentEmail ? ` against ${opponentEmail}` : ''}. View game: https://skatehubba.com/game/${gameId}`
      : `Game over!${opponentEmail ? ` ${opponentEmail} won this SKATE game.` : ''} Ready for a rematch? https://skatehubba.com/lobby`;

    await addDoc(collection(db, "mail"), {
      to: [playerEmail],
      message: {
        subject,
        text
      }
    });
    console.log("Game finished email sent to:", playerEmail);
  } catch (err) {
    console.error("Error sending game finished email:", err);
  }
}

/**
 * Send game finished notification (direct email)
 */
export async function sendGameFinishedEmail(to: string, won: boolean, opponentEmail: string, gameId: string) {
  const subject = won ? "🏆 You won the SKATE game!" : "😅 Game over - Better luck next time!";
  const text = won 
    ? `Congratulations! You won the SKATE game against ${opponentEmail}. View game: https://skatehubba.com/game/${gameId}`
    : `Game over! ${opponentEmail} won this SKATE game. Ready for a rematch? https://skatehubba.com/lobby`;

  try {
    await addDoc(collection(db, "mail"), {
      to: [to],
      message: {
        subject,
        text
      }
    });
  } catch (err) {
    console.error("Error sending game finished email:", err);
  }
}