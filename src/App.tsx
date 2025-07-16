import { useState, lazy, Suspense, useCallback, memo, useEffect, useMemo } from 'react';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { Project } from './types';

// 🚀 Lazy load heavy components for optimal performance
const Dashboard = lazy(() => import('./components/Dashboard'));
const ProjectCatalog = lazy(() => import('./components/ProjectCatalog'));
const Community = lazy(() => import('./components/Community'));
const Merchandise = lazy(() => import('./components/Merchandise'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const PortfolioAnalytics = lazy(() => import('./components/PortfolioAnalytics'));
const ProjectComparison = lazy(() => import('./components/ProjectComparison'));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage'));
const NewsAndUpdates = lazy(() => import('./components/NewsAndUpdates'));
const NotificationCenter = lazy(() => import('./components/NotificationCenter'));
const EnhancedSearch = lazy(() => import('./components/EnhancedSearch'));

// 🎯 Optimized loading component with memoization
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

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

  // 🎯 Hooks
  const { isAuthenticated } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  // 🚀 Memoized constants for performance
  const protectedViews = useMemo(() => ['profile', 'portfolio'] as const, []);
  const isCurrentViewProtected = useMemo(() => 
    protectedViews.includes(currentView as any), 
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

  // 🚀 Optimized view change handler
  const handleViewChange = useCallback((view: ViewType) => {
    // Check if authentication is required for certain views
    if (protectedViews.includes(view as any)) {
      if (!handleAuthRequired()) {
        toast.info('Please sign in', 'You need to be logged in to access this page');
        return;
      }
    }
    
    // Save current view's scroll position and state before changing
    saveCurrentViewState();
    
    setPreviousView(currentView);
    setCurrentView(view);
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

  // 🚀 Memoized admin view renderer
  const adminView = useMemo(() => {
  if (currentView === 'admin') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminDashboard />
      </Suspense>
    );
  }
    return null;
  }, [currentView]);

  // 🚀 Memoized current view renderer
  const renderCurrentView = useCallback(() => {
    switch (currentView) {
      case 'projects':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectCatalog 
              onTrackInvestment={() => handleViewChange('dashboard')}
              onProjectSelect={handleProjectSelect}
            />
          </Suspense>
        );
      case 'dashboard':
        // Dashboard is now accessible without login
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        );
      case 'community':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Community />
          </Suspense>
        );
      case 'merch':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <Merchandise />
          </Suspense>
        );
      case 'profile':
        return isAuthenticated ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfilePage />
          </Suspense>
        ) : null;
      case 'portfolio':
        return isAuthenticated ? (
          <Suspense fallback={<LoadingSpinner />}>
            <PortfolioAnalytics />
          </Suspense>
        ) : null;
      case 'compare':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectComparison 
              onTrackInvestment={() => handleViewChange('dashboard')} 
              setCurrentView={handleViewChange}
              onProjectSelect={handleComparisonProjectSelect}
            />
          </Suspense>
        );
      case 'news':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <NewsAndUpdates />
          </Suspense>
        );
      case 'notifications':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <NotificationCenter setCurrentView={handleViewChange} />
          </Suspense>
        );
      case 'search':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <EnhancedSearch />
          </Suspense>
        );
      case 'project-detail':
        return selectedProject ? (
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectDetailPage 
              project={selectedProject} 
              onClose={handleProjectDetailClose}
              onInvest={() => handleViewChange('community')}
              initialTab={projectDetailTab}
            />
          </Suspense>
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
    onProjectSelect: handleNavigationProjectSelect
  }), [currentView, handleViewChange, handleAuthRequired, handleNavigationProjectSelect]);

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