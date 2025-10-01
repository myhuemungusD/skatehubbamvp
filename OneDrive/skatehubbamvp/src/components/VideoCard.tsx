import React from 'react';
import { GameRound, User } from '@/types/firestore';

interface TrickWithProfile extends GameRound {
  id: string;
  gameId: string;
  playerProfile?: User;
  votes?: number;
}

interface VideoCardProps {
  trick: TrickWithProfile;
}

export function VideoCard({ trick }: VideoCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const playerName = trick.playerProfile?.displayName || 'Anonymous Skater';
  const statusIcon = trick.landed ? '✅' : '❌';
  const statusText = trick.landed ? 'Landed' : 'Missed';
  const statusColor = trick.landed ? 'text-green-400' : 'text-red-400';

  return (
    <div className="rounded-xl bg-gray-900/50 border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
      {/* Video */}
      <div className="relative aspect-video bg-black">
        <video 
          src={trick.videoUrl} 
          controls 
          preload="metadata"
          className="w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M8 5v14l11-7z'/%3E%3C/svg%3E"
        >
          <source src={trick.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold bg-black/70 backdrop-blur-sm ${statusColor}`}>
          {statusIcon} {statusText}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Trick Name */}
        <h3 className="text-lg font-semibold text-white mb-1 truncate">
          {trick.trickName || 'Unnamed Trick'}
        </h3>
        
        {/* Player */}
        <p className="text-sm text-gray-400 mb-2">
          by <span className="text-gray-200 font-medium">{playerName}</span>
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(trick.createdAt)}</span>
          <div className="flex items-center gap-2">
            {trick.isResponse && (
              <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full">
                Response
              </span>
            )}
            <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
              Game: {trick.gameId.slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}