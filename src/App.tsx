import React, { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Login';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import LandingPage from '@/pages/LandingPage';
import { Toaster } from '@/components/ui/sonner';

/**
 * App view state:
 * - 'landing'   → Public brand landing page (default for all visitors)
 * - 'login'     → Existing Login component
 * - 'dashboard' → Existing UserDashboard or AdminDashboard
 */
type AppView = 'landing' | 'login' | 'dashboard';

function getViewFromHash(): AppView {
  if (typeof window === 'undefined') return 'landing';
  const hash = window.location.hash;
  if (hash === '#login') return 'login';
  if (hash === '#dashboard') return 'dashboard';
  return 'landing';
}

const AppContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(() => getViewFromHash());

  // Detect login/logout transitions
  const [prevAuth, setPrevAuth] = useState(isAuthenticated);
  if (prevAuth !== isAuthenticated) {
    setPrevAuth(isAuthenticated);
    if (isAuthenticated) {
      // Just logged in -> proceed to dashboard
      setCurrentView('dashboard');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', '#dashboard');
      }
    } else {
      // Just logged out -> return to landing page
      setCurrentView('landing');
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromHash());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginClick = useCallback(() => {
    setCurrentView('login');
    window.history.pushState(null, '', '#login');
    window.scrollTo(0, 0);
  }, []);

  const handleDashboardClick = useCallback(() => {
    setCurrentView('dashboard');
    window.history.pushState(null, '', '#dashboard');
    window.scrollTo(0, 0);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentView('landing');
    window.history.pushState(null, '', window.location.pathname);
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 1. Dashboard view (when explicitly on #dashboard and authenticated)
  if (currentView === 'dashboard') {
    if (!isAuthenticated) {
      // Not authenticated -> show login
      return <Login onBackToHome={handleBackToLanding} />;
    }

    return (
      <div>
        {/* Navigation pill to return to brand landing page from dashboard */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 40,
          }}
        >
          <button
            onClick={handleBackToLanding}
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              background: '#234631',
              color: '#F5EBD7',
              border: '1px solid #B88B43',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              letterSpacing: '0.04em',
            }}
          >
            ← Visit Brand Website
          </button>
        </div>

        {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </div>
    );
  }

  // 2. Login view (when explicitly on #login)
  if (currentView === 'login') {
    if (isAuthenticated) {
      // Already logged in -> go straight to dashboard
      return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
    }

    return <Login onBackToHome={handleBackToLanding} />;
  }

  // 3. Default: Landing page (for all visitors entering `/`)
  return (
    <LandingPage
      onLoginClick={handleLoginClick}
      onDashboardClick={handleDashboardClick}
      isAuthenticated={isAuthenticated}
    />
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
};

export default App;
