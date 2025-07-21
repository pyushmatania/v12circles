import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Award, 
  Trophy, 
  Star, 
  Film, 
  Camera, 
  Gem, 
  Crown,
  BarChart,
  ExternalLink,
  Download,
  MapPin,
  ShoppingBag,
  Ticket
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getTextColor, getBgColor, getBorderColor } from '../utils/themeUtils';
import { dashboardStats, recentActivities } from '../data/dashboard';
import { superstars } from '../data/superstars';
import { portfolioData } from '../data/portfolio';
import { projects } from '../data/projects';
import { comprehensiveCommunityData } from '../data/comprehensiveCommunityData';
import ProfilePage from './profile/ProfilePage';
import PortfolioAnalytics from './PortfolioAnalytics';
import { getUserAvatar } from '../utils/imageUtils';

// 🛡️ Type definitions for better type safety
interface PerkMetadata {
  location?: string;
  maxParticipants?: number;
  currentParticipants?: number;
  virtual: boolean;
  requiresVerification: boolean;
  estimatedValue?: number;
  tags?: string[];
}

interface DashboardPerk {
  id: string;
  title: string;
  type: 'free' | 'paid' | 'voting' | 'bidding' | 'exclusive' | 'limited';
  description: string;
  status: 'active' | 'upcoming' | 'available' | 'delivered';
  date: string;
  icon: React.ReactNode;
  metadata: PerkMetadata;
}

interface Circle {
  name: string;
  members: number;
  level: string;
  description: string;
  avatar: string;
  lastActivity: string;
  unreadMessages: number;
  communityName?: string;
  communityType?: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

type TabType = 'overview' | 'investments' | 'perks' | 'circles' | 'portfolio' | 'profile';

interface DashboardProps {
  setCurrentView?: (view: string) => void;
}

/**
 * 🎯 Dashboard - Optimized version with exact original design preserved
 * @description Main dashboard with performance optimizations while maintaining original styling
 */
const Dashboard: React.FC<DashboardProps> = memo(({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [investmentFilter, setInvestmentFilter] = useState<'all' | 'film' | 'music' | 'web-series'>('all');
  const { theme } = useTheme();

  // 🚀 Memoized user stats for performance
  const userStats = useMemo(() => ({
    totalInvested: dashboardStats.totalInvestments,
    totalReturns: dashboardStats.totalReturns,
    activeInvestments: dashboardStats.activeProjects,
    totalPerks: 24,
    circleLevel: 'Producer',
    nextLevel: 'Executive Producer'
  }), []);

  // 🚀 Memoized investments data with proper mapping and filtering
  const investments = useMemo(() => {
    const mappedInvestments = portfolioData.map((inv) => ({
      ...inv,
      type: inv.projectType,
      poster: inv.projectPoster,
      title: inv.projectName,
      category: inv.sector || inv.projectType,
      releaseDate: inv.investmentDate,
      returns: inv.returnAmount,
      invested: inv.investmentAmount,
      returnPercentage: inv.returnPercentage
    }));
    
    // Apply filter
    if (investmentFilter === 'all') return mappedInvestments;
    return mappedInvestments.filter((inv) => inv.type === investmentFilter);
  }, [investmentFilter]);

  // 🚀 Memoized perks data
  const perks: DashboardPerk[] = useMemo(() => [
    {
      id: '1',
      title: 'Premiere Screening Access',
      type: 'exclusive',
      description: 'VIP access to the movie premiere with red carpet',
      status: 'upcoming',
      date: '2024-06-10',
      icon: <Ticket className="w-5 h-5" />,
      metadata: {
        location: 'Mumbai Multiplex',
        maxParticipants: 100,
        currentParticipants: 45,
        virtual: false,
        requiresVerification: true,
        estimatedValue: 15000,
        tags: ['premiere', 'vip', 'red-carpet']
      }
    },
    {
      id: '2',
      title: 'Signed Poster Collection',
      type: 'limited',
      description: 'Limited edition signed posters from 3 films',
      status: 'delivered',
      date: '2024-02-15',
      icon: <ShoppingBag className="w-5 h-5" />,
      metadata: {
        maxParticipants: 50,
        currentParticipants: 50,
        virtual: true,
        requiresVerification: false,
        estimatedValue: 8000,
        tags: ['signed', 'limited-edition', 'poster']
      }
    },
    {
      id: '3',
      title: 'Behind the Scenes Access',
      type: 'free',
      description: 'Exclusive BTS footage from The Last Village',
      status: 'available',
      date: '2024-03-01',
      icon: <Camera className="w-5 h-5" />,
      metadata: {
        virtual: true,
        requiresVerification: false,
        estimatedValue: 3000,
        tags: ['bts', 'exclusive', 'content']
      }
    },
    {
      id: '4',
      title: 'Executive Producer Credit',
      type: 'exclusive',
      description: 'Your name in end credits of Monsoon Melodies',
      status: 'active',
      date: '2024-03-20',
      icon: <Crown className="w-5 h-5" />,
      metadata: {
        virtual: false,
        requiresVerification: true,
        estimatedValue: 35000,
        tags: ['credits', 'executive-producer', 'recognition']
      }
    },
    {
      id: '5',
      title: 'Community Casting Vote',
      type: 'voting',
      description: 'Vote on cast members for upcoming projects',
      status: 'upcoming',
      date: '2024-04-15',
      icon: <Users className="w-5 h-5" />,
      metadata: {
        maxParticipants: 200,
        currentParticipants: 78,
        virtual: true,
        requiresVerification: true,
        estimatedValue: 5000,
        tags: ['voting', 'casting', 'community']
      }
    },
    {
      id: '6',
      title: 'Set Visit Experience',
      type: 'exclusive',
      description: 'Visit the movie set during filming',
      status: 'available',
      date: '2024-05-20',
      icon: <MapPin className="w-5 h-5" />,
      metadata: {
        location: 'Film City, Mumbai',
        maxParticipants: 20,
        currentParticipants: 12,
        virtual: false,
        requiresVerification: true,
        estimatedValue: 25000,
        tags: ['set-visit', 'exclusive', 'experience']
      }
    }
  ], []);

  // 🚀 Memoized circles data - filtered to only include items that exist in community data
  const circles: Circle[] = useMemo(() => {
    const allCommunityItems = [
      ...comprehensiveCommunityData.movies,
      ...comprehensiveCommunityData.actors,
      ...comprehensiveCommunityData.actresses,
      ...comprehensiveCommunityData.directors,
      ...comprehensiveCommunityData.productionHouses,
      ...comprehensiveCommunityData.musicArtists
    ];

    // Define potential circles with their community item mappings
    const potentialCircles = [
      // Movies that exist in community data
      {
        name: 'Dangal Movie Circle',
        communityName: 'Dangal',
        type: 'movie',
        members: 1850,
        level: 'VIP Member',
        description: 'Exclusive community for Dangal film investors and fans',
        avatar: 'https://image.tmdb.org/t/p/w500/cJRPOLEexI7qp2DKtFfCh7YaaUG.jpg',
        lastActivity: '1 hour ago',
        unreadMessages: 8
      },
      {
        name: '3 Idiots Movie Circle',
        communityName: '3 Idiots',
        type: 'movie',
        members: 2200,
        level: 'Producer',
        description: '3 Idiots film investment community and updates',
        avatar: 'https://image.tmdb.org/t/p/w500/66A9MqXOyVFCssoloscw79z8Tew.jpg',
        lastActivity: '30 minutes ago',
        unreadMessages: 15
      },
      {
        name: 'PK Movie Circle',
        communityName: 'PK',
        type: 'movie',
        members: 1650,
        level: 'Executive Producer',
        description: 'PK film backers and exclusive content',
        avatar: 'https://image.tmdb.org/t/p/w500/pzSN4XWmmU9uDeLu3aUw6OclGeD.jpg',
        lastActivity: '2 hours ago',
        unreadMessages: 3
      },
      {
        name: 'Bajrangi Bhaijaan Movie Circle',
        communityName: 'Bajrangi Bhaijaan',
        type: 'movie',
        members: 1450,
        level: 'VIP Member',
        description: 'Bajrangi Bhaijaan film investors and Salman Khan fans',
        avatar: 'https://image.tmdb.org/t/p/w500/vhlliI7HZZlWfo5d6CiyfBAGLrW.jpg',
        lastActivity: '1 day ago',
        unreadMessages: 7
      },
      {
        name: 'Gully Boy Movie Circle',
        communityName: 'Gully Boy',
        type: 'movie',
        members: 1200,
        level: 'Member',
        description: 'Gully Boy film community and hip-hop culture',
        avatar: 'https://image.tmdb.org/t/p/w500/4RE7TD5TqEXbPKyUHcn7CSeMlrJ.jpg',
        lastActivity: '4 hours ago',
        unreadMessages: 5
      },
      
      // Actors that exist in community data
      {
        name: 'Shah Rukh Khan Circle',
        communityName: 'Shah Rukh Khan',
        type: 'actor',
        members: 3200,
        level: 'Executive Producer',
        description: 'King Khan fan club and film investment community',
        avatar: 'https://image.tmdb.org/t/p/w500/tCEppfUu0g2Luu0rS5VKMoL4eSw.jpg',
        lastActivity: '15 minutes ago',
        unreadMessages: 25
      },
      {
        name: 'Amitabh Bachchan Circle',
        communityName: 'Amitabh Bachchan',
        type: 'actor',
        members: 2800,
        level: 'VIP Member',
        description: 'Big B fan community and film investments',
        avatar: 'https://image.tmdb.org/t/p/w500/u69PvpWqGkywSm0YjFiw77j9eqS.jpg',
        lastActivity: '1 hour ago',
        unreadMessages: 12
      },
      {
        name: 'Aamir Khan Circle',
        communityName: 'Aamir Khan',
        type: 'actor',
        members: 2100,
        level: 'Producer',
        description: 'Mr. Perfectionist fan club and project updates',
        avatar: 'https://image.tmdb.org/t/p/w500/iCBtJHaCmdashFEaFOyO0gSteJk.jpg',
        lastActivity: '3 hours ago',
        unreadMessages: 8
      },
      {
        name: 'Salman Khan Circle',
        communityName: 'Salman Khan',
        type: 'actor',
        members: 2600,
        level: 'VIP Member',
        description: 'Bhai fan community and film investment opportunities',
        avatar: 'https://image.tmdb.org/t/p/w500/n7pKtccmf2jVOz8Qn90q2ThqLge.jpg',
        lastActivity: '2 hours ago',
        unreadMessages: 18
      },
      {
        name: 'Hrithik Roshan Circle',
        communityName: 'Hrithik Roshan',
        type: 'actor',
        members: 1800,
        level: 'Member',
        description: 'Greek God fan club and action film investments',
        avatar: 'https://image.tmdb.org/t/p/w500/5O7WrWe84WDFj7td64NVsobtHf3.jpg',
        lastActivity: '5 hours ago',
        unreadMessages: 5
      },
      
      // Directors that exist in community data
      {
        name: 'Rajkumar Hirani Circle',
        communityName: 'Rajkumar Hirani',
        type: 'director',
        members: 1200,
        level: 'Executive Producer',
        description: 'Hirani film backers and storytelling discussions',
        avatar: 'https://image.tmdb.org/t/p/w500/wNnmF3mzG7kyaTYuFr5uMpHIJSw.jpg',
        lastActivity: '1 day ago',
        unreadMessages: 4
      },
      {
        name: 'Karan Johar Circle',
        communityName: 'Karan Johar',
        type: 'director',
        members: 950,
        level: 'Producer',
        description: 'Karan Johar fan community and romantic cinema',
        avatar: 'https://image.tmdb.org/t/p/w500/zip1x7OXOBxXxcdYvKOgw6MnAWm.jpg',
        lastActivity: '3 hours ago',
        unreadMessages: 7
      },
      {
        name: 'Rohit Shetty Circle',
        communityName: 'Rohit Shetty',
        type: 'director',
        members: 800,
        level: 'Member',
        description: 'Rohit Shetty community and action-comedy films',
        avatar: 'https://image.tmdb.org/t/p/w500/9ZRyKwijT7OAMjIEEPATeTZ2ZQn.jpg',
        lastActivity: '6 hours ago',
        unreadMessages: 1
      },
      
      // Production Houses that exist in community data
      {
        name: 'Yash Raj Films Circle',
        communityName: 'Yash Raj Films',
        type: 'productionHouse',
        members: 3500,
        level: 'Executive Producer',
        description: 'YRF film investors and Bollywood classics',
        avatar: 'https://image.tmdb.org/t/p/w500/lvzN86o3jrP44DIvn4SMBLOl9PF.png',
        lastActivity: '20 minutes ago',
        unreadMessages: 22
      },
      {
        name: 'Dharma Productions Circle',
        communityName: 'Dharma Productions',
        type: 'productionHouse',
        members: 2800,
        level: 'VIP Member',
        description: 'Karan Johar production house community',
        avatar: 'https://image.tmdb.org/t/p/w500/5Ff25ornzVNhm5skuAvMAR556NB.png',
        lastActivity: '1 hour ago',
        unreadMessages: 16
      },
      {
        name: 'Excel Entertainment Circle',
        communityName: 'Excel Entertainment',
        type: 'productionHouse',
        members: 1800,
        level: 'Producer',
        description: 'Farhan Akhtar and Ritesh Sidhwani production house',
        avatar: 'https://image.tmdb.org/t/p/w500/bFoQPEgrOKeQWPBM0RIkfaR3etq.png',
        lastActivity: '2 hours ago',
        unreadMessages: 8
      },
      {
        name: 'T-Series Circle',
        communityName: 'T-Series',
        type: 'productionHouse',
        members: 4200,
        level: 'Executive Producer',
        description: 'Bhushan Kumar production house and music films',
        avatar: 'https://image.tmdb.org/t/p/w500/d3u51JgEP5KwPfxS13ocqvtzZeX.png',
        lastActivity: '10 minutes ago',
        unreadMessages: 35
      },
      {
        name: 'Red Chillies Entertainment Circle',
        communityName: 'Red Chillies Entertainment',
        type: 'productionHouse',
        members: 2400,
        level: 'VIP Member',
        description: 'Shah Rukh Khan production house and VFX films',
        avatar: 'https://image.tmdb.org/t/p/w500/fkrlAFxgAtIHgYJGIQcDggeucKV.png',
        lastActivity: '45 minutes ago',
        unreadMessages: 13
      }
    ];

    // Filter circles to only include those that exist in community data
    return potentialCircles
      .filter(circle => {
        const exists = allCommunityItems.some(item => 
          item.name.toLowerCase() === circle.communityName.toLowerCase() &&
          item.type === circle.type
        );
        return exists;
      })
      .map(circle => ({
        name: circle.name,
        members: circle.members,
        level: circle.level,
        description: circle.description,
        avatar: circle.avatar,
        lastActivity: circle.lastActivity,
        unreadMessages: circle.unreadMessages,
        communityName: circle.communityName, // Add this for navigation
        communityType: circle.type // Add this for navigation
      }));
  }, []);

  // 🚀 Memoized tabs configuration
  const tabs: Tab[] = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'investments', label: 'My Investments', icon: TrendingUp },
    { id: 'perks', label: 'Perks & Rewards', icon: ShoppingBag },
    { id: 'circles', label: 'My Circles', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart }
  ], []);

  // 🚀 Optimized tab change handler
  const handleTabChange = useCallback((tabId: TabType) => {
    setActiveTab(tabId);
  }, []);

  // 🚀 Optimized circle navigation handler
  const handleCircleNavigation = useCallback((circleId: string) => {
    // First, try to find the investment by circleId
    const investment = portfolioData.find(inv => inv.circleId === circleId);
    
    if (investment) {
      // Find the project by projectId
      const project = projects.find(p => p.id === investment.projectId);
      if (!project) {
        console.warn(`Project not found for projectId: ${investment.projectId}`);
        return;
      }

      // Find the corresponding community item
      let communityItem = null;
      
      // Search in movies first
      communityItem = comprehensiveCommunityData.movies.find(item => 
        item.name.toLowerCase() === project.title.toLowerCase()
      );
      
      // If not found in movies, search in other categories
      if (!communityItem) {
        const allItems = [
          ...comprehensiveCommunityData.movies,
          ...comprehensiveCommunityData.actors,
          ...comprehensiveCommunityData.actresses,
          ...comprehensiveCommunityData.directors,
          ...comprehensiveCommunityData.productionHouses,
          ...comprehensiveCommunityData.musicArtists
        ];
        
        communityItem = allItems.find(item => 
          item.name.toLowerCase() === project.title.toLowerCase() ||
          item.name.toLowerCase() === project.director?.toLowerCase() ||
          item.name.toLowerCase() === project.actor?.toLowerCase() ||
          item.name.toLowerCase() === project.actress?.toLowerCase()
        );
      }

      if (communityItem && setCurrentView) {
        // Navigate to community page with the selected item
        setCurrentView('community');
        
        // Store the selected item in localStorage for the Community component to pick up
        localStorage.setItem('selectedCommunityItem', JSON.stringify({
          item: communityItem,
          category: communityItem.type
        }));
        return;
      }
    }

    // If no investment found, try to find by circle name (for circles tab)
    const allItems = [
      ...comprehensiveCommunityData.movies,
      ...comprehensiveCommunityData.actors,
      ...comprehensiveCommunityData.actresses,
      ...comprehensiveCommunityData.directors,
      ...comprehensiveCommunityData.productionHouses,
      ...comprehensiveCommunityData.musicArtists
    ];
    
    // First, try to find the circle in our circles data for direct mapping
    const circle = circles.find(c => c.name === circleId);
    if (circle && circle.communityName && circle.communityType) {
      const communityItem = allItems.find(item => 
        item.name.toLowerCase() === circle.communityName?.toLowerCase() &&
        item.type === circle.communityType
      );

      if (communityItem && setCurrentView) {
        // Navigate to community page with the selected item
        setCurrentView('community');
        
        // Store the selected item in localStorage for the Community component to pick up
        localStorage.setItem('selectedCommunityItem', JSON.stringify({
          item: communityItem,
          category: communityItem.type
        }));
        return;
      }
    }
    
    // Fallback: Try to match by name (remove "Circle" suffix and common words)
    const cleanCircleName = circleId
      .replace(/\s*Circle\s*$/i, '')
      .replace(/\s*Movie\s*$/i, '')
      .toLowerCase();
    
    const communityItem = allItems.find(item => 
      item.name.toLowerCase().includes(cleanCircleName) ||
      cleanCircleName.includes(item.name.toLowerCase())
    );

    if (communityItem && setCurrentView) {
      // Navigate to community page with the selected item
      setCurrentView('community');
      
      // Store the selected item in localStorage for the Community component to pick up
      localStorage.setItem('selectedCommunityItem', JSON.stringify({
        item: communityItem,
        category: communityItem.type
      }));
    } else {
      console.warn(`Community item not found for circle: ${circleId}`);
      // Fallback to community page without specific item
      if (setCurrentView) {
        setCurrentView('community');
      }
    }
  }, [setCurrentView, circles]);

  // 🚀 Memoized recent activities (first 4)
  const recentActivitiesDisplay = useMemo(() => 
    recentActivities.slice(0, 4), 
    []
  );

  // 🚀 Memoized superstars (first 6)
  const superstarsDisplay = useMemo(() => 
    superstars.slice(0, 6), 
    []
  );

  return (
    <div className={`min-h-screen pt-20 pb-[100px] ${
      theme === 'light' 
        ? 'bg-pink-100' 
        : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* Header with Bollywood Glamour */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 relative"
        >
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full opacity-20 "></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-30 "></div>
          
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 relative ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>
            Welcome back, <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent relative">
              Akash Matania
            </span>
          </h1>
          <p className={`text-lg flex items-center gap-2 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
                                <Crown className={`w-5 h-5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
            Your Entertainment Empire Dashboard
            <Gem className="w-4 h-4 text-purple-400" />
          </p>
        </motion.div>

        {/* Tabs with Hollywood Style */}
        <div className="flex flex-wrap gap-4 mb-8 max-md:grid max-md:grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as TabType)}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 max-md:w-full border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40 shadow-lg shadow-amber-500/20' + (theme === 'light' ? ' text-amber-700' : ' text-amber-300')
                  : theme === 'light'
                    ? 'bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 border-gray-200 hover:border-gray-300 shadow-sm'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border-white/10 hover:border-white/20'
              } ${tab.id === 'portfolio' ? 'max-md:col-span-2' : ''}`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl"></div>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <ProfilePage />
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Cards with Entertainment Industry Luxury */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200 hover:border-purple-500/30 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/30'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 text-center sm:text-left relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                    <DollarSign className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full  opacity-60"></div>
                  </div>
                  <div>
                    <p className={`text-sm flex items-center gap-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <Trophy className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-500'}`} />
                      Total Invested
                    </p>
                    <p className={`text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      ₹{(userStats.totalInvested / 1000).toFixed(0)}K
                    </p>
                                            <p className={`text-xs font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-600'}`}>Box Office Power</p>
                  </div>
                </div>
              </div>

              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                theme === 'light'
                  ? 'bg-white/80 border-gray-200 hover:border-purple-500/30 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-purple-500/30'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <Star className="absolute -top-1 -right-1 w-3 h-3 text-purple-400 " />
                  </div>
                  <div>
                    <p className={`text-sm flex items-center gap-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Total Returns
                    </p>
                    <p className={`text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      ₹{(userStats.totalReturns / 1000).toFixed(1)}K
                    </p>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>Blockbuster Profits</p>
                  </div>
                </div>
              </div>

              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                theme === 'light'
                  ? 'bg-white/80 border-blue-500/30 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-blue-500/30'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <Film className="w-6 h-6 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full "></div>
                  </div>
                  <div>
                    <p className={`text-sm flex items-center gap-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <Camera className="w-3 h-3 text-blue-500" />
                      Active Investments
                    </p>
                    <p className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {userStats.activeInvestments}
                    </p>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>Live Productions</p>
                  </div>
                </div>
              </div>

              <div className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                theme === 'light'
                  ? 'bg-white/80 border-emerald-500/30 shadow-lg'
                  : 'bg-white/5 border-white/10 hover:border-emerald-500/30'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <Gem className="absolute -top-1 -right-1 w-3 h-3 text-emerald-400 " />
                  </div>
                  <div>
                    <p className={`text-sm flex items-center gap-1 ${
                      theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      <ShoppingBag className="w-3 h-3 text-emerald-500" />
                      Total Perks
                    </p>
                    <p className={`text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent ${
                      theme === 'light' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {userStats.totalPerks}
                    </p>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`}>VIP Benefits</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circle Level with Producer Status */}
            <div className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden ${
              theme === 'light' 
                ? 'bg-white/90 border border-gray-200 hover:border-amber-300 shadow-lg' 
                : 'bg-white/5 border border-white/10 hover:border-amber-500/20'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Producer Crown Animation */}
              <div className="absolute top-4 right-4 opacity-20">
                <Crown className={`w-8 h-8 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
              </div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${getTextColor(theme, 'primary')}`}>
                    <Trophy className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                    Your Producer Status
                  </h3>
                  <p className={`flex items-center gap-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                    Current: 
                    <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 bg-clip-text text-transparent font-bold text-lg">
                      {userStats.circleLevel}
                    </span>
                    <Star className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  </p>
                  <p className={`text-xs mt-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-600'}`}>Entertainment Industry Elite</p>
                </div>
                <div className="relative p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                  <Crown className={`w-8 h-8 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 "></div>
                </div>
              </div>
              
              <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className={`flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                    Progress to {userStats.nextLevel}
                  </span>
                  <span className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-800 bg-clip-text text-transparent font-bold">
                    75%
                  </span>
                </div>
                <div className={`relative w-full rounded-full h-3 overflow-hidden border border-amber-500/20 ${
                  theme === 'light' ? 'bg-gray-200' : 'bg-gray-700/50'
                }`}>
                  <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 h-3 rounded-full w-3/4 overflow-hidden shadow-lg shadow-amber-500/30">
                  </div>
                </div>
              </div>
              
              <p className={`text-sm relative z-10 flex items-center gap-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                <DollarSign className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                Invest ₹25K more to unlock Executive Producer benefits
                <Crown className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
              </p>
            </div>

            {/* Recent Activities Section */}
            <div className={`relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${getBgColor(theme, 'card')} ${getBorderColor(theme)} hover:border-amber-500/30`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <h3 className={`text-2xl font-bold mb-2 flex items-center gap-2 ${getTextColor(theme, 'primary')}`}>
                <Award className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                Recent Activities
              </h3>
              <p className={`flex items-center gap-2 ${getTextColor(theme, 'secondary')}`}>
                <Users className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-500'}`} />
                Your latest investment activities and updates
              </p>
              <div className="space-y-4 relative z-10">
                {recentActivitiesDisplay.map((activity) => (
                  <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 group ${
                    theme === 'light' 
                      ? 'bg-amber-50 border-amber-200 hover:border-amber-300' 
                      : 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:border-amber-500/40'
                  }`}>
                    <div className="relative p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                      {activity.type === 'investment' && <DollarSign className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />}
                      {activity.type === 'return' && <TrendingUp className="w-4 h-4 text-green-400" />}
                      {activity.type === 'perk' && <ShoppingBag className="w-4 h-4 text-purple-400" />}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full opacity-60"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${getTextColor(theme, 'primary')}`}>{activity.description}</span>
                        <span className={`text-xs ${getTextColor(theme, 'muted')}`}>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      {activity.amount && (
                        <div className={`text-xs ${getTextColor(theme, 'muted')} flex items-center gap-1`}>
                          <DollarSign className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-500'}`} />
                          ₹{activity.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Superstars Section with Celebrity Glamour */}
            <div className={`relative p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden ${
              theme === 'light' 
                ? 'bg-white/90 border border-gray-200 hover:border-amber-300 shadow-lg' 
                : 'bg-white/5 border border-white/10 hover:border-amber-500/20'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Star Animation */}
              <div className="absolute top-4 right-4 opacity-20">
                <Star className={`w-8 h-8 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
              </div>
              
              <h3 className={`text-2xl font-bold mb-6 relative z-10 flex items-center gap-2 ${getTextColor(theme, 'primary')}`}>
                <Crown className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                Top Superstars
                <span className={`text-xs bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-2 py-1 rounded-full border border-amber-500/30 ${
                  theme === 'light' ? 'text-amber-700' : 'text-amber-300'
                }`}>
                  Hall of Fame
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
                {superstarsDisplay.map((star) => (
                  <div key={star.id} className="text-center group">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <img 
                        src={star.avatar} 
                        alt={star.name}
                        className="w-full h-full object-cover rounded-full border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 shadow-lg shadow-amber-500/20"
                      />
                      {star.status === 'verified' && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/50">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <p className={`text-sm font-medium truncate ${getTextColor(theme, 'primary')}`}>{star.name}</p>
                    <p className={`text-xs font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-600'}`}>{star.followers}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Investments Tab with Movie Portfolio Style */}
        {activeTab === 'investments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(['all', 'film', 'music', 'web-series'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setInvestmentFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${
                    investmentFilter === filter
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30 shadow-lg shadow-amber-500/20' + (theme === 'light' ? ' text-amber-700' : ' text-amber-300')
                      : theme === 'light'
                        ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:border-gray-300'
                        : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {filter === 'web-series' ? 'Web Series' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            {investments.map((investment) => (
              <div key={investment.id} className={`relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl transition-all duration-300 group overflow-hidden ${
                theme === 'light' 
                  ? 'bg-white/90 border border-gray-200 hover:border-amber-300' 
                  : 'bg-white/5 border border-white/10 hover:border-amber-500/20'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Movie Industry Icons */}
                                  <div className="absolute top-4 right-4 opacity-10">
                    {investment.type === 'film' && <Film className={`w-6 h-6 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />}
                    {investment.type === 'music' && <Camera className="w-6 h-6 text-purple-400" />}
                  </div>
                
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 relative z-10">
                  <div className="relative">
                    <img 
                      src={investment.poster} 
                      alt={investment.title}
                      className="w-full md:w-32 h-40 sm:h-48 md:h-32 object-cover rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 shadow-lg shadow-amber-500/10"
                    />
                    {/* Golden Frame Effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 sm:mb-4">
                      <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <h3 className={`text-lg sm:text-xl font-bold ${getTextColor(theme, 'primary')}`}>{investment.title}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                            investment.type === 'film' ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30' + (theme === 'light' ? ' text-amber-700' : ' text-amber-300') :
                            investment.type === 'music' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30' :
                            'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {investment.type.toUpperCase()}
                          </span>
                          {investment.returns > 50000 && (
                            <div className="flex items-center gap-1">
                              <Trophy className={`w-4 h-4 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                              <span className={`text-xs font-medium ${theme === 'light' ? 'text-amber-700' : 'text-amber-600'}`}>Blockbuster</span>
                            </div>
                          )}
                        </div>
                        <p className={`mb-1 sm:mb-2 text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                                      <Star className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                          {investment.category}
                        </p>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          <Camera className="w-3 h-3 text-purple-400" />
                          Release: {investment.releaseDate}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl sm:text-2xl font-bold mb-1 flex items-center justify-end gap-1 ${
                          investment.returns >= 0 ? (theme === 'light' ? 'text-amber-600' : 'text-amber-400') : 'text-pink-400'
                        }`}>
                          {investment.returns >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                          {investment.returns >= 0 ? '+' : ''}₹{Math.abs(investment.returns).toLocaleString()}
                        </div>
                        <div className={`text-xs sm:text-sm font-medium ${
                          investment.returnPercentage >= 0 ? (theme === 'light' ? 'text-amber-600' : 'text-amber-400') : 'text-pink-400'
                        }`}>
                          {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage}% ROI
                        </div>
                        {investment.returns > 100000 && (
                          <div className={`text-xs font-medium mt-1 flex items-center gap-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-600'}`}>
                            <Crown className="w-3 h-3" />
                            Mega Hit
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <DollarSign className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                          Invested
                        </p>
                        <p className={`font-semibold text-sm sm:text-base ${getTextColor(theme, 'primary')}`}>₹{investment.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          Current Value
                        </p>
                        <p className={`font-semibold text-sm sm:text-base ${getTextColor(theme, 'primary')}`}>₹{investment.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Film className="w-3 h-3 text-blue-400" />
                          Status
                        </p>
                        <p className={`font-semibold text-sm sm:text-base capitalize ${getTextColor(theme, 'primary')}`}>{investment.status}</p>
                      </div>
                      <div>
                        <p className={`text-xs sm:text-sm flex items-center gap-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Users className="w-3 h-3 text-emerald-400" />
                          Actions
                        </p>
                        <div className="flex gap-1 sm:gap-2">
                          {investment.circleId && (
                            <button 
                              className={`relative p-1 sm:p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-xs font-medium transition-all duration-300 border border-amber-500/30 hover:border-amber-500/50 ${
                                theme === 'light' ? 'text-amber-700 hover:text-amber-800' : 'text-amber-300 hover:text-amber-200'
                              }`}
                              onClick={() => handleCircleNavigation(investment.circleId)}
                            >
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Enter Circle
                              </span>
                            </button>
                          )}
                          <button className={`relative p-1 rounded-lg transition-all duration-300 ${
                            theme === 'light' 
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300' 
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
                          }`}>
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className={`relative p-1 rounded-lg transition-all duration-300 ${
                            theme === 'light' 
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300' 
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20'
                          }`}>
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Perks Tab */}
        {activeTab === 'perks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {perks.map((perk) => {
              const showLocation = !perk.metadata.virtual && perk.metadata.location;
              const showParticipants = perk.metadata.maxParticipants && perk.metadata.maxParticipants > 0;
              const showTags = perk.metadata.tags && perk.metadata.tags.length > 0;
              return (
                <div key={perk.id} className={`relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                  theme === 'light'
                    ? 'bg-white/80 border-gray-200 hover:border-purple-500/30 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 relative z-10">
                    <div className={`relative p-3 rounded-xl flex items-center justify-center self-start overflow-hidden transition-all duration-300 ${
                      theme === 'light' 
                        ? 'bg-purple-100 border border-purple-200 group-hover:border-purple-300' 
                        : 'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20 group-hover:border-purple-500/30'
                    }`}>
                      {perk.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className={`font-bold text-lg truncate flex-1 ${getTextColor(theme, 'primary')}`}>{perk.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          perk.type === 'free' ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' :
                          perk.type === 'paid' ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 text-pink-300 border border-pink-500/30' :
                          perk.type === 'voting' ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-300 border border-blue-500/30' :
                          perk.type === 'bidding' ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' :
                          perk.type === 'exclusive' ? 'bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30' :
                          'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-300 border border-blue-500/30'
                        }`}>{perk.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          perk.status === 'active' ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' :
                          perk.status === 'upcoming' ? 'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 text-pink-300 border border-pink-500/30' :
                          perk.status === 'available' ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-300 border border-blue-500/30' :
                          perk.status === 'delivered' ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-gradient-to-r from-pink-500/20 via-blue-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30'
                        }`}>{perk.status}</span>
                      </div>
                      <p className={`text-sm mb-3 sm:mb-2 truncate ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{perk.description}</p>
                      {/* Metadata Row */}
                      <div className={`flex flex-wrap items-center gap-3 sm:gap-4 text-xs mb-3 sm:mb-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className={`font-semibold ${getTextColor(theme, 'primary')}`}>₹{perk.metadata.estimatedValue?.toLocaleString() || 'N/A'}</span>
                        </div>
                        {showLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{perk.metadata.location}</span>
                          </div>
                        )}
                        {showParticipants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{perk.metadata.currentParticipants || 0}/{perk.metadata.maxParticipants}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          {perk.metadata.virtual ? (
                            <span className="text-purple-400 font-medium">Virtual</span>
                          ) : (
                            <span className="text-pink-400 font-medium">In-Person</span>
                          )}
                        </div>
                      </div>
                      {/* Tags */}
                      {showTags && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 text-xs rounded-full font-medium border border-purple-500/30">
                            {perk.metadata.tags?.[0]}
                          </span>
                          {perk.metadata.tags && perk.metadata.tags.length > 1 && (
                            <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                              +{perk.metadata.tags.length - 1} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-purple-500/10 relative z-10">
                    <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>
                      {perk.date}
                    </span>
                    {perk.metadata.requiresVerification && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 text-purple-300 text-xs rounded-full font-semibold border border-purple-500/30">
                        Verification Required
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Circles Tab */}
        {activeTab === 'circles' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4 md:gap-6"
          >
            {circles.map((circle) => (
              <div
                key={circle.name}
                className={`relative p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-xl border transition-all duration-300 group overflow-hidden ${
                  theme === 'light'
                    ? 'bg-white/80 border-gray-200 hover:border-purple-300 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                }`}
              >
                {circle.unreadMessages > 0 && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-bold shadow-lg shadow-purple-500/50 z-20">
                    {circle.unreadMessages}
                  </span>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap relative z-10">
                  <img
                    src={circle.avatar}
                    alt={circle.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = getUserAvatar('Community Bot');
                    }}
                  />
                  <div className="flex-1 break-words">
                    <h3 className={`text-xl font-bold mb-2 ${getTextColor(theme, 'primary')}`}>{circle.name}</h3>
                    <p className={`text-sm mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>{circle.description}</p>
                    <div className={`flex flex-wrap items-center gap-4 text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span>{circle.members.toLocaleString()} members</span>
                      <span>•</span>
                      <span>
                        Level: <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">{circle.level}</span>
                      </span>
                      <span>•</span>
                      <span>Active {circle.lastActivity}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCircleNavigation(circle.name)}
                    className="relative w-full sm:w-auto px-6 py-2 min-h-[48px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 transition-all duration-300 mt-2 sm:mt-0 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40"
                  >
                    Enter Circle
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PortfolioAnalytics />
          </motion.div>
        )}

      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;


