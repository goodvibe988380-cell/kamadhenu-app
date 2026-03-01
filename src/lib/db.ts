import type { User, Product, Order, OrderStatus } from '@/types';

// Database Keys
const DB_KEYS = {
  USERS: 'kj_users',
  PRODUCT: 'kj_product',
  ORDERS: 'kj_orders',
  CURRENT_USER: 'kj_current_user',
};

const REQUIRED_USERS: User[] = [
  {
    id: 'user_001',
    name: 'Admin',
    phone_number: '9999999999',
    role: 'admin',
    is_active: true,
  },
  {
    id: 'user_002',
    name: 'santhosh',
    phone_number: '8123646126',
    role: 'admin',
    is_active: true,
  },
  {
    id: 'user_004',
    name: 'Mahesh P',
    phone_number: '8310328856',
    role: 'admin',
    is_active: true,
  },
  {
    id: 'user_003',
    name: 'shashikala enterprizes',
    phone_number: '9742117420',
    role: 'user',
    is_active: true,
  },
];

// Initialize Database with default data
export const initializeDB = () => {
  // Initialize Product if not exists
  if (!localStorage.getItem(DB_KEYS.PRODUCT)) {
    const defaultProduct: Product = {
      id: 'prod_001',
      name: 'Kamadhenu Milk Junnu Powder – 100g x 120pc = 1 bag',
      stock: 100,
      description: 'Traditional South Indian Colostrum Milk Dessert. No Preservatives. High in Protein & Calcium.',
      image_url: '/product-image.jpg',
    };
    localStorage.setItem(DB_KEYS.PRODUCT, JSON.stringify(defaultProduct));
  }

  // Ensure required users exist with requested roles.
  const usersData = localStorage.getItem(DB_KEYS.USERS);
  if (!usersData) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(REQUIRED_USERS));
  } else {
    const users: User[] = JSON.parse(usersData);
    let isChanged = false;

    for (const requiredUser of REQUIRED_USERS) {
      const existingIndex = users.findIndex(
        (user) => user.phone_number === requiredUser.phone_number
      );

      if (existingIndex === -1) {
        users.push(requiredUser);
        isChanged = true;
        continue;
      }

      const existingUser = users[existingIndex];
      const shouldUpdate =
        existingUser.name !== requiredUser.name ||
        existingUser.role !== requiredUser.role ||
        !existingUser.is_active;

      if (shouldUpdate) {
        users[existingIndex] = {
          ...existingUser,
          name: requiredUser.name,
          role: requiredUser.role,
          is_active: true,
        };
        isChanged = true;
      }
    }

    if (isChanged) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }
  }

  // Initialize empty orders if not exists
  if (!localStorage.getItem(DB_KEYS.ORDERS)) {
    localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify([]));
  }
};

// User Operations
export const getUsers = (): User[] => {
  const data = localStorage.getItem(DB_KEYS.USERS);
  return data ? JSON.parse(data) : [];
};

export const getUserByPhone = (phone: string): User | null => {
  const users = getUsers();
  return users.find(u => u.phone_number === phone) || null;
};

export const addUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`,
  };
  users.push(newUser);
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  return users[index];
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(filtered));
  return true;
};

// Product Operations
export const getProduct = (): Product | null => {
  const data = localStorage.getItem(DB_KEYS.PRODUCT);
  return data ? JSON.parse(data) : null;
};

export const updateProduct = (updates: Partial<Product>): Product | null => {
  const product = getProduct();
  if (!product) return null;
  
  const updated = { ...product, ...updates };
  localStorage.setItem(DB_KEYS.PRODUCT, JSON.stringify(updated));
  return updated;
};

export const addStock = (amount: number): Product | null => {
  const product = getProduct();
  if (!product) return null;
  
  const updated = { ...product, stock: product.stock + amount };
  localStorage.setItem(DB_KEYS.PRODUCT, JSON.stringify(updated));
  return updated;
};

export const reduceStock = (amount: number): Product | null => {
  const product = getProduct();
  if (!product || product.stock < amount) return null;
  
  const updated = { ...product, stock: product.stock - amount };
  localStorage.setItem(DB_KEYS.PRODUCT, JSON.stringify(updated));
  return updated;
};

// Order Operations
export const getOrders = (): Order[] => {
  const data = localStorage.getItem(DB_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const getOrdersByUser = (phone: string): Order[] => {
  const orders = getOrders();
  return orders.filter(o => o.user_phone === phone);
};

export const addOrder = (order: Omit<Order, 'id' | 'created_at'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `order_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  orders.push(newOrder);
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = (id: string, status: OrderStatus): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], status };
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(orders));
  return orders[index];
};

export const deleteOrder = (id: string): boolean => {
  const orders = getOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) return false;
  localStorage.setItem(DB_KEYS.ORDERS, JSON.stringify(filtered));
  return true;
};

// Auth Operations
export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(DB_KEYS.CURRENT_USER);
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem(DB_KEYS.CURRENT_USER);
};

// Stats
export const getDashboardStats = () => {
  const product = getProduct();
  const orders = getOrders();
  
  return {
    currentStock: product?.stock || 0,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    acceptedOrders: orders.filter(o => o.status === 'accepted').length,
    rejectedOrders: orders.filter(o => o.status === 'rejected').length,
  };
};
