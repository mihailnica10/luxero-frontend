import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { Button, ProtectedRoute, Skeleton } from "@luxero/ui";
import { Gift, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface Win {
  _id: string;
  competitionId: {
    _id: string;
    title: string;
    prizeTitle?: string;
    prizeValue?: number;
    prizeImageUrl?: string;
  };
  prizeTitle?: string;
  prizeValue?: number;
  ticketNumber?: number;
  drawnAt: string;
  displayName?: string;
  location?: string;
  testimonial?: string;
  claimed?: boolean;
}

function WinsContent() {
  const [wins, setWins] = useState<Win[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWins() {
      try {
        const res = await api.get<ApiResponse<Win[]>>("/api/me/wins");
        setWins(res.data || []);
      } catch (err) {
        console.error("Failed to fetch wins:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWins();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Wins</h1>
            <p className="text-muted-foreground mt-1">Your prize wins and achievements</p>
          </div>
          <Link to="/dashboard" className="text-sm text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-[2rem]" shimmer />
            ))}
          </div>
        ) : wins.length === 0 ? (
          <div className="relative overflow-hidden rounded-[2rem]">
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
              <div className="rounded-[calc(2rem-0.375rem)] bg-card p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-gold/60" />
                </div>
                <p className="text-muted-foreground mb-2">No wins yet</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Keep entering competitions — your win could be next!
                </p>
                <Link to="/competitions">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                    Browse Competitions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wins.map((win) => {
              const prizeValue = win.prizeValue || win.competitionId?.prizeValue;
              const imageUrl = win.competitionId?.prizeImageUrl;

              return (
                <div
                  key={win._id}
                  className="group p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20 hover:ring-gold/40 transition-all duration-500"
                >
                  <div className="rounded-[calc(2rem-0.375rem)] bg-card overflow-hidden">
                    {/* Prize image */}
                    <div className="relative h-40 bg-gradient-to-br from-gold/20 to-gold/5">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={win.prizeTitle || win.competitionId?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-gold/60" />
                          </div>
                        </div>
                      )}
                      {/* Prize value badge */}
                      {prizeValue && (
                        <div className="absolute top-3 right-3 bg-gold/90 text-primary text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          £{prizeValue.toLocaleString()}
                        </div>
                      )}
                      {/* Trophy icon overlay */}
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md">
                        <Trophy className="w-4 h-4 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <p className="font-bold text-lg text-foreground">
                        {win.prizeTitle || win.competitionId?.prizeTitle}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {win.competitionId?.title}
                      </p>

                      {/* Win details row */}
                      <div className="flex items-center gap-4 mt-3">
                        {win.ticketNumber && (
                          <span className="text-xs text-muted-foreground">
                            Ticket: <span className="font-mono text-gold">#{win.ticketNumber}</span>
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(win.drawnAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Testimonial */}
                      {win.testimonial && (
                        <blockquote className="mt-4 pl-4 border-l-2 border-gold/30 italic text-sm text-muted-foreground">
                          "{win.testimonial}"
                        </blockquote>
                      )}

                      {/* CTA */}
                      {!win.claimed && (
                        <div className="mt-4 flex items-center gap-3">
                          <Button
                            size="sm"
                            className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-5"
                          >
                            <Gift className="w-4 h-4 mr-2" />
                            Claim Prize
                          </Button>
                          <span className="text-xs text-muted-foreground">Pending claim</span>
                        </div>
                      )}
                      {win.claimed && (
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-xs text-emerald-400 font-medium">
                            Prize claimed ✓
                          </span>
                        </div>
                      )}
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

export function DashboardWinsPage() {
  return (
    <ProtectedRoute>
      <WinsContent />
    </ProtectedRoute>
  );
}
