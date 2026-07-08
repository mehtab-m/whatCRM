import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Package, Truck, CheckCircle, Circle, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useData } from '../../context/DataContext';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Circle },
  confirmed: { label: 'Confirmed', color: 'bg-yellow-100 text-yellow-700', icon: Package },
  dispatched: { label: 'Dispatched', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

interface AdminOrdersProps {
  onNavigateToChat?: () => void;
}

export function AdminOrders({ onNavigateToChat }: AdminOrdersProps) {
  const { orders, updateOrderStatus, addOrder } = useData();
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderProduct, setNewOrderProduct] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState('');
  const [newOrderPhone, setNewOrderPhone] = useState('');

  const groupedOrders = {
    new: orders.filter(o => o.status === 'new'),
    confirmed: orders.filter(o => o.status === 'confirmed'),
    dispatched: orders.filter(o => o.status === 'dispatched'),
    delivered: orders.filter(o => o.status === 'delivered'),
  };

  const handleStatusChange = (orderId: string, newStatus: 'new' | 'confirmed' | 'dispatched' | 'delivered') => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    alert(`Order ${orderId} status updated to ${newStatus}!`);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderData = {
      customer: newOrderCustomer,
      product: newOrderProduct,
      amount: newOrderAmount,
      status: 'new' as const,
      date: new Date().toISOString().split('T')[0],
      phone: newOrderPhone,
      email: `${newOrderCustomer.toLowerCase().replace(/ /g, '.')}@example.com`,
      address: 'To be collected',
      city: 'To be collected'
    };
    addOrder(orderData);
    setShowCreateOrder(false);
    setNewOrderCustomer('');
    setNewOrderProduct('');
    setNewOrderAmount('');
    setNewOrderPhone('');
    alert('Order created successfully!');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setView('kanban')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
              view === 'kanban' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            Kanban View
          </button>
          <button
            onClick={() => setView('list')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg text-sm md:text-base ${
              view === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            List View
          </button>
        </div>

        <button
          onClick={() => setShowCreateOrder(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base"
        >
          + Create Order
        </button>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(groupedOrders).map(([status, orders]) => {
            const config = statusConfig[status as keyof typeof statusConfig];
            const Icon = config.icon;

            return (
              <div key={status} className="space-y-3">
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <h3 className="text-sm">{config.label}</h3>
                    </div>
                    <Badge variant="secondary">{orders.length}</Badge>
                  </div>
                </Card>

                <div className="space-y-3">
                  {orders.map((order) => (
                    <Card
                      key={order.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{order.id}</p>
                          <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-sm">{order.customer}</p>
                        <p className="text-sm">{order.product}</p>
                        <p>{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-3 md:p-6">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Order ID</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Customer</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Product</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Amount</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Status</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const config = statusConfig[order.status as keyof typeof statusConfig];
                  return (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-accent cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3 px-2 md:px-4 text-sm">{order.id}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.product}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.amount}</td>
                      <td className="py-3 px-2 md:px-4">
                        <span className={`px-2 py-1 rounded text-xs ${config.color}`}>
                          {config.label}
                        </span>
                      </td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-full sm:max-w-md md:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Order Details: {selectedOrder.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Customer Name</Label>
                  <p className="mt-1 text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-sm">Phone Number</Label>
                  <p className="mt-1 text-sm">{selectedOrder.phone}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <p className="mt-1 text-sm">{selectedOrder.email}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Delivery Address</Label>
                  <p className="mt-1 text-sm">{selectedOrder.address}</p>
                </div>
                <div>
                  <Label className="text-sm">City</Label>
                  <p className="mt-1 text-sm">{selectedOrder.city}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Product</Label>
                    <p className="mt-1 text-sm">{selectedOrder.product}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Amount</Label>
                    <p className="mt-1 text-sm">{selectedOrder.amount}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm">Order Date</Label>
                  <p className="mt-1 text-sm">{selectedOrder.date}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <Label className="text-sm">Update Order Status</Label>
                <div className="mt-2 grid grid-cols-2 sm:flex gap-2">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(selectedOrder.id, key as any)}
                      className={`px-2 md:px-3 py-2 rounded text-xs md:text-sm hover:opacity-90 transition-opacity ${
                        selectedOrder.status === key ? config.color : 'bg-secondary'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base">
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    if (onNavigateToChat) {
                      onNavigateToChat();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-secondary rounded-lg hover:bg-accent flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open Chat
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showCreateOrder && (
        <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
          <DialogContent className="max-w-full sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Create New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <Label className="text-sm">Customer Name</Label>
                <Input
                  placeholder="Enter customer name"
                  value={newOrderCustomer}
                  onChange={(e) => setNewOrderCustomer(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-sm">Product</Label>
                <Input
                  placeholder="Select or enter product"
                  value={newOrderProduct}
                  onChange={(e) => setNewOrderProduct(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-sm">Amount</Label>
                <Input
                  placeholder="PKR 10,000"
                  value={newOrderAmount}
                  onChange={(e) => setNewOrderAmount(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-sm">Phone Number</Label>
                <Input
                  placeholder="+92 XXX XXXXXXX"
                  value={newOrderPhone}
                  onChange={(e) => setNewOrderPhone(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base"
              >
                Create Order
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
