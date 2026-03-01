import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import { 
  getCurrentUser, 
  setCurrentUser, 
  logout as dbLogout,
  getUserByPhone,
  initializeDB 
} from '@/lib/db';

interface AuthContextType extends AuthState {
  login: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  generateOTP: (phone: string) => Promise<{ success: boolean; otp?: string; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Store OTPs temporarily (in memory for security)
const otpStore: Record<string, { otp: string; expires: number }> = {};

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
    // Initialize database
    initializeDB();
  }, []);

  const generateOTP = async (phone: string): Promise<{ success: boolean; otp?: string; message: string }> => {
    // Check if user exists and is active
    const user = getUserByPhone(phone);
    
    if (!user) {
      return { 
        success: false, 
        message: 'Access not approved. Please contact admin.' 
      };
    }

    if (!user.is_active) {
      return { 
        success: false, 
        message: 'Your account has been deactivated. Please contact admin.' 
      };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    otpStore[phone] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
    };

    // In a real app, this would send SMS
    // For demo purposes, we'll return the OTP
    console.log(`OTP for ${phone}: ${otp}`);
    
    return { 
      success: true, 
      otp, // Remove in production - only for demo
      message: 'OTP sent successfully' 
    };
  };

  const login = async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const storedOTP = otpStore[phone];
    
    if (!storedOTP) {
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (Date.now() > storedOTP.expires) {
      delete otpStore[phone];
      return { success: false, message: 'OTP expired. Please request a new one.' };
    }

    if (storedOTP.otp !== otp) {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }

    const user = getUserByPhone(phone);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }

    // Clear OTP after successful login
    delete otpStore[phone];
    
    // Set current user
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
