import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminOrder, ApiResponse } from "@luxero/types";

export function OrdersAdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const params: Record<string, string | number> = { limit: 100, page: 1 };
        if (statusFilter) params.status = statusFilter;

        const res = await api.get<ApiResponse<AdminOrder[]>>("/api/admin/orders", { params });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [statusFilter]);

  async function handleUpdateStatus(id: string, status: string) {
    try {
      await api.patch(`/api/admin/orders/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage all orders</p>
        </div>

        <div className="flex gap-4">
          <select
            className="px-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <Card className="border-gold/20">
          {isLoading ? (
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10 text-left">
                      <th className="p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-40" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-12" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : orders.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Items</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4 font-mono text-sm">{order._id.slice(-8)}</td>
                      <td className="p-4 text-sm">{order.userEmail || "—"}</td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className="text-xs px-2 py-1 rounded border border-gold/20 bg-card"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                      <td className="p-4 font-bold text-gold">£{order.total.toFixed(2)}</td>
                      <td className="p-4 text-sm">{order.items?.length || 0}</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
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
