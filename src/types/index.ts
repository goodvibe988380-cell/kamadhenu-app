// User Types
export interface User {
  id: string;
  name: string;
  phone_number: string;
  role: 'user' | 'admin';
  is_active: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  stock: number;
  price?: number;
  description: string;
  image_url?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'accepted' | 'rejected';

export interface Order {
  id: string;
  user_phone: string;
  user_name: string;
  quantity: number;
  status: OrderStatus;
  created_at: string;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// Dashboard Stats
export interface DashboardStats {
  currentStock: number;
  totalOrders: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
}
