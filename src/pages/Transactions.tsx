import React, { useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { formatCurrency, formatDate } from '../utils';
import { Transaction } from '../types';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Search,
  Printer,
  Download,
  Eye,
  ArrowDown,
  Receipt,
  Calendar,
  User,
  CreditCard,
  Package,
  DollarSign,
  Filter
} from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions, getTransactionById } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.cashierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExport = () => {
    const csvContent = [
      ['Transaction ID', 'Date', 'Cashier', 'Items', 'Subtotal', 'Tax', 'Total', 'Payment Method', 'Status'],
      ...filteredTransactions.map(t => [
        t.id,
        formatDate(t.createdAt),
        t.cashierName,
        t.items.reduce((sum, item) => sum + item.quantity, 0).toString(),
        t.subtotal.toFixed(2),
        t.tax.toFixed(2),
        t.total.toFixed(2),
        t.paymentMethod,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Transactions exported successfully');
  };

  const Receipt: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <div className="bg-background p-6 max-w-md mx-auto border rounded-lg print:p-4 print:border-none">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">POS SYSTEM</h2>
        <p className="text-sm text-muted-foreground">Transaction Receipt</p>
        <div className="border-t border-dashed border-border my-2"></div>
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Transaction #:</span>
          <span className="font-medium">{transaction.id.slice(-6)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date:</span>
          <span className="font-medium">{formatDate(transaction.createdAt)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Cashier:</span>
          <span className="font-medium">{transaction.cashierName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment:</span>
          <Badge variant="outline" className="capitalize">
            {transaction.paymentMethod}
          </Badge>
        </div>
      </div>

      <div className="border-t border-dashed border-border my-2"></div>

      <div className="mb-4 space-y-2">
        {transaction.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div>
              <div className="font-medium">{item.product.name}</div>
              <div className="text-muted-foreground">{item.quantity} × {formatCurrency(item.product.price)}</div>
            </div>
            <div className="font-medium">{formatCurrency(item.product.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-border my-2"></div>

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal:</span>
          <span>{formatCurrency(transaction.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax:</span>
          <span>{formatCurrency(transaction.tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-dashed border-border pt-2">
          <span>Total:</span>
          <span>{formatCurrency(transaction.total)}</span>
        </div>
      </div>

      <div className="border-t border-dashed border-border my-2"></div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Thank you for your purchase!</p>
        <p>Please come again.</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="mt-2 text-sm text-gray-600">View and manage all transactions</p>
        </div>
        <button
          onClick={handleExport}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowDown className="-ml-1 mr-2 h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions by ID, cashier, or payment method..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.cashierName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.subtotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.tax)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePrint(transaction)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Print Receipt"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setShowReceipt(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="View Receipt"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Transaction Receipt</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePrint(selectedTransaction)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </button>
                  <button
                    onClick={() => setShowReceipt(false)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
              <Receipt transaction={selectedTransaction} />
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\:p-4, .print\:p-4 * {
            visibility: visible;
          }
          .print\:p-4 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Transactions;