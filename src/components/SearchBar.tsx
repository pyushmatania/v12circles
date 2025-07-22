import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Film, 
  Music, 
  Tv, 
  History, 
  Star
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { projects } from '../data/projects';
import { Project } from '../types';
import { useDebounce } from '../hooks/useDebounce';

// 🛡️ Type definitions for better type safety
interface SearchBarProps {
  onSelectProject?: (project: Project) => void;
  onViewAllResults?: (term: string) => void;
}

type ProjectType = 'film' | 'music' | 'webseries';

interface SearchResult {
  project: Project;
  relevance: number;
  matchType: 'title' | 'description' | 'tag' | 'person' | 'other';
}

/**
 * 🎯 SearchBar - Optimized search component with enhanced performance
 * @description Provides advanced search functionality with real-time results and keyboard navigation
 */
const SearchBar: React.FC<SearchBarProps> = memo(({ onSelectProject, onViewAllResults }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 🚀 Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🚀 Load recent searches from localStorage
  useEffect(() => {
    try {
    const savedSearches = localStorage.getItem('circles_recent_searches');
    if (savedSearches) {
        const parsed = JSON.parse(savedSearches);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
    }
  }, []);

  // 🚀 Handle click outside to close dropdown and collapse search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
        if (!searchTerm) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchTerm]);

  // 🚀 Memoized search function with enhanced relevance scoring
  const performSearch = useCallback((term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      const searchTermLower = term.toLowerCase();
      const results: SearchResult[] = [];

      projects.forEach(project => {
        // Filter out disabled projects
        if (project.disabled === true) {
          return;
        }

        let relevance = 0;
        let matchType: SearchResult['matchType'] = 'other';

        // Title match (highest priority)
        if (project.title.toLowerCase().includes(searchTermLower)) {
          relevance += 100;
          matchType = 'title';
        }

        // Description match
        if (project.description.toLowerCase().includes(searchTermLower)) {
          relevance += 50;
          if (matchType === 'other') matchType = 'description';
        }

        // Tag match
        if (project.tags.some(tag => tag.toLowerCase().includes(searchTermLower))) {
          relevance += 30;
          if (matchType === 'other') matchType = 'tag';
        }

        // Person match (director, artist, key people)
        if (project.director?.toLowerCase().includes(searchTermLower) ||
            project.artist?.toLowerCase().includes(searchTermLower) ||
            project.productionHouse?.toLowerCase().includes(searchTermLower) ||
            project.keyPeople?.some(person => person.name.toLowerCase().includes(searchTermLower))) {
          relevance += 20;
          if (matchType === 'other') matchType = 'person';
        }

        if (relevance > 0) {
          results.push({ project, relevance, matchType });
        }
      });

      // Sort by relevance and limit results
      const sortedResults = results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 5)
        .map(result => result.project);

      setSearchResults(sortedResults);
      setIsLoading(false);
    }, 0);
  }, []);

  // 🚀 Perform search when debounced term changes
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  // 🚀 Save recent search with enhanced validation
  const saveRecentSearch = useCallback((term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm || trimmedTerm.length < 2) return;
    
    const updatedSearches = [
      trimmedTerm,
      ...recentSearches.filter(s => s !== trimmedTerm)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    
    try {
    localStorage.setItem('circles_recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }, [recentSearches]);

  // 🚀 Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
    localStorage.removeItem('circles_recent_searches');
    } catch (error) {
      console.warn('Failed to clear recent searches:', error);
    }
  }, []);

  // 🚀 Handle search icon click
  const handleSearchIconClick = useCallback(() => {
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  // 🚀 Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, []);

  // 🚀 Handle search submission
  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
      performSearch(searchTerm);
    }
  }, [searchTerm, saveRecentSearch, performSearch]);

  // 🚀 Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedIndex(-1);
    setIsExpanded(false);
  }, []);

  // 🚀 Memoized type icon getter
  const getTypeIcon = useCallback((type: ProjectType) => {
    const iconMap = {
      film: <Film className="w-4 h-4" />,
      music: <Music className="w-4 h-4" />,
      webseries: <Tv className="w-4 h-4" />
    };
    return iconMap[type] || <Film className="w-4 h-4" />;
  }, []);

  // 🚀 Memoized type color getter
  const getTypeColor = useCallback((type: ProjectType) => {
    const colorMap = {
      film: 'text-purple-400',
      music: 'text-blue-400',
      webseries: 'text-green-400'
    };
    return colorMap[type] || 'text-gray-400';
  }, []);

  // 🚀 Memoized text highlighting function with enhanced performance
  const highlightMatch = useCallback((text: string, query: string) => {
    if (!query.trim() || !text) return text;
    
    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400/30 text-yellow-200 font-semibold">
          {part}
        </span>
      ) : part
    );
    } catch {
      // Fallback to original text if regex fails
      return text;
    }
  }, []);

  // 🚀 Handle keyboard navigation with enhanced logic
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        const totalItems = searchResults.length > 0 
          ? searchResults.length 
          : recentSearches.length;
        
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (isOpen && totalItems > 0) {
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else {
        setIsOpen(true);
      }
        break;
    
      case 'ArrowUp':
      e.preventDefault();
        if (isOpen && totalItems > 0) {
          setSelectedIndex(prev => prev <= 0 ? totalItems - 1 : prev - 1);
        }
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults.length > 0) {
          const selectedProject = searchResults[selectedIndex];
          if (onSelectProject) {
            onSelectProject(selectedProject);
          }
          setIsOpen(false);
          setSelectedIndex(-1);
        } else if (searchTerm.trim()) {
          handleSearchSubmit();
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        if (!searchTerm) {
          setIsExpanded(false);
        }
        break;
    }
  }, [isOpen, searchResults, recentSearches, selectedIndex, searchTerm, onSelectProject, handleSearchSubmit]);

  // 🚀 Handle project selection
  const handleProjectSelect = useCallback((project: Project) => {
    if (onSelectProject) {
      onSelectProject(project);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [onSelectProject]);

  // 🚀 Handle recent search selection
  const handleRecentSearchSelect = useCallback((term: string) => {
    setSearchTerm(term);
    performSearch(term);
    setIsOpen(false);
    setSelectedIndex(-1);
  }, [performSearch]);



  return (
    <div ref={searchRef} className="relative">
      {/* 🚀 Search Icon and Input */}
      <div className="flex items-center gap-1">
        {!isExpanded ? (
          <button
            onClick={handleSearchIconClick}
            className="p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        ) : (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center gap-2 min-w-0"
          >
            <form onSubmit={handleSearchSubmit} className="relative min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                placeholder="Search projects, directors, artists..."
                className={`w-48 sm:w-56 md:w-64 lg:w-72 pl-3 pr-8 py-1 rounded-lg border transition-all duration-200 text-sm min-w-0 ${
                  theme === 'light'
                    ? 'bg-white border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                    : 'bg-gray-800 border-gray-600 focus:border-purple-400 focus:ring-2 focus:ring-purple-900'
                }`}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* 🚀 Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full right-0 mt-2 rounded-xl border shadow-lg z-50 w-80 sm:w-96 max-h-96 flex flex-col ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-900 border-gray-600'
            }`}
          >
            {/* Header with action buttons - always visible */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              {searchResults.length > 0 ? (
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Search Results ({searchResults.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    {onViewAllResults && (
                      <>
                        <button
                          onClick={() => onViewAllResults('')}
                          className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Advanced Search
                        </button>
                        <button
                          onClick={() => onViewAllResults(searchTerm)}
                          className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          View all results
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No Results
                  </h4>
                  {onViewAllResults && (
                    <button
                      onClick={() => onViewAllResults(searchTerm)}
                      className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Advanced Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Recent Searches
                  </h4>
                  <div className="flex items-center gap-2">
                    {onViewAllResults && (
                      <button
                        onClick={() => onViewAllResults('')}
                        className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        Advanced Search
                      </button>
                    )}
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto max-h-80">
              <div className="p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
    <div className="space-y-2">
      {searchResults.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedIndex === index
              ? theme === 'light'
                ? 'bg-purple-100 border-purple-300'
                : 'bg-purple-900/30 border-purple-500/50'
              : theme === 'light'
                ? 'bg-white hover:bg-gray-50 border-gray-200'
                : 'bg-gray-800 hover:bg-gray-700 border-gray-600'
          } border`}
          onClick={() => handleProjectSelect(project)}
        >
          <div className="flex items-start gap-3">
                          {/* Project Poster/Image */}
                          <div className="flex-shrink-0 relative">
                            {project.poster ? (
                              <>
                                <img
                                  src={project.poster}
                                  alt={project.title}
                                  className="w-12 h-16 object-cover rounded-md shadow-sm"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                                {/* Subtle dark overlay over poster for better text readability */}
                                <div className="absolute inset-0 bg-black/20 rounded-md" />
                              </>
                            ) : null}
                            {(!project.poster || project.poster === '') && (
                              <div className={`w-12 h-16 rounded-md flex items-center justify-center ${getTypeColor(project.type as ProjectType)} bg-opacity-10`}>
              {getTypeIcon(project.type as ProjectType)}
            </div>
                            )}
                          </div>
                          
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">
                {highlightMatch(project.title, searchTerm)}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2">
                {highlightMatch(project.description, searchTerm)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(project.type as ProjectType)} bg-opacity-10`}>
                  {project.type.toUpperCase()}
                </span>
                {project.rating && (
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    {project.rating}
                  </div>
                )}
                              {project.releaseYear && (
                                <span className="text-xs text-gray-400">
                                  {project.releaseYear}
                                </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
                ) : searchTerm.length >= 2 ? (
                  <div className="text-center py-4 text-gray-500">
                    No results found for "{searchTerm}"
                  </div>
                ) : (
    <div className="space-y-2">
      {recentSearches.map((term, index) => (
        <motion.div
          key={term}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedIndex === index
              ? theme === 'light'
                ? 'bg-purple-100'
                : 'bg-purple-900/30'
              : theme === 'light'
                ? 'hover:bg-gray-50'
                : 'hover:bg-gray-700'
          }`}
          onClick={() => handleRecentSearchSelect(term)}
        >
          <History className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{term}</span>
        </motion.div>
      ))}
    </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;