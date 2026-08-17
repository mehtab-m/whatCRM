import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Search, Loader2, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { fetchBusinessOverviewsApi, formatProductPrice, type BusinessOverviewDto } from '../../lib/api';

export function SuperAdminBusinesses() {
  const [businesses, setBusinesses] = useState<BusinessOverviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOverviewDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await fetchBusinessOverviewsApi();
        if (!cancelled) setBusinesses(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load businesses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = businesses.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search businesses..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading businesses...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg mb-2">No businesses found</h3>
        </Card>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4">Business</th>
                  <th className="text-left py-3 px-4">Team Size</th>
                  <th className="text-left py-3 px-4">Customers</th>
                  <th className="text-left py-3 px-4">Orders</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((business) => (
                  <tr
                    key={business.id}
                    className="border-b hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedBusiness(business)}
                  >
                    <td className="py-3 px-4">{business.name}</td>
                    <td className="py-3 px-4">{business.userCount.toLocaleString()}</td>
                    <td className="py-3 px-4">{business.customerCount.toLocaleString()}</td>
                    <td className="py-3 px-4">{business.orderCount.toLocaleString()}</td>
                    <td className="py-3 px-4">{formatProductPrice(business.revenue)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(business.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedBusiness && (
        <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedBusiness.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl mt-1">{formatProductPrice(selectedBusiness.revenue)}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-2xl mt-1">{selectedBusiness.userCount.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl mt-1">{selectedBusiness.customerCount.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl mt-1">{selectedBusiness.orderCount.toLocaleString()}</p>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground">
              Joined {new Date(selectedBusiness.createdAt).toLocaleDateString()}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
