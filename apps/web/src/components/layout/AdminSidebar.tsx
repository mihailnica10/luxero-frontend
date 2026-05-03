"use client";

import { useAuth } from "@luxero/auth";
import { cn } from "@luxero/utils";
import {
  BarChart3,
  FolderTree,
  Gift,
  LogOut,
  Menu,
  ShoppingBag,
  Tag,
  Ticket,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: BarChart3 }],
  },
  {
    title: "Management",
    items: [
      { href: "/admin/competitions", label: "Competitions", icon: Ticket },
      { href: "/admin/instant-prizes", label: "Instant Prizes", icon: Gift },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/promo-codes", label: "Promo Codes", icon: Tag },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/referrals", label: "Referrals", icon: TrendingUp },
    ],
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(`${href}/`);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-card border border-gold/20 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-card border-r border-gold/10 transform transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gold/10">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-sans text-xl font-bold tracking-tight text-gold">Luxero</span>
              <span className="text-xs text-muted-foreground bg-gold/10 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                          isActive(item.href)
                            ? "bg-gold/10 text-gold border border-gold/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gold/10 space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gold/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <Link
              to="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gold/5 transition-all"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
