import React from 'react';
import { motion } from 'framer-motion';
import { Home, BarChart3, Film, Users, User } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './auth/useAuth';

interface MobileBottomBarProps {
  currentView: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail';
  setCurrentView: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail') => void;
  onAuthRequired: (mode?: 'login' | 'register') => boolean;
}

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ currentView, setCurrentView, onAuthRequired }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const mainNavItems = [
    { id: 'home', label: 'Home', icon: Home, requiresAuth: false },
    { id: 'projects', label: 'Browse', icon: Film, requiresAuth: false },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: false },
    { id: 'community', label: 'Community', icon: Users, requiresAuth: false },
    { id: 'profile', label: 'Profile', icon: User, requiresAuth: true }
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'theme') {
      toggleTheme();
    } else if (['home', 'projects', 'dashboard', 'community', 'merch', 'profile', 'admin', 'portfolio', 'compare', 'news', 'notifications', 'search', 'project-detail'].includes(itemId)) {
      const item = mainNavItems.find(nav => nav.id === itemId);
      if (item?.requiresAuth && !isAuthenticated) {
      onAuthRequired('login');
      return;
    }
      setCurrentView(itemId as 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail');
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Bottom spacing for content */}
      <div className="h-16" />
      
      {/* Glass blur background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Main navigation bar - attached to bottom */}
      <div className={`relative mx-3 mb-0 rounded-t-2xl backdrop-blur-2xl border-t border-x ${
        theme === 'light'
          ? 'bg-white/70 border-white/30 shadow-lg shadow-black/5'
          : 'bg-gray-900/60 border-white/10 shadow-xl shadow-black/20'
      }`}>
        <div className="flex items-center justify-between px-1 py-2">
          {mainNavItems.map((item, index) => (
            <motion.button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-0 flex-1 px-0.5 py-1.5 rounded-lg transition-all duration-300 ${
                currentView === item.id
                  ? `${theme === 'light' 
                      ? 'bg-white/80 text-purple-600 shadow-sm' 
                      : 'bg-white/10 text-cyan-400 shadow-lg shadow-cyan-400/20'
                    }`
                  : `${theme === 'light' 
                      ? 'text-gray-500 hover:text-gray-700 hover:bg-white/40' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`
              }`}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            >
              {/* Active indicator */}
              {currentView === item.id && (
                <motion.div
                  className={`absolute inset-0 rounded-lg ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20' 
                      : 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20'
                  }`}
                  layoutId="activeTab"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className="relative z-10 flex flex-col items-center gap-0.5">
                {item.id === 'profile' && isAuthenticated && user?.avatar ? (
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full border border-white" />
                  </div>
                ) : (
                  <item.icon className={`w-3.5 h-3.5 transition-all duration-300 ${
                    currentView === item.id ? 'scale-110' : 'scale-100'
                  }`} />
                )}
                
                <span className={`text-[9px] font-medium leading-none transition-all duration-300 ${
                  currentView === item.id 
                    ? 'opacity-100' 
                    : 'opacity-70'
                }`}>
                  {item.label}
                </span>
              </div>
              
              {/* Auth required indicator */}
              {item.requiresAuth && !isAuthenticated && (
                <motion.div 
                  className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-orange-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileBottomBar;
