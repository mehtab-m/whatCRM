import { MessageSquare, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useData } from '../../context/DataContext';

const statsData = [
  { label: 'Active Chats', value: '24', change: '+12%', icon: MessageSquare, color: 'text-chart-1' },
  { label: 'Orders Today', value: '48', change: '+8%', icon: ShoppingCart, color: 'text-chart-2' },
  { label: 'Total Customers', value: '1,234', change: '+23%', icon: Users, color: 'text-chart-3' },
  { label: 'Revenue (PKR )', value: 'PKR 45,678', change: '+15%', icon: TrendingUp, color: 'text-chart-4' },
];

const ordersData = [
  { day: 'Mon', orders: 12 },
  { day: 'Tue', orders: 19 },
  { day: 'Wed', orders: 15 },
  { day: 'Thu', orders: 25 },
  { day: 'Fri', orders: 22 },
  { day: 'Sat', orders: 30 },
  { day: 'Sun', orders: 28 },
];

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Apr', revenue: 6100 },
];

export function AdminDashboard() {
  const { orders } = useData();
  const recentOrders = orders.slice(0, 5);

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    dispatched: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-1 md:mt-2 text-base md:text-lg truncate">{stat.value}</h3>
                  <p className="text-xs md:text-sm text-green-600 mt-0.5 md:mt-1">{stat.change}</p>
                </div>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color} flex-shrink-0 ml-2`} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Orders This Week</h3>
          <ResponsiveContainer width="100%" height={200} className="md:h-[250px]">
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="var(--color-chart-1)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={200} className="md:h-[250px]">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-4 md:p-6 lg:col-span-2">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Recent Orders</h3>
          <div className="space-y-2 md:space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 md:p-3 bg-muted rounded-lg hover:shadow-md transition-shadow cursor-pointer gap-2">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xs md:text-sm flex-shrink-0">
                      {order.ref.slice(-2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm truncate">{order.ref}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.product}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs md:text-sm whitespace-nowrap">{order.amount}</p>
                    <Badge variant="secondary" className={`mt-1 text-xs ${statusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 opacity-50" />
                <p className="text-sm md:text-base">No recent orders</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="mb-3 md:mb-4 text-base md:text-lg">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2.5 md:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base">
              New Order
            </button>
            <button className="w-full px-4 py-2.5 md:py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm md:text-base">
              Add Product
            </button>
            <button className="w-full px-4 py-2.5 md:py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm md:text-base">
              Send Campaign
            </button>
            <button className="w-full px-4 py-2.5 md:py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent text-sm md:text-base">
              View Analytics
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
