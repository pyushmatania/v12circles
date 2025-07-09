import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown,
  CircleUser,
  Settings,
  LogOut
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import type { AdminPanel } from './AdminDashboard';

interface AdminHeaderProps {
  activePanel: AdminPanel;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ activePanel, onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAdminAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getPanelTitle = (panel: AdminPanel): string => {
    switch (panel) {
      case 'projects': return 'Projects Management';
      case 'merchandise': return 'Merchandise Inventory';
      case 'perks': return 'Perks & Rewards';
      case 'media': return 'Media Assets';
      case 'users': return 'User Management';
      case 'settings': return 'System Settings';
      case 'activity': return 'Activity Log';
      default: return 'Dashboard';
    }
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: 'New project "Pathaan 3" was added', time: '2 minutes ago', read: false },
    { id: 2, message: 'User rahul@gmail.com updated their profile', time: '1 hour ago', read: false },
    { id: 3, message: 'System backup completed successfully', time: '3 hours ago', read: true },
    { id: 4, message: 'New merchandise item added to inventory', time: '5 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`py-4 px-6 border-b ${
      theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page Title */}
          <h1 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            {getPanelTitle(activePanel)}
          </h1>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg ${
            theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'
          }`}>
            <Search className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search..."
              className={`bg-transparent border-none focus:outline-none text-sm w-40 ${
                theme === 'light' ? 'text-gray-700 placeholder-gray-500' : 'text-gray-200 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${
              theme === 'light' 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg relative ${
                theme === 'light' 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-lg z-50 ${
                    theme === 'light' 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <div className={`p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        Notifications
                      </h3>
                      <button className={`text-xs ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b last:border-b-0 ${
                            notification.read 
                              ? theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'
                              : theme === 'light' ? 'bg-blue-50 border-gray-200' : 'bg-blue-900/20 border-gray-700'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                            <div>
                              <p className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center">
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          No notifications
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                    <button className={`w-full text-center text-sm py-2 rounded-lg ${
                      theme === 'light' 
                        ? 'text-blue-600 hover:bg-blue-50' 
                        : 'text-blue-400 hover:bg-blue-900/20'
                    }`}>
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                theme === 'light' 
                  ? 'hover:bg-gray-100' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <CircleUser className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`hidden md:block font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                {user?.name || 'Admin'}
              </span>
              <ChevronDown className={`w-4 h-4 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-lg z-50 ${
                    theme === 'light' 
                      ? 'bg-white border-gray-200' 
                      : 'bg-gray-800 border-gray-700'
                  }`}
                >
                  <div className={`p-3 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
                    <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                      {user?.name || 'Admin User'}
                    </p>
                    <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                      {user?.email || 'admin@circles.com'}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => setShowUserMenu(false)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                        theme === 'light' 
                          ? 'hover:bg-gray-100 text-gray-700' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                        theme === 'light' 
                          ? 'hover:bg-gray-100 text-gray-700' 
                          : 'hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;