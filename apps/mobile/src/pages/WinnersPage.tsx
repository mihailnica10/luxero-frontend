import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { ArrowLeft, Trophy } from "lucide-react";

interface Winner {
  id: string;
  userEmail: string;
  prizeTitle: string;
  prizeValue: number;
  competitionTitle: string;
  wonAt: string;
}

export function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ApiResponse<Winner[]>>("/api/winners")
      .then((res) => setWinners(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold">Winners</span>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            Our <span className="text-gold">Winners</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Congratulations to all our lucky winners!
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : winners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No winners yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {winners.map((winner, idx) => (
              <div
                key={winner.id}
                className="relative overflow-hidden rounded-[1.5rem]"
              >
                <div className="p-1.5 rounded-[1.5rem] bg-black/5 ring-1 ring-black/5">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar with rank */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                          <span className="text-primary-foreground text-sm font-bold">
                            {getInitials(winner.userEmail)}
                          </span>
                        </div>
                        {idx === 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                            <span className="text-[10px]">👑</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{winner.userEmail}</p>
                        <p className="text-xs text-gold font-medium mt-0.5 truncate">
                          Won: {winner.prizeTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {winner.competitionTitle}
                        </p>
                      </div>

                      {/* Prize value */}
                      <div className="text-right shrink-0">
                        {winner.prizeValue > 0 && (
                          <p className="text-sm font-semibold text-gold">
                            £{winner.prizeValue.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(winner.wonAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6">
          <Link
            to="/competitions"
            className="block w-full py-3.5 bg-gold text-primary-foreground font-semibold text-center rounded-xl shadow-lg shadow-gold/30 active:scale-[0.98] transition-transform"
          >
            Try Your Luck
          </Link>
        </div>
      </div>
    </div>
  );
}