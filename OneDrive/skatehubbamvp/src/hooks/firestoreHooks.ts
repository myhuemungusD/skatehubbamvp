// src/hooks/firestoreHooks.ts

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  onSnapshot as onQuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Game, GameRound, GameWithProfiles, COLLECTIONS } from "@/types/firestore";

// --- USERS ---
export function useUser(uid: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ref = doc(db, COLLECTIONS.USERS, uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setUser(snap.exists() ? (snap.data() as User) : null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useUser:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  return { user, loading, error };
}

// --- GAMES ---
export function useGame(gameId: string | null) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setLoading(false);
      setError(null);
      return;
    }

    const ref = doc(db, COLLECTIONS.GAMES, gameId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setGame(snap.exists() ? (snap.data() as Game) : null);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useGame:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [gameId]);

  return { game, loading, error };
}

// --- GAME WITH PROFILES (includes resolved user data) ---
export function useGameWithProfiles(gameId: string | null) {
  const [gameWithProfiles, setGameWithProfiles] = useState<GameWithProfiles | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setGameWithProfiles(null);
      setLoading(false);
      setError(null);
      return;
    }

    let gameUnsub: (() => void) | null = null;
    let userUnsubs: (() => void)[] = [];

    // Subscribe to game
    const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
    gameUnsub = onSnapshot(
      gameRef,
      async (gameSnap) => {
        if (!gameSnap.exists()) {
          setGameWithProfiles(null);
          setLoading(false);
          return;
        }

        const game = gameSnap.data() as Game;
        
        // Create initial game with profiles object
        const gameWithProfiles: GameWithProfiles = {
          ...game,
          id: gameId,
          createdByProfile: undefined,
          opponentProfile: undefined,
        };

        // Clean up previous user subscriptions
        userUnsubs.forEach(unsub => unsub());
        userUnsubs = [];

        // Subscribe to creator profile
        const creatorRef = doc(db, COLLECTIONS.USERS, game.createdBy);
        const creatorUnsub = onSnapshot(creatorRef, (creatorSnap) => {
          if (creatorSnap.exists()) {
            gameWithProfiles.createdByProfile = creatorSnap.data() as User;
            setGameWithProfiles({ ...gameWithProfiles });
          }
        });
        userUnsubs.push(creatorUnsub);

        // Subscribe to opponent profile if exists
        if (game.opponent) {
          const opponentRef = doc(db, COLLECTIONS.USERS, game.opponent);
          const opponentUnsub = onSnapshot(opponentRef, (opponentSnap) => {
            if (opponentSnap.exists()) {
              gameWithProfiles.opponentProfile = opponentSnap.data() as User;
              setGameWithProfiles({ ...gameWithProfiles });
            }
          });
          userUnsubs.push(opponentUnsub);
        }

        setGameWithProfiles(gameWithProfiles);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useGameWithProfiles:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (gameUnsub) gameUnsub();
      userUnsubs.forEach(unsub => unsub());
    };
  }, [gameId]);

  return { gameWithProfiles, loading, error };
}

// --- GAME ROUNDS ---
export function useGameRounds(gameId: string | null) {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setRounds([]);
      setLoading(false);
      setError(null);
      return;
    }

    const q = query(
      collection(db, COLLECTIONS.GAMES, gameId, COLLECTIONS.ROUNDS),
      orderBy("createdAt", "asc")
    );
    
    const unsub = onQuerySnapshot(
      q,
      (snap) => {
        setRounds(snap.docs.map((d) => d.data() as GameRound));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useGameRounds:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [gameId]);

  return { rounds, loading, error };
}

// --- USER'S GAMES ---
export function useUserGames(uid: string | null) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setGames([]);
      setLoading(false);
      setError(null);
      return;
    }

    let unsubscribers: (() => void)[] = [];

    // Query games where user is creator
    const createdGamesQuery = query(
      collection(db, COLLECTIONS.GAMES),
      where("createdBy", "==", uid),
      orderBy("updatedAt", "desc")
    );

    // Query games where user is opponent
    const opponentGamesQuery = query(
      collection(db, COLLECTIONS.GAMES),
      where("opponent", "==", uid),
      orderBy("updatedAt", "desc")
    );

    let createdGames: Game[] = [];
    let opponentGames: Game[] = [];

    const updateCombinedGames = () => {
      const allGames = [...createdGames, ...opponentGames];
      // Remove duplicates and sort by updatedAt
      const uniqueGames = allGames.filter((game, index, arr) => 
        arr.findIndex(g => JSON.stringify(g) === JSON.stringify(game)) === index
      );
      uniqueGames.sort((a, b) => b.updatedAt - a.updatedAt);
      setGames(uniqueGames);
      setLoading(false);
      setError(null);
    };

    // Subscribe to created games
    const createdUnsub = onQuerySnapshot(
      createdGamesQuery,
      (snap) => {
        createdGames = snap.docs.map((d) => d.data() as Game);
        updateCombinedGames();
      },
      (err) => {
        console.error("Error in useUserGames (created):", err);
        setError(err.message);
        setLoading(false);
      }
    );
    unsubscribers.push(createdUnsub);

    // Subscribe to opponent games
    const opponentUnsub = onQuerySnapshot(
      opponentGamesQuery,
      (snap) => {
        opponentGames = snap.docs.map((d) => d.data() as Game);
        updateCombinedGames();
      },
      (err) => {
        console.error("Error in useUserGames (opponent):", err);
        setError(err.message);
        setLoading(false);
      }
    );
    unsubscribers.push(opponentUnsub);

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [uid]);

  return { games, loading, error };
}

// --- WAITING GAMES (for lobby) ---
export function useWaitingGames(excludeUid?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, COLLECTIONS.GAMES),
      where("status", "==", "waiting"),
      orderBy("createdAt", "desc")
    );
    
    const unsub = onQuerySnapshot(
      q,
      (snap) => {
        let waitingGames = snap.docs.map((d) => d.data() as Game);
        
        // Filter out games created by current user
        if (excludeUid) {
          waitingGames = waitingGames.filter(game => game.createdBy !== excludeUid);
        }
        
        setGames(waitingGames);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error in useWaitingGames:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [excludeUid]);

  return { games, loading, error };
}

// --- MULTIPLE USERS (for resolving UIDs to profiles) ---
export function useUsers(uids: string[]) {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uids.length === 0) {
      setUsers({});
      setLoading(false);
      setError(null);
      return;
    }

    const unsubscribers: (() => void)[] = [];
    const userMap: Record<string, User> = {};

    const updateUsers = () => {
      setUsers({ ...userMap });
      setLoading(false);
      setError(null);
    };

    // Subscribe to each user
    uids.forEach(uid => {
      if (uid) {
        const userRef = doc(db, COLLECTIONS.USERS, uid);
        const unsub = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              userMap[uid] = snap.data() as User;
            } else {
              delete userMap[uid];
            }
            updateUsers();
          },
          (err) => {
            console.error(`Error in useUsers for uid ${uid}:`, err);
            setError(err.message);
          }
        );
        unsubscribers.push(unsub);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [JSON.stringify(uids.sort())]); // Stringify and sort to avoid unnecessary re-renders

  return { users, loading, error };
}

// --- COMPOSITE HOOK: Game + Rounds + User Profiles ---
export function useGameComplete(gameId: string | null) {
  const { gameWithProfiles, loading: gameLoading, error: gameError } = useGameWithProfiles(gameId);
  const { rounds, loading: roundsLoading, error: roundsError } = useGameRounds(gameId);

  const loading = gameLoading || roundsLoading;
  const error = gameError || roundsError;

  return {
    game: gameWithProfiles,
    rounds,
    loading,
    error
  };
}