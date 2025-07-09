import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  DollarSign, 
  Film, 
  Gift, 
  Info, 
  MessageCircle,
  Music,
  Settings,
  TrendingUp,
  Trash2,
  Tv,
  User,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from './ThemeContext';

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'investment',
    title: 'Investment Confirmed',
    message: 'Your investment of ₹25,000 in "Pathaan 2" has been confirmed.',
    time: '10 minutes ago',
    read: false,
    icon: DollarSign,
    action: 'View Investment',
    project: { id: '1', title: 'Pathaan 2', type: 'film' }
  },
  {
    id: '2',
    type: 'return',
    title: 'Returns Received',
    message: 'You received ₹4,500 in returns from your "Sacred Games 3" investment.',
    time: '2 hours ago',
    read: false,
    icon: TrendingUp,
    action: 'View Returns',
    project: { id: '16', title: 'Sacred Games 3', type: 'webseries' }
  },
  {
    id: '3',
    type: 'perk',
    title: 'New Perk Available',
    message: 'You\'ve unlocked the "Studio Recording Session" perk from "A.R. Rahman: Symphony of India".',
    time: '1 day ago',
    read: true,
    icon: Gift,
    action: 'Claim Perk',
    project: { id: '2', title: 'A.R. Rahman: Symphony of India', type: 'music' }
  },
  {
    id: '4',
    type: 'event',
    title: 'Upcoming Event',
    message: 'Virtual Meet & Greet with the cast of "Pathaan 2" is scheduled for tomorrow at 6 PM.',
    time: '1 day ago',
    read: true,
    icon: Calendar,
    action: 'Add to Calendar',
    project: { id: '1', title: 'Pathaan 2', type: 'film' }
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Verification Completed',
    message: 'Your profile has been successfully verified. You now have access to all investor features.',
    time: '3 days ago',
    read: true,
    icon: CheckCircle,
    action: 'View Profile'
  },
  {
    id: '6',
    type: 'funding',
    title: 'Funding Goal Reached',
    message: '"RRR 2" has reached its funding goal of ₹35,000,000! Thanks for being an early investor.',
    time: '4 days ago',
    read: true,
    icon: TrendingUp,
    action: 'View Project',
    project: { id: '9', title: 'RRR 2', type: 'film' }
  },
  {
    id: '7',
    type: 'message',
    title: 'New Message from Producer',
    message: 'Anurag Kashyap sent you a message regarding your investment in "Sacred Games 3".',
    time: '5 days ago',
    read: true,
    icon: MessageCircle,
    action: 'Read Message',
    project: { id: '16', title: 'Sacred Games 3', type: 'webseries' }
  }
];

interface NotificationCenterProps {
  onClose?: () => void;
  setCurrentView?: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search') => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, setCurrentView }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  // Filter types
  const filters = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'unread', label: 'Unread', icon: Info },
    { id: 'investment', label: 'Investments', icon: DollarSign },
    { id: 'perk', label: 'Perks', icon: Gift },
    { id: 'event', label: 'Events', icon: Calendar }
  ];

  // Get unread count for badge
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !notification.read;
    return notification.type === activeFilter;
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
      default: return <Bell className="w-6 h-6" />;
    }
  };

  // Get background color for notification type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'investment': 
        return theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400';
      case 'return': 
        return theme === 'light' ? 'bg-green-100 text-green-600' : 'bg-green-900/30 text-green-400';
      case 'perk': 
        return theme === 'light' ? 'bg-yellow-100 text-yellow-600' : 'bg-yellow-900/30 text-yellow-400';
      case 'event': 
        return theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/30 text-purple-400';
      case 'system': 
        return theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/30 text-gray-400';
      case 'funding': 
        return theme === 'light' ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-900/30 text-indigo-400';
      case 'message': 
        return theme === 'light' ? 'bg-pink-100 text-pink-600' : 'bg-pink-900/30 text-pink-400';
      default: 
        return theme === 'light' ? 'bg-gray-100 text-gray-600' : 'bg-gray-900/30 text-gray-400';
    }
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

          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Back Button - Desktop */}
              <button
                onClick={handleBack}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <div>
                <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-4`}>
                  Notifications
                </h1>
                <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                  Stay updated with your investments, perks, and events
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? unreadCount > 0
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'bg-white text-gray-400 border border-gray-300 cursor-not-allowed'
                    : unreadCount > 0
                      ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                      : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                }`}
              >
                <Check className="w-5 h-5" />
                <span>Mark All Read</span>
                {unreadCount > 0 && (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400'
                  }`}>
                    {unreadCount}
                  </div>
                )}
              </button>
              
              <button
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'light'
                    ? notifications.length > 0
                      ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      : 'bg-white text-gray-400 border border-gray-300 cursor-not-allowed'
                    : notifications.length > 0
                      ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                      : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? `${theme === 'light' 
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                        : 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      }`
                    : `${theme === 'light' 
                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50' 
                        : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                      }`
                }`}
              >
                <filter.icon className="w-5 h-5" />
                <span>{filter.label}</span>
                {filter.id === 'unread' && unreadCount > 0 && (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    activeFilter === filter.id
                      ? 'bg-white text-purple-700'
                      : theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400'
                  }`}>
                    {unreadCount}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={`relative rounded-xl border ${
                  notification.read
                    ? theme === 'light'
                      ? 'bg-white border-gray-200'
                      : 'bg-gray-900/50 border-gray-700'
                    : theme === 'light'
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-purple-900/10 border-purple-800/30'
                }`}
              >
                <div 
                  className={`p-4 cursor-pointer ${isExpanded[notification.id] ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                  onClick={() => toggleExpand(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    {/* Notification Icon */}
                    <div className={`p-3 rounded-xl ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification)}
                    </div>
                    
                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {notification.time}
                          </span>
                          <ChevronDown className={`w-5 h-5 transition-transform ${
                            isExpanded[notification.id] ? 'rotate-180' : ''
                          } ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
                        </div>
                      </div>
                      <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      
                      {/* Project Tag if applicable */}
                      {notification.project && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            notification.project.type === 'film'
                              ? theme === 'light' ? 'bg-purple-100 text-purple-700' : 'bg-purple-900/30 text-purple-400'
                              : notification.project.type === 'music'
                              ? theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900/30 text-blue-400'
                              : theme === 'light' ? 'bg-green-100 text-green-700' : 'bg-green-900/30 text-green-400'
                          }`}>
                            {getProjectIcon(notification.project.type)}
                            <span>{notification.project.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded[notification.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-2">
                        <div className="flex justify-between items-center mt-2 border-t pt-4 border-gray-200 dark:border-gray-700">
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                              theme === 'light'
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-red-400 hover:bg-red-900/10'
                            } transition-colors`}
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                          
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                            theme === 'light'
                              ? 'bg-purple-500 hover:bg-purple-600 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          } transition-colors`}>
                            <span>{notification.action}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Unread Indicator */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500" />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`p-12 rounded-xl border text-center ${
              theme === 'light'
                ? 'bg-white/60 border-gray-200'
                : 'bg-gradient-to-br from-white/5 to-white/2 border-white/10'
            }`}
          >
            <div className={`text-6xl mb-4 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`}>
              <Bell className="w-16 h-16 mx-auto" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              No notifications
            </h3>
            <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-6`}>
              {activeFilter === 'all' 
                ? "You're all caught up! Check back later for updates." 
                : `No ${activeFilter} notifications at the moment.`}
            </p>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                  theme === 'light'
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                } transition-colors`}
              >
                <Bell className="w-5 h-5" />
                <span>View All Notifications</span>
              </button>
            )}
          </motion.div>
        )}

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`mt-8 p-6 rounded-xl border ${
            theme === 'light'
              ? 'bg-white/60 border-gray-200'
              : 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                              <Settings className={`w-6 h-6 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`} />
              <h3 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Notification Preferences
              </h3>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
              theme === 'light'
                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } transition-colors`}>
              Update Preferences
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'investments', label: 'Investment Updates', icon: DollarSign, enabled: true },
              { id: 'returns', label: 'Returns & Payouts', icon: TrendingUp, enabled: true },
              { id: 'perks', label: 'Perks & Rewards', icon: Gift, enabled: true },
              { id: 'events', label: 'Events & Meetups', icon: Calendar, enabled: false },
              { id: 'messages', label: 'Creator Messages', icon: MessageCircle, enabled: true },
              { id: 'system', label: 'System Notifications', icon: Info, enabled: true }
            ].map((pref) => (
              <div 
                key={pref.id}
                className={`p-4 rounded-xl border ${
                  theme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-900/70 border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      pref.enabled
                        ? theme === 'light' ? 'bg-purple-100 text-purple-600' : 'bg-purple-900/30 text-purple-400'
                        : theme === 'light' ? 'bg-gray-100 text-gray-500' : 'bg-gray-800 text-gray-500'
                    }`}>
                      <pref.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-medium ${
                      pref.enabled
                        ? theme === 'light' ? 'text-gray-900' : 'text-white'
                        : theme === 'light' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {pref.label}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pref.enabled}
                      className="sr-only peer"
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
            <div className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              You can also manage delivery channels (Email, SMS, Push) in your account settings.
            </div>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
              theme === 'light'
                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
            } transition-colors`}>
              <User className="w-4 h-4" />
              <span>Account Settings</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationCenter;