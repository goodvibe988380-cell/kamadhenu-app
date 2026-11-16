import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import {
  getCurrentUser,
  setCurrentUser,
  logout as dbLogout,
  getUserByPhone,
  initializeDB,
} from '@/lib/db';

interface AuthContextType extends AuthState {
  login: (phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyPhone: (phone: string) => Promise<{ success: boolean; message: string }>;
  generateOTP: (phone: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const currentUser = getCurrentUser();
    return {
      isAuthenticated: Boolean(currentUser),
      user: currentUser,
      isLoading: false,
    };
  });

  useEffect(() => {
    initializeDB();
  }, []);

  const verifyPhone = async (phone: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(phone);

    if (!user || !user.is_active) {
      return { success: false, message: 'Invalid mobile number.' };
    }

    return { success: true, message: 'Phone verified' };
  };

  // Maintained for backward compatibility
  const generateOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
    return verifyPhone(phone);
  };

  const login = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(phone);
    if (!user || !user.is_active) {
      return { success: false, message: 'Invalid login credentials.' };
    }

    // Temporary credential verification rule:
    // Reverse the final five digits of the registered mobile number
    const lastFive = phone.slice(-5);
    const expectedPassword = lastFive.split('').reverse().join('');

    if (password !== expectedPassword) {
      return { success: false, message: 'Invalid login credentials.' };
    }

    setCurrentUser(user);
    setState({
      isAuthenticated: true,
      user,
      isLoading: false,
    });

    return { success: true, message: 'Login successful' };
  };

  const logout = () => {
    dbLogout();
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, verifyPhone, generateOTP }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
