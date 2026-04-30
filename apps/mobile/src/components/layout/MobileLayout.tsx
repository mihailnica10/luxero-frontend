import { Outlet, useLocation } from "react-router-dom";
import { Home, Ticket, ShoppingCart, User } from "lucide-react";
import { cn } from "@luxero/utils";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/competitions", label: "Competitions", icon: Ticket },
  { path: "/cart", label: "Cart", icon: ShoppingCart },
  { path: "/profile", label: "Account", icon: User },
];

export function MobileLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-border/20 z-50">
        <div className="flex items-center justify-around h-16 px-4">
          {tabs.map((tab) => {
            const isActive =
              tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);

            return (
              <a
                key={tab.path}
                href={`#${tab.path}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = tab.path;
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[56px]",
                  isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
