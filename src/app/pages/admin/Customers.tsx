import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Search, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

const customersData = [
  { id: 1, name: 'Rahul Kumar', phone: '+91 98765 43210', email: 'rahul@example.com', city: 'Mumbai', orders: 12, totalSpent: 'PKR 2,45,000', tag: 'VIP' },
  { id: 2, name: 'Priya Sharma', phone: '+91 98765 43211', email: 'priya@example.com', city: 'Delhi', orders: 8, totalSpent: 'PKR 1,20,000', tag: 'Regular' },
  { id: 3, name: 'Amit Patel', phone: '+91 98765 43212', email: 'amit@example.com', city: 'Bangalore', orders: 15, totalSpent: 'PKR 3,80,000', tag: 'VIP' },
  { id: 4, name: 'Neha Gupta', phone: '+91 98765 43213', email: 'neha@example.com', city: 'Pune', orders: 5, totalSpent: 'PKR 65,000', tag: 'Regular' },
  { id: 5, name: 'Vikram Singh', phone: '+91 98765 43214', email: 'vikram@example.com', city: 'Hyderabad', orders: 3, totalSpent: 'PKR 45,000', tag: 'New' },
];

export function AdminCustomers() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search customers..." className="pl-9 text-sm md:text-base" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className="px-3 md:px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base whitespace-nowrap">
            All Customers
          </button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-sm md:text-base whitespace-nowrap">VIP</button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-sm md:text-base whitespace-nowrap">Regular</button>
          <button className="px-3 md:px-4 py-2 bg-secondary rounded-lg text-sm md:text-base whitespace-nowrap">New</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {customersData.map((customer) => (
          <Card
            key={customer.id}
            className="p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex items-start gap-3 md:gap-4">
              <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                <AvatarFallback className="text-sm md:text-base">
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg truncate">{customer.name}</h3>
                    <Badge
                      variant={customer.tag === 'VIP' ? 'default' : 'secondary'}
                      className="mt-1 text-xs"
                    >
                      {customer.tag}
                    </Badge>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-xs md:text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-sm md:text-base">{customer.totalSpent}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{customer.orders} orders</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span>{customer.city}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="max-w-full sm:max-w-md md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Customer Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <Avatar className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                  <AvatarFallback className="text-sm md:text-base">
                    {selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl truncate">{selectedCustomer.name}</h3>
                  <Badge variant={selectedCustomer.tag === 'VIP' ? 'default' : 'secondary'} className="mt-2 text-xs">
                    {selectedCustomer.tag}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-xl md:text-2xl mt-1">{selectedCustomer.orders}</p>
                </Card>
                <Card className="p-3 md:p-4">
                  <p className="text-xs md:text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl md:text-2xl mt-1">{selectedCustomer.totalSpent}</p>
                </Card>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-center gap-2 md:gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm md:text-base">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm md:text-base truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm md:text-base">{selectedCustomer.city}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 md:mb-3 text-sm md:text-base">Recent Orders</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm md:text-base">Order #{1000 + i}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">2026-04-{25 - i}</p>
                      </div>
                      <p className="text-sm md:text-base">PKR {(Math.random() * 50000 + 10000).toFixed(0)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base">
                  Send Message
                </button>
                <button className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm md:text-base">
                  Create Order
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
