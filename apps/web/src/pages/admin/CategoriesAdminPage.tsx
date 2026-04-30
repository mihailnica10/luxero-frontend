import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminCategory, ApiResponse } from "@luxero/types";

export function CategoriesAdminPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get<ApiResponse<AdminCategory[]>>("/api/admin/categories", {
          params: { limit: 100, page: 1 },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/api/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  function handleEdit(cat: AdminCategory) {
    setEditingId(cat._id);
    setForm({ name: cat.name, slug: cat.slug });
    setShowForm(true);
  }

  function handleNew() {
    setEditingId(null);
    setForm({ name: "", slug: "" });
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      };

      if (editingId) {
        const res = await api.put<ApiResponse<AdminCategory>>(
          `/api/admin/categories/${editingId}`,
          payload
        );
        setCategories((prev) => prev.map((c) => (c._id === editingId ? res.data : c)));
      } else {
        const res = await api.post<ApiResponse<AdminCategory>>("/api/admin/categories", payload);
        setCategories((prev) => [...prev, res.data]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  }

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground mt-1">Manage competition categories</p>
          </div>
          <Button onClick={handleNew} className="btn-luxury">
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </Button>
        </div>

        {showForm && (
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-400 text-sm">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                      placeholder="auto-generated from name"
                    />
                  </div>
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
              placeholder="Search categories..."
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
                      <th className="p-4 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Slug</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Competitions</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-32" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
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
              <p className="text-muted-foreground">No categories found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Slug</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Competitions</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr key={cat._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4 font-medium">{cat.name}</td>
                      <td className="p-4 font-mono text-sm text-muted-foreground">{cat.slug}</td>
                      <td className="p-4 text-sm">{cat.competitionCount}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(cat)}
                            className="p-1 hover:bg-gold/10 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
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
