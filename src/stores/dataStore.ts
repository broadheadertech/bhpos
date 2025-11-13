import { create } from 'zustand';
import { Product, Transaction, InventoryLog, Category } from '../types';

interface DataStore {
  products: Product[];
  transactions: Transaction[];
  inventoryLogs: InventoryLog[];
  categories: Category[];
  
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  getTransactions: (limit?: number) => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  
  // Inventory actions
  addInventoryLog: (log: Omit<InventoryLog, 'id' | 'createdAt'>) => void;
  getInventoryLogs: (productId?: string) => InventoryLog[];
  
  // Category actions
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Category;
  getCategories: () => Category[];
}

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca Cola',
    sku: 'BEV001',
    price: 2.50,
    cost: 1.50,
    stock: 100,
    category: 'Beverages',
    barcode: '1234567890123',
    description: 'Coca Cola 330ml can',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Sandwich',
    sku: 'FOOD001',
    price: 5.00,
    cost: 2.50,
    stock: 50,
    category: 'Food',
    barcode: '1234567890124',
    description: 'Ham and cheese sandwich',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Chips',
    sku: 'SNACK001',
    price: 1.50,
    cost: 0.75,
    stock: 200,
    category: 'Snacks',
    barcode: '1234567890125',
    description: 'Potato chips 50g',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const mockCategories: Category[] = [
  { id: '1', name: 'Beverages', createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Food', createdAt: new Date('2024-01-01') },
  { id: '3', name: 'Snacks', createdAt: new Date('2024-01-01') },
  { id: '4', name: 'Electronics', createdAt: new Date('2024-01-01') }
];

export const useDataStore = create<DataStore>((set, get) => ({
  products: mockProducts,
  transactions: [],
  inventoryLogs: [],
  categories: mockCategories,
  
  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      products: [...state.products, newProduct]
    }));
    
    // Add inventory log
    get().addInventoryLog({
      productId: newProduct.id,
      productName: newProduct.name,
      type: 'stock_in',
      quantity: newProduct.stock,
      previousStock: 0,
      newStock: newProduct.stock,
      reason: 'New product added',
      userId: 'system',
      userName: 'System'
    });
    
    return newProduct;
  },
  
  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map(product =>
        product.id === id
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    }));
  },
  
  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter(product => product.id !== id)
    }));
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
  
  getProductsByCategory: (category) => {
    return get().products.filter(product => product.category === category);
  },
  
  searchProducts: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.sku.toLowerCase().includes(lowerQuery) ||
      product.barcode?.includes(query)
    );
  },
  
  addTransaction: (transactionData) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      transactions: [newTransaction, ...state.transactions]
    }));
    
    // Update product stock and add inventory logs
    transactionData.items.forEach(item => {
      const product = get().getProductById(item.product.id);
      if (product) {
        const newStock = product.stock - item.quantity;
        get().updateProduct(product.id, { stock: newStock });
        
        get().addInventoryLog({
          productId: product.id,
          productName: product.name,
          type: 'sale',
          quantity: item.quantity,
          previousStock: product.stock,
          newStock: newStock,
          reason: `Sale - Transaction ${newTransaction.id}`,
          userId: transactionData.cashierId,
          userName: transactionData.cashierName
        });
      }
    });
    
    return newTransaction;
  },
  
  getTransactions: (limit) => {
    const transactions = get().transactions;
    return limit ? transactions.slice(0, limit) : transactions;
  },
  
  getTransactionById: (id) => {
    return get().transactions.find(transaction => transaction.id === id);
  },
  
  addInventoryLog: (logData) => {
    const newLog: InventoryLog = {
      ...logData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      inventoryLogs: [newLog, ...state.inventoryLogs]
    }));
  },
  
  getInventoryLogs: (productId) => {
    const logs = get().inventoryLogs;
    return productId ? logs.filter(log => log.productId === productId) : logs;
  },
  
  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      categories: [...state.categories, newCategory]
    }));
    
    return newCategory;
  },
  
  getCategories: () => {
    return get().categories;
  }
}));