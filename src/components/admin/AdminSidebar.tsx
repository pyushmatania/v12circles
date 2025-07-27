import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Gift, 
  Image, 
  Users, 
  Settings, 
  LogOut, 
  Activity,
  Film,
  CircleUser,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import type { AdminPanel } from './AdminDashboard';

interface AdminSidebarProps {
  activePanel: AdminPanel;
  setActivePanel: (panel: AdminPanel) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePanel, setActivePanel }) => {
  const { theme } = useTheme();
  const { logout, user } = useAdminAuth();

  const navItems = [
    { id: 'projects', label: 'Projects', icon: Film },
    { id: 'merchandise', label: 'Merchandise', icon: ShoppingBag },
    { id: 'perks', label: 'Perks & Rewards', icon: Gift },
    { id: 'media', label: 'Media Assets', icon: Image },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`w-64 h-full flex flex-col ${
      theme === 'light' 
        ? 'bg-white border-r border-gray-200' 
        : 'bg-gray-800 border-r border-gray-700'
    }`}>
      {/* Logo */}
      <div className={`p-6 border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`font-bold text-xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Circles Admin
            </h1>
            <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Management Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Back to Main Site */}
      <div className="px-6 py-4">
        <button
          onClick={() => window.location.href = '/'}
          className={`flex items-center gap-2 text-sm ${
            theme === 'light' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to main site
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-6">
          <p className={`text-xs font-medium uppercase tracking-wider mb-4 ${
            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id as AdminPanel)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activePanel === item.id
                    ? `bg-gradient-to-r from-purple-600 to-blue-600 text-white`
                    : theme === 'light'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {activePanel === item.id && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className={`p-4 border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className={`p-4 rounded-xl ${
          theme === 'light' ? 'bg-gray-50' : 'bg-gray-700'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-500/20 flex items-center justify-center">
              <CircleUser className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                {user?.name || 'Admin User'}
              </p>
              <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {user?.email || 'admin@circles.com'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
              theme === 'light'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            }`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;