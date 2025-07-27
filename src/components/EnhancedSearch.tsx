import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  ChevronDown, 
  ExternalLink, 
  Film, 
  Filter, 
  Globe, 
  Music, 
  RotateCcw, 
  Search as SearchIcon, 
  SlidersHorizontal, 
  Star, 
  Tags, 
  TrendingUp,
  Tv, 
  X,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { projects } from '../data/projects';
import { Project } from '../types';

interface EnhancedSearchProps {
  onSelectProject?: (project: Project) => void;
  initialSearchTerm?: string;
  onBack?: () => void;
}

const EnhancedSearch: React.FC<EnhancedSearchProps> = ({ onSelectProject, initialSearchTerm = '', onBack }) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [activeLanguage, setActiveLanguage] = useState<string>('all');
  const [activeGenre, setActiveGenre] = useState<string>('all');
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Get unique values for filters
  const categories = ['all', ...Array.from(new Set(projects.filter(p => p.disabled === false).map(p => p.category.toLowerCase())))];
  const types = ['all', ...Array.from(new Set(projects.filter(p => p.disabled === false).map(p => p.type)))];
  const languages = ['all', ...Array.from(new Set(projects.filter(p => p.disabled === false).map(p => p.language.toLowerCase())))];
  const genres = ['all', ...Array.from(new Set(projects.filter(p => p.disabled === false).map(p => {
    const genres = [];
    if (p.genre) genres.push(p.genre.toLowerCase());
    return genres;
  }).flat()))];

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem('circles_recent_searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);



  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...recentSearches.filter(s => s !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('circles_recent_searches', JSON.stringify(updatedSearches));
  }, [recentSearches, setRecentSearches]);

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('circles_recent_searches');
  };

  // Calculate string similarity (Levenshtein distance)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
  };

  // Enhanced search matching with fuzzy search
  const matchesSearchTerm = useCallback((project: Project, term: string): boolean => {
    if (!term.trim()) return true;
    
    const searchTermLower = term.toLowerCase();
    const searchWords = searchTermLower.split(' ').filter(word => word.length > 0);
    
    // Direct matches (highest priority)
    const directMatches = [
      project.title.toLowerCase(),
      project.description.toLowerCase(),
      ...project.tags.map(tag => tag.toLowerCase()),
      project.director?.toLowerCase() || '',
      project.artist?.toLowerCase() || '',
      project.actor?.toLowerCase() || '',
      project.actress?.toLowerCase() || '',
      project.productionHouse?.toLowerCase() || '',
      project.cast?.toLowerCase() || '',
      ...(project.keyPeople?.map(person => person.name.toLowerCase()) || [])
    ].filter(text => text.length > 0);

    // Check for direct matches first
    for (const text of directMatches) {
      if (text.includes(searchTermLower)) {
        return true;
      }
    }

    // Check for partial word matches
    for (const word of searchWords) {
      if (word.length < 2) continue;
      
      for (const text of directMatches) {
        if (text.includes(word)) {
          return true;
        }
      }
    }

    // Fuzzy matching for typos and similar words
    for (const word of searchWords) {
      if (word.length < 3) continue;
      
      for (const text of directMatches) {
        const textWords = text.split(' ');
        for (const textWord of textWords) {
          if (textWord.length < 3) continue;
          
          const similarity = calculateSimilarity(word, textWord);
          if (similarity > 0.7) { // 70% similarity threshold
            return true;
          }
        }
      }
    }

    return false;
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    // Only show results if there's a search term or filters are applied
    const hasSearchTerm = searchTerm.trim().length > 0;
    const hasActiveFilters = activeCategory !== 'all' || activeType !== 'all' || 
                           activeLanguage !== 'all' || activeGenre !== 'all' || 
                           fundingRange[0] > 0 || fundingRange[1] < 100;
    
    if (!hasSearchTerm && !hasActiveFilters) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    // Set searching state to true to show results
    setIsSearching(true);
    
    // Add search term to recent searches if it's not empty
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
    }
    
    // Filter projects based on criteria
    let results = projects.filter(project => {
      // Filter out disabled projects only
      if (project.disabled === true) {
        return false;
      }

      // Enhanced search term filter - require search term if no filters
      const matchesTerm = !searchTerm.trim() || matchesSearchTerm(project, searchTerm);
      
      // Category filter
      const matchesCategory = activeCategory === 'all' || 
        project.category.toLowerCase() === activeCategory.toLowerCase();
      
      // Type filter
      const matchesType = activeType === 'all' || project.type === activeType;
      
      // Language filter
      const matchesLanguage = activeLanguage === 'all' || 
        project.language.toLowerCase() === activeLanguage.toLowerCase();
      
      // Genre filter
      const matchesGenre = activeGenre === 'all' || 
        (project.genre && project.genre.toLowerCase().includes(activeGenre.toLowerCase()));
      
      // Funding range filter
      const matchesFunding = 
        project.fundedPercentage >= fundingRange[0] && 
        project.fundedPercentage <= fundingRange[1];
      
      return matchesTerm && matchesCategory && matchesType && 
             matchesLanguage && matchesGenre && matchesFunding;
    });

    // Sort results
    results = sortResults(results, sortBy, sortOrder);
    
    setSearchResults(results);
  }, [searchTerm, activeCategory, activeType, activeLanguage, activeGenre, fundingRange, sortBy, sortOrder, saveRecentSearch, matchesSearchTerm]);

  // Real-time search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeCategory, activeType, activeLanguage, activeGenre, fundingRange, sortBy, sortOrder, handleSearch, matchesSearchTerm]);

  // Trigger search when initialSearchTerm is provided or on mount
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
      // Trigger search after a short delay to ensure component is mounted
      setTimeout(() => {
        handleSearch();
      }, 100);
    }
    // Don't show any projects on initial load if no search term
  }, [initialSearchTerm, handleSearch]);

  // Sort results based on criteria
  const sortResults = (results: Project[], sortField: string, order: 'asc' | 'desc') => {
    return [...results].sort((a, b) => {
      let compareResult = 0;
      
      switch (sortField) {
        case 'title':
          compareResult = a.title.localeCompare(b.title);
          break;
        case 'fundedPercentage':
          compareResult = a.fundedPercentage - b.fundedPercentage;
          break;
        case 'targetAmount':
          compareResult = a.targetAmount - b.targetAmount;
          break;
        case 'rating':
          compareResult = (a.rating || 0) - (b.rating || 0);
          break;
        case 'createdAt': {
          // Sort by creation date
          const aDate = new Date(a.createdAt);
          const bDate = new Date(b.createdAt);
          compareResult = aDate.getTime() - bDate.getTime();
          break;
        }
        default: // relevance - keep original order
          return 0;
      }
      
      return order === 'asc' ? compareResult : -compareResult;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setActiveType('all');
    setActiveLanguage('all');
    setActiveGenre('all');
    setFundingRange([0, 100]);
    setSortBy('relevance');
    setSortOrder('desc');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'film': return <Film className="w-5 h-5" />;
      case 'music': return <Music className="w-5 h-5" />;
      case 'webseries': return <Tv className="w-5 h-5" />;
      default: return <Film className="w-5 h-5" />;
    }
  };



  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 to-white'
        : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            )}
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Project Search
            </h1>
          </div>
          <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Find the perfect entertainment projects to invest in
          </p>
        </motion.div>

        {/* Main Search Bar */}
        <div className="mb-8">
          <div className={`flex items-stretch gap-2 p-2 rounded-xl border ${
            theme === 'light'
              ? 'bg-white/80 border-gray-200 shadow-sm'
              : 'bg-gray-900/50 border-gray-700'
          }`}>
            <div className="relative flex-1">
              <SearchIcon className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for projects by title, description, director, artist, production house, actors..."
                className={`w-full pl-12 pr-4 py-4 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white/50 text-gray-900'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-800/50 text-white'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                    theme === 'light' ? 'text-gray-500 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } transition-colors`}
            >
              <Filter className="w-5 h-5" />
              <span className="hidden md:inline">Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <button
              onClick={handleSearch}
              className={`px-6 py-2 rounded-lg font-medium ${
                theme === 'light'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } transition-colors`}
            >
              Search
            </button>
          </div>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                Recent:
              </span>
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setSearchTerm(term)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  {term}
                </button>
              ))}
              <button
                onClick={clearRecentSearches}
                className={`px-2 py-1 rounded-full text-xs ${
                  theme === 'light'
                    ? 'text-gray-500 hover:text-gray-700'
                    : 'text-gray-500 hover:text-gray-300'
                } transition-colors`}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-8 overflow-hidden`}
            >
              <div className={`p-6 rounded-xl border ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200'
                  : 'bg-gray-900/50 border-gray-700'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-semibold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Advanced Filters
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={resetFilters}
                      className={`flex items-center gap-2 text-sm ${
                        theme === 'light' ? 'text-gray-600 hover:text-gray-800' : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Filters</span>
                    </button>
                    <button
                      onClick={() => setShowAdvancedFilters(false)}
                      className={`p-1 rounded-full ${
                        theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                          theme === 'light'
                            ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                            : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        <option value="all">All Categories</option>
                        {categories.filter(c => c !== 'all').map((category) => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Type Filter */}
                  <div>
                    <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={activeType}
                        onChange={(e) => setActiveType(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                          theme === 'light'
                            ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                            : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        <option value="all">All Types</option>
                        {types.filter(t => t !== 'all').map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Language Filter */}
                  <div>
                    <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Language
                    </label>
                    <div className="relative">
                      <select
                        value={activeLanguage}
                        onChange={(e) => setActiveLanguage(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                          theme === 'light'
                            ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                            : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        <option value="all">All Languages</option>
                        {languages.filter(l => l !== 'all').map((language) => (
                          <option key={language} value={language}>
                            {language.charAt(0).toUpperCase() + language.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Genre Filter */}
                  <div>
                    <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      Genre
                    </label>
                    <div className="relative">
                      <select
                        value={activeGenre}
                        onChange={(e) => setActiveGenre(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border appearance-none ${
                          theme === 'light'
                            ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                            : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                        } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                      >
                        <option value="all">All Genres</option>
                        {genres.filter(g => g !== 'all').map((genre) => (
                          <option key={genre} value={genre}>
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                </div>
                
                {/* Funding Progress Range */}
                <div className="mt-6">
                  <label className={`block font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Funding Progress: {fundingRange[0]}% - {fundingRange[1]}%
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fundingRange[0]}
                      onChange={(e) => setFundingRange([Number(e.target.value), fundingRange[1]])}
                      className="w-full"
                    />
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>to</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fundingRange[1]}
                      onChange={(e) => setFundingRange([fundingRange[0], Number(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        {isSearching && (
          <>
            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Search Results
                </h2>
                <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  Found {searchResults.length} {searchResults.length === 1 ? 'project' : 'projects'} matching your criteria
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`pl-4 pr-8 py-2 rounded-lg border appearance-none ${
                        theme === 'light'
                          ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                          : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                    >
                      <option value="relevance">Relevance</option>
                      <option value="title">Title</option>
                      <option value="fundedPercentage">Funding %</option>
                      <option value="targetAmount">Target Amount</option>
                      <option value="rating">Rating</option>
                      <option value="createdAt">Created Date</option>
                    </select>
                    <ChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                      theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <button
                    onClick={toggleSortOrder}
                    className={`p-2 rounded-lg ${
                      theme === 'light'
                        ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                    } transition-colors`}
                  >
                    {sortOrder === 'asc' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Active Filters:
              </div>
              
              {searchTerm && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-purple-900/30 text-purple-400'
                }`}>
                  <SearchIcon className="w-4 h-4" />
                  <span>{searchTerm}</span>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {activeCategory !== 'all' && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-blue-900/30 text-blue-400'
                }`}>
                  <Tags className="w-4 h-4" />
                  <span>{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</span>
                  <button
                    onClick={() => setActiveCategory('all')}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {activeType !== 'all' && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-900/30 text-green-400'
                }`}>
                  {activeType === 'film' ? <Film className="w-4 h-4" /> : 
                   activeType === 'music' ? <Music className="w-4 h-4" /> : 
                   <Tv className="w-4 h-4" />}
                  <span>{activeType.charAt(0).toUpperCase() + activeType.slice(1)}</span>
                  <button
                    onClick={() => setActiveType('all')}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {activeLanguage !== 'all' && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  <Globe className="w-4 h-4" />
                  <span>{activeLanguage.charAt(0).toUpperCase() + activeLanguage.slice(1)}</span>
                  <button
                    onClick={() => setActiveLanguage('all')}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {activeGenre !== 'all' && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-red-900/30 text-red-400'
                }`}>
                  <Tags className="w-4 h-4" />
                  <span>{activeGenre.charAt(0).toUpperCase() + activeGenre.slice(1)}</span>
                  <button
                    onClick={() => setActiveGenre('all')}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {(fundingRange[0] > 0 || fundingRange[1] < 100) && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  theme === 'light'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-orange-900/30 text-orange-400'
                }`}>
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Funding: {fundingRange[0]}% - {fundingRange[1]}%</span>
                  <button
                    onClick={() => setFundingRange([0, 100])}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {(searchTerm || activeCategory !== 'all' || activeType !== 'all' || 
               activeLanguage !== 'all' || activeGenre !== 'all' || 
               fundingRange[0] > 0 || fundingRange[1] < 100) && (
                <button
                  onClick={resetFilters}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    theme === 'light'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  } transition-colors`}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All</span>
                </button>
              )}
            </div>
            
            {/* Results Grid/List */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    onClick={() => onSelectProject && onSelectProject(project)}
                    className={`cursor-pointer rounded-xl border overflow-hidden transition-transform duration-300 hover:scale-105 ${
                      theme === 'light'
                        ? 'bg-white/60 border-gray-200 shadow-sm hover:shadow-md'
                        : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 hover:border-white/30'
                    }`}
                  >
                    {/* Project Image */}
                    <div className="relative h-48">
                      <img 
                        src={project.poster} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          project.type === 'film'
                            ? 'bg-purple-500/80 text-white'
                            : project.type === 'music'
                            ? 'bg-blue-500/80 text-white'
                            : 'bg-green-500/80 text-white'
                        }`}>
                          {getTypeIcon(project.type)}
                          <span>{project.type}</span>
                        </div>
                      </div>
                      {project.rating && (
                        <div className="absolute top-2 right-2">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/60 text-white`}>
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span>{typeof project.rating === 'number' ? project.rating.toFixed(1) : 'N/A'}</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="relative h-2 bg-black/30">
                          <div 
                            className={`absolute top-0 left-0 h-full ${
                              project.type === 'film'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                : project.type === 'music'
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-500'
                            }`}
                            style={{ width: `${project.fundedPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Details */}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {project.title}
                          </h3>
                          <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                            {project.description}
                          </p>
                        </div>
                      </div>
                      
                        <div className="flex items-center justify-between mb-2">
                          <div className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            {project.fundedPercentage}% Funded
                          </div>
                          {project.status === 'active' && (
                            <div className={`text-sm ${theme === 'light' ? 'text-orange-600' : 'text-orange-400'}`}>
                              Active
                            </div>
                          )}
                        </div>
                      
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Target: ₹{(project.targetAmount / 100000).toFixed(1)}L
                        </div>
                      
                      {/* Project Tags */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <div className={`px-2 py-0.5 rounded text-xs ${
                          theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'
                        }`}>
                          {project.category}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs ${
                          theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
                        }`}>
                          {project.language}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs ${
                          theme === 'light' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {project.genre}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className={`p-12 rounded-xl border text-center ${
                  theme === 'light'
                    ? 'bg-white/60 border-gray-200'
                    : 'bg-gradient-to-br from-white/5 to-white/2 border-white/10'
                }`}
              >
                <div className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
                  <SearchIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  No results found
                </h3>
                <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6`}>
                  Try adjusting your search terms or filters
                </p>
                <button
                  onClick={resetFilters}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                    theme === 'light'
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } transition-colors`}
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset All Filters</span>
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Initial Search Screen */}
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-12 rounded-xl border ${
              theme === 'light'
                ? 'bg-white/60 border-gray-200'
                : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
            }`}
          >
            <div className="max-w-lg mx-auto text-center">
              <div className={`text-6xl mb-6 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
                <SearchIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Find Your Next Investment
              </h3>
              <p className={`mb-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Search for projects by title, description, creator, genre, or use the advanced filters to narrow down your options.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Film className="w-5 h-5" />
                  <span>Film</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Music className="w-5 h-5" />
                  <span>Music</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500">
                  <Tv className="w-5 h-5" />
                  <span>Web Series</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <Globe className="w-5 h-5" />
                  <span>Regional</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500">
                  <Calendar className="w-5 h-5" />
                  <span>New Releases</span>
                </div>
              </div>
              
              <div className={`flex flex-col sm:flex-row items-center gap-4 justify-center ${recentSearches.length === 0 ? 'hidden' : ''}`}>
                <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  Try searching for:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(term);
                        handleSearch();
                      }}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        theme === 'light'
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      } transition-colors`}
                    >
                      <SearchIcon className="w-3 h-3" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Popular Categories */}
              <div className="mt-10">
                <h4 className={`font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Quick Links
                </h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: 'Trending Projects', icon: TrendingUp },
                    { label: 'Ending Soon', icon: Calendar },
                    { label: 'High ROI', icon: Star },
                    { label: 'Bollywood', icon: Film },
                    { label: 'Regional Cinema', icon: Film },
                    { label: 'Hollywood', icon: Film },
                    { label: 'Music Albums', icon: Music },
                    { label: 'Web Series', icon: Tv }
                  ].map((link, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        theme === 'light'
                          ? 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'
                      } transition-colors`}
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EnhancedSearch;