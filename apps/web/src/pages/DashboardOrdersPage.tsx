import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { Button, ProtectedRoute, Skeleton } from "@luxero/ui";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface OrderItem {
  _id: string;
  orderNumber: number;
  status: string;
  total: number;
  items?: Array<{ competitionTitle?: string; quantity: number }>;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  },
  paid: {
    label: "Paid",
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-400",
    badge: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  refunded: {
    label: "Refunded",
    dot: "bg-blue-400",
    badge: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    dot: "bg-muted-foreground",
    badge: "text-muted-foreground bg-muted/10 border-muted/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get<ApiResponse<OrderItem[]>>(`/api/me/orders?page=${page}&limit=10`);
        setOrders(res.data || []);
        if (res.meta) {
          setTotalPages(res.meta.pages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [page]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground mt-1">Your purchase history</p>
          </div>
          <Link to="/dashboard" className="text-sm text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[1.5rem]" shimmer />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem]">
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
              <div className="rounded-[calc(2rem-0.375rem)] bg-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-gold/60" />
                </div>
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Link to="/competitions">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                    Browse Competitions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {orders.map((order) => {
                const itemCount = order.items?.length || 0;
                const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                return (
                  <div
                    key={order._id}
                    className="group p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:bg-gold/5 hover:ring-gold/30 transition-all duration-500"
                  >
                    <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-gold" />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold">#{order.orderNumber}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              {itemCount > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  · {totalItems} item{totalItems !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <StatusBadge status={order.status} />
                          <span className="font-bold text-gold text-lg">
                            £{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="border-gold/30 hover:bg-gold/10"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="border-gold/30 hover:bg-gold/10"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function DashboardOrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
