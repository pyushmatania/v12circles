import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart3, Film, Users, LayoutDashboard, ShoppingBag, ChevronDown, ChevronUp, BarChart, GitCompareArrows as ArrowsCompare, Newspaper, MoreHorizontal, Sun, Moon, User } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from './auth/useAuth';
import SearchBar from './SearchBar';
import NotificationDropdown from './NotificationDropdown';

import { Project } from '../types';
import MobileBottomBar from './MobileBottomBar';

interface NavigationProps {
  currentView: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail';
  setCurrentView: (view: 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail') => void;
  onAuthRequired: (mode?: 'login' | 'register') => boolean;
  onProjectSelect?: (project: any, tab?: 'overview' | 'invest') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setCurrentView, onAuthRequired, onProjectSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();

  const mainNavItems = useMemo(() => [
    { id: 'home', label: 'Home', icon: Home, requiresAuth: false },
    { id: 'projects', label: 'Browse', icon: Film, requiresAuth: false },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, requiresAuth: false },
    { id: 'community', label: 'Community', icon: Users, requiresAuth: false }
  ], []);

  const moreNavItems = useMemo(() => [
    { id: 'merch', label: 'Merch', icon: ShoppingBag },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart, requiresAuth: true },
    { id: 'compare', label: 'Compare', icon: ArrowsCompare },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'admin', label: 'Admin', icon: LayoutDashboard }
  ], []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleItemClick = useCallback((itemId: string) => {
    if (itemId === 'theme') {
      toggleTheme();
    } else if (['home', 'projects', 'dashboard', 'community', 'merch', 'profile', 'admin', 'portfolio', 'compare', 'news', 'notifications', 'search'].includes(itemId)) {
      const item = [...mainNavItems, ...moreNavItems].find(nav => nav.id === itemId);
      if (item?.requiresAuth && !isAuthenticated) {
        onAuthRequired('login');
        return;
      }
      setCurrentView(itemId as 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search');
      setShowMoreMenu(false);
    }
  }, [toggleTheme, mainNavItems, moreNavItems, isAuthenticated, onAuthRequired, setCurrentView]);

  const handleProjectSelect = useCallback((project: Project, tab: 'overview' | 'invest' = 'overview') => {
    if (onProjectSelect) {
      onProjectSelect(project, tab);
    }
  }, [onProjectSelect]);

  return (
    <>
      {/* Top Navigation Bar - Only shown when not scrolled */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.nav
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className="max-w-7xl mx-auto px-8 py-6">
              <div className="relative flex items-center justify-between">
                {/* Logo */}
                <motion.button 
                  onClick={() => setCurrentView('home')}
                  className="hidden md:flex items-center gap-0 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0, duration: 0.3 }}
                >
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img 
                      src="/Improved Logo-01.png" 
                      alt="Circles Logo" 
                      className="w-24 h-24 object-contain drop-shadow-lg"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <span className={`font-bold text-4xl hidden drop-shadow-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      C
                    </span>
                  </div>
                  <span className={`font-bold text-4xl drop-shadow-lg transition-all duration-300 -ml-4 ${
                    theme === 'light' 
                      ? 'text-gray-900'
                      : 'text-white'
                  }`}>
                    Circles
                  </span>
                </motion.button>

                {/* Navigation Items */}
                <div className="hidden md:flex items-center gap-12">
                  {mainNavItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative ${
                        currentView === item.id
                          ? `${theme === 'light' 
                              ? 'text-purple-600' 
                              : 'text-cyan-400'
                            }`
                          : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <item.icon className="w-5 h-5 drop-shadow-lg" />
                      <span className="font-medium text-base drop-shadow-lg">
                        {item.label}
                      </span>
                      {item.requiresAuth && !isAuthenticated && (
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      )}
                    </motion.button>
                  ))}
                  
                  {/* More Menu Dropdown */}
                  <div className="relative hidden md:block">
                    <motion.button
                      onClick={() => setShowMoreMenu(!showMoreMenu)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        moreNavItems.some(item => item.id === currentView)
                          ? `${theme === 'light' 
                              ? 'text-purple-600' 
                              : 'text-cyan-400'
                            }`
                          : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <MoreHorizontal className="w-5 h-5 drop-shadow-lg" />
                      <span className="font-medium text-base drop-shadow-lg">
                        More
                      </span>
                      {showMoreMenu ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                      }
                    </motion.button>
                    
                    <AnimatePresence>
                      {showMoreMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute right-0 mt-2 w-48 rounded-xl border overflow-hidden z-50 ${
                            theme === 'light'
                              ? 'bg-white border-gray-200 shadow-lg'
                              : 'bg-gray-900 border-white/20 shadow-lg shadow-black/20'
                          }`}
                        >
                          <div className="py-2">
                            {moreNavItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                                  currentView === item.id
                                    ? theme === 'light'
                                      ? 'bg-purple-50 text-purple-600'
                                      : 'bg-purple-900/20 text-purple-400'
                                    : theme === 'light'
                                      ? 'text-gray-700 hover:bg-gray-100'
                                      : 'text-gray-300 hover:bg-gray-800'
                                }`}
                              >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                                {item.requiresAuth && !isAuthenticated && (
                                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-auto" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                  {/* Search Button */}
                  <motion.div 
                    className="relative hidden md:block"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <SearchBar
                      onSelectProject={handleProjectSelect}
                      onViewAllResults={() => {
                        setCurrentView('search');
                      }}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <NotificationDropdown
                      onViewAll={() => setCurrentView('notifications')}
                    />
                  </motion.div>

                  {/* Profile Icon */}
                  <div className="relative">
                    <motion.button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onAuthRequired('login');
                        } else {
                          setCurrentView('profile');
                        }
                      }}
                      className={`flex items-center justify-center transition-all duration-300 ${
                        theme === 'light'
                          ? 'text-gray-600 hover:text-purple-600'
                          : 'text-gray-300 hover:text-cyan-400'
                      }`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={isAuthenticated ? "Profile" : "Sign In"}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      {isAuthenticated && user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : (
                        <User className="w-6 h-6 drop-shadow-lg" />
                      )}
                    </motion.button>
                  </div>

                  {/* Theme Toggle Button */}
                  <motion.button
                    onClick={toggleTheme}
                    className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {theme === 'light' ? (
                      <Moon className="w-5 h-5 drop-shadow-lg" />
                    ) : (
                      <Sun className="w-5 h-5 drop-shadow-lg" />
                    )}
                  </motion.button>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden flex items-center justify-between w-full px-4 min-w-0">
                  {/* Left: Logo Only */}
                  <motion.button 
                    onClick={() => setCurrentView('home')}
                    className="flex items-center justify-center cursor-pointer flex-shrink-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0, duration: 0.3 }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img 
                        src="/Improved Logo-01.png" 
                        alt="Circles Logo" 
                        className="w-8 h-8 object-contain drop-shadow-lg"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <span className={`font-bold text-lg hidden drop-shadow-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        C
                      </span>
                    </div>
                  </motion.button>
                  
                  {/* Center: Main Nav Items */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {mainNavItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`p-2 rounded-lg transition-all duration-300 relative ${
                          currentView === item.id
                            ? 'text-cyan-400'
                            : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <item.icon className="w-5 h-5 drop-shadow-lg" />
                        {item.requiresAuth && !isAuthenticated && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Right: Theme, Notification & Profile Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      onClick={toggleTheme}
                      className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Toggle theme"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {theme === 'light' ? (
                        <Moon className="w-5 h-5 drop-shadow-lg" />
                      ) : (
                        <Sun className="w-5 h-5 drop-shadow-lg" />
                      )}
                    </motion.button>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <NotificationDropdown
                        onViewAll={() => setCurrentView('notifications')}
                      />
                    </motion.div>
                    <motion.button
                      onClick={() => {
                        if (!isAuthenticated) {
                          onAuthRequired('login');
                        } else {
                          setCurrentView('profile');
                        }
                      }}
                      className={`p-2 rounded-lg transition-all duration-300 relative ${
                        currentView === 'profile'
                          ? 'text-cyan-400'
                          : `${theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-300 hover:text-white'}`
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={isAuthenticated ? "Profile" : "Sign In"}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      {isAuthenticated && user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-5 h-5 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                      ) : (
                        <User className="w-5 h-5 drop-shadow-lg" />
                      )}
                      {!isAuthenticated && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Scroll-Triggered Sidebar - Only shown when scrolled */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="hidden md:flex fixed left-6 top-0 bottom-0 z-50 items-center"
          >
            {/* Sidebar Container - Clean icon column only */}
            <div className="flex flex-col items-center space-y-6 w-16 py-8 group">
              {/* Main Navigation Icons */}
              <div className="flex flex-col items-center space-y-3">
                {mainNavItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    <motion.button
                      onClick={() => handleItemClick(item.id)}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                        currentView === item.id
                          ? `${theme === 'light' 
                              ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                              : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                            }`
                          : `${theme === 'light' 
                              ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                              : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <item.icon className="w-6 h-6" />
                      {item.requiresAuth && !isAuthenticated && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                      )}
                      {/* Active Indicator */}
                      {currentView === item.id && (
                        <motion.div
                          layoutId="activeIndicator"
                          className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-full transition-all duration-300 ${
                            theme === 'light' 
                              ? 'bg-gradient-to-b from-purple-400 to-purple-500'
                              : 'bg-gradient-to-b from-cyan-400 to-blue-500'
                          }`}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                    
                    {/* Hover Text */}
                    <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                      currentView === item.id
                        ? theme === 'light'
                          ? 'text-purple-600'
                          : 'text-cyan-400'
                        : theme === 'light'
                          ? 'text-gray-700'
                          : 'text-gray-400'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}

                {/* More Menu Button */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      moreNavItems.some(item => item.id === currentView)
                        ? `${theme === 'light' 
                            ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                            : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                          }`
                        : `${theme === 'light' 
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <MoreHorizontal className="w-6 h-6" />
                  </motion.button>
                  
                  {/* More Menu Dropdown */}
                  <AnimatePresence>
                    {showMoreMenu && (
                      <motion.div
                        initial={{ opacity: 0, x: 10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-16 top-0 w-48 rounded-xl border overflow-hidden z-50 ${
                          theme === 'light'
                            ? 'bg-white border-gray-200 shadow-lg'
                            : 'bg-gray-900 border-white/20 shadow-lg shadow-black/20'
                        }`}
                      >
                        <div className="py-2">
                          {moreNavItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item.id)}
                              className={`w-full flex items-center gap-3 px-4 py-2 transition-colors ${
                                currentView === item.id
                                  ? theme === 'light'
                                    ? 'bg-purple-50 text-purple-600'
                                    : 'bg-purple-900/20 text-purple-400'
                                  : theme === 'light'
                                    ? 'text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.label}</span>
                              {item.requiresAuth && !isAuthenticated && (
                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse ml-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover Text for More */}
                    <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                    moreNavItems.some(item => item.id === currentView)
                        ? theme === 'light'
                          ? 'text-purple-600'
                          : 'text-cyan-400'
                        : theme === 'light'
                          ? 'text-gray-700'
                          : 'text-gray-400'
                    }`}>
                    More
                    </span>
                </div>

                {/* Theme Toggle */}
                  <div className="relative">
                    <motion.button
                    onClick={toggleTheme}
                      className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                        theme === 'light' 
                          ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                    {theme === 'light' ? (
                      <Moon className="w-6 h-6" />
                    ) : (
                      <Sun className="w-6 h-6" />
                    )}
                    </motion.button>
                    
                  {/* Hover Text for Theme */}
                    <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                      theme === 'light'
                        ? 'text-gray-700'
                        : 'text-gray-400'
                    }`}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </div>

                {/* Profile Icon */}
                <div className="relative">
                  <motion.button
                    onClick={() => handleItemClick('profile')}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                      currentView === 'profile'
                        ? `${theme === 'light' 
                            ? 'text-purple-600 bg-purple-100/50 shadow-lg shadow-purple-400/25' 
                            : 'text-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/25'
                          }`
                        : `${theme === 'light' 
                            ? 'text-gray-700 hover:text-gray-900 hover:bg-white/50' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                          }`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    {isAuthenticated && user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    {!isAuthenticated && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    )}
                  </motion.button>
                  
                  {/* Hover Text for Profile */}
                  <span className={`absolute left-16 top-1/2 transform -translate-y-1/2 whitespace-nowrap px-2 py-1 text-sm font-light opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none select-none group-hover:translate-x-0 translate-x-[-10px] ${
                    currentView === 'profile'
                      ? theme === 'light'
                        ? 'text-purple-600'
                        : 'text-cyan-400'
                      : theme === 'light'
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}>
                    {isAuthenticated ? 'Profile' : 'Sign In'}
                  </span>
                </div>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <MobileBottomBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onAuthRequired={onAuthRequired}
      />
    </>
  );
};

export default Navigation;