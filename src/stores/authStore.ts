import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkPermission: (requiredRole: string[]) => boolean;
}

const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@pos.com',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    username: 'cashier1',
    email: 'cashier1@pos.com',
    role: 'cashier',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    username: 'manager1',
    email: 'manager1@pos.com',
    role: 'manager',
    createdAt: new Date('2024-01-01')
  }
];

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (username: string, password: string) => {
    // Mock authentication - in real app, this would be an API call
    const user = mockUsers.find(u => u.username === username && password === 'password123');
    
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  
  checkPermission: (requiredRole: string[]) => {
    const { user } = get();
    if (!user) return false;
    
    return requiredRole.includes(user.role);
  }
}));