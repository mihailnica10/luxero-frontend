import { Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ProtectedRoute } from "@luxero/ui";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

interface Entry {
  _id: string;
  competitionId: {
    _id: string;
    title: string;
    prizeTitle?: string;
    prizeImageUrl?: string;
    imageUrl?: string;
    status: string;
    drawDate?: string;
    maxTickets: number;
    soldTickets: number;
  };
  ticketNumbers: number[];
  quantity: number;
}

function CountdownBadge({ drawDate }: { drawDate?: string }) {
  if (!drawDate) return null;
  const diff = new Date(drawDate).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days === 1) return <span className="text-xs text-amber-400">Draws tomorrow</span>;
  if (days <= 7) return <span className="text-xs text-amber-400">Draws in {days} days</span>;
  return <span className="text-xs text-muted-foreground">Draw: {new Date(drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>;
}

function TicketsContent() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await api.get<ApiResponse<Entry[]>>("/api/me/entries");
        setEntries(res.data || []);
      } catch (err) {
        console.error("Failed to fetch entries:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchEntries();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Tickets</h1>
            <p className="text-muted-foreground mt-1">All your competition entries</p>
          </div>
          <Link to="/dashboard" className="text-sm text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-[1.5rem]" shimmer />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem]">
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
              <div className="rounded-[calc(2rem-0.375rem)] bg-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-gold/60" />
                </div>
                <p className="text-muted-foreground mb-4">No tickets yet</p>
                <Link to="/competitions">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                    Browse Competitions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const comp = entry.competitionId;
              if (!comp) return null;
              const soldPct = Math.round(((comp.soldTickets || 0) / (comp.maxTickets || 1)) * 100);
              const imageUrl = comp.prizeImageUrl || comp.imageUrl;
              const ticketCount = entry.ticketNumbers?.length || entry.quantity || 0;
              const statusBadge =
                comp.status === "active"
                  ? { label: "Active", cls: "text-amber-400 border-amber-400/30" }
                  : comp.status === "ended"
                    ? { label: "Ended", cls: "text-muted-foreground border-muted/30" }
                    : { label: "Drawn", cls: "text-emerald-400 border-emerald-400/30" };

              return (
                <div key={entry._id} className="group p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:bg-gold/5 hover:ring-gold/30 transition-all duration-500">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4">
                    <div className="flex items-center gap-4">
                      {/* Competition thumbnail */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/5">
                        {imageUrl ? (
                          <img src={imageUrl} alt={comp.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-gold/30" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">
                          {comp.prizeTitle || comp.title}
                        </p>

                        {/* Ticket numbers */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          {entry.ticketNumbers?.length > 0 ? (
                            entry.ticketNumbers.slice(0, 8).map((n) => (
                              <span key={n} className="text-[10px] font-mono bg-gold/10 text-gold px-2 py-0.5 rounded-full border border-gold/20">
                                #{n}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {ticketCount} ticket{ticketCount !== 1 ? "s" : ""} — no numbers assigned yet
                            </span>
                          )}
                          {entry.ticketNumbers?.length > 8 && (
                            <span className="text-[10px] text-muted-foreground">+{entry.ticketNumbers.length - 8} more</span>
                          )}
                        </div>

                        {/* Progress bar + draw info */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden max-w-[180px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                              style={{ width: `${soldPct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{soldPct}% sold</span>
                          <CountdownBadge drawDate={comp.drawDate} />
                        </div>
                      </div>

                      {/* Right: status + link */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge variant="outline" className={statusBadge.cls}>
                          {statusBadge.label}
                        </Badge>
                        <Link
                          to={`/competitions/${comp._id}`}
                          className="text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function DashboardTicketsPage() {
  return (
    <ProtectedRoute>
      <TicketsContent />
    </ProtectedRoute>
  );
}