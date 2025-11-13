import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Store, Smartphone, Tablet, Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      {/* Theme Toggle - Top Right */}
      <div className="fixed top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">POS System</h1>
          <p className="text-muted-foreground">Modern Point of Sale Solution</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your POS dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(error && "border-destructive")}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(error && "border-destructive")}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <div className="mt-6">
          <Card className="bg-muted/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-center">Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { role: 'Admin', username: 'admin', color: 'bg-red-500/10 text-red-600 dark:text-red-400' },
                  { role: 'Manager', username: 'manager1', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' },
                  { role: 'Cashier', username: 'cashier1', color: 'bg-green-500/10 text-green-600 dark:text-green-400' }
                ].map((account) => (
                  <div key={account.role} className="text-center">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${account.color}`}>
                      {account.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {account.username}
                    </div>
                    <div className="text-xs text-muted-foreground/70">
                      password123
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsive Preview */}
        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Smartphone className="w-4 h-4" />
            Mobile
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Tablet className="w-4 h-4" />
            Tablet
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Monitor className="w-4 h-4" />
            Desktop
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;