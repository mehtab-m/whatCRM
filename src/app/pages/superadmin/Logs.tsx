import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const logsData = [
  { id: 1, timestamp: '2026-04-25 14:35:22', level: 'info', category: 'System', message: 'Database backup completed successfully', business: 'System', user: 'Auto' },
  { id: 2, timestamp: '2026-04-25 14:30:15', level: 'warning', category: 'API', message: 'Rate limit exceeded for business ID: 1245', business: 'Tech Store Mumbai', user: 'API' },
  { id: 3, timestamp: '2026-04-25 14:25:08', level: 'error', category: 'WhatsApp', message: 'Failed to send message - Invalid phone number', business: 'Fashion Boutique', user: 'Admin' },
  { id: 4, timestamp: '2026-04-25 14:20:45', level: 'info', category: 'Auth', message: 'User logged in successfully', business: 'Electronics Hub', user: 'Amit Patel' },
  { id: 5, timestamp: '2026-04-25 14:15:30', level: 'info', category: 'Subscription', message: 'Subscription upgraded to Pro plan', business: 'Home Decor Store', user: 'Neha Gupta' },
  { id: 6, timestamp: '2026-04-25 14:10:18', level: 'critical', category: 'System', message: 'Server CPU usage exceeded 90%', business: 'System', user: 'Auto' },
  { id: 7, timestamp: '2026-04-25 14:05:42', level: 'info', category: 'Order', message: 'New order created successfully', business: 'Book Paradise', user: 'Customer' },
  { id: 8, timestamp: '2026-04-25 14:00:55', level: 'warning', category: 'Storage', message: 'Storage usage at 85% capacity', business: 'System', user: 'Auto' },
  { id: 9, timestamp: '2026-04-25 13:55:33', level: 'info', category: 'Campaign', message: 'Campaign sent to 1,234 users', business: 'Tech Store Mumbai', user: 'Admin' },
  { id: 10, timestamp: '2026-04-25 13:50:20', level: 'error', category: 'Payment', message: 'Payment processing failed - Card declined', business: 'Fashion Boutique', user: 'Customer' },
];

const activityStats = [
  { label: 'Total Events', value: '45,678', icon: Info, color: 'text-blue-600' },
  { label: 'Errors', value: '234', icon: AlertCircle, color: 'text-red-600' },
  { label: 'Warnings', value: '567', icon: AlertTriangle, color: 'text-yellow-600' },
  { label: 'Success', value: '44,877', icon: CheckCircle, color: 'text-green-600' },
];

export function SuperAdminLogs() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'critical':
      case 'error':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredLogs = logsData.filter((log) => {
    if (selectedLevel !== 'all' && log.level !== selectedLevel) return false;
    if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activityStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2">{stat.value}</h3>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-9" />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-input-background"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-input-background"
            >
              <option value="all">All Categories</option>
              <option value="System">System</option>
              <option value="API">API</option>
              <option value="Auth">Auth</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Order">Order</option>
              <option value="Payment">Payment</option>
              <option value="Campaign">Campaign</option>
              <option value="Subscription">Subscription</option>
            </select>

            <button className="px-4 py-2 bg-secondary rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.map((log) => {
            const Icon = getLevelIcon(log.level);
            return (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${
                  log.level === 'critical'
                    ? 'border-red-300 bg-red-50'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    log.level === 'critical' || log.level === 'error'
                      ? 'text-red-600'
                      : log.level === 'warning'
                      ? 'text-yellow-600'
                      : 'text-blue-600'
                  }`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm">{log.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{log.timestamp}</span>
                          <span>•</span>
                          <span>{log.business}</span>
                          <span>•</span>
                          <span>{log.user}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="secondary" className="text-xs">
                          {log.category}
                        </Badge>
                        <span className={`px-2 py-1 rounded text-xs ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLogs.length} of {logsData.length} logs
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-secondary rounded text-sm">Previous</button>
            <button className="px-3 py-1.5 bg-secondary rounded text-sm">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
