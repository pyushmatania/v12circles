import React from 'react';
import { motion } from 'framer-motion';
import { Film, Music, Tv, Globe, Tag, RotateCcw } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onResetFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilter,
  onFilterChange,
  onResetFilters
}) => {
  const { theme } = useTheme();

  const filters = [
    { id: 'all', label: 'All', icon: null },
    { id: 'film', label: 'Films', icon: Film },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'webseries', label: 'Web Series', icon: Tv },
    { id: 'bollywood', label: 'Bollywood', icon: Globe },
    { id: 'regional', label: 'Regional', icon: Tag }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-3 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Filter Results
        </h3>
        <button
          onClick={onResetFilters}
          className={`flex items-center gap-1 text-xs ${
            theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
              activeFilter === filter.id
                ? theme === 'light' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-purple-900/30 text-purple-400'
                : theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {filter.icon && <filter.icon className="w-4 h-4" />}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchFilters;