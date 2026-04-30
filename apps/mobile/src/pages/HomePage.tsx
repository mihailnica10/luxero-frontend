import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Competition[]>>("/api/competitions")
      .then((res) => setCompetitions(res.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="flex items-center justify-between px-4 h-14">
          <span className="text-gold font-bold text-lg tracking-wide">LUXERO</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-b from-[#1a1209] to-background px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Win Premium Prizes</h1>
        <p className="text-muted-foreground text-sm">
          Enter competitions for luxury prizes at unbeatable prices
        </p>
      </div>

      {/* Featured Competitions */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured</h2>
          <Link to="/competitions" className="text-sm text-gold hover:underline">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {competitions.map((comp) => (
              <Link
                key={comp.id}
                to={`/competitions/${comp.slug}`}
                className="block bg-card rounded-xl p-4 border border-border/50 active:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{comp.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {comp.soldTickets}/{comp.totalTickets} sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gold">£{comp.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
