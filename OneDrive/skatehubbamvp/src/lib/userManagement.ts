// src/lib/userManagement.ts
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: number;
  updatedAt: number;
  stats?: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    tricksLanded: number;
    tricksMissed: number;
  };
}

/**
 * Create new user account and store profile in Firestore
 */
export async function signup(email: string, password: string, displayName?: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // Save user record in Firestore
    const userProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName: displayName || result.user.displayName || email.split('@')[0],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stats: {
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
        tricksLanded: 0,
        tricksMissed: 0,
      }
    };

    await setDoc(doc(db, "users", result.user.uid), userProfile);
    console.log("User profile created in Firestore:", userProfile);

    return result.user;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

/**
 * Sign in existing user and ensure profile exists in Firestore
 */
export async function signin(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if user profile exists, create if missing
    await ensureUserProfile(result.user);
    
    return result.user;
  } catch (error) {
    console.error("Error during signin:", error);
    throw error;
  }
}

/**
 * Ensure user profile exists in Firestore (for existing users)
 */
export async function ensureUserProfile(user: User) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Create missing profile
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stats: {
          gamesPlayed: 0,
          gamesWon: 0,
          gamesLost: 0,
          tricksLanded: 0,
          tricksMissed: 0,
        }
      };

      await setDoc(userRef, userProfile);
      console.log("Created missing user profile:", userProfile);
    }
  } catch (error) {
    console.error("Error ensuring user profile:", error);
  }
}

/**
 * Get user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userSnap = await getDoc(doc(db, "users", uid));
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

/**
 * Get user email by UID (for notifications)
 */
export async function getUserEmail(uid: string): Promise<string | null> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.email || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Date.now(),
    });
    console.log("User profile updated:", updates);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

/**
 * Update user game stats
 */
export async function updateUserStats(uid: string, gameResult: 'won' | 'lost', tricksLanded: number = 0, tricksMissed: number = 0) {
  try {
    const profile = await getUserProfile(uid);
    if (!profile) return;

    const updatedStats = {
      gamesPlayed: (profile.stats?.gamesPlayed || 0) + 1,
      gamesWon: (profile.stats?.gamesWon || 0) + (gameResult === 'won' ? 1 : 0),
      gamesLost: (profile.stats?.gamesLost || 0) + (gameResult === 'lost' ? 1 : 0),
      tricksLanded: (profile.stats?.tricksLanded || 0) + tricksLanded,
      tricksMissed: (profile.stats?.tricksMissed || 0) + tricksMissed,
    };

    await updateUserProfile(uid, { stats: updatedStats });
    console.log("User stats updated:", updatedStats);
  } catch (error) {
    console.error("Error updating user stats:", error);
  }
}