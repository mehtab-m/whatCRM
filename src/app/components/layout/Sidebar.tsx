import {
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
  Package,
  Users,
  Zap,
  BarChart3,
  Megaphone,
  Settings,
  Building2,
  CreditCard,
  DollarSign,
  Activity,
  Database,
  FileText,
  HeadphonesIcon,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  userType: 'admin' | 'superadmin';
  currentPath: string;
  onNavigate: (path: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ userType, currentPath, onNavigate, isMobileOpen, onMobileClose }: SidebarProps) {
  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: MessageSquare, label: 'Chats', path: '/admin/chats' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Zap, label: 'Automation', path: '/admin/automation' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Megaphone, label: 'Campaigns', path: '/admin/campaigns' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const superAdminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin/dashboard' },
    { icon: Building2, label: 'Businesses', path: '/superadmin/businesses' },
    { icon: CreditCard, label: 'Subscriptions', path: '/superadmin/subscriptions' },
    { icon: DollarSign, label: 'Revenue', path: '/superadmin/revenue' },
    { icon: Activity, label: 'Usage Analytics', path: '/superadmin/usage' },
    { icon: Database, label: 'System Settings', path: '/superadmin/system' },
    { icon: FileText, label: 'Logs & Activity', path: '/superadmin/logs' },
    { icon: HeadphonesIcon, label: 'Support', path: '/superadmin/support' },
  ];

  const menuItems = userType === 'admin' ? adminMenuItems : superAdminMenuItems;

  const handleNavigate = (path: string) => {
    onNavigate(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col",
          "fixed lg:static top-0 left-0 z-50 transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sidebar-foreground">
                {userType === 'admin' ? 'Business Dashboard' : 'Super Admin'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {userType === 'admin' ? 'WhatsApp CRM' : 'Platform Management'}
              </p>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="px-4 py-3 bg-accent/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              {userType === 'admin' ? 'Logged in as Admin' : 'Super Admin Access'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
