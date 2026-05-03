import { api } from "@luxero/api-client";
import type { AdminPromoCode, ApiResponse } from "@luxero/types";
import { Badge, Button, Card, CardContent, Input, Skeleton } from "@luxero/ui";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";

export function PromoCodesAdminPage() {
  const [promoCodes, setPromoCodes] = useState<AdminPromoCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minimumOrder: "",
    usageLimit: "",
    expiresAt: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPromoCodes() {
      try {
        const res = await api.get<ApiResponse<AdminPromoCode[]>>("/api/admin/promo-codes", {
          params: { limit: 100, page: 1 },
        });
        setPromoCodes(res.data);
      } catch (err) {
        console.error("Failed to fetch promo codes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPromoCodes();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this promo code?")) return;
    try {
      await api.delete(`/api/admin/promo-codes/${id}`);
      setPromoCodes((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  function handleEdit(promo: AdminPromoCode) {
    setEditingId(promo._id);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue.toString(),
      minimumOrder: promo.minimumOrder.toString(),
      usageLimit: promo.usageLimit?.toString() || "",
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().slice(0, 16) : "",
      active: promo.active,
    });
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrder: "",
      usageLimit: "",
      expiresAt: "",
      active: true,
    });
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        code: form.code,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue) || 0,
        minimumOrder: parseFloat(form.minimumOrder) || 0,
        usageLimit: form.usageLimit ? parseInt(form.usageLimit, 10) : undefined,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : undefined,
        active: form.active,
      };

      if (editingId) {
        const res = await api.put<ApiResponse<AdminPromoCode>>(
          `/api/admin/promo-codes/${editingId}`,
          payload
        );
        setPromoCodes((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      } else {
        const res = await api.post<ApiResponse<AdminPromoCode>>("/api/admin/promo-codes", payload);
        setPromoCodes((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save promo code");
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = promoCodes.filter((p) => p.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Promo Codes</h1>
            <p className="text-muted-foreground mt-1">Manage discount codes</p>
          </div>
          <Button onClick={handleNew} className="btn-luxury">
            <Plus className="w-4 h-4 mr-2" />
            New Promo Code
          </Button>
        </div>

        {showForm && (
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code *</label>
                    <Input
                      value={form.code}
                      onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <select
                      value={form.discountType}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          discountType: e.target.value as "percentage" | "fixed",
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-gold/20 bg-card"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Value *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.discountValue}
                      onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Order (£)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.minimumOrder}
                      onChange={(e) => setForm((p) => ({ ...p, minimumOrder: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Usage Limit</label>
                    <Input
                      type="number"
                      value={form.usageLimit}
                      onChange={(e) => setForm((p) => ({ ...p, usageLimit: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expires At</label>
                    <Input
                      type="datetime-local"
                      value={form.expiresAt}
                      onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.active}
                    onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="active" className="text-sm">
                    Active
                  </label>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="btn-luxury" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingId ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search promo codes..."
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
                      <th className="p-4 text-sm font-medium text-muted-foreground">Code</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Value</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Min Order</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Usage</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Expires</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4">
                          <Skeleton className="h-5 w-20" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-20" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-16" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-16" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-12" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-24" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-16" shimmer />
                        </td>
                        <td className="p-4">
                          <Skeleton className="h-5 w-20" shimmer />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No promo codes found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Code</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Min Order</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Usage</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Expires</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((promo) => (
                    <tr key={promo._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4 font-mono font-bold text-gold">{promo.code}</td>
                      <td className="p-4 text-sm">
                        {promo.discountType === "percentage" ? "%" : "£"}
                      </td>
                      <td className="p-4 font-bold">
                        {promo.discountType === "percentage"
                          ? `${promo.discountValue}%`
                          : `£${promo.discountValue.toFixed(2)}`}
                      </td>
                      <td className="p-4 text-sm">
                        {promo.minimumOrder ? `£${promo.minimumOrder.toFixed(2)}` : "—"}
                      </td>
                      <td className="p-4 text-sm">
                        {promo.usageLimit
                          ? `${promo.usedCount}/${promo.usageLimit}`
                          : promo.usedCount}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={promo.active ? "default" : "outline"}
                          className={
                            promo.active ? "bg-green-500/20 text-green-400 border-green-400/30" : ""
                          }
                        >
                          {promo.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(promo)}
                            className="p-1 hover:bg-gold/10 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(promo._id)}
                            className="p-1 hover:bg-red-500/10 rounded text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
