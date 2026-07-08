import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, TrendingDown, MessageSquare, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const kpiData = [
  { label: 'Total Revenue', value: 'PKR 12,45,678', change: '+23.5%', trend: 'up', icon: DollarSign },
  { label: 'Total Orders', value: '1,234', change: '+18.2%', trend: 'up', icon: ShoppingCart },
  { label: 'Active Customers', value: '856', change: '-5.3%', trend: 'down', icon: Users },
  { label: 'Avg. Order Value', value: 'PKR 1,009', change: '+12.1%', trend: 'up', icon: TrendingUp },
];

const revenueData = [
  { month: 'Jan', revenue: 65000, orders: 89 },
  { month: 'Feb', revenue: 78000, orders: 105 },
  { month: 'Mar', revenue: 92000, orders: 124 },
  { month: 'Apr', revenue: 125000, orders: 156 },
];

const categoryData = [
  { name: 'Electronics', value: 45, color: 'var(--color-chart-1)' },
  { name: 'Accessories', value: 30, color: 'var(--color-chart-2)' },
  { name: 'Computers', value: 15, color: 'var(--color-chart-3)' },
  { name: 'Others', value: 10, color: 'var(--color-chart-4)' },
];

const chatData = [
  { day: 'Mon', resolved: 45, pending: 12 },
  { day: 'Tue', resolved: 52, pending: 8 },
  { day: 'Wed', resolved: 48, pending: 15 },
  { day: 'Thu', resolved: 61, pending: 10 },
  { day: 'Fri', resolved: 55, pending: 18 },
  { day: 'Sat', resolved: 67, pending: 22 },
  { day: 'Sun', resolved: 58, pending: 14 },
];

export function AdminAnalytics() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <Card key={kpi.label} className="p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{kpi.label}</p>
                  <h3 className="mt-1 md:mt-2 text-base md:text-lg truncate">{kpi.value}</h3>
                  <div className={`flex items-center gap-1 mt-1 md:mt-2 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">{kpi.change}</span>
                  </div>
                </div>
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 lg:col-span-2">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Revenue & Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2} name="Revenue (PKR )" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="var(--color-chart-2)" strokeWidth={2} name="Orders" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 md:mt-4 space-y-1.5 md:space-y-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded flex-shrink-0" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-xs md:text-sm">{cat.name}</span>
                </div>
                <span className="text-xs md:text-sm">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        <h3 className="mb-3 md:mb-4 text-base md:text-lg">Chat Resolution Analytics</h3>
        <ResponsiveContainer width="100%" height={250} className="md:h-[300px]">
          <BarChart data={chatData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="resolved" fill="var(--color-chart-2)" name="Resolved" />
            <Bar dataKey="pending" fill="var(--color-chart-4)" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Card className="p-4 md:p-6">
          <h4 className="mb-3 md:mb-4 text-sm md:text-base">Top Products</h4>
          <div className="space-y-2 md:space-y-3">
            {['iPhone 15 Pro', 'MacBook Pro', 'iPad Air'].map((product, i) => (
              <div key={product} className="flex items-center justify-between gap-2">
                <span className="text-xs md:text-sm truncate">{product}</span>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">{85 - i * 15} sales</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h4 className="mb-3 md:mb-4 text-sm md:text-base">Top Customers</h4>
          <div className="space-y-2 md:space-y-3">
            {['Rahul Kumar', 'Priya Sharma', 'Amit Patel'].map((customer, i) => (
              <div key={customer} className="flex items-center justify-between gap-2">
                <span className="text-xs md:text-sm truncate">{customer}</span>
                <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">PKR {(200000 - i * 50000).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h4 className="mb-3 md:mb-4 text-sm md:text-base">Response Time</h4>
          <div className="space-y-2 md:space-y-3">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Average</p>
              <p className="text-xl md:text-2xl mt-1">2.5 min</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Fastest</p>
              <p className="text-sm mt-1">30 sec</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">Slowest</p>
              <p className="text-sm mt-1">15 min</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
