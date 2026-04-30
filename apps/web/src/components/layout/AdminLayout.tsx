import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Radial glow background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 10% 20%, rgba(202, 147, 57, 0.06) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 90% 80%, rgba(202, 147, 57, 0.04) 0%, transparent 50%)",
        }}
      />

      <AdminSidebar />

      {/* Main content */}
      <main className="relative z-10 md:ml-64 p-6 md:p-10 lg:p-12">{children}</main>
    </div>
  );
}
