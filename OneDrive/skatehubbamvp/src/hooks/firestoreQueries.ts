// src/hooks/firestoreQueries.ts

import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/lib/userManagement";
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  User, 
  Game, 
  GameRound, 
  GameWithProfiles,
  COLLECTIONS 
} from "@/types/firestore";

// --- USERS ---
export function useUserQuery(uid: string | null) {
  return useQuery<User | null>({
    queryKey: ["user", uid],
    queryFn: async () => {
      if (!uid) return null;
      const profile = await getUserProfile(uid);
      return profile as User | null;
    },
    enabled: !!uid,
    staleTime: 1000 * 60 * 10, // 10 minutes - user profiles don't change often
  });
}

// --- GAMES ---
export function useGameQuery(gameId: string | null) {
  return useQuery<Game | null>({
    queryKey: ["game", gameId],
    queryFn: async () => {
      if (!gameId) return null;
      const gameDoc = await getDoc(doc(db, COLLECTIONS.GAMES, gameId));
      return gameDoc.exists() ? (gameDoc.data() as Game) : null;
    },
    enabled: !!gameId,
    staleTime: 1000 * 30, // 30 seconds - games change frequently during play
  });
}

// --- GAME WITH PROFILES ---
export function useGameWithProfilesQuery(gameId: string | null) {
  return useQuery<GameWithProfiles | null>({
    queryKey: ["gameWithProfiles", gameId],
    queryFn: async () => {
      if (!gameId) return null;
      
      // Get game data
      const gameDoc = await getDoc(doc(db, COLLECTIONS.GAMES, gameId));
      if (!gameDoc.exists()) return null;
      
      const game = gameDoc.data() as Game;
      
      // Get user profiles
      const creatorProfile = await getUserProfile(game.createdBy);
      const opponentProfile = game.opponent ? await getUserProfile(game.opponent) : null;
      
      const gameWithProfiles: GameWithProfiles = {
        ...game,
        id: gameId,
        createdByProfile: creatorProfile as User | undefined,
        opponentProfile: opponentProfile as User | undefined,
      };
      
      return gameWithProfiles;
    },
    enabled: !!gameId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

// --- GAME ROUNDS ---
export function useGameRoundsQuery(gameId: string | null) {
  return useQuery<GameRound[]>({
    queryKey: ["gameRounds", gameId],
    queryFn: async () => {
      if (!gameId) return [];
      
      const roundsQuery = query(
        collection(db, COLLECTIONS.GAMES, gameId, COLLECTIONS.ROUNDS),
        orderBy("createdAt", "asc")
      );
      
      const snapshot = await getDocs(roundsQuery);
      return snapshot.docs.map(doc => doc.data() as GameRound);
    },
    enabled: !!gameId,
    staleTime: 1000 * 10, // 10 seconds - rounds are added frequently during gameplay
  });
}

// --- USER'S GAMES ---
export function useUserGamesQuery(uid: string | null) {
  return useQuery<Game[]>({
    queryKey: ["userGames", uid],
    queryFn: async () => {
      if (!uid) return [];
      
      // Get games where user is creator
      const createdGamesQuery = query(
        collection(db, COLLECTIONS.GAMES),
        where("createdBy", "==", uid),
        orderBy("updatedAt", "desc")
      );
      
      // Get games where user is opponent
      const opponentGamesQuery = query(
        collection(db, COLLECTIONS.GAMES),
        where("opponent", "==", uid),
        orderBy("updatedAt", "desc")
      );
      
      const [createdSnapshot, opponentSnapshot] = await Promise.all([
        getDocs(createdGamesQuery),
        getDocs(opponentGamesQuery)
      ]);
      
      const allGames: Game[] = [];
      
      // Combine all games and remove duplicates
      const gameMap = new Map<string, Game>();
      
      createdSnapshot.docs.forEach(doc => {
        gameMap.set(doc.id, doc.data() as Game);
      });
      
      opponentSnapshot.docs.forEach(doc => {
        gameMap.set(doc.id, doc.data() as Game);
      });
      
      // Convert to array and sort by updatedAt
      return Array.from(gameMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
    },
    enabled: !!uid,
    staleTime: 1000 * 60, // 1 minute
  });
}

// --- WAITING GAMES (for lobby) ---
export function useWaitingGamesQuery(excludeUid?: string) {
  return useQuery<Game[]>({
    queryKey: ["waitingGames", excludeUid],
    queryFn: async () => {
      const waitingQuery = query(
        collection(db, COLLECTIONS.GAMES),
        where("status", "==", "waiting"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      
      const snapshot = await getDocs(waitingQuery);
      let games = snapshot.docs.map(doc => doc.data() as Game);
      
      // Filter out games created by current user
      if (excludeUid) {
        games = games.filter(game => game.createdBy !== excludeUid);
      }
      
      return games;
    },
    staleTime: 1000 * 30, // 30 seconds - lobby updates frequently
  });
}

// --- MULTIPLE USERS (for resolving UIDs to profiles) ---
export function useUsersQuery(uids: string[]) {
  return useQuery<Record<string, User>>({
    queryKey: ["users", uids.sort()], // Sort to ensure consistent cache key
    queryFn: async () => {
      if (uids.length === 0) return {};
      
      const users: Record<string, User> = {};
      
      // Get all user profiles in parallel
      const promises = uids.map(async (uid) => {
        const profile = await getUserProfile(uid);
        if (profile) {
          users[uid] = profile as User;
        }
      });
      
      await Promise.all(promises);
      return users;
    },
    enabled: uids.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes - user profiles don't change often
  });
}

// --- COMPOSITE QUERY: Game + Rounds + Profiles ---
export function useGameCompleteQuery(gameId: string | null) {
  const gameQuery = useGameWithProfilesQuery(gameId);
  const roundsQuery = useGameRoundsQuery(gameId);
  
  return {
    game: gameQuery.data,
    rounds: roundsQuery.data || [],
    isLoading: gameQuery.isLoading || roundsQuery.isLoading,
    error: gameQuery.error || roundsQuery.error,
    refetch: () => {
      gameQuery.refetch();
      roundsQuery.refetch();
    }
  };
}

// --- ACTIVE GAMES (games that are in-progress) ---
export function useActiveGamesQuery() {
  return useQuery<Game[]>({
    queryKey: ["activeGames"],
    queryFn: async () => {
      const activeQuery = query(
        collection(db, COLLECTIONS.GAMES),
        where("status", "==", "in-progress"),
        orderBy("updatedAt", "desc"),
        limit(10)
      );
      
      const snapshot = await getDocs(activeQuery);
      return snapshot.docs.map(doc => doc.data() as Game);
    },
    staleTime: 1000 * 60, // 1 minute
  });
}

// --- FINISHED GAMES (for results/history) ---
export function useFinishedGamesQuery(limitCount: number = 10) {
  return useQuery<Game[]>({
    queryKey: ["finishedGames", limitCount],
    queryFn: async () => {
      const finishedQuery = query(
        collection(db, COLLECTIONS.GAMES),
        where("status", "==", "finished"),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(finishedQuery);
      return snapshot.docs.map(doc => doc.data() as Game);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - finished games don't change
  });
}

// --- USER STATS (derived from user profile) ---
export function useUserStatsQuery(uid: string | null) {
  const userQuery = useUserQuery(uid);
  
  return {
    stats: userQuery.data?.stats,
    isLoading: userQuery.isLoading,
    error: userQuery.error,
    // Computed stats
    winRate: userQuery.data?.stats 
      ? userQuery.data.stats.gamesPlayed > 0 
        ? Math.round((userQuery.data.stats.gamesWon / userQuery.data.stats.gamesPlayed) * 100)
        : 0
      : 0,
    trickSuccessRate: userQuery.data?.stats
      ? (userQuery.data.stats.tricksLanded + userQuery.data.stats.tricksMissed) > 0
        ? Math.round((userQuery.data.stats.tricksLanded / (userQuery.data.stats.tricksLanded + userQuery.data.stats.tricksMissed)) * 100)
        : 0
      : 0
  };
}