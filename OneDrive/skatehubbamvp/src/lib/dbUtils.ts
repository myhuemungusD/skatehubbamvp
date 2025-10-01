// src/lib/dbUtils.ts
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  setDoc,
  deleteDoc,
  query,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Game, GameRound } from '@/types/firestore';

/**
 * Clear all documents from a collection
 */
export async function clearCollection(collectionName: string) {
  console.log(`🗑️ Clearing collection: ${collectionName}`);
  
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  
  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log(`✅ Cleared ${snapshot.size} documents from ${collectionName}`);
}

/**
 * Clear all data from the database
 */
export async function clearAllData() {
  console.log('🧹 Clearing all Firestore data...');
  
  const collections = ['users', 'games', 'mail'];
  
  for (const collectionName of collections) {
    await clearCollection(collectionName);
  }
  
  console.log('✅ All data cleared!');
}

/**
 * Seed test users
 */
export async function seedUsers() {
  console.log('👥 Seeding test users...');
  
  const testUsers: Record<string, User> = {
    testUser1: {
      email: 'player1@skatehubba.com',
      displayName: 'SkaterPro',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stats: {
        gamesPlayed: 5,
        gamesWon: 3,
        gamesLost: 2,
        tricksLanded: 15,
        tricksMissed: 8
      }
    },
    testUser2: {
      email: 'player2@skatehubba.com',
      displayName: 'TrickMaster',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stats: {
        gamesPlayed: 8,
        gamesWon: 4,
        gamesLost: 4,
        tricksLanded: 22,
        tricksMissed: 12
      }
    },
    testUser3: {
      email: 'spectator@skatehubba.com',
      displayName: 'SkateWatcher',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      stats: {
        gamesPlayed: 1,
        gamesWon: 0,
        gamesLost: 1,
        tricksLanded: 2,
        tricksMissed: 5
      }
    }
  };
  
  for (const [uid, userData] of Object.entries(testUsers)) {
    await setDoc(doc(db, 'users', uid), userData);
  }
  
  console.log(`✅ Seeded ${Object.keys(testUsers).length} test users`);
}

/**
 * Seed test games
 */
export async function seedGames() {
  console.log('🎮 Seeding test games...');
  
  const testGames: Record<string, Game> = {
    sampleGame1: {
      createdBy: 'testUser1',
      opponent: 'testUser2',
      letters: {
        testUser1: 'S',
        testUser2: 'SK'
      },
      turn: 'testUser1',
      status: 'in-progress',
      createdAt: Date.now() - 300000, // 5 minutes ago
      updatedAt: Date.now() - 60000    // 1 minute ago
    },
    sampleGame2: {
      createdBy: 'testUser3',
      opponent: '',
      letters: {},
      turn: 'testUser3',
      status: 'waiting',
      createdAt: Date.now() - 120000, // 2 minutes ago
      updatedAt: Date.now() - 120000
    },
    sampleGame3: {
      createdBy: 'testUser1',
      opponent: 'testUser3',
      letters: {
        testUser1: 'SKATE', // Lost the game
        testUser3: 'SKA'
      },
      turn: 'testUser3',
      status: 'finished',
      createdAt: Date.now() - 600000, // 10 minutes ago
      updatedAt: Date.now() - 180000  // 3 minutes ago
    }
  };
  
  for (const [gameId, gameData] of Object.entries(testGames)) {
    await setDoc(doc(db, 'games', gameId), gameData);
  }
  
  console.log(`✅ Seeded ${Object.keys(testGames).length} test games`);
}

/**
 * Seed sample game rounds for the in-progress game
 */
export async function seedGameRounds() {
  console.log('🎥 Seeding game rounds...');
  
  const sampleRounds: Record<string, GameRound> = {
    round1: {
      player: 'testUser1',
      videoUrl: 'https://example.com/kickflip.mp4',
      trickName: 'Kickflip',
      isResponse: false,
      landed: true,
      createdAt: Date.now() - 240000 // 4 minutes ago
    },
    round2: {
      player: 'testUser2',
      videoUrl: 'https://example.com/kickflip-response.mp4',
      trickName: 'Kickflip',
      isResponse: true,
      landed: false, // This gave testUser2 the 'S'
      createdAt: Date.now() - 180000 // 3 minutes ago
    },
    round3: {
      player: 'testUser1',
      videoUrl: 'https://example.com/heelflip.mp4',
      trickName: 'Heelflip',
      isResponse: false,
      landed: true,
      createdAt: Date.now() - 120000 // 2 minutes ago
    },
    round4: {
      player: 'testUser2',
      videoUrl: 'https://example.com/heelflip-response.mp4',
      trickName: 'Heelflip',
      isResponse: true,
      landed: false, // This gave testUser2 the 'K'
      createdAt: Date.now() - 60000 // 1 minute ago
    }
  };
  
  // Add rounds to the in-progress game
  for (const [roundId, roundData] of Object.entries(sampleRounds)) {
    await setDoc(doc(db, 'games', 'sampleGame1', 'rounds', roundId), roundData);
  }
  
  console.log(`✅ Seeded ${Object.keys(sampleRounds).length} game rounds`);
}

/**
 * Complete database reset and seed with test data
 */
export async function resetAndSeedDatabase() {
  try {
    await clearAllData();
    await seedUsers();
    await seedGames(); 
    await seedGameRounds();
    console.log('🚀 Database reset and seeded successfully!');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

/**
 * Count documents in a collection
 */
export async function countDocuments(collectionName: string): Promise<number> {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.size;
}

/**
 * Get database stats
 */
export async function getDatabaseStats() {
  const stats = {
    users: await countDocuments('users'),
    games: await countDocuments('games'),
    mail: await countDocuments('mail')
  };
  
  console.table(stats);
  return stats;
}