import React, { useState, useEffect } from 'react';
import { useDataStore } from '../stores/dataStore';
import { formatCurrency, formatDate } from '../utils';
import { Product } from '../types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Barcode,
  DollarSign,
  Boxes,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';

const Inventory: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addInventoryLog } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockType, setStockType] = useState<'in' | 'out' | 'adjust'>('in');
  const [stockReason, setStockReason] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    category: '',
    barcode: '',
    description: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.price || !formData.cost || !formData.stock || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = {
      name: formData.name,
      sku: formData.sku,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      category: formData.category,
      barcode: formData.barcode,
      description: formData.description
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
    } else {
      addProduct(productData);
      toast.success('Product added successfully');
    }

    resetForm();
    setShowModal(false);
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stockProduct || !stockQuantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantity = parseInt(stockQuantity);
    let newStock = stockProduct.stock;
    let type: 'stock_in' | 'stock_out' | 'adjustment' = 'stock_in';
    
    switch (stockType) {
      case 'in':
        newStock += quantity;
        type = 'stock_in';
        break;
      case 'out':
        if (quantity > stockProduct.stock) {
          toast.error('Not enough stock available');
          return;
        }
        newStock -= quantity;
        type = 'stock_out';
        break;
      case 'adjust':
        newStock = quantity;
        type = 'adjustment';
        break;
    }

    updateProduct(stockProduct.id, { stock: newStock });
    
    addInventoryLog({
      productId: stockProduct.id,
      productName: stockProduct.name,
      type,
      quantity: Math.abs(quantity),
      previousStock: stockProduct.stock,
      newStock,
      reason: stockReason,
      userId: 'current-user',
      userName: 'Current User'
    });

    toast.success('Stock updated successfully');
    setShowStockModal(false);
    resetStockForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: '',
      cost: '',
      stock: '',
      category: '',
      barcode: '',
      description: ''
    });
    setEditingProduct(null);
  };

  const resetStockForm = () => {
    setStockQuantity('');
    setStockReason('');
    setStockType('in');
    setStockProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      category: product.category,
      barcode: product.barcode || '',
      description: product.description || ''
    });
    setShowModal(true);
  };

  const openStockModal = (product: Product) => {
    setStockProduct(product);
    setShowStockModal(true);
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast.success('Product deleted successfully');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'destructive', variant: 'destructive' as const };
    if (stock < 10) return { text: 'Low Stock', color: 'warning', variant: 'secondary' as const };
    return { text: 'In Stock', color: 'success', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your products and track stock levels
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => p.stock === 0).length} out of stock
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.filter(p => p.stock < 10 && p.stock > 0).length}</div>
            <p className="text-xs text-muted-foreground">
              Need restocking soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(products.reduce((sum, p) => sum + (p.stock * p.cost), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Inventory investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find products quickly using search and category filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            {filteredProducts.length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Barcode className="h-3 w-3 text-muted-foreground" />
                          {product.sku}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(product.price)}</p>
                          <p className="text-sm text-muted-foreground">Cost: {formatCurrency(product.cost)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.stock}</span>
                          {product.stock < 10 && (
                            <Badge variant="destructive" className="text-xs">
                              Low
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStockModal(product)}
                            title="Update Stock"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(product)}
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                            title="Delete Product"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Add a new product to your inventory'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost *</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    required
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Enter barcode"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Update Modal */}
      <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
            <DialogDescription>
              Update stock levels for {stockProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStockUpdate}>
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-2xl font-bold">{stockProduct?.stock}</p>
              </div>
              <div className="space-y-2">
                <Label>Update Type</Label>
                <Select value={stockType} onValueChange={(value) => setStockType(value as 'in' | 'out' | 'adjust')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Stock In
                      </div>
                    </SelectItem>
                    <SelectItem value="out">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        Stock Out
                      </div>
                    </SelectItem>
                    <SelectItem value="adjust">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                        Adjust Stock
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">
                  {stockType === 'adjust' ? 'New Stock Quantity' : 'Quantity'}
                </Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder={stockType === 'adjust' ? 'Enter new stock quantity' : 'Enter quantity'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockReason">Reason (Optional)</Label>
                <Input
                  id="stockReason"
                  value={stockReason}
                  onChange={(e) => setStockReason(e.target.value)}
                  placeholder="Reason for stock update"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowStockModal(false);
                  resetStockForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Stock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;