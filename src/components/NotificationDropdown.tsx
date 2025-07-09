import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Calendar,
  CheckCircle,
  DollarSign,
  Film,
  Gift,
  Info,
  MessageCircle,
  Moon,
  Music,
  Sun,
  Tv,
  TrendingUp
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
  }
];

interface NotificationDropdownProps {
  onViewAll: () => void;
  maxItems?: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onViewAll, maxItems = 5 }) => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get unread count for badge
  const unreadCount = notifications.filter(n => !n.read).length;

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
      default: return <Bell className="w-5 h-5" />;
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

  return (
    <div ref={dropdownRef} className="relative">
      {/* Notification Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
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
            className={`fixed md:absolute top-16 md:top-auto right-2 md:right-0 mt-0 md:mt-2 w-72 md:w-80 rounded-xl border shadow-xl z-50 overflow-hidden ${
              theme === 'light'
                ? 'bg-white border-gray-200'
                : 'bg-gray-900 border-gray-700'
            }`}
          >
            {/* Header */}
            <div className={`p-3 md:p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <div className="flex items-center justify-between">
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
            </div>

            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.slice(0, maxItems).map((notification) => (
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
                          : 'bg-purple-900/10 border-purple-800/20 hover:bg-purple-900/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className={`p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification)}
                      </div>
                      
                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
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
                        
                        <div className={`text-xs mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                          {notification.time}
                        </div>
                      </div>
                    </div>
                    
                    {/* Unread Indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Bell className={`w-12 h-12 mx-auto mb-3 ${theme === 'light' ? 'text-gray-300' : 'text-gray-700'}`} />
                  <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-2 md:p-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onViewAll();
                }}
                className={`w-full py-2 text-center rounded-lg transition-colors text-sm md:text-base ${
                  theme === 'light'
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30'
                }`}
              >
                View All Notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;