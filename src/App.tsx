import { useState, lazy, Suspense, useCallback, memo, useEffect } from 'react';
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

// Lazy load heavy components for better performance
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

// Optimized loading component for lazy-loaded routes
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-black">
    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
  </div>
));

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'projects' | 'community' | 'merch' | 'profile' | 'admin' | 'portfolio' | 'compare' | 'news' | 'notifications' | 'search' | 'project-detail'>('home');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<'overview' | 'invest'>('overview');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();
  const { toasts, toast, removeToast } = useToast();

  // Handle logout redirect
  useEffect(() => {
    const logoutTimestamp = localStorage.getItem('logout_timestamp');
    if (logoutTimestamp && !isAuthenticated) {
      // Redirect to home if on protected views
      if (['profile', 'portfolio'].includes(currentView)) {
        setCurrentView('home');
      }
      localStorage.removeItem('logout_timestamp');
    }
  }, [isAuthenticated, currentView]);

  // Additional safety check for protected views
  useEffect(() => {
    if (!isAuthenticated && ['profile', 'portfolio'].includes(currentView)) {
      setCurrentView('home');
    }
  }, [isAuthenticated, currentView]);

  const handleAuthRequired = useCallback((mode: 'login' | 'register' = 'login') => {
    if (!isAuthenticated) {
      setAuthModalMode(mode);
      setAuthModalOpen(true);
      return false;
    }
    return true;
  }, [isAuthenticated]);

  const handleViewChange = useCallback((view: typeof currentView) => {
    // Check if authentication is required for certain views
    if (['profile', 'portfolio'].includes(view)) {
      if (!handleAuthRequired()) {
        toast.info('Please sign in', 'You need to be logged in to access this page');
        return;
      }
    }
    setCurrentView(view);
  }, [handleAuthRequired, toast]);

  // If admin view is selected, render the admin dashboard
  if (currentView === 'admin') {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <AdminDashboard />
      </Suspense>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'projects':
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ProjectCatalog 
              onTrackInvestment={() => handleViewChange('dashboard')}
              onProjectSelect={(project, tab) => {
                setSelectedProject(project);
                setProjectDetailTab(tab || 'overview');
                setCurrentView('project-detail');
              }}
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
              onProjectSelect={(project, tab) => {
                setSelectedProject(project);
                setProjectDetailTab(tab || 'overview');
                setCurrentView('project-detail');
              }}
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
              onClose={() => setCurrentView('projects')}
              onInvest={() => handleViewChange('dashboard')}
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
              onProjectSelect={(project, tab) => {
                setSelectedProject(project);
                setProjectDetailTab(tab || 'overview');
                setCurrentView('project-detail');
              }}
            />
            <WhyThisMatters onJoin={() => handleAuthRequired('register')} />
            <TechTrust />
            <Testimonials />
            <CallToAction setCurrentView={handleViewChange} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden">
      <Navigation
        currentView={currentView}
        setCurrentView={handleViewChange}
        onAuthRequired={handleAuthRequired}
        onProjectSelect={(project, tab) => {
          setSelectedProject(project);
          setProjectDetailTab(tab || 'overview');
          setCurrentView('project-detail');
        }}
      />
      {renderCurrentView()}
      <DebugPanel currentView={currentView} />
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
      <ToastContainer 
        toasts={toasts}
        onClose={removeToast}
      />
    </div>
  );
}

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