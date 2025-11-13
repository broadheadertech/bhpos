import React, { useState, useEffect } from 'react';
import { useCartStore } from '../stores/cartStore';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../utils';
import { Product } from '../types';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Star,
  Heart,
  Filter,
  ShoppingBag,
  CreditCard,
  Wallet,
  X,
  ShoppingCart,
  Receipt,
  History,
  Grid3x3
} from 'lucide-react';

const POS: React.FC = () => {
  const { items, addToCart, removeFromCart, updateQuantity, getSubtotal, getTotal } = useCartStore();
  const { products, addTransaction } = useDataStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderType, setOrderType] = useState<'in-store' | 'pickup' | 'delivery'>('in-store');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [discount, setDiscount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const categories = ['All', 'Beverages', 'Snacks', 'Dairy', 'Fresh Produce', 'Frozen', 'Household', 'Personal Care', 'Bakery'];

  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.includes(searchTerm)
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (product: Product) => {
    if (product.stock > 0) {
      addToCart(product);
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error('Product is out of stock');
    }
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.stock) {
      updateQuantity(productId, newQuantity);
    } else if (product) {
      toast.error(`Only ${product.stock} items available in stock`);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (paymentMethod === 'cash') {
      const received = parseFloat(cashReceived);
      if (isNaN(received) || received < getTotal()) {
        toast.error('Insufficient cash received');
        return;
      }
    }

    const transaction = addTransaction({
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        discount: item.discount
      })),
      subtotal: getSubtotal(),
      tax: getTotal() - getSubtotal(),
      discount: discount,
      total: getTotal() - discount,
      paymentMethod,
      cashierId: user?.id || 'unknown',
      cashierName: user?.username || 'Unknown',
      status: 'completed'
    });

    toast.success(`Transaction completed! Total: ${formatCurrency(getTotal() - discount)}`);
    
    useCartStore.getState().clearCart();
    setCashReceived('');
    setDiscount(0);
  };

  const getTotalWithDiscount = () => getTotal() - discount;
  const changeDue = paymentMethod === 'cash' ? Math.max(0, parseFloat(cashReceived) - getTotalWithDiscount()) : 0;

  // Mobile Cart Content Component
  const MobileCartContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-bold">My Cart</h2>
        <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.product.id} className="p-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive shrink-0"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary text-sm">{formatCurrency(item.product.price)}</span>
                      <div className="flex items-center gap-1 bg-muted rounded-lg px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[1.5rem] text-center">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t p-4 space-y-4 bg-card">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-medium text-destructive">-{formatCurrency(discount)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-primary text-lg">{formatCurrency(getTotalWithDiscount())}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('cash')}
                className="h-10"
              >
                Cash
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('card')}
                className="h-10"
              >
                Card
              </Button>
              <Button
                variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPaymentMethod('digital')}
                className="h-10"
              >
                Wallet
              </Button>
            </div>

            {paymentMethod === 'cash' && (
              <Input
                type="number"
                step="0.01"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="Enter cash amount"
                className="h-10"
              />
            )}

            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );



  return (
    <div className="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)] gap-0 lg:gap-6 -m-4 lg:-m-8">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b bg-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <h1 className="text-2xl font-bold">Convenience Store</h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search Here"
                className="w-80 pl-10 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-card border-b">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold">Store POS</h1>
                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="default" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {items.length > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {items.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full p-0">
                  <MobileCartContent />
                </SheetContent>
              </Sheet>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b bg-card">
          <div className="hidden lg:flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Find The Best Products</h2>
            <Button variant="link" className="text-primary">View All</Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap shrink-0 h-8 text-xs lg:h-9 lg:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-6 pb-20 lg:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 lg:gap-3">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 relative overflow-hidden flex flex-col h-[240px] lg:h-[280px]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 lg:top-2 lg:right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 lg:h-8 lg:w-8"
                >
                  <Heart className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                </Button>
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="h-24 lg:h-32 bg-muted flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-10 w-10 lg:h-12 lg:w-12 text-muted-foreground" />
                  </div>
                  <div className="p-2 lg:p-3 flex flex-col flex-1">
                    <h3 className="font-semibold text-xs lg:text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1 lg:mb-2 line-clamp-1">
                      {product.description || product.category}
                    </p>
                    <div className="flex items-center justify-between mb-1.5 lg:mb-2 mt-auto">
                      <span className="text-sm lg:text-base font-bold text-primary">{formatCurrency(product.price)}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 lg:h-3 lg:w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">5.0</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full h-7 lg:h-8 text-xs"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 mr-1 lg:mr-0 lg:hidden" />
                      <span className="hidden lg:inline">Add to cart</span>
                      <span className="lg:hidden">Add</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Grid3x3 className="h-5 w-5" />
            <span className="text-xs">Products</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2 relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-xs">Cart</span>
                {items.length > 0 && (
                  <Badge variant="destructive" className="absolute top-1 right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {items.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full p-0">
              <MobileCartContent />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <Receipt className="h-5 w-5" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
            <History className="h-5 w-5" />
            <span className="text-xs">History</span>
          </Button>
        </div>
      </div>

      {/* Right Side - Cart (Desktop) */}
      <div className="hidden lg:flex w-[380px] border-l bg-card flex-col">
        {/* Cart Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Order</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Order Type */}
          <div className="flex gap-2">
            {[
              { value: 'in-store', label: 'In-Store' },
              { value: 'pickup', label: 'Pick Up' },
              { value: 'delivery', label: 'Delivery' }
            ].map((type) => (
              <Button
                key={type.value}
                variant={orderType === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOrderType(type.value as any)}
                className="flex-1"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary text-sm">{formatCurrency(item.product.price)}</span>
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium min-w-[1.5rem] text-center">
                          {String(item.quantity).padStart(2, '0')}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium text-primary">{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-destructive">-{formatCurrency(discount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total Amount</span>
                <span className="font-bold text-primary">{formatCurrency(getTotalWithDiscount())}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3">
              <h3 className="font-semibold">Payments</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('cash')}
                  className="h-10"
                >
                  Cash
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('card')}
                  className="h-10"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Debit
                </Button>
                <Button
                  variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('digital')}
                  className="h-10"
                >
                  <Wallet className="h-4 w-4 mr-1" />
                  E-Wallet
                </Button>
              </div>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  placeholder="Enter cash amount"
                  className="h-10"
                />
                {cashReceived && parseFloat(cashReceived) >= getTotalWithDiscount() && (
                  <div className="text-sm text-green-600 font-medium">
                    Change: {formatCurrency(changeDue)}
                  </div>
                )}
              </div>
            )}

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-base"
              size="lg"
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;