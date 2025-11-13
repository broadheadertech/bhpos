import React, { useState, useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';
import { formatCurrency, formatDate } from '../utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Calendar,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  CreditCard,
  Filter
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { transactions, products } = useDataStore();
  const [dateRange, setDateRange] = useState('7');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Filter transactions by date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.createdAt);
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(dateRange));
    return transactionDate >= daysAgo;
  });

  // Calculate metrics
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = filteredTransactions.length;
  const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  // Daily sales data for chart
  const dailySalesData = [];
  for (let i = parseInt(dateRange) - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = filteredTransactions.filter(t => {
      const tDate = new Date(t.createdAt).toISOString().split('T')[0];
      return tDate === dateStr;
    });
    
    const daySales = dayTransactions.reduce((sum, t) => sum + t.total, 0);
    const dayCount = dayTransactions.length;
    
    dailySalesData.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sales: daySales,
      transactions: dayCount
    });
  }

  // Top selling products
  const productSales = {};
  filteredTransactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const productId = item.product.id;
      if (!productSales[productId]) {
        productSales[productId] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[productId].quantity += item.quantity;
      productSales[productId].revenue += item.product.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 5);

  // Payment method distribution
  const paymentMethods = {};
  filteredTransactions.forEach(transaction => {
    const method = transaction.paymentMethod;
    paymentMethods[method] = (paymentMethods[method] || 0) + 1;
  });

  const paymentMethodData = Object.entries(paymentMethods).map(([method, count]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1),
    value: count
  }));

  // Category performance
  const categorySales = {};
  filteredTransactions.forEach(transaction => {
    transaction.items.forEach(item => {
      const category = item.product.category;
      if (!categorySales[category]) {
        categorySales[category] = {
          name: category,
          sales: 0,
          items: 0
        };
      }
      categorySales[category].sales += item.product.price * item.quantity;
      categorySales[category].items += item.quantity;
    });
  });

  const categoryData = Object.values(categorySales)
    .sort((a: any, b: any) => b.sales - a.sales)
    .slice(0, 5);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const stats = [
    {
      name: 'Total Sales',
      value: formatCurrency(totalSales),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: totalSales > 0 ? '+12%' : '0%'
    },
    {
      name: 'Total Transactions',
      value: totalTransactions.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: totalTransactions > 0 ? '+8%' : '0%'
    },
    {
      name: 'Average Order Value',
      value: formatCurrency(averageOrderValue),
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: averageOrderValue > 50 ? '+5%' : '-2%'
    },
    {
      name: 'Active Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: products.length > 0 ? '+3%' : '0%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            View sales performance and business insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.name}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1">
                {stat.trend && stat.trend.startsWith('+') ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <p className="text-xs text-muted-foreground">
                  {stat.trend} from last period
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Trend</CardTitle>
            <CardDescription>
              Sales performance over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: any, name) => [formatCurrency(value), name === 'sales' ? 'Sales' : 'Transactions']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Distribution of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Best performing products by quantity sold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product: any, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-yellow-600' : 'bg-gray-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {formatCurrency(product.revenue)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>
              Sales breakdown by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(value), 'Sales']}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest sales activity from your store
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      #{transaction.id.slice(-6)}
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>{transaction.cashierName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        <CreditCard className="h-3 w-3 mr-1" />
                        {transaction.paymentMethod}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;