import React, { useState } from 'react';
import { formatCurrency } from '../utils';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    storeName: 'My POS Store',
    storeAddress: '123 Main St, City, State 12345',
    storePhone: '(555) 123-4567',
    storeEmail: 'contact@mystore.com',
    taxRate: 10,
    currency: 'USD',
    receiptHeader: 'Thank you for shopping with us!',
    receiptFooter: 'Please come again!',
    autoPrintReceipt: true,
    lowStockAlert: 10,
    requireLogin: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('posSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      storeName: 'My POS Store',
      storeAddress: '123 Main St, City, State 12345',
      storePhone: '(555) 123-4567',
      storeEmail: 'contact@mystore.com',
      taxRate: 10,
      currency: 'USD',
      receiptHeader: 'Thank you for shopping with us!',
      receiptFooter: 'Please come again!',
      autoPrintReceipt: true,
      lowStockAlert: 10,
      requireLogin: false
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Configure your POS system settings</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  placeholder="Enter store name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange('storeEmail', e.target.value)}
                  placeholder="contact@store.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="storeAddress">Store Address</Label>
                <Textarea
                  id="storeAddress"
                  value={settings.storeAddress}
                  onChange={(e) => handleChange('storeAddress', e.target.value)}
                  placeholder="Enter store address"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  type="tel"
                  value={settings.storePhone}
                  onChange={(e) => handleChange('storePhone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax and Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Tax & Currency</CardTitle>
            <CardDescription>Configure tax rates and currency settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => handleChange('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Settings</CardTitle>
            <CardDescription>Customize receipt appearance and behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiptHeader">Receipt Header</Label>
                <Input
                  id="receiptHeader"
                  value={settings.receiptHeader}
                  onChange={(e) => handleChange('receiptHeader', e.target.value)}
                  placeholder="Thank you for shopping with us!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiptFooter">Receipt Footer</Label>
                <Input
                  id="receiptFooter"
                  value={settings.receiptFooter}
                  onChange={(e) => handleChange('receiptFooter', e.target.value)}
                  placeholder="Please come again!"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoPrintReceipt"
                  checked={settings.autoPrintReceipt}
                  onCheckedChange={(checked) => handleChange('autoPrintReceipt', checked)}
                />
                <Label htmlFor="autoPrintReceipt" className="cursor-pointer">
                  Auto-print receipt after transaction
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Settings</CardTitle>
            <CardDescription>Configure inventory management options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lowStockAlert">Low Stock Alert Level</Label>
                <Input
                  id="lowStockAlert"
                  type="number"
                  min="1"
                  value={settings.lowStockAlert}
                  onChange={(e) => handleChange('lowStockAlert', parseInt(e.target.value))}
                />
                <p className="text-sm text-muted-foreground">
                  Products with stock below this level will be marked as low stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and access control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireLogin"
                  checked={settings.requireLogin}
                  onCheckedChange={(checked) => handleChange('requireLogin', checked)}
                />
                <Label htmlFor="requireLogin" className="cursor-pointer">
                  Require login for all operations
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, users must be logged in to access any part of the system
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;