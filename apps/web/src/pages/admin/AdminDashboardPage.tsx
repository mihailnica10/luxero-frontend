import { ArrowRight, Gift, ShoppingBag, Tag, Ticket, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "@luxero/ui";

export function AdminDashboardPage() {
  // Placeholder stats
  const stats = {
    totalRevenue: 12500,
    totalUsers: 1250,
    totalCompetitions: 45,
    activeCompetitions: 12,
    totalOrders: 890,
  };

  const quickActions = [
    {
      href: "/admin/competitions/new",
      label: "New Competition",
      icon: Ticket,
      description: "Create a prize competition",
    },
    {
      href: "/admin/competitions",
      label: "Manage Competitions",
      icon: Zap,
      description: "Edit, draw, monitor",
    },
    {
      href: "/admin/orders",
      label: "View Orders",
      icon: ShoppingBag,
      description: "Track all orders",
    },
    { href: "/admin/users", label: "Manage Users", icon: Users, description: "Roles and accounts" },
    {
      href: "/admin/promo-codes",
      label: "Promo Codes",
      icon: Tag,
      description: "Discounts and offers",
    },
    {
      href: "/admin/instant-prizes",
      label: "Instant Prizes",
      icon: Gift,
      description: "Bonus prizes setup",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Overview
          </span>
          <h1 className="text-3xl font-bold tracking-tight mt-1">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Revenue - Hero card spanning 2 columns */}
          <div className="lg:col-span-2">
            <Card className="border-gold/20">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Revenue
                    </span>
                    <p className="text-4xl font-bold tracking-tight">
                      £{stats.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Users Card */}
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Users
                  </span>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitions Card */}
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Competitions
                  </span>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.totalCompetitions.toLocaleString()}
                  </p>
                  <p className="text-xs text-gold">{stats.activeCompetitions} active</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center border border-gold/20">
                  <Zap className="w-5 h-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="border-gold/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Orders
                  </span>
                  <p className="text-3xl font-bold tracking-tight">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-gold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full">
              Actions
            </span>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} to={action.href}>
                  <Card className="hover:border-gold/30 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/20 group-hover:border-gold/30 transition-colors">
                        <Icon className="w-5 h-5 text-gold" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium group-hover:text-gold transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
