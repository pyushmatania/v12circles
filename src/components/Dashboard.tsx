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
  MapPin
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Rahul</span>
          </h1>
          <p className="text-gray-300 text-lg">Track your investments, perks, and community engagement</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8 max-md:grid max-md:grid-cols-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'investments' | 'perks' | 'circles' | 'portfolio')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 max-md:w-full ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              } ${tab.id === 'portfolio' ? 'max-md:col-span-2' : ''}`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 text-center sm:text-left">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Invested</p>
                    <p className="text-white text-2xl font-bold">₹{(userStats.totalInvested / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Returns</p>
                    <p className="text-white text-2xl font-bold">₹{(userStats.totalReturns / 1000).toFixed(1)}K</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Film className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Active Investments</p>
                    <p className="text-white text-2xl font-bold">{userStats.activeInvestments}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <Award className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Perks</p>
                    <p className="text-white text-2xl font-bold">{userStats.totalPerks}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Circle Level */}
            <div className="p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-2xl font-bold mb-2">Your Circle Level</h3>
                  <p className="text-gray-300">Current: <span className="text-purple-400 font-semibold">{userStats.circleLevel}</span></p>
                </div>
                <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                  <Crown className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to {userStats.nextLevel}</span>
                  <span className="text-purple-400">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm">Invest ₹25K more to unlock Executive Producer benefits</p>
            </div>

            {/* Recent Activity */}
            <div className="p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <h3 className="text-white text-2xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'return' ? 'bg-green-400' :
                        activity.type === 'investment' ? 'bg-blue-400' :
                        activity.type === 'circle_join' ? 'bg-purple-400' :
                        activity.type === 'project_update' ? 'bg-yellow-400' : 'bg-orange-400'
                      }`} />
                      <span className="text-white">{activity.description}</span>
                    </div>
                    <div className="text-right">
                      {activity.amount && (
                        <div className={`font-semibold ${
                          activity.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {activity.amount > 0 ? '+' : ''}₹{Math.abs(activity.amount).toLocaleString()}
                        </div>
                      )}
                      <div className="text-gray-400 text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Superstars Section */}
            <div className="p-8 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
              <h3 className="text-white text-2xl font-bold mb-6">Top Superstars</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {superstars.slice(0, 6).map((star) => (
                  <div key={star.id} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <img 
                        src={star.avatar} 
                        alt={star.name}
                        className="w-full h-full object-cover rounded-full border-2 border-purple-500/30"
                      />
                      {star.verified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium truncate">{star.name}</p>
                    <p className="text-gray-400 text-xs">{star.followers}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {investments.map((investment) => (
              <div key={investment.id} className="p-4 sm:p-6 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <img 
                    src={investment.poster} 
                    alt={investment.title}
                    className="w-full md:w-32 h-40 sm:h-48 md:h-32 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 sm:mb-4">
                      <div>
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-white text-lg sm:text-xl font-bold">{investment.title}</h3>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            investment.type === 'film' ? 'bg-purple-500/20 text-purple-300' :
                            investment.type === 'music' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {investment.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-1 sm:mb-2 text-sm">{investment.category}</p>
                        <p className="text-gray-300 text-xs sm:text-sm">Release: {investment.releaseDate}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl sm:text-2xl font-bold mb-1 ${
                          investment.returns >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {investment.returns >= 0 ? '+' : ''}₹{Math.abs(investment.returns).toLocaleString()}
                        </div>
                        <div className={`text-xs sm:text-sm ${
                          investment.returnPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Invested</p>
                        <p className="text-white font-semibold text-sm sm:text-base">₹{investment.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Current Value</p>
                        <p className="text-white font-semibold text-sm sm:text-base">₹{investment.currentValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Status</p>
                        <p className="text-white font-semibold text-sm sm:text-base">{investment.status}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm">Actions</p>
                        <div className="flex gap-1 sm:gap-2">
                          {investment.circleId && (
                            <button 
                              className="p-1 sm:p-2 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors"
                              onClick={() => {
                                // Navigate to circle page
                                window.location.href = `/circles/${investment.circleId}`;
                              }}
                            >
                              Enter Circle
                            </button>
                          )}
                          <button className="p-1 rounded text-gray-400 hover:text-white">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="p-1 rounded text-gray-400 hover:text-white">
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
                <div key={perk.id} className="p-4 sm:p-6 rounded-2xl shadow-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex flex-col justify-between min-h-[240px] sm:min-h-[200px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/10 flex items-center justify-center self-start">
                      {perk.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg truncate text-white flex-1">{perk.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          perk.type === 'free' ? 'bg-green-100 text-green-700' :
                          perk.type === 'paid' ? 'bg-blue-100 text-blue-700' :
                          perk.type === 'voting' ? 'bg-purple-100 text-purple-700' :
                          perk.type === 'bidding' ? 'bg-orange-100 text-orange-700' :
                          perk.type === 'exclusive' ? 'bg-pink-100 text-pink-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{perk.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          perk.status === 'active' ? 'bg-green-100 text-green-700' :
                          perk.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                          perk.status === 'available' ? 'bg-purple-100 text-purple-700' :
                          perk.status === 'delivered' ? 'bg-gray-100 text-gray-700' :
                          'bg-yellow-100 text-yellow-700'
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
                            <span className="text-blue-400 font-medium">Virtual</span>
                          ) : (
                            <span className="text-green-400 font-medium">In-Person</span>
                          )}
                        </div>
                      </div>
                      {/* Tags */}
                      {showTags && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
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
                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10">
                    <span className="text-xs text-gray-500 font-medium">
                      {perk.date}
                    </span>
                    {perk.metadata.requiresVerification && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold">
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
                  className="relative p-4 md:p-6 rounded-xl md:rounded-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-white/30 transition-all duration-300"
                >
                {circle.unreadMessages > 0 && (
                  <span className="absolute top-4 right-4 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-bold">
                    {circle.unreadMessages}
                  </span>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 flex-wrap">
                  <img
                    src={circle.avatar}
                    alt={circle.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                  />
                  <div className="flex-1 break-words">
                    <h3 className="text-white text-xl font-bold mb-2">{circle.name}</h3>
                    <p className="text-gray-300 text-sm mb-2">{circle.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>{circle.members.toLocaleString()} members</span>
                      <span>•</span>
                      <span>
                        Level: <span className="text-purple-400">{circle.level}</span>
                      </span>
                      <span>•</span>
                      <span>Active {circle.lastActivity}</span>
                    </div>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2 min-h-[48px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-medium hover:from-purple-400 hover:to-blue-400 transition-all duration-300 mt-2 sm:mt-0">
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
};

export default Dashboard;