import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Award, 
  Users, 
  Film, 
  Gift,
  Crown,
  Ticket,
  Camera,
  Download,
  ExternalLink,
  BarChart3,
  BarChart,
  MapPin,
  Star,
  Trophy,
  Gem
} from 'lucide-react';
import PortfolioAnalytics from './PortfolioAnalytics';
import { dashboardStats, recentActivities } from '../data/dashboard';
import { superstars } from '../data/superstars';
import { investmentService } from '../data/investments';

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

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'perks' | 'circles' | 'portfolio'>('overview');

  const userStats = {
    totalInvested: dashboardStats.totalInvestments,
    totalReturns: dashboardStats.totalReturns,
    activeInvestments: dashboardStats.activeProjects,
    totalPerks: 24,
    circleLevel: 'Producer',
    nextLevel: 'Executive Producer'
  };

  const investments = investmentService.getFormattedInvestments();

  const perks: DashboardPerk[] = [
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
      icon: <Gift className="w-5 h-5" />,
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
  ];

  const circles = [
    {
      name: 'Shah Rukh Khan Circle',
      members: 1250,
      level: 'VIP Member',
      description: 'Exclusive community for SRK film investors',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActivity: '2 hours ago',
      unreadMessages: 5
    },
    {
      name: 'A.R. Rahman Music Circle',
      members: 890,
      level: 'Producer',
      description: 'Music lovers and Rahman project backers',
      avatar: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActivity: '1 day ago',
      unreadMessages: 12
    },
    {
      name: 'Regional Cinema Hub',
      members: 2100,
      level: 'Member',
      description: 'Supporting regional films across India',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActivity: '3 hours ago',
      unreadMessages: 0
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'investments', label: 'My Investments', icon: TrendingUp },
    { id: 'perks', label: 'Perks & Rewards', icon: Gift },
    { id: 'circles', label: 'My Circles', icon: Users },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pt-20 pb-[100px]">
      

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
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 relative">
            Welcome back, <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent relative">
              Rahul
              
            </span>
          </h1>
          <p className="text-gray-300 text-lg flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            Your Entertainment Empire Dashboard
            <Gem className="w-4 h-4 text-purple-400" />
          </p>
        </motion.div>

        {/* Tabs with Hollywood Style */}
        <div className="flex flex-wrap gap-4 mb-8 max-md:grid max-md:grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'investments' | 'perks' | 'circles' | 'portfolio')}
              className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 max-md:w-full border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/20'
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
              <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 text-center sm:text-left relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
                    <DollarSign className="w-6 h-6 text-amber-400" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full  opacity-60"></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      Total Invested
                    </p>
                    <p className="text-white text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                      ₹{(userStats.totalInvested / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-amber-400 font-medium">Box Office Power</p>
                  </div>
                </div>
              </div>

              <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                    <Star className="absolute -top-1 -right-1 w-3 h-3 text-purple-400 " />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      
                      Total Returns
                    </p>
                    <p className="text-white text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ₹{(userStats.totalReturns / 1000).toFixed(1)}K
                    </p>
                    <p className="text-xs text-purple-400 font-medium">Blockbuster Profits</p>
                  </div>
                </div>
              </div>

              <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <Film className="w-6 h-6 text-blue-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full "></div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Camera className="w-3 h-3 text-blue-500" />
                      Active Investments
                    </p>
                    <p className="text-white text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {userStats.activeInvestments}
                    </p>
                    <p className="text-xs text-blue-400 font-medium">Live Productions</p>
                  </div>
                </div>
              </div>

              <div className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                    <Award className="w-6 h-6 text-emerald-400" />
                    <Gem className="absolute -top-1 -right-1 w-3 h-3 text-emerald-400 " />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Gift className="w-3 h-3 text-emerald-500" />
                      Total Perks
                    </p>
                    <p className="text-white text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      {userStats.totalPerks}
                    </p>
                    <p className="text-xs text-emerald-400 font-medium">VIP Rewards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circle Level with Producer Status */}
            <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Producer Crown Animation */}
              <div className="absolute top-4 right-4 opacity-20">
                <Crown className="w-8 h-8 text-amber-400 " />
              </div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-2 flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-400" />
                    Your Producer Status
                  </h3>
                  <p className="text-gray-300 flex items-center gap-2">
                    Current: 
                    <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent font-bold text-lg">
                      {userStats.circleLevel}
                    </span>
                    <Star className="w-4 h-4 text-amber-400 " />
                  </p>
                  <p className="text-xs text-amber-400 mt-1">Entertainment Industry Elite</p>
                </div>
                <div className="relative p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                  <Crown className="w-8 h-8 text-amber-400" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 "></div>
                </div>
              </div>
              
              <div className="mb-4 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400 flex items-center gap-1">
                    
                    Progress to {userStats.nextLevel}
                  </span>
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent font-bold">
                    75%
                  </span>
                </div>
                <div className="relative w-full bg-gray-700/50 rounded-full h-3 overflow-hidden border border-amber-500/20">
                  <div className="relative bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 h-3 rounded-full w-3/4 overflow-hidden shadow-lg shadow-amber-500/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent "></div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm relative z-10 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Invest ₹25K more to unlock Executive Producer benefits
                <Crown className="w-4 h-4 text-amber-400" />
              </p>
            </div>

            {/* Recent Activity with Movie Industry Flair */}
            <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-purple-500/20 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Film Reel Animation */}
              <div className="absolute top-4 right-4 opacity-10">
                <Film className="w-8 h-8 text-purple-400 " />
              </div>
              
              <h3 className="text-white text-2xl font-bold mb-6 relative z-10 flex items-center gap-2">
                <Camera className="w-6 h-6 text-purple-400" />
                Recent Activity
                <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-2 py-1 rounded-full border border-purple-500/30 text-purple-300">
                  Live Feed
                </span>
              </h3>
              <div className="space-y-4 relative z-10">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-3 h-3 rounded-full ${
                          activity.type === 'return' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-400/50' :
                          activity.type === 'investment' ? 'bg-gradient-to-r from-purple-400 to-pink-500 shadow-lg shadow-purple-400/50' :
                          activity.type === 'circle_join' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-400/50' :
                          activity.type === 'project_update' ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg shadow-emerald-400/50' : 
                          'bg-gradient-to-r from-pink-400 to-rose-500 shadow-lg shadow-pink-400/50'
                        }`}>
                          <div className="absolute inset-0 rounded-full  opacity-20"></div>
                        </div>
                        <span className="text-white font-medium">{activity.description}</span>
                        {activity.type === 'return' && <Trophy className="w-4 h-4 text-amber-400" />}
                        {activity.type === 'investment' && <DollarSign className="w-4 h-4 text-purple-400" />}
                        {activity.type === 'circle_join' && <Users className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <div className={`font-bold text-lg ${
                            activity.amount > 0 ? 'text-amber-400' : 'text-pink-400'
                          }`}>
                            {activity.amount > 0 ? '+' : ''}₹{Math.abs(activity.amount).toLocaleString()}
                          </div>
                        )}
                                                  <div className="text-gray-400 text-sm flex items-center gap-1">
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Superstars Section with Celebrity Glamour */}
            <div className="relative p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Star Animation */}
              <div className="absolute top-4 right-4 opacity-20">
                <Star className="w-8 h-8 text-amber-400 " />
              </div>
              
              <h3 className="text-white text-2xl font-bold mb-6 relative z-10 flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                Top Superstars
                <span className="text-xs bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-2 py-1 rounded-full border border-amber-500/30 text-amber-300">
                  Hall of Fame
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
                {superstars.slice(0, 6).map((star) => (
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
                    <p className="text-white text-sm font-medium truncate">{star.name}</p>
                    <p className="text-amber-400 text-xs font-medium">{star.followers}</p>
                    <div className="flex justify-center mt-1">
                      
                    </div>
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
            {investments.map((investment) => (
              <div key={investment.id} className="relative p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-amber-500/20 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-yellow-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Movie Industry Icons */}
                                  <div className="absolute top-4 right-4 opacity-10">
                    {investment.type === 'film' && <Film className="w-6 h-6 text-amber-400" />}
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
                          <h3 className="text-white text-lg sm:text-xl font-bold">{investment.title}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                            investment.type === 'film' ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30' :
                            investment.type === 'music' ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30' :
                            'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30'
                          }`}>
                            {investment.type.toUpperCase()}
                          </span>
                          {investment.returns > 50000 && (
                            <div className="flex items-center gap-1">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <span className="text-xs text-amber-400 font-medium">Blockbuster</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-400 mb-1 sm:mb-2 text-sm flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          {investment.category}
                        </p>
                        <p className="text-gray-300 text-xs sm:text-sm flex items-center gap-1">
                          <Camera className="w-3 h-3 text-purple-400" />
                          Release: {investment.releaseDate}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl sm:text-2xl font-bold mb-1 flex items-center justify-end gap-1 ${
                          investment.returns >= 0 ? 'text-amber-400' : 'text-pink-400'
                        }`}>
                          {investment.returns >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingUp className="w-5 h-5 rotate-180" />}
                          {investment.returns >= 0 ? '+' : ''}₹{Math.abs(investment.returns).toLocaleString()}
                        </div>
                        <div className={`text-xs sm:text-sm font-medium ${
                          investment.returnPercentage >= 0 ? 'text-amber-400' : 'text-pink-400'
                        }`}>
                          {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage}% ROI
                        </div>
                        {investment.returns > 100000 && (
                          <div className="text-xs text-amber-400 font-medium mt-1 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Mega Hit
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-amber-400" />
                          Invested
                        </p>
                        <p className="text-white font-semibold text-sm sm:text-base">₹{investment.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-purple-400" />
                          Current Value
                        </p>
                        <p className="text-white font-semibold text-sm sm:text-base">₹{investment.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                          <Film className="w-3 h-3 text-blue-400" />
                          Status
                        </p>
                        <p className="text-white font-semibold text-sm sm:text-base capitalize">{investment.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                          <Users className="w-3 h-3 text-emerald-400" />
                          Actions
                        </p>
                        <div className="flex gap-1 sm:gap-2">
                          {investment.circleId && (
                            <button 
                              className="relative p-1 sm:p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 text-amber-300 hover:text-amber-200 text-xs font-medium transition-all duration-300 border border-amber-500/30 hover:border-amber-500/50"
                              onClick={() => {
                                // Navigate to circle page
                                window.location.href = `/circles/${investment.circleId}`;
                              }}
                            >
                              <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Enter Circle
                              </span>
                            </button>
                          )}
                          <button className="relative p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="relative p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-300 border border-white/10 hover:border-white/20">
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
                <div key={perk.id} className="relative p-4 sm:p-6 rounded-2xl shadow-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/10 flex flex-col justify-between min-h-[240px] sm:min-h-[200px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 relative z-10">
                    <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20 flex items-center justify-center self-start overflow-hidden group-hover:border-purple-500/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative z-10">{perk.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate text-white flex-1">{perk.title}</h3>
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
                      <p className="text-sm text-gray-300 mb-3 sm:mb-2 truncate">{perk.description}</p>
                      {/* Metadata Row */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-400 mb-3 sm:mb-2">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-white">₹{perk.metadata.estimatedValue?.toLocaleString() || 'N/A'}</span>
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
                            <span className="text-xs text-gray-400 font-medium">
                              +{perk.metadata.tags.length - 1} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-purple-500/10 relative z-10">
                    <span className="text-xs text-gray-500 font-medium">
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
                className="relative p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/5 border border-purple-500/20 hover:border-purple-500/30 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
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
                  />
                  <div className="flex-1 break-words">
                    <h3 className="text-white text-xl font-bold mb-2">{circle.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{circle.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>{circle.members.toLocaleString()} members</span>
                      <span>•</span>
                      <span>
                        Level: <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent font-semibold">{circle.level}</span>
                      </span>
                      <span>•</span>
                      <span>Active {circle.lastActivity}</span>
                    </div>
                  </div>
                  <button className="relative w-full sm:w-auto px-6 py-2 min-h-[48px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 transition-all duration-300 mt-2 sm:mt-0 overflow-hidden group shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">Enter Circle</span>
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
};

export default Dashboard;


