import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";

export function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Competition[]>>("/api/competitions")
      .then((res) => setCompetitions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="px-4 h-14 flex items-center">
          <h1 className="font-semibold">Competitions</h1>
        </div>
      </header>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No competitions available</p>
          </div>
        ) : (
          competitions.map((comp) => (
            <Link
              key={comp.id}
              to={`/competitions/${comp.slug}`}
              className="block bg-card rounded-xl p-4 border border-border/50 active:bg-card/80"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Ticket className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{comp.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Draw: {new Date(comp.drawDate).toLocaleDateString()}
                  </p>
                  <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{
                        width: `${(comp.soldTickets / comp.totalTickets) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gold">£{comp.price}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {comp.totalTickets - comp.soldTickets} left
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
