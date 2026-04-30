import { Clock, Edit, Plus, Search, Trash2, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminCompetition, ApiResponse } from "@luxero/types";

export function CompetitionsAdminPage() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<AdminCompetition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const params: Record<string, string | number> = { limit: 100, page: 1 };
        if (statusFilter) params.status = statusFilter;

        const res = await api.get<ApiResponse<AdminCompetition[]>>("/api/admin/competitions", {
          params,
        });
        setCompetitions(res.data);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompetitions();
  }, [statusFilter]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    try {
      await api.delete(`/api/admin/competitions/${id}`);
      setCompetitions((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  }

  const filtered = competitions.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
            <p className="text-muted-foreground mt-1">Manage your prize competitions</p>
          </div>
          <Link to="/admin/competitions/new">
            <Button className="btn-luxury">
              <Plus className="w-4 h-4 mr-2" />
              New Competition
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search competitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            className="px-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="ended">Ended</option>
            <option value="drawn">Drawn</option>
          </select>
        </div>

        {/* Table */}
        <Card className="border-gold/20">
          {isLoading ? (
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10 text-left">
                      <th className="p-4 text-sm font-medium text-muted-foreground">Title</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Price</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Tickets</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Draw Date</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-40" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-28" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No competitions found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Tickets</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Draw Date</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((competition) => (
                    <tr key={competition._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4">
                        <div className="font-medium">{competition.title}</div>
                        <div className="text-sm text-muted-foreground">{competition.slug}</div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={
                            competition.status === "active"
                              ? "text-green-400 border-green-400/30"
                              : competition.status === "draft"
                                ? "text-yellow-400 border-yellow-400/30"
                                : "text-muted-foreground"
                          }
                        >
                          {competition.status}
                        </Badge>
                      </td>
                      <td className="p-4">£{competition.ticketPrice.toFixed(2)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-gold" />
                          {competition.ticketsSold}/{competition.maxTickets}
                        </div>
                      </td>
                      <td className="p-4">
                        {competition.drawDate ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {new Date(competition.drawDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/competitions/${competition._id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(competition._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

export function CompetitionNewAdminPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    status: "draft",
    prizeTitle: "",
    prizeValue: "",
    ticketPrice: "",
    maxTickets: "",
    drawDate: "",
    question: "",
    questionOptions: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...form,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
        prizeValue: parseFloat(form.prizeValue) || 0,
        ticketPrice: parseFloat(form.ticketPrice) || 0,
        maxTickets: parseInt(form.maxTickets, 10) || 0,
        questionOptions: form.questionOptions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        drawDate: form.drawDate ? new Date(form.drawDate) : undefined,
      };

      await api.post<ApiResponse<AdminCompetition>>(
        "/api/admin/competitions",
        payload
      );
      navigate(`/admin/competitions`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create competition");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Competition</h1>
          <p className="text-muted-foreground mt-1">Create a new prize competition</p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <Card className="border-gold/20">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="auto-generated from title"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Short Description</label>
                  <Input
                    name="shortDescription"
                    value={form.shortDescription}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg border border-gold/20 bg-card"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input name="category" value={form.category} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gold/20 bg-card"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prize Title *</label>
                  <Input
                    name="prizeTitle"
                    value={form.prizeTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prize Value (£) *</label>
                  <Input
                    name="prizeValue"
                    type="number"
                    step="0.01"
                    value={form.prizeValue}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ticket Price (£) *</label>
                  <Input
                    name="ticketPrice"
                    type="number"
                    step="0.01"
                    value={form.ticketPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Tickets *</label>
                  <Input
                    name="maxTickets"
                    type="number"
                    value={form.maxTickets}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Draw Date</label>
                  <Input
                    name="drawDate"
                    type="datetime-local"
                    value={form.drawDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Question</label>
                  <Input
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    placeholder="e.g. What is 2 + 2?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Options (comma-separated)</label>
                  <Input
                    name="questionOptions"
                    value={form.questionOptions}
                    onChange={handleChange}
                    placeholder="1, 2, 3, 4"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="btn-luxury" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Competition"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/competitions")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
