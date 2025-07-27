import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import HowItWorks from './components/HowItWorks';
import LiveProjects from './components/LiveProjects';
import WhyThisMatters from './components/WhyThisMatters';
import TechTrust from './components/TechTrust';
import Rewards from './components/Rewards';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Navigation from './components/Navigation';
import AuthModal from './components/auth/AuthModal';
import ToastContainer from './components/auth/ToastNotification';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/auth/AuthProvider';
import { useAuth } from './components/auth/useAuth';
import { useToast } from './hooks/useToast';
import DebugPanel from './components/DebugPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { checkReactAvailability } from './utils/reactCheck';
import { Project } from './types';

// 🚀 Import components directly for instant loading
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Merchandise from './components/Merchandise';
import ProfilePage from './components/profile/ProfilePage';
import AdminDashboard from './components/admin/AdminDashboard';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import ProjectComparison from './components/ProjectComparison';
import ProjectDetailPage from './components/ProjectDetailPage';
import NewsAndUpdates from './components/NewsAndUpdates';
import NotificationCenter from './components/NotificationCenter';
import EnhancedSearch from './components/EnhancedSearch';

// 🚀 Lazy load ProjectCatalog for instant navigation
const ProjectCatalog = React.lazy(() => import('./components/ProjectCatalog'));



// 🛡️ Type definitions for better type safety
type ViewType = 'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail';
type ProjectDetailTab = 'overview' | 'invest';
type AuthModalMode = 'login' | 'register';



/**
 * 🎯 AppContent - Main application content with optimized state management
 * @description Handles view navigation, authentication, and component rendering
 */
function AppContent() {
  // 🎯 State management with proper typing
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<ProjectDetailTab>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [previousView, setPreviousView] = useState<ViewType>('home');
  const [viewScrollPositions, setViewScrollPositions] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 🎯 Hooks
  const { isAuthenticated } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  // 🚀 Memoized constants for performance
  const protectedViews = useMemo(() => ['profile', 'portfolio'] as const, []);
  const isCurrentViewProtected = useMemo(() => 
    protectedViews.includes(currentView as 'profile' | 'portfolio'), 
    [currentView, protectedViews]
  );

  // 🛡️ Handle logout redirect with proper cleanup
  useEffect(() => {
    const logoutTimestamp = localStorage.getItem('logout_timestamp');
    if (logoutTimestamp && !isAuthenticated) {
      // Redirect to home if on protected views
      if (isCurrentViewProtected) {
        setCurrentView('home');
      }
      localStorage.removeItem('logout_timestamp');
    }
  }, [isAuthenticated, isCurrentViewProtected]);

  // 🛡️ Additional safety check for protected views
  useEffect(() => {
    if (!isAuthenticated && isCurrentViewProtected) {
      setCurrentView('home');
    }
  }, [isAuthenticated, isCurrentViewProtected]);

  // 🚀 Optimized authentication handler with useCallback
  const handleAuthRequired = useCallback((mode: AuthModalMode = 'login'): boolean => {
    if (!isAuthenticated) {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  // 🚀 Optimized view state management
  const saveCurrentViewState = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    setViewScrollPositions(prev => ({
      ...prev,
      [currentView]: currentScrollY
    }));
  }, [currentView]);

  // 🚀 Optimized view change handler for instant navigation
  const handleViewChange = useCallback((view: ViewType) => {
    // 🚀 Immediate view change for better perceived performance
    if (view === currentView) return; // Prevent unnecessary re-renders
    
    // Check if authentication is required for certain views
    if (protectedViews.includes(view as 'profile' | 'portfolio')) {
      if (!handleAuthRequired()) {
        toast.info('Please sign in', 'You need to be logged in to access this page');
        return;
      }
    }
    
    // 🚀 Optimized state updates - batch them together
    const updates = () => {
    saveCurrentViewState();
    setPreviousView(currentView);
    setCurrentView(view);
    };
    
    // Use requestAnimationFrame for smooth transitions
    if (view === 'projects') {
      // 🚀 Instant navigation for browse page
      updates();
    } else {
      requestAnimationFrame(updates);
    }
  }, [handleAuthRequired, toast, currentView, protectedViews, saveCurrentViewState]);

  // 🚀 Optimized project selection handler
  const handleProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state before opening project detail
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project detail close handler
  const handleProjectDetailClose = useCallback(() => {
    // Restore previous view
    setCurrentView(previousView);
    
    // Restore scroll position after a short delay to ensure view is rendered
    setTimeout(() => {
      const savedScrollY = viewScrollPositions[previousView];
      if (savedScrollY !== undefined) {
        window.scrollTo({
          top: savedScrollY,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, [previousView, viewScrollPositions]);

  // 🚀 Optimized project selection from navigation
  const handleNavigationProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project selection from comparison
  const handleComparisonProjectSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized project selection from live projects
  const handleLiveProjectsSelect = useCallback((project: Project, tab?: ProjectDetailTab) => {
    // Save current view's scroll position and state
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setSelectedProject(project);
    setProjectDetailTab(tab || 'overview');
    setCurrentView('project-detail');
  }, [currentView, saveCurrentViewState]);

  // 🚀 Optimized search view handler
  const handleSearchViewAll = useCallback((term: string) => {
    setSearchTerm(term);
    handleViewChange('search');
  }, [handleViewChange]);

  // 🚀 Memoized admin view renderer
  const adminView = useMemo(() => {
    if (currentView === 'admin') {
      return <AdminDashboard />;
    }
    return null;
  }, [currentView]);

  // 🚀 Memoized current view renderer with optimized component loading
  const renderCurrentView = useMemo(() => {
    switch (currentView) {
      case 'projects':
        return (
          <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading Browse...</p>
              </div>
            </div>
          }>
          <ProjectCatalog 
            onTrackInvestment={() => handleViewChange('dashboard')}
            onProjectSelect={handleProjectSelect}
          />
          </React.Suspense>
        );
      case 'dashboard':
        return <Dashboard setCurrentView={handleViewChange} />;
      case 'community':
        return <Community />;
      case 'merch':
        return <Merchandise />;
      case 'profile':
        return isAuthenticated ? <ProfilePage /> : null;
      case 'portfolio':
        return isAuthenticated ? <PortfolioAnalytics /> : null;
      case 'compare':
        return (
          <ProjectComparison 
            onProjectSelect={handleComparisonProjectSelect}
          />
        );
      case 'news':
        return <NewsAndUpdates />;
      case 'notifications':
        return <NotificationCenter setCurrentView={handleViewChange} onClose={() => handleViewChange(previousView)} />;
      case 'search':
        return <EnhancedSearch initialSearchTerm={searchTerm} onBack={() => handleViewChange(previousView)} />;
      case 'project-detail':
        return selectedProject ? (
          <ProjectDetailPage 
            project={selectedProject} 
            onClose={handleProjectDetailClose}
            onInvest={() => handleViewChange('community')}
            initialTab={projectDetailTab}
          />
        ) : null;
      default:
        return (
          <>
            <Hero setCurrentView={handleViewChange} />
            <ProblemSolution setCurrentView={handleViewChange} />
            <HowItWorks setCurrentView={handleViewChange} />
            <Rewards />
            <LiveProjects
              onViewAll={() => handleViewChange('projects')}
              onProjectSelect={handleLiveProjectsSelect}
            />
            <WhyThisMatters onJoin={() => handleAuthRequired('register')} />
            <TechTrust />
            <Testimonials />
            <CallToAction setCurrentView={handleViewChange} />
          </>
        );
    }
  }, [
    currentView,
    handleViewChange,
    handleProjectSelect,
    handleComparisonProjectSelect,
    handleLiveProjectsSelect,
    handleProjectDetailClose,
    isAuthenticated,
    selectedProject,
    projectDetailTab,
    handleAuthRequired,
    previousView,
    searchTerm
  ]);

  // 🚀 Memoized navigation props
  const navigationProps = useMemo(() => ({
    currentView,
    setCurrentView: handleViewChange,
    onAuthRequired: handleAuthRequired,
    onProjectSelect: handleNavigationProjectSelect,
    onSearchViewAll: handleSearchViewAll,
    previousView
   
  }), [currentView, handleViewChange, handleAuthRequired, handleNavigationProjectSelect, handleSearchViewAll, previousView]);

  // 🚀 Memoized auth modal props
  const authModalProps = useMemo(() => ({
    isOpen: authModalOpen,
    onClose: () => setAuthModalOpen(false),
    initialMode: authModalMode
  }), [authModalOpen, authModalMode]);

  // 🚀 Memoized toast container props
  const toastContainerProps = useMemo(() => ({
    toasts,
    onClose: removeToast
  }), [toasts, removeToast]);

  // 🚀 Early return for admin view
  if (adminView) {
    return adminView;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden">
      <Navigation {...navigationProps} />
      {renderCurrentView}
      <DebugPanel />
      <AuthModal {...authModalProps} />
      <ToastContainer {...toastContainerProps} />
    </div>
  );
}

/**
 * 🎯 App - Root application component with error boundary and providers
 * @description Wraps the application with necessary providers and error handling
 */
function App() {
  // Safety check for React availability
  if (!checkReactAvailability()) {
    console.error('React is not properly loaded');
    return <div>Loading application...</div>;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;