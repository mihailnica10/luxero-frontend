"use client";

import {
  BookOpen,
  Gift,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  ShoppingBag,
  ShoppingCart,
  Star,
  Ticket,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@luxero/ui";
import { Sheet, SheetContent } from "@luxero/ui";
import { useAuth } from "@luxero/auth";
import { useCart } from "@luxero/cart";
import { CategoryNav } from "../home/CategoryNav";

// All nav links — single source of truth for both desktop nav bar and mobile sheet
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/winners", label: "Winners", icon: Star },
  { href: "/how-it-works", label: "How It Works", icon: Ticket },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/about", label: "About", icon: BookOpen },
  { href: "/contact", label: "Contact", icon: Mail },
];

// Dashboard menu (user dropdown)
const DASHBOARD_MENU = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/tickets", label: "My Tickets", icon: Ticket },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/wins", label: "My Wins", icon: Gift },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/referrals", label: "Refer & Earn", icon: Gift },
];

// ─── User Dropdown ─────────────────────────────────────────────────────────
function UserDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const displayName =
    user?.fullName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Account";

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full border border-gold/30 bg-card/60 hover:bg-card hover:border-gold/50 px-3 py-1.5 transition-all duration-200 active:scale-[0.98]"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gold/25 to-gold/10 border border-gold/30 flex items-center justify-center text-xs font-bold text-gold">
            {initials}
          </div>
          <span className="hidden lg:block text-sm font-medium text-foreground max-w-[72px] truncate">
            {displayName}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-card border border-gold/15 rounded-xl p-1.5 shadow-xl shadow-black/30"
        sideOffset={8}
      >
        {/* User info */}
        <div className="px-3 py-3 mb-1 rounded-lg bg-gold/5 border border-gold/10">
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.fullName ?? displayName}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {user?.email}
          </p>
        </div>

        {/* Dashboard links */}
        {DASHBOARD_MENU.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              to={item.href}
              className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-foreground hover:text-gold hover:bg-gold/10 rounded-lg transition-colors cursor-pointer w-full"
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="bg-border/50 my-1" />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 py-2.5 px-2 text-sm text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Cart Button ───────────────────────────────────────────────────────────
function CartButton() {
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link to="/cart" className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative w-9 h-9 rounded-full border border-gold/20 bg-card/80 hover:bg-gold/10 hover:border-gold/40 transition-all duration-300"
      >
        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
        {count > 0 && (
          <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-gold text-primary-foreground text-[10px] font-bold shadow-lg shadow-gold/20">
            {count}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

// ─── Header ────────────────────────────────────────────────────────────────
export function Header() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      {/* ── Row 1: Logo + Nav + Actions ─────────────────────────────── */}
      <div className="bg-card/95 backdrop-blur-2xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-6">

            {/* Logo */}
            <Link
              to="/"
              className="flex-shrink-0 font-sans text-xl sm:text-2xl font-bold tracking-tight text-gold hover:brightness-110 transition-all"
            >
              Luxero
            </Link>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden md:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      active
                        ? "text-gold bg-gold/10"
                        : "text-muted-foreground hover:text-gold hover:bg-gold/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              <CartButton />

              {/* Auth loading skeleton */}
              {authLoading ? (
                <div className="hidden md:flex items-center gap-2">
                  <Skeleton className="h-8 w-20" shimmer />
                  <Skeleton className="h-8 w-20" shimmer />
                </div>
              ) : user ? (
                <div className="hidden md:block">
                  <UserDropdown />
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-1.5">
                  <Link to="/auth/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-medium hover:text-gold hover:bg-gold/10 transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/sign-up">
                    <Button
                      size="sm"
                      className="bg-gold hover:bg-gold-dark text-primary-foreground text-xs font-bold shadow-lg shadow-gold/20 hover:shadow-xl transition-all duration-300 rounded-full px-4"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden w-9 h-9 rounded-full border border-gold/20 bg-card/80 hover:bg-gold/10 transition-all duration-300"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  <X className="w-4 h-4 text-gold" />
                ) : (
                  <Menu className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category Nav (index page only) ─────────────────── */}
      {location.pathname === "/" && <CategoryNav />}

      {/* ── Mobile sheet menu ────────────────────────────────────────────── */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-sm p-0 bg-card border-l border-gold/10"
        >
          <div className="flex flex-col h-full">

            {/* Sheet header */}
            <div className="flex items-center justify-between p-5 border-b border-gold/10">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-2xl font-bold tracking-tight text-gold"
              >
                Luxero
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-full hover:bg-gold/10"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Scrollable nav */}
            <div className="flex-1 overflow-y-auto py-2">
              <div className="px-3 py-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-2">
                  Navigation
                </p>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                        active
                          ? "text-gold bg-gold/10"
                          : "text-muted-foreground hover:text-gold hover:bg-gold/10"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sheet footer — auth */}
            <div className="p-4 border-t border-gold/10 space-y-2">
              {authLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="flex-1 h-10 rounded-xl" shimmer />
                  <Skeleton className="flex-1 h-10 rounded-xl" shimmer />
                </div>
              ) : user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-bold rounded-xl py-3 shadow-lg shadow-gold/20 transition-all">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link to="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full border-gold/30 hover:bg-gold/10 transition-all">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-bold rounded-xl shadow-lg shadow-gold/20 transition-all">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}