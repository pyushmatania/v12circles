import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Bell,
  Calendar,
  DollarSign, 
  Film, 
  Gift, 
  Hash,
  Info, 
  MessageCircle,
  Music,
  TrendingUp,
  Trash2,
  Tv,
  User,
  ArrowLeft,
  Users,
  Share2,
  Star,
  Award,
  X
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import generateRealNotifications from '../utils/notificationsAggregator';
import { getUserAvatar } from '../utils/imageUtils';

// Add channel avatar mapping function
const getChannelAvatar = (name: string) => {
  return getUserAvatar(name);
};

// Notification types interface
interface NotificationUser {
  id: string;
  name: string;
  avatar: string;
}

interface NotificationProject {
  id: string;
  title: string;
  type: string;
}

interface NotificationChannel {
  id: string;
  name: string;
  avatar: string;
}

interface NotificationEvent {
  id: string;
  title: string;
  attendees: number;
}

interface NotificationAchievement {
  id: string;
  name: string;
  icon: string;
}

interface Notification {
  id: string;
  type: string;
  category: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
  action: string;
  project?: NotificationProject;
  user?: NotificationUser;
  channel?: NotificationChannel;
  event?: NotificationEvent;
  achievement?: NotificationAchievement;
}

// Use real notifications generated from actual project and community data
const mockNotifications: Notification[] = generateRealNotifications();

interface NotificationCenterProps {
  onClose?: () => void;
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail') => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, setCurrentView }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  // Enhanced filter types with categories - Awesome colors
  const filters = [
    { id: 'all', label: 'All', icon: Bell, color: 'bg-gradient-to-r from-gray-500 to-gray-600' },
    { id: 'community', label: 'Enter Circles', icon: Users, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { id: 'friends', label: 'Friends', icon: User, color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { id: 'project', label: 'Project', icon: Film, color: 'bg-gradient-to-r from-green-500 to-green-600' },
    { id: 'system', label: 'System', icon: Info, color: 'bg-gradient-to-r from-orange-500 to-orange-600' }
  ];

  // Get unread count for badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    return notification.category === activeFilter;
  });

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Toggle notification expansion
  const toggleExpand = (id: string) => {
    setIsExpanded({
      ...isExpanded,
      [id]: !isExpanded[id]
    });
    markAsRead(id);
  };

  // Get icon component for notification type
  const getNotificationIcon = (notification: { icon?: React.ComponentType<{ className?: string }>; type: string }) => {
    // Use the icon directly from the notification if available
    if (notification.icon) {
      const IconComponent = notification.icon;
      return <IconComponent className="w-6 h-6" />;
    }
    
    // Fallback based on type
    switch (notification.type) {
      case 'investment': return <DollarSign className="w-6 h-6" />;
      case 'return': return <TrendingUp className="w-6 h-6" />;
      case 'perk': return <Gift className="w-6 h-6" />;
      case 'event': return <Calendar className="w-6 h-6" />;
      case 'funding': return <TrendingUp className="w-6 h-6" />;
      case 'message': return <MessageCircle className="w-6 h-6" />;
      case 'system': return <Info className="w-6 h-6" />;
      case 'friend_joined': return <User className="w-6 h-6" />;
      case 'friend_request': return <User className="w-6 h-6" />;
      case 'friend_message': return <MessageCircle className="w-6 h-6" />;
      case 'friend_investment': return <DollarSign className="w-6 h-6" />;
      case 'friend_recommendation': return <Star className="w-6 h-6" />;
      case 'friend_activity': return <Share2 className="w-6 h-6" />;
      case 'channel_update': return <Hash className="w-6 h-6" />;
      case 'community_event': return <Users className="w-6 h-6" />;
      case 'achievement': return <Award className="w-6 h-6" />;
      default: return <Bell className="w-6 h-6" />;
    }
  };

  // Enhanced color system for different notification types
  const getNotificationColor = (type: string, category: string) => {
    // Category-based colors
    if (category === 'community') {
      switch (type) {
        case 'friend_joined': 
          return theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/30 text-purple-400';
        case 'channel_update': 
          return theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/30 text-indigo-400';
        case 'friend_investment': 
          return theme === 'light' ? 'bg-cyan-100 text-cyan-600' : 'bg-cyan-900/30 text-cyan-400';
        case 'community_event': 
          return theme === 'light' ? 'bg-orange-100 text-orange-600' : 'bg-orange-900/30 text-orange-400';
        case 'achievement': 
          return theme === 'light' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/30 text-yellow-400';
        default: 
          return theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/30 text-purple-400';
      }
    }
    
    if (category === 'friends') {
      switch (type) {
        case 'friend_request': 
          return theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400';
        case 'friend_message': 
          return theme === 'light' ? 'bg-pink-100 text-pink-600' : 'bg-pink-900/30 text-pink-400';
        case 'friend_recommendation': 
          return theme === 'light' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-900/30 text-emerald-400';
        case 'friend_activity': 
          return theme === 'light' ? 'bg-teal-100 text-teal-600' : 'bg-teal-900/30 text-teal-400';
        default: 
          return theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400';
      }
    }
    
    if (category === 'project') {
      switch (type) {
        case 'investment': 
          return theme === 'light' ? 'bg-green-100 text-green-600' : 'bg-green-900/30 text-green-400';
        case 'return': 
          return theme === 'light' ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-900/30 text-emerald-400';
        case 'perk': 
          return theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-amber-900/30 text-amber-400';
        case 'event': 
          return theme === 'light' ? 'bg-violet-100 text-violet-600' : 'bg-violet-900/30 text-violet-400';
        case 'system': 
          return theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/30 text-gray-400';
        case 'funding': 
          return theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/30 text-indigo-400';
        case 'message': 
          return theme === 'light' ? 'bg-rose-100 text-rose-600' : 'bg-rose-900/30 text-rose-400';
        default: 
          return theme === 'light' ? 'bg-green-100 text-green-600' : 'bg-green-900/30 text-green-400';
      }
    }
    
    return theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/30 text-gray-400';
  };

  // Get project icon based on project type
  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'webseries': return <Tv className="w-4 h-4" />;
      default: return <Film className="w-4 h-4" />;
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (setCurrentView) {
      setCurrentView('home');
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`min-h-screen pt-20 pb-[100px] transition-all duration-[3000ms] ${
      theme === 'light'
        ? 'bg-gradient-to-br from-gray-50 to-white'
        : 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* Back Button - Mobile */}
          <div className="md:hidden mb-4">
            <button
              onClick={handleBack}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${
                theme === 'light' ? 'text-gray-900' : 'text-white'
              }`}>
                Notifications
              </h1>
              <p className={`text-lg ${
                theme === 'light' ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Stay updated with your investments, community, and friends
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    {notifications.length}
                  </div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {unreadCount}
                  </div>
                  <div className={`text-sm ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    Unread
                  </div>
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else if (setCurrentView) {
                    setCurrentView('home');
                  }
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title="Close notifications"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filter Tabs - Full Page with Icons and Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              const isActive = activeFilter === filter.id;
              const count = filter.id === 'all' 
                ? notifications.length 
                : notifications.filter(n => n.category === filter.id).length;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`group relative px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 flex-shrink-0 ${
                    isActive
                      ? `${filter.color} text-white shadow-lg`
                      : theme === 'light'
                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                  }`}
                  title={filter.label}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium text-sm whitespace-nowrap">{filter.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : theme === 'light'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-700 text-gray-300'
                  }`}>
                    {count}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-current opacity-20"
                      layoutId="activeFilter"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                }`}
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={clearAllNotifications}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
              }`}
            >
              Clear all
            </button>
          </div>
          
          <div className={`text-sm ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                    notification.read
                      ? theme === 'light'
                        ? 'bg-white border-gray-200 hover:border-gray-300'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                      : theme === 'light'
                        ? 'bg-purple-50 border-purple-200 hover:border-purple-300'
                        : 'bg-purple-900/20 border-purple-700 hover:border-purple-600'
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-3 rounded-xl ${getNotificationColor(notification.type, notification.category)}`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className={`font-semibold ${
                            theme === 'light' ? 'text-gray-900' : 'text-white'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${
                              theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {notification.time}
                            </span>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                                theme === 'light'
                                  ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                  : 'text-gray-500 hover:text-red-400 hover:bg-red-900/30'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className={`mb-3 ${
                          theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* Additional Info */}
                        {(notification.user || notification.project || notification.channel || notification.event || notification.achievement) && (
                          <div className="flex items-center gap-3 mb-4">
                            {notification.user && (
                              <div className="flex items-center gap-2">
                                <img
                                  src={notification.user.avatar || getUserAvatar(notification.user.name)}
                                  alt={notification.user.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = getUserAvatar(notification.user?.name || 'You');
                                  }}
                                />
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {notification.user.name}
                                </span>
                              </div>
                            )}
                            
                            {notification.project && (
                              <div className="flex items-center gap-2">
                                {getProjectIcon(notification.project.type)}
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {notification.project.title}
                                </span>
                              </div>
                            )}
                            
                            {notification.channel && (
                              <div className="flex items-center gap-2">
                                <img
                                  src={notification.channel.avatar || getChannelAvatar(notification.channel.name)}
                                  alt={notification.channel.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = getChannelAvatar(notification.channel?.name || 'EnterCircles');
                                  }}
                                />
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {notification.channel.name}
                                </span>
                              </div>
                            )}
                            
                            {notification.event && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {notification.event.title}
                                </span>
                                <span className={`text-xs ${
                                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                  ({notification.event.attendees} attending)
                                </span>
                              </div>
                            )}
                            
                            {notification.achievement && (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{notification.achievement.icon}</span>
                                <span className={`text-sm font-medium ${
                                  theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                                }`}>
                                  {notification.achievement.name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action Button */}
                        <button
                          onClick={() => toggleExpand(notification.id)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            theme === 'light'
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {notification.action}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center py-12 rounded-2xl ${
                  theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-900/50 border border-gray-700'
                }`}
              >
                <Bell className={`w-12 h-12 mx-auto mb-4 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <h3 className={`text-lg font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  No notifications
                </h3>
                <p className={`${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {activeFilter === 'all' 
                    ? 'You\'re all caught up! No new notifications.'
                    : `No ${activeFilter} notifications at the moment.`
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationCenter;