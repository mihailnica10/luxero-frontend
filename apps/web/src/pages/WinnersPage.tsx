import { ArrowRight, Calendar, Quote, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { useEffect, useState } from "react";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

interface WinnerStats {
  totalPrizeValue: number;
  totalWinners: number;
  totalWinnersAllTime: number;
}

interface Winner {
  _id: string;
  displayName?: string;
  location?: string;
  prizeTitle?: string;
  prizeValue?: number;
  prizeImageUrl?: string;
  ticketNumber?: number;
  drawnAt: string;
  testimonial?: string;
  userId?: { fullName?: string; avatarUrl?: string };
}

function WinnerCard({ winner }: { winner: Winner }) {
  const initials = winner.userId?.fullName
    ? winner.userId.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : winner.displayName?.[0]?.toUpperCase() || "W";

  return (
    <div className="relative overflow-hidden rounded-[1.5rem]">
      <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-gold/10 hover:ring-gold/30 transition-all duration-500 hover:-translate-y-1">
        <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
              {winner.userId?.avatarUrl ? (
                <img src={winner.userId.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className="text-lg font-bold text-gold">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {winner.displayName || winner.userId?.fullName || "Anonymous Winner"}
              </p>
              {winner.location && (
                <p className="text-xs text-muted-foreground truncate">{winner.location}</p>
              )}
            </div>
            <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center flex-shrink-0">
              <Trophy className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>

          {/* Prize Details */}
          <div className="bg-gradient-to-br from-gold/5 to-transparent border border-gold/10 rounded-xl p-4 mb-4">
            <p className="text-xs text-muted-foreground mb-1">Prize</p>
            <p className="font-semibold text-foreground mb-2">
              {winner.prizeTitle || "Luxury Prize"}
            </p>
            <div className="flex items-center justify-between">
              {winner.prizeValue && (
                <span className="text-gold font-bold">£{winner.prizeValue.toLocaleString()}</span>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(winner.drawnAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {winner.ticketNumber && (
              <p className="text-xs text-muted-foreground mt-2">
                Winning ticket: #{winner.ticketNumber}
              </p>
            )}
          </div>

          {/* Testimonial */}
          {winner.testimonial && (
            <div className="relative">
              <Quote className="absolute -top-1 -left-1 w-5 h-5 text-gold/20" />
              <p className="text-sm text-muted-foreground italic pl-5 leading-relaxed">
                &ldquo;{winner.testimonial}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WinnersPage() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [stats, setStats] = useState<WinnerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [winnersRes, statsRes] = await Promise.all([
          api.get<ApiResponse<Winner[]>>("/api/winners"),
          api.get<ApiResponse<WinnerStats>>("/api/winners/stats"),
        ]);
        setWinners(winnersRes.data ?? []);
        setStats(statsRes.data ?? null);
      } catch {
        setWinners([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Winners
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Congratulations to all our winners! See who has won amazing prizes.
          </p>
        </div>

        {/* Stats */}
        {!isLoading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-gold/5 ring-1 ring-gold/20">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 text-center">
                  <p className="text-3xl font-bold text-gold mb-1">
                    £{(stats.totalPrizeValue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-muted-foreground">Total Prize Value</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 text-center">
                  <p className="text-3xl font-bold text-gold mb-1">{stats.totalWinners}</p>
                  <p className="text-sm text-muted-foreground">Winners</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 text-center">
                  <p className="text-3xl font-bold text-gold mb-1">
                    {stats.totalWinnersAllTime}
                  </p>
                  <p className="text-sm text-muted-foreground">Happy Members</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-[1.5rem] bg-white/5" />
            ))}
          </div>
        )}

        {/* Winners Grid */}
        {winners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {winners.map((winner) => (
              <WinnerCard key={winner._id} winner={winner} />
            ))}
          </div>
        ) : !isLoading ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No winners to display yet</p>
            <Link to="/competitions">
              <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                Browse Competitions
              </Button>
            </Link>
          </div>
        ) : null}

        {/* CTA */}
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="p-1.5 rounded-[2rem] bg-gradient-to-r from-gold/5 to-gold/10 ring-1 ring-gold/20">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 sm:p-12 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-2">Could You Be Next?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of members trying their luck every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/competitions">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-8">
                    Browse Competitions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-8">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}