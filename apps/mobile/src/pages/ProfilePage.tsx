import { useAuth } from "@luxero/auth";
import {
  ChevronRight,
  HelpCircle,
  LogOut,
  Settings,
  Ticket,
  Trophy,
  Users
} from "lucide-react";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

export function ProfilePage() {
  const { user, logout } = useAuth();

  // Generate initials from email
  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    if (name.length >= 2) {
      return name.slice(0, 2).toUpperCase();
    }
    return name.toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground">Please log in to view your profile</p>
      </div>
    );
  }

  const menuItems: MenuItem[] = [
    { icon: Ticket, label: "My Tickets", href: "/dashboard/tickets" },
    { icon: Trophy, label: "Winners Dashboard", href: "/winners" },
    { icon: Users, label: "Referrals", href: "/dashboard/referrals" },
    { icon: Settings, label: "Settings", href: "/dashboard/profile" },
    { icon: HelpCircle, label: "Help & FAQ", href: "/faq" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Luxero Branding */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="px-4 h-14 flex items-center justify-between">
          <span className="text-gold font-bold text-lg tracking-wider">LUXERO</span>
          <button
            onClick={logout}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="px-4 py-6 pb-24">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-[1.5rem] mb-6">
          <div className="p-1.5 rounded-[1.5rem] bg-gradient-to-br from-gold/20 to-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
              {/* Avatar with initials */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30">
                  <span className="text-primary-foreground text-xl font-bold">
                    {getInitials(user.email)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {user.isAdmin ? "Administrator" : "Member"}
                  </p>
                  {user.fullName && (
                    <p className="text-sm text-foreground mt-1">
                      {user.fullName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.href) {
                  window.location.href = item.href;
                }
              }}
              className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 text-left active:bg-card/80 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-gold" />
              </div>
              <span className="flex-1 font-medium text-sm">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}

          {/* Sign Out */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 text-left active:bg-card/80 transition-colors mt-4"
          >
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-destructive" />
            </div>
            <span className="flex-1 font-medium text-sm text-destructive">Sign Out</span>
          </button>
        </div>

        {/* Footer branding */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Luxero.win — Premium Prize Competitions
          </p>
        </div>
      </div>
    </div>
  );
}