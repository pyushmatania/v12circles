import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Share2, Music, Users, Star, ExternalLink } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useSpotifyArtist } from '../hooks/useSpotifyData';
import OptimizedImage from './OptimizedImage';

interface SpotifyArtistCardProps {
  artistName: string;
  showDetails?: boolean;
  onArtistClick?: (artistId: string) => void;
}

const SpotifyArtistCard: React.FC<SpotifyArtistCardProps> = ({
  artistName,
  showDetails = false,
  onArtistClick
}) => {
  const { theme } = useTheme();
  const { artistData, isLoading, error } = useSpotifyArtist(artistName);
  const [isHovered, setIsHovered] = useState(false);

  const artist = artistData?.artist;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl ${
          theme === 'light' 
            ? 'bg-white shadow-lg border border-gray-200' 
            : 'bg-slate-800 shadow-xl border border-slate-700'
        }`}
      >
        <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
        <div className="p-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-2/3" />
        </div>
      </motion.div>
    );
  }

  if (error || !artist) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl ${
          theme === 'light' 
            ? 'bg-white shadow-lg border border-gray-200' 
            : 'bg-slate-800 shadow-xl border border-slate-700'
        }`}
      >
        <div className="aspect-square bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
          <div className="text-center">
            <Music className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600 dark:text-red-400">Artist not found</p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">{artistName}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </motion.div>
    );
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 ${
        theme === 'light' 
          ? 'bg-white shadow-lg hover:shadow-xl border border-gray-200' 
          : 'bg-slate-800 shadow-xl hover:shadow-2xl border border-slate-700'
      }`}
      onClick={() => onArtistClick?.(artist.id)}
    >
      {/* Artist Image */}
      <div className="relative aspect-square overflow-hidden">
        <OptimizedImage
          src={artist.images?.[0]?.url || '/default-artist-image.jpg'}
          alt={artist.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        
        {/* Overlay with play button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30"
          >
            <Play className="w-5 h-5 text-white ml-1" />
          </motion.button>
        </motion.div>

        {/* Popularity badge */}
        <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Star className="w-3 h-3" />
          {artist.popularity}
        </div>

        {/* Verified badge */}
        {artist.popularity > 80 && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white p-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Artist Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
            {artist.name}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Heart className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {artist.genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  theme === 'light'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-blue-900/30 text-blue-300'
                }`}
              >
                {genre}
              </span>
            ))}
            {artist.genres.length > 2 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{artist.genres.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatFollowers(artist.followers.total)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{artist.popularity}/100</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              theme === 'light'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Play className="w-4 h-4 inline mr-1" />
            Play
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
            }`}
          >
            <Share2 className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              window.open(artist.external_urls.spotify, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Detailed Info (if showDetails is true) */}
      {showDetails && artistData && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-gray-200 dark:border-slate-700 p-4"
        >
          {/* Top Tracks */}
          {artistData.topTracks.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Top Tracks</h4>
              <div className="space-y-2">
                {artistData.topTracks.slice(0, 3).map((track, index) => (
                  <div key={track.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 w-4">{index + 1}</span>
                      <span className="text-gray-900 dark:text-white truncate">{track.name}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatDuration(track.duration_ms)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Albums */}
          {artistData.albums.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recent Albums</h4>
              <div className="space-y-2">
                {artistData.albums.slice(0, 2).map((album) => (
                  <div key={album.id} className="flex items-center gap-2 text-sm">
                    <OptimizedImage
                      src={album.images?.[0]?.url || '/default-album-image.jpg'}
                      alt={album.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white truncate">{album.name}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        {new Date(album.release_date).getFullYear()} • {album.total_tracks} tracks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SpotifyArtistCard; 