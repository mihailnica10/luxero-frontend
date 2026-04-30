import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminReferralPurchase, ApiResponse } from "@luxero/types";

export function ReferralsAdminPage() {
  const [referrals, setReferrals] = useState<AdminReferralPurchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const res = await api.get<ApiResponse<AdminReferralPurchase[]>>(
          "/api/admin/referral-purchases",
          { params: { limit: 100, page: 1 } }
        );
        setReferrals(res.data);
      } catch (err) {
        console.error("Failed to fetch referrals:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReferrals();
  }, []);

  const filtered = referrals.filter(
    (r) =>
      r.referrerEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.referredEmail.toLowerCase().includes(search.toLowerCase())
  );

  const totalCommission = referrals.reduce((sum, r) => sum + r.commission, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
          <p className="text-muted-foreground mt-1">Manage referral program</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-gold/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Referrals</p>
              <p className="text-2xl font-bold">{referrals.length}</p>
            </CardContent>
          </Card>
          <Card className="border-gold/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Commission Paid</p>
              <p className="text-2xl font-bold text-gold">£{totalCommission.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="border-gold/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active Referrers</p>
              <p className="text-2xl font-bold">
                {new Set(referrals.map((r) => r.referrerId)).size}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            />
          </div>
        </div>

        <Card className="border-gold/20">
          {isLoading ? (
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10 text-left">
                      <th className="p-4 text-sm font-medium text-muted-foreground">Referrer</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Referred User</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Commission</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-40" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-40" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No referrals found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Referrer</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Referred User</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Commission</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ref) => (
                    <tr key={ref._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4">
                        <div className="text-sm">{ref.referrerEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{ref.referredEmail}</div>
                      </td>
                      <td className="p-4 font-mono text-sm">{ref.orderId.slice(-8)}</td>
                      <td className="p-4 font-bold text-green-400">£{ref.commission.toFixed(2)}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
