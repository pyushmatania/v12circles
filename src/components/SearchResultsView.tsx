import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Project } from '../types';

interface SearchResultsViewProps {
  results: Project[];
  searchTerm: string;
  selectedIndex: number;
  onSelectResult: (project: Project) => void;
  onViewAllResults: () => void;
}

const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  results,
  searchTerm,
  selectedIndex,
  onSelectResult,
  onViewAllResults
}) => {
  const { theme } = useTheme();

  // Get project type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'film': return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      );
      case 'music': return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
      );
      case 'webseries': return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      );
      default: return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
          <line x1="7" y1="2" x2="7" y2="22"></line>
          <line x1="17" y1="2" x2="17" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="2" y1="7" x2="7" y2="7"></line>
          <line x1="2" y1="17" x2="7" y2="17"></line>
          <line x1="17" y1="17" x2="22" y2="17"></line>
          <line x1="17" y1="7" x2="22" y2="7"></line>
        </svg>
      );
    }
  };

  // Get project type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'film': 
        return theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400';
      case 'music': 
        return theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400';
      case 'webseries': 
        return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400';
      default: 
        return theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-800 text-gray-400';
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className={`font-bold ${
              theme === 'light' ? 'text-purple-700' : 'text-purple-400'
            }`}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  if (results.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          No results found for "{searchTerm}"
        </p>
        <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
          Try different keywords or check your spelling
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          onClick={() => onSelectResult(result)}
          className={`flex items-start gap-3 p-3 cursor-pointer transition-colors ${
            selectedIndex === index
              ? theme === 'light' 
                ? 'bg-purple-50' 
                : 'bg-purple-900/10'
              : theme === 'light'
                ? 'hover:bg-gray-100'
                : 'hover:bg-gray-800'
          }`}
        >
          <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
            <img 
              src={result.poster} 
              alt={result.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {highlightMatch(result.title, searchTerm)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getTypeColor(result.type)}`}>
                {getTypeIcon(result.type)}
                <span>{result.type}</span>
              </div>
              <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {result.category}
              </div>
              {result.rating && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {result.rating}
                  </span>
                </div>
              )}
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {highlightMatch(result.description, searchTerm)}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {result.fundedPercentage && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className={`w-3 h-3 ${
                    result.fundedPercentage > 75 ? 'text-green-400' :
                    result.fundedPercentage > 50 ? 'text-yellow-400' : 'text-gray-400'
                  }`} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {result.fundedPercentage}% Funded
                  </span>
                </div>
              )}
              {result.timeLeft && (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {result.timeLeft}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {/* View All Results Button */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onViewAllResults}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30'
          }`}
        >
          <span>View all results</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchResultsView;