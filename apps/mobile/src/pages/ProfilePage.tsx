import { useAuth } from "@luxero/auth";
import { LogOut, User } from "lucide-react";

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <p className="text-muted-foreground">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="px-4 h-14 flex items-center">
          <h1 className="font-semibold">Account</h1>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* User info card */}
        <div className="bg-card rounded-xl p-4 border border-border/50 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-6 h-6 text-gold" />
            </div>
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.isAdmin ? "Administrator" : "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <button
            className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 text-left active:bg-card/80"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <span className="text-sm font-medium">My Dashboard</span>
          </button>
          <button
            className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 text-left active:bg-card/80 text-destructive"
            onClick={logout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
