import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Calendar,
  DollarSign,
  Film,
  Gift,
  Info,
  MessageCircle,
  Moon,
  Music,
  Sun,
  Tv,
  TrendingUp,
  Users,
  User,
  Star,
  Share2,
  Award,
  Hash
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import generateRealNotifications from '../utils/notificationsAggregator';
import { getUserAvatar } from '../utils/imageUtils';

// Add image mapping function
const getLocalAvatar = (name: string) => {
  return getUserAvatar(name);
};

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

interface NotificationDropdownProps {
  onViewAll: () => void;
  maxItems?: number;
  disableDropdown?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onViewAll, maxItems = 5, disableDropdown = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  // Get icon component for notification type
  const getNotificationIcon = (notification: { icon?: React.ComponentType<{ className?: string }>; type: string }) => {
    // Use the icon directly from the notification if available
    if (notification.icon) {
      const IconComponent = notification.icon;
      return <IconComponent className="w-5 h-5" />;
    }
    
    // Fallback based on type
    switch (notification.type) {
      case 'investment': return <DollarSign className="w-5 h-5" />;
      case 'return': return <TrendingUp className="w-5 h-5" />;
      case 'perk': return <Gift className="w-5 h-5" />;
      case 'event': return <Calendar className="w-5 h-5" />;
      case 'funding': return <TrendingUp className="w-5 h-5" />;
      case 'message': return <MessageCircle className="w-5 h-5" />;
      case 'system': return <Info className="w-5 h-5" />;
      case 'friend_joined': return <User className="w-5 h-5" />;
      case 'friend_request': return <User className="w-5 h-5" />;
      case 'friend_message': return <MessageCircle className="w-5 h-5" />;
      case 'friend_investment': return <DollarSign className="w-5 h-5" />;
      case 'friend_recommendation': return <Star className="w-5 h-5" />;
      case 'friend_activity': return <Share2 className="w-5 h-5" />;
      case 'channel_update': return <Hash className="w-5 h-5" />;
      case 'community_event': return <Users className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
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
    const iconColor = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
    switch (type) {
      case 'film': return <Film className={`w-4 h-4 ${iconColor}`} />;
      case 'music': return <Music className={`w-4 h-4 ${iconColor}`} />;
      case 'webseries': return <Tv className={`w-4 h-4 ${iconColor}`} />;
      default: return <Film className={`w-4 h-4 ${iconColor}`} />;
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Bell Button */}
      <button 
        onClick={() => {
          if (disableDropdown) {
            onViewAll();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        className={`p-2 rounded-lg transition-all duration-[3000ms] relative ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
      >
        <Bell className="w-5 h-5 drop-shadow-lg" />
        {unreadCount > 0 && (
          <motion.div 
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-current"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed md:absolute top-16 md:top-auto right-2 md:right-0 mt-0 md:mt-2 w-80 md:w-96 rounded-xl border shadow-xl z-[55] overflow-hidden ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-900 border-gray-700'
            }`}
          >
            {/* Header */}
            <div className={`p-3 md:p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold text-sm md:text-base ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className={`text-xs ${theme === 'light' ? 'text-purple-600 hover:text-purple-800' : 'text-purple-400 hover:text-purple-300'}`}
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={toggleTheme}
                    className={`p-1 rounded-full ${theme === 'light' ? 'text-gray-600 hover:bg-gray-100' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {theme === 'light' ? (
                      <Moon className="w-4 h-4" />
                    ) : (
                      <Sun className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Filter Tabs - Icons Only with Hover/Active Text */}
              <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
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
                      className={`group flex-shrink-0 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                        isActive
                          ? `${filter.color} text-white`
                          : theme === 'light'
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-gray-400 hover:bg-gray-800'
                      }`}
                      title={filter.label}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span className={`whitespace-nowrap transition-all duration-200 ${
                        isActive 
                          ? 'opacity-100 max-w-20' 
                          : 'opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-20'
                      } overflow-hidden`}>
                        {filter.label}
                      </span>
                      <span className={`px-1 py-0.5 rounded text-xs font-bold min-w-[16px] text-center transition-all duration-200 ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : theme === 'light'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-gray-700 text-gray-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[50vh] md:max-h-96 overflow-y-auto">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.slice(0, maxItems).map((notification) => (
                  <div 
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`relative p-3 md:p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                      notification.read
                        ? theme === 'light'
                          ? 'bg-white border-gray-200 hover:bg-gray-50'
                          : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                        : theme === 'light'
                          ? 'bg-purple-50 border-purple-100 hover:bg-purple-100/50'
                          : 'bg-purple-900/20 border-purple-700 hover:bg-purple-900/30'
                    }`}
                  >
                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
                    )}
                    
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 p-2 rounded-lg ${getNotificationColor(notification.type, notification.category)}`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {notification.title}
                          </h4>
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notification.time}
                          </span>
                        </div>
                        
                        <p className={`text-xs mb-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                          {notification.message}
                        </p>
                        
                        {/* Additional Info */}
                        {(notification.user || notification.project || notification.channel) && (
                          <div className="flex items-center gap-2 mb-2">
                            {notification.user && (
                              <div className="flex items-center gap-1">
                                <img
                                  src={notification.user.avatar || getUserAvatar(notification.user.name)}
                                  alt={notification.user.name}
                                  className="w-4 h-4 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = getUserAvatar(notification.user?.name || 'You');
                                  }}
                                />
                                <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                  {notification.user.name}
                                </span>
                              </div>
                            )}
                            
                            {notification.project && (
                              <div className="flex items-center gap-1">
                                {getProjectIcon(notification.project.type)}
                                <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                  {notification.project.title}
                                </span>
                              </div>
                            )}
                            
                            {notification.channel && (
                              <div className="flex items-center gap-1">
                                <img
                                  src={notification.channel.avatar || getChannelAvatar(notification.channel.name)}
                                  alt={notification.channel.name}
                                  className="w-4 h-4 rounded-full object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = getChannelAvatar(notification.channel?.name || 'EnterCircles');
                                  }}
                                />
                                <span className={`text-xs font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                  {notification.channel.name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action */}
                        <div className={`text-xs font-medium ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`}>
                          {notification.action}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`p-6 text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {activeFilter === 'all' 
                      ? 'No notifications'
                      : `No ${activeFilter} notifications`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <button
                onClick={onViewAll}
                className={`w-full text-center text-sm font-medium transition-colors ${
                  theme === 'light'
                    ? 'text-purple-600 hover:text-purple-800'
                    : 'text-purple-400 hover:text-purple-300'
                }`}
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;