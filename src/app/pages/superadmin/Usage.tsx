import { Card } from '../../components/ui/card';
import { Activity, MessageSquare, ShoppingCart, Database, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const usageStats = [
  { label: 'Total Messages', value: '1,245,678', change: '+34.2%', icon: MessageSquare },
  { label: 'Total Orders', value: '45,234', change: '+28.5%', icon: ShoppingCart },
  { label: 'API Calls', value: '8,456,789', change: '+42.1%', icon: Activity },
  { label: 'Storage Used', value: '234 GB', change: '+15.3%', icon: Database },
];

const messageActivity = [
  { date: '04-19', messages: 38000, autoReplies: 22000, manualReplies: 16000 },
  { date: '04-20', messages: 42000, autoReplies: 25000, manualReplies: 17000 },
  { date: '04-21', messages: 39000, autoReplies: 23000, manualReplies: 16000 },
  { date: '04-22', messages: 45000, autoReplies: 28000, manualReplies: 17000 },
  { date: '04-23', messages: 48000, autoReplies: 30000, manualReplies: 18000 },
  { date: '04-24', messages: 51000, autoReplies: 32000, manualReplies: 19000 },
  { date: '04-25', messages: 54000, autoReplies: 35000, manualReplies: 19000 },
];

const apiUsage = [
  { endpoint: 'Send Message', calls: 2456789, avgTime: '45ms' },
  { endpoint: 'Get Chats', calls: 1892345, avgTime: '32ms' },
  { endpoint: 'Create Order', calls: 456234, avgTime: '120ms' },
  { endpoint: 'Update Order', calls: 345678, avgTime: '85ms' },
  { endpoint: 'Get Products', calls: 892345, avgTime: '28ms' },
];

const automationUsage = [
  { hour: '00:00', automated: 450, manual: 120 },
  { hour: '04:00', automated: 320, manual: 80 },
  { hour: '08:00', automated: 850, manual: 450 },
  { hour: '12:00', automated: 1200, manual: 680 },
  { hour: '16:00', automated: 980, manual: 520 },
  { hour: '20:00', automated: 720, manual: 380 },
];

export function SuperAdminUsage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2">{stat.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <Icon className="w-8 h-8 text-muted-foreground" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Message Activity (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={messageActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="messages" stroke="var(--color-chart-1)" strokeWidth={2} name="Total Messages" />
            <Line type="monotone" dataKey="autoReplies" stroke="var(--color-chart-2)" strokeWidth={2} name="AI Auto-Replies" />
            <Line type="monotone" dataKey="manualReplies" stroke="var(--color-chart-3)" strokeWidth={2} name="Manual Replies" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4">Automation vs Manual (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={automationUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="automated" fill="var(--color-chart-2)" name="Automated" />
              <Bar dataKey="manual" fill="var(--color-chart-3)" name="Manual" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4">Top API Endpoints</h3>
          <div className="space-y-3">
            {apiUsage.map((api, index) => (
              <div key={api.endpoint} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm">{api.endpoint}</p>
                      <p className="text-xs text-muted-foreground">{api.calls.toLocaleString()} calls</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{api.avgTime}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(api.calls / 2500000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-600" />
            <h4>Automation Rate</h4>
          </div>
          <p className="text-3xl">64.8%</p>
          <p className="text-sm text-muted-foreground mt-1">Messages handled by AI</p>
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-blue-600" />
            <h4>Peak Hour Activity</h4>
          </div>
          <p className="text-3xl">12:00 PM</p>
          <p className="text-sm text-muted-foreground mt-1">1,880 messages/hour</p>
          <p className="text-xs text-muted-foreground mt-2">Highest activity window: 11AM - 2PM</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-5 h-5 text-purple-600" />
            <h4>Storage Growth</h4>
          </div>
          <p className="text-3xl">+15 GB</p>
          <p className="text-sm text-muted-foreground mt-1">This month</p>
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">Total: 234 GB / 500 GB (46.8%)</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '47%' }}></div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Resource Utilization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">CPU Usage</span>
                <span className="text-sm">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm">62%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Bandwidth Usage</span>
                <span className="text-sm">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl mt-1">45ms</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <p className="text-2xl mt-1">0.02%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-2xl mt-1">99.98%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
