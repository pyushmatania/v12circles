import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Bookmark, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useAuth } from './auth/useAuth';

interface WatchlistButtonProps {
  projectId: string;
  projectTitle: string;
  compact?: boolean;
  onAuthRequired?: () => void;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ 
  projectId, 
  projectTitle,
  compact = false,
  onAuthRequired
}) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // Check if project is in watchlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, this would be an API call to check if the project is in the user's watchlist
      const watchlist = JSON.parse(localStorage.getItem('circles_watchlist') || '[]');
      setIsInWatchlist(watchlist.includes(projectId));
    }
  }, [projectId, isAuthenticated]);
  
  const toggleWatchlist = async () => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real app, this would be an API call to add/remove the project from the watchlist
      const watchlist = JSON.parse(localStorage.getItem('circles_watchlist') || '[]');
      
      if (isInWatchlist) {
        const updatedWatchlist = watchlist.filter((id: string) => id !== projectId);
        localStorage.setItem('circles_watchlist', JSON.stringify(updatedWatchlist));
        setIsInWatchlist(false);
        setToastMessage(`${projectTitle} removed from watchlist`);
      } else {
        const updatedWatchlist = [...watchlist, projectId];
        localStorage.setItem('circles_watchlist', JSON.stringify(updatedWatchlist));
        setIsInWatchlist(true);
        setToastMessage(`${projectTitle} added to watchlist`);
      }
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error updating watchlist:', error);
      setToastMessage('Failed to update watchlist. Please try again.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={toggleWatchlist}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center transition-all duration-300 ${
          compact ? 'p-2 rounded-lg' : 'gap-2 px-4 py-2 rounded-xl font-medium'
        } ${
          isInWatchlist
            ? `${theme === 'light' 
                ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                : 'bg-purple-900/30 text-purple-400 border border-purple-800'
              }`
            : `${theme === 'light'
                ? 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-gray-100' 
                : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/15'
              }`
        }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {isInWatchlist ? (
              <BookmarkCheck className={`${compact ? 'w-5 h-5' : 'w-5 h-5'}`} />
            ) : (
              <Bookmark className={`${compact ? 'w-5 h-5' : 'w-5 h-5'}`} />
            )}
            {!compact && (
              <span>
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </span>
            )}
          </>
        )}
      </motion.button>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-4 left-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              theme === 'light'
                ? 'bg-white border border-gray-200'
                : 'bg-gray-900 border border-white/20'
            }`}
          >
            {isInWatchlist ? (
              <BookmarkCheck className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-500" />
            )}
            <span className={theme === 'light' ? 'text-gray-900' : 'text-white'}>
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WatchlistButton;