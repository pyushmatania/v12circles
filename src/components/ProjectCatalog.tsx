import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Film, Music, Tv, Search, Star, Clock, ChevronLeft, ChevronRight, Play, Info, Siren as Fire, Filter, Heart, Share2, X, ArrowRight, Grid, RotateCcw, Globe, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  projects, 
  allProjects
} from '../data/projects';

import { Project } from '../types';
import ProjectCard from './ProjectCard';
import ElasticSlider from './ElasticSlider';

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
    { id: 'independent', label: 'Independent' },
    { id: 'hindi music', label: 'Hindi Music' },
    { id: 'hollywood music', label: 'Hollywood Music' }
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
    { id: 'documentary', label: 'Documentary' },
    { id: 'pop', label: 'Pop' },
    { id: 'r&b', label: 'R&B' },
    { id: 'film soundtrack', label: 'Film Soundtrack' },
    { id: 'hip hop', label: 'Hip Hop' },
    { id: 'reggaeton', label: 'Reggaeton' },
    { id: 'indie folk', label: 'Indie Folk' },
    { id: 'country pop', label: 'Country Pop' }
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

const ProjectCatalog: React.FC<ProjectCatalogProps> = ({ onProjectSelect }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Auto-sliding hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideRef = useRef<number | null>(null);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [fundingRange, setFundingRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<string>('trending');
  const [showAllProjects, setShowAllProjects] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState<'all' | 'movies' | 'webseries' | 'music'>('all');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get featured projects for carousel (movies and web series only)
  const featuredProjects = projects.filter(p => 
    p.featured === true && 
    p.disabled === false && 
    p.poster && 
    p.title && 
    p.rating && 
    !isNaN(p.rating) &&
    (p.type === 'film' || p.type === 'webseries')
  ).slice(0, 30);
  
  // Fallback to high-rated projects if no featured projects available (movies and web series only)
  const fallbackProjects = projects.filter(p => 
    p.disabled === false && 
    p.poster && 
    p.title && 
    p.rating && 
    !isNaN(p.rating) && 
    p.rating >= 6.0 &&
    (p.type === 'film' || p.type === 'webseries')
  ).slice(0, 30);
  const finalFeaturedProjects = featuredProjects.length > 0 ? featuredProjects : fallbackProjects;
  
  // Ultimate fallback - if still no projects, take any valid projects (movies and web series only)
  const ultimateFallback = finalFeaturedProjects.length === 0 ? 
    projects.filter(p => 
      p.disabled === false && 
      p.poster && 
      p.title &&
      (p.type === 'film' || p.type === 'webseries')
    ).slice(0, 30) : finalFeaturedProjects;
  


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
      // Filter out disabled projects only
      if (project.disabled === true) {
        return false;
      }

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
    webseries: Project[];
    featured: Project[];
    hindiMusic: Project[];
    hollywoodMusic: Project[];
    musicAlbums: Project[];
  } => {
    try {
      // Helper function to shuffle array
      const shuffleArray = (array: Project[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };

      const regionalContent = shuffleArray(
        projects.filter(p => p.category === 'Regional' && p.disabled === false)
      ).slice(0, 10);

      const webSeries = shuffleArray(
        projects.filter(p => p.type === 'webseries' && p.disabled === false)
      ).slice(0, 10);

      const featuredProjects = shuffleArray(
        projects.filter(p => p.featured === true && p.disabled === false && p.poster && p.title && p.rating && !isNaN(p.rating))
      ).slice(0, 30);

      // Create dynamic shuffled arrays for each section
      const trending = shuffleArray(
        projects.filter(project => project.rating >= 7.0 && project.fundedPercentage >= 20 && project.disabled === false)
      ).slice(0, 12);

      const bollywood = shuffleArray(
        projects.filter(project => project.category === "Bollywood" && project.disabled === false)
      ).slice(0, 15);

      const hollywood = shuffleArray(
        projects.filter(project => project.category === "Hollywood" && project.disabled === false)
      ).slice(0, 15);

      const actionThrillers = shuffleArray(
        projects.filter(project => 
          project.disabled === false &&
          (project.genre?.toLowerCase().includes("action") || 
           project.genre?.toLowerCase().includes("thriller") ||
           project.tags?.some(tag => tag.toLowerCase().includes("action")) ||
           project.tags?.some(tag => tag.toLowerCase().includes("thriller")))
        )
      ).slice(0, 12);

      const dramaRomance = shuffleArray(
        projects.filter(project => 
          project.disabled === false &&
          (project.genre?.toLowerCase().includes("drama") || 
           project.genre?.toLowerCase().includes("romance") ||
           project.tags?.some(tag => tag.toLowerCase().includes("drama")) ||
           project.tags?.some(tag => tag.toLowerCase().includes("romance")))
        )
      ).slice(0, 12);

      const comedyEntertainment = shuffleArray(
        projects.filter(project => 
          project.disabled === false &&
          (project.genre?.toLowerCase().includes("comedy") || 
           project.genre?.toLowerCase().includes("adventure") ||
           project.tags?.some(tag => tag.toLowerCase().includes("comedy")) ||
           project.tags?.some(tag => tag.toLowerCase().includes("adventure")))
        )
      ).slice(0, 12);

      const sciFiFantasy = shuffleArray(
        projects.filter(project => 
          project.disabled === false &&
          (project.genre?.toLowerCase().includes("sci-fi") || 
           project.genre?.toLowerCase().includes("fantasy") ||
           project.genre?.toLowerCase().includes("animation") ||
           project.tags?.some(tag => tag.toLowerCase().includes("sci-fi")) ||
           project.tags?.some(tag => tag.toLowerCase().includes("fantasy")))
        )
      ).slice(0, 12);

      const highRated = shuffleArray(
        projects.filter(project => project.rating >= 7.5 && project.disabled === false)
      ).slice(0, 12);

      const newlyAdded = shuffleArray(
        projects.filter(project => project.disabled === false)
      ).slice(0, 12);

      const mostFunded = shuffleArray(
        projects.filter(project => project.fundedPercentage >= 30 && project.disabled === false)
      ).slice(0, 12);

      const hindiMusic = shuffleArray(
        projects.filter(project => project.category === "Hindi Music" && project.disabled === false)
      ).slice(0, 15);

      const hollywoodMusic = shuffleArray(
        projects.filter(project => project.category === "Hollywood Music" && project.disabled === false)
      ).slice(0, 15);

      const musicAlbums = shuffleArray(
        projects.filter(project => project.type === "music" && project.disabled === false)
      ).slice(0, 20);

      return {
        trending,
        bollywood,
        hollywood,
        actionThrillers,
        dramaRomance,
        comedyEntertainment,
        sciFiFantasy,
        highRated,
        newlyAdded,
        mostFunded,
        regional: regionalContent,
        webseries: webSeries,
        featured: featuredProjects,
        hindiMusic,
        hollywoodMusic,
        musicAlbums
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
        webseries: [],
        featured: [],
        hindiMusic: [],
        hollywoodMusic: [],
        musicAlbums: []
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
    resetAutoSlideTimer();
  }, [resetAutoSlideTimer]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const nextIndex = (prev + 1) % ultimateFallback.length;
      return nextIndex;
    });
    resetAutoSlideTimer();
  }, [ultimateFallback.length, resetAutoSlideTimer]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => prev === 0 ? Math.max(0, ultimateFallback.length - 1) : prev - 1);
    resetAutoSlideTimer();
  }, [ultimateFallback.length, resetAutoSlideTimer]);



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
      case 'hollywood':
        setSelectedCategory('hollywood');
        setSelectedType('film');
        break;
      case 'action-thrillers':
        setSelectedGenre('action');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'drama-romance':
        setSelectedGenre('drama');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'comedy-entertainment':
        setSelectedGenre('comedy');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'sci-fi-fantasy':
        setSelectedGenre('sci-fi');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'high-rated':
        setSortBy('rating');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'newly-added':
        setSortBy('newest');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'most-funded':
        setSortBy('funding-high');
        setSelectedCategory('all');
        setSelectedType('all');
        break;
      case 'webseries':
        setSelectedType('webseries');
        setSelectedCategory('all');
        break;
      case 'regional':
        setSelectedCategory('regional');
        setSelectedType('all');
        break;
      case 'hindi-music':
        setSelectedCategory('hindi music');
        setSelectedType('music');
        break;
      case 'hollywood-music':
        setSelectedCategory('hollywood music');
        setSelectedType('music');
        break;
      case 'music':
        setSelectedCategory('all');
        setSelectedType('music');
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
  const trendingProjects = categorizedProjects.trending.length > 0 ? categorizedProjects.trending : projects.filter(p => p.disabled === false).slice(0, 12);
  const bollywoodFilms = categorizedProjects.bollywood.length > 0 ? categorizedProjects.bollywood : projects.filter(p => p.category === "Bollywood" && p.disabled === false).slice(0, 15);
  const hollywoodProjects = categorizedProjects.hollywood.length > 0 ? categorizedProjects.hollywood : projects.filter(p => p.category === "Hollywood" && p.disabled === false).slice(0, 15);
  const actionThrillers = categorizedProjects.actionThrillers.length > 0 ? categorizedProjects.actionThrillers : projects.filter(p => p.genre?.toLowerCase().includes("action") && p.disabled === false).slice(0, 12);
  const dramaRomance = categorizedProjects.dramaRomance.length > 0 ? categorizedProjects.dramaRomance : projects.filter(p => p.genre?.toLowerCase().includes("drama") && p.disabled === false).slice(0, 12);
  const comedyEntertainment = categorizedProjects.comedyEntertainment.length > 0 ? categorizedProjects.comedyEntertainment : projects.filter(p => p.genre?.toLowerCase().includes("comedy") && p.disabled === false).slice(0, 12);
  const sciFiFantasy = categorizedProjects.sciFiFantasy.length > 0 ? categorizedProjects.sciFiFantasy : projects.filter(p => p.genre?.toLowerCase().includes("sci-fi") && p.disabled === false).slice(0, 12);
  const highRatedProjects = categorizedProjects.highRated.length > 0 ? categorizedProjects.highRated : projects.filter(p => p.rating >= 7.0 && p.disabled === false).slice(0, 12);
  const newlyAdded = categorizedProjects.newlyAdded.length > 0 ? categorizedProjects.newlyAdded : projects.filter(p => p.disabled === false).slice(0, 12);
  const mostFunded = categorizedProjects.mostFunded.length > 0 ? categorizedProjects.mostFunded : projects.filter(p => p.fundedPercentage >= 20 && p.disabled === false).slice(0, 12);
  const regionalContent = categorizedProjects.regional.length > 0 ? categorizedProjects.regional : projects.filter(p => p.category === "Regional" && p.disabled === false).slice(0, 10);

  const webSeries = categorizedProjects.webseries.length > 0 ? categorizedProjects.webseries : projects.filter(p => p.type === "webseries" && p.disabled === false).slice(0, 10);
  
  // Music sections
  const hindiMusic = categorizedProjects.hindiMusic.length > 0 ? categorizedProjects.hindiMusic : projects.filter(p => p.category === "Hindi Music" && p.disabled === false).slice(0, 15);
  const hollywoodMusic = categorizedProjects.hollywoodMusic.length > 0 ? categorizedProjects.hollywoodMusic : projects.filter(p => p.category === "Hollywood Music" && p.disabled === false).slice(0, 15);
  const musicAlbums = categorizedProjects.musicAlbums.length > 0 ? categorizedProjects.musicAlbums : projects.filter(p => p.type === "music" && p.disabled === false).slice(0, 20);

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

  // Replace safeCurrentSlide with wrapped index
  const wrappedSlide = ultimateFallback.length > 0 ? currentSlide % ultimateFallback.length : 0;
  
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
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          transition: all 0.3s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #8b5cf6, #3b82f6);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          transition: all 0.3s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
        }
      `}</style>
      {/* Mobile Hero Carousel */}
      {!searchTerm && !showAllProjects && (
        ultimateFallback.length > 0 && ultimateFallback[wrappedSlide] ? (
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
            onClick={() => handleProjectClick(ultimateFallback[wrappedSlide])}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`m-${currentSlide}`}
                src={ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080')}
                srcSet={ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 1x, ' + ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 2x, ' + ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 3x'}
                sizes="(min-width: 1024px) 900px, 100vw"
                alt={ultimateFallback[wrappedSlide]?.title}
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
                {ultimateFallback[wrappedSlide]?.title}
              </h3>
              <span className="text-xs text-gray-300">
                {ultimateFallback[wrappedSlide]?.genre}
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
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/40'}`}
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
        ultimateFallback.length > 0 && ultimateFallback[wrappedSlide] ? (
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
                  src={ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080')}
                  srcSet={ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 1x, ' + ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 2x, ' + ultimateFallback[wrappedSlide]?.poster?.replace('SX300', 'SX1080') + ' 3x'}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  alt={ultimateFallback[wrappedSlide]?.title}
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
                        ultimateFallback[wrappedSlide]?.type === 'film' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-300' :
                        ultimateFallback[wrappedSlide]?.type === 'music' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300' :
                        'bg-green-500/20 border border-green-500/30 text-green-300'
                      }`}>
                        {ultimateFallback[wrappedSlide]?.type === 'film' ? <Film className="w-4 h-4" /> :
                         ultimateFallback[wrappedSlide]?.type === 'music' ? <Music className="w-4 h-4" /> :
                         <Tv className="w-4 h-4" />}
                        <span className="text-sm font-medium uppercase">{ultimateFallback[wrappedSlide]?.type}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/30">
                        <Fire className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-medium">Trending #{wrappedSlide + 1}</span>
                      </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-4">
                      {ultimateFallback[wrappedSlide]?.title}
                    </h1>
                    
                    <p className="text-base sm:text-xl text-gray-300 mb-6 leading-relaxed">
                      {ultimateFallback[wrappedSlide]?.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">
                          {ultimateFallback[wrappedSlide]?.rating && !isNaN(ultimateFallback[wrappedSlide]?.rating) 
                            ? ultimateFallback[wrappedSlide]?.rating 
                            : '4.8'}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{ultimateFallback[wrappedSlide]?.language}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{ultimateFallback[wrappedSlide]?.genre}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-green-400 font-semibold">{ultimateFallback[wrappedSlide]?.fundedPercentage}% Funded</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <button
                        onClick={() => handleInvestClick(ultimateFallback[wrappedSlide])}
                        className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-500 hover:scale-110 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-400/20 overflow-hidden"
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* White highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Play className="relative w-6 h-6 fill-current" />
                        <span className="relative">Invest Now</span>
                      </button>
                      
                      <button 
                        onClick={() => handleProjectClick(ultimateFallback[wrappedSlide])}
                        className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all duration-500 hover:scale-110 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-400/20 overflow-hidden"
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-rose-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* White highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Info className="relative w-6 h-6" />
                        <span className="relative">More Info</span>
                      </button>

                      <button className="group relative p-5 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-2xl hover:from-red-600 hover:via-pink-600 hover:to-rose-600 transition-all duration-500 hover:scale-110 shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 border border-red-400/20 overflow-hidden">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-pink-400/20 to-rose-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* White highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Heart className="relative w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      </button>

                      <button className="group relative p-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white rounded-2xl hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 transition-all duration-500 hover:scale-110 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/20 overflow-hidden">
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-teal-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {/* White highlight */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Share2 className="relative w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
              <div className="flex flex-col items-center gap-3">
                {/* Dots and Slider - Vertically Centered */}
                <div className="flex flex-col items-center gap-2 mt-10">
                  {/* Dots Row: Pause | Dots | Counter */}
                  <div className="flex items-center justify-center w-full max-w-xs mx-auto gap-4">
                    {/* Pause Button */}
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="p-1 w-6 h-6 flex items-center justify-center text-white"
                      style={{ background: 'none', boxShadow: 'none' }}
                    >
                      {isAutoPlaying && !isPaused ? (
                        <div className="w-3 h-3 flex gap-0.5">
                          <div className="w-0.5 h-3 bg-white rounded-sm"></div>
                          <div className="w-0.5 h-3 bg-white rounded-sm"></div>
                        </div>
                      ) : (
                        <Play className="w-3 h-3 fill-current" />
                      )}
                    </button>
                    {/* Dots */}
                    <div className="flex gap-1.5">
                      {(() => {
                        const totalProjects = ultimateFallback.length;
                        const dotsPerBatch = 6;
                        const currentBatch = Math.floor(currentSlide / dotsPerBatch);
                        const startIndex = currentBatch * dotsPerBatch;
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
                    {/* Stats Counter */}
                    <span className="text-blue-300 text-xs select-none min-w-[40px] text-right">
                      {wrappedSlide + 1}/{ultimateFallback.length}
                    </span>
                  </div>
                  {/* Slider - centered, no A/E letters */}
                  <ElasticSlider
                    startingValue={0}
                    defaultValue={Math.floor(currentSlide / 6)}
                    maxValue={Math.ceil(ultimateFallback.length / 6) - 1}
                    isStepped
                    stepSize={1}
                    className="w-16"
                    onValueChange={(value) => {
                      const targetSlide = Math.floor(value) * 6;
                      handleSlideChange(Math.min(targetSlide, ultimateFallback.length - 1));
                    }}
                  />
                  {/* Current Section Letter */}
                  <span className="text-indigo-300 text-[10px] font-mono -mt-1">
                    {String.fromCharCode(65 + Math.floor(currentSlide / 6))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center justify-center h-screen text-white text-2xl">No featured projects available.</div>
        )
      )}

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
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
              className="w-full pl-14 pr-12 py-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-gradient-to-r focus:from-gray-800 focus:via-gray-700 focus:to-gray-800 transition-all duration-500 text-lg shadow-2xl shadow-purple-500/10 focus:shadow-purple-500/30"
            />
            {/* Search Button */}
            <button
              type="button"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors duration-200 focus:outline-none"
              onClick={() => {
                // Trigger search by updating the search term (which will trigger the search effect)
                setSearchTerm(searchTerm);
                setShowAllProjects(null);
              }}
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
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
            className={`group relative flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 transition-all duration-500 hover:scale-105 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 border border-orange-400/20 overflow-hidden ${showFilters ? 'hidden' : ''}`}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-yellow-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* White highlight */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Filter className="relative w-5 h-5" />
            <span className="relative">Filters</span>
            {(selectedCategory !== 'all' || selectedType !== 'all' || selectedLanguage !== 'all' || selectedGenre !== 'all') && (
              <span className="relative w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Completely Redesigned Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="mb-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl shadow-blue-500/10 relative overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Filter className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Advanced Filters</h3>
                      <p className="text-blue-100 text-sm">Refine your search with precision</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter Content */}
              <div className="p-6 space-y-6">
                {/* Main Filters Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id} className="bg-slate-800 text-white">
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Film className="w-4 h-4 text-purple-400" />
                      Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    >
                      {types.map((type) => (
                        <option key={type.id} value={type.id} className="bg-slate-800 text-white">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-400" />
                      Language
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                    >
                      {languages.map((language) => (
                        <option key={language.id} value={language.id} className="bg-slate-800 text-white">
                          {language.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Genre Filter */}
                  <div>
                    <label className="block text-slate-300 font-medium mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      Genre
                    </label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    >
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id} className="bg-slate-800 text-white">
                          {genre.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Range and Sort Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Funding Range */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <label className="block text-slate-300 font-medium mb-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      Funding Progress Range
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Min: {fundingRange[0]}%</span>
                        <span>Max: {fundingRange[1]}%</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={fundingRange[0]}
                            onChange={(e) => setFundingRange([Number(e.target.value), fundingRange[1]])}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #10b981 0%, #10b981 ${fundingRange[0]}%, #475569 ${fundingRange[0]}%, #475569 100%)`
                            }}
                          />
                        </div>
                        <div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={fundingRange[1]}
                            onChange={(e) => setFundingRange([fundingRange[0], Number(e.target.value)])}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${fundingRange[1]}%, #475569 ${fundingRange[1]}%, #475569 100%)`
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-slate-400 text-sm">
                          Range: {fundingRange[0]}% - {fundingRange[1]}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sort Section */}
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <label className="block text-slate-300 font-medium mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      Sort & Display
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Sort By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full px-3 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                        >
                          {sortOptions.map((option) => (
                            <option key={option.id} value={option.id} className="bg-slate-800 text-white">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Quick Presets */}
                      <div>
                        <label className="block text-slate-400 text-sm mb-2">Quick Presets</label>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setFundingRange([50, 100]);
                              setSortBy('funding-high');
                              setSelectedGenre('all');
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition-all duration-300"
                          >
                            High Funding
                          </button>
                          <button
                            onClick={() => {
                              setFundingRange([0, 50]);
                              setSortBy('ending-soon');
                              setSelectedGenre('all');
                            }}
                            className="px-3 py-1 bg-orange-600 text-white rounded-lg text-xs hover:bg-orange-700 transition-all duration-300"
                          >
                            Ending Soon
                          </button>
                          <button
                            onClick={() => {
                              setFundingRange([0, 100]);
                              setSortBy('rating');
                              setSelectedGenre('all');
                            }}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-xs hover:bg-yellow-700 transition-all duration-300"
                          >
                            Top Rated
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters Summary */}
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-300 font-medium">Active Filters</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory !== 'all' && (
                      <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                        Category: {categories.find(c => c.id === selectedCategory)?.label}
                      </span>
                    )}
                    {selectedType !== 'all' && (
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">
                        Type: {types.find(t => t.id === selectedType)?.label}
                      </span>
                    )}
                    {selectedLanguage !== 'all' && (
                      <span className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">
                        Language: {languages.find(l => l.id === selectedLanguage)?.label}
                      </span>
                    )}
                    {selectedGenre !== 'all' && (
                      <span className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm">
                        Genre: {genres.find(g => g.id === selectedGenre)?.label}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">
                      Funding: {fundingRange[0]}% - {fundingRange[1]}%
                    </span>
                    <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">
                      Sort: {sortOptions.find(s => s.id === sortBy)?.label}
                    </span>
                  </div>
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
              <div>
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
                
                {/* View All Projects Button - appears at bottom of filtered results */}
                {showAllProjects && showAllProjects !== 'all' && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setShowAllProjects('all')}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <ArrowRight className="w-6 h-6" />
                      View All Projects
                      <span className="text-sm opacity-80">({projects.filter(p => p.disabled === false).length} total)</span>
                    </button>
                    <p className="text-gray-400 mt-3 text-sm">
                      Explore the complete collection of all available projects
                    </p>
                  </div>
                )}
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
                         <div className="flex gap-3 mb-6">
               <button
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium shadow-sm
                   ${sectionFilter === 'all' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'}
                 `}
                 onClick={() => setSectionFilter('all')}
                 aria-label="Show All Projects"
               >
                 <Grid className="w-4 h-4" /> All
               </button>
               <button
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium shadow-sm
                   ${sectionFilter === 'movies' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'}
                 `}
                 onClick={() => setSectionFilter('movies')}
                 aria-label="Show Movies Only"
               >
                 <Film className="w-4 h-4" /> Movies
               </button>
               <button
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium shadow-sm
                   ${sectionFilter === 'webseries' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'}
                 `}
                 onClick={() => setSectionFilter('webseries')}
                 aria-label="Show Web Series Only"
               >
                 <Tv className="w-4 h-4" /> Web Series
               </button>
               <button
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium shadow-sm
                   ${sectionFilter === 'music' ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'}
                 `}
                 onClick={() => setSectionFilter('music')}
                 aria-label="Show Music Projects"
               >
                 <Music className="w-4 h-4" /> Music
               </button>
             </div>
            {sectionFilter === 'all' && trendingProjects.length > 0 && (
            <ProjectRow
              title="🔥 Trending Now"
              projects={trendingProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
              onHeaderClick={() => handleSectionClick('trending')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && bollywoodFilms.length > 0 && (
              <ProjectRow
                title="🎬 Bollywood Blockbusters"
                projects={bollywoodFilms}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('bollywood')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && hollywoodProjects.length > 0 && (
            <ProjectRow
                title="🌟 Hollywood International"
                projects={hollywoodProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('hollywood')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && actionThrillers.length > 0 && (
            <ProjectRow
                title="💥 Action & Thrillers"
                projects={actionThrillers}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('action-thrillers')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && dramaRomance.length > 0 && (
            <ProjectRow
                title="💕 Drama & Romance"
                projects={dramaRomance}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('drama-romance')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && comedyEntertainment.length > 0 && (
            <ProjectRow
                title="😂 Comedy & Entertainment"
                projects={comedyEntertainment}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('comedy-entertainment')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && sciFiFantasy.length > 0 && (
              <ProjectRow
                title="🚀 Sci-Fi & Fantasy"
                projects={sciFiFantasy}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('sci-fi-fantasy')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && highRatedProjects.length > 0 && (
            <ProjectRow
              title="🏆 Highly Rated Projects"
              projects={highRatedProjects}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
              onHeaderClick={() => handleSectionClick('high-rated')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && newlyAdded.length > 0 && (
            <ProjectRow
                title="🆕 Newly Added"
                projects={newlyAdded}
              onProjectClick={handleProjectClick}
              onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('newly-added')}
            />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && mostFunded.length > 0 && (
              <ProjectRow
                title="💰 Most Funded"
                projects={mostFunded}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('most-funded')}
              />
            )}

            {(sectionFilter === 'all' || sectionFilter === 'webseries') && webSeries.length > 0 && (
              <ProjectRow
                title="📺 Binge-Worthy Web Series"
                projects={webSeries}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('webseries')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'movies') && regionalContent.length > 0 && (
              <ProjectRow
                title="🌍 Regional Cinema Gems"
                projects={regionalContent}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('regional')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'music') && hindiMusic.length > 0 && (
              <ProjectRow
                title="🎵 Hindi Music"
                projects={hindiMusic}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('hindi-music')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'music') && hollywoodMusic.length > 0 && (
              <ProjectRow
                title="🎶 Hollywood Music"
                projects={hollywoodMusic}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('hollywood-music')}
              />
            )}
            {(sectionFilter === 'all' || sectionFilter === 'music') && musicAlbums.length > 0 && (
              <ProjectRow
                title="🎼 All Music"
                projects={musicAlbums}
                onProjectClick={handleProjectClick}
                onInvestClick={handleInvestClick}
                onHeaderClick={() => handleSectionClick('music')}
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
  const [showViewAll, setShowViewAll] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = featured ? 400 : 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Check if user has scrolled to the end
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 50; // Increased tolerance for better detection
      setShowViewAll(isAtEnd);
    }
  };

  // Add scroll event listener and check initial state
  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      
      // Check initial state in case content is already at the end
      setTimeout(() => {
        handleScroll();
      }, 100);
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [projects.length]); // Re-run when projects change

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
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory relative"
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
        
        {/* View All Projects Button - appears when scrolled to end */}
        <AnimatePresence>
          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="inline-block w-72 snap-center flex items-center justify-center"
            >
              <button
                onClick={onHeaderClick}
                className="w-full h-full min-h-[400px] bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-2 border-dashed border-purple-400/30 rounded-xl flex flex-col items-center justify-center gap-4 hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-400/50 transition-all duration-300 group/viewall"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center group-hover/viewall:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <h3 className="text-white font-bold text-lg mb-2">View All Projects</h3>
                  <p className="text-gray-300 text-sm">Explore the complete collection</p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default ProjectCatalog;