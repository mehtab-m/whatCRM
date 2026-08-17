import { useEffect, useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DataProvider } from './context/DataContext';
import { getMeApi, getToken, loginApi, registerApi, setToken, clearToken } from './lib/api';

import { LandingPage } from './pages/landing/LandingPage';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { VerifyResetOtp } from './pages/auth/VerifyResetOtp';
import { ResetPassword } from './pages/auth/ResetPassword';

import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminChats } from './pages/admin/Chats';
import { AdminOrders } from './pages/admin/Orders';
import { AdminProducts } from './pages/admin/Products';
import { AdminCustomers } from './pages/admin/Customers';
import { AdminAutomation } from './pages/admin/Automation';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminCampaigns } from './pages/admin/Campaigns';
import { AdminSettings } from './pages/admin/Settings';

import { SuperAdminDashboard } from './pages/superadmin/Dashboard';
import { SuperAdminBusinesses } from './pages/superadmin/Businesses';
import { SuperAdminSubscriptions } from './pages/superadmin/Subscriptions';
import { SuperAdminRevenue } from './pages/superadmin/Revenue';
import { SuperAdminUsage } from './pages/superadmin/Usage';
import { SuperAdminSystem } from './pages/superadmin/System';
import { SuperAdminLogs } from './pages/superadmin/Logs';
import { SuperAdminSupport } from './pages/superadmin/Support';

type AppView = 'landing' | 'login' | 'signup' | 'forgot-password' | 'verify-reset-otp' | 'reset-password' | 'dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [currentPath, setCurrentPath] = useState('/admin/dashboard');
  const [user, setUser] = useState<any>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  // When navigating to Chats from an order/customer, open that customer's chat.
  const [chatCustomerTarget, setChatCustomerTarget] = useState<string | null>(null);
  // Restoring a session from a stored JWT on first load (avoids flashing the
  // landing page for an already-logged-in user on refresh).
  const [restoringSession, setRestoringSession] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setRestoringSession(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const me = await getMeApi();
        if (cancelled) return;
        setUser({ email: me.email, name: me.fullName, role: me.role, business: me.businessName });
        setView('dashboard');
        setCurrentPath(me.role === 'crm_owner' ? '/superadmin/dashboard' : '/admin/dashboard');
      } catch {
        if (!cancelled) clearToken();
      } finally {
        if (!cancelled) setRestoringSession(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const navigateToChat = (customerId?: string) => {
    setChatCustomerTarget(customerId ?? null);
    setCurrentPath('/admin/chats');
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const result = await loginApi(email, password);
    setToken(result.token);
    setUser({
      email: result.user.email,
      name: result.user.fullName,
      role: result.user.role,
    });
    setView('dashboard');
    setCurrentPath(result.user.role === 'crm_owner' ? '/superadmin/dashboard' : '/admin/dashboard');
  };

  const handleSignup = async (data: {
    fullName: string;
    email: string;
    password: string;
    businessName: string;
    phone?: string;
  }): Promise<void> => {
    const result = await registerApi({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      businessName: data.businessName,
      phone: data.phone,
    });
    setToken(result.token);
    setUser({
      email: result.user.email,
      name: result.user.fullName,
      role: result.user.role,
      business: result.user.businessName,
    });
    setView('dashboard');
    setCurrentPath('/admin/dashboard');
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
    setView('landing');
  };

  if (restoringSession) {
    return <div className="min-h-screen bg-background" />;
  }

  // If user is not logged in, show landing/auth pages
  if (!user && view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('signup')}
        onLogin={() => setView('login')}
      />
    );
  }

  if (!user && view === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => setView('signup')}
        onBack={() => setView('landing')}
        onForgotPassword={() => setView('forgot-password')}
      />
    );
  }
if (!user && view === 'forgot-password') {
  return (
    <ForgotPassword
      onBack={() => setView('login')}
      onOtpSent={(email) => {
        setResetEmail(email);
        setView('verify-reset-otp');
      }}
    />
  );
}

  if (!user && view === 'verify-reset-otp') {
  return (
    <VerifyResetOtp
      email={resetEmail}
      onBack={() => setView('forgot-password')}
      onVerified={(token) => {
        setResetToken(token);
        setView('reset-password');
      }}
    />
  );
}

  if (!user && view === 'reset-password') {
  return (
    <ResetPassword
      resetToken={resetToken}
      onBack={() => setView('verify-reset-otp')}
      onSuccess={() => {
        setResetEmail('');
        setResetToken('');
        setView('login');
      }}
    />
  );
}

  if (!user && view === 'signup') {
    return (
      <Signup
        onSignup={handleSignup}
        onLogin={() => setView('login')}
        onBack={() => setView('landing')}
      />
    );
  }

  // Dashboard view
  const userType = currentPath.startsWith('/superadmin') ? 'superadmin' : 'admin';

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/admin/dashboard': 'Dashboard',
      '/admin/chats': 'Chats',
      '/admin/orders': 'Orders',
      '/admin/products': 'Products',
      '/admin/customers': 'Customers',
      '/admin/automation': 'Automation',
      '/admin/analytics': 'Analytics',
      '/admin/campaigns': 'Campaigns',
      '/admin/settings': 'Settings',
      '/superadmin/dashboard': 'Platform Overview',
      '/superadmin/businesses': 'Businesses',
      '/superadmin/subscriptions': 'Subscriptions',
      '/superadmin/revenue': 'Revenue Analytics',
      '/superadmin/usage': 'Usage Analytics',
      '/superadmin/system': 'System Settings',
      '/superadmin/logs': 'Logs & Activity',
      '/superadmin/support': 'Support Tickets',
    };
    return titles[currentPath] || 'Dashboard';
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/chats':
        return (
          <AdminChats
            initialCustomerId={chatCustomerTarget}
            onConsumeInitialCustomer={() => setChatCustomerTarget(null)}
          />
        );
      case '/admin/orders':
        return <AdminOrders onNavigateToChat={navigateToChat} />;
      case '/admin/products':
        return <AdminProducts canDelete={user?.role !== 'business_employee'} />;
      case '/admin/customers':
        return (
          <AdminCustomers
            onNavigateToChat={navigateToChat}
            onNavigateToOrders={() => setCurrentPath('/admin/orders')}
          />
        );
      case '/admin/automation':
        return <AdminAutomation onNavigateToSettings={() => setCurrentPath('/admin/settings')} />;
      case '/admin/analytics':
        return <AdminAnalytics />;
      case '/admin/campaigns':
        return <AdminCampaigns />;
      case '/admin/settings':
        // Business settings (incl. WhatsApp credentials + team) are owner-only;
        // the backend also 403s an employee here, this is just defense in depth.
        return user?.role === 'business_employee' ? <AdminDashboard /> : <AdminSettings />;
      case '/superadmin/dashboard':
        return <SuperAdminDashboard />;
      case '/superadmin/businesses':
        return <SuperAdminBusinesses />;
      case '/superadmin/subscriptions':
        return <SuperAdminSubscriptions />;
      case '/superadmin/revenue':
        return <SuperAdminRevenue />;
      case '/superadmin/usage':
        return <SuperAdminUsage />;
      case '/superadmin/system':
        return <SuperAdminSystem />;
      case '/superadmin/logs':
        return <SuperAdminLogs />;
      case '/superadmin/support':
        return <SuperAdminSupport />;
      default:
        return <AdminDashboard />;
    }
  };

  const isChatsPage = currentPath === '/admin/chats';

  return (
    <DataProvider isAuthenticated={!!user} isOwnerLevel={user?.role !== 'business_employee'}>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          userType={userType}
          role={user?.role}
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Header
            title={getPageTitle()}
            userType={userType}
            onLogout={handleLogout}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          />
          <main
            className={`flex-1 min-h-0 p-3 sm:p-4 lg:p-6 ${
              isChatsPage
                ? 'overflow-hidden flex flex-col'
                : 'overflow-y-auto'
            }`}
          >
            {renderPage()}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}