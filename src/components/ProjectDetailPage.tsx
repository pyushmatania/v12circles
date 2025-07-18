import React, { useState, useEffect, useRef, useCallback, memo, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ThemeContext } from './ThemeProvider';
import { 
  ArrowLeft, 
  Play, 
  Heart, 
  Share2, 
  Star, 
  Clock, 
  Users, 
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  MapPin,
  Globe,
  Eye,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Medal,
  Camera,
  BookOpen,
  HelpCircle,
  FileCheck,
  Loader2,
  VolumeX,
  Volume2,
  MessageSquare,
  Shield,
  FileText,
  AlertTriangle
} from 'lucide-react';

import { Project } from '../types';
import { useTMDBProjectData, getMainCast } from '../hooks/useTMDBProjectData';
import { getTextColor, getBorderColor, getMainBgColor } from '../utils/themeUtils';
import useIsMobile from '../hooks/useIsMobile';

// Import logo image
import { getUserAvatar } from '../utils/imageUtils';

// 🛡️ Type definitions for better type safety
interface ProjectDetailPageProps {
  project: Project;
  onClose: () => void;
  onInvest?: (project: Project) => void;
  initialTab?: 'overview' | 'invest' | 'perks' | 'milestones' | 'team' | 'story' | 'gallery' | 'updates' | 'community' | 'reviews' | 'faqs' | 'legal';
}



/**
 * 🎯 ProjectDetailPage - Optimized project detail component with enhanced performance
 * @description Comprehensive project detail page with investment functionality and rich media content
 */
const ProjectDetailPage: React.FC<ProjectDetailPageProps> = memo(({ project, onClose, onInvest, initialTab = 'overview' }) => {
  const themeContext = useContext(ThemeContext);
  const theme = themeContext.theme;
  const { isMobile } = useIsMobile();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [tabChangeKey, setTabChangeKey] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [selectedUpdateFilter, setSelectedUpdateFilter] = useState('All');
  const [updateSearchQuery, setUpdateSearchQuery] = useState('');
  
  // TMDB data integration
  const { projectData, loading: tmdbLoading, error: tmdbError } = useTMDBProjectData(
    project.title, 
    (project as any).tmdbId ? parseInt((project as any).tmdbId.toString()) : undefined
  );
  
  // Extract cast and crew with safe defaults
  const cast = projectData?.cast || [];
  const crew = projectData?.crew || [];
  const movieDetails = projectData;
  
  // Animation states for invest flow
  const [showCirclesAnimation, setShowCirclesAnimation] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Scroll to appropriate section when component mounts or initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
    setTabChangeKey(prev => prev + 1);
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
        contentAreaRef.current.scrollTo(0, 0);
      }
    });
  }, [initialTab]);

  // Scroll to top when activeTab changes
  useEffect(() => {
    // Multiple attempts to ensure scroll reset works
    const scrollToTop = () => {
      if (contentAreaRef.current) {
        contentAreaRef.current.scrollTop = 0;
        contentAreaRef.current.scrollTo(0, 0);
      }
    };
    
    // Immediate attempt
    scrollToTop();
    
    // Try after a short delay
    setTimeout(scrollToTop, 0);
    
    // Try after animation frame
    requestAnimationFrame(scrollToTop);
    
    // Try after a longer delay to ensure content is rendered
    setTimeout(scrollToTop, 100);
    
    // Final attempt after animation completes
    setTimeout(scrollToTop, 500);
  }, [activeTab]);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Default to muted for mobile compatibility
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [userInteracted, setUserInteracted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15
  });
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroScale, setHeroScale] = useState(1);

  const [posterVisible, setPosterVisible] = useState(true);
  const [searchVideoId, setSearchVideoId] = useState<string | null>(null);
  const [isSearchVideoLoading, setIsSearchVideoLoading] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const contentAreaRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  
  // Callback ref to ensure scroll reset when content area is mounted
  const setContentAreaRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Immediately scroll to top when content area is mounted
      node.scrollTop = 0;
      node.scrollTo(0, 0);
      
      // Also try after a short delay
      setTimeout(() => {
        if (node) {
          node.scrollTop = 0;
          node.scrollTo(0, 0);
        }
      }, 0);
    }
  }, []);

  // Calculate funding statistics
  const fundingStats = {
    totalInvestors: Math.floor(project.fundedPercentage * 100),
    averageInvestment: Math.floor(project.raisedAmount / Math.max(project.fundedPercentage * 100, 1)),
    remainingAmount: project.targetAmount - project.raisedAmount,
    daysSinceCreated: Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
    fundingVelocity: Math.floor(
      project.raisedAmount /
      Math.max(
        Math.floor((Date.now() - new Date(project.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
        1
      )
    )
  };

  // Funding milestones
  const fundingMilestones = [
    { percentage: 25, label: 'Pre-production', achieved: project.fundedPercentage >= 25, icon: '🎬' },
    { percentage: 50, label: 'Production', achieved: project.fundedPercentage >= 50, icon: '🎥' },
    { percentage: 75, label: 'Post-production', achieved: project.fundedPercentage >= 75, icon: '✂️' },
    { percentage: 100, label: 'Release', achieved: project.fundedPercentage >= 100, icon: '🎭' }
  ];

  // Enhanced navigation tabs
  const navigationTabs = [
    { id: 'overview', label: 'Overview', icon: Eye, color: 'from-blue-500 to-cyan-500' },
    { id: 'invest', label: 'Invest', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'perks', label: 'Perks & Experience', icon: Medal, color: 'from-yellow-500 to-orange-500' },
    { id: 'milestones', label: 'Milestones', icon: Target, color: 'from-indigo-500 to-blue-500' },
    { id: 'team', label: 'Team & Cast', icon: Users, color: 'from-red-500 to-pink-500' },
    { id: 'story', label: 'Story & Plot', icon: BookOpen, color: 'from-teal-500 to-cyan-500' },
    { id: 'gallery', label: 'Gallery', icon: Camera, color: 'from-violet-500 to-purple-500' },
    { id: 'updates', label: 'Updates & News', icon: MessageCircle, color: 'from-amber-500 to-yellow-500' },
    { id: 'community', label: 'Community', icon: Users, color: 'from-lime-500 to-green-500' },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'from-rose-500 to-red-500' },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle, color: 'from-sky-500 to-blue-500' },
    { id: 'legal', label: 'Legal', icon: FileCheck, color: 'from-gray-500 to-slate-500' }
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPosterVisible(true);
    let timer: number;
    if (isVideoLoaded) {
      timer = setTimeout(() => setPosterVisible(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [isVideoLoaded]);

  // Logo animation every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLogoAnimation(true);
      setTimeout(() => setLogoAnimation(false), 5000); // Animation duration
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleInvest = () => {
    // Start the animation flow
    setShowCirclesAnimation(true);
    
    // Trigger confetti at the start
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // After circles animation, show confirmation
    setTimeout(() => {
      setShowCirclesAnimation(false);
      setShowConfirmation(true);
      
      // Trigger more confetti for confirmation
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#047857']
      });
    }, 3000);
    
    // After confirmation, show final message
    setTimeout(() => {
      setShowConfirmation(false);
      setShowFinalMessage(true);
      
      // Final confetti burst
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#a855f7', '#c084fc']
      });
    }, 6000);
    
    // Finally, navigate to community page
    setTimeout(() => {
      setShowFinalMessage(false);
    if (onInvest) {
      onInvest(project);
    }
    }, 9000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + ' Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(1) + ' L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + ' K';
    }
    return num.toString();
  };



  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    // Handle direct video URLs
    const videoPatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    ];
    for (const pattern of videoPatterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    // Handle search query URLs - these don't have video IDs, so we return null
    if (url.includes('youtube.com/results?search_query=')) {
      return null;
    }
    return null;
  };

  // Move these declarations above handleVideoLoad to fix ReferenceError
  const videoId = getYouTubeVideoId(project.trailer);
  const finalVideoId = searchVideoId || videoId;
  const baseEmbedUrl = finalVideoId && typeof window !== 'undefined' ? `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&controls=1&enablejsapi=1&origin=${window.location.origin}&playsinline=1&loop=1&playlist=${finalVideoId}&iv_load_policy=3&cc_load_policy=0&fs=1&vq=hd720` : null;
  
  // Create embedUrl with mute parameter based on mobile state
  const embedUrl = useMemo(() => {
    if (!baseEmbedUrl) return null;
    return `${baseEmbedUrl}&mute=${isMobile ? 1 : 0}`;
  }, [baseEmbedUrl, isMobile]);

  const handleVideoLoad = useCallback(async () => {
    if (!videoRef.current) return;
    
    try {
      // For desktop, try unmuted autoplay first
      if (!isMobile) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.5;
        setIsMuted(false);
        
        try {
          await videoRef.current.play();
          setIsVideoPlaying(true);
          setVideoError(null);
          console.log('Desktop: Unmuted autoplay successful');
        } catch (unmutedError) {
          console.log('Desktop: Unmuted autoplay failed, trying muted:', unmutedError);
          // Fallback to muted autoplay
          videoRef.current.muted = true;
          videoRef.current.volume = 0;
          await videoRef.current.play();
          setIsVideoPlaying(true);
          setIsMuted(true);
          setVideoError(null);
          
          // Try to unmute after user interaction
          console.log('Desktop: Muted autoplay successful, waiting for user interaction');
        }
      } else {
        // Mobile: Always start muted
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
        setIsMuted(true);
        setVideoError(null);
        
        await videoRef.current.play();
        setIsVideoPlaying(true);
      }
      
    } catch (error) {
      console.log('Video autoplay failed:', error);
      setIsVideoPlaying(false);
      setVideoError('Autoplay failed - click to play');
      
      // Try muted autoplay as final fallback
      try {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.volume = 0;
          await videoRef.current.play();
          setIsVideoPlaying(true);
          setIsMuted(true);
        }
      } catch (fallbackError) {
        console.log('Muted autoplay also failed:', fallbackError);
      }
    }
    
    // For YouTube videos, try unmuted autoplay on desktop
    if (finalVideoId && iframeRef.current) {
      if (!isMobile) {
        // Try unmuted YouTube autoplay for desktop
        setIsMuted(false);
        console.log('Desktop: YouTube unmuted autoplay attempted');
      } else {
        setIsMuted(true);
      }
    }
    
    // Add a 2 second delay before showing the video (hiding poster)
    setTimeout(() => {
      setIsVideoLoaded(true);
    }, 2000);
  }, [isMobile, finalVideoId]);





  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'supporter': return { color: 'bg-blue-500', label: 'Supporter', icon: '👥' };
      case 'backer': return { color: 'bg-purple-500', label: 'Backer', icon: '⭐' };
      case 'producer': return { color: 'bg-yellow-500', label: 'Producer', icon: '🎬' };
      case 'executive': return { color: 'bg-red-500', label: 'Executive Producer', icon: '👑' };
      default: return { color: 'bg-gray-500', label: 'Investor', icon: '💎' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'limited': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };



  // Extract YouTube video ID from URL - REMOVED DUPLICATE DECLARATION
  
  // Check if it's a search query URL
  const isSearchQuery = project.trailer?.includes('youtube.com/results?search_query=');

  // Auto-play effect
  useEffect(() => {
    if (finalVideoId) {
      setIsVideoPlaying(true);
      setIsVideoLoaded(true);
      setVideoError(null);
      
      // For desktop, try unmuted YouTube autoplay
      if (!isMobile) {
        setIsMuted(false);
        console.log('Desktop: YouTube unmuted autoplay attempted');
      } else {
        setIsMuted(true);
      }
    } else if (videoRef.current) {
      const playVideo = async () => {
        try {
          // For desktop, try unmuted autoplay first
          if (!isMobile) {
            videoRef.current!.muted = false;
            videoRef.current!.volume = 0.5;
            setIsMuted(false);
            
            try {
              await videoRef.current!.play();
              setIsVideoPlaying(true);
              setIsVideoLoaded(true);
              setVideoError(null);
              console.log('Desktop: Unmuted autoplay successful');
            } catch (unmutedError) {
              console.log('Desktop: Unmuted autoplay failed, trying muted:', unmutedError);
              // Fallback to muted autoplay
              videoRef.current!.muted = true;
              videoRef.current!.volume = 0;
              await videoRef.current!.play();
              setIsVideoPlaying(true);
              setIsVideoLoaded(true);
              setIsMuted(true);
              setVideoError(null);
              console.log('Desktop: Muted autoplay successful, waiting for user interaction');
            }
          } else {
            // Mobile: Always start muted
            videoRef.current!.muted = true;
            videoRef.current!.volume = 0;
            setIsMuted(true);
            setVideoError(null);
            
            await videoRef.current!.play();
            setIsVideoPlaying(true);
            setIsVideoLoaded(true);
          }
          
        } catch (error) {
          console.log('Video autoplay failed:', error);
          setIsMuted(true);
          setVideoError('Autoplay failed - click to play');
          
          // Try muted autoplay as final fallback
          try {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.volume = 0;
              await videoRef.current.play();
              setIsVideoPlaying(true);
              setIsMuted(true);
            }
          } catch (fallbackError) {
            console.log('Muted autoplay also failed:', fallbackError);
          }
        }
      };
      const timer = setTimeout(playVideo, 100);
      return () => clearTimeout(timer);
    }
  }, [finalVideoId, isMobile]);






  const toggleMute = useCallback(() => {
    // Mark that user has interacted with video controls
    setUserInteracted(true);
    
    setIsMuted((prev) => {
      const newMutedState = !prev;
      
      if (videoRef.current) {
        videoRef.current.muted = newMutedState;
      }
      
      // For YouTube videos, only use postMessage to avoid reloading iframe
      if (embedUrl && iframeRef.current) {
        try {
          const iframe = iframeRef.current;
          if (iframe.contentWindow && (iframe.contentWindow as any).postMessage) {
            const command = newMutedState ? 'mute' : 'unMute';
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: command, args: [] }),
              '*'
            );
          }
          // Don't reload iframe - just update the state
        } catch (error) {
          console.log('YouTube Player API not available, mute state updated in UI only');
          // Don't reload iframe to prevent video restart
        }
      }
      return newMutedState;
    });
  }, [embedUrl]);

  const handleVideoClick = useCallback(() => {
    // Mark user interaction
    setUserInteracted(true);
    
    if (videoRef.current && !embedUrl) {
      if (isMuted) {
        // On both mobile and desktop, unmute on video click
        try {
          videoRef.current.muted = false;
          videoRef.current.volume = isMobile ? 0.3 : 0.5;
          setIsMuted(false);
        } catch (error) {
          console.log('Could not unmute video on click:', error);
        }
      } else {
        // If not muted, toggle mute
        try {
          videoRef.current.muted = !videoRef.current.muted;
          setIsMuted(videoRef.current.muted);
        } catch (error) {
          console.log('Could not toggle mute on click:', error);
        }
      }
    }
  }, [isMobile, isMuted, embedUrl]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      }).catch((error) => {
        console.log('Share failed:', error);
        // Fallback to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
      });
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
      // You could add a toast notification here
    }
  };

  const handlePlayButton = () => {
    if (typeof window === 'undefined') return;
    
    // Open YouTube video directly
    if (embedUrl) {
      // Extract video ID and open in new tab
      const videoId = finalVideoId;
      if (videoId) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      }
    } else if (isSearchQuery && project.trailer) {
      // If it's a search query, open search results in new tab
      window.open(project.trailer, '_blank');
    } else if (project.trailer) {
      // If it's a direct URL, open it
      window.open(project.trailer, '_blank');
    } else {
      // Fallback: hide overlay content and show full video
      setHeroOpacity(0);
      setHeroScale(1.1);
      if (videoRef.current) {
        videoRef.current.style.pointerEvents = 'auto';
      }
    }
  };

  // Function to extract search query from YouTube search URL
  const getSearchQuery = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/youtube\.com\/results\?search_query=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  };

  // Function to fetch first video from search results
  const fetchSearchVideo = async (searchQuery: string) => {
    setIsSearchVideoLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use a predefined mapping of search queries to popular video IDs
      // In a production environment, you'd use YouTube Data API with proper authentication
      const searchVideoMap: { [key: string]: string } = {
        'sholay': 'dKX6JwWQN5I',
        'dilwale dulhania le jayenge': 'c25GKl5VNeY',
        'kabhi khushi kabhie gham': 'hGqjqHpQjqI',
        'lagaan': 'OS_SjxDmRrk',
        'rang de basanti': 'fV-dWHVdysg',
        '3 idiots': 'K0eDlFX9GMc',
        'pk': 'SOXWc72kf40',
        'dangal': 'x_7YlGv9u1g',
        'padmaavat': 'X3Yvr7dDuXE',
        'baahubali': 'sOEg_9QsnCg',
        'rrr': 'f_vbAtFSEcU',
        'pathaan': 'YxWlaYCA8MU',
        'jawan': 'tcY0QFHpkjQ',
        'animal': 'Dydmpfo6DAE',
        'salaar': 'Hq2OZaDSPaI',
        'dunki': 'qN3wfuPYTI4',
        '12th fail': 'WeMNRXtXlWA',
        'sam bahadur': 'TN5dTn0tQ6Y',
        'merry christmas': 'qN3wfuPYTI4',
        'fighter': 'tcY0QFHpkjQ'
      };

      // Try to find a matching video ID
      const lowerQuery = searchQuery.toLowerCase();
      let foundVideoId: string | null = null;

      // First try exact match
      if (searchVideoMap[lowerQuery]) {
        foundVideoId = searchVideoMap[lowerQuery];
      } else {
        // Try partial matches
        for (const [key, videoId] of Object.entries(searchVideoMap)) {
          if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
            foundVideoId = videoId;
            break;
          }
        }
      }

      // If no match found, use a default popular video
      if (!foundVideoId) {
        foundVideoId = 'dKX6JwWQN5I'; // Sholay as default
      }

      setSearchVideoId(foundVideoId);
      setIsSearchVideoLoading(false);
    } catch (error) {
      console.error('Error fetching search video:', error);
      setIsSearchVideoLoading(false);
    }
  };

  // Check if it's a search query URL and fetch video if needed
  useEffect(() => {
    if (isSearchQuery && !searchVideoId && !isSearchVideoLoading) {
      const query = getSearchQuery(project.trailer);
      if (query) {
        fetchSearchVideo(query);
      }
    }
  }, [project.trailer, isSearchQuery, searchVideoId, isSearchVideoLoading]);



  return (
    <motion.div
      ref={mainContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 overflow-y-auto ${getMainBgColor(theme)}`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm ${
          theme === 'light' ? 'bg-pink-100/90' : 'bg-black/90'
        }`}
        onClick={onClose}
      />
      
      {/* Hero Video Section - Full Width at Top */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative w-full h-[600px] overflow-hidden cursor-pointer"
        onClick={() => {
          // Handle video interaction for both mobile and desktop
          if (videoRef.current && !finalVideoId) {
            if (isMuted) {
              // Unmute on click for both mobile and desktop
              const video = videoRef.current;
              video.muted = false;
              video.volume = isMobile ? 0.3 : 0.5;
              setIsMuted(false);
              setUserInteracted(true);
              console.log('Desktop: Video unmuted on click');
            } else {
              // Toggle mute if already unmuted
              const video = videoRef.current;
              video.muted = !video.muted;
              setIsMuted(video.muted);
              setUserInteracted(true);
              console.log('Desktop: Video mute toggled');
            }
          }
          
          // Handle YouTube video interaction
          if (finalVideoId && iframeRef.current) {
            const currentSrc = iframeRef.current.src;
            
            if (isMuted) {
              // Unmute YouTube video on user interaction
              const unmuteUrl = currentSrc.replace('&mute=1', '&mute=0');
              if (unmuteUrl !== currentSrc) {
                iframeRef.current.src = unmuteUrl;
                setIsMuted(false);
                setUserInteracted(true);
                console.log('Desktop: YouTube video unmuted on click');
              }
            } else {
              // Mute YouTube video
              const muteUrl = currentSrc.replace('&mute=0', '&mute=1');
              if (muteUrl !== currentSrc) {
                iframeRef.current.src = muteUrl;
                setIsMuted(true);
                setUserInteracted(true);
                console.log('Desktop: YouTube video muted on click');
              }
            }
          }
        }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {finalVideoId ? (
            <>
              {/* YouTube Player - Full-Bleed Cover */}
              <div className="absolute inset-0 w-full h-full">
                <iframe
                  ref={iframeRef}
                  src={embedUrl}
                  className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  onLoad={handleVideoLoad}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  style={{
                    border: 'none',
                    pointerEvents: 'auto',
                    background: 'transparent',
                  }}
                />
              </div>
            </>
          ) : isSearchVideoLoading ? (
            <>
              {/* Loading state for search video */}
              <div className={`absolute inset-0 w-full h-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="relative mb-4">
                    <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  </div>
                  <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Loading Video...</p>
                  <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Searching for related content</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onLoadedData={handleVideoLoad}
                onClick={handleVideoClick}
                muted={isMobile}
                loop
                playsInline
                autoPlay
                preload="auto"
                webkit-playsinline="true"
                style={{ 
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%'
                }}
              >
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </>
          )}
          
          {/* Poster Image - Overlay on top of video */}
          <img
            src={project.poster.replace('SX300', 'SX1080')}
            alt={project.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              posterVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Netflix-style Premium Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Base cinematic blur and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 backdrop-blur-[1.2px]" />
          
          {/* Dynamic color grading overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-cyan-900/10" />
          <div className="absolute inset-0 bg-gradient-to-bl from-orange-900/5 via-transparent to-blue-900/5" />
          
          {/* Enhanced top gradient for better text readability */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
          
          {/* Premium bottom gradient with multiple layers */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Cinematic side vignettes */}
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black/30 via-black/10 to-transparent" />
          
          {/* Subtle center focus ring */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/10" />
          
          {/* Dynamic light leaks for premium feel */}
          <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-gradient-to-b from-yellow-500/5 via-orange-500/3 to-transparent transform -skew-x-12" />
          <div className="absolute bottom-0 right-1/4 w-1/3 h-24 bg-gradient-to-t from-cyan-500/5 via-blue-500/3 to-transparent transform skew-x-12" />
        </div>

        {/* Tap to Unmute Indicator - Show on both mobile and desktop when muted */}
        {isMuted && isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-20 right-4 z-30 p-3 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20"
          >
            <p className="text-white text-sm flex items-center gap-2">
              <VolumeX className="w-4 h-4" />
              {isMobile ? 'Tap to unmute' : 'Click to unmute'}
            </p>
          </motion.div>
        )}

        {/* Video Error Indicator */}
        {videoError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-32 right-4 z-30 p-3 rounded-lg bg-red-600/80 backdrop-blur-sm border border-red-400/30"
          >
            <p className="text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {videoError}
            </p>
          </motion.div>
        )}

        {/* Mute Control */}
        <motion.button
          onClick={toggleMute}
          className="absolute bottom-6 right-4 z-30 p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white group-hover:text-gray-200 transition-colors" />
          ) : (
            <Volume2 className="w-5 h-5 text-white group-hover:text-gray-200 transition-colors" />
          )}
        </motion.button>

        {/* Top Bar with Back, Like, and Share */}
        <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center p-6">
          {/* Back Button - Top Left */}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors duration-200"
            title="Back to Browse Catalogue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Like and Share Icons - Top Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="text-white/60 hover:text-white transition-colors duration-300"
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-white' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="text-white/60 hover:text-white transition-colors duration-300"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Circles Logo and Text - Top Right (moved up even more) */}
        <div className="absolute top-6 right-0 z-30 flex items-center gap-0 m-6 select-none">
          <motion.div 
            className="h-12 w-12 md:h-20 md:w-20 flex items-center justify-center overflow-hidden"
            animate={logoAnimation ? {
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              filter: [
                'brightness(1) drop-shadow(0 0 10px rgba(147,51,234,0.3))',
                'brightness(1.3) drop-shadow(0 0 25px rgba(59,130,246,0.6))',
                'brightness(1) drop-shadow(0 0 10px rgba(147,51,234,0.3))'
              ]
            } : {}}
            transition={{ 
              duration: 5, 
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <img src={getUserAvatar('Community Bot')} alt="Circles Logo" className="h-12 w-12 md:h-20 md:w-20 object-contain drop-shadow-lg blur-[0.3px]" />
          </motion.div>
          <span className="text-lg md:text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-wide blur-[0.2px] -ml-2 md:-ml-3">Circles</span>
        </div>

        {/* Netflix-style Hero Content */}
        <div className="absolute inset-0 flex items-end pointer-events-none z-20">
          <div className="max-w-7xl mx-auto px-8 pb-16 w-full">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-4xl pointer-events-auto"
            >
              {/* Project Badges - Hidden on mobile */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="hidden md:flex items-center gap-3 mb-6"
              >
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${
                  project.type === 'film' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  project.type === 'music' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                  {project.type === 'film' ? '🎬' : project.type === 'music' ? '🎵' : '🎞️'}
                  {project.type.toUpperCase()}
                </div>
                {project.rating && (
                  <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-yellow-500/20 text-yellow-300 text-sm font-bold border border-yellow-500/30 backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {project.rating}
                  </div>
                )}
                <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/30 backdrop-blur-sm">
                  <Zap className="w-4 h-4" />
                  TRENDING
                </div>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-2xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 drop-shadow-2xl leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
              >
                {project.title}
              </motion.h1>
              
              {/* Mobile Action Buttons - Only visible on mobile */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex md:hidden items-center gap-3 mb-6"
              >
                {/* Play Button */}
                <motion.button
                  onClick={handlePlayButton}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg font-bold text-sm hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 transition-all duration-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 backdrop-blur-sm overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-teal-400/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <Play className="relative w-4 h-4" />
                  <span className="relative">Play</span>
                </motion.button>

                {/* Invest Now Button */}
                <motion.button
                  onClick={() => {
                    setActiveTab('invest');
                    // Scroll the main content area into view
                    setTimeout(() => {
                      if (contentAreaRef.current) {
                        contentAreaRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-2 px-4 rounded-lg font-bold text-sm hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 backdrop-blur-sm border border-emerald-400/20 overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                  {/* White highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <DollarSign className="relative w-4 h-4" />
                  <span className="relative">Invest</span>
                  <ChevronRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
              </motion.div>
              
              {/* Description - Hidden on mobile */}
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="hidden md:block text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl drop-shadow-lg leading-relaxed"
              >
                {project.description}
              </motion.p>
              
              {/* Project Meta - Hidden on mobile */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="hidden md:flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8"
              >
                {project.director && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Director:</span>
                    <span>{project.director}</span>
                  </div>
                )}
                {project.language && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Language:</span>
                    <span>{project.language}</span>
                  </div>
                )}
                {project.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </motion.div>

              {/* Play and Invest Buttons - Hidden on mobile */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="hidden md:flex items-center gap-4"
              >
                {/* Play Button */}
                <motion.button
                  onClick={handlePlayButton}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 transition-all duration-500 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 backdrop-blur-sm overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/20 to-teal-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <Play className="relative w-6 h-6" />
                  <span className="relative">Play</span>
                </motion.button>

                {/* Invest Now Button */}
                <motion.button
                onClick={() => {
                  setActiveTab('invest');
                  // Scroll the main content area into view
                  setTimeout(() => {
                    if (contentAreaRef.current) {
                      contentAreaRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-5 px-10 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-500 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 backdrop-blur-sm border border-emerald-400/20 overflow-hidden"
              >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  {/* White highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <DollarSign className="relative w-6 h-6" />
                  <span className="relative">Invest Now</span>
                  <ChevronRight className="relative w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>






      </motion.div>

      {/* Main Content - Side by Side Below Hero */}
      <div className="relative flex z-5">
        {/* Left Navigation Panel - Icons only on mobile */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className={`w-20 md:w-80 ${theme === 'light' ? 'bg-white/95' : 'bg-gradient-to-b from-gray-900/95 to-black/95'} backdrop-blur-xl border-r ${getBorderColor(theme)} overflow-y-auto sticky top-0 h-screen transition-all duration-300`}
        >
          <div className="p-2 md:p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="hidden md:block text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent'}">Project Details</h2>
              <button
                onClick={onClose}
                className={`group relative p-2 md:p-3 rounded-xl ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200' : 'bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-600/50 text-gray-300 hover:from-purple-600/20 hover:via-pink-600/20 hover:to-rose-600/20 hover:text-white border-gray-600/30 hover:border-purple-500/50'} transition-all duration-300 border overflow-hidden`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 ${theme === 'light' ? 'bg-gray-200/50' : 'bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-rose-400/10'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <ArrowLeft className="relative w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-2 md:space-y-3">
              {navigationTabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setTabChangeKey(prev => prev + 1);
                    // Force scroll to top immediately when tab is clicked
                    setTimeout(() => {
                      if (contentAreaRef.current) {
                        contentAreaRef.current.scrollTop = 0;
                        contentAreaRef.current.scrollTo(0, 0);
                      }
                    }, 0);
                    // Also try after a short delay to ensure it works
                    setTimeout(() => {
                      if (contentAreaRef.current) {
                        contentAreaRef.current.scrollTop = 0;
                        contentAreaRef.current.scrollTo(0, 0);
                      }
                    }, 100);
                  }}
                  className={`group relative w-full flex items-center justify-center md:justify-start gap-2 md:gap-4 p-2 md:p-5 rounded-lg md:rounded-2xl text-left transition-all duration-500 overflow-hidden ${
                    activeTab === tab.id
                      ? theme === 'light' 
                        ? 'bg-purple-100 border border-purple-300 text-purple-900 shadow-lg shadow-purple-200'
                        : 'bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-rose-600/30 border border-purple-500/40 text-white shadow-2xl shadow-purple-500/30'
                      : theme === 'light'
                        ? `${getTextColor(theme, 'secondary')} hover:bg-gray-100 border border-transparent hover:border-gray-300`
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/50 hover:to-gray-700/50 hover:text-white border border-transparent hover:border-gray-600/30'
                  }`}
                  title={tab.label}
                >
                  <div className={`absolute inset-0 ${theme === 'light' ? 'bg-purple-100/50' : `bg-gradient-to-r ${tab.color}`} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className={`relative p-1.5 md:p-3 rounded-lg md:rounded-xl ${theme === 'light' ? 'bg-purple-500 text-white' : `bg-gradient-to-r ${tab.color} text-white`} shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden`}>
                    <tab.icon className="relative w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="relative font-semibold hidden md:block text-sm">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className={`relative w-1.5 md:w-2 h-8 md:h-10 ${theme === 'light' ? 'bg-purple-500' : 'bg-gradient-to-b from-purple-400 via-pink-400 to-rose-400'} rounded-full ml-auto shadow-lg ${theme === 'light' ? 'shadow-purple-300' : 'shadow-purple-500/50'} hidden md:block`}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <div 
          key={`content-area-${activeTab}-${tabChangeKey}`}
          ref={setContentAreaRef} 
          className={`flex-1 overflow-y-auto ${theme === 'light' ? 'bg-pink-100' : 'bg-gradient-to-b from-gray-900 to-black'}`}
        >

          {/* Content Sections */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${tabChangeKey}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="p-3 md:p-8"
                onAnimationComplete={() => {
                  // Ensure scroll to top after animation completes
                  setTimeout(() => {
                    if (contentAreaRef.current) {
                      contentAreaRef.current.scrollTop = 0;
                      contentAreaRef.current.scrollTo(0, 0);
                    }
                  }, 0);
                  // Also try after animation delay to ensure it works
                  setTimeout(() => {
                    if (contentAreaRef.current) {
                      contentAreaRef.current.scrollTop = 0;
                      contentAreaRef.current.scrollTo(0, 0);
                    }
                  }, 200);
                }}
              >
                {/* Content will be rendered based on activeTab */}
                <div className={getTextColor(theme, 'primary')}>
                  <h2 className={`text-2xl md:text-4xl font-bold mb-4 md:mb-8 ${theme === 'light' ? 'text-gray-900' : 'bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent'} drop-shadow-lg`}>
                    {navigationTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  
                  {/* Epic Content Sections */}
                  <div className="space-y-4 md:space-y-8">
                    {activeTab === 'overview' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Project Summary Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`group relative ${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${theme === 'light' ? 'border-gray-200 hover:border-purple-300' : 'border-gray-700/50 hover:border-purple-500/30'} transition-all duration-500 shadow-2xl ${theme === 'light' ? 'shadow-purple-200/50 hover:shadow-purple-300/50' : 'shadow-purple-500/10 hover:shadow-purple-500/20'}`}
                        >
                          <div className={`absolute inset-0 ${theme === 'light' ? 'bg-purple-100/30' : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5'} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                          <h3 className={`relative text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <div className={`p-2 rounded-xl ${theme === 'light' ? 'bg-purple-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} shadow-lg`}>
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <span className={theme === 'light' ? 'text-purple-700' : 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'}>Project Overview</span>
                          </h3>
                          
                          {/* Main Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Director</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {movieDetails?.credits?.crew?.find(c => c.known_for_department === 'Directing')?.name || project.director || 'TBA'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Lead Actor</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {cast.length > 0 ? cast[0]?.name : (project as any).actor || 'TBA'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Lead Actress</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {cast.find(c => c.known_for_department === 'Acting' && c.gender === 1)?.name || (project as any).actress || 'TBA'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Production House</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {movieDetails?.production_companies?.[0]?.name || project.productionHouse || 'TBA'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Runtime</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {movieDetails?.runtime ? `${movieDetails.runtime} min` : (project as any).runtime ? `${(project as any).runtime} min` : '150 min'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>TMDB Rating</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold flex items-center gap-1`}>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {movieDetails?.vote_average ? movieDetails.vote_average.toFixed(1) : (project as any).tmdbRating || project.rating || 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Country</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {movieDetails?.production_companies?.[0]?.origin_country || (project as any).country || 'India'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Release Year</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>
                                {movieDetails?.release_date ? new Date(movieDetails.release_date).getFullYear() : (project as any).releaseYear || 'TBA'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className={`${getTextColor(theme, 'muted')} text-sm`}>Language</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold`}>{project.language || 'Hindi'}</p>
                            </div>
                          </div>

                          {/* Genres */}
                          {(project as any).tmdbGenres && (project as any).tmdbGenres.length > 0 && (
                            <div className="mb-4 md:mb-6">
                              <p className={`${getTextColor(theme, 'muted')} text-sm mb-2 md:mb-3`}>Genres</p>
                              <div className="flex flex-wrap gap-1 md:gap-2">
                                {(project as any).tmdbGenres.map((genre: string, index: number) => (
                                  <span 
                                    key={index}
                                    className={`group relative px-2 py-1 md:px-4 md:py-2 ${theme === 'light' ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200' : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400/60'} text-xs md:text-sm rounded-full border transition-all duration-300 shadow-lg ${theme === 'light' ? 'hover:shadow-purple-200' : 'hover:shadow-purple-500/20'}`}
                                  >
                                    <div className={`absolute inset-0 ${theme === 'light' ? 'bg-purple-200/50' : 'bg-gradient-to-r from-purple-400/10 to-pink-400/10'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <span className="relative">{genre}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Spoken Languages */}
                          {(project as any).spokenLanguages && (project as any).spokenLanguages.length > 0 && (
                            <div className="mb-4 md:mb-6">
                              <p className={`${getTextColor(theme, 'muted')} text-sm mb-2 md:mb-3`}>Spoken Languages</p>
                              <div className="flex flex-wrap gap-1 md:gap-2">
                                {(project as any).spokenLanguages.map((language: string, index: number) => (
                                  <span 
                                    key={index}
                                    className={`group relative px-2 py-1 md:px-4 md:py-2 ${theme === 'light' ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40 hover:from-blue-500/30 hover:to-cyan-500/30 hover:border-blue-400/60'} text-xs md:text-sm rounded-full border transition-all duration-300 shadow-lg ${theme === 'light' ? 'hover:shadow-blue-200' : 'hover:shadow-blue-500/20'}`}
                                  >
                                    <div className={`absolute inset-0 ${theme === 'light' ? 'bg-blue-200/50' : 'bg-gradient-to-r from-blue-400/10 to-cyan-400/10'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <span className="relative">{language}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* TMDB Overview */}
                          {(movieDetails?.overview || (project as any).tmdbOverview) && (
                            <div className="mb-4 md:mb-6">
                              <p className={`${getTextColor(theme, 'muted')} text-sm mb-2 md:mb-3 flex items-center gap-2`}>
                                Plot Summary
                                {tmdbLoading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                              </p>
                              <p className={`${getTextColor(theme, 'secondary')} leading-relaxed`}>
                                {movieDetails?.overview || (project as any).tmdbOverview}
                              </p>
                            </div>
                          )}

                          {/* Tagline */}
                          {(project as any).tagline && (
                            <div className="mb-4 md:mb-6">
                              <p className={`${getTextColor(theme, 'muted')} text-sm mb-2 md:mb-3`}>Tagline</p>
                              <p className={`${getTextColor(theme, 'primary')} font-semibold italic`}>
                                "{(project as any).tagline}"
                              </p>
                            </div>
                          )}

                          {/* External Links */}
                          <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                            {(project as any).imdbId && (
                              <a
                                href={`https://www.imdb.com/title/${(project as any).imdbId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base ${theme === 'light' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'} rounded-lg transition-colors duration-300`}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View on IMDb
                              </a>
                            )}
                            <button className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'} rounded-lg transition-colors duration-300`}>
                              <Share2 className="w-4 h-4" />
                              Share Project
                            </button>
                          </div>
                        </motion.div>

                        {/* Funding Progress */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                            Funding Progress
                          </h3>
                          
                          {/* Progress Bar */}
                          <div className="mb-6 md:mb-8">
                            <div className="flex justify-between items-center mb-3 md:mb-4">
                              <span className={`${getTextColor(theme, 'secondary')} text-sm md:text-base`}>Progress</span>
                              <span className={`${getTextColor(theme, 'primary')} font-bold text-lg md:text-xl`}>{project.fundedPercentage}%</span>
                            </div>
                            <div className={`relative h-6 ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'} rounded-full overflow-hidden`}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.fundedPercentage}%` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-pink-400/50 animate-pulse" />
                              </motion.div>
                            </div>
                            <div className={`flex justify-between mt-2 text-xs md:text-sm ${getTextColor(theme, 'muted')}`}>
                              <span>Raised: {formatCurrency(project.raisedAmount)}</span>
                              <span>Goal: {formatCurrency(project.targetAmount)}</span>
                            </div>
                          </div>

                          {/* Funding Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Total Investors</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{fundingStats.totalInvestors}</p>
                              <p className="text-green-400 text-xs md:text-sm">+12 this week</p>
                            </div>
                            
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Avg. Investment</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{formatCurrency(fundingStats.averageInvestment)}</p>
                              <p className="text-green-400 text-xs md:text-sm">+8% from last month</p>
                            </div>
                            
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Days Active</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{fundingStats.daysSinceCreated}</p>
                              <p className="text-blue-400 text-xs md:text-sm">45 days remaining</p>
                            </div>
                            
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <Zap className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Daily Velocity</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{formatCurrency(fundingStats.fundingVelocity)}</p>
                              <p className="text-green-400 text-xs md:text-sm">+15% this week</p>
                            </div>
                            
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Trending Score</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>8.9</p>
                              <p className="text-green-400 text-xs md:text-sm">Top 5% of projects</p>
                            </div>
                            
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
                                <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Top City</span>
                              </div>
                              <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>Mumbai</p>
                              <p className="text-blue-400 text-xs md:text-sm">42% of investments</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Funding Milestones */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <Target className="w-6 h-6 text-indigo-400" />
                            Funding Milestones
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            {fundingMilestones.map((milestone, index) => (
                              <motion.div
                                key={milestone.percentage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-3 md:p-6 rounded-2xl border-2 transition-all duration-300 min-h-[120px] md:min-h-[140px] ${
                                  milestone.achieved
                                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                                    : theme === 'light' 
                                      ? 'bg-white/80 border-gray-300'
                                      : 'bg-gray-900/50 border-gray-700/50'
                                }`}
                              >
                                {milestone.achieved && (
                                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs md:text-sm">✓</span>
                                  </div>
                                )}
                                <div className="text-2xl md:text-4xl mb-2 md:mb-3 flex justify-center">{milestone.icon}</div>
                                <h4 className={`text-sm md:text-lg font-bold ${getTextColor(theme, 'primary')} mb-1 md:mb-2 text-center leading-tight`}>{milestone.label}</h4>
                                <p className={`text-xs md:text-sm ${milestone.achieved ? 'text-green-400' : getTextColor(theme, 'muted')} text-center`}>
                                  {milestone.achieved ? 'Achieved!' : `${milestone.percentage}% funding`}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Movie Details & Ratings */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <Star className="w-6 h-6 text-yellow-400" />
                            Movie Details & Ratings
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {/* TMDB Rating */}
                            {(project as any).tmdbRating && (
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-current" />
                                  <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>TMDB Rating</span>
                                </div>
                                <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{(project as any).tmdbRating}</p>
                                <p className="text-yellow-400 text-xs md:text-sm">Out of 10</p>
                              </div>
                            )}
                            
                            {/* Runtime */}
                            {(project as any).runtime && (
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                                  <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Runtime</span>
                                </div>
                                <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{(project as any).runtime}</p>
                                <p className="text-blue-400 text-xs md:text-sm">Minutes</p>
                              </div>
                            )}
                            
                            {/* Release Year */}
                            {(project as any).releaseYear && (
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                                  <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Release Year</span>
                                </div>
                                <p className={`text-2xl md:text-3xl font-bold ${getTextColor(theme, 'primary')}`}>{(project as any).releaseYear}</p>
                                <p className="text-green-400 text-xs md:text-sm">Year</p>
                              </div>
                            )}
                            
                            {/* Country */}
                            {(project as any).country && (
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                                  <span className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>Origin Country</span>
                                </div>
                                <p className={`text-lg md:text-xl font-bold ${getTextColor(theme, 'primary')}`}>{(project as any).country}</p>
                                <p className="text-purple-400 text-xs md:text-sm">Production</p>
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Countdown Timer */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <Clock className="w-6 h-6 text-red-400" />
                            Time Remaining
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {Object.entries(timeRemaining).map(([unit, value]) => (
                              <div key={unit} className="text-center">
                                <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                  <p className={`text-2xl md:text-4xl font-bold ${getTextColor(theme, 'primary')} mb-1 md:mb-2`}>{value.toString().padStart(2, '0')}</p>
                                  <p className={`${getTextColor(theme, 'muted')} text-xs md:text-sm capitalize`}>{unit}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'invest' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Investment Form */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <DollarSign className="w-6 h-6 text-green-400" />
                            Make Your Investment
                          </h3>
                          
                          {/* Quick Amount Buttons */}
                          <div className="mb-6 md:mb-8">
                            <p className={`${getTextColor(theme, 'secondary')} mb-3 md:mb-4 text-sm md:text-base`}>Select Investment Amount</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                              {[5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000].map((amount) => (
                                <button
                                  key={amount}
                                  onClick={() => setInvestmentAmount(amount)}
                                  className={`p-3 md:p-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                                    investmentAmount === amount
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                                      : theme === 'light'
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                                  }`}
                                >
                                  ₹{formatLargeNumber(amount)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Amount */}
                          <div className="mb-6 md:mb-8">
                            <label className={`block ${getTextColor(theme, 'secondary')} mb-2 text-sm md:text-base`}>Custom Amount</label>
                            <input
                              type="number"
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                              className={`w-full p-3 md:p-4 text-sm md:text-base ${theme === 'light' ? 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500' : 'bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400'} border rounded-xl focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20`}
                              placeholder="Enter amount"
                            />
                          </div>

                          {/* Investment Calculator */}
                          <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 mb-6 md:mb-8 border ${getBorderColor(theme)}`}>
                            <h4 className={`text-base md:text-lg font-semibold ${getTextColor(theme, 'primary')} mb-3 md:mb-4`}>Investment Breakdown</h4>
                                                          <div className="space-y-2 md:space-y-3">
                                <div className="flex justify-between">
                                  <span className={`${getTextColor(theme, 'muted')} text-sm md:text-base`}>Investment Amount</span>
                                  <span className={`${getTextColor(theme, 'primary')} font-semibold text-sm md:text-base`}>{formatCurrency(investmentAmount)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${getTextColor(theme, 'muted')} text-sm md:text-base`}>Processing Fee (2%)</span>
                                  <span className={`${getTextColor(theme, 'primary')} font-semibold text-sm md:text-base`}>{formatCurrency(investmentAmount * 0.02)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={`${getTextColor(theme, 'muted')} text-sm md:text-base`}>GST (18%)</span>
                                  <span className={`${getTextColor(theme, 'primary')} font-semibold text-sm md:text-base`}>{formatCurrency(investmentAmount * 0.18)}</span>
                                </div>
                                <div className={`border-t ${theme === 'light' ? 'border-gray-300' : 'border-gray-700'} pt-2 md:pt-3 flex justify-between`}>
                                  <span className={`${getTextColor(theme, 'primary')} font-bold text-base md:text-lg`}>Total Amount</span>
                                  <span className="text-green-400 font-bold text-base md:text-lg">
                                    {formatCurrency(investmentAmount * 1.20)}
                                  </span>
                                </div>
                              </div>
                          </div>

                          {/* Payment Method */}
                          <div className="mb-6 md:mb-8">
                            <p className={`${getTextColor(theme, 'secondary')} mb-3 md:mb-4 text-sm md:text-base`}>Payment Method</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                              {[
                                { id: 'upi', label: 'UPI', icon: '📱' },
                                { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                                { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  onClick={() => setPaymentMethod(method.id as any)}
                                  className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                                    paymentMethod === method.id
                                      ? 'border-green-500 bg-green-500/10 text-green-400'
                                      : theme === 'light'
                                        ? 'border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900'
                                        : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                                  }`}
                                >
                                  <div className="text-xl md:text-2xl mb-1 md:mb-2">{method.icon}</div>
                                  <div className="font-semibold text-sm md:text-base">{method.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Own It Button */}
                          <button
                            onClick={handleInvest}
                            className={`group relative w-full py-6 md:py-8 px-6 md:px-8 rounded-2xl font-bold text-lg md:text-xl transition-all duration-500 shadow-2xl overflow-hidden backdrop-blur-sm ${
                              theme === 'light'
                                ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 shadow-purple-500/30 hover:shadow-purple-500/50 border border-purple-500/30 hover:border-purple-400/50'
                                : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white hover:from-slate-800 hover:via-purple-800 hover:to-slate-800 shadow-purple-500/20 hover:shadow-purple-500/40 border border-purple-500/30 hover:border-purple-400/50'
                            }`}
                          >
                            {/* Rich gradient overlay */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                              theme === 'light'
                                ? 'bg-gradient-to-r from-purple-400/20 via-transparent to-fuchsia-400/20'
                                : 'bg-gradient-to-r from-purple-500/10 via-transparent to-fuchsia-500/10'
                            }`} />
                            
                            {/* Elegant border glow */}
                            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm ${
                              theme === 'light'
                                ? 'bg-gradient-to-r from-purple-400/30 to-fuchsia-400/30'
                                : 'bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20'
                            }`} />
                            
                            {/* Subtle animated particles */}
                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                              <div className={`absolute top-2 left-4 w-1 h-1 rounded-full group-hover:animate-pulse ${
                                theme === 'light' ? 'bg-purple-300/80' : 'bg-purple-400/60'
                              }`} />
                              <div className={`absolute bottom-3 right-6 w-1 h-1 rounded-full group-hover:animate-pulse delay-300 ${
                                theme === 'light' ? 'bg-fuchsia-300/80' : 'bg-fuchsia-400/60'
                              }`} />
                              <div className={`absolute top-1/2 left-1/4 w-0.5 h-0.5 rounded-full group-hover:animate-pulse delay-500 ${
                                theme === 'light' ? 'bg-purple-200/60' : 'bg-purple-300/40'
                              }`} />
                            </div>
                            
                            <div className="relative flex items-center justify-center gap-4">
                              {/* Rotating circles logo */}
                              <div className="relative w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                                <img 
                                  src={getUserAvatar('Community Bot')} 
                                  alt="Circles Logo" 
                                  className="w-full h-full object-contain filter brightness-0 invert group-hover:animate-spin transition-all duration-300"
                                  style={{ 
                                    animationDuration: '3s',
                                    transform: 'rotate(0deg)',
                                    transformOrigin: 'center'
                                  }}
                                />
                              </div>
                              <span className={`bg-clip-text text-transparent font-semibold tracking-wide ${
                                theme === 'light'
                                  ? 'bg-gradient-to-r from-white via-purple-50 to-white'
                                  : 'bg-gradient-to-r from-white via-purple-100 to-white'
                              }`}>
                                Own it
                              </span>
                              <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300 ${
                                theme === 'light' ? 'text-purple-200' : 'text-purple-300'
                              }`} />
                            </div>
                          </button>

                          {/* Available Slots */}
                          <div className="mt-4 md:mt-6 text-center">
                            <p className={`${getTextColor(theme, 'muted')} text-xs md:text-sm`}>
                              <span className="text-green-400 font-semibold">100</span> of <span className={`${getTextColor(theme, 'primary')} font-semibold`}>150</span> investment slots remaining
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Animation Overlays */}
                    <AnimatePresence>
                      {/* Circles Animation */}
                      {showCirclesAnimation && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="mb-8"
                            >
                              <img 
                                src={getUserAvatar('Community Bot')} 
                                alt="Circles Logo" 
                                className="w-32 h-32 mx-auto drop-shadow-2xl animate-spin object-contain"
                                style={{ animationDuration: '3s' }}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = getUserAvatar('Community Bot');
                                }}
                              />
                            </motion.div>
                            
                            {/* Animated circles around the logo */}
                            <div className="relative">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ 
                                    duration: 1, 
                                    delay: i * 0.2,
                                    ease: "easeOut"
                                  }}
                                  className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                                  style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-80px)`,
                                  }}
                                />
                              ))}
                            </div>
                            
                            <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="text-3xl font-bold text-white mt-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                            >
                              Processing Your Investment...
                            </motion.h2>
                          </div>
                        </motion.div>
                      )}

                      {/* Confirmation Animation */}
                      {showConfirmation && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="text-white text-4xl"
                              >
                                ✓
                              </motion.div>
                            </motion.div>
                            
                            <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className="text-3xl font-bold text-white mb-4"
                            >
                              Investment Confirmed!
                            </motion.h2>
                            
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                              className="text-xl text-gray-300"
                            >
                              Welcome to the exclusive circle of investors
                            </motion.p>
                          </div>
                        </motion.div>
                      )}

                      {/* Final Message */}
                      {showFinalMessage && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center"
                        >
                          <div className="text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="mb-8"
                            >
                              <img 
                                src={getUserAvatar('Community Bot')} 
                                alt="Circles Logo" 
                                className="w-32 h-32 mx-auto drop-shadow-2xl animate-spin object-contain"
                                style={{ animationDuration: '3s' }}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = getUserAvatar('Community Bot');
                                }}
                              />
                            </motion.div>
                            
                            <motion.h2
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                              className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"
                            >
                              Now Enter Circles
                            </motion.h2>
                            
                            <motion.p
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7, duration: 0.5 }}
                              className="text-xl text-gray-300"
                            >
                              Connecting you to the community...
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {activeTab === 'perks' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Experience Tiers Overview */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                              <Crown className="w-6 h-6 text-white" />
                            </div>
                            <span className={theme === 'light' ? 'text-yellow-700' : 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'}>Experience Tiers</span>
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                              { tier: 'supporter', name: 'Supporter', minAmount: 10000, color: 'from-blue-500 to-cyan-500', icon: '👥' },
                              { tier: 'backer', name: 'Backer', minAmount: 25000, color: 'from-purple-500 to-pink-500', icon: '⭐' },
                              { tier: 'producer', name: 'Producer', minAmount: 75000, color: 'from-yellow-500 to-orange-500', icon: '🎬' },
                              { tier: 'executive', name: 'Executive Producer', minAmount: 200000, color: 'from-red-500 to-rose-500', icon: '👑' }
                            ].map((tierInfo, index) => (
                              <motion.div
                                key={tierInfo.tier}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative ${theme === 'light' ? 'bg-white/80' : 'bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50'} rounded-2xl md:rounded-3xl p-4 md:p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-yellow-500/50' : 'border-gray-700/50 hover:border-yellow-500/50'} transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-yellow-500/20 overflow-hidden`}
                              >
                                <div className={`absolute inset-0 ${theme === 'light' ? 'bg-yellow-100/30' : 'bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <div className="relative text-center">
                                  <div className="text-3xl md:text-5xl mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">{tierInfo.icon}</div>
                                  <h4 className={`text-base md:text-lg font-bold ${getTextColor(theme, 'primary')} mb-2 group-hover:text-yellow-600 transition-colors duration-300`}>{tierInfo.name}</h4>
                                  <p className={`${getTextColor(theme, 'muted')} text-xs md:text-sm mb-3 md:mb-4`}>Min. Investment</p>
                                  <p className={`text-lg md:text-2xl font-bold ${theme === 'light' ? 'text-yellow-700' : 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'}`}>{formatCurrency(tierInfo.minAmount)}</p>
                                  <div className={`w-full h-2 bg-gradient-to-r ${tierInfo.color} rounded-full mt-4 shadow-lg`} />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Enhanced Perks & Experiences */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                              <Medal className="w-6 h-6 text-white" />
                            </div>
                            <span className={theme === 'light' ? 'text-yellow-700' : 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'}>Perks & Experiences</span>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              {
                                id: '1',
                                title: 'Digital Certificate of Investment',
                                description: 'Official digital certificate recognizing your investment with blockchain verification',
                                tier: 'supporter' as const,
                                minAmount: 10000,
                                estimatedValue: 2500,
                                status: 'active' as const,
                                maxParticipants: null,
                                currentParticipants: 0,
                                features: ['Blockchain Verified', 'Shareable on Social Media', 'Lifetime Access'],
                                icon: '📜'
                              },
                              {
                                id: '2',
                                title: 'Community Casting Vote',
                                description: 'Vote on cast members for upcoming projects and influence creative decisions',
                                tier: 'backer' as const,
                                minAmount: 25000,
                                estimatedValue: 5000,
                                status: 'upcoming' as const,
                                maxParticipants: 100,
                                currentParticipants: 45,
                                features: ['Exclusive Voting Rights', 'Behind-the-scenes Access', 'Director Q&A'],
                                icon: '🗳️'
                              },
                              {
                                id: '3',
                                title: 'VIP Set Visit Experience',
                                description: 'Exclusive set visit with crew interaction and behind-the-scenes access',
                                tier: 'producer' as const,
                                minAmount: 75000,
                                estimatedValue: 15000,
                                status: 'upcoming' as const,
                                maxParticipants: 20,
                                currentParticipants: 8,
                                features: ['Full Day Set Visit', 'Meet Cast & Crew', 'Lunch with Director'],
                                icon: '🎬'
                              },
                              {
                                id: '4',
                                title: 'Executive Producer Credit',
                                description: 'Get your name in the credits as Executive Producer and attend premiere',
                                tier: 'executive' as const,
                                minAmount: 200000,
                                estimatedValue: 50000,
                                status: 'active' as const,
                                maxParticipants: 5,
                                currentParticipants: 2,
                                features: ['Screen Credit', 'Premiere Invitation', 'Red Carpet Access'],
                                icon: '👑'
                              },
                              {
                                id: '5',
                                title: 'Exclusive Merchandise Collection',
                                description: 'Limited edition merchandise including signed posters and collectibles',
                                tier: 'backer' as const,
                                minAmount: 25000,
                                estimatedValue: 8000,
                                status: 'active' as const,
                                maxParticipants: 50,
                                currentParticipants: 23,
                                features: ['Signed Posters', 'Limited Edition Items', 'Early Access'],
                                icon: '🎁'
                              },
                              {
                                id: '6',
                                title: 'Private Screening Experience',
                                description: 'Private screening with the cast and crew before public release',
                                tier: 'producer' as const,
                                minAmount: 75000,
                                estimatedValue: 25000,
                                status: 'upcoming' as const,
                                maxParticipants: 15,
                                currentParticipants: 5,
                                features: ['Private Screening', 'Q&A Session', 'Exclusive Content'],
                                icon: '🎭'
                              }
                            ].map((perk, index) => {
                              const tierInfo = getTierInfo(perk.tier);
                              return (
                                <motion.div
                                  key={perk.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`group relative ${theme === 'light' ? 'bg-white/80' : 'bg-gradient-to-br from-gray-900/50 via-gray-800/50 to-black/50'} rounded-3xl p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-purple-500/50' : 'border-gray-700/50 hover:border-purple-500/50'} transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-purple-500/20 overflow-hidden`}
                                >
                                  <div className={`absolute inset-0 ${theme === 'light' ? 'bg-purple-100/30' : 'bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-rose-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                  {/* Perk Icon */}
                                  <div className="relative text-5xl mb-4 text-center transform group-hover:scale-110 transition-transform duration-300">{perk.icon}</div>
                                  
                                  {/* Tier Badge */}
                                  <div className="relative flex items-center justify-between mb-4">
                                    <div className={`px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${tierInfo.color} text-white shadow-lg`}>
                                      {tierInfo.icon} {tierInfo.label}
                                    </div>
                                    <div className={`px-3 py-2 rounded-full text-xs font-medium ${getStatusColor(perk.status)} shadow-lg`}>
                                      {perk.status}
                                    </div>
                                  </div>
                                  
                                  {/* Perk Title */}
                                  <h4 className={`relative text-lg font-bold ${getTextColor(theme, 'primary')} mb-3 group-hover:text-purple-600 transition-colors duration-300`}>
                                    {perk.title}
                                  </h4>
                                  
                                  {/* Perk Description */}
                                  <p className={`${getTextColor(theme, 'secondary')} text-sm mb-4 leading-relaxed`}>
                                    {perk.description}
                                  </p>
                                  
                                  {/* Features List */}
                                  <div className="mb-4">
                                    <p className={`${getTextColor(theme, 'muted')} text-xs mb-2 font-semibold`}>INCLUDES:</p>
                                    <ul className="space-y-1">
                                      {perk.features.map((feature, idx) => (
                                        <li key={idx} className={`${getTextColor(theme, 'secondary')} text-xs flex items-center gap-2`}>
                                          <span className="text-green-400">✓</span>
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  {/* Perk Details */}
                                  <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                      <span className={getTextColor(theme, 'muted')}>Min Investment:</span>
                                      <span className={`${getTextColor(theme, 'primary')} font-semibold`}>{formatCurrency(perk.minAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className={getTextColor(theme, 'muted')}>Value:</span>
                                      <span className="text-green-400 font-semibold">{formatCurrency(perk.estimatedValue)}</span>
                                    </div>
                                    {perk.maxParticipants && (
                                      <div className="flex justify-between text-sm">
                                        <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Available:</span>
                                        <span className="text-blue-400 font-semibold">
                                          {perk.maxParticipants - perk.currentParticipants} left
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Progress Bar for Limited Perks */}
                                  {perk.maxParticipants && (
                                    <div className="mb-4">
                                      <div className={`flex justify-between text-xs mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <span>Filled</span>
                                        <span>{perk.currentParticipants}/{perk.maxParticipants}</span>
                                      </div>
                                      <div className={`w-full rounded-full h-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}>
                                        <div 
                                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${(perk.currentParticipants / perk.maxParticipants) * 100}%` }}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Action Button */}
                                  <button 
                                    onClick={() => {
                                      setActiveTab('invest');
                                      setInvestmentAmount(perk.minAmount);
                                    }}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                  >
                                    Get This Experience
                                  </button>
                                  
                                  {/* Hover Glow Effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>

                        {/* Experience Timeline */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-3xl p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-2xl font-bold ${getTextColor(theme, 'primary')} mb-6 flex items-center gap-3`}>
                            <Calendar className="w-6 h-6 text-indigo-400" />
                            Experience Timeline
                          </h3>
                          
                          <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500" />
                            
                            <div className="space-y-8">
                              {[
                                { month: 'Jan 2024', title: 'Investment Opens', description: 'Start your journey with exclusive early-bird perks', icon: '🚀' },
                                { month: 'Mar 2024', title: 'Community Voting', description: 'Participate in casting and creative decisions', icon: '🗳️' },
                                { month: 'Jun 2024', title: 'Set Visits Begin', description: 'VIP experiences and behind-the-scenes access', icon: '🎬' },
                                { month: 'Sep 2024', title: 'Private Screenings', description: 'Exclusive previews with cast and crew', icon: '🎭' },
                                { month: 'Dec 2024', title: 'Premiere & Credits', description: 'Red carpet premiere and official credits', icon: '👑' }
                              ].map((event, index) => (
                                <motion.div
                                  key={event.month}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative flex items-center gap-6"
                                >
                                  {/* Timeline Dot */}
                                  <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                                    {event.icon}
                                  </div>
                                  
                                  {/* Content */}
                                  <div className={`flex-1 ${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className={`text-lg font-bold ${getTextColor(theme, 'primary')}`}>{event.title}</h4>
                                      <span className="text-purple-400 font-semibold text-sm">{event.month}</span>
                                    </div>
                                    <p className={`${getTextColor(theme, 'secondary')} text-sm`}>{event.description}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'team' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Team & Cast */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                            Team & Cast
                          </h3>
                          {/* TMDB Cast Section */}
                          <div className="mb-6 md:mb-8">
                            <h4 className={`text-lg md:text-xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                              Main Cast
                              {tmdbLoading && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                            </h4>
                            {tmdbError && (
                              <div className="text-red-400 text-center py-4">
                                {tmdbError} - Showing fallback data
                              </div>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                              {/* TMDB Cast Members */}
                              {cast.length > 0 ? (
                                getMainCast(cast).map((member, index) => (
                                  <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative ${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-3 md:p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-blue-500/50' : 'border-gray-700/50 hover:border-blue-500/50'} transition-all duration-300 hover:scale-105`}
                                  >
                                    <div className="relative mb-3 md:mb-4">
                                      <img
                                        src={member.profile_path ? `https://image.tmdb.org/t/p/w185${member.profile_path}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                                        alt={member.name}
                                        className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-300"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
                                        }}
                                      />
                                      <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">⭐</span>
                                      </div>
                                    </div>
                                    <div className="text-center mb-2 md:mb-4">
                                      <h5 className={`text-base md:text-lg font-bold ${getTextColor(theme, 'primary')} mb-1 group-hover:text-blue-600 transition-colors duration-300`}>
                                        {member.name}
                                      </h5>
                                      <p className="text-blue-400 font-semibold text-xs md:text-sm">
                                        {member.known_for_department || 'Actor'}
                                      </p>
                                    </div>
                                    <div className="mb-2 md:mb-4">
                                      <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                        {member.known_for_department || 'Actor'}
                                      </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </motion.div>
                                ))
                              ) : (
                                // Fallback to original data
                                <></>
                              )}
                            </div>
                          </div>
                          {/* ...rest of team tab unchanged... */}
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'story' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Story & Plot */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                            <BookOpen className="w-6 h-6 text-teal-400" />
                            Story & Plot
                          </h3>
                          
                          {/* TMDB Story Overview */}
                          <div className="mb-6 md:mb-8">
                            <h4 className={`text-lg md:text-xl font-bold ${getTextColor(theme, 'primary')} mb-3 md:mb-4 flex items-center gap-3`}>
                              Synopsis
                              {tmdbLoading && <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />}
                            </h4>
                            {tmdbError && (
                              <div className="text-red-400 text-center py-4 mb-4 bg-red-500/10 rounded-lg">
                                {tmdbError} - Showing fallback data
                              </div>
                            )}
                            <p className={`${getTextColor(theme, 'secondary')} leading-relaxed text-base md:text-lg`}>
                              {movieDetails?.overview || (project as any).tmdbOverview || project.description || "Plot summary not available."}
                            </p>
                            {movieDetails?.tagline && (
                              <div className="mt-3 md:mt-4 p-3 md:p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                <p className="text-teal-300 font-semibold italic text-center text-sm md:text-base">
                                  "{movieDetails.tagline}"
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {/* TMDB Story Elements Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                                                          <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                                <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎭</div>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-1 md:mb-2 text-sm md:text-base`}>Genre</h5>
                                <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm`}>
                                {movieDetails?.genres?.map(g => g.name).join(', ') || (project as any).tmdbGenres?.join(', ') || project.genre || 'Not specified'}
                              </p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="text-3xl md:text-4xl mb-2 md:mb-3">⏱️</div>
                              <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-1 md:mb-2 text-sm md:text-base`}>Runtime</h5>
                              <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm`}>
                                {movieDetails?.runtime ? `${movieDetails.runtime} minutes` : (project as any).runtime ? `${(project as any).runtime} minutes` : 'Not specified'}
                              </p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="text-3xl md:text-4xl mb-2 md:mb-3">📅</div>
                              <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-1 md:mb-2 text-sm md:text-base`}>Release Date</h5>
                              <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm`}>
                                {movieDetails?.release_date ? new Date(movieDetails.release_date).toLocaleDateString() : (project as any).releaseYear ? `${(project as any).releaseYear}` : 'Not specified'}
                              </p>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                              <div className="text-3xl md:text-4xl mb-2 md:mb-3">⭐</div>
                              <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-1 md:mb-2 text-sm md:text-base`}>Rating</h5>
                              <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm`}>
                                {movieDetails?.vote_average ? `${movieDetails.vote_average}/10` : (project as any).tmdbRating ? `${(project as any).tmdbRating}/10` : 'Not rated'}
                              </p>
                            </div>
                          </div>
                          
                          {/* TMDB Character Profiles */}
                          <div className="mb-6 md:mb-8">
                            <h4 className={`text-lg md:text-xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-3`}>
                              Main Cast
                              {tmdbLoading && <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                              {cast.length > 0 ? (
                                getMainCast(cast).map((member, index) => (
                                <motion.div
                                    key={member.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-teal-500/50' : 'border-gray-700/50 hover:border-teal-500/50'} transition-all duration-300`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                      <img
                                        src={member.profile_path ? `https://image.tmdb.org/t/p/w92${member.profile_path}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=92&h=92&fit=crop&crop=face'}
                                        alt={member.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=92&h=92&fit=crop&crop=face';
                                        }}
                                      />
                                      <div>
                                        <h5 className={`text-lg font-bold ${getTextColor(theme, 'primary')}`}>{member.name}</h5>
                                        <p className="text-teal-400 text-sm">Actor</p>
                                      </div>
                                    </div>
                                  <div className="mb-4">
                                      <p className={`${getTextColor(theme, 'secondary')} text-xs mb-2`}>Known For:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {member.known_for?.slice(0, 2).map((movie) => (
                                          <span key={movie.id} className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">
                                            {movie.title}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                      <p className={`${getTextColor(theme, 'secondary')} text-xs mb-1`}>Popularity:</p>
                                      <p className={`${getTextColor(theme, 'primary')} text-sm font-semibold`}>{Math.round(member.popularity)}</p>
                                  </div>
                                </motion.div>
                                ))
                              ) : (
                                <div className="col-span-3 text-center py-8">
                                  <p className={`${getTextColor(theme, 'secondary')}`}>Cast information not available</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* TMDB Director's Vision */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold ${getTextColor(theme, 'primary')} mb-4 flex items-center gap-3`}>
                              Director
                              {tmdbLoading && <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />}
                            </h4>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                              {crew.length > 0 ? (
                                (() => {
                                  const director = crew.find(member => 
                                    member.known_for_department === 'Directing' || 
                                    member.known_for_department?.toLowerCase().includes('director')
                                  );
                                  return director ? (
                              <div className="flex items-start gap-4">
                                <img
                                        src={director.profile_path ? `https://image.tmdb.org/t/p/w185${director.profile_path}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'}
                                        alt={director.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face';
                                        }}
                                />
                                <div>
                                        <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-2`}>{director.name}</h5>
                                        <p className="text-teal-400 text-sm mb-3">Director</p>
                                                                          <p className={`${getTextColor(theme, 'secondary')} leading-relaxed`}>
                                          {director.known_for?.length > 0 
                                            ? `Known for directing ${director.known_for[0]?.title || 'various films'}.`
                                            : 'Esteemed director with a passion for storytelling.'
                                          }
                                        </p>
                                </div>
                              </div>
                                  ) : (
                                    <div className="text-center py-4">
                                      <p className={`${getTextColor(theme, 'secondary')}`}>Director information not available</p>
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="text-center py-4">
                                  <p className={`${getTextColor(theme, 'secondary')}`}>Director information not available</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* TMDB Production Information */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold ${getTextColor(theme, 'primary')} mb-4 flex items-center gap-3`}>
                              Production Information
                              {tmdbLoading && <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3`}>🎬 Production Companies</h5>
                                <p className={`${getTextColor(theme, 'secondary')} text-sm leading-relaxed`}>
                                  {movieDetails?.production_companies && movieDetails.production_companies.length > 0 
                                    ? movieDetails.production_companies.map(company => company.name).join(', ')
                                    : project.productionHouse || 'Not specified'
                                  }
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3`}>🌍 Country of Origin</h5>
                                <p className={`${getTextColor(theme, 'secondary')} text-sm leading-relaxed`}>
                                  {movieDetails?.production_companies?.[0]?.origin_country || (project as any).country || 'Not specified'}
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3`}>🗣️ Spoken Languages</h5>
                                <p className={`${getTextColor(theme, 'secondary')} text-sm leading-relaxed`}>
                                  {(project as any).spokenLanguages?.join(', ') || project.language || 'Not specified'}
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3`}>📊 Popularity Score</h5>
                                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  {movieDetails?.popularity ? Math.round(movieDetails.popularity) : 'Not available'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Background Score Preview */}
                          <div>
                            <h4 className={`text-xl font-bold mb-4 ${getTextColor(theme, 'primary')}`}>Background Score Preview</h4>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h5 className={`${getTextColor(theme, 'primary')} font-bold`}>"Dreams Never Die"</h5>
                                  <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Composed by Pritam</p>
                                </div>
                                <button className="p-3 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300">
                                  <Play className="w-6 h-6 text-white" />
                                </button>
                              </div>
                              <div className={`w-full rounded-full h-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}>
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full w-1/3"></div>
                              </div>
                              <div className={`flex justify-between mt-2 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                <span>1:23</span>
                                <span>4:15</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'gallery' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Gallery */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-lg md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-2 md:gap-3`}>
                            <Camera className="w-4 h-4 md:w-6 md:h-6 text-violet-400" />
                            Gallery
                          </h3>
                          
                          {/* Gallery Categories */}
                          <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-8">
                            {['All', 'Posters', 'Behind the Scenes', 'Concept Art', 'Location Shots'].map((category) => (
                              <button
                                key={category}
                                className={`px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-full ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-violet-100 hover:text-violet-700 border-gray-300 hover:border-violet-400' : 'bg-gray-700/50 text-gray-300 hover:bg-violet-500/20 hover:text-violet-300 border-gray-600/50 hover:border-violet-500/50'} border transition-all duration-300`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                          
                          {/* Main Gallery Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {[
                              {
                                title: 'Official Movie Poster',
                                category: 'Posters',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=600&fit=crop',
                                description: 'The stunning official poster featuring our lead cast'
                              },
                              {
                                title: 'Behind the Scenes - Director',
                                category: 'Behind the Scenes',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=300&fit=crop',
                                description: 'Rajkumar Hirani directing a crucial scene'
                              },
                              {
                                title: 'Cinema Hall Concept',
                                category: 'Concept Art',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=300&fit=crop',
                                description: 'Early concept art of the abandoned cinema hall'
                              },
                              {
                                title: 'Mumbai Streets',
                                category: 'Location Shots',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=300&fit=crop',
                                description: 'The vibrant streets of Mumbai where our story unfolds'
                              },
                              {
                                title: 'Character Posters',
                                category: 'Posters',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=600&fit=crop',
                                description: 'Individual character posters for Arjun, Priya, and Rahul'
                              },
                              {
                                title: 'Set Construction',
                                category: 'Behind the Scenes',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=300&fit=crop',
                                description: 'The massive set being constructed for the climax scene'
                              }
                            ].map((item, index) => (
                              <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative ${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl overflow-hidden border ${theme === 'light' ? 'border-gray-300 hover:border-violet-500/50' : 'border-gray-700/50 hover:border-violet-500/50'} transition-all duration-300 hover:scale-105`}
                              >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  
                                  {/* Category Badge */}
                                  <div className="absolute top-2 left-2 md:top-3 md:left-3">
                                    <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-violet-500/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                                      {item.category}
                                    </span>
                                  </div>
                                  
                                  {/* Zoom Icon */}
                                  <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="p-1.5 md:p-2 bg-black/50 rounded-full backdrop-blur-sm">
                                      <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-3 md:p-4">
                                  <h4 className={`${getTextColor(theme, 'primary')} font-bold mb-1 md:mb-2 text-sm md:text-base group-hover:text-violet-600 transition-colors duration-300`}>
                                    {item.title}
                                  </h4>
                                  <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm leading-relaxed`}>
                                    {item.description}
                                  </p>
                                </div>
                                
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Gallery Navigation */}
                          <div className="flex items-center justify-center gap-3 md:gap-4 mt-6 md:mt-8">
                            <button className="group relative p-2 md:p-3 rounded-full bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-500/50 text-gray-300 hover:from-violet-500/30 hover:via-purple-500/30 hover:to-pink-500/30 hover:text-violet-300 border border-gray-600/50 hover:border-violet-500/50 transition-all duration-500 overflow-hidden">
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 via-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <ChevronLeft className="relative w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            </button>
                            <div className="flex gap-1.5 md:gap-2">
                              {[1, 2, 3].map((page) => (
                                <button
                                  key={page}
                                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                                    page === 1 ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-lg shadow-violet-500/50' : 'bg-gray-600 hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-400'
                                  }`}
                                />
                              ))}
                            </div>
                            <button className="group relative p-2 md:p-3 rounded-full bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-500/50 text-gray-300 hover:from-violet-500/30 hover:via-purple-500/30 hover:to-pink-500/30 hover:text-violet-300 border border-gray-600/50 hover:border-violet-500/50 transition-all duration-500 overflow-hidden">
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/10 via-purple-400/10 to-pink-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <ChevronRight className="relative w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'updates' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Updates & News */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-lg md:text-2xl font-bold ${getTextColor(theme, 'primary')} mb-4 md:mb-6 flex items-center gap-2 md:gap-3`}>
                            <MessageCircle className="w-4 h-4 md:w-6 md:h-6 text-amber-400" />
                            Updates & News
                          </h3>
                          
                          {/* Search Updates */}
                          <div className="mb-4 md:mb-6">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search updates..."
                                value={updateSearchQuery}
                                onChange={(e) => setUpdateSearchQuery(e.target.value)}
                                className={`w-full px-4 py-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm md:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500' : 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-amber-500/50'}`}
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                              {updateSearchQuery && (
                                <button
                                  onClick={() => setUpdateSearchQuery('')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Enhanced Update Categories with Counts */}
                          <div className="mb-4 md:mb-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className={`text-base md:text-lg font-semibold ${getTextColor(theme, 'primary')}`}>Filter Updates</h4>
                              <button 
                                onClick={() => {
                                  setSelectedUpdateFilter('All');
                                  setUpdateSearchQuery('');
                                }}
                                className={`text-xs md:text-sm ${selectedUpdateFilter === 'All' && !updateSearchQuery ? 'text-amber-500' : 'text-gray-500'} hover:text-amber-400 transition-colors`}
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                              {[
                                { name: 'All', count: 12, icon: '📰' },
                                { name: 'Cast', count: 4, icon: '🎭' },
                                { name: 'Location', count: 3, icon: '📍' },
                                { name: 'Trailer', count: 2, icon: '🎬' },
                                { name: 'Shooting', count: 2, icon: '🎥' },
                                { name: 'Music', count: 2, icon: '🎵' },
                                { name: 'Post-Production', count: 1, icon: '✂️' },
                                { name: 'Behind Scenes', count: 3, icon: '🎪' },
                                { name: 'Press', count: 2, icon: '📢' }
                              ].map((category) => (
                                <button
                                  key={category.name}
                                  onClick={() => setSelectedUpdateFilter(category.name)}
                                  className={`group relative px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-full transition-all duration-300 ${
                                    selectedUpdateFilter === category.name
                                      ? `${theme === 'light' ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-500 text-white border-amber-500'} shadow-lg`
                                      : `${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700 border-gray-300 hover:border-amber-400' : 'bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-500/50 text-gray-300 hover:from-amber-500/30 hover:via-yellow-500/30 hover:to-orange-500/30 hover:text-amber-300 border-gray-600/50 hover:border-amber-500/50'}`
                                  } border overflow-hidden`}
                                >
                                  {/* Gradient overlay */}
                                  <div className={`absolute inset-0 ${theme === 'light' ? 'bg-amber-200/20' : 'bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-orange-400/10'} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                  <span className="relative flex items-center gap-1.5 md:gap-2">
                                    <span>{category.icon}</span>
                                    <span>{category.name}</span>
                                    <span className={`${selectedUpdateFilter === category.name ? 'bg-white/20 text-white' : theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-300'} text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full`}>
                                      {category.count}
                                    </span>
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Enhanced Updates Timeline with Real Data */}
                          <div className="space-y-4 md:space-y-6">
                            {(() => {
                              const allUpdates = [
                              {
                                date: '2024-01-15',
                                title: '🎬 Principal Photography Begins!',
                                category: 'Shooting',
                                content: 'The cameras are rolling! Principal photography for "' + project.title + '" has officially begun at the iconic Marine Drive in Mumbai. The first scene featuring our lead cast was shot today, and the energy on set is electric!',
                                author: 'Production Team',
                                authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: true,
                                isVerified: true,
                                reactions: { likes: 234, comments: 45, shares: 12, views: 1200 },
                                tags: ['Behind Scenes', 'Production', 'Mumbai'],
                                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                              },
                              {
                                date: '2024-01-12',
                                title: '🎭 Lead Cast Confirmed!',
                                category: 'Cast',
                                content: 'Breaking news! Our lead cast has been officially confirmed. ' + (cast.length > 0 ? `Starring ${cast[0]?.name || 'our lead actor'} and ${cast.find(c => c.gender === 1)?.name || 'our lead actress'}` : 'Starring our talented lead actors') + ' in the main roles. The chemistry between our leads is going to be absolutely magical!',
                                author: 'Casting Director',
                                authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                                image: cast.length > 0 && cast[0]?.profile_path ? `https://image.tmdb.org/t/p/w400${cast[0].profile_path}` : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=250&fit=crop',
                                isPinned: false,
                                isVerified: true,
                                reactions: { likes: 567, comments: 89, shares: 34, views: 2100 },
                                tags: ['Casting', 'Lead Roles', 'Breaking News'],
                                castMembers: cast.slice(0, 3)
                              },
                              {
                                date: '2024-01-10',
                                title: '🎵 Music Recording Begins',
                                category: 'Music',
                                content: 'The musical journey begins! Our music director has started recording the background score and songs for "' + project.title + '". The first song is already creating waves in the recording studio.',
                                author: 'Music Team',
                                authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
                                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
                                isPinned: false,
                                isVerified: false,
                                reactions: { likes: 189, comments: 23, shares: 8, views: 890 },
                                tags: ['Music', 'Recording', 'Studio'],
                                audioPreview: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
                              },
                              {
                                date: '2024-01-08',
                                title: '📍 Mumbai Film City Location Confirmed',
                                category: 'Location',
                                content: 'Major location update! We\'ve secured exclusive access to Mumbai Film City for the climax sequences. The abandoned cinema hall set is being constructed and will be ready for shooting by next week.',
                                author: 'Location Manager',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: false,
                                reactions: { likes: 145, comments: 18, shares: 6 }
                              },
                              {
                                date: '2024-01-05',
                                title: '🎬 R. Madhavan Joins the Cast!',
                                category: 'Cast',
                                content: 'Exciting news! R. Madhavan has been confirmed to play Rahul, the practical businessman who discovers his artistic side. His role will add the perfect balance to our trio of lead characters.',
                                author: 'Casting Team',
                                image: null,
                                isPinned: false,
                                reactions: { likes: 298, comments: 42, shares: 15 }
                              },
                              {
                                date: '2024-01-03',
                                title: '🎥 First Look Teaser Released!',
                                category: 'Trailer',
                                content: 'The wait is over! Check out our first look teaser featuring glimpses of the abandoned cinema hall and our lead characters. The response has been overwhelming with over 1M views in just 24 hours!',
                                author: 'Marketing Team',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: false,
                                reactions: { likes: 892, comments: 156, shares: 67 }
                              },
                              {
                                date: '2023-12-28',
                                title: '🎬 Supporting Cast Announced',
                                category: 'Cast',
                                content: 'Meet our incredible supporting cast! Pankaj Tripathi, Tabu, and Nawazuddin Siddiqui will be playing pivotal roles. Each character brings depth and authenticity to our story.',
                                author: 'Casting Director',
                                image: null,
                                isPinned: false,
                                reactions: { likes: 423, comments: 67, shares: 23 }
                              },
                              {
                                date: '2023-12-25',
                                title: '🎭 Script Reading Session',
                                category: 'Pre-production',
                                content: 'The entire cast came together for the first script reading session. The chemistry between Aamir, Deepika, and Madhavan is absolutely perfect! Rajkumar Hirani was thrilled with the energy.',
                                author: 'Production Team',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: false,
                                reactions: { likes: 234, comments: 34, shares: 12 }
                              },
                              {
                                date: '2023-12-20',
                                title: '🎵 Background Score Recording',
                                category: 'Music',
                                content: 'Pritam has started recording the emotional background score. The music perfectly captures the essence of friendship, dreams, and the magic of cinema. It\'s going to be a musical masterpiece!',
                                author: 'Music Team',
                                image: null,
                                isPinned: false,
                                reactions: { likes: 167, comments: 28, shares: 9 }
                              },
                              {
                                date: '2023-12-18',
                                title: '📍 Goa Location Scouting Complete',
                                category: 'Location',
                                content: 'Our location scouting team has finalized the beautiful Goa sequences. The picturesque beaches and old Portuguese architecture will provide the perfect backdrop for the emotional scenes.',
                                author: 'Location Manager',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: false,
                                reactions: { likes: 134, comments: 19, shares: 7 }
                              }
                            ];
                            
                            // Filter updates based on selected category and search query
                            let filteredUpdates = selectedUpdateFilter === 'All' 
                              ? allUpdates 
                              : allUpdates.filter(update => update.category === selectedUpdateFilter);
                            
                            // Apply search filter if query exists
                            if (updateSearchQuery.trim()) {
                              const searchLower = updateSearchQuery.toLowerCase();
                              filteredUpdates = filteredUpdates.filter(update => 
                                update.title.toLowerCase().includes(searchLower) ||
                                update.content.toLowerCase().includes(searchLower) ||
                                update.author.toLowerCase().includes(searchLower) ||
                                update.category.toLowerCase().includes(searchLower) ||
                                (update.tags && update.tags.some(tag => tag.toLowerCase().includes(searchLower)))
                              );
                            }
                            
                            return (
                              <>
                                {/* Results Counter */}
                                <div className="flex items-center justify-between mb-4">
                                  <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {filteredUpdates.length} update{filteredUpdates.length !== 1 ? 's' : ''} found
                                    {selectedUpdateFilter !== 'All' && ` in ${selectedUpdateFilter}`}
                                    {updateSearchQuery && ` for "${updateSearchQuery}"`}
                                  </span>
                                  {(selectedUpdateFilter !== 'All' || updateSearchQuery) && (
                                    <button 
                                      onClick={() => {
                                        setSelectedUpdateFilter('All');
                                        setUpdateSearchQuery('');
                                      }}
                                      className={`text-xs ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'} hover:text-amber-500 transition-colors`}
                                    >
                                      Clear Filters
                                    </button>
                                  )}
                                </div>
                                
                                {/* No Results Message */}
                                {filteredUpdates.length === 0 && (
                                  <div className={`text-center py-8 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/30'} rounded-xl`}>
                                    <div className="text-4xl mb-3">📭</div>
                                    <h4 className={`text-lg font-semibold mb-2 ${getTextColor(theme, 'primary')}`}>No updates found</h4>
                                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                      {updateSearchQuery 
                                        ? `No updates found for "${updateSearchQuery}"${selectedUpdateFilter !== 'All' ? ` in ${selectedUpdateFilter}` : ''}. Try different keywords or categories.`
                                        : `No updates available for "${selectedUpdateFilter}". Try selecting a different category.`
                                      }
                                    </p>
                                    <button 
                                      onClick={() => {
                                        setSelectedUpdateFilter('All');
                                        setUpdateSearchQuery('');
                                      }}
                                      className={`mt-3 px-4 py-2 text-sm ${theme === 'light' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'} rounded-lg transition-colors`}
                                    >
                                      Show All Updates
                                    </button>
                                  </div>
                                )}
                                
                                {/* Filtered Updates */}
                                {filteredUpdates.map((update, index) => (
                              <motion.div
                                key={update.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative ${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-4 md:p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-amber-500/50' : 'border-gray-700/50 hover:border-amber-500/50'} transition-all duration-300 ${
                                  update.isPinned ? 'ring-2 ring-amber-500/30' : ''
                                }`}
                              >
                                {update.isPinned && (
                                  <div className={`absolute -top-2 -right-2 px-2 py-0.5 md:px-3 md:py-1 ${theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white'} text-xs font-bold rounded-full`}>
                                    PINNED
                                  </div>
                                )}
                                
                                <div className="flex gap-3 md:gap-6">
                                  {/* Enhanced Image with Video/Audio Indicators */}
                                  {update.image && (
                                    <div className="flex-shrink-0 relative">
                                      <img
                                        src={update.image}
                                        alt={update.title}
                                        className="w-20 h-16 md:w-40 md:h-28 rounded-lg md:rounded-xl object-cover"
                                      />
                                      {update.videoUrl && (
                                        <div className="absolute inset-0 bg-black/50 rounded-lg md:rounded-xl flex items-center justify-center">
                                          <Play className="w-3 h-3 md:w-8 md:h-8 text-white" />
                                        </div>
                                      )}
                                      {update.audioPreview && (
                                        <div className={`absolute top-1 right-1 md:top-2 md:right-2 ${theme === 'light' ? 'bg-amber-500 text-white' : 'bg-amber-500 text-white'} text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full`}>
                                          🎵
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Enhanced Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                      <span className={`px-2 py-0.5 md:px-3 md:py-1 ${theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/20 text-amber-300'} text-xs font-semibold rounded-full`}>
                                        {update.category}
                                      </span>
                                      {update.isVerified && (
                                        <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                          ✓ Verified
                                        </span>
                                      )}
                                      <span className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {new Date(update.date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    
                                    <h4 className={`text-base md:text-lg font-bold ${getTextColor(theme, 'primary')} mb-1 md:mb-2 hover:text-amber-600 transition-colors duration-300`}>
                                      {update.title}
                                    </h4>
                                    
                                    <p className={`${getTextColor(theme, 'secondary')} text-xs md:text-sm leading-relaxed mb-3 md:mb-4`}>
                                      {update.content}
                                    </p>
                                    
                                    {/* Enhanced Tags */}
                                    {update.tags && (
                                      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                                        {update.tags.map((tag) => (
                                          <span key={tag} className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full ${theme === 'light' ? 'bg-gray-200 text-gray-700' : 'bg-gray-700/50 text-gray-300'}`}>
                                            #{tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* Cast Members Preview */}
                                    {update.castMembers && update.castMembers.length > 0 && (
                                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                                        <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Cast:</span>
                                        <div className="flex -space-x-1 md:-space-x-2">
                                          {update.castMembers.map((member) => (
                                            <img
                                              key={member.id}
                                              src={member.profile_path ? `https://image.tmdb.org/t/p/w32${member.profile_path}` : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'}
                                              alt={member.name}
                                              className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-gray-700"
                                              title={member.name}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {/* Enhanced Reactions */}
                                    <div className="flex items-center gap-4 md:gap-6 mb-3 md:mb-4">
                                      <div className={`flex items-center gap-3 md:gap-4 text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <span className="flex items-center gap-1 hover:text-amber-400 cursor-pointer transition-colors">
                                          <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                                          {update.reactions.likes}
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-amber-400 cursor-pointer transition-colors">
                                          <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                                          {update.reactions.comments}
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-amber-400 cursor-pointer transition-colors">
                                          <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                                          {update.reactions.shares}
                                        </span>
                                        <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                          {update.reactions.views}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {/* Enhanced Author Info */}
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                      <div className="flex items-center gap-2 md:gap-3">
                                        {update.authorAvatar && (
                                          <img
                                            src={update.authorAvatar}
                                            alt={update.author}
                                            className="w-5 h-5 md:w-6 md:h-6 rounded-full"
                                          />
                                        )}
                                        <span className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                                          By {update.author}
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {update.videoUrl && (
                                          <button className="px-2 py-1 md:px-3 md:py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors duration-300 text-xs font-semibold">
                                            Watch
                                          </button>
                                        )}
                                        {update.audioPreview && (
                                          <button className="px-2 py-1 md:px-3 md:py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-300 text-xs font-semibold">
                                            Listen
                                          </button>
                                        )}
                                        <button className={`px-3 py-1.5 md:px-4 md:py-2 ${theme === 'light' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'} rounded-lg transition-colors duration-300 text-xs md:text-sm font-semibold`}>
                                          Read More
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                                ))}
                              </>
                            );
                            })()}
                          </div>
                          
                          {/* Real-time Updates Feed */}
                          <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-500/20">
                            <h4 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 flex items-center gap-2 md:gap-3 ${getTextColor(theme, 'primary')}`}>
                              📡 Real-time Updates
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            </h4>
                            <div className="space-y-2 md:space-y-3">
                              {[
                                { time: '2 min ago', text: 'Location scouting completed for final scenes', type: 'location' },
                                { time: '5 min ago', text: 'Music recording session wrapped up', type: 'music' },
                                { time: '12 min ago', text: 'Press conference scheduled for tomorrow', type: 'press' },
                                { time: '25 min ago', text: 'Behind-the-scenes photos uploaded', type: 'media' }
                              ].map((update, idx) => (
                                <div key={idx} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
                                  <span className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{update.time}</span>
                                  <span className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{update.text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Press Coverage */}
                          <div className="mt-6 md:mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/20">
                            <h4 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${getTextColor(theme, 'primary')}`}>📰 Press Coverage</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                              {[
                                { source: 'Filmfare', title: 'Exclusive: Behind the scenes of ' + project.title, date: '2024-01-14' },
                                { source: 'Times of India', title: 'Breaking: Cast announcement creates buzz', date: '2024-01-12' },
                                { source: 'Hindustan Times', title: 'Director reveals shooting locations', date: '2024-01-10' },
                                { source: 'DNA India', title: 'Music director shares recording insights', date: '2024-01-08' }
                              ].map((article, idx) => (
                                <div key={idx} className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-lg md:rounded-xl p-3 md:p-4 border ${theme === 'light' ? 'border-gray-300 hover:border-purple-500/50' : 'border-gray-700/50 hover:border-purple-500/50'} transition-all duration-300`}>
                                  <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                                    <span className="text-purple-400 font-semibold text-xs md:text-sm">{article.source}</span>
                                    <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>{new Date(article.date).toLocaleDateString()}</span>
                                  </div>
                                  <h5 className={`text-xs md:text-sm font-semibold mb-1.5 md:mb-2 ${getTextColor(theme, 'primary')}`}>{article.title}</h5>
                                  <button className="text-purple-400 text-xs hover:text-purple-300 transition-colors">
                                    Read Article →
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Enhanced Newsletter Signup */}
                          <div className={`mt-6 md:mt-8 ${theme === 'light' ? 'bg-amber-50 border-amber-200' : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20'} rounded-xl md:rounded-2xl p-4 md:p-6 border`}>
                            <h4 className={`text-lg md:text-xl font-bold ${getTextColor(theme, 'primary')} mb-3 md:mb-4`}>Stay Updated</h4>
                            <p className={`${getTextColor(theme, 'secondary')} mb-3 md:mb-4 text-sm md:text-base`}>
                              Get exclusive behind-the-scenes updates, cast announcements, location reveals, and production news delivered to your inbox.
                            </p>
                            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                              <input
                                type="email"
                                placeholder="Enter your email address"
                                className={`flex-1 px-3 py-2 md:px-4 md:py-3 text-sm md:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-200' : 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20'} border rounded-lg md:rounded-xl focus:outline-none`}
                              />
                              <button className="px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg md:rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-sm md:text-base">
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'community' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Community */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 ${getTextColor(theme, 'primary')}`}>
                            <Users className="w-4 h-4 md:w-6 md:h-6 text-lime-400" />
                            Community
                          </h3>
                          
                          {/* Community Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-3 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 ${getTextColor(theme, 'primary')}`}>1,247</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Investors</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-3 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 ${getTextColor(theme, 'primary')}`}>89</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Discussions</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-3 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 ${getTextColor(theme, 'primary')}`}>156</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Questions</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-3 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className={`text-xl md:text-3xl font-bold mb-1 md:mb-2 ${getTextColor(theme, 'primary')}`}>4.8</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Community Rating</div>
                            </div>
                          </div>
                          
                          {/* Ask a Question */}
                          <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-xl md:rounded-2xl p-4 md:p-6 border border-lime-500/20 mb-6 md:mb-8">
                            <h4 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${getTextColor(theme, 'primary')}`}>Ask the Director</h4>
                            <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              Have a question for Rajkumar Hirani or the production team? Ask here and get direct responses!
                            </p>
                            <div className="space-y-3 md:space-y-4">
                              <input
                                type="text"
                                placeholder="Your question..."
                                className={`w-full px-3 py-2 md:px-4 md:py-3 text-sm md:text-base rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/20 ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-lime-500' : 'bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-lime-500/50'}`}
                              />
                              <button className="w-full md:w-auto px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-lg md:rounded-xl font-semibold hover:from-lime-600 hover:to-green-600 transition-all duration-300 text-sm md:text-base">
                                Submit Question
                              </button>
                            </div>
                          </div>
                          
                          {/* Recent Discussions */}
                          <div className="mb-6 md:mb-8">
                            <h4 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${getTextColor(theme, 'primary')}`}>Recent Discussions</h4>
                            <div className="space-y-3 md:space-y-4">
                              {[
                                {
                                  title: 'What inspired the story of The Dream Chasers?',
                                  author: 'Rajkumar Hirani',
                                  replies: 23,
                                  views: 156,
                                  isAnswered: true,
                                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
                                },
                                {
                                  title: 'Will there be a sequel to this film?',
                                  author: 'Investor_123',
                                  replies: 8,
                                  views: 89,
                                  isAnswered: false,
                                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
                                },
                                {
                                  title: 'How can we get involved in the production process?',
                                  author: 'FilmLover_456',
                                  replies: 15,
                                  views: 234,
                                  isAnswered: true,
                                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
                                }
                              ].map((discussion, index) => (
                                <motion.div
                                  key={discussion.title}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-lg md:rounded-xl p-3 md:p-4 border ${theme === 'light' ? 'border-gray-300 hover:border-lime-500/50' : 'border-gray-700/50 hover:border-lime-500/50'} transition-all duration-300`}
                                >
                                  <div className="flex items-start gap-3 md:gap-4">
                                    <img
                                      src={discussion.avatar}
                                      alt={discussion.author}
                                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start gap-2 mb-1.5 md:mb-2">
                                        <h5 className={`${getTextColor(theme, 'primary')} font-semibold hover:text-lime-400 transition-colors duration-300 text-sm md:text-base break-words`}>
                                          {discussion.title}
                                        </h5>
                                        {discussion.isAnswered && (
                                          <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full flex-shrink-0 ${theme === 'light' ? 'bg-green-500/20 text-green-700' : 'bg-green-500/20 text-green-300'}`}>
                                            Answered
                                          </span>
                                        )}
                                      </div>
                                      <div className={`flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <span>By {discussion.author}</span>
                                        <span>{discussion.replies} replies</span>
                                        <span>{discussion.views} views</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Community Poll */}
                          <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl md:rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)}`}>
                            <h4 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${getTextColor(theme, 'primary')}`}>Community Poll</h4>
                            <p className={`mb-4 md:mb-6 text-sm md:text-base ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Which aspect of the film are you most excited about?</p>
                            <div className="space-y-2.5 md:space-y-3">
                              {[
                                { option: 'The star-studded cast', votes: 45, percentage: 45 },
                                { option: 'Rajkumar Hirani\'s direction', votes: 32, percentage: 32 },
                                { option: 'The unique storyline', votes: 18, percentage: 18 },
                                { option: 'The music by Pritam', votes: 5, percentage: 5 }
                              ].map((poll, index) => (
                                <div key={poll.option} className="relative">
                                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                                    <span className={`text-xs md:text-sm ${getTextColor(theme, 'primary')} break-words pr-2`}>{poll.option}</span>
                                    <span className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} flex-shrink-0`}>{poll.percentage}%</span>
                                  </div>
                                  <div className={`w-full rounded-full h-1.5 md:h-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${poll.percentage}%` }}
                                      transition={{ delay: index * 0.1, duration: 1 }}
                                      className="bg-gradient-to-r from-lime-500 to-green-500 h-1.5 md:h-2 rounded-full"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 md:mt-4 text-center">
                              <span className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>100 total votes</span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                      <div className="space-y-8">
                        {/* Reviews */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-3xl p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${getTextColor(theme, 'primary')}`}>
                            <Star className="w-6 h-6 text-rose-400" />
                            Reviews & Testimonials
                          </h3>
                          
                          {/* Overall Rating */}
                          <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)} mb-8`}>
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <div className={`text-4xl font-bold mb-2 ${getTextColor(theme, 'primary')}`}>4.8</div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Based on 1,247 investor reviews</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-rose-400 mb-2">98%</div>
                                <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Would recommend</div>
                              </div>
                            </div>
                            
                            {/* Rating Breakdown */}
                            <div className="space-y-2">
                              {[
                                { stars: 5, count: 892, percentage: 72 },
                                { stars: 4, count: 234, percentage: 19 },
                                { stars: 3, count: 89, percentage: 7 },
                                { stars: 2, count: 23, percentage: 2 },
                                { stars: 1, count: 9, percentage: 1 }
                              ].map((rating) => (
                                <div key={rating.stars} className="flex items-center gap-3">
                                  <div className="flex items-center gap-1 w-16">
                                    <span className={`text-sm ${getTextColor(theme, 'primary')}`}>{rating.stars}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  </div>
                                  <div className={`flex-1 rounded-full h-2 ${theme === 'light' ? 'bg-gray-300' : 'bg-gray-700'}`}>
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${rating.percentage}%` }}
                                      transition={{ delay: rating.stars * 0.1, duration: 1 }}
                                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                                    />
                                  </div>
                                  <span className={`text-sm w-12 text-right ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{rating.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Featured Reviews */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold mb-6 ${getTextColor(theme, 'primary')}`}>Featured Reviews</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {[
                                {
                                  name: 'Priya Sharma',
                                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face',
                                  rating: 5,
                                  investment: '₹50,000',
                                  review: 'This is exactly the kind of project I was looking to invest in. The team is incredibly transparent, and Rajkumar Hirani\'s track record speaks for itself. The story is heartwarming and has the potential to be a massive hit.',
                                  date: '2024-01-10',
                                  verified: true
                                },
                                {
                                  name: 'Rajesh Kumar',
                                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&h=60&fit=crop&crop=face',
                                  rating: 5,
                                  investment: '₹25,000',
                                  review: 'As a film enthusiast, I\'m thrilled to be part of this project. The communication from the team has been excellent, and I love how they keep investors updated with behind-the-scenes content.',
                                  date: '2024-01-08',
                                  verified: true
                                },
                                {
                                  name: 'Anjali Patel',
                                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
                                  rating: 4,
                                  investment: '₹75,000',
                                  review: 'Great investment opportunity! The perks are amazing, especially the VIP set visit. The team is professional and the project has strong commercial potential.',
                                  date: '2024-01-05',
                                  verified: true
                                },
                                {
                                  name: 'Vikram Singh',
                                  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
                                  rating: 5,
                                  investment: '₹1,00,000',
                                  review: 'This is my third investment in entertainment projects, and this one stands out for its transparency and community engagement. Highly recommended!',
                                  date: '2024-01-03',
                                  verified: true
                                }
                              ].map((review, index) => (
                                <motion.div
                                  key={review.name}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${theme === 'light' ? 'border-gray-300 hover:border-rose-500/50' : 'border-gray-700/50 hover:border-rose-500/50'} transition-all duration-300`}
                                >
                                  <div className="flex items-start gap-4 mb-4">
                                    <img
                                      src={review.avatar}
                                      alt={review.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className={`${getTextColor(theme, 'primary')} font-semibold`}>{review.name}</h5>
                                        {review.verified && (
                                          <span className={`px-2 py-1 text-xs rounded-full ${theme === 'light' ? 'bg-blue-500/20 text-blue-700' : 'bg-blue-500/20 text-blue-300'}`}>
                                            Verified Investor
                                          </span>
                                        )}
                                      </div>
                                      <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <div className="flex items-center gap-1">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                              key={star}
                                              className={`w-4 h-4 ${
                                                star <= review.rating
                                                  ? 'fill-yellow-400 text-yellow-400'
                                                  : 'text-gray-600'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span>Invested {review.investment}</span>
                                        <span>{new Date(review.date).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    "{review.review}"
                                  </p>
                                  
                                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700/50">
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors duration-300">
                                      <ThumbsUp className="w-4 h-4" />
                                      <span className="text-sm">Helpful</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors duration-300">
                                      <MessageSquare className="w-4 h-4" />
                                      <span className="text-sm">Reply</span>
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Review Tags */}
                          <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                            <h4 className={`text-xl font-bold mb-4 ${getTextColor(theme, 'primary')}`}>What Investors Are Saying</h4>
                            <div className="flex flex-wrap gap-3">
                              {[
                                { tag: 'Transparent Communication', count: 234, color: 'green' },
                                { tag: 'Great Team', count: 189, color: 'blue' },
                                { tag: 'Strong Potential', count: 156, color: 'purple' },
                                { tag: 'Amazing Perks', count: 123, color: 'yellow' },
                                { tag: 'Professional', count: 98, color: 'cyan' },
                                { tag: 'Worth Investing', count: 87, color: 'rose' }
                              ].map((tag) => (
                                <div
                                  key={tag.tag}
                                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                    theme === 'light' 
                                      ? `bg-${tag.color}-100 text-${tag.color}-700 border border-${tag.color}-200`
                                      : `bg-${tag.color}-500/20 text-${tag.color}-300`
                                  }`}
                                >
                                  {tag.tag} ({tag.count})
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'faqs' && (
                      <div className="space-y-8">
                        {/* FAQs */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-3xl p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${getTextColor(theme, 'primary')}`}>
                            <HelpCircle className="w-6 h-6 text-sky-400" />
                            Frequently Asked Questions
                          </h3>
                          
                          {/* FAQ Categories */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {['All', 'Investment', 'Project', 'Legal', 'Perks'].map((category) => (
                              <button
                                key={category}
                                className={`px-4 py-2 rounded-full border transition-all duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-sky-100 hover:text-sky-700 border-gray-300 hover:border-sky-400' : 'bg-gray-700/50 text-gray-300 hover:bg-sky-500/20 hover:text-sky-300 border-gray-600/50 hover:border-sky-500/50'}`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                          
                          {/* FAQ Items */}
                          <div className="space-y-4">
                            {[
                              {
                                question: 'How does the investment process work?',
                                answer: 'The investment process is simple and transparent. You can invest any amount starting from ₹5,000. Once you make an investment, you\'ll receive digital certificates and access to exclusive perks based on your investment tier. All investments are secured and managed through our regulated platform.',
                                category: 'Investment'
                              },
                              {
                                question: 'What are the expected returns on this investment?',
                                answer: 'Returns depend on the film\'s box office performance and other revenue streams. Based on similar projects and market analysis, we project potential returns of 20-40% over 18-24 months. However, all investments carry risk, and returns are not guaranteed.',
                                category: 'Investment'
                              },
                              {
                                question: 'When will the film be released?',
                                answer: 'We are targeting a Q4 2024 release. The production schedule is on track, and we\'ll keep all investors updated with regular progress reports and behind-the-scenes content.',
                                category: 'Project'
                              },
                              {
                                question: 'Can I visit the film set?',
                                answer: 'Yes! Investors at the Producer tier (₹75,000+) get exclusive VIP set visit passes. These visits are scheduled during production and include interactions with the cast and crew. We\'ll notify eligible investors when visits are available.',
                                category: 'Perks'
                              },
                              {
                                question: 'What happens if the film doesn\'t meet its funding goal?',
                                answer: 'If the project doesn\'t reach its funding goal, all investments are fully refunded. We only proceed with production when we have sufficient funding to ensure the highest quality output.',
                                category: 'Investment'
                              },
                              {
                                question: 'How do I receive my investment returns?',
                                answer: 'Returns are distributed through our secure platform. You\'ll receive notifications when returns are available, and funds will be transferred to your registered bank account or digital wallet.',
                                category: 'Investment'
                              },
                              {
                                question: 'What legal protections do investors have?',
                                answer: 'All investments are protected by comprehensive legal agreements. We work with top-tier legal firms to ensure investor rights are protected. All contracts are transparent and available for review.',
                                category: 'Legal'
                              },
                              {
                                question: 'Can I sell my investment to someone else?',
                                answer: 'Currently, investments are not transferable. However, we\'re working on a secondary market platform that will allow investors to trade their stakes in the future.',
                                category: 'Investment'
                              },
                              {
                                question: 'What makes this project different from other film investments?',
                                answer: 'This project stands out due to its stellar team (Rajkumar Hirani, Aamir Khan), transparent communication, exclusive perks, and strong commercial potential. We also provide unprecedented access to the filmmaking process.',
                                category: 'Project'
                              },
                              {
                                question: 'How often will I receive updates about the project?',
                                answer: 'We provide weekly updates through our platform, including behind-the-scenes content, production progress, and exclusive insights. Major milestones are communicated immediately.',
                                category: 'Project'
                              }
                            ].map((faq, index) => (
                              <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl border ${theme === 'light' ? 'border-gray-300 hover:border-sky-500/50' : 'border-gray-700/50 hover:border-sky-500/50'} transition-all duration-300`}
                              >
                                <button
                                  className={`w-full p-6 text-left flex items-center justify-between transition-colors duration-300 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-800/30'}`}
                                  onClick={() => {
                                    // Toggle FAQ expansion logic would go here
                                  }}
                                >
                                  <div className="flex-1">
                                    <h4 className={`${getTextColor(theme, 'primary')} font-semibold mb-2 hover:text-sky-400 transition-colors duration-300`}>
                                      {faq.question}
                                    </h4>
                                    <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full">
                                      {faq.category}
                                    </span>
                                  </div>
                                  <ChevronRight className={`w-5 h-5 ml-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                                </button>
                                <div className="px-6 pb-6">
                                  <p className={`leading-relaxed ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    {faq.answer}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Contact Support */}
                          <div className="mt-8 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-2xl p-6 border border-sky-500/20">
                            <h4 className={`text-xl font-bold mb-4 ${getTextColor(theme, 'primary')}`}>Still Have Questions?</h4>
                            <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              Our support team is here to help! Get in touch with us for personalized assistance.
                            </p>
                            <div className="flex gap-4">
                              <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-300">
                                Contact Support
                              </button>
                              <button className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'}`}>
                                Schedule a Call
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'legal' && (
                      <div className="space-y-8">
                        {/* Legal & Transparency */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-3xl p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${getTextColor(theme, 'primary')}`}>
                            <FileCheck className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                            Legal & Transparency
                          </h3>
                          
                          {/* Compliance Status */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/30 text-center">
                                                              <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                              <h4 className={`${getTextColor(theme, 'primary')} font-bold mb-2`}>SEBI Compliant</h4>
                              <p className={`text-sm ${theme === 'light' ? 'text-green-700' : 'text-green-300'}`}>Fully regulated investment platform</p>
                            </div>
                            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30 text-center">
                                                              <Award className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                              <h4 className={`${getTextColor(theme, 'primary')} font-bold mb-2`}>ISO Certified</h4>
                              <p className={`text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>Quality management certified</p>
                            </div>
                            <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/30 text-center">
                                                              <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                              <h4 className={`${getTextColor(theme, 'primary')} font-bold mb-2`}>GDPR Compliant</h4>
                              <p className={`text-sm ${theme === 'light' ? 'text-purple-700' : 'text-purple-300'}`}>Data protection standards met</p>
                            </div>
                          </div>
                          
                          {/* Legal Documents */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold mb-6 ${getTextColor(theme, 'primary')}`}>Legal Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                {
                                  title: 'Investment Agreement',
                                  description: 'Comprehensive contract outlining investor rights and obligations',
                                  size: '2.4 MB',
                                  type: 'PDF',
                                  icon: FileText
                                },
                                {
                                  title: 'Prospectus',
                                  description: 'Detailed project information and financial projections',
                                  size: '1.8 MB',
                                  type: 'PDF',
                                  icon: FileText
                                },
                                {
                                  title: 'Risk Disclosure',
                                  description: 'Complete risk assessment and disclosure statement',
                                  size: '1.2 MB',
                                  type: 'PDF',
                                  icon: Shield
                                },
                                {
                                  title: 'Terms of Service',
                                  description: 'Platform terms and conditions for investors',
                                  size: '0.9 MB',
                                  type: 'PDF',
                                  icon: FileCheck
                                },
                                {
                                  title: 'Privacy Policy',
                                  description: 'How we protect and handle your personal data',
                                  size: '0.7 MB',
                                  type: 'PDF',
                                  icon: Shield
                                },
                                {
                                  title: 'Compliance Certificate',
                                  description: 'SEBI and regulatory compliance certificates',
                                  size: '1.5 MB',
                                  type: 'PDF',
                                  icon: Award
                                }
                              ].map((document, index) => (
                                <motion.div
                                  key={document.title}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-xl p-4 border ${theme === 'light' ? 'border-gray-300 hover:border-gray-500/50' : 'border-gray-700/50 hover:border-gray-500/50'} transition-all duration-300`}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800/50'}`}>
                                      <document.icon className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`} />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`${getTextColor(theme, 'primary')} font-semibold mb-1`}>{document.title}</h5>
                                      <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{document.description}</p>
                                      <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-2 text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                                          <span>{document.size}</span>
                                          <span>•</span>
                                          <span>{document.type}</span>
                                        </div>
                                        <button className={`px-3 py-1 rounded-lg transition-colors duration-300 text-sm ${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'}`}>
                                          Download
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Investor Protections */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold mb-6 ${getTextColor(theme, 'primary')}`}>Investor Protections</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3 flex items-center gap-2`}>
                                  <Shield className="w-5 h-5 text-green-400" />
                                  Escrow Protection
                                </h5>
                                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  All investments are held in secure escrow accounts until funding goals are met. Funds are only released to production when milestones are achieved.
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3 flex items-center gap-2`}>
                                  <Award className="w-5 h-5 text-blue-400" />
                                  Insurance Coverage
                                </h5>
                                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Comprehensive insurance coverage protects against production delays, accidents, and other unforeseen circumstances that could impact the project.
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3 flex items-center gap-2`}>
                                  <FileCheck className="w-5 h-5 text-purple-400" />
                                  Legal Recourse
                                </h5>
                                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Investors have full legal recourse through binding arbitration and court proceedings if needed. All contracts are enforceable under Indian law.
                                </p>
                              </div>
                              <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-3 flex items-center gap-2`}>
                                  <Globe className="w-5 h-5 text-cyan-400" />
                                  Transparency
                                </h5>
                                <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Complete transparency in all financial matters, production progress, and decision-making processes. Regular audits and reporting ensure accountability.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Legal Team */}
                          <div className="mb-8">
                            <h4 className={`text-xl font-bold mb-6 ${getTextColor(theme, 'primary')}`}>Legal Team</h4>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-6 border ${getBorderColor(theme)}`}>
                              <div className="flex items-start gap-6">
                                <img
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                                  alt="Legal Team"
                                  className="w-20 h-20 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className={`${getTextColor(theme, 'primary')} font-bold mb-2`}>Amarchand & Mangaldas</h5>
                                  <p className={`text-sm mb-3 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                    Leading Indian law firm specializing in entertainment law, corporate governance, and investor protection.
                                  </p>
                                  <div className={`flex items-center gap-4 text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                                    <span>• SEBI Registered</span>
                                    <span>• 25+ Years Experience</span>
                                    <span>• 1000+ Entertainment Cases</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact Legal */}
                          <div className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-2xl p-6 border border-gray-500/20">
                            <h4 className={`text-xl font-bold mb-4 ${getTextColor(theme, 'primary')}`}>Legal Inquiries</h4>
                            <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                              For legal questions or concerns, our legal team is available for consultation.
                            </p>
                            <button className="px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-600 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-slate-700 transition-all duration-300">
                              Contact Legal Team
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'milestones' && (
                      <div className="space-y-4 md:space-y-8">
                        {/* Project Milestones */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`${theme === 'light' ? 'bg-white/90' : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border ${getBorderColor(theme)}`}
                        >
                          <h3 className={`text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3 ${getTextColor(theme, 'primary')}`}>
                            <Target className="w-6 h-6 text-indigo-400" />
                            Project Milestones
                          </h3>
                          
                          {/* Project Timeline */}
                          <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                            
                            {/* Timeline Items */}
                            <div className="space-y-4 md:space-y-8">
                              {[
                                {
                                  date: 'Dec 2023',
                                  title: 'Project Announcement',
                                  description: 'Official announcement of "The Dream Chasers" with initial concept and team reveal',
                                  status: 'completed',
                                  icon: '🎬',
                                  achievements: ['Concept finalized', 'Team assembled', 'Initial budget approved']
                                },
                                {
                                  date: 'Jan 2024',
                                  title: 'Funding Campaign Launch',
                                  description: 'Investment platform goes live with comprehensive project details and perks',
                                  status: 'completed',
                                  icon: '💰',
                                  achievements: ['Platform launched', 'First 100 investors', '25% funding achieved']
                                },
                                {
                                  date: 'Feb 2024',
                                  title: 'Pre-production Phase',
                                  description: 'Script finalization, location scouting, and technical planning',
                                  status: 'in-progress',
                                  icon: '📝',
                                  achievements: ['Script completed', 'Locations finalized', 'Technical crew hired']
                                },
                                {
                                  date: 'Mar 2024',
                                  title: 'Principal Photography',
                                  description: 'Main shooting schedule begins with lead cast and key scenes',
                                  status: 'upcoming',
                                  icon: '🎥',
                                  achievements: ['Shooting schedule', 'Set construction', 'Cast rehearsals']
                                },
                                {
                                  date: 'Jun 2024',
                                  title: 'Post-production',
                                  description: 'Editing, visual effects, and sound design phase',
                                  status: 'upcoming',
                                  icon: '✂️',
                                  achievements: ['Rough cut', 'VFX integration', 'Sound mixing']
                                },
                                {
                                  date: 'Sep 2024',
                                  title: 'Marketing & Promotion',
                                  description: 'Trailer releases, press events, and promotional campaigns',
                                  status: 'upcoming',
                                  icon: '📢',
                                  achievements: ['Trailer launch', 'Press events', 'Social media campaign']
                                },
                                {
                                  date: 'Dec 2024',
                                  title: 'Theatrical Release',
                                  description: 'Worldwide theatrical release across multiple territories',
                                  status: 'upcoming',
                                  icon: '🎭',
                                  achievements: ['Theatrical release', 'International distribution', 'Streaming deals']
                                }
                              ].map((milestone, index) => (
                                <motion.div
                                  key={milestone.title}
                                  initial={{ opacity: 0, x: -50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative flex items-start gap-3 md:gap-6"
                                >
                                  {/* Timeline Dot */}
                                  <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-2xl ${
                                    milestone.status === 'completed' 
                                      ? 'bg-green-500 shadow-lg shadow-green-500/25' 
                                      : milestone.status === 'in-progress'
                                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25'
                                      : 'bg-gray-600 shadow-lg'
                                  }`}>
                                    {milestone.icon}
                                  </div>
                                  
                                  {/* Content */}
                                  <div className={`flex-1 rounded-2xl p-4 md:p-6 border transition-all duration-300 ${theme === 'light' ? 'bg-white/80 border-gray-300 hover:border-indigo-500/50' : 'bg-gray-900/50 border-gray-700/50 hover:border-indigo-500/50'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                      <h4 className={`${getTextColor(theme, 'primary')} font-bold text-base md:text-lg`}>{milestone.title}</h4>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        milestone.status === 'completed' 
                                          ? theme === 'light' ? 'bg-green-500/20 text-green-700' : 'bg-green-500/20 text-green-300'
                                          : milestone.status === 'in-progress'
                                          ? theme === 'light' ? 'bg-yellow-500/20 text-yellow-700' : 'bg-yellow-500/20 text-yellow-300'
                                          : theme === 'light' ? 'bg-gray-500/20 text-gray-700' : 'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {milestone.status === 'completed' ? 'Completed' : 
                                         milestone.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                                      </span>
                                    </div>
                                    
                                    <p className={`mb-3 md:mb-4 text-sm md:text-base ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>{milestone.description}</p>
                                    
                                    <div className="mb-3 md:mb-4">
                                      <p className={`text-xs md:text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Key Achievements:</p>
                                                                              <ul className="space-y-1">
                                          {milestone.achievements.map((achievement, idx) => (
                                            <li key={idx} className={`flex items-center gap-2 text-xs md:text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                            {achievement}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div className="text-indigo-400 font-semibold text-xs md:text-sm">
                                      {milestone.date}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Progress Summary */}
                          <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1 md:mb-2">2</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Completed</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1 md:mb-2">1</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>In Progress</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className="text-2xl md:text-3xl font-bold text-gray-400 mb-1 md:mb-2">4</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Upcoming</div>
                            </div>
                            <div className={`${theme === 'light' ? 'bg-white/80' : 'bg-gray-900/50'} rounded-2xl p-4 md:p-6 border ${getBorderColor(theme)} text-center`}>
                              <div className="text-2xl md:text-3xl font-bold text-indigo-400 mb-1 md:mb-2">29%</div>
                              <div className={`text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Overall Progress</div>
                            </div>
                          </div>
                          
                          {/* Next Milestone */}
                          <div className="mt-6 md:mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-4 md:p-6 border border-indigo-500/20">
                            <h4 className={`text-lg md:text-xl font-bold mb-3 md:mb-4 ${getTextColor(theme, 'primary')}`}>Next Milestone</h4>
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="text-3xl md:text-4xl">🎥</div>
                              <div>
                                <h5 className={`${getTextColor(theme, 'primary')} font-bold text-base md:text-lg`}>Principal Photography</h5>
                                <p className={`mb-2 text-sm md:text-base ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Main shooting schedule begins with lead cast and key scenes</p>
                                <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs md:text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                  <span>Expected: March 2024</span>
                                  <span>•</span>
                                  <span>Duration: 60 days</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectDetailPage.displayName = 'ProjectDetailPage';

export default ProjectDetailPage; 