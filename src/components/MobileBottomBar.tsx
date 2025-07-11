import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Film, 
  BarChart3, 
  Users, 
  User, 
  Sun, 
  Moon,
  Vibrate,
  Zap
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './auth/useAuth';

interface MobileBottomBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onAuthRequired: (mode: 'login' | 'register') => void;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentView, setCurrentView, onAuthRequired }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState(currentView);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  // Haptic feedback function
  const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticEnabled) return;
    
    try {
      if ('vibrate' in navigator) {
        const patterns = {
          light: [10],
          medium: [20],
          heavy: [30]
        };
        navigator.vibrate(patterns[type]);
      }
    } catch (error) {
      console.log('Haptic feedback not supported');
    }
  };

  const mainNavItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      requiresAuth: false,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'projects', 
      label: 'Browse', 
      icon: Film, 
      requiresAuth: false,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      requiresAuth: false,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: Users, 
      requiresAuth: false,
      color: 'from-orange-500 to-red-500'
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      requiresAuth: true,
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'theme') {
      triggerHapticFeedback('light');
      toggleTheme();
    } else if (itemId === 'haptic') {
      setHapticEnabled(!hapticEnabled);
      triggerHapticFeedback('medium');
    } else if (['home', 'projects', 'dashboard', 'community', 'merch', 'profile', 'admin', 'portfolio', 'compare', 'news', 'notifications', 'search', 'project-detail'].includes(itemId)) {
      const item = mainNavItems.find(nav => nav.id === itemId);
      if (item?.requiresAuth && !isAuthenticated) {
        triggerHapticFeedback('medium');
        onAuthRequired('login');
        return;
      }
      
      triggerHapticFeedback('light');
      setActiveTab(itemId);
      setCurrentView(itemId as 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail');
    }
  };

  // Update active tab when currentView changes
  useEffect(() => {
    setActiveTab(currentView);
  }, [currentView]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed bottom-0 left-0 right-0 z-50 ${
        theme === 'light' 
          ? 'bg-white/90 backdrop-blur-xl border-t border-gray-200' 
          : 'bg-gray-900/90 backdrop-blur-xl border-t border-gray-800'
      } safe-area-bottom`}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(80px + env(safe-area-inset-bottom))'
      }}
    >
      {/* Enhanced Navigation */}
      <div className="flex items-center justify-around h-20 px-2">
        {mainNavItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 min-w-[60px] min-h-[60px] ${
                isActive 
                  ? `bg-gradient-to-r ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/25` 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon with enhanced animations */}
              <motion.div
                animate={{ 
                  scale: isActive ? 1.1 : 1,
                  rotate: isActive ? [0, 5, -5, 0] : 0
                }}
                transition={{ 
                  duration: isActive ? 0.5 : 0.3,
                  ease: "easeInOut"
                }}
                className="relative z-10"
              >
                <Icon 
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : theme === 'light' 
                        ? 'text-gray-600' 
                        : 'text-gray-400'
                  }`} 
                />
                
                {/* Notification badge for profile when authenticated */}
                {item.id === 'profile' && isAuthenticated && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  />
                )}
              </motion.div>
              
              {/* Label with better typography */}
              <motion.span 
                className={`text-xs font-medium mt-1 transition-all duration-300 ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : theme === 'light' 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                }`}
                animate={{ 
                  opacity: isActive ? 1 : 0.8,
                  y: isActive ? 0 : 1
                }}
              >
                {item.label}
              </motion.span>
              
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1.5, opacity: 0.3 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-full left-4 right-4 mb-2"
          >
            <div className={`flex items-center gap-2 p-3 rounded-2xl ${
              theme === 'light' 
                ? 'bg-white/95 backdrop-blur-xl border border-gray-200 shadow-lg' 
                : 'bg-gray-900/95 backdrop-blur-xl border border-gray-700 shadow-lg'
            }`}>
              {/* Theme Toggle */}
              <motion.button
                onClick={() => handleItemClick('theme')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  theme === 'light' 
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="text-sm font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
              </motion.button>
              
              {/* Haptic Toggle */}
              <motion.button
                onClick={() => handleItemClick('haptic')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  hapticEnabled
                    ? 'bg-blue-500 text-white'
                    : theme === 'light' 
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {hapticEnabled ? <Zap className="w-4 h-4" /> : <Vibrate className="w-4 h-4" />}
                <span className="text-sm font-medium">Haptic</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safe area padding */}
      <div className="h-safe-bottom" />
    </motion.div>
  );
};

export default MobileBottomBar;
