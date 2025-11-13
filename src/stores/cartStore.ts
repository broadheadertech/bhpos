import { create } from 'zustand';
import { Product, CartItem, Transaction, User } from '../types';

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      
      return {
        items: [...state.items, { product, quantity }]
      };
    });
  },
  
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const itemTotal = item.product.price * item.quantity;
      const discount = item.discount || 0;
      return total + (itemTotal - (itemTotal * discount / 100));
    }, 0);
  },
  
  getTotal: () => {
    const subtotal = get().getSubtotal();
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + tax;
  }
}));