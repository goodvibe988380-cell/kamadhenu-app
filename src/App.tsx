import React from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Login from '@/pages/Login';
import UserDashboard from '@/pages/UserDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import { Toaster } from '@/components/ui/sonner';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Login />;
  }

  // Route based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  return <UserDashboard />;
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
