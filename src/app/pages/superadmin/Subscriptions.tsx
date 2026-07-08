import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { CreditCard, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const subscriptionStats = [
  { plan: 'Free', count: 450, revenue: 'PKR 0', color: 'bg-gray-100 text-gray-700' },
  { plan: 'Starter', count: 520, revenue: 'PKR 5,20,000', color: 'bg-green-100 text-green-700' },
  { plan: 'Pro', count: 215, revenue: 'PKR 12,90,000', color: 'bg-blue-100 text-blue-700' },
  { plan: 'Enterprise', count: 60, revenue: 'PKR 18,00,000', color: 'bg-purple-100 text-purple-700' },
];

const subscriptionTrend = [
  { month: 'Jan', Free: 380, Starter: 420, Pro: 180, Enterprise: 45 },
  { month: 'Feb', Free: 410, Starter: 465, Pro: 195, Enterprise: 52 },
  { month: 'Mar', Free: 435, Starter: 498, Pro: 205, Enterprise: 58 },
  { month: 'Apr', Free: 450, Starter: 520, Pro: 215, Enterprise: 60 },
];

const revenueTrend = [
  { month: 'Jan', revenue: 2850000 },
  { month: 'Feb', revenue: 3120000 },
  { month: 'Mar', revenue: 3450000 },
  { month: 'Apr', revenue: 3610000 },
];

const expiringSubscriptions = [
  { id: 1, business: 'Tech Store Mumbai', plan: 'Pro', expiry: '2026-04-28', value: 'PKR 6,000' },
  { id: 2, business: 'Fashion Boutique', plan: 'Starter', expiry: '2026-04-29', value: 'PKR 1,000' },
  { id: 3, business: 'Electronics Hub', plan: 'Enterprise', expiry: '2026-05-01', value: 'PKR 30,000' },
  { id: 4, business: 'Home Decor Store', plan: 'Pro', expiry: '2026-05-02', value: 'PKR 6,000' },
];

export function SuperAdminSubscriptions() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionStats.map((stat) => (
          <Card key={stat.plan} className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded ${stat.color}`}>{stat.plan}</span>
                <CreditCard className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <h3 className="mt-1">{stat.count}</h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="mt-1">{stat.revenue}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subscriptionTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Free" fill="var(--color-chart-1)" />
              <Bar dataKey="Starter" fill="var(--color-chart-2)" />
              <Bar dataKey="Pro" fill="var(--color-chart-3)" />
              <Bar dataKey="Enterprise" fill="var(--color-chart-4)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <h3>Expiring Subscriptions (Next 7 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4">Business</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Expiry Date</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expiringSubscriptions.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-accent">
                  <td className="py-3 px-4">{sub.business}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">{sub.plan}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {sub.expiry}
                    </div>
                  </td>
                  <td className="py-3 px-4">{sub.value}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4>Upgrades This Month</h4>
          </div>
          <p className="text-3xl">42</p>
          <p className="text-sm text-muted-foreground mt-1">+18% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h4>Downgrades This Month</h4>
          </div>
          <p className="text-3xl">8</p>
          <p className="text-sm text-muted-foreground mt-1">-12% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h4>Churn Rate</h4>
          </div>
          <p className="text-3xl">2.3%</p>
          <p className="text-sm text-muted-foreground mt-1">-0.5% from last month</p>
        </Card>
      </div>
    </div>
  );
}
