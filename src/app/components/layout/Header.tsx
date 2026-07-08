import { useState } from 'react';
import { Bell, Search, User, Settings, LogOut, HelpCircle, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface HeaderProps {
  title: string;
  userType: 'admin' | 'superadmin';
  onLogout?: () => void;
  onMobileMenuToggle?: () => void;
}

export function Header({ title, userType, onLogout, onMobileMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'New order received', message: 'Order #1234 from Rahul Kumar', time: '2m ago', unread: true },
    { id: 2, title: 'Payment confirmed', message: 'PKR 1,29,999 received', time: '15m ago', unread: true },
    { id: 3, title: 'New customer message', message: 'Priya Sharma sent a message', time: '1h ago', unread: false },
  ];

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-foreground text-lg lg:text-xl truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 bg-input-background"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 hover:bg-accent rounded-lg relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-lg shadow-lg z-50">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm">Notifications</h3>
                  <button className="text-xs text-primary">Mark all as read</button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b hover:bg-accent cursor-pointer ${
                      notif.unread ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{notif.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t text-center">
                <button className="text-sm text-primary">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="hover:opacity-80 transition-opacity"
          >
            <Avatar>
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-background border rounded-lg shadow-lg z-50">
              <div className="p-3 border-b">
                <p className="text-sm">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@business.com</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Profile Settings - This will open your profile page to edit personal information.');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-left text-sm"
                >
                  <User className="w-4 h-4" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Account Settings - This will open account security settings, password change, etc.');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-left text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    alert('Help & Support\n\nEmail: support@whatsappcrm.com\nPhone: +92 300 1234567\n\nDocumentation: Check README.md');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-left text-sm"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </button>
              </div>
              <div className="p-2 border-t">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent rounded-lg text-left text-sm text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
