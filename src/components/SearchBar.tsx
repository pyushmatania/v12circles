import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Film, 
  Music, 
  Tv, 
  Clock, 
  History, 
  ArrowRight, 
  Star, 
  TrendingUp
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { projects } from '../data/projects';
import { Project } from '../types';
import { useDebounce } from '../hooks/useDebounce';

interface SearchBarProps {
  onSelectProject?: (project: Project) => void;
  onViewAllResults?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectProject, onViewAllResults }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('circles_recent_searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized search function
  const performSearch = useCallback((term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      let results = projects.filter(project => {
        return project.title.toLowerCase().includes(term.toLowerCase()) ||
          project.description.toLowerCase().includes(term.toLowerCase()) ||
          project.tags.some((tag: string) => tag.toLowerCase().includes(term.toLowerCase())) ||
          (project.director && project.director.toLowerCase().includes(term.toLowerCase())) ||
          (project.artist && project.artist.toLowerCase().includes(term.toLowerCase()));
      });

      // Sort by relevance (title match first)
      results = results.sort((a, b) => {
        const aInTitle = a.title.toLowerCase().includes(term.toLowerCase());
        const bInTitle = b.title.toLowerCase().includes(term.toLowerCase());

        if (aInTitle && !bInTitle) return -1;
        if (!aInTitle && bInTitle) return 1;
        return 0;
      });

      setSearchResults(results.slice(0, 5)); // Limit to 5 results
      setIsLoading(false);
    }, 0);
  }, []);

  // Perform search when debounced term changes
  useEffect(() => {
    performSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, performSearch]);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('circles_recent_searches', JSON.stringify(updatedSearches));
  }, [recentSearches]);

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('circles_recent_searches');
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
      performSearch(searchTerm);
    }
  }, [searchTerm, saveRecentSearch, performSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Memoized type icon getter
  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'webseries': return <Tv className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
    }
  }, []);

  // Memoized type color getter
  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'film': return 'text-purple-400';
      case 'music': return 'text-blue-400';
      case 'webseries': return 'text-green-400';
      default: return 'text-gray-400';
    }
  }, []);

  // Memoized text highlighting function
  const highlightMatch = useCallback((text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-400/30 text-yellow-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isOpen) {
        const totalItems = searchResults.length > 0 
          ? searchResults.length 
          : recentSearches.length;
        
        setSelectedIndex(prev => (prev + 1) % totalItems);
      } else {
        setIsOpen(true);
      }
    }
    
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen) {
        const totalItems = searchResults.length > 0 
          ? searchResults.length 
          : recentSearches.length;
        
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      }
    }
    
    // Enter
    else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        if (searchResults.length > 0) {
          // Select the highlighted search result
          const selectedProject = searchResults[selectedIndex];
          if (selectedProject && onSelectProject) {
            onSelectProject(selectedProject);
            setIsOpen(false);
            saveRecentSearch(searchTerm);
          }
        } else if (recentSearches.length > 0) {
          // Use the highlighted recent search
          const selectedTerm = recentSearches[selectedIndex];
          setSearchTerm(selectedTerm);
          performSearch(selectedTerm);
        }
      } else {
        handleSearchSubmit();
      }
    }
    
    // Escape
    else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, searchResults, recentSearches, selectedIndex, onSelectProject, searchTerm, saveRecentSearch, performSearch, handleSearchSubmit]);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Icon Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }}
        className={`p-2 rounded-lg transition-colors ${
          theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, width: 0 }}
            animate={{ opacity: 1, y: 0, width: 'auto' }}
            exit={{ opacity: 0, y: 10, width: 0 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-0 right-0 rounded-xl border shadow-xl overflow-hidden z-50 ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-900 border-gray-700'
            }`}
            style={{ width: '300px' }}
          >
            <div className="p-2 flex items-center">
              <Search className={`w-5 h-5 mr-2 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search projects..."
                  className={`w-full py-2 focus:outline-none ${
                    theme === 'light'
                      ? 'bg-transparent text-gray-900 placeholder-gray-500'
                      : 'bg-transparent text-white placeholder-gray-400'
                  }`}
                  autoFocus
                />
              </form>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-purple-500"></div>
              ) : searchTerm ? (
                <button
                  onClick={clearSearch}
                  className={`p-1 rounded-full ${
                    theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full ${
                    theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {searchTerm.length < 2 && recentSearches.length > 0 && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className={`text-xs ${theme === 'light' ? 'text-gray-500 hover:text-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((term, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSearchTerm(term);
                        performSearch(term);
                      }}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                        selectedIndex === index
                          ? theme === 'light' 
                            ? 'bg-purple-50' 
                            : 'bg-purple-900/10'
                          : theme === 'light'
                            ? 'hover:bg-gray-100'
                            : 'hover:bg-gray-800'
                      }`}
                    >
                      <History className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                        {term}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && searchTerm.length >= 2 && (
              <>
                {searchResults.length > 0 ? (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.id}
                        onClick={() => {
                          if (onSelectProject) {
                            onSelectProject(result);
                            setIsOpen(false);
                            saveRecentSearch(searchTerm);
                          }
                        }}
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
                            {result.rating && (
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 text-yellow-400" />
                                <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                                  {result.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            {result.fundedPercentage && (
                              <div className="flex items-center gap-1 text-xs">
                                <TrendingUp className={`w-3 h-3 ${
                                  result.fundedPercentage > 75 ? 'text-green-400' :
                                  result.fundedPercentage > 50 ? 'text-yellow-400' : 'text-gray-400'
                                }`} />
                                <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                                  {result.fundedPercentage}%
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
                      </div>
                    ))}

                    {/* View All Results Button */}
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          if (onViewAllResults) {
                            onViewAllResults();
                            setIsOpen(false);
                            saveRecentSearch(searchTerm);
                          }
                        }}
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
                ) : (
                  <div className="p-6 text-center">
                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      No results found for "{searchTerm}"
                    </p>
                    <p className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Keyboard Navigation Help */}
            <div className={`p-2 text-xs border-t ${
              theme === 'light' ? 'border-gray-200 text-gray-500' : 'border-gray-700 text-gray-500'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className={`px-1 py-0.5 rounded border ${
                    theme === 'light' ? 'border-gray-300 bg-gray-100' : 'border-gray-600 bg-gray-800'
                  }`}>↑↓</span>
                  <span>navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1 py-0.5 rounded border ${
                    theme === 'light' ? 'border-gray-300 bg-gray-100' : 'border-gray-600 bg-gray-800'
                  }`}>Enter</span>
                  <span>select</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-1 py-0.5 rounded border ${
                    theme === 'light' ? 'border-gray-300 bg-gray-100' : 'border-gray-600 bg-gray-800'
                  }`}>Esc</span>
                  <span>close</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;