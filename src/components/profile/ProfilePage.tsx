import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera, 
  Settings, 
  TrendingUp, 
  Award,
  Twitter,
  Linkedin,
  Instagram,
  Bell,
  Shield,
  Save,
  X,
  DollarSign,
  Heart,
  Share2,
  Download
} from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../ThemeContext';
import { investmentService } from '../../data/investments';


// If User type is not exported, define it here based on AuthProvider
type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: string;
  investmentCount: number;
  totalInvested: number;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    twoFactor: boolean;
  };
};

const ProfilePage: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'investments' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<User>(user || ({} as User));
  const [isUploading, setIsUploading] = useState(false);

  // Early return if no user - this prevents any rendering issues
  if (!user) {
    return (
      <div className="min-h-screen pt-20 pb-[100px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'investments', label: 'My Investments', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newAvatarUrl = URL.createObjectURL(file);
      await updateProfile({ avatar: newAvatarUrl });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  // Get investment data from shared service
  const investments = investmentService.getFormattedInvestments();
  const investmentStats = investmentService.getInvestmentStats();
  
  const totalInvested = investmentStats.totalInvested;
  const totalReturns = investmentStats.totalReturns;
  const avgReturn = investmentStats.averageReturnPercentage;

  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 to-white'
        : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative p-8 rounded-2xl backdrop-blur-xl border mb-8 ${
            theme === 'light'
              ? 'light-glass-header'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            
            {/* Avatar Section */}
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/30">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full cursor-pointer hover:bg-purple-500 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  {user.name}
                </h1>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Producer</span>
                </div>
              </div>

              <div className={`flex flex-wrap items-center gap-4 text-sm mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {user.bio && (
                <p className={`mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {user.bio}
                </p>
              )}

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex items-center gap-3">
                  {user.socialLinks.twitter && (
                    <a 
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a 
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a 
                      href={user.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                theme === 'light'
                  ? 'bg-white/50 text-gray-700 hover:bg-white/70 border border-gray-300'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'investments' | 'settings')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : `${theme === 'light' ? 'bg-white/50 text-gray-700 hover:bg-white/70' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light'
                    ? 'bg-white/50 border-white/60'
                    : 'bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/20'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-green-500/20">
                      <DollarSign className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Invested</p>
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        ₹{totalInvested.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light'
                    ? 'bg-white/50 border-white/60'
                    : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-blue-500/20'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Total Returns</p>
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        ₹{totalReturns.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light'
                    ? 'bg-white/50 border-white/60'
                    : 'bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20'
                }`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Avg. Return</p>
                      <p className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {avgReturn.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/50 border-white/60'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { action: 'Invested in Pathaan 2', amount: '₹25,000', time: '2 days ago', type: 'investment' },
                    { action: 'Received returns from Sacred Games 3', amount: '+₹4,000', time: '1 week ago', type: 'return' },
                    { action: 'Joined A.R. Rahman Circle', amount: '', time: '2 weeks ago', type: 'community' },
                    { action: 'Updated profile information', amount: '', time: '3 weeks ago', type: 'profile' }
                  ].map((activity, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                      theme === 'light' ? 'bg-white/50' : 'bg-white/5'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'investment' ? 'bg-blue-400' :
                          activity.type === 'return' ? 'bg-green-400' :
                          activity.type === 'community' ? 'bg-purple-400' : 'bg-gray-400'
                        }`} />
                        <span className={`${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {activity.action}
                        </span>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <div className={`font-semibold ${
                            activity.amount.startsWith('+') ? 'text-green-400' : 
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {activity.amount}
                          </div>
                        )}
                        <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'investments' && (
            <motion.div
              key="investments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {investments.map((investment) => (
                <div key={investment.id} className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  theme === 'light'
                    ? 'bg-white/50 border-white/60'
                    : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                }`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <img 
                      src={investment.poster} 
                      alt={investment.title}
                      className="w-full md:w-32 h-48 md:h-32 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                              {investment.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              investment.type === 'film' ? 'bg-purple-500/20 text-purple-300' :
                              investment.type === 'music' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {investment.type.toUpperCase()}
                            </span>
                          </div>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                            Status: {investment.status}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-2xl font-bold mb-1 ${
                            investment.returns >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {investment.returns >= 0 ? '+' : ''}₹{Math.abs(investment.returns).toLocaleString()}
                          </div>
                          <div className={`text-sm ${
                            investment.returnPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Invested</p>
                          <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{investment.invested.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Current Value</p>
                          <p className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            ₹{investment.currentValue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Return</p>
                          <p className={`font-semibold ${investment.returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {investment.returnPercentage}%
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className={`p-2 rounded-lg transition-colors ${
                            theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}>
                            <Heart className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${
                            theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}>
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-colors ${
                            theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          }`}>
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Account Settings */}
              <div className={`p-6 rounded-2xl backdrop-blur-xl border ${
                theme === 'light'
                  ? 'bg-white/50 border-white/60'
                  : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
              }`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Email Notifications
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Receive updates about your investments
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.preferences.notifications}
                        onChange={(e) => updateProfile({
                          preferences: { ...user.preferences, notifications: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-green-400" />
                      <div>
                        <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Newsletter
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Weekly updates and market insights
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.preferences.newsletter}
                        onChange={(e) => updateProfile({
                          preferences: { ...user.preferences, newsletter: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          Two-Factor Authentication
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.preferences.twoFactor}
                        onChange={(e) => updateProfile({
                          preferences: { ...user.preferences, twoFactor: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className={`p-6 rounded-2xl backdrop-blur-xl border border-red-500/20 ${
                theme === 'light'
                  ? 'bg-red-50/50'
                  : 'bg-gradient-to-br from-red-500/10 to-red-500/5'
              }`}>
                <h3 className="text-xl font-bold mb-6 text-red-400">Danger Zone</h3>
                <div className="space-y-4">
                  <button className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors">
                    Change Password
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full py-3 px-6 border border-red-500 text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className={`absolute inset-0 ${
                  theme === 'light' 
                    ? 'bg-white/80 backdrop-blur-sm' 
                    : 'bg-black/80 backdrop-blur-sm'
                }`}
              />

              <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 50 }}
                  transition={{ duration: 0.3 }}
                  className={`relative w-full max-w-2xl rounded-2xl border overflow-hidden ${
                    theme === 'light'
                      ? 'light-glass-header'
                      : 'bg-gradient-to-br from-gray-900 to-black border-white/20'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Edit Profile
                      </h2>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`p-2 rounded-full transition-colors ${
                          theme === 'light'
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                                : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            Location
                          </label>
                          <input
                            type="text"
                            value={editData.location || ''}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                                : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                          Bio
                        </label>
                        <textarea
                          value={editData.bio || ''}
                          onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                            theme === 'light'
                              ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                              : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            Twitter
                          </label>
                          <input
                            type="url"
                            value={editData.socialLinks?.twitter || ''}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              socialLinks: { ...editData.socialLinks, twitter: e.target.value }
                            })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                                : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                            placeholder="https://twitter.com/username"
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            LinkedIn
                          </label>
                          <input
                            type="url"
                            value={editData.socialLinks?.linkedin || ''}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              socialLinks: { ...editData.socialLinks, linkedin: e.target.value }
                            })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                                : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                            Instagram
                          </label>
                          <input
                            type="url"
                            value={editData.socialLinks?.instagram || ''}
                            onChange={(e) => setEditData({ 
                              ...editData, 
                              socialLinks: { ...editData.socialLinks, instagram: e.target.value }
                            })}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 ${
                              theme === 'light'
                                ? 'border-gray-300 focus:border-purple-500 bg-white text-gray-900'
                                : 'border-gray-600 focus:border-purple-500 bg-gray-800 text-white'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                            placeholder="https://instagram.com/username"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-6">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className={`px-6 py-3 border rounded-xl font-semibold transition-colors ${
                            theme === 'light'
                              ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              : 'border-white/20 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;