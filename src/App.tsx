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

// 🚀 Safe Performance Integration
import { useSafePerformance } from './utils/performanceIntegration';
import PerformanceToggle from './components/PerformanceToggle';
import PerformanceTestButton from './components/PerformanceTestButton';

// 🌐 Network Status
import { useNetworkStatus } from './utils/networkStatus';

// 🚀 Import components directly for instant loading
import Dashboard from './components/Dashboard';
import ProjectCatalog from './components/ProjectCatalog';
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
  
  // 🚀 Safe Performance Integration
  const { isEnabled: performanceEnabled, initialize: initializePerformance } = useSafePerformance();
  
  // 🌐 Network Status
  const isOnline = useNetworkStatus();

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

  // 🚀 Initialize performance optimizations safely
  useEffect(() => {
    if (performanceEnabled) {
      initializePerformance().catch(error => {
        console.warn('[V12] Performance initialization failed:', error);
      });
    }
  }, [performanceEnabled, initializePerformance]);

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

  // 🚀 Optimized view change handler
  const handleViewChange = useCallback((view: ViewType) => {
    // Check if authentication is required for certain views
    if (protectedViews.includes(view as 'profile' | 'portfolio')) {
      if (!handleAuthRequired()) {
        toast.info('Please sign in', 'You need to be logged in to access this page');
        return;
      }
    }
    
    // Save current view's scroll position and state before changing
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setCurrentView(view);
    
    // Scroll to top for new views (except when returning to previous view)
    if (view !== previousView) {
      window.scrollTo(0, 0);
    }
  }, [handleAuthRequired, toast, currentView, previousView, protectedViews, saveCurrentViewState]);

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

  // 🚀 Memoized current view renderer
  const renderCurrentView = useCallback(() => {
    switch (currentView) {
      case 'projects':
        return (
          <ProjectCatalog 
            onTrackInvestment={() => handleViewChange('dashboard')}
            onProjectSelect={handleProjectSelect}
          />
        );
      case 'dashboard':
        // Dashboard is now accessible without login
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
            onTrackInvestment={() => handleViewChange('dashboard')} 
            setCurrentView={handleViewChange}
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
              onTrackInvestment={() => handleViewChange('dashboard')}
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
    handleAuthRequired
  ]);

  // 🚀 Memoized navigation props
  const navigationProps = useMemo(() => ({
    currentView,
    setCurrentView: handleViewChange,
    onAuthRequired: handleAuthRequired,
    onProjectSelect: handleNavigationProjectSelect,
    onSearchViewAll: handleSearchViewAll,
    previousView
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {renderCurrentView()}
      <DebugPanel />
      <PerformanceToggle />
      <PerformanceTestButton />
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

  // 🎯 Scroll to top on initial load
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Also handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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