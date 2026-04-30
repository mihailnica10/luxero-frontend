import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Badge } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { AdminUser, ApiResponse } from "@luxero/types";

export function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [isAdminFilter, setIsAdminFilter] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const params: Record<string, string | number> = { limit: 100, page: 1 };
        if (verifiedFilter) params.isVerified = verifiedFilter;
        if (isAdminFilter) params.isAdmin = isAdminFilter;

        const res = await api.get<ApiResponse<AdminUser[]>>("/api/admin/users", { params });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [verifiedFilter, isAdminFilter]);

  async function handleToggleAdmin(userId: string, currentAdmin: boolean) {
    try {
      await api.put(`/api/admin/users/${userId}`, { isAdmin: !currentAdmin });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isAdmin: !currentAdmin } : u))
      );
    } catch (err) {
      console.error("Failed to update admin status:", err);
    }
  }

  async function handleToggleVerified(userId: string, currentVerified: boolean) {
    try {
      await api.put(`/api/admin/users/${userId}`, { isVerified: !currentVerified });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: !currentVerified } : u))
      );
    } catch (err) {
      console.error("Failed to update verified status:", err);
    }
  }

  const filtered = users.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">Manage user accounts</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            />
          </div>
          <select
            className="px-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
          >
            <option value="">All Verified</option>
            <option value="true">Verified</option>
            <option value="false">Unverified</option>
          </select>
          <select
            className="px-3 py-2 rounded-lg border border-gold/20 bg-card text-sm"
            value={isAdminFilter}
            onChange={(e) => setIsAdminFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="true">Admin</option>
            <option value="false">User</option>
          </select>
        </div>

        <Card className="border-gold/20">
          {isLoading ? (
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/10 text-left">
                      <th className="p-4 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Verified</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-gold/10">
                        <td className="p-4"><Skeleton className="h-5 w-48" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-16" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-20" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-24" shimmer /></td>
                        <td className="p-4"><Skeleton className="h-5 w-28" shimmer /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          ) : filtered.length === 0 ? (
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gold/10 text-left">
                    <th className="p-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Verified</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user) => (
                    <tr key={user._id} className="border-b border-gold/10 hover:bg-card/50">
                      <td className="p-4 font-mono text-sm">{user.email}</td>
                      <td className="p-4">
                        <Badge
                          variant={user.isAdmin ? "default" : "outline"}
                          className={user.isAdmin ? "bg-gold text-black" : ""}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={user.isVerified ? "default" : "outline"}
                          className={user.isVerified ? "text-green-400 border-green-400/30" : ""}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                            className="text-xs px-2 py-1 rounded border border-gold/20 bg-card hover:bg-gold/10"
                          >
                            {user.isAdmin ? "Remove Admin" : "Make Admin"}
                          </button>
                          <button
                            onClick={() => handleToggleVerified(user._id, user.isVerified)}
                            className="text-xs px-2 py-1 rounded border border-gold/20 bg-card hover:bg-gold/10"
                          >
                            {user.isVerified ? "Revoke" : "Verify"}
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
