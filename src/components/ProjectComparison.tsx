import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChartBig, 
  Check, 
  Clock, 
  DollarSign, 
  Film, 
  Music, 
  Percent, 
  RotateCcw, 
  Search, 
  Shuffle, 
  Star, 
  Tv, 
  X 
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import ProjectDetailModal from './ProjectDetailModal';
import { Project } from '../types';
import { projects } from '../data/projects';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

interface ProjectComparisonProps {
  initialProjects?: Project[];
  onTrackInvestment?: () => void;
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail') => void;
  onProjectSelect?: (project: Project, tab?: 'overview' | 'invest') => void;
}

const ProjectComparison: React.FC<ProjectComparisonProps> = ({ initialProjects, onTrackInvestment, setCurrentView, onProjectSelect }) => {
  const { theme } = useTheme();

  const [compareProjects, setCompareProjects] = useState<Project[]>(initialProjects || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Project[]>([]);
  
  // Comparison criteria that can be toggled
  const [criteria, setCriteria] = useState({
    fundedPercentage: true,
    targetAmount: true,
    raisedAmount: true,
    timeLeft: true,
    rating: true,
    perks: true,
    investorCount: true
  });

  // Function to handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length > 2) {
      const results = projects
        .filter(project => !compareProjects.some(p => p.id === project.id))
        .filter(project => 
          project.title.toLowerCase().includes(term.toLowerCase()) ||
          project.description.toLowerCase().includes(term.toLowerCase()) ||
          project.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
        ).slice(0, 5);
      
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Function to add a project to comparison
  const addToComparison = (project: Project) => {
    if (compareProjects.length >= 3) {
      // Replace the first project if we already have 3
      setCompareProjects([...compareProjects.slice(1), project]);
    } else {
      setCompareProjects([...compareProjects, project]);
    }
    setSearchTerm('');
    setShowResults(false);
  };

  const handleInvestClick = (project: Project) => {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    if (onProjectSelect) {
      onProjectSelect(project, 'invest');
    }
  };

  // Function to remove a project from comparison
  const removeFromComparison = (projectId: string) => {
    setCompareProjects(compareProjects.filter(p => p.id !== projectId));
  };

  // Function to clear all comparisons
  const clearComparisons = () => {
    setCompareProjects([]);
  };

  // Function to toggle a comparison criterion
  const toggleCriterion = (key: keyof typeof criteria) => {
    setCriteria({ ...criteria, [key]: !criteria[key] });
  };

  // Function to pick random projects for comparison
  const pickRandomProjects = () => {
    const pick = (items: Project[]) => items[Math.floor(Math.random() * items.length)];
    const films = projects.filter(p => p.type === 'film');
    const musics = projects.filter(p => p.type === 'music');
    const series = projects.filter(p => p.type === 'webseries');

    const selections = [films, musics, series]
      .map(arr => (arr.length ? pick(arr) : null))
      .filter(Boolean) as Project[];

    setCompareProjects(selections);
  };

  // Get type icon component
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'webseries': return <Tv className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
    }
  };

  // Get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'film': return theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400';
      case 'music': return theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400';
      case 'webseries': return theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400';
      default: return theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-500/20 text-gray-400';
    }
  };

  // Find the best value for a criterion
  const findBestValue = (criterion: keyof Project) => {
    if (compareProjects.length === 0) return null;
    
    if (criterion === 'fundedPercentage' || criterion === 'rating') {
      return Math.max(...compareProjects.map(p => p[criterion] as number || 0));
    } else if (criterion === 'timeLeft') {
      // For timeLeft, lower days is better (closer to funding goal)
      const daysLeft = compareProjects.map(p => {
        if (!p.timeLeft) return Infinity;
        const days = parseInt(p.timeLeft.split(' ')[0]);
        return isNaN(days) ? Infinity : days;
      });
      return Math.min(...daysLeft);
    }
    
    return null;
  };

  // Check if a project has the best value for a criterion
  const hasBestValue = (project: Project, criterion: keyof Project) => {
    const bestValue = findBestValue(criterion);
    if (bestValue === null) return false;
    
    if (criterion === 'fundedPercentage' || criterion === 'rating') {
      return (project[criterion] as number || 0) === bestValue;
    } else if (criterion === 'timeLeft') {
      if (!project.timeLeft) return false;
      const days = parseInt(project.timeLeft.split(' ')[0]);
      return days === bestValue;
    }
    
    return false;
  };

  // Pre-populate with random projects if none are provided
  useEffect(() => {
    if (compareProjects.length === 0) {
      // Get a few random projects for initial comparison
      const randomProjects = [];
      const types = ['film', 'music', 'webseries'];
      
      for (const type of types) {
        const filteredProjects = projects.filter(p => p.type === type);
        if (filteredProjects.length > 0) {
          const randomProject = filteredProjects[Math.floor(Math.random() * filteredProjects.length)];
          randomProjects.push(randomProject);
        }
      }
      
      setCompareProjects(randomProjects);
    }
  }, [compareProjects.length]);

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
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
              Project Comparison
            </h1>
            <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
              Compare different investment opportunities side by side
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={clearComparisons}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              <span>Clear All</span>
            </button>
            
            <button
              onClick={pickRandomProjects}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <Shuffle className="w-5 h-5" />
              <span>Random</span>
            </button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className={`flex items-center gap-2 p-2 rounded-xl border ${
            theme === 'light'
              ? 'bg-white/80 border-gray-200'
              : 'bg-gray-900/50 border-gray-700'
          }`}>
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for projects to compare..."
                className={`w-full py-3 pl-12 pr-4 rounded-lg border ${
                  theme === 'light'
                    ? 'border-gray-300 focus:border-purple-500 bg-white/50 text-gray-900 placeholder-gray-500'
                    : 'border-gray-600 focus:border-purple-500 bg-gray-800/50 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              />
            </div>
            
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-2 rounded-lg ${
                  theme === 'light' 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {compareProjects.length} / 3
                </div>
                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  projects selected
                </div>
              </div>
            </div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 right-0 mt-2 z-20 rounded-xl border shadow-xl ${
                  theme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-900 border-gray-700'
                }`}
              >
                <div className="p-2">
                  {searchResults.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => addToComparison(project)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        theme === 'light'
                          ? 'hover:bg-gray-100'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={project.poster} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {project.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getTypeColor(project.type)}`}>
                            {getTypeIcon(project.type)}
                            <span>{project.type}</span>
                          </div>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>{project.category}</span>
                        </div>
                      </div>
                      <button
                        className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                          theme === 'light'
                            ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comparison Criteria Toggles */}
        <div className="mb-8">
          <div className={`p-4 rounded-xl border ${
            theme === 'light'
              ? 'bg-white/80 border-gray-200'
              : 'bg-gray-900/50 border-gray-700'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Comparison Criteria
              </h3>
              <button
                onClick={() => setCriteria({
                  fundedPercentage: true,
                  targetAmount: true,
                  raisedAmount: true,
                  timeLeft: true,
                  rating: true,
                  perks: true,
                  investorCount: true
                })}
                className={`text-xs transition-colors ${
                  theme === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                Reset to Default
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toggleCriterion('fundedPercentage')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.fundedPercentage
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <Percent className="w-4 h-4" />
                <span>Funded %</span>
                {criteria.fundedPercentage && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('targetAmount')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.targetAmount
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Target Amount</span>
                {criteria.targetAmount && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('raisedAmount')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.raisedAmount
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Raised Amount</span>
                {criteria.raisedAmount && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('timeLeft')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.timeLeft
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Time Left</span>
                {criteria.timeLeft && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('rating')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.rating
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <Star className="w-4 h-4" />
                <span>Rating</span>
                {criteria.rating && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('perks')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.perks
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Perks</span>
                {criteria.perks && <Check className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => toggleCriterion('investorCount')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  criteria.investorCount
                    ? (theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400')
                    : (theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-gray-400')
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Investor Count</span>
                {criteria.investorCount && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        {compareProjects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`w-full rounded-xl border ${
              theme === 'light'
                ? 'bg-white/80 border-gray-200'
                : 'bg-gray-900/50 border-gray-700'
            }`}>
              <thead>
                <tr>
                  <th className={`py-4 px-6 text-left font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Project Details
                  </th>
                  {compareProjects.map((project) => (
                    <th key={project.id} className="py-4 px-6">
                      <div className="flex flex-col items-center relative">
                        <div className="mb-4 w-24 h-36 rounded-lg overflow-hidden relative group">
                          <img 
                            src={project.poster} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <button
                            onClick={() => removeFromComparison(project.id)}
                            className="absolute top-2 right-2 p-1 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className={`text-center font-medium mb-1 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {project.title}
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${getTypeColor(project.type)}`}>
                          {getTypeIcon(project.type)}
                          <span>{project.type}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                  {compareProjects.length < 3 && (
                    <th className="py-4 px-6">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`mb-4 w-24 h-36 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${
                            theme === 'light'
                              ? 'border-gray-300 hover:border-purple-400 text-gray-400 hover:text-purple-500'
                              : 'border-gray-700 hover:border-purple-500 text-gray-500 hover:text-purple-400'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            (e.target as HTMLElement).focus();
                          }}
                        >
                          <div className="flex flex-col items-center">
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="text-xs text-center">Add project to compare</span>
                          </div>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Funding Progress */}
                {criteria.fundedPercentage && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <Percent className="w-5 h-5" />
                        <span>Funded Progress</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className={`relative ${hasBestValue(project, 'fundedPercentage') ? 'font-bold' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  project.type === 'film'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                    : project.type === 'music'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                                }`}
                                style={{ width: `${project.fundedPercentage}%` }}
                              />
                            </div>
                            <div className={`text-lg font-semibold ${
                              hasBestValue(project, 'fundedPercentage')
                                ? 'text-green-500'
                                : theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {project.fundedPercentage}%
                            </div>
                          </div>
                          {hasBestValue(project, 'fundedPercentage') && (
                            <div className={`absolute -top-2 -right-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-green-100' : 'bg-green-900/30'
                            }`}>
                              <Check className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Target Amount */}
                {criteria.targetAmount && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        <span>Target Amount</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className="flex flex-col items-center">
                          <div className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{(project.targetAmount / 100000).toFixed(1)}L
                          </div>
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Raised Amount */}
                {criteria.raisedAmount && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        <span>Raised Amount</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className="flex flex-col items-center">
                          <div className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{(project.raisedAmount / 100000).toFixed(1)}L
                          </div>
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Time Left */}
                {criteria.timeLeft && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>Time Left</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className={`relative ${hasBestValue(project, 'timeLeft') ? 'font-bold' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className={`text-lg font-semibold ${
                              hasBestValue(project, 'timeLeft')
                                ? 'text-orange-500'
                                : theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {project.timeLeft || 'N/A'}
                            </div>
                          </div>
                          {hasBestValue(project, 'timeLeft') && (
                            <div className={`absolute -top-2 -right-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-orange-100' : 'bg-orange-900/30'
                            }`}>
                              <Clock className="w-3 h-3 text-orange-500" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Rating */}
                {criteria.rating && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        <span>Rating</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className={`relative ${hasBestValue(project, 'rating') ? 'font-bold' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className={`text-lg font-semibold ${
                                hasBestValue(project, 'rating')
                                  ? 'text-yellow-500'
                                  : theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {project.rating || 'N/A'}
                              </span>
                            </div>
                          </div>
                          {hasBestValue(project, 'rating') && (
                            <div className={`absolute -top-2 -right-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-yellow-100' : 'bg-yellow-900/30'
                            }`}>
                              <Check className="w-3 h-3 text-yellow-500" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Perks */}
                {criteria.perks && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        <span>Investor Perks</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className="flex flex-col items-center">
                          <ul className="space-y-1 list-inside">
                            {project.perks.slice(0, 3).map((perk, i) => (
                              <li key={i} className="text-sm flex items-start">
                                <Check className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                                  theme === 'light' ? 'text-purple-500' : 'text-purple-400'
                                }`} />
                                <span className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                                  {perk}
                                </span>
                              </li>
                            ))}
                            {project.perks.length > 3 && (
                              <div className={`text-xs italic ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                +{project.perks.length - 3} more perks
                              </div>
                            )}
                          </ul>
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Investor Count */}
                {criteria.investorCount && (
                  <tr className={`${
                    theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                  }`}>
                    <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span>Investor Count</span>
                      </div>
                    </td>
                    {compareProjects.map((project) => (
                      <td key={project.id} className="py-4 px-6">
                        <div className={`relative ${hasBestValue(project, 'investorCount') ? 'font-bold' : ''}`}>
                          <div className="flex flex-col items-center">
                            <div className={`text-lg font-semibold ${
                              hasBestValue(project, 'investorCount')
                                ? 'text-blue-500'
                                : theme === 'light' ? 'text-gray-900' : 'text-white'
                            }`}>
                              {/* Generate random investor count if not available */}
                              {project.investorCount || Math.floor(Math.random() * 800) + 200}
                            </div>
                            <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              investors
                            </div>
                          </div>
                          {hasBestValue(project, 'investorCount') && (
                            <div className={`absolute -top-2 -right-2 p-1 rounded-full ${
                              theme === 'light' ? 'bg-blue-100' : 'bg-blue-900/30'
                            }`}>
                              <Check className="w-3 h-3 text-blue-500" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                    {compareProjects.length < 3 && <td></td>}
                  </tr>
                )}

                {/* Actions */}
                <tr className={`${
                  theme === 'light' ? 'border-t border-gray-200' : 'border-t border-gray-700'
                }`}>
                  <td className={`py-4 px-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    <div className="flex items-center gap-2">
                      <BarChartBig className="w-5 h-5" />
                      <span>Actions</span>
                    </div>
                  </td>
                  {compareProjects.map((project) => (
                    <td key={project.id} className="py-4 px-6">
                      <div className="flex flex-col items-center gap-3">
                        <button
                          onClick={() => handleInvestClick(project)}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            theme === 'light'
                              ? 'bg-purple-500 hover:bg-purple-600 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          Invest Now
                        </button>
                        <button
                          onClick={() => { if (onProjectSelect) onProjectSelect(project, 'overview'); }}
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            theme === 'light'
                              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                              : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  ))}
                  {compareProjects.length < 3 && <td></td>}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className={`p-12 rounded-xl border text-center ${
            theme === 'light'
              ? 'bg-white/80 border-gray-200'
              : 'bg-gray-900/50 border-gray-700'
          }`}>
            <div className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
              <BarChartBig className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              No projects to compare
            </h3>
            <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Search for projects above or use the random button to get started
            </p>
            <button
              onClick={pickRandomProjects}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <Shuffle className="w-5 h-5" />
              <span>Random Comparison</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

// Helper component for the plus icon
const Plus: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

// Helper component for the users icon
const Users: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default ProjectComparison;