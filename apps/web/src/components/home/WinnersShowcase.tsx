"use client";

import { ArrowRight, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { useEffect, useState } from "react";
import { api } from "@luxero/api-client";
import type { ApiResponse, Winner } from "@luxero/types";

function mapWinner(w: Winner) {
  return {
    id: w._id || w.id,
    name: w.displayName || "Anonymous Winner",
    initials: (w.displayName || "AW").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    prize: w.prizeTitle || "Luxury Prize",
    prizeValue: w.prizeValue || 0,
    imageUrl: w.winnerPhotoUrl,
    testimonial: w.testimonial,
    competitionTitle: w.prizeTitle || "",
    winDate: w.drawnAt || new Date().toISOString(),
  };
}

export function WinnersShowcase() {
  const [winners, setWinners] = useState<ReturnType<typeof mapWinner>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWinners() {
      try {
        const res = await api.get<ApiResponse<Winner[]>>("/api/winners");
        const raw = res.data ?? [];
        setWinners(raw.map(mapWinner));
      } catch {
        setWinners([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWinners();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gold/5 via-background to-gold/5 border-y border-gold/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-gold" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                <span className="text-gold-gradient">Winners</span>
              </h2>
              <Sparkles className="w-6 h-6 text-gold/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" shimmer />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (winners.length === 0) return null;

  const featuredWinner = winners[0];
  const otherWinners = winners.slice(1, 6);

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gold/5 via-background to-gold/5 border-y border-gold/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Trophy className="w-8 h-8 text-gold" />
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              <span className="text-gold-gradient">Winners</span>
            </h2>
            <Sparkles className="w-6 h-6 text-gold/60" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real winners, real prizes. See who&apos;s been lucky recently.
          </p>
        </div>

        {/* Winners Grid */}
        {otherWinners.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-16">
            {otherWinners.map((winner) => (
              <div key={winner.id} className="relative group cursor-pointer">
                <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-card border border-gold/20 shadow-md hover:shadow-lg hover:shadow-gold/10 transition-shadow duration-500">
                  {winner.imageUrl ? (
                    <img
                      src={winner.imageUrl}
                      alt={winner.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
                      <Trophy className="w-10 h-10 text-gold/40" />
                    </div>
                  )}

                  {/* Winner Info Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:opacity-0 flex items-end p-3 sm:p-4">
                    <div className="text-white">
                      <p className="font-semibold text-xs sm:text-sm mb-0.5">{winner.name}</p>
                      <p className="text-[10px] sm:text-xs text-gray-300 line-clamp-2">
                        {winner.competitionTitle}
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-gold mt-1">
                        £{winner.prizeValue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Prize Badge */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gold/90 backdrop-blur-sm text-primary-foreground text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    £{(winner.prizeValue / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Winner with Testimonial */}
        {featuredWinner && (
          <Card className="border-gold/20 bg-gradient-to-br from-card to-gold/5 overflow-hidden">
            <CardContent className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center">
                {/* Winner Photo with Ring */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-gold/30 shadow-xl shadow-gold/10">
                    {featuredWinner.imageUrl ? (
                      <img
                        src={featuredWinner.imageUrl}
                        alt={featuredWinner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gold/10">
                        <Trophy className="w-12 h-12 text-gold/40" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-4">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                      {featuredWinner.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-gold to-gold-dark text-primary-foreground text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Featured Winner
                    </Badge>
                  </div>

                  {featuredWinner.testimonial && (
                    <blockquote className="text-sm sm:text-base text-muted-foreground italic mb-6 relative">
                      <span className="text-3xl sm:text-4xl text-gold/20 absolute -top-2 -left-1">
                        &ldquo;
                      </span>
                      {featuredWinner.testimonial}
                      <span className="text-3xl sm:text-4xl text-gold/20 absolute -bottom-4 -right-1">
                        &rdquo;
                      </span>
                    </blockquote>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
                        {featuredWinner.prize}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Won{" "}
                        {new Date(featuredWinner.winDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA Button */}
        <div className="text-center mt-10 md:mt-12">
          <Link to="/winners">
            <Button
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-primary-foreground font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-lg shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              View All Winners
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}