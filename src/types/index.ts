export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  category: string;
  barcode?: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  cashierId: string;
  cashierName: string;
  createdAt: Date;
  status: 'completed' | 'refunded' | 'cancelled';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'adjustment' | 'sale';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface SalesReport {
  date: string;
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
}

export interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
  lowStockProducts: number;
  dailySales: Array<{
    date: string;
    sales: number;
  }>;
  topSellingProducts: Array<{
    product: Product;
    quantity: number;
  }>;
}