import React, { useState } from 'react';
import { formatCurrency } from '../utils';
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
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  Lightbulb,
  Bell,
  Package
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('descriptive');

  // Dummy Data for Charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Descriptive Analytics - Revenue Trends (Last 7 days)
  const revenueTrendData = [
    { day: 'Mon', revenue: 1250, transactions: 45, customers: 38 },
    { day: 'Tue', revenue: 1820, transactions: 52, customers: 45 },
    { day: 'Wed', revenue: 2100, transactions: 68, customers: 59 },
    { day: 'Thu', revenue: 1690, transactions: 48, customers: 42 },
    { day: 'Fri', revenue: 2850, transactions: 78, customers: 68 },
    { day: 'Sat', revenue: 3200, transactions: 95, customers: 82 },
    { day: 'Sun', revenue: 2900, transactions: 88, customers: 75 }
  ];

  // Top Products
  const topProductsData = [
    { name: 'Coca Cola', sold: 156, revenue: 390 },
    { name: 'Chips', sold: 142, revenue: 213 },
    { name: 'Sandwich', sold: 98, revenue: 490 },
    { name: 'Energy Drink', sold: 87, revenue: 348 },
    { name: 'Candy', sold: 76, revenue: 76 }
  ];

  // Staff Performance
  const staffPerformanceData = [
    { name: 'John Doe', sales: 12500, transactions: 156, avgRating: 4.8 },
    { name: 'Jane Smith', sales: 9800, transactions: 134, avgRating: 4.6 },
    { name: 'Mike Johnson', sales: 8200, transactions: 98, avgRating: 4.4 }
  ];

  // Diagnostic Analytics - Peak Hours
  const peakHoursData = [
    { hour: '8AM', sales: 320, customers: 12 },
    { hour: '10AM', sales: 580, customers: 24 },
    { hour: '12PM', sales: 1250, customers: 45 },
    { hour: '2PM', sales: 980, customers: 38 },
    { hour: '4PM', sales: 1420, customers: 52 },
    { hour: '6PM', sales: 1890, customers: 68 },
    { hour: '8PM', sales: 1120, customers: 42 }
  ];

  // Product Correlation
  const productCorrelationData = [
    { combo: 'Chips + Soda', frequency: 45, revenue: 337.5 },
    { combo: 'Sandwich + Coffee', frequency: 38, revenue: 570 },
    { combo: 'Energy Drink + Snack', frequency: 32, revenue: 416 },
    { combo: 'Candy + Beverage', frequency: 28, revenue: 168 }
  ];

  // Customer Retention
  const retentionData = [
    { segment: 'New Customers', value: 35, color: '#3b82f6' },
    { segment: 'Returning (2-5 visits)', value: 45, color: '#10b981' },
    { segment: 'Loyal (6+ visits)', value: 20, color: '#f59e0b' }
  ];

  // Predictive Analytics - Sales Forecast
  const salesForecastData = [
    { month: 'Jan', actual: 45000, forecast: null },
    { month: 'Feb', actual: 52000, forecast: null },
    { month: 'Mar', actual: 48000, forecast: null },
    { month: 'Apr', actual: 61000, forecast: null },
    { month: 'May', actual: null, forecast: 58000 },
    { month: 'Jun', actual: null, forecast: 65000 },
    { month: 'Jul', actual: null, forecast: 72000 }
  ];

  // Inventory Demand Prediction
  const inventoryDemandData = [
    { product: 'Coca Cola', current: 150, predicted: 320, reorderPoint: 100 },
    { product: 'Chips', current: 120, predicted: 280, reorderPoint: 80 },
    { product: 'Sandwich', current: 45, predicted: 180, reorderPoint: 60 },
    { product: 'Energy Drink', current: 89, predicted: 220, reorderPoint: 70 }
  ];

  // Churn Risk
  const churnPredictionData = [
    { category: 'Low Risk', customers: 245, percentage: 68 },
    { category: 'Medium Risk', customers: 85, percentage: 24 },
    { category: 'High Risk', customers: 30, percentage: 8 }
  ];

  // Prescriptive Analytics - Promotion Suggestions
  const promotionSuggestions = [
    { product: 'Chips', action: 'Bundle with Soda', expectedIncrease: '25%', priority: 'high' },
    { product: 'Sandwich', action: 'Lunch Combo Deal', expectedIncrease: '30%', priority: 'high' },
    { product: 'Energy Drink', action: '2 for 1 Happy Hour', expectedIncrease: '40%', priority: 'medium' },
    { product: 'Candy', action: 'Kids Special', expectedIncrease: '15%', priority: 'low' }
  ];

  // Restocking Alerts
  const restockingAlerts = [
    { product: 'Coca Cola', current: 45, optimal: 200, urgency: 'critical', days: 2 },
    { product: 'Chips', current: 68, optimal: 150, urgency: 'high', days: 4 },
    { product: 'Sandwich', current: 32, optimal: 100, urgency: 'critical', days: 1 },
    { product: 'Coffee', current: 89, optimal: 120, urgency: 'medium', days: 7 }
  ];

  // Staff Scheduling
  const staffSchedulingData = [
    { shift: 'Morning (8AM-12PM)', recommended: 2, current: 1, gap: 1 },
    { shift: 'Lunch (12PM-2PM)', recommended: 4, current: 2, gap: 2 },
    { shift: 'Afternoon (2PM-6PM)', recommended: 3, current: 3, gap: 0 },
    { shift: 'Evening (6PM-10PM)', recommended: 4, current: 2, gap: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive business intelligence across all analytics types
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="descriptive" className="flex flex-col gap-1 py-3">
            <Activity className="h-4 w-4" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xs lg:text-sm">Descriptive</span>
              <span className="text-xs text-muted-foreground hidden lg:block">What happened?</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="flex flex-col gap-1 py-3">
            <Target className="h-4 w-4" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xs lg:text-sm">Diagnostic</span>
              <span className="text-xs text-muted-foreground hidden lg:block">Why it happened?</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex flex-col gap-1 py-3">
            <TrendingUp className="h-4 w-4" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xs lg:text-sm">Predictive</span>
              <span className="text-xs text-muted-foreground hidden lg:block">What will happen?</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="prescriptive" className="flex flex-col gap-1 py-3">
            <Lightbulb className="h-4 w-4" />
            <div className="flex flex-col items-center">
              <span className="font-semibold text-xs lg:text-sm">Prescriptive</span>
              <span className="text-xs text-muted-foreground hidden lg:block">What to do?</span>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* DESCRIPTIVE ANALYTICS TAB */}
        <TabsContent value="descriptive" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(15810)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +12.5% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">474</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +8.2% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(33.35)}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +3.8% from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
                <Users className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">409</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  +15.3% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends (Last 7 Days)</CardTitle>
              <CardDescription>Daily revenue and transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Best performers this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProductsData.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-yellow-600' : 'bg-primary'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sold} sold</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{formatCurrency(product.revenue)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staff Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Top performers this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffPerformanceData.map((staff) => (
                    <div key={staff.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.transactions} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-primary">{formatCurrency(staff.sales)}</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-yellow-500">★</span>
                          <span className="text-xs font-medium">{staff.avgRating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* DIAGNOSTIC ANALYTICS TAB */}
        <TabsContent value="diagnostic" className="space-y-6">
          {/* Insight Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6PM</div>
                <p className="text-xs text-muted-foreground">
                  Highest sales volume
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Combo</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  Chips + Soda purchases
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-xs text-muted-foreground">
                  Returning customers
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Peak Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
                <CardDescription>Sales distribution throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Sales']}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Customer Retention Pie */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Customer segmentation by visit frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={retentionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.segment}: ${entry.value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {retentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Product Correlation Table */}
          <Card>
            <CardHeader>
              <CardTitle>Product Correlation Analysis</CardTitle>
              <CardDescription>Frequently purchased together items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {productCorrelationData.map((item) => (
                  <div key={item.combo} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{item.combo}</p>
                        <p className="text-xs text-muted-foreground">{item.frequency} times purchased</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{formatCurrency(item.revenue)}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREDICTIVE ANALYTICS TAB */}
        <TabsContent value="predictive" className="space-y-6">
          {/* Prediction Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Month Forecast</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(65000)}</div>
                <p className="text-xs text-muted-foreground">
                  +6.5% projected growth
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Restock Needed</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Items</div>
                <p className="text-xs text-muted-foreground">
                  In next 7 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Churn Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">30</div>
                <p className="text-xs text-muted-foreground">
                  High-risk customers
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sales Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast (3 Months)</CardTitle>
              <CardDescription>Actual vs predicted revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    formatter={(value: any) => [formatCurrency(value), '']}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Inventory Demand */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Demand Prediction</CardTitle>
                <CardDescription>Predicted vs current stock levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryDemandData.map((item) => (
                    <div key={item.product} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.product}</span>
                        <span className="text-xs text-muted-foreground">
                          Current: {item.current} | Predicted: {item.predicted}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.current < item.reorderPoint ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${(item.current / item.predicted) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Churn Prediction */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Churn Prediction</CardTitle>
                <CardDescription>Risk assessment distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={churnPredictionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="category" type="category" stroke="#64748b" width={100} />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Customers']}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="customers" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRESCRIPTIVE ANALYTICS TAB */}
        <TabsContent value="prescriptive" className="space-y-6">
          {/* Action Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recommended Actions</CardTitle>
                <Lightbulb className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  High priority tasks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expected Impact</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+28%</div>
                <p className="text-xs text-muted-foreground">
                  Potential revenue increase
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <Bell className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate action
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Promotion Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Promotion Suggestions</CardTitle>
              <CardDescription>Data-driven promotion recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promotionSuggestions.map((item) => (
                  <div key={item.product} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        item.priority === 'high' ? 'bg-red-100' : item.priority === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <Lightbulb className={`h-4 w-4 ${
                          item.priority === 'high' ? 'text-red-600' : item.priority === 'medium' ? 'text-orange-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.product} - {item.action}</p>
                        <p className="text-xs text-muted-foreground">Expected increase: {item.expectedIncrease}</p>
                      </div>
                    </div>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                      {item.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Restocking Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Restocking Alerts</CardTitle>
                <CardDescription>Inventory actions needed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {restockingAlerts.map((item) => (
                    <div key={item.product} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${
                          item.urgency === 'critical' ? 'text-red-500' : item.urgency === 'high' ? 'text-orange-500' : 'text-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{item.product}</p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.current}/{item.optimal} • {item.days} days left
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={item.urgency === 'critical' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {item.urgency}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staff Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Scheduling Recommendations</CardTitle>
                <CardDescription>Optimal staffing levels per shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffSchedulingData.map((item) => (
                    <div key={item.shift} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.shift}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Current: {item.current} | Optimal: {item.recommended}
                          </span>
                          {item.gap > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              +{item.gap} needed
                            </Badge>
                          )}
                          {item.gap === 0 && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.gap > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${(item.current / item.recommended) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
