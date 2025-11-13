import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Home,
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  Settings,
  Menu,
  LogOut,
  Store,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'manager', 'cashier'] },
    { name: 'POS', href: '/pos', icon: ShoppingCart, roles: ['admin', 'cashier'] },
    { name: 'Inventory', href: '/inventory', icon: Package, roles: ['admin', 'manager'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['admin', 'manager'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'manager'] },
  ];

  const filteredNavigation = navigation.filter(item =>
    user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItems = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("space-y-1", isMobile ? "px-3" : "")}>
      {filteredNavigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => isMobile && setIsMobileMenuOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isMobile ? "w-full" : ""
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="flex-1">{item.name}</span>
            {isActive && <ChevronRight className="h-4 w-4" />}
          </Link>
        );
      })}
    </div>
  );

  const UserSection = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-muted/50">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{user?.username}</p>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-xs capitalize">
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">POS System</span>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 py-4 px-3 overflow-y-auto">
            <NavItems />
          </div>
          
          {/* Bottom Section */}
          <div className="p-3 border-t space-y-3">
            <UserSection />
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex-1 justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold">POS</span>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="flex items-center h-16 px-4 border-b">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Store className="h-5 w-5" />
                      </div>
                      <span className="text-lg font-bold">POS System</span>
                    </div>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex-1 py-4 overflow-y-auto">
                    <NavItems isMobile={true} />
                  </div>
                  
                  {/* Bottom Section */}
                  <div className="p-3 border-t space-y-3">
                    <UserSection />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;