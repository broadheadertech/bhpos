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
  X
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



  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 -m-4 lg:-m-8">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-card">
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

        {/* Categories */}
        <div className="px-6 py-4 border-b bg-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Find The Best Products</h2>
            <Button variant="link" className="text-primary">View All</Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-200 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {product.description || `${product.category} • ${product.sku}`}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">5.0</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="w-full"
                      size="sm"
                    >
                      Add to cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="w-[380px] border-l bg-card flex flex-col">
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