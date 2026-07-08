import { useMemo, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Search, Phone, Mail, MapPin, ShoppingBag, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { useData, type Customer } from '../../context/DataContext';
import type { CustomerTier } from '../../lib/api';

// Backend stores 'vip'; the UI shows it as "Premium".
function tierLabel(tier: CustomerTier): string {
  if (tier === 'vip') return 'Premium';
  if (tier === 'regular') return 'Regular';
  return 'New';
}

type TierFilter = 'all' | CustomerTier;

const FILTERS: { key: TierFilter; label: string }[] = [
  { key: 'all', label: 'All Customers' },
  { key: 'vip', label: 'Premium' },
  { key: 'regular', label: 'Regular' },
  { key: 'new', label: 'New' },
];

interface AdminCustomersProps {
  onNavigateToChat?: (customerId?: string) => void;
  onNavigateToOrders?: () => void;
}

export function AdminCustomers({ onNavigateToChat, onNavigateToOrders }: AdminCustomersProps) {
  const { customers, customersLoading, customersError, addCustomer, orders } = useData();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TierFilter>('all');
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [tier, setTier] = useState<CustomerTier>('new');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesFilter = filter === 'all' || c.tier === filter;
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [customers, filter, search]);

  const recentOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return orders.filter((o) => o.customerId === selectedCustomer.id).slice(0, 5);
  }, [orders, selectedCustomer]);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setTier('new');
    setFormError(null);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setFormError('Name and phone are required');
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      await addCustomer({
        name: name.trim(),
        phoneNumber: phone.trim(),
        email: email.trim() || undefined,
        city: city.trim() || undefined,
        tier,
      });
      setShowAddCustomer(false);
      resetForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to add customer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9 text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 md:px-4 py-2 rounded-lg text-sm md:text-base whitespace-nowrap transition-colors ${
                filter === f.key ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddCustomer(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 text-sm md:text-base whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {customersError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{customersError}</div>
      )}

      {customersLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading customers...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground text-sm">No customers found</Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-start gap-3 md:gap-4">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                  <AvatarFallback className="text-sm md:text-base">
                    {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2 md:space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg truncate">{customer.name}</h3>
                      <Badge variant={customer.tier === 'vip' ? 'default' : 'secondary'} className="mt-1 text-xs">
                        {tierLabel(customer.tier)}
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
                      <span className="truncate">{customer.email || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span>{customer.city || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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
                    {selectedCustomer.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl truncate">{selectedCustomer.name}</h3>
                  <Badge variant={selectedCustomer.tier === 'vip' ? 'default' : 'secondary'} className="mt-2 text-xs">
                    {tierLabel(selectedCustomer.tier)}
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
                  <span className="text-sm md:text-base truncate">{selectedCustomer.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm md:text-base">{selectedCustomer.city || '—'}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-2 md:mb-3 text-sm md:text-base">Recent Orders</h4>
                <div className="space-y-2">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 md:p-3 bg-muted rounded-lg">
                        <div className="min-w-0">
                          <p className="text-sm md:text-base">{order.ref} · {order.product}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <p className="text-sm md:text-base whitespace-nowrap ml-2">{order.amount}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    const customerId = selectedCustomer.id;
                    setSelectedCustomer(null);
                    onNavigateToChat?.(customerId);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm md:text-base"
                >
                  Send Message
                </button>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    onNavigateToOrders?.();
                  }}
                  className="flex-1 px-4 py-2 bg-secondary rounded-lg text-sm md:text-base hover:bg-accent"
                >
                  Create Order
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showAddCustomer && (
        <Dialog open={showAddCustomer} onOpenChange={(open) => { if (!open) setShowAddCustomer(false); }}>
          <DialogContent className="max-w-full sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base md:text-lg">Add New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <Label className="text-sm">Full Name</Label>
                <Input
                  placeholder="Customer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-sm">Phone Number</Label>
                <Input
                  placeholder="+92 XXX XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-sm">Email (optional)</Label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">City (optional)</Label>
                  <Input
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Tier</Label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value as CustomerTier)}
                    className="w-full mt-1 p-2 border rounded-lg bg-input-background text-sm"
                  >
                    <option value="new">New</option>
                    <option value="regular">Regular</option>
                    <option value="vip">Premium</option>
                  </select>
                </div>
              </div>

              {formError && <p className="text-sm text-destructive">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Customer
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
