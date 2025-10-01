// src/hooks/firestoreMutationsQuery.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  signup, 
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
  getDoc
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

export function useSignupMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password, displayName }: { 
      email: string; 
      password: string; 
      displayName?: string; 
    }) => {
      return await signup(email, password, displayName);
    },
    onSuccess: (userCredential) => {
      // Invalidate user query for the new user
      if (userCredential?.uid) {
        queryClient.invalidateQueries({ queryKey: ["user", userCredential.uid] });
      }
    },
  });
}

export function useCreateUserProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ uid, userData }: { 
      uid: string; 
      userData: Omit<CreateUserData, 'createdAt' | 'updatedAt' | 'stats'>; 
    }) => {
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
      return uid;
    },
    onSuccess: (uid) => {
      queryClient.invalidateQueries({ queryKey: ["user", uid] });
    },
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ uid, updates }: { uid: string; updates: Partial<User> }) => {
      return await updateUserProfile(uid, updates);
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ["user", uid] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserStatsMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      uid, 
      gameResult, 
      tricksLanded = 0, 
      tricksMissed = 0 
    }: { 
      uid: string; 
      gameResult: 'won' | 'lost'; 
      tricksLanded?: number; 
      tricksMissed?: number; 
    }) => {
      return await updateUserStats(uid, gameResult, tricksLanded, tricksMissed);
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: ["user", uid] });
      queryClient.invalidateQueries({ queryKey: ["userGames", uid] });
    },
  });
}

// --- GAME MUTATIONS ---

export function useCreateGameMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (gameData: CreateGameData) => {
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
      
      return gameRef.id;
    },
    onSuccess: (gameId, gameData) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", gameData.createdBy] });
      if (gameData.opponent) {
        queryClient.invalidateQueries({ queryKey: ["userGames", gameData.opponent] });
      }
      queryClient.invalidateQueries({ queryKey: ["waitingGames"] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
    },
  });
}

export function useJoinGameMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gameId, playerUid }: { gameId: string; playerUid: string }) => {
      // Update game with opponent and change status
      await updateDoc(doc(db, COLLECTIONS.GAMES, gameId), {
        opponent: playerUid,
        status: 'in-progress',
        updatedAt: nowTimestamp()
      });
      
      // Get game data to initialize
      const gameDoc = await getDoc(doc(db, COLLECTIONS.GAMES, gameId));
      if (gameDoc.exists()) {
        const game = gameDoc.data() as Game;
        await initializeGame(gameId, game.createdBy, playerUid);
      }
      
      return gameId;
    },
    onSuccess: (gameId, { playerUid }) => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", playerUid] });
      queryClient.invalidateQueries({ queryKey: ["waitingGames"] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
    },
  });
}

export function useUpdateGameStatusMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gameId, status }: { gameId: string; status: Game['status'] }) => {
      await updateDoc(doc(db, COLLECTIONS.GAMES, gameId), {
        status,
        updatedAt: nowTimestamp()
      });
      return gameId;
    },
    onSuccess: (gameId) => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
      queryClient.invalidateQueries({ queryKey: ["finishedGames"] });
    },
  });
}

// --- GAME ROUND MUTATIONS ---

export function useAddRoundMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gameId, roundData }: { gameId: string; roundData: CreateRoundData }) => {
      return await createRound(
        gameId,
        roundData.player,
        roundData.videoUrl,
        roundData.trickName,
        roundData.isResponse,
        roundData.landed
      );
    },
    onSuccess: (_, { gameId, roundData }) => {
      queryClient.invalidateQueries({ queryKey: ["gameRounds", gameId] });
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", roundData.player] });
    },
  });
}

export function useHandleTrickUploadMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      gameId, 
      playerId, 
      videoFile, 
      trickName, 
      isResponse, 
      landed 
    }: { 
      gameId: string; 
      playerId: string; 
      videoFile: File; 
      trickName: string; 
      isResponse: boolean; 
      landed: boolean; 
    }) => {
      // handleTrickUpload expects videoUrl string, not File
      // This mutation should handle file upload first, then call handleTrickUpload
      // For now, we'll need to modify this based on your upload flow
      throw new Error('This mutation needs to be implemented with proper file upload flow');
    },
    onSuccess: (_, { gameId, playerId }) => {
      // Invalidate all game-related queries
      queryClient.invalidateQueries({ queryKey: ["gameRounds", gameId] });
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", playerId] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
    },
  });
}

export function usePlayerMissedTrickMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gameId, playerId }: { gameId: string; playerId: string }) => {
      return await playerMissedTrick(gameId, playerId);
    },
    onSuccess: (_, { gameId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", playerId] });
      queryClient.invalidateQueries({ queryKey: ["user", playerId] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
      queryClient.invalidateQueries({ queryKey: ["finishedGames"] });
    },
  });
}

export function usePlayerLandedTrickMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ gameId, playerId }: { gameId: string; playerId: string }) => {
      return await playerLandedTrick(gameId, playerId);
    },
    onSuccess: (_, { gameId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", playerId] });
      queryClient.invalidateQueries({ queryKey: ["user", playerId] });
    },
  });
}

// --- NOTIFICATION MUTATIONS ---

export function useSendTurnNotificationMutation() {
  return useMutation({
    mutationFn: async ({ playerUid, gameId }: { playerUid: string; gameId: string }) => {
      return await sendTurnEmailByUid(playerUid, gameId);
    },
    // No cache invalidation needed for notifications
  });
}

export function useSendInviteNotificationMutation() {
  return useMutation({
    mutationFn: async ({ 
      toEmail, 
      fromEmail, 
      gameId 
    }: { 
      toEmail: string; 
      fromEmail: string; 
      gameId: string; 
    }) => {
      return await sendInviteEmail(toEmail, fromEmail, gameId);
    },
    // No cache invalidation needed for notifications
  });
}

export function useSendGameFinishedNotificationMutation() {
  return useMutation({
    mutationFn: async ({ 
      playerUid, 
      won, 
      opponentUid, 
      gameId 
    }: { 
      playerUid: string; 
      won: boolean; 
      opponentUid: string; 
      gameId: string; 
    }) => {
      return await sendGameFinishedEmailByUid(playerUid, won, opponentUid, gameId);
    },
    // No cache invalidation needed for notifications
  });
}

// --- DATABASE UTILITY MUTATIONS ---

export function useClearDatabaseMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return await clearAllData();
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}

export function useSeedDatabaseMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await seedUsers();
      await seedGames();
      return true;
    },
    onSuccess: () => {
      // Invalidate all queries to refetch new seeded data
      queryClient.invalidateQueries();
    },
  });
}

// --- COMPOSITE MUTATIONS ---

export function useCompleteGameTurnMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      gameId, 
      playerId, 
      videoFile, 
      trickName, 
      isResponse, 
      landed,
      sendNotification = true
    }: { 
      gameId: string; 
      playerId: string; 
      videoFile: File; 
      trickName: string; 
      isResponse: boolean; 
      landed: boolean;
      sendNotification?: boolean;
    }) => {
      // Upload trick and handle game logic
      // Note: This needs proper file upload implementation first
      // await handleTrickUpload(gameId, playerId, videoUrl, trickName);
      
      // If trick was missed and we should send notifications
      if (!landed && sendNotification) {
        // Get game data to find opponent
        const gameDoc = await getDoc(doc(db, COLLECTIONS.GAMES, gameId));
        if (gameDoc.exists()) {
          const game = gameDoc.data() as Game;
          const opponentId = game.createdBy === playerId ? game.opponent : game.createdBy;
          if (opponentId) {
            await sendTurnEmailByUid(opponentId, gameId);
          }
        }
      }
      
      return true;
    },
    onSuccess: (_, { gameId, playerId }) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameWithProfiles", gameId] });
      queryClient.invalidateQueries({ queryKey: ["gameRounds", gameId] });
      queryClient.invalidateQueries({ queryKey: ["userGames", playerId] });
      queryClient.invalidateQueries({ queryKey: ["user", playerId] });
      queryClient.invalidateQueries({ queryKey: ["activeGames"] });
    },
  });
}