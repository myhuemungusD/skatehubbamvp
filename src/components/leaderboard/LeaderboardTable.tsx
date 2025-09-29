'use client';

import React from 'react';

export interface LeaderboardRow {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
}

interface LeaderboardTableProps {
  rows: LeaderboardRow[];
  loading?: boolean;
  emptyMessage?: string;
}

function LoadingSkeleton() {
  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left">Rank</th>
            <th className="px-3 py-2 text-left">User</th>
            <th className="px-3 py-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">
                <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
              </td>
              <td className="px-3 py-2">
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </td>
              <td className="px-3 py-2">
                <div className="h-4 w-12 bg-gray-300 rounded animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LeaderboardTable({ rows, loading, emptyMessage = 'No results.' }: LeaderboardTableProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!rows.length) {
    return <div className="border rounded p-6 text-sm text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="border rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-3 py-2 text-left">Rank</th>
            <th className="px-3 py-2 text-left">User</th>
            <th className="px-3 py-2 text-left">Points</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.userId} className="border-t">
              <td className="px-3 py-2">{r.rank}</td>
              <td className="px-3 py-2">{r.displayName}</td>
              <td className="px-3 py-2 font-medium">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}