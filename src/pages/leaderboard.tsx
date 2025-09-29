import React, { useEffect, useMemo, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { LeaderboardTable, LeaderboardRow } from '../components/leaderboard/LeaderboardTable';

type Tab = 'global' | 'spots' | 'friends';
type Range = 'all-time' | 'weekly' | 'monthly';

interface UserDoc {
  displayName?: string;
  totalPoints?: number;
  stats?: {
    points?: number;
  };
  createdAt?: any;
}

interface ActivityDoc {
  userId: string;
  points: number;
  createdAt: any;
  type: string;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>('global');
  const [range, setRange] = useState<Range>('all-time');
  const [users, setUsers] = useState<(UserDoc & { uid: string })[]>([]);
  const [activities, setActivities] = useState<ActivityDoc[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch users for all-time leaderboard
  useEffect(() => {
    if (tab !== 'global' || range !== 'all-time') return;
    
    setLoading(true);
    const q = query(
      collection(db, 'users'),
      orderBy('stats.points', 'desc'),
      limit(100)
    );
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        } as UserDoc & { uid: string }));
        setUsers(userData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching users:', error);
        // Fallback: try with totalPoints field
        const fallbackQ = query(
          collection(db, 'users'),
          orderBy('totalPoints', 'desc'),
          limit(100)
        );
        
        const fallbackUnsub = onSnapshot(fallbackQ, (snapshot) => {
          const userData = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
          } as UserDoc & { uid: string }));
          setUsers(userData);
          setLoading(false);
        }, () => {
          setUsers([]);
          setLoading(false);
        });
        
        return () => fallbackUnsub();
      }
    );

    return () => unsubscribe();
  }, [tab, range]);

  // Fetch activities for weekly/monthly leaderboards
  useEffect(() => {
    if (tab !== 'global' || range === 'all-time') return;
    
    setLoading(true);
    const now = new Date();
    const cutoff = new Date();
    
    if (range === 'weekly') {
      cutoff.setDate(now.getDate() - 7);
    } else if (range === 'monthly') {
      cutoff.setDate(now.getDate() - 30);
    }

    const q = query(
      collection(db, 'activity'),
      where('createdAt', '>=', Timestamp.fromDate(cutoff)),
      where('type', '==', 'submission-approved'),
      orderBy('createdAt', 'desc'),
      limit(1000)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const activityData = snapshot.docs.map(doc => doc.data() as ActivityDoc);
        setActivities(activityData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching activities:', error);
        setActivities([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tab, range]);

  // Compute leaderboard rows
  const leaderboardRows: LeaderboardRow[] = useMemo(() => {
    if (tab !== 'global') return [];

    if (range === 'all-time') {
      return users
        .filter(user => (user.stats?.points || user.totalPoints || 0) > 0)
        .map((user, index) => ({
          rank: index + 1,
          userId: user.uid,
          displayName: user.displayName || 'Unknown User',
          points: user.stats?.points || user.totalPoints || 0,
        }));
    } else {
      // Aggregate points from recent activities
      const pointsByUser = new Map<string, number>();
      activities.forEach(activity => {
        const current = pointsByUser.get(activity.userId) || 0;
        pointsByUser.set(activity.userId, current + activity.points);
      });

      const userMap = new Map(users.map(u => [u.uid, u]));
      
      return Array.from(pointsByUser.entries())
        .filter(([, points]) => points > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 100)
        .map(([userId, points], index) => ({
          rank: index + 1,
          userId,
          displayName: userMap.get(userId)?.displayName || 'Unknown User',
          points,
        }));
    }
  }, [tab, range, users, activities]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Leaderboard</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-2">
          {(['global', 'spots', 'friends'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded text-xs border transition ${
                tab === t 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-200'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'global' && (
          <div className="space-y-4">
            {/* Range Selection */}
            <div className="flex space-x-2">
              {(['all-time', 'weekly', 'monthly'] as Range[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded text-xs border transition ${
                    range === r 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {r.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Leaderboard Table */}
            <LeaderboardTable 
              rows={leaderboardRows} 
              loading={loading}
              emptyMessage={`No ${range.replace('-', ' ')} results found.`}
            />
          </div>
        )}

        {tab === 'spots' && (
          <div className="border rounded p-6 text-sm text-gray-600">
            Spots leaderboard coming soon! This will show top performers by skating spot/location.
          </div>
        )}

        {tab === 'friends' && (
          <div className="border rounded p-6 text-sm text-gray-600">
            Friends leaderboard coming soon! This will show your friends&apos; rankings and scores.
          </div>
        )}
      </div>
    </div>
  );
}