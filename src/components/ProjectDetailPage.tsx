import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowLeft, 
  Film, 
  Music, 
  Tv, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  MapPin,
  Heart,
  Share2,
  Download,
  ExternalLink,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Eye,
  MessageCircle,
  Medal,
  Box,
  Gem,
  Badge,
  Globe,
  Shield,
  Gift,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Camera,
  Mic,
  Video,
  FileText,
  Settings,
  HelpCircle,
  FileCheck,
  TrendingDown,
  Zap,
  Crown,
  Trophy,
  Sparkles,
  Film as FilmIcon,
  Music as MusicIcon,
  Tv as TvIcon,
  UserCheck,
  Star as StarIcon,
  ThumbsUp,
  MessageSquare,
  Hash,
  Tag,
  Award as AwardIcon,
  Globe as GlobeIcon,
  FileText as FileTextIcon,
  Settings as SettingsIcon,
  HelpCircle as HelpCircleIcon,
  FileCheck as FileCheckIcon,
  Shield as ShieldIcon,
  X,
  Maximize,
  Info,
  AlertCircle,
  CheckCircle,
  Loader2,
  RotateCcw,
  Video as VideoIcon
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './auth/useAuth';
import { Project } from '../types';
import PixelCard from './PixelCard';

interface ProjectDetailPageProps {
  project: Project;
  onClose: () => void;
  onInvest?: (project: Project) => void;
  initialTab?: 'overview' | 'invest' | 'perks' | 'milestones' | 'team' | 'story' | 'gallery' | 'updates' | 'community' | 'reviews' | 'faqs' | 'legal';
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onClose, onInvest, initialTab = 'overview' }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLiked, setIsLiked] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFullScript, setShowFullScript] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 15
  });
  const [heroOpacity, setHeroOpacity] = useState(1);
  const [heroScale, setHeroScale] = useState(1);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [isTrailerLoading, setIsTrailerLoading] = useState(false);
  const [trailerError, setTrailerError] = useState<string | null>(null);
  const [showTrailerControls, setShowTrailerControls] = useState(false);
  const [trailerVolume, setTrailerVolume] = useState(50);
  const [isTrailerMuted, setIsTrailerMuted] = useState(false);
  const [trailerProgress, setTrailerProgress] = useState(0);
  const [isTrailerFullscreen, setIsTrailerFullscreen] = useState(false);
  const [isYouTubeTrailer, setIsYouTubeTrailer] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [searchVideoId, setSearchVideoId] = useState<string | null>(null);
  const [isSearchVideoLoading, setIsSearchVideoLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const trailerRef = useRef<HTMLIFrameElement>(null);
  const trailerContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const { scrollY } = useScroll();

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

  const handleInvest = () => {
    if (onInvest) {
      onInvest(project);
    }
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

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoLoad = () => {
    // Start playing video immediately when it loads
    setIsVideoPlaying(true);
    setIsYouTubeTrailer(!!embedUrl);
    if (videoRef.current && !embedUrl) {
      videoRef.current.volume = 0.5;
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {
        setIsMuted(false);
      });
    }
    
    // For YouTube videos, ensure they start unmuted
    if (embedUrl && iframeRef.current) {
      setIsMuted(false);
    }
    
    // Add a 2 second delay before showing the video (hiding poster)
    setTimeout(() => {
      setIsVideoLoaded(true);
    }, 2000);
  };

  const scriptExcerpt = (
    (project as any).scriptExcerpt || `EXT. VILLAGE SQUARE - DAY\n\nThe sun blazes down on a bustling market. Two outlaws, VEERU and JAI, weave through the crowd, eyes alert.\n\nVEERU (whispering)\nWe need to lose them.\n\nJAI\nJust follow my lead.\n\nSuddenly, a whistle. The POLICE are close. The chase is on...`
  );

  // Static perks data for demonstration
  const staticPerks = [
    {
      id: '1',
      title: 'Digital Certificate of Investment',
      description: 'Official digital certificate recognizing your investment',
      projectId: project?.id,
      projectTitle: project?.title,
      tier: 'supporter' as const,
      minAmount: 10000,
      createdAt: '2023-12-15T11:30:00Z',
      type: 'free' as const,
      status: 'active' as const,
      virtual: true,
      requiresVerification: false,
      estimatedValue: 2500,
      tags: ['digital', 'certificate', 'recognition']
    },
    {
      id: '2',
      title: 'Community Casting Vote',
      description: 'Vote on cast members for upcoming projects',
      projectId: project?.id,
      projectTitle: project?.title,
      tier: 'backer' as const,
      minAmount: 25000,
      createdAt: '2023-12-16T14:45:00Z',
      type: 'voting' as const,
      status: 'upcoming' as const,
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-15T23:59:59Z',
      virtual: true,
      requiresVerification: true,
      estimatedValue: 5000,
      tags: ['voting', 'casting', 'community']
    },
    {
      id: '3',
      title: 'VIP Set Visit Experience',
      description: 'Exclusive set visit with crew interaction',
      projectId: project?.id,
      projectTitle: project?.title,
      tier: 'producer' as const,
      minAmount: 75000,
      createdAt: '2023-11-12T09:30:00Z',
      type: 'exclusive' as const,
      status: 'upcoming' as const,
      startDate: '2024-03-15T09:00:00Z',
      endDate: '2024-03-15T17:00:00Z',
      location: 'Mumbai Film City',
      maxParticipants: 20,
      currentParticipants: 8,
      virtual: false,
      requiresVerification: true,
      estimatedValue: 15000,
      tags: ['exclusive', 'set-visit', 'vip']
    }
  ];

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'bg-green-100 text-green-700';
      case 'voting': return 'bg-purple-100 text-purple-700';
      case 'exclusive': return 'bg-yellow-100 text-yellow-700';
      case 'limited': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Extract YouTube video ID from URL
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

  const videoId = getYouTubeVideoId(project.trailer);
  const finalVideoId = searchVideoId || videoId;
  const embedUrl = finalVideoId ? `https://www.youtube.com/embed/${finalVideoId}?autoplay=1&mute=0&modestbranding=1&rel=0&showinfo=0&controls=1&enablejsapi=1&origin=${window.location.origin}&playsinline=1&loop=1&playlist=${finalVideoId}&iv_load_policy=3&cc_load_policy=0&fs=1` : null;
  
  // Check if it's a search query URL
  const isSearchQuery = project.trailer?.includes('youtube.com/results?search_query=');

  // Auto-play effect
  useEffect(() => {
    if (embedUrl) {
      setIsVideoPlaying(true);
      setIsVideoLoaded(true);
      setIsMuted(false); // Ensure YouTube videos start unmuted
    } else if (videoRef.current) {
      const playVideo = async () => {
        try {
          videoRef.current!.volume = 0.5;
          videoRef.current!.muted = false;
          await videoRef.current!.play();
          setIsVideoPlaying(true);
          setIsVideoLoaded(true);
        } catch (error) {
          setIsMuted(false);
        }
      };
      const timer = setTimeout(playVideo, 100);
      return () => clearTimeout(timer);
    }
  }, [embedUrl]);

  const handleTrailerPlay = () => {
    if (isSearchQuery) {
      // For search queries, open in new tab
      window.open(project.trailer, '_blank');
      return;
    }
    
    if (!embedUrl) {
      setTrailerError('Trailer not available');
      return;
    }
    
    setIsTrailerLoading(true);
    setTrailerError(null);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsTrailerLoading(false);
      setIsTrailerPlaying(true);
    }, 1500);
  };

  const handleTrailerLoad = () => {
    setIsTrailerLoading(false);
    setIsTrailerPlaying(true);
  };

  const handleTrailerError = () => {
    setIsTrailerLoading(false);
    setTrailerError('Failed to load trailer. Please try again.');
  };

  const handleTrailerClose = () => {
    setIsTrailerPlaying(false);
    setTrailerError(null);
  };

  const handleTrailerFullscreen = () => {
    if (trailerContainerRef.current) {
      if (!isTrailerFullscreen) {
        trailerContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsTrailerFullscreen(!isTrailerFullscreen);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      if (videoRef.current) {
        videoRef.current.muted = !prev;
      }
      // For YouTube videos, use the YouTube Player API if available
      if (embedUrl && iframeRef.current) {
        try {
          // Try to use YouTube Player API for better control
          const iframe = iframeRef.current;
          if (iframe.contentWindow && (iframe.contentWindow as any).postMessage) {
            const command = prev ? 'unMute' : 'mute';
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: command, args: [] }),
              '*'
            );
          } else {
            // Fallback: reload iframe with new mute parameter
            const currentSrc = iframe.src;
            const newMuteParam = prev ? '&mute=0' : '&mute=1';
            const newSrc = currentSrc.replace(/&mute=[01]/, '') + newMuteParam;
            iframe.src = newSrc;
          }
        } catch (error) {
          console.log('YouTube Player API not available, using fallback');
          // Fallback: reload iframe with new mute parameter
          const currentSrc = iframeRef.current.src;
          const newMuteParam = prev ? '&mute=0' : '&mute=1';
          const newSrc = currentSrc.replace(/&mute=[01]/, '') + newMuteParam;
          iframeRef.current.src = newSrc;
        }
      }
      return !prev;
    });
  };

  const togglePause = () => {
    setIsVideoPlaying((prev) => {
      if (videoRef.current) {
        if (prev) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
      // For YouTube videos, use the YouTube Player API if available
      if (embedUrl && iframeRef.current) {
        try {
          // Try to use YouTube Player API for better control
          const iframe = iframeRef.current;
          if (iframe.contentWindow && (iframe.contentWindow as any).postMessage) {
            const command = prev ? 'pauseVideo' : 'playVideo';
            iframe.contentWindow.postMessage(
              JSON.stringify({ event: 'command', func: command, args: [] }),
              '*'
            );
          } else {
            // Fallback: reload iframe with new autoplay parameter
            const currentSrc = iframe.src;
            const newAutoplayParam = prev ? '&autoplay=0' : '&autoplay=1';
            const newSrc = currentSrc.replace(/&autoplay=[01]/, '') + newAutoplayParam;
            iframe.src = newSrc;
          }
        } catch (error) {
          console.log('YouTube Player API not available, using fallback');
          // Fallback: reload iframe with new autoplay parameter
          const currentSrc = iframeRef.current.src;
          const newAutoplayParam = prev ? '&autoplay=0' : '&autoplay=1';
          const newSrc = currentSrc.replace(/&autoplay=[01]/, '') + newAutoplayParam;
          iframeRef.current.src = newSrc;
        }
      }
      return !prev;
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handlePlayButton = () => {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Hero Video Section - Full Width at Top */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative w-full h-[600px] overflow-hidden cursor-pointer"
        onClick={() => {
          // Force autoplay on user interaction
          if (embedUrl && iframeRef.current) {
            const currentSrc = iframeRef.current.src;
            // Reload with autoplay if not already playing
            if (!currentSrc.includes('&autoplay=1')) {
              iframeRef.current.src = currentSrc + '&autoplay=1';
            }
          }
        }}
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {embedUrl ? (
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
              <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-4">
                    <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
                    <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                  </div>
                  <p className="text-white font-semibold">Loading Video...</p>
                  <p className="text-gray-400 text-sm mt-2">Searching for related content</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                onLoadedData={handleVideoLoad}
                muted={false}
                loop
                playsInline
                autoPlay
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

          {/* Like and Share Buttons - Top Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`transition-colors duration-200 ${
                isLiked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-white/80 hover:text-white'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="text-white/80 hover:text-white transition-colors duration-200"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
          </button>
          </div>
        </div>

        {/* Circles Logo and Text - Top Right (moved up even more) */}
        <div className="absolute top-6 right-0 z-30 flex items-center gap-3 m-6 select-none">
          <img src="/logo.png" alt="Circles Logo" className="h-14 w-14 object-contain drop-shadow-lg blur-[0.5px]" />
          <span className="text-xl font-extrabold text-white drop-shadow-lg tracking-wide blur-[0.3px]">Circles</span>
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
              {/* Project Badges */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
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
                className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl leading-tight"
              >
                {project.title}
              </motion.h1>
              
              {/* Description */}
              <motion.p
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl drop-shadow-lg leading-relaxed"
              >
                {project.description}
              </motion.p>
              
              {/* Project Meta */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-8"
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

              {/* Play and Invest Buttons */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex items-center gap-4"
              >
                {/* Play Button */}
                <motion.button
                  onClick={handlePlayButton}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 backdrop-blur-sm"
                >
                  <Play className="w-6 h-6" />
                  Play
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                </motion.button>

                {/* Invest Now Button */}
                <motion.button
                onClick={() => setActiveTab('invest')}
                  className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 backdrop-blur-sm"
              >
                  <DollarSign className="w-6 h-6" />
                Invest Now
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>






      </motion.div>

      {/* Main Content - Side by Side Below Hero */}
      <div className="relative flex z-5">
        {/* Left Navigation Panel */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-80 bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-r border-gray-800/50 overflow-y-auto sticky top-0 h-screen"
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-white">Project Details</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="space-y-2">
              {navigationTabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 group ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/20'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tab.color} text-white shadow-lg`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full ml-auto"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">

          {/* Content Sections */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="p-8"
              >
                {/* Content will be rendered based on activeTab */}
                <div className="text-white">
                  <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {navigationTabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  
                  {/* Epic Content Sections */}
                  <div className="space-y-8">
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        {/* Project Summary Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-purple-400" />
                            Project Overview
                          </h3>
                          
                          {/* Main Info Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Director</p>
                              <p className="text-white font-semibold">{project.director || 'TBA'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Lead Actor</p>
                              <p className="text-white font-semibold">{(project as any).actor || 'TBA'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Lead Actress</p>
                              <p className="text-white font-semibold">{(project as any).actress || 'TBA'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Production House</p>
                              <p className="text-white font-semibold">{project.productionHouse || 'TBA'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Runtime</p>
                              <p className="text-white font-semibold">
                                {(project as any).runtime ? `${(project as any).runtime} min` : '150 min'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">TMDB Rating</p>
                              <p className="text-white font-semibold flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                {(project as any).tmdbRating || project.rating || 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Country</p>
                              <p className="text-white font-semibold">{(project as any).country || 'India'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Release Year</p>
                              <p className="text-white font-semibold">{(project as any).releaseYear || 'TBA'}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-400 text-sm">Language</p>
                              <p className="text-white font-semibold">{project.language || 'Hindi'}</p>
                            </div>
                          </div>

                          {/* Genres */}
                          {(project as any).tmdbGenres && (project as any).tmdbGenres.length > 0 && (
                            <div className="mb-6">
                              <p className="text-gray-400 text-sm mb-3">Genres</p>
                              <div className="flex flex-wrap gap-2">
                                {(project as any).tmdbGenres.map((genre: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Spoken Languages */}
                          {(project as any).spokenLanguages && (project as any).spokenLanguages.length > 0 && (
                            <div className="mb-6">
                              <p className="text-gray-400 text-sm mb-3">Spoken Languages</p>
                              <div className="flex flex-wrap gap-2">
                                {(project as any).spokenLanguages.map((language: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                                  >
                                    {language}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* TMDB Overview */}
                          {(project as any).tmdbOverview && (
                            <div className="mb-6">
                              <p className="text-gray-400 text-sm mb-3">Plot Summary</p>
                              <p className="text-gray-300 leading-relaxed">
                                {(project as any).tmdbOverview}
                              </p>
                            </div>
                          )}

                          {/* Tagline */}
                          {(project as any).tagline && (
                            <div className="mb-6">
                              <p className="text-gray-400 text-sm mb-3">Tagline</p>
                              <p className="text-white font-semibold italic">
                                "{(project as any).tagline}"
                              </p>
                            </div>
                          )}

                          {/* External Links */}
                          <div className="flex gap-4">
                            {(project as any).imdbId && (
                              <a
                                href={`https://www.imdb.com/title/${(project as any).imdbId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg hover:bg-yellow-500/30 transition-colors duration-300"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View on IMDb
                              </a>
                            )}
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors duration-300">
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                            Funding Progress
                          </h3>
                          
                          {/* Progress Bar */}
                          <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-gray-300">Progress</span>
                              <span className="text-white font-bold text-xl">{project.fundedPercentage}%</span>
                            </div>
                            <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.fundedPercentage}%` }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-pink-400/50 animate-pulse" />
                              </motion.div>
                            </div>
                            <div className="flex justify-between mt-2 text-sm text-gray-400">
                              <span>Raised: {formatCurrency(project.raisedAmount)}</span>
                              <span>Goal: {formatCurrency(project.targetAmount)}</span>
                            </div>
                          </div>

                          {/* Funding Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <Users className="w-6 h-6 text-blue-400" />
                                <span className="text-gray-400 text-sm">Total Investors</span>
                              </div>
                              <p className="text-3xl font-bold text-white">{fundingStats.totalInvestors}</p>
                              <p className="text-green-400 text-sm">+12 this week</p>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <DollarSign className="w-6 h-6 text-green-400" />
                                <span className="text-gray-400 text-sm">Avg. Investment</span>
                              </div>
                              <p className="text-3xl font-bold text-white">{formatCurrency(fundingStats.averageInvestment)}</p>
                              <p className="text-green-400 text-sm">+8% from last month</p>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <Clock className="w-6 h-6 text-yellow-400" />
                                <span className="text-gray-400 text-sm">Days Active</span>
                              </div>
                              <p className="text-3xl font-bold text-white">{fundingStats.daysSinceCreated}</p>
                              <p className="text-blue-400 text-sm">45 days remaining</p>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <Zap className="w-6 h-6 text-orange-400" />
                                <span className="text-gray-400 text-sm">Daily Velocity</span>
                              </div>
                              <p className="text-3xl font-bold text-white">{formatCurrency(fundingStats.fundingVelocity)}</p>
                              <p className="text-green-400 text-sm">+15% this week</p>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                <span className="text-gray-400 text-sm">Trending Score</span>
                              </div>
                              <p className="text-3xl font-bold text-white">8.9</p>
                              <p className="text-green-400 text-sm">Top 5% of projects</p>
                            </div>
                            
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center gap-3 mb-3">
                                <MapPin className="w-6 h-6 text-red-400" />
                                <span className="text-gray-400 text-sm">Top City</span>
                              </div>
                              <p className="text-3xl font-bold text-white">Mumbai</p>
                              <p className="text-blue-400 text-sm">42% of investments</p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Funding Milestones */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Target className="w-6 h-6 text-indigo-400" />
                            Funding Milestones
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {fundingMilestones.map((milestone, index) => (
                              <motion.div
                                key={milestone.percentage}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                                  milestone.achieved
                                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                                    : 'bg-gray-900/50 border-gray-700/50'
                                }`}
                              >
                                {milestone.achieved && (
                                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm">✓</span>
                                  </div>
                                )}
                                <div className="text-4xl mb-3">{milestone.icon}</div>
                                <h4 className="text-lg font-bold text-white mb-2">{milestone.label}</h4>
                                <p className={`text-sm ${milestone.achieved ? 'text-green-400' : 'text-gray-400'}`}>
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Star className="w-6 h-6 text-yellow-400" />
                            Movie Details & Ratings
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* TMDB Rating */}
                            {(project as any).tmdbRating && (
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                  <span className="text-gray-400 text-sm">TMDB Rating</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{(project as any).tmdbRating}</p>
                                <p className="text-yellow-400 text-sm">Out of 10</p>
                              </div>
                            )}
                            
                            {/* Runtime */}
                            {(project as any).runtime && (
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <Clock className="w-6 h-6 text-blue-400" />
                                  <span className="text-gray-400 text-sm">Runtime</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{(project as any).runtime}</p>
                                <p className="text-blue-400 text-sm">Minutes</p>
                              </div>
                            )}
                            
                            {/* Release Year */}
                            {(project as any).releaseYear && (
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <Calendar className="w-6 h-6 text-green-400" />
                                  <span className="text-gray-400 text-sm">Release Year</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{(project as any).releaseYear}</p>
                                <p className="text-green-400 text-sm">Year</p>
                              </div>
                            )}
                            
                            {/* Country */}
                            {(project as any).country && (
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-3">
                                  <Globe className="w-6 h-6 text-purple-400" />
                                  <span className="text-gray-400 text-sm">Origin Country</span>
                                </div>
                                <p className="text-xl font-bold text-white">{(project as any).country}</p>
                                <p className="text-purple-400 text-sm">Production</p>
                              </div>
                            )}
                          </div>
                        </motion.div>

                        {/* Countdown Timer */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Clock className="w-6 h-6 text-red-400" />
                            Time Remaining
                          </h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Object.entries(timeRemaining).map(([unit, value]) => (
                              <div key={unit} className="text-center">
                                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                  <p className="text-4xl font-bold text-white mb-2">{value.toString().padStart(2, '0')}</p>
                                  <p className="text-gray-400 text-sm capitalize">{unit}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'invest' && (
                      <div className="space-y-8">
                        {/* Investment Form */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <DollarSign className="w-6 h-6 text-green-400" />
                            Make Your Investment
                          </h3>
                          
                          {/* Quick Amount Buttons */}
                          <div className="mb-8">
                            <p className="text-gray-300 mb-4">Select Investment Amount</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000].map((amount) => (
                                <button
                                  key={amount}
                                  onClick={() => setInvestmentAmount(amount)}
                                  className={`p-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    investmentAmount === amount
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                                  }`}
                                >
                                  ₹{formatLargeNumber(amount)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Custom Amount */}
                          <div className="mb-8">
                            <label className="block text-gray-300 mb-2">Custom Amount</label>
                            <input
                              type="number"
                              value={investmentAmount}
                              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                              className="w-full p-4 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                              placeholder="Enter amount"
                            />
                          </div>

                          {/* Investment Calculator */}
                          <div className="bg-gray-900/50 rounded-2xl p-6 mb-8">
                            <h4 className="text-lg font-semibold text-white mb-4">Investment Breakdown</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Investment Amount</span>
                                <span className="text-white font-semibold">{formatCurrency(investmentAmount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Processing Fee (2%)</span>
                                <span className="text-white font-semibold">{formatCurrency(investmentAmount * 0.02)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">GST (18%)</span>
                                <span className="text-white font-semibold">{formatCurrency(investmentAmount * 0.18)}</span>
                              </div>
                              <div className="border-t border-gray-700 pt-3 flex justify-between">
                                <span className="text-white font-bold text-lg">Total Amount</span>
                                <span className="text-green-400 font-bold text-lg">
                                  {formatCurrency(investmentAmount * 1.20)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div className="mb-8">
                            <p className="text-gray-300 mb-4">Payment Method</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { id: 'upi', label: 'UPI', icon: '📱' },
                                { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                                { id: 'netbanking', label: 'Net Banking', icon: '🏦' }
                              ].map((method) => (
                                <button
                                  key={method.id}
                                  onClick={() => setPaymentMethod(method.id as any)}
                                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                    paymentMethod === method.id
                                      ? 'border-green-500 bg-green-500/10 text-green-400'
                                      : 'border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white'
                                  }`}
                                >
                                  <div className="text-2xl mb-2">{method.icon}</div>
                                  <div className="font-semibold">{method.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Invest Button */}
                          <button
                            onClick={handleInvest}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 px-8 rounded-2xl font-bold text-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isProcessing ? (
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-3">
                                <DollarSign className="w-8 h-8" />
                                Invest Now
                                <ChevronRight className="w-6 h-6" />
                              </div>
                            )}
                          </button>

                          {/* Available Slots */}
                          <div className="mt-6 text-center">
                            <p className="text-gray-400 text-sm">
                              <span className="text-green-400 font-semibold">100</span> of <span className="text-white font-semibold">150</span> investment slots remaining
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'perks' && (
                      <div className="space-y-8">
                        {/* Experience Tiers Overview */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Crown className="w-6 h-6 text-yellow-400" />
                            Experience Tiers
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105"
                              >
                                <div className="text-center">
                                  <div className="text-4xl mb-3">{tierInfo.icon}</div>
                                  <h4 className="text-lg font-bold text-white mb-2">{tierInfo.name}</h4>
                                  <p className="text-gray-400 text-sm mb-4">Min. Investment</p>
                                  <p className="text-2xl font-bold text-yellow-400">{formatCurrency(tierInfo.minAmount)}</p>
                                  <div className={`w-full h-1 bg-gradient-to-r ${tierInfo.color} rounded-full mt-3`} />
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Medal className="w-6 h-6 text-yellow-400" />
                            Perks & Experiences
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
                                  className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                                >
                                  {/* Perk Icon */}
                                  <div className="text-4xl mb-4 text-center">{perk.icon}</div>
                                  
                                  {/* Tier Badge */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${tierInfo.color} text-white`}>
                                      {tierInfo.icon} {tierInfo.label}
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(perk.status)}`}>
                                      {perk.status}
                                    </div>
                                  </div>
                                  
                                  {/* Perk Title */}
                                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors duration-300">
                                    {perk.title}
                                  </h4>
                                  
                                  {/* Perk Description */}
                                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                    {perk.description}
                                  </p>
                                  
                                  {/* Features List */}
                                  <div className="mb-4">
                                    <p className="text-gray-500 text-xs mb-2 font-semibold">INCLUDES:</p>
                                    <ul className="space-y-1">
                                      {perk.features.map((feature, idx) => (
                                        <li key={idx} className="text-gray-300 text-xs flex items-center gap-2">
                                          <span className="text-green-400">✓</span>
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  {/* Perk Details */}
                                  <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Min Investment:</span>
                                      <span className="text-white font-semibold">{formatCurrency(perk.minAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Value:</span>
                                      <span className="text-green-400 font-semibold">{formatCurrency(perk.estimatedValue)}</span>
                                    </div>
                                    {perk.maxParticipants && (
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Available:</span>
                                        <span className="text-blue-400 font-semibold">
                                          {perk.maxParticipants - perk.currentParticipants} left
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Progress Bar for Limited Perks */}
                                  {perk.maxParticipants && (
                                    <div className="mb-4">
                                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                                        <span>Filled</span>
                                        <span>{perk.currentParticipants}/{perk.maxParticipants}</span>
                                      </div>
                                      <div className="w-full bg-gray-700 rounded-full h-2">
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
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
                                  <div className="flex-1 bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="text-lg font-bold text-white">{event.title}</h4>
                                      <span className="text-purple-400 font-semibold text-sm">{event.month}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm">{event.description}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'team' && (
                      <div className="space-y-8">
                        {/* Team & Cast */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-blue-400" />
                            Team & Cast
                          </h3>
                          
                          {/* Key Cast Section */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Main Cast</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Director */}
                              {project.director && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative mb-4">
                                    <img
                                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                                      alt={project.director}
                                      className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">★</span>
                                    </div>
                                  </div>
                                  <div className="text-center mb-4">
                                    <h5 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
                                      {project.director}
                                    </h5>
                                    <p className="text-blue-400 font-semibold text-sm">Director</p>
                                  </div>
                                  <div className="mb-4">
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                      Director
                                    </span>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              )}
                              
                              {/* Lead Actor */}
                              {(project as any).actor && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.1 }}
                                  className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative mb-4">
                                    <img
                                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
                                      alt={(project as any).actor}
                                      className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-green-500 transition-colors duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">⭐</span>
                                    </div>
                                  </div>
                                  <div className="text-center mb-4">
                                    <h5 className="text-lg font-bold text-white mb-1 group-hover:text-green-400 transition-colors duration-300">
                                      {(project as any).actor}
                                    </h5>
                                    <p className="text-green-400 font-semibold text-sm">Lead Actor</p>
                                  </div>
                                  <div className="mb-4">
                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                      Lead Role
                                    </span>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              )}
                              
                              {/* Lead Actress */}
                              {(project as any).actress && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative mb-4">
                                    <img
                                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
                                      alt={(project as any).actress}
                                      className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-pink-500 transition-colors duration-300"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">⭐</span>
                                    </div>
                                  </div>
                                  <div className="text-center mb-4">
                                    <h5 className="text-lg font-bold text-white mb-1 group-hover:text-pink-400 transition-colors duration-300">
                                      {(project as any).actress}
                                    </h5>
                                    <p className="text-pink-400 font-semibold text-sm">Lead Actress</p>
                                  </div>
                                  <div className="mb-4">
                                    <span className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded-full">
                                      Lead Role
                                    </span>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              )}
                              
                              {/* Production House */}
                              {project.productionHouse && (
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                  className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative mb-4">
                                    <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-gray-600 group-hover:border-purple-500 transition-colors duration-300 mx-auto flex items-center justify-center">
                                      <Film className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">🎬</span>
                                    </div>
                                  </div>
                                  <div className="text-center mb-4">
                                    <h5 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors duration-300">
                                      {project.productionHouse}
                                    </h5>
                                    <p className="text-purple-400 font-semibold text-sm">Production House</p>
                                  </div>
                                  <div className="mb-4">
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                      Producer
                                    </span>
                                  </div>
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Key People Section */}
                          {(project as any).keyPeople && (project as any).keyPeople.length > 0 && (
                            <div className="mb-8">
                              <h4 className="text-xl font-bold text-white mb-6">Additional Crew</h4>
                              <div className="flex flex-wrap gap-3">
                                {(project as any).keyPeople.map((person: string, index: number) => (
                                  <span 
                                    key={index}
                                    className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-full border border-gray-600/50 hover:bg-gray-600/50 hover:text-white transition-all duration-300"
                                  >
                                    {person}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Role Filters */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Browse by Role</h4>
                            <div className="flex flex-wrap gap-3">
                            {['All', 'Director', 'Actor', 'Producer', 'Composer', 'Cinematographer'].map((role) => (
                              <button
                                key={role}
                                className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-blue-500/20 hover:text-blue-300 border border-gray-600/50 hover:border-blue-500/50 transition-all duration-300"
                              >
                                {role}
                              </button>
                            ))}
                            </div>
                          </div>
                          
                          {/* Additional Cast Grid - keeping some sample data for now */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              {
                                name: 'Music Director',
                                role: 'Composer',
                                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                                bio: 'Versatile music composer with chart-topping hits',
                                films: ['Various soundtracks'],
                                awards: 8,
                                rating: 4.6
                              },
                              {
                                name: 'Cinematographer',
                                role: 'Director of Photography',
                                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                                bio: 'Award-winning cinematographer with stunning visual storytelling',
                                films: ['Visual masterpieces'],
                                awards: 10,
                                rating: 4.5
                              }
                            ].map((member, index) => (
                              <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                              >
                                {/* Avatar */}
                                <div className="relative mb-4">
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-600 group-hover:border-blue-500 transition-colors duration-300"
                                  />
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{member.rating}</span>
                                  </div>
                                </div>
                                
                                {/* Name & Role */}
                                <div className="text-center mb-4">
                                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">
                                    {member.name}
                                  </h4>
                                  <p className="text-blue-400 font-semibold text-sm">{member.role}</p>
                                </div>
                                
                                {/* Bio */}
                                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                  {member.bio}
                                </p>
                                
                                {/* Stats */}
                                <div className="flex justify-between items-center mb-4">
                                  <div className="text-center">
                                    <p className="text-white font-bold">{member.awards}</p>
                                    <p className="text-gray-400 text-xs">Awards</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-white font-bold">{member.films.length}</p>
                                    <p className="text-gray-400 text-xs">Films</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-white font-bold">{member.rating}</p>
                                    <p className="text-gray-400 text-xs">Rating</p>
                                  </div>
                                </div>
                                
                                {/* Notable Films */}
                                <div className="mb-4">
                                  <p className="text-gray-500 text-xs mb-2">Notable Films:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {member.films.slice(0, 3).map((film) => (
                                      <span key={film} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-full">
                                        {film}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* IMDb Link */}
                                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                  View IMDb Profile
                                </button>
                                
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'story' && (
                      <div className="space-y-8">
                        {/* Story & Plot */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-teal-400" />
                            Story & Plot
                          </h3>
                          
                          {/* Story Overview */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-4">Synopsis</h4>
                            <p className="text-gray-300 leading-relaxed text-lg">
                              Set against the backdrop of a bustling Indian metropolis, "The Dream Chasers" follows the journey of three friends from different walks of life who come together to pursue their shared passion for filmmaking. When they discover an old, abandoned cinema hall that holds the key to their dreams, they embark on an emotional rollercoaster filled with laughter, tears, and the unbreakable bonds of friendship.
                            </p>
                          </div>
                          
                          {/* Story Elements Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="text-4xl mb-3">🎭</div>
                              <h5 className="text-white font-bold mb-2">Genre</h5>
                              <p className="text-gray-400 text-sm">Drama, Comedy, Coming-of-Age</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="text-4xl mb-3">🎨</div>
                              <h5 className="text-white font-bold mb-2">Tone</h5>
                              <p className="text-gray-400 text-sm">Heartwarming, Inspirational</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="text-4xl mb-3">🌍</div>
                              <h5 className="text-white font-bold mb-2">Setting</h5>
                              <p className="text-gray-400 text-sm">Mumbai, Present Day</p>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="text-4xl mb-3">🎯</div>
                              <h5 className="text-white font-bold mb-2">Target Audience</h5>
                              <p className="text-gray-400 text-sm">Family, 12+ Years</p>
                            </div>
                          </div>
                          
                          {/* Character Profiles */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Main Characters</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                {
                                  name: 'Arjun',
                                  actor: 'Aamir Khan',
                                  description: 'A struggling filmmaker with big dreams and a bigger heart. His passion for cinema drives the story forward.',
                                  traits: ['Dreamer', 'Leader', 'Optimistic'],
                                  arc: 'From failure to success'
                                },
                                {
                                  name: 'Priya',
                                  actor: 'Deepika Padukone',
                                  description: 'A talented screenwriter who believes in the power of storytelling to change lives.',
                                  traits: ['Creative', 'Determined', 'Wise'],
                                  arc: 'Finding her voice'
                                },
                                {
                                  name: 'Rahul',
                                  actor: 'R. Madhavan',
                                  description: 'A practical businessman who learns to embrace his artistic side through friendship.',
                                  traits: ['Practical', 'Loyal', 'Growth-minded'],
                                  arc: 'Rediscovering passion'
                                }
                              ].map((character, index) => (
                                <motion.div
                                  key={character.name}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
                                >
                                  <h5 className="text-lg font-bold text-white mb-2">{character.name}</h5>
                                  <p className="text-teal-400 text-sm mb-3">Played by {character.actor}</p>
                                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{character.description}</p>
                                  
                                  <div className="mb-4">
                                    <p className="text-gray-500 text-xs mb-2">Key Traits:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {character.traits.map((trait) => (
                                        <span key={trait} className="px-2 py-1 bg-teal-500/20 text-teal-300 text-xs rounded-full">
                                          {trait}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <p className="text-gray-500 text-xs mb-1">Character Arc:</p>
                                    <p className="text-white text-sm font-semibold">{character.arc}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Director's Vision */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-4">Director's Vision</h4>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-start gap-4">
                                <img
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                                  alt="Rajkumar Hirani"
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className="text-white font-bold mb-2">Rajkumar Hirani</h5>
                                  <p className="text-gray-300 leading-relaxed">
                                    "This film is about the magic of cinema and the power of dreams. I wanted to create a story that resonates with every person who has ever dared to dream big. The abandoned cinema hall represents the forgotten dreams of our society, and through our characters, we show how these dreams can be revived and celebrated."
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Themes & Messages */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-4">Themes & Messages</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3">🎬 The Power of Dreams</h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  The film explores how dreams can transform lives and bring people together, even in the face of adversity.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3">🤝 Friendship & Unity</h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  The unbreakable bonds of friendship that help overcome obstacles and achieve the impossible.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3">🎭 Art vs Commerce</h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  The eternal struggle between artistic integrity and commercial success in the entertainment industry.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3">🏛️ Cultural Heritage</h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  Preserving and celebrating the rich cultural heritage of Indian cinema and storytelling traditions.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Background Score Preview */}
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">Background Score Preview</h4>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h5 className="text-white font-bold">"Dreams Never Die"</h5>
                                  <p className="text-gray-400 text-sm">Composed by Pritam</p>
                                </div>
                                <button className="p-3 rounded-full bg-teal-600 hover:bg-teal-700 transition-colors duration-300">
                                  <Play className="w-6 h-6 text-white" />
                                </button>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full w-1/3"></div>
                              </div>
                              <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>1:23</span>
                                <span>4:15</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'gallery' && (
                      <div className="space-y-8">
                        {/* Gallery */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Camera className="w-6 h-6 text-violet-400" />
                            Gallery
                          </h3>
                          
                          {/* Gallery Categories */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {['All', 'Posters', 'Behind the Scenes', 'Concept Art', 'Location Shots'].map((category) => (
                              <button
                                key={category}
                                className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-violet-500/20 hover:text-violet-300 border border-gray-600/50 hover:border-violet-500/50 transition-all duration-300"
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                          
                          {/* Main Gallery Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-violet-500/50 transition-all duration-300 hover:scale-105"
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
                                  <div className="absolute top-3 left-3">
                                    <span className="px-2 py-1 bg-violet-500/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                                      {item.category}
                                    </span>
                                  </div>
                                  
                                  {/* Zoom Icon */}
                                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="p-2 bg-black/50 rounded-full backdrop-blur-sm">
                                      <ExternalLink className="w-4 h-4 text-white" />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Content */}
                                <div className="p-4">
                                  <h4 className="text-white font-bold mb-2 group-hover:text-violet-400 transition-colors duration-300">
                                    {item.title}
                                  </h4>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.description}
                                  </p>
                                </div>
                                
                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Gallery Navigation */}
                          <div className="flex items-center justify-center gap-4 mt-8">
                            <button className="p-3 rounded-full bg-gray-700/50 text-gray-300 hover:bg-violet-500/20 hover:text-violet-300 border border-gray-600/50 hover:border-violet-500/50 transition-all duration-300">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((page) => (
                                <button
                                  key={page}
                                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    page === 1 ? 'bg-violet-500' : 'bg-gray-600 hover:bg-gray-500'
                                  }`}
                                />
                              ))}
                            </div>
                            <button className="p-3 rounded-full bg-gray-700/50 text-gray-300 hover:bg-violet-500/20 hover:text-violet-300 border border-gray-600/50 hover:border-violet-500/50 transition-all duration-300">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'updates' && (
                      <div className="space-y-8">
                        {/* Updates & News */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <MessageCircle className="w-6 h-6 text-amber-400" />
                            Updates & News
                          </h3>
                          
                          {/* Update Categories */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {['All', 'Cast', 'Location', 'Trailer', 'Shooting', 'Music', 'Post-Production'].map((category) => (
                              <button
                                key={category}
                                className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-amber-500/20 hover:text-amber-300 border border-gray-600/50 hover:border-amber-500/50 transition-all duration-300"
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                          
                          {/* Updates Timeline */}
                          <div className="space-y-6">
                            {[
                              {
                                date: '2024-01-15',
                                title: '🎬 Principal Photography Begins!',
                                category: 'Shooting',
                                content: 'The cameras are rolling! Principal photography for "The Dream Chasers" has officially begun at the iconic Marine Drive in Mumbai. The first scene featuring Aamir Khan and Deepika Padukone was shot today, and the energy on set is electric!',
                                author: 'Production Team',
                                image: 'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=400&h=250&fit=crop',
                                isPinned: true,
                                reactions: { likes: 234, comments: 45, shares: 12 }
                              },
                              {
                                date: '2024-01-12',
                                title: '🎭 Deepika Padukone Confirmed as Lead!',
                                category: 'Cast',
                                content: 'Breaking news! Deepika Padukone has officially signed on to play the role of Priya, the talented screenwriter in "The Dream Chasers". Her chemistry with Aamir Khan is going to be absolutely magical!',
                                author: 'Casting Director',
                                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=250&fit=crop',
                                isPinned: false,
                                reactions: { likes: 567, comments: 89, shares: 34 }
                              },
                              {
                                date: '2024-01-10',
                                title: '🎵 Pritam Begins Music Recording',
                                category: 'Music',
                                content: 'The musical journey begins! Pritam has started recording the background score and songs for the film. The first song "Dreams Never Die" featuring Arijit Singh is already creating waves in the recording studio.',
                                author: 'Music Team',
                                image: null,
                                isPinned: false,
                                reactions: { likes: 189, comments: 23, shares: 8 }
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
                            ].map((update, index) => (
                              <motion.div
                                key={update.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 ${
                                  update.isPinned ? 'ring-2 ring-amber-500/30' : ''
                                }`}
                              >
                                {update.isPinned && (
                                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                                    PINNED
                                  </div>
                                )}
                                
                                <div className="flex gap-6">
                                  {/* Image */}
                                  {update.image && (
                                    <div className="flex-shrink-0">
                                      <img
                                        src={update.image}
                                        alt={update.title}
                                        className="w-32 h-24 rounded-xl object-cover"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Content */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full">
                                        {update.category}
                                      </span>
                                      <span className="text-gray-400 text-sm">
                                        {new Date(update.date).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    
                                    <h4 className="text-lg font-bold text-white mb-2 hover:text-amber-400 transition-colors duration-300">
                                      {update.title}
                                    </h4>
                                    
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                      {update.content}
                                    </p>
                                    
                                    {/* Reactions */}
                                    <div className="flex items-center gap-6 mb-4">
                                      <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                          <ThumbsUp className="w-4 h-4" />
                                          {update.reactions.likes}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <MessageSquare className="w-4 h-4" />
                                          {update.reactions.comments}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Share2 className="w-4 h-4" />
                                          {update.reactions.shares}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-500 text-sm">
                                        By {update.author}
                                      </span>
                                      <button className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg hover:bg-amber-500/30 transition-colors duration-300 text-sm font-semibold">
                                        Read More
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Newsletter Signup */}
                          <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                            <h4 className="text-xl font-bold text-white mb-4">Stay Updated</h4>
                            <p className="text-gray-300 mb-4">
                              Get exclusive behind-the-scenes updates, cast announcements, location reveals, and production news delivered to your inbox.
                            </p>
                            <div className="flex gap-4">
                              <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                              />
                              <button className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300">
                                Subscribe
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    {activeTab === 'community' && (
                      <div className="space-y-8">
                        {/* Community */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Users className="w-6 h-6 text-lime-400" />
                            Community
                          </h3>
                          
                          {/* Community Stats */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-white mb-2">1,247</div>
                              <div className="text-gray-400 text-sm">Investors</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-white mb-2">89</div>
                              <div className="text-gray-400 text-sm">Discussions</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-white mb-2">156</div>
                              <div className="text-gray-400 text-sm">Questions</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-white mb-2">4.8</div>
                              <div className="text-gray-400 text-sm">Community Rating</div>
                            </div>
                          </div>
                          
                          {/* Ask a Question */}
                          <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-2xl p-6 border border-lime-500/20 mb-8">
                            <h4 className="text-xl font-bold text-white mb-4">Ask the Director</h4>
                            <p className="text-gray-300 mb-4">
                              Have a question for Rajkumar Hirani or the production team? Ask here and get direct responses!
                            </p>
                            <div className="space-y-4">
                              <input
                                type="text"
                                placeholder="Your question..."
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-500/50 focus:ring-2 focus:ring-lime-500/20"
                              />
                              <button className="px-6 py-3 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl font-semibold hover:from-lime-600 hover:to-green-600 transition-all duration-300">
                                Submit Question
                              </button>
                            </div>
                          </div>
                          
                          {/* Recent Discussions */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Recent Discussions</h4>
                            <div className="space-y-4">
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
                                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:border-lime-500/50 transition-all duration-300"
                                >
                                  <div className="flex items-start gap-4">
                                    <img
                                      src={discussion.avatar}
                                      alt={discussion.author}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h5 className="text-white font-semibold hover:text-lime-400 transition-colors duration-300">
                                          {discussion.title}
                                        </h5>
                                        {discussion.isAnswered && (
                                          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                            Answered
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-400">
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
                          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                            <h4 className="text-xl font-bold text-white mb-4">Community Poll</h4>
                            <p className="text-gray-300 mb-6">Which aspect of the film are you most excited about?</p>
                            <div className="space-y-3">
                              {[
                                { option: 'The star-studded cast', votes: 45, percentage: 45 },
                                { option: 'Rajkumar Hirani\'s direction', votes: 32, percentage: 32 },
                                { option: 'The unique storyline', votes: 18, percentage: 18 },
                                { option: 'The music by Pritam', votes: 5, percentage: 5 }
                              ].map((poll, index) => (
                                <div key={poll.option} className="relative">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-white text-sm">{poll.option}</span>
                                    <span className="text-gray-400 text-sm">{poll.percentage}%</span>
                                  </div>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${poll.percentage}%` }}
                                      transition={{ delay: index * 0.1, duration: 1 }}
                                      className="bg-gradient-to-r from-lime-500 to-green-500 h-2 rounded-full"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 text-center">
                              <span className="text-gray-400 text-sm">100 total votes</span>
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Star className="w-6 h-6 text-rose-400" />
                            Reviews & Testimonials
                          </h3>
                          
                          {/* Overall Rating */}
                          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 mb-8">
                            <div className="flex items-center justify-between mb-6">
                              <div>
                                <div className="text-4xl font-bold text-white mb-2">4.8</div>
                                <div className="flex items-center gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <div className="text-gray-400 text-sm">Based on 1,247 investor reviews</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-rose-400 mb-2">98%</div>
                                <div className="text-gray-400 text-sm">Would recommend</div>
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
                                    <span className="text-white text-sm">{rating.stars}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  </div>
                                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${rating.percentage}%` }}
                                      transition={{ delay: rating.stars * 0.1, duration: 1 }}
                                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full"
                                    />
                                  </div>
                                  <span className="text-gray-400 text-sm w-12 text-right">{rating.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Featured Reviews */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Featured Reviews</h4>
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
                                  className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-rose-500/50 transition-all duration-300"
                                >
                                  <div className="flex items-start gap-4 mb-4">
                                    <img
                                      src={review.avatar}
                                      alt={review.name}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h5 className="text-white font-semibold">{review.name}</h5>
                                        {review.verified && (
                                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                            Verified Investor
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-400">
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
                                  
                                  <p className="text-gray-300 leading-relaxed">
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
                          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                            <h4 className="text-xl font-bold text-white mb-4">What Investors Are Saying</h4>
                            <div className="flex flex-wrap gap-3">
                              {[
                                { tag: 'Transparent Communication', count: 234, color: 'bg-green-500/20 text-green-300' },
                                { tag: 'Great Team', count: 189, color: 'bg-blue-500/20 text-blue-300' },
                                { tag: 'Strong Potential', count: 156, color: 'bg-purple-500/20 text-purple-300' },
                                { tag: 'Amazing Perks', count: 123, color: 'bg-yellow-500/20 text-yellow-300' },
                                { tag: 'Professional', count: 98, color: 'bg-cyan-500/20 text-cyan-300' },
                                { tag: 'Worth Investing', count: 87, color: 'bg-rose-500/20 text-rose-300' }
                              ].map((tag) => (
                                <div
                                  key={tag.tag}
                                  className={`px-4 py-2 rounded-full ${tag.color} text-sm font-semibold`}
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-sky-400" />
                            Frequently Asked Questions
                          </h3>
                          
                          {/* FAQ Categories */}
                          <div className="flex flex-wrap gap-3 mb-8">
                            {['All', 'Investment', 'Project', 'Legal', 'Perks'].map((category) => (
                              <button
                                key={category}
                                className="px-4 py-2 rounded-full bg-gray-700/50 text-gray-300 hover:bg-sky-500/20 hover:text-sky-300 border border-gray-600/50 hover:border-sky-500/50 transition-all duration-300"
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
                                className="bg-gray-900/50 rounded-2xl border border-gray-700/50 hover:border-sky-500/50 transition-all duration-300"
                              >
                                <button
                                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/30 transition-colors duration-300"
                                  onClick={() => {
                                    // Toggle FAQ expansion logic would go here
                                  }}
                                >
                                  <div className="flex-1">
                                    <h4 className="text-white font-semibold mb-2 hover:text-sky-400 transition-colors duration-300">
                                      {faq.question}
                                    </h4>
                                    <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-xs rounded-full">
                                      {faq.category}
                                    </span>
                                  </div>
                                  <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                                </button>
                                <div className="px-6 pb-6">
                                  <p className="text-gray-300 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Contact Support */}
                          <div className="mt-8 bg-gradient-to-r from-sky-500/10 to-blue-500/10 rounded-2xl p-6 border border-sky-500/20">
                            <h4 className="text-xl font-bold text-white mb-4">Still Have Questions?</h4>
                            <p className="text-gray-300 mb-4">
                              Our support team is here to help! Get in touch with us for personalized assistance.
                            </p>
                            <div className="flex gap-4">
                              <button className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-blue-600 transition-all duration-300">
                                Contact Support
                              </button>
                              <button className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl font-semibold hover:bg-gray-600/50 transition-all duration-300">
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
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <FileCheck className="w-6 h-6 text-gray-400" />
                            Legal & Transparency
                          </h3>
                          
                          {/* Compliance Status */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-green-500/10 rounded-2xl p-6 border border-green-500/30 text-center">
                              <ShieldIcon className="w-8 h-8 text-green-400 mx-auto mb-3" />
                              <h4 className="text-white font-bold mb-2">SEBI Compliant</h4>
                              <p className="text-green-300 text-sm">Fully regulated investment platform</p>
                            </div>
                            <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/30 text-center">
                              <AwardIcon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                              <h4 className="text-white font-bold mb-2">ISO Certified</h4>
                              <p className="text-blue-300 text-sm">Quality management certified</p>
                            </div>
                            <div className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/30 text-center">
                              <GlobeIcon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                              <h4 className="text-white font-bold mb-2">GDPR Compliant</h4>
                              <p className="text-purple-300 text-sm">Data protection standards met</p>
                            </div>
                          </div>
                          
                          {/* Legal Documents */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Legal Documents</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {[
                                {
                                  title: 'Investment Agreement',
                                  description: 'Comprehensive contract outlining investor rights and obligations',
                                  size: '2.4 MB',
                                  type: 'PDF',
                                  icon: FileTextIcon
                                },
                                {
                                  title: 'Prospectus',
                                  description: 'Detailed project information and financial projections',
                                  size: '1.8 MB',
                                  type: 'PDF',
                                  icon: FileTextIcon
                                },
                                {
                                  title: 'Risk Disclosure',
                                  description: 'Complete risk assessment and disclosure statement',
                                  size: '1.2 MB',
                                  type: 'PDF',
                                  icon: ShieldIcon
                                },
                                {
                                  title: 'Terms of Service',
                                  description: 'Platform terms and conditions for investors',
                                  size: '0.9 MB',
                                  type: 'PDF',
                                  icon: FileCheckIcon
                                },
                                {
                                  title: 'Privacy Policy',
                                  description: 'How we protect and handle your personal data',
                                  size: '0.7 MB',
                                  type: 'PDF',
                                  icon: ShieldIcon
                                },
                                {
                                  title: 'Compliance Certificate',
                                  description: 'SEBI and regulatory compliance certificates',
                                  size: '1.5 MB',
                                  type: 'PDF',
                                  icon: AwardIcon
                                }
                              ].map((document, index) => (
                                <motion.div
                                  key={document.title}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-300"
                                >
                                  <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gray-800/50 rounded-lg">
                                      <document.icon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-white font-semibold mb-1">{document.title}</h5>
                                      <p className="text-gray-400 text-sm mb-3">{document.description}</p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <span>{document.size}</span>
                                          <span>•</span>
                                          <span>{document.type}</span>
                                        </div>
                                        <button className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors duration-300 text-sm">
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
                            <h4 className="text-xl font-bold text-white mb-6">Investor Protections</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <ShieldIcon className="w-5 h-5 text-green-400" />
                                  Escrow Protection
                                </h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  All investments are held in secure escrow accounts until funding goals are met. Funds are only released to production when milestones are achieved.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <AwardIcon className="w-5 h-5 text-blue-400" />
                                  Insurance Coverage
                                </h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  Comprehensive insurance coverage protects against production delays, accidents, and other unforeseen circumstances that could impact the project.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <FileCheckIcon className="w-5 h-5 text-purple-400" />
                                  Legal Recourse
                                </h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  Investors have full legal recourse through binding arbitration and court proceedings if needed. All contracts are enforceable under Indian law.
                                </p>
                              </div>
                              <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                                  <GlobeIcon className="w-5 h-5 text-cyan-400" />
                                  Transparency
                                </h5>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                  Complete transparency in all financial matters, production progress, and decision-making processes. Regular audits and reporting ensure accountability.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Legal Team */}
                          <div className="mb-8">
                            <h4 className="text-xl font-bold text-white mb-6">Legal Team</h4>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                              <div className="flex items-start gap-6">
                                <img
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
                                  alt="Legal Team"
                                  className="w-20 h-20 rounded-full object-cover"
                                />
                                <div>
                                  <h5 className="text-white font-bold mb-2">Amarchand & Mangaldas</h5>
                                  <p className="text-gray-400 text-sm mb-3">
                                    Leading Indian law firm specializing in entertainment law, corporate governance, and investor protection.
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            <h4 className="text-xl font-bold text-white mb-4">Legal Inquiries</h4>
                            <p className="text-gray-300 mb-4">
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
                      <div className="space-y-8">
                        {/* Project Milestones */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50"
                        >
                          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Target className="w-6 h-6 text-indigo-400" />
                            Project Milestones
                          </h3>
                          
                          {/* Project Timeline */}
                          <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                            
                            {/* Timeline Items */}
                            <div className="space-y-8">
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
                                  className="relative flex items-start gap-6"
                                >
                                  {/* Timeline Dot */}
                                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                                    milestone.status === 'completed' 
                                      ? 'bg-green-500 shadow-lg shadow-green-500/25' 
                                      : milestone.status === 'in-progress'
                                      ? 'bg-yellow-500 shadow-lg shadow-yellow-500/25'
                                      : 'bg-gray-600 shadow-lg'
                                  }`}>
                                    {milestone.icon}
                                  </div>
                                  
                                  {/* Content */}
                                  <div className="flex-1 bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h4 className="text-white font-bold text-lg">{milestone.title}</h4>
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        milestone.status === 'completed' 
                                          ? 'bg-green-500/20 text-green-300' 
                                          : milestone.status === 'in-progress'
                                          ? 'bg-yellow-500/20 text-yellow-300'
                                          : 'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {milestone.status === 'completed' ? 'Completed' : 
                                         milestone.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                                      </span>
                                    </div>
                                    
                                    <p className="text-gray-400 mb-4">{milestone.description}</p>
                                    
                                    <div className="mb-4">
                                      <p className="text-gray-500 text-sm mb-2">Key Achievements:</p>
                                      <ul className="space-y-1">
                                        {milestone.achievements.map((achievement, idx) => (
                                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                            {achievement}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    
                                    <div className="text-indigo-400 font-semibold text-sm">
                                      {milestone.date}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Progress Summary */}
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-green-400 mb-2">2</div>
                              <div className="text-gray-400 text-sm">Completed</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-yellow-400 mb-2">1</div>
                              <div className="text-gray-400 text-sm">In Progress</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-gray-400 mb-2">4</div>
                              <div className="text-gray-400 text-sm">Upcoming</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                              <div className="text-3xl font-bold text-indigo-400 mb-2">29%</div>
                              <div className="text-gray-400 text-sm">Overall Progress</div>
                            </div>
                          </div>
                          
                          {/* Next Milestone */}
                          <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
                            <h4 className="text-xl font-bold text-white mb-4">Next Milestone</h4>
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">🎥</div>
                              <div>
                                <h5 className="text-white font-bold text-lg">Principal Photography</h5>
                                <p className="text-gray-300 mb-2">Main shooting schedule begins with lead cast and key scenes</p>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
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
};

export default ProjectDetailPage; 