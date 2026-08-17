import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Building2, DollarSign, Users, ShoppingCart, Loader2 } from 'lucide-react';
import {
  fetchBusinessOverviewsApi,
  fetchPlatformStatsApi,
  formatProductPrice,
  type BusinessOverviewDto,
  type PlatformStatsDto,
} from '../../lib/api';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<PlatformStatsDto | null>(null);
  const [businesses, setBusinesses] = useState<BusinessOverviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const [statsData, businessesData] = await Promise.all([
          fetchPlatformStatsApi(),
          fetchBusinessOverviewsApi(),
        ]);
        if (cancelled) return;
        setStats(statsData);
        setBusinesses(businessesData);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load platform stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Businesses', value: stats.totalBusinesses.toLocaleString(), icon: Building2 },
        { label: 'Platform Revenue', value: formatProductPrice(stats.totalRevenue), icon: DollarSign },
        { label: 'Total Customers', value: stats.totalCustomers.toLocaleString(), icon: Users },
        { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: ShoppingCart },
      ]
    : [];

  const recentBusinesses = [...businesses]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading platform overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2">{stat.value}</h3>
                </div>
                <Icon className="w-8 h-8 text-primary" />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-6">
        <h3 className="mb-4">Businesses</h3>
        {businesses.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No businesses have signed up yet.</p>
        ) : (
          <div className="space-y-3">
            {recentBusinesses.map((business) => (
              <div key={business.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
                    {business.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p>{business.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(business.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p>{formatProductPrice(business.revenue)}</p>
                  <p className="text-sm text-muted-foreground">
                    {business.orderCount} orders · {business.customerCount} customers
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
