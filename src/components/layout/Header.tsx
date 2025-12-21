import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, AlertTriangle, BarChart3, Server, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/live', label: 'Live Transactions', icon: Activity },
  { path: '/alerts', label: 'Fraud Alerts', icon: AlertTriangle },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/nodes', label: 'Fault Tolerance', icon: Server },
];

interface HeaderProps {
  isRunning?: boolean;
  fraudCount?: number;
}

export const Header = ({ isRunning = false, fraudCount = 0 }: HeaderProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
              {isRunning && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold tracking-tight">FraudShield</h1>
              <p className="text-xs text-muted-foreground">Fraud Detection System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link key={path} to={path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={`gap-2 ${isActive ? 'bg-secondary' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {path === '/alerts' && fraudCount > 0 && (
                      <Badge variant="danger" className="ml-1 h-5 px-1.5">
                        {fraudCount > 99 ? '99+' : fraudCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50">
              <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {isRunning ? 'System Active' : 'System Idle'}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                      {path === '/alerts' && fraudCount > 0 && (
                        <Badge variant="danger" className="ml-auto">
                          {fraudCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
