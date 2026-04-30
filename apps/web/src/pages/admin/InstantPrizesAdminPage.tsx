import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminInstantPrize, ApiResponse } from "@luxero/types";

export function InstantPrizesAdminPage() {
  const [prizes, setPrizes] = useState<AdminInstantPrize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    type: "",
    title: "",
    description: "",
    probability: "",
    stock: "",
    active: true,
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchPrizes() {
      try {
        const res = await api.get<ApiResponse<AdminInstantPrize[]>>("/api/admin/instant-prizes", {
          params: { limit: 100, page: 1 },
        });
        setPrizes(res.data);
      } catch (err) {
        console.error("Failed to fetch instant prizes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPrizes();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this instant prize?")) return;
    try {
      await api.delete(`/api/admin/instant-prizes/${id}`);
      setPrizes((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  function handleEdit(prize: AdminInstantPrize) {
    setEditingId(prize._id);
    setForm({
      type: prize.type,
      title: prize.title,
      description: prize.description || "",
      probability: prize.probability.toString(),
      stock: prize.stock.toString(),
      active: prize.active,
    });
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setForm({ type: "", title: "", description: "", probability: "", stock: "", active: true });
    setShowForm(true);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        type: form.type,
        title: form.title,
        description: form.description || undefined,
        probability: parseFloat(form.probability) || 0,
        stock: parseInt(form.stock, 10) || 0,
        active: form.active,
      };

      if (editingId) {
        const res = await api.put<ApiResponse<AdminInstantPrize>>(
          `/api/admin/instant-prizes/${editingId}`,
          payload
        );
        setPrizes((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      } else {
        const res = await api.post<ApiResponse<AdminInstantPrize>>(
          "/api/admin/instant-prizes",
          payload
        );
        setPrizes((prev) => [res.data, ...prev]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save instant prize");
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = prizes.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Instant Prizes</h1>
            <p className="text-muted-foreground mt-1">Manage bonus instant win prizes</p>
          </div>
          <Button onClick={handleNew} className="btn-luxury">
            <Plus className="w-4 h-4 mr-2" />
            New Instant Prize
          </Button>
        </div>

        {showForm && (
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type *</label>
                    <Input
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                      placeholder="e.g. discount, free-ticket"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title *</label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Probability (0-1) *</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.probability}
                      onChange={(e) => setForm((p) => ({ ...p, probability: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock *</label>
                    <Input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                      required
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
              placeholder="Search instant prizes..."
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
                      <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Title</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Probability</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-32" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-12" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No instant prizes found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Probability</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((prize) => (
                    <tr key={prize._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4 font-mono text-sm">{prize.type}</td>
                      <td className="p-4 font-medium">{prize.title}</td>
                      <td className="p-4 text-sm">{(prize.probability * 100).toFixed(1)}%</td>
                      <td className="p-4 text-sm">{prize.stock}</td>
                      <td className="p-4">
                        <Badge
                          variant={prize.active ? "default" : "outline"}
                          className={
                            prize.active ? "bg-green-500/20 text-green-400 border-green-400/30" : ""
                          }
                        >
                          {prize.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(prize)}
                            className="p-1 hover:bg-gold/10 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prize._id)}
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
