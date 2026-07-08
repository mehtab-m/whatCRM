import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Eye, Ban, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const businessesData = [
  { id: 1, name: 'Tech Store Mumbai', owner: 'Rajesh Kumar', email: 'rajesh@techstore.com', plan: 'Pro', revenue: 'PKR 45,000', users: 1234, orders: 567, status: 'active', joined: '2026-01-15' },
  { id: 2, name: 'Fashion Boutique', owner: 'Priya Sharma', email: 'priya@fashion.com', plan: 'Starter', revenue: 'PKR 12,000', users: 456, orders: 234, status: 'active', joined: '2026-02-20' },
  { id: 3, name: 'Electronics Hub', owner: 'Amit Patel', email: 'amit@electronics.com', plan: 'Enterprise', revenue: 'PKR 98,000', users: 3456, orders: 1234, status: 'active', joined: '2026-01-05' },
  { id: 4, name: 'Home Decor Store', owner: 'Neha Gupta', email: 'neha@homedecor.com', plan: 'Pro', revenue: 'PKR 32,000', users: 890, orders: 456, status: 'active', joined: '2026-03-10' },
  { id: 5, name: 'Book Paradise', owner: 'Vikram Singh', email: 'vikram@books.com', plan: 'Free', revenue: 'PKR 0', users: 120, orders: 45, status: 'trial', joined: '2026-04-20' },
];

export function SuperAdminBusinesses() {
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-700';
      case 'Pro':
        return 'bg-blue-100 text-blue-700';
      case 'Starter':
        return 'bg-green-100 text-green-700';
      case 'Free':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'trial':
        return 'bg-yellow-100 text-yellow-700';
      case 'suspended':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search businesses..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">All</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Enterprise</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Pro</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Starter</button>
          <button className="px-4 py-2 bg-secondary rounded-lg">Free</button>
        </div>
      </div>

      <Card className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-3 px-4">Business</th>
                <th className="text-left py-3 px-4">Owner</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Revenue</th>
                <th className="text-left py-3 px-4">Users</th>
                <th className="text-left py-3 px-4">Orders</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {businessesData.map((business) => (
                <tr key={business.id} className="border-b hover:bg-accent">
                  <td className="py-3 px-4">
                    <div>
                      <p>{business.name}</p>
                      <p className="text-sm text-muted-foreground">{business.joined}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p>{business.owner}</p>
                      <p className="text-sm text-muted-foreground">{business.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getPlanColor(business.plan)}`}>
                      {business.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">{business.revenue}</td>
                  <td className="py-3 px-4">{business.users.toLocaleString()}</td>
                  <td className="py-3 px-4">{business.orders.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(business.status)}`}>
                      {business.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedBusiness(business)}
                      className="p-2 hover:bg-accent rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedBusiness && (
        <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedBusiness.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl mt-1">{selectedBusiness.revenue}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Users</p>
                  <p className="text-2xl mt-1">{selectedBusiness.users.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl mt-1">{selectedBusiness.orders.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <Badge className={`mt-1 ${getPlanColor(selectedBusiness.plan)}`}>
                    {selectedBusiness.plan}
                  </Badge>
                </Card>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Business Owner</p>
                  <p>{selectedBusiness.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{selectedBusiness.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined Date</p>
                  <p>{selectedBusiness.joined}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={getStatusColor(selectedBusiness.status)}>
                    {selectedBusiness.status}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approve Upgrade
                </button>
                <button className="flex-1 px-4 py-2 bg-secondary rounded-lg">
                  View Logs
                </button>
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  Suspend
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
