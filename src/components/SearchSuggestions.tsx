import React from 'react';
import { motion } from 'framer-motion';
import { Film, Music, Tv, Star, TrendingUp, Clock } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { Project } from '../types';

interface SearchSuggestionsProps {
  suggestions: Project[];
  searchTerm: string;
  selectedIndex: number;
  onSelectSuggestion: (project: Project) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  searchTerm,
  selectedIndex,
  onSelectSuggestion
}) => {
  const { theme } = useTheme();

  // Get project type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'webseries': return <Tv className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
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

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
          onClick={() => onSelectSuggestion(suggestion)}
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
              src={suggestion.poster} 
              alt={suggestion.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {highlightMatch(suggestion.title, searchTerm)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getTypeColor(suggestion.type)}`}>
                {getTypeIcon(suggestion.type)}
                <span>{suggestion.type}</span>
              </div>
              <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                {suggestion.category}
              </div>
              {suggestion.rating && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {suggestion.rating}
                  </span>
                </div>
              )}
            </div>
            <p className={`text-xs mt-1 line-clamp-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              {highlightMatch(suggestion.description, searchTerm)}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {suggestion.fundedPercentage && (
                <div className="flex items-center gap-1 text-xs">
                  <TrendingUp className={`w-3 h-3 ${
                    suggestion.fundedPercentage > 75 ? 'text-green-400' :
                    suggestion.fundedPercentage > 50 ? 'text-yellow-400' : 'text-gray-400'
                  }`} />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {suggestion.fundedPercentage}% Funded
                  </span>
                </div>
              )}
              {suggestion.timeLeft && (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    {suggestion.timeLeft}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SearchSuggestions;