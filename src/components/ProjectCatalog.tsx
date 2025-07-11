import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Film, Music, Tv, Search, Star, Clock, ChevronLeft, ChevronRight, Play, Info, Siren as Fire, Filter, Heart, Share2, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  projects, 
  trendingNow, 
  bollywoodSection, 
  hollywoodSection, 
  actionThrillers, 
  dramaRomance, 
  comedyEntertainment, 
  sciFiFantasy, 
  allProjects, 
  highRatedProjects, 
  newlyAddedProjects, 
  mostFundedProjects 
} from '../data/projects';

import { Project } from '../types';
import ProjectCard from './ProjectCard';

interface ProjectCatalogProps {
  onTrackInvestment?: () => void;
  onProjectSelect?: (project: Project, tab?: 'overview' | 'invest') => void;
}

// Memoized filter options to prevent recreation on every render
const FILTER_OPTIONS = {
  categories: [
    { id: 'all', label: 'All Categories' },
    { id: 'bollywood', label: 'Bollywood' },
    { id: 'hollywood', label: 'Hollywood' },
    { id: 'regional', label: 'Regional' },
    { id: 'independent', label: 'Independent' }
  ],
  types: [
    { id: 'all', label: 'All Types' },
    { id: 'film', label: 'Films' },
    { id: 'webseries', label: 'Web Series' },
    { id: 'music', label: 'Music' }
  ],
  languages: [
    { id: 'all', label: 'All Languages' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'english', label: 'English' },
    { id: 'tamil', label: 'Tamil' },
    { id: 'telugu', label: 'Telugu' },
    { id: 'kannada', label: 'Kannada' },
    { id: 'malayalam', label: 'Malayalam' }
  ],
  genres: [
    { id: 'all', label: 'All Genres' },
    { id: 'action', label: 'Action' },
    { id: 'drama', label: 'Drama' },
    { id: 'comedy', label: 'Comedy' },
    { id: 'thriller', label: 'Thriller' },
    { id: 'romance', label: 'Romance' },
    { id: 'horror', label: 'Horror' },
    { id: 'sci-fi', label: 'Sci-Fi' },
    { id: 'fantasy', label: 'Fantasy' },
    { id: 'documentary', label: 'Documentary' }
  ],
  sortOptions: [
    { id: 'trending', label: 'Trending' },
    { id: 'newest', label: 'Newest First' },
    { id: 'funding-high', label: 'Highest Funded' },
    { id: 'funding-low', label: 'Lowest Funded' },
    { id: 'ending-soon', label: 'Ending Soon' },
    { id: 'rating', label: 'Highest Rated' },
    { id: 'amount-high', label: 'Highest Target' },
    { id: 'amount-low', label: 'Lowest Target' }
  ]
} as const;

const ProjectCatalog: React.FC<ProjectCatalogProps> = ({ onTrackInvestment, onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Auto-sliding hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [lastSlideChange, setLastSlideChange] = useState(Date.now());
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('trending');
  const [showAllProjects, setShowAllProjects] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get featured projects directly from the projects array
  const featuredProjects = projects.filter(p => p.featured === true && p.disabled === false && p.poster && p.title && p.rating && !isNaN(p.rating)).slice(0, 30);
  
  // Fallback to high-rated projects if no featured projects available
  const fallbackProjects = projects.filter(p => p.disabled === false && p.poster && p.title && p.rating && !isNaN(p.rating) && p.rating >= 6.0).slice(0, 30);
  const finalFeaturedProjects = featuredProjects.length > 0 ? featuredProjects : fallbackProjects;
  
  // Ultimate fallback - if still no projects, take any valid projects
  const ultimateFallback = finalFeaturedProjects.length === 0 ? projects.filter(p => p.disabled === false && p.poster && p.title).slice(0, 30) : finalFeaturedProjects;
  
  // Debug logging
  console.log('Featured projects count:', ultimateFallback.length);
  console.log('Featured projects:', ultimateFallback.map(p => ({ title: p.title, rating: p.rating, disabled: p.disabled, featured: p.featured })));
  console.log('Total projects with featured=true:', projects.filter(p => p.featured === true).length);
  console.log('Total projects with disabled=false:', projects.filter(p => p.disabled === false).length);

  // Memoized callback functions to prevent unnecessary re-renders
  const handleProjectClick = useCallback((project: Project, tab: 'overview' | 'invest' = 'overview') => {
    if (onProjectSelect) {
      onProjectSelect(project, tab);
    }
  }, [onProjectSelect]);

  const handleInvestClick = useCallback((project: Project) => {
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    handleProjectClick(project, 'invest');
  }, [handleProjectClick]);



  // Memoized filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.director && project.director.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.artist && project.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.productionHouse && project.productionHouse.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.keyPeople && project.keyPeople.some(person => person.name.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesCategory = selectedCategory === 'all' || 
        project.category.toLowerCase().includes(selectedCategory);
      
      const matchesType = selectedType === 'all' || project.type === selectedType;
      
      const matchesLanguage = selectedLanguage === 'all' || 
        project.language.toLowerCase() === selectedLanguage;
      
      const matchesGenre = selectedGenre === 'all' || 
        project.genre.toLowerCase().includes(selectedGenre) ||
        project.tags.some((tag: string) => tag.toLowerCase().includes(selectedGenre));
      
      const matchesFunding = project.fundedPercentage >= fundingRange[0] && 
        project.fundedPercentage <= fundingRange[1];

      return matchesSearch && matchesCategory && matchesType && 
             matchesLanguage && matchesGenre && matchesFunding;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'funding-high':
          return b.fundedPercentage - a.fundedPercentage;
        case 'funding-low':
          return a.fundedPercentage - b.fundedPercentage;
        case 'ending-soon': {
          // Sort by funding percentage for ending soon (higher percentage = more urgent)
          return b.fundedPercentage - a.fundedPercentage;
        }
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'amount-high':
          return b.targetAmount - a.targetAmount;
        case 'amount-low':
          return a.targetAmount - b.targetAmount;
        case 'newest':
          return b.id.localeCompare(a.id);
        default: // trending
          return b.fundedPercentage - a.fundedPercentage;
      }
    });
  }, [searchTerm, selectedCategory, selectedType, selectedLanguage, selectedGenre, fundingRange, sortBy]);

  // Memoized categorized projects for Netflix-style layout using diverse arrays
  const categorizedProjects = useMemo((): {
    trending: Project[];
    bollywood: Project[];
    hollywood: Project[];
    actionThrillers: Project[];
    dramaRomance: Project[];
    comedyEntertainment: Project[];
    sciFiFantasy: Project[];
    highRated: Project[];
    newlyAdded: Project[];
    mostFunded: Project[];
    regional: Project[];
    music: Project[];
    webseries: Project[];
    featured: Project[];
  } => {
    try {
    const regionalContent = projects
      .filter(p => p.category === 'Regional')
      .slice(0, 10);

    const musicProjects = projects
      .filter(p => p.type === 'music')
      .slice(0, 10);

    const webSeries = projects
      .filter(p => p.type === 'webseries')
      .slice(0, 10);

          const featuredProjects = projects
      .filter(p => p.featured === true && p.disabled === false && p.poster && p.title && p.rating && !isNaN(p.rating))
      .sort((a, b) => b.fundedPercentage - a.fundedPercentage)
      .slice(0, 30);

      return {
        trending: trendingNow || [],
        bollywood: bollywoodSection || [],
        hollywood: hollywoodSection || [],
        actionThrillers: actionThrillers || [],
        dramaRomance: dramaRomance || [],
        comedyEntertainment: comedyEntertainment || [],
        sciFiFantasy: sciFiFantasy || [],
        highRated: highRatedProjects || [],
        newlyAdded: newlyAddedProjects || [],
        mostFunded: mostFundedProjects || [],
        regional: regionalContent,
        music: musicProjects,
        webseries: webSeries,
        featured: featuredProjects
      };
    } catch (error) {
      console.error('Error in categorizedProjects:', error);
      // Return empty arrays as fallback
    return {
        trending: [],
        bollywood: [],
        hollywood: [],
        actionThrillers: [],
        dramaRomance: [],
        comedyEntertainment: [],
        sciFiFantasy: [],
        highRated: [],
        newlyAdded: [],
        mostFunded: [],
        regional: [],
        music: [],
        webseries: [],
        featured: []
    };
    }
  }, []);

  // Function to reset auto-slide timer
  const resetAutoSlideTimer = useCallback(() => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
    
    if (isAutoPlaying && !isPaused && ultimateFallback.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = (prev + 1) % ultimateFallback.length;
          return nextSlide;
        });
      }, 5000);
    }
  }, [isAutoPlaying, isPaused, ultimateFallback.length]);

  // Memoized callback functions for carousel controls
  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
    setLastSlideChange(Date.now());
    resetAutoSlideTimer();
  }, [resetAutoSlideTimer]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + 1) % ultimateFallback.length;
      console.log('Next slide:', { prev, nextIndex, totalLength: ultimateFallback.length, project: ultimateFallback[nextIndex]?.title });
      return nextIndex;
    });
    setLastSlideChange(Date.now());
    resetAutoSlideTimer();
  }, [ultimateFallback.length, resetAutoSlideTimer]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev === 0 ? Math.max(0, ultimateFallback.length - 1) : prev - 1);
    setLastSlideChange(Date.now());
    resetAutoSlideTimer();
  }, [ultimateFallback.length, resetAutoSlideTimer]);

  const goToBatch = useCallback((batchIndex: number) => {
    const maxBatch = Math.floor((categorizedProjects.featured.length - 1) / 6);
    const clampedBatch = Math.max(0, Math.min(maxBatch, batchIndex));
    setCurrentSlide(clampedBatch * 6);
  }, [categorizedProjects.featured.length]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedLanguage('all');
    setSelectedGenre('all');
    setFundingRange([0, 100]);
    setSortBy('trending');
    setSearchTerm('');
    setShowAllProjects(null);
  }, []);

  const handleSectionClick = useCallback((sectionType: string) => {
    setShowAllProjects(sectionType);
    setSearchTerm('');
    setShowFilters(false);

    // Set appropriate filters based on section
    switch (sectionType) {
      case 'trending':
        setSortBy('trending');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'ending-soon':
        setSortBy('ending-soon');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'bollywood':
        setSelectedCategory('bollywood');
        setSelectedType('film');
        break;
      case 'music':
        setSelectedType('music');
        setSelectedCategory('all');
        break;
      case 'webseries':
        setSelectedType('webseries');
        setSelectedCategory('all');
        break;
      case 'regional':
        setSelectedCategory('regional');
        setSelectedType('all');
        break;
      case 'hollywood':
        setSelectedCategory('hollywood');
        setSelectedType('film');
        break;
      case 'high-rated':
        setSortBy('rating');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'new-releases':
        setSortBy('newest');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      default:
        break;
    }
  }, []);

  // Filter options
  const categories = FILTER_OPTIONS.categories;
  const types = FILTER_OPTIONS.types;
  const languages = FILTER_OPTIONS.languages;
  const genres = FILTER_OPTIONS.genres;
  const sortOptions = FILTER_OPTIONS.sortOptions;



  // Organize projects by categories for Netflix-style layout using diverse arrays
  const trendingProjects = categorizedProjects.trending.length > 0 ? categorizedProjects.trending : projects.slice(0, 12);
  const bollywoodFilms = categorizedProjects.bollywood.length > 0 ? categorizedProjects.bollywood : projects.filter(p => p.category === "Bollywood").slice(0, 15);
  const hollywoodProjects = categorizedProjects.hollywood.length > 0 ? categorizedProjects.hollywood : projects.filter(p => p.category === "Hollywood").slice(0, 15);
  const actionThrillers = categorizedProjects.actionThrillers.length > 0 ? categorizedProjects.actionThrillers : projects.filter(p => p.genre?.toLowerCase().includes("action")).slice(0, 12);
  const dramaRomance = categorizedProjects.dramaRomance.length > 0 ? categorizedProjects.dramaRomance : projects.filter(p => p.genre?.toLowerCase().includes("drama")).slice(0, 12);
  const comedyEntertainment = categorizedProjects.comedyEntertainment.length > 0 ? categorizedProjects.comedyEntertainment : projects.filter(p => p.genre?.toLowerCase().includes("comedy")).slice(0, 12);
  const sciFiFantasy = categorizedProjects.sciFiFantasy.length > 0 ? categorizedProjects.sciFiFantasy : projects.filter(p => p.genre?.toLowerCase().includes("sci-fi")).slice(0, 12);
  const highRatedProjects = categorizedProjects.highRated.length > 0 ? categorizedProjects.highRated : projects.filter(p => p.rating >= 7.0).slice(0, 12);
  const newlyAdded = categorizedProjects.newlyAdded.length > 0 ? categorizedProjects.newlyAdded : projects.slice(0, 12);
  const mostFunded = categorizedProjects.mostFunded.length > 0 ? categorizedProjects.mostFunded : projects.filter(p => p.fundedPercentage >= 20).slice(0, 12);
  const regionalContent = categorizedProjects.regional.length > 0 ? categorizedProjects.regional : projects.filter(p => p.category === "Regional").slice(0, 10);
  const musicProjects = categorizedProjects.music.length > 0 ? categorizedProjects.music : projects.filter(p => p.type === "music").slice(0, 10);
  const webSeries = categorizedProjects.webseries.length > 0 ? categorizedProjects.webseries : projects.filter(p => p.type === "webseries").slice(0, 10);

  // Simple swipe detection for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Handle visibility change (tab minimize/restore)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-slide functionality
  React.useEffect(() => {
    // Clear any existing interval
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }

    // Only start auto-slide if we have multiple projects and auto-play is enabled
    if (isAutoPlaying && !isPaused && ultimateFallback.length > 1) {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = (prev + 1) % ultimateFallback.length;
          return nextSlide;
        });
      }, 5000);
    }

    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
        autoSlideRef.current = null;
      }
    };
  }, [isAutoPlaying, isPaused, ultimateFallback.length]);

  const [imageLoaded, setImageLoaded] = useState(false);

  // Defensive: ensure we never access out-of-bounds index
  const safeCurrentSlide = Math.min(currentSlide, Math.max(0, ultimateFallback.length - 1));
  console.log('Slide debug:', { currentSlide, safeCurrentSlide, totalLength: ultimateFallback.length, project: ultimateFallback[safeCurrentSlide]?.title });
  
  // Reset image loaded state when slide changes
  React.useEffect(() => {
    setImageLoaded(false);
  }, [currentSlide]);
  
  // Reset current slide if it's out of bounds
  React.useEffect(() => {
    if (ultimateFallback.length > 0 && currentSlide >= ultimateFallback.length) {
      setCurrentSlide(0);
    }
  }, [ultimateFallback.length, currentSlide]);

  return (
    <div className="min-h-screen bg-black pb-[100px]">
      {/* Mobile Hero Carousel */}
      {!searchTerm && !showAllProjects && (
        ultimateFallback.length > 0 && ultimateFallback[safeCurrentSlide] ? (
          <div
            className="md:hidden relative h-72 overflow-hidden"
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const diff = e.changedTouches[0].clientX - touchStartX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  prevSlide();
                } else {
                  nextSlide();
                }
              }
            }}
            onClick={() => handleProjectClick(ultimateFallback[safeCurrentSlide])}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`m-${currentSlide}`}
                src={ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080')}
                srcSet={ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 1x, ' + ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 2x, ' + ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 3x'}
                sizes="(min-width: 1024px) 900px, 100vw"
                alt={ultimateFallback[safeCurrentSlide]?.title}
                initial={{ x: 150, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -150, opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            </AnimatePresence>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            )}
            <div className="absolute bottom-12 left-0 w-full p-3 text-center flex flex-col items-center bg-gradient-to-t from-black/70 via-black/40 to-transparent">
              <h3 className="text-white text-base font-semibold">
                {ultimateFallback[safeCurrentSlide]?.title}
              </h3>
              <span className="text-xs text-gray-300">
                {ultimateFallback[safeCurrentSlide]?.genre}
              </span>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {ultimateFallback.map((_, index) => (
                <button
                  key={`md-${index}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSlideChange(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-white text-center py-10">No featured projects available.</div>
        )
      )}
      {/* Full-Screen Auto-Sliding Hero Carousel */}
      {!searchTerm && !showAllProjects && (
        ultimateFallback.length > 0 && ultimateFallback[safeCurrentSlide] ? (
          <div 
            className="hidden md:block relative h-screen overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <img 
                  src={ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080')}
                  srcSet={ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 1x, ' + ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 2x, ' + ultimateFallback[safeCurrentSlide]?.poster?.replace('SX300', 'SX1080') + ' 3x'}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  alt={ultimateFallback[safeCurrentSlide]?.title}
                  className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  style={{ objectPosition: 'center' }}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="hidden sm:flex absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={nextSlide}
              className="hidden sm:flex absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/60 hover:bg-black/80 rounded-full items-center justify-center text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center z-10 pt-16">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl">
                  <motion.div
                    key={`content-${currentSlide}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md ${
                        ultimateFallback[safeCurrentSlide]?.type === 'film' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' :
                        ultimateFallback[safeCurrentSlide]?.type === 'music' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' :
                        'bg-green-500/20 border border-green-500/30 text-green-300'
                      }`}>
                        {ultimateFallback[safeCurrentSlide]?.type === 'film' ? <Film className="w-4 h-4" /> :
                         ultimateFallback[safeCurrentSlide]?.type === 'music' ? <Music className="w-4 h-4" /> :
                         <Tv className="w-4 h-4" />}
                        <span className="text-sm font-medium uppercase">{ultimateFallback[safeCurrentSlide]?.type}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                        <Fire className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-medium">Trending #{safeCurrentSlide + 1}</span>
                      </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
                      {ultimateFallback[safeCurrentSlide]?.title}
                    </h1>
                    
                    <p className="text-base sm:text-xl text-gray-300 mb-6 leading-relaxed">
                      {ultimateFallback[safeCurrentSlide]?.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">
                          {ultimateFallback[safeCurrentSlide]?.rating && !isNaN(ultimateFallback[safeCurrentSlide]?.rating) 
                            ? ultimateFallback[safeCurrentSlide]?.rating 
                            : '4.8'}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{ultimateFallback[safeCurrentSlide]?.language}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{ultimateFallback[safeCurrentSlide]?.genre}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-400 font-semibold">{ultimateFallback[safeCurrentSlide]?.fundedPercentage}% Funded</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <button
                        onClick={() => handleInvestClick(ultimateFallback[safeCurrentSlide])}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                      >
                        <Play className="w-6 h-6 fill-current" />
                        Invest Now
                      </button>
                      
                      <button 
                        onClick={() => handleProjectClick(ultimateFallback[safeCurrentSlide])}
                        className="flex items-center gap-3 px-8 py-4 bg-gray-600/80 text-white rounded-lg font-semibold text-lg hover:bg-gray-600 transition-all duration-300"
                      >
                        <Info className="w-6 h-6" />
                        More Info
                      </button>

                      <button className="p-4 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300">
                        <Heart className="w-6 h-6" />
                      </button>

                      <button className="p-4 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all duration-300">
                        <Share2 className="w-6 h-6" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex flex-col items-center gap-3">
                {/* Top Row - Play/Pause, Dots, Counter */}
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
                >
                  {isAutoPlaying && !isPaused ? (
                    <div className="w-4 h-4 flex gap-1">
                      <div className="w-1 h-4 bg-white"></div>
                      <div className="w-1 h-4 bg-white"></div>
                    </div>
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                  {/* Dots - Centered */}
                  <div className="flex justify-center">
                                      <div className="flex gap-1.5">
                    {(() => {
                      const totalProjects = ultimateFallback.length;
                      const dotsPerBatch = 6;
                      const currentBatch = Math.floor(currentSlide / dotsPerBatch);
                      const startIndex = currentBatch * dotsPerBatch;
                      const endIndex = Math.min(startIndex + dotsPerBatch, totalProjects);
                      
                      return Array.from({ length: Math.min(dotsPerBatch, totalProjects) }, (_, i) => {
                        const projectIndex = startIndex + i;
                        const isActive = projectIndex === currentSlide;
                        
                        return (
                    <button
                            key={projectIndex}
                            onClick={() => handleSlideChange(projectIndex)}
                            className={`relative w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                              isActive ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    >
                            {isActive && isAutoPlaying && !isPaused && (
                              <div className="absolute inset-0 rounded-full border border-white/60 animate-pulse"></div>
                      )}
                    </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Counter */}
                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  {safeCurrentSlide + 1}/{ultimateFallback.length}
                </span>
                </div>

                {/* Bottom Row - ABCD Slider */}
                {ultimateFallback.length > 6 && (
                  <div className="flex justify-center items-center gap-2">
                    <span className="text-white/60 text-xs">
                      {String.fromCharCode(65 + Math.floor(currentSlide / 6))}
                    </span>
                    <div 
                      className="w-16 h-1 bg-white/20 rounded-full cursor-pointer relative"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const percentage = clickX / rect.width;
                        const totalBatches = Math.ceil(ultimateFallback.length / 6);
                        const targetBatch = Math.floor(percentage * totalBatches);
                        const newSlide = Math.min(targetBatch * 6, ultimateFallback.length - 1);
                        setCurrentSlide(newSlide);
                      }}
                    >
                      <div 
                        className="h-full bg-white/60 rounded-full transition-all duration-300 relative"
                        style={{ 
                          width: `${(Math.floor(currentSlide / 6) / Math.ceil(ultimateFallback.length / 6 - 1)) * 100}%`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center h-screen text-white text-2xl">No featured projects available.</div>
        )
      )}

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 block">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              ref={searchInputRef}
              type="text"
                                  placeholder="Search for films, music, web series, directors, artists, production houses, actors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAllProjects(null);
              }}
              className="w-full pl-14 pr-12 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-gray-800 transition-all duration-300 text-lg"
            />
            {searchTerm && (
            <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => {
                  setSearchTerm('');
                  setShowAllProjects(null);
                  searchInputRef.current?.blur();
                }}
                aria-label="Clear search"
            >
                <X className="w-5 h-5" />
            </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => {
              setShowFilters(!showFilters);
              setShowAllProjects(null);
            }}
            className={`flex items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 ${showFilters ? 'hidden' : ''}`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {(selectedCategory !== 'all' || selectedType !== 'all' || selectedLanguage !== 'all' || selectedGenre !== 'all') && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold">Advanced Filters</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={clearFilters}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {languages.map((language) => (
                      <option key={language.id} value={language.id}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-white font-medium mb-2">Genre</label>
                  <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Funding Range */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Funding Progress: {fundingRange[0]}% - {fundingRange[1]}%
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fundingRange[0]}
                      onChange={(e) => setFundingRange([Number(e.target.value), fundingRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fundingRange[1]}
                      onChange={(e) => setFundingRange([fundingRange[0], Number(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-white font-medium mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results or Netflix-style Sections */}
        {searchTerm || showFilters || showAllProjects ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {showAllProjects ? `${showAllProjects.charAt(0).toUpperCase() + showAllProjects.slice(1).replace('-', ' ')} Projects` :
                 searchTerm ? `Search Results for "${searchTerm}"` : 'Filtered Results'}
                <span className="text-gray-400 text-lg ml-2">({filteredProjects.length})</span>
              </h2>
              {showAllProjects && (
                <button
                  onClick={() => setShowAllProjects(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Browse
                </button>
              )}
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProjects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => handleProjectClick(project)}
            onInvestClick={handleInvestClick}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-white text-2xl font-bold mb-4">No results found</h3>
        <p className="text-gray-400 mb-6">Try adjusting your search terms or filters</p>
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    )}
  </div>
) : (
          <div className="space-y-12">
            {trendingProjects.length > 0 && (
            <ProjectRow
              title="🔥 Trending Now"
              projects={trendingProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
              onHeaderClick={() => handleSectionClick('trending')}
            />
            )}
            {bollywoodFilms.length > 0 && (
              <ProjectRow
                title="🎬 Bollywood Blockbusters"
                projects={bollywoodFilms}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('bollywood')}
              />
            )}
            {hollywoodProjects.length > 0 && (
            <ProjectRow
                title="🌟 Hollywood International"
                projects={hollywoodProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('hollywood')}
            />
            )}
            {actionThrillers.length > 0 && (
            <ProjectRow
                title="💥 Action & Thrillers"
                projects={actionThrillers}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('action-thrillers')}
            />
            )}
            {dramaRomance.length > 0 && (
            <ProjectRow
                title="💕 Drama & Romance"
                projects={dramaRomance}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('drama-romance')}
            />
            )}
            {comedyEntertainment.length > 0 && (
            <ProjectRow
                title="😂 Comedy & Entertainment"
                projects={comedyEntertainment}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('comedy-entertainment')}
              />
            )}
            {sciFiFantasy.length > 0 && (
              <ProjectRow
                title="🚀 Sci-Fi & Fantasy"
                projects={sciFiFantasy}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('sci-fi-fantasy')}
            />
            )}
            {highRatedProjects.length > 0 && (
            <ProjectRow
              title="🏆 Highly Rated Projects"
              projects={highRatedProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
              onHeaderClick={() => handleSectionClick('high-rated')}
            />
            )}
            {newlyAdded.length > 0 && (
            <ProjectRow
                title="🆕 Newly Added"
                projects={newlyAdded}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('newly-added')}
            />
            )}
            {mostFunded.length > 0 && (
              <ProjectRow
                title="💰 Most Funded"
                projects={mostFunded}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('most-funded')}
              />
            )}
            {musicProjects.length > 0 && (
              <ProjectRow
                title="🎵 Music & Albums"
                projects={musicProjects}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('music')}
              />
            )}
            {webSeries.length > 0 && (
              <ProjectRow
                title="📺 Binge-Worthy Web Series"
                projects={webSeries}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('webseries')}
              />
            )}
            {regionalContent.length > 0 && (
              <ProjectRow
                title="🌍 Regional Cinema Gems"
                projects={regionalContent}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('regional')}
              />
            )}
            {/* All Projects Section */}
            {allProjects.length > 0 && (
              <ProjectRow
                title="🎬 All Projects"
                projects={allProjects}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => setShowAllProjects('all')}
              />
            )}
          </div>
        )}
      </div>


    </div>
  );
};

// Project Row Component (Netflix-style) with Clickable Headers
interface ProjectRowProps {
  title: string;
  projects: Project[];
  onProjectClick: (project: Project, tab?: 'overview' | 'invest') => void;
  onInvestClick: (project: Project) => void;
  onHeaderClick?: () => void;
  featured?: boolean;
  urgent?: boolean;
}

const ProjectRow = React.memo<ProjectRowProps>(({ title, projects, onProjectClick, onInvestClick, onHeaderClick, featured, urgent }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = featured ? 400 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (projects.length === 0) return null;

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onHeaderClick}
          className={`font-bold text-white hover:text-gray-300 transition-colors duration-300 flex items-center gap-3 group/header ${
            featured ? 'text-3xl' : 'text-2xl'
          } ${urgent ? 'text-red-400 hover:text-red-300' : ''}`}
        >
          {title}
          <ArrowRight className="w-6 h-6 opacity-0 group-hover/header:opacity-100 transition-opacity duration-300" />
        </button>
        {urgent && (
          <div className="flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-medium">Limited Time</span>
          </div>
        )}
      </div>
      
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Projects Scroll Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project) => (
          <div key={project.id} className="inline-block w-72 snap-center">
            <ProjectCard
              project={project} 
              onClick={() => onProjectClick(project)}
              onInvestClick={onInvestClick}
              urgent={urgent}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default ProjectCatalog;