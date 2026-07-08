import { useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { differenceInCalendarDays } from 'date-fns';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Package, Truck, CheckCircle, Circle, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useData, type Order } from '../../context/DataContext';
import type { OrderStatus } from '../../lib/api';

const ITEM_TYPE = 'ORDER_CARD';

const statusConfig: Record<
  OrderStatus,
  { label: string; icon: typeof Circle; pill: string; header: string; accent: string; dot: string }
> = {
  new: {
    label: 'New',
    icon: Circle,
    pill: 'bg-blue-100 text-blue-700',
    header: 'from-blue-500/15 to-blue-500/5 border-blue-300',
    accent: 'border-l-blue-400',
    dot: 'bg-blue-500',
  },
  confirmed: {
    label: 'Confirmed',
    icon: Package,
    pill: 'bg-amber-100 text-amber-700',
    header: 'from-amber-500/15 to-amber-500/5 border-amber-300',
    accent: 'border-l-amber-400',
    dot: 'bg-amber-500',
  },
  dispatched: {
    label: 'Dispatched',
    icon: Truck,
    pill: 'bg-purple-100 text-purple-700',
    header: 'from-purple-500/15 to-purple-500/5 border-purple-300',
    accent: 'border-l-purple-400',
    dot: 'bg-purple-500',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    pill: 'bg-green-100 text-green-700',
    header: 'from-green-500/15 to-green-500/5 border-green-300',
    accent: 'border-l-green-400',
    dot: 'bg-green-500',
  },
};

const STATUS_ORDER: OrderStatus[] = ['new', 'confirmed', 'dispatched', 'delivered'];

function daysSince(iso: string): number {
  return differenceInCalendarDays(new Date(), new Date(iso));
}

function ageLabel(days: number): string {
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

interface AdminOrdersProps {
  onNavigateToChat?: (customerId?: string) => void;
}

function OrderCard({ order, onOpen }: { order: Order; onOpen: (o: Order) => void }) {
  const config = statusConfig[order.status];
  const days = daysSince(order.createdAt);
  const isAging = days > 3 && order.status !== 'delivered';

  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { id: order.id, status: order.status },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [order.id, order.status],
  );

  return (
    <div
      ref={dragRef as unknown as React.Ref<HTMLDivElement>}
      onClick={() => onOpen(order)}
      className={`rounded-xl border border-l-4 p-4 cursor-pointer hover:shadow-md transition-all ${config.accent} ${
        isAging ? 'bg-red-200 border-red-400' : 'bg-card'
      } ${isDragging ? 'opacity-40' : 'opacity-100'}`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium">{order.ref}</p>
          <span className={`px-2 py-1 rounded text-xs ${config.pill}`}>{config.label}</span>
        </div>
        <p className="text-muted-foreground text-sm truncate">{order.customer}</p>
        <p className="text-sm truncate">{order.product}</p>
        <p className="font-medium">{order.amount}</p>
        {order.city && <p className="text-xs text-muted-foreground truncate">📍 {order.city}</p>}
        <div className="flex items-center justify-between pt-1">
          <span className={`text-xs flex items-center gap-1 ${isAging ? 'text-red-700 font-medium' : 'text-muted-foreground'}`}>
            {isAging && <AlertTriangle className="w-3 h-3" />}
            {ageLabel(days)}
          </span>
          <span className="text-xs text-muted-foreground">{order.date}</span>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({
  status,
  orders,
  onOpen,
  onDropOrder,
}: {
  status: OrderStatus;
  orders: Order[];
  onOpen: (o: Order) => void;
  onDropOrder: (orderId: string, status: OrderStatus) => void;
}) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item: { id: string; status: OrderStatus }) => {
        if (item.status !== status) onDropOrder(item.id, status);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [status, onDropOrder],
  );

  return (
    <div ref={dropRef as unknown as React.Ref<HTMLDivElement>} className="space-y-3">
      <div className={`rounded-xl border bg-gradient-to-br ${config.header} p-3 shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
            <Icon className="w-4 h-4" />
            <h3 className="text-sm font-medium">{config.label}</h3>
          </div>
          <Badge variant="secondary" className="bg-white/60">{orders.length}</Badge>
        </div>
      </div>

      <div className={`space-y-3 min-h-[120px] rounded-xl transition-colors ${isOver ? 'bg-accent/60 ring-2 ring-primary/30' : ''}`}>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onOpen={onOpen} />
        ))}
        {orders.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-6 border border-dashed rounded-xl">
            Drop orders here
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminOrders({ onNavigateToChat }: AdminOrdersProps) {
  const { orders, ordersLoading, ordersError, updateOrderStatus, addOrder, customers, products } = useData();
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  // Create-order form
  const [customerQuery, setCustomerQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('1');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const blurTimeout = useRef<number | null>(null);

  const groupedOrders = useMemo(
    () =>
      STATUS_ORDER.reduce(
        (acc, status) => {
          acc[status] = orders.filter((o) => o.status === status);
          return acc;
        },
        {} as Record<OrderStatus, Order[]>,
      ),
    [orders],
  );

  const customerMatches = useMemo(() => {
    const q = customerQuery.trim().toLowerCase();
    if (!q) return customers.slice(0, 8);
    return customers
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q))
      .slice(0, 8);
  }, [customers, customerQuery]);

  const handleDropOrder = (orderId: string, status: OrderStatus) => {
    void updateOrderStatus(orderId, status).catch((err) =>
      alert(err instanceof Error ? err.message : 'Failed to update status'),
    );
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    void updateOrderStatus(orderId, newStatus).catch((err) =>
      alert(err instanceof Error ? err.message : 'Failed to update status'),
    );
    setSelectedOrder((prev) => (prev && prev.id === orderId ? { ...prev, status: newStatus } : prev));
  };

  const resetCreateForm = () => {
    setCustomerQuery('');
    setSelectedCustomerId(null);
    setProductId('');
    setQty('1');
    setAddress('');
    setCity('');
    setCreateError(null);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!selectedCustomerId) {
      setCreateError('Please pick a customer from the list.');
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setCreateError('Please select a product.');
      return;
    }
    const quantity = Math.max(1, Number(qty) || 1);

    setCreating(true);
    try {
      await addOrder({
        customerId: selectedCustomerId,
        items: [
          { productId: product.id, productName: product.name, qty: quantity, price: product.priceValue },
        ],
        deliveryAddress: address.trim() || undefined,
        city: city.trim() || undefined,
        status: 'new',
      });
      setShowCreateOrder(false);
      resetCreateForm();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setCreating(false);
    }
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
          onClick={() => {
            resetCreateForm();
            setShowCreateOrder(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base"
        >
          + Create Order
        </button>
      </div>

      {ordersError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{ordersError}</div>
      )}

      {ordersLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading orders...
        </div>
      ) : view === 'kanban' ? (
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                orders={groupedOrders[status]}
                onOpen={setSelectedOrder}
                onDropOrder={handleDropOrder}
              />
            ))}
          </div>
        </DndProvider>
      ) : (
        <Card className="p-3 md:p-6">
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Order</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Customer</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Product</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Amount</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Status</th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm">Received</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const config = statusConfig[order.status];
                  const days = daysSince(order.createdAt);
                  const isAging = days > 3 && order.status !== 'delivered';
                  return (
                    <tr
                      key={order.id}
                      className={`border-b hover:bg-accent cursor-pointer ${isAging ? 'bg-red-200' : ''}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3 px-2 md:px-4 text-sm font-medium">{order.ref}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.product}</td>
                      <td className="py-3 px-2 md:px-4 text-sm">{order.amount}</td>
                      <td className="py-3 px-2 md:px-4">
                        <span className={`px-2 py-1 rounded text-xs ${config.pill}`}>{config.label}</span>
                      </td>
                      <td className={`py-3 px-2 md:px-4 text-sm ${isAging ? 'text-red-700 font-medium' : ''}`}>
                        {ageLabel(days)}
                      </td>
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
              <DialogTitle className="text-base md:text-lg">Order Details: {selectedOrder.ref}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Customer Name</Label>
                  <p className="mt-1 text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-sm">Phone Number</Label>
                  <p className="mt-1 text-sm">{selectedOrder.phone || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Delivery Address</Label>
                  <p className="mt-1 text-sm">{selectedOrder.address || '—'}</p>
                </div>
                <div>
                  <Label className="text-sm">City</Label>
                  <p className="mt-1 text-sm">{selectedOrder.city || '—'}</p>
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
                  <Label className="text-sm">Order Received</Label>
                  <p className="mt-1 text-sm">
                    {selectedOrder.date} · {ageLabel(daysSince(selectedOrder.createdAt))}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <Label className="text-sm">Update Order Status</Label>
                <div className="mt-2 grid grid-cols-2 sm:flex gap-2">
                  {STATUS_ORDER.map((key) => {
                    const config = statusConfig[key];
                    return (
                      <button
                        key={key}
                        onClick={() => handleStatusChange(selectedOrder.id, key)}
                        className={`px-2 md:px-3 py-2 rounded text-xs md:text-sm hover:opacity-90 transition-opacity ${
                          selectedOrder.status === key ? config.pill : 'bg-secondary'
                        }`}
                      >
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <button
                  onClick={() => {
                    const customerId = selectedOrder.customerId;
                    setSelectedOrder(null);
                    onNavigateToChat?.(customerId);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open Chat with {selectedOrder.customer}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showCreateOrder && (
        <Dialog open={showCreateOrder} onOpenChange={(open) => { if (!open) setShowCreateOrder(false); }}>
          <DialogContent className="max-w-full sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Create New Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="relative">
                <Label className="text-sm">Customer Name</Label>
                <Input
                  placeholder="Start typing a customer name..."
                  value={customerQuery}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    setSelectedCustomerId(null);
                    setShowCustomerList(true);
                  }}
                  onFocus={() => setShowCustomerList(true)}
                  onBlur={() => {
                    blurTimeout.current = window.setTimeout(() => setShowCustomerList(false), 150);
                  }}
                  className="mt-1 text-sm"
                  autoComplete="off"
                  required
                />
                {showCustomerList && customerMatches.length > 0 && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {customerMatches.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          if (blurTimeout.current) window.clearTimeout(blurTimeout.current);
                          setSelectedCustomerId(c.id);
                          setCustomerQuery(c.name);
                          setCity((prev) => prev || c.city);
                          setShowCustomerList(false);
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center justify-between ${
                          selectedCustomerId === c.id ? 'bg-accent' : ''
                        }`}
                      >
                        <span className="truncate">{c.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedCustomerId && (
                  <p className="text-xs text-green-600 mt-1">✓ Existing customer selected</p>
                )}
              </div>

              <div>
                <Label className="text-sm">Product</Label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm"
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm">Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label className="text-sm">Delivery Address</Label>
                <Input
                  placeholder="House, street, area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              <div>
                <Label className="text-sm">City</Label>
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>

              {createError && <p className="text-sm text-destructive">{createError}</p>}

              <button
                type="submit"
                disabled={creating}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Order
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
