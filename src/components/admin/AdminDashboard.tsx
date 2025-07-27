import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import ProjectsPanel from './panels/ProjectsPanel';
import MerchandisePanel from './panels/MerchandisePanel';
import PerksPanel from './panels/PerksPanel';
import MediaPanel from './panels/MediaPanel';
import UsersPanel from './panels/UsersPanel';
import SettingsPanel from './panels/SettingsPanel';
import ActivityLogPanel from './panels/ActivityLogPanel';
import LoginScreen from './LoginScreen';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AdminProvider } from './AdminContext';

export type AdminPanel = 'projects' | 'merchandise' | 'perks' | 'media' | 'users' | 'settings' | 'activity';

const AdminDashboard: React.FC = () => {
  const [activePanel, setActivePanel] = useState<AdminPanel>('projects');
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not authenticated, show login screen
  if (!isAuthenticated && !isLoading) {
    return <LoginScreen />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'projects':
        return <ProjectsPanel />;
      case 'merchandise':
        return <MerchandisePanel />;
      case 'perks':
        return <PerksPanel />;
      case 'media':
        return <MediaPanel />;
      case 'users':
        return <UsersPanel />;
      case 'settings':
        return <SettingsPanel />;
      case 'activity':
        return <ActivityLogPanel />;
      default:
        return <ProjectsPanel />;
    }
  };

  return (
    <AdminProvider>
      <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block">
            <AdminSidebar 
              activePanel={activePanel} 
              setActivePanel={setActivePanel} 
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 md:hidden"
              >
                <div 
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <div className="relative w-64 h-full">
                  <AdminSidebar 
                    activePanel={activePanel} 
                    setActivePanel={(panel) => {
                      setActivePanel(panel);
                      setIsMobileSidebarOpen(false);
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader 
              activePanel={activePanel} 
              onMenuClick={() => setIsMobileSidebarOpen(true)}
            />
            
            <main className={`flex-1 overflow-y-auto p-6 ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePanel}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderPanel()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminDashboard;