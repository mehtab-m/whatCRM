import { Card } from '../../components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const revenueStats = [
  { label: 'Total Revenue', value: 'PKR 36,10,000', change: '+23.5%', trend: 'up' },
  { label: 'MRR (Monthly Recurring)', value: 'PKR 36,10,000', change: '+18.2%', trend: 'up' },
  { label: 'ARR (Annual Recurring)', value: 'PKR 4,33,20,000', change: '+25.1%', trend: 'up' },
  { label: 'ARPU (Avg Revenue/User)', value: 'PKR 2,897', change: '+12.3%', trend: 'up' },
];

const monthlyRevenue = [
  { month: 'Oct', revenue: 2450000, expenses: 850000, profit: 1600000 },
  { month: 'Nov', revenue: 2850000, expenses: 920000, profit: 1930000 },
  { month: 'Dec', revenue: 3120000, expenses: 980000, profit: 2140000 },
  { month: 'Jan', revenue: 2850000, expenses: 900000, profit: 1950000 },
  { month: 'Feb', revenue: 3120000, expenses: 950000, profit: 2170000 },
  { month: 'Mar', revenue: 3450000, expenses: 1020000, profit: 2430000 },
  { month: 'Apr', revenue: 3610000, expenses: 1050000, profit: 2560000 },
];

const revenueByPlan = [
  { month: 'Jan', Free: 0, Starter: 420000, Pro: 1290000, Enterprise: 1350000 },
  { month: 'Feb', Free: 0, Starter: 465000, Pro: 1365000, Enterprise: 1560000 },
  { month: 'Mar', Free: 0, Starter: 498000, Pro: 1435000, Enterprise: 1740000 },
  { month: 'Apr', Free: 0, Starter: 520000, Pro: 1505000, Enterprise: 1800000 },
];

const topBusinesses = [
  { id: 1, name: 'Electronics Hub', revenue: 'PKR 98,000', growth: '+34%' },
  { id: 2, name: 'Tech Store Mumbai', revenue: 'PKR 45,000', growth: '+28%' },
  { id: 3, name: 'Home Decor Store', revenue: 'PKR 32,000', growth: '+22%' },
  { id: 4, name: 'Fashion Boutique', revenue: 'PKR 12,000', growth: '+15%' },
  { id: 5, name: 'Book Paradise', revenue: 'PKR 8,500', growth: '+12%' },
];

export function SuperAdminRevenue() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueStats.map((stat) => {
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.label} className="p-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3>{stat.value}</h3>
                <div className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Revenue, Expenses & Profit</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.6} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stackId="2" stroke="var(--color-chart-4)" fill="var(--color-chart-4)" fillOpacity={0.6} name="Expenses" />
            <Area type="monotone" dataKey="profit" stackId="3" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.6} name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4">Revenue by Subscription Plan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Starter" fill="var(--color-chart-2)" name="Starter" />
              <Bar dataKey="Pro" fill="var(--color-chart-3)" name="Pro" />
              <Bar dataKey="Enterprise" fill="var(--color-chart-4)" name="Enterprise" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Top Revenue Businesses</h3>
          <div className="space-y-3">
            {topBusinesses.map((business, index) => (
              <div key={business.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm">{business.name}</p>
                    <p className="text-xs text-green-600">{business.growth}</p>
                  </div>
                </div>
                <p className="text-sm">{business.revenue}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h4>Profit Margin</h4>
          </div>
          <p className="text-3xl">70.9%</p>
          <p className="text-sm text-muted-foreground mt-1">+2.3% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4>Customer LTV</h4>
          </div>
          <p className="text-3xl">PKR 34,764</p>
          <p className="text-sm text-muted-foreground mt-1">Average customer lifetime value</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h4>Revenue Growth</h4>
          </div>
          <p className="text-3xl">23.5%</p>
          <p className="text-sm text-muted-foreground mt-1">Year over year</p>
        </Card>
      </div>
    </div>
  );
}
