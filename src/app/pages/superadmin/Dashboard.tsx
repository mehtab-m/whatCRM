import { Card } from '../../components/ui/card';
import { Building2, DollarSign, Users, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const platformStats = [
  { label: 'Total Businesses', value: '1,245', change: '+12.5%', icon: Building2, color: 'text-chart-1' },
  { label: 'Monthly Revenue', value: 'PKR 25,67,890', change: '+23.1%', icon: DollarSign, color: 'text-chart-2' },
  { label: 'Active Users', value: '8,456', change: '+18.3%', icon: Users, color: 'text-chart-3' },
  { label: 'Growth Rate', value: '34.2%', change: '+5.2%', icon: TrendingUp, color: 'text-chart-4' },
];

const revenueData = [
  { month: 'Jan', revenue: 1800000, businesses: 980 },
  { month: 'Feb', revenue: 2100000, businesses: 1050 },
  { month: 'Mar', revenue: 2300000, businesses: 1150 },
  { month: 'Apr', revenue: 2567890, businesses: 1245 },
];

const subscriptionData = [
  { plan: 'Free', count: 450 },
  { plan: 'Starter', count: 520 },
  { plan: 'Pro', count: 215 },
  { plan: 'Enterprise', count: 60 },
];

const recentBusinesses = [
  { id: 1, name: 'Tech Store Mumbai', plan: 'Pro', revenue: 'PKR 45,000', joined: '2026-04-24' },
  { id: 2, name: 'Fashion Boutique', plan: 'Starter', revenue: 'PKR 12,000', joined: '2026-04-24' },
  { id: 3, name: 'Electronics Hub', plan: 'Enterprise', revenue: 'PKR 98,000', joined: '2026-04-23' },
  { id: 4, name: 'Home Decor Store', plan: 'Pro', revenue: 'PKR 32,000', joined: '2026-04-23' },
  { id: 5, name: 'Book Paradise', plan: 'Starter', revenue: 'PKR 8,500', joined: '2026-04-22' },
];

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2">{stat.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4">Platform Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} name="Revenue (PKR )" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Subscriptions by Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subscriptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="var(--color-chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Businesses</h3>
            <button className="text-sm text-primary">View All</button>
          </div>
          <div className="space-y-3">
            {recentBusinesses.map((business) => (
              <div key={business.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                    {business.name.charAt(0)}
                  </div>
                  <div>
                    <p>{business.name}</p>
                    <p className="text-sm text-muted-foreground">{business.joined}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{business.revenue}</p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {business.plan}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">API Response Time</span>
                <span className="text-sm">45ms</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Server Uptime</span>
                <span className="text-sm">99.9%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Message Delivery</span>
                <span className="text-sm">98.5%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Storage Usage</span>
                <span className="text-sm">67%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
