import React from 'react';
import { motion } from 'framer-motion';
import { History, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface SearchHistoryProps {
  recentSearches: string[];
  selectedIndex: number;
  onSelectSearch: (term: string) => void;
  onClearSearch: (term: string) => void;
  onClearAllSearches: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  recentSearches,
  selectedIndex,
  onSelectSearch,
  onClearSearch,
  onClearAllSearches
}) => {
  const { theme } = useTheme();

  if (recentSearches.length === 0) return null;

  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Recent Searches
        </h3>
        <button
          onClick={onClearAllSearches}
          className={`text-xs ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Clear All
        </button>
      </div>
      <div className="space-y-1">
        {recentSearches.map((term, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={`flex items-center justify-between p-2 rounded-lg ${
              selectedIndex === index
                ? theme === 'light' 
                  ? 'bg-purple-50' 
                  : 'bg-purple-900/10'
                : theme === 'light'
                  ? 'hover:bg-gray-100'
                  : 'hover:bg-gray-800'
            }`}
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => onSelectSearch(term)}
            >
              <History className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                {term}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearSearch(term);
              }}
              className={`p-1 rounded-full ${
                theme === 'light' ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-200' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700'
              }`}
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;