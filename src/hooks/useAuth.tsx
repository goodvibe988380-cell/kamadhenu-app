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
  login: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
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

  const generateOTP = async (phone: string): Promise<{ success: boolean; message: string }> => {
    const user = getUserByPhone(phone);

    if (!user) {
      return { success: false, message: 'Access not approved. Please contact admin.' };
    }

    if (!user.is_active) {
      return { success: false, message: 'Your account has been deactivated. Please contact admin.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // For demo purposes, we'll log the OTP to the console.
    console.log(`[DEMO] OTP for ${phone}: ${otp}`);
    return { success: true, message: 'OTP sent successfully' };
  };

  const login = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    // For demo purposes, we'll use a hardcoded OTP for now.
    const hardcodedOTP = '123456';

    if (otp !== hardcodedOTP) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    const user = getUserByPhone(phone);
    if (!user) {
      return { success: false, message: 'User not found.' };
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
    <AuthContext.Provider value={{ ...state, login, logout, generateOTP }}>
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
