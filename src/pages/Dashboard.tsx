import React from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../stores/dataStore';
import { formatCurrency } from '../utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Users,
  BarChart3,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products, transactions } = useDataStore();

  // Calculate stats
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = transactions.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  // Get today's transactions
  const today = new Date().toDateString();
  const todaysTransactions = transactions.filter(t => 
    new Date(t.createdAt).toDateString() === today
  );
  const todaysSales = todaysTransactions.reduce((sum, t) => sum + t.total, 0);

  const stats = [
    {
      name: "Today's Sales",
      value: formatCurrency(todaysSales),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Revenue generated today'
    },
    {
      name: "Today's Transactions",
      value: todaysTransactions.length.toString(),
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Number of sales today'
    },
    {
      name: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Items in inventory'
    },
    {
      name: 'Low Stock Items',
      value: lowStockProducts.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Items running low'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your store today.
        </p>
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link to="/pos">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <div className="cursor-pointer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    New Sale
                  </div>
                </Button>
              </Link>
              <Link to="/inventory">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <div className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    Inventory
                  </div>
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <div className="cursor-pointer">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Store Status */}
        <Card>
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
            <CardDescription>
              Current system overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">System</span>
                <Badge variant="default" className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Backup</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Cash Register</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest sales from your store
              </CardDescription>
            </div>
            <Link to="/transactions">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Transaction #{transaction.id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.cashierName} • {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(transaction.total)}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.paymentMethod}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;