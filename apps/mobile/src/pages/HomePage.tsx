import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";
import { ArrowRight, CheckCircle, Search, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  { icon: Search, title: "Browse", description: "Find exciting competitions" },
  { icon: Ticket, title: "Enter", description: "Get your tickets" },
  { icon: CheckCircle, title: "Win", description: "Cross your fingers!" },
];

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
          <span className="text-gold font-bold text-lg tracking-wider">LUXERO</span>
          <Link to="/profile" className="p-2 -mr-2">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-xs font-bold">L</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Hero Section with Gold Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1209] via-[#2d1f0e] to-[#1a1209]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#b8860b_0%,_transparent_60%)]" />
        <div className="relative px-4 py-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-xs font-medium">Live Competitions</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Win{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Premium Prizes
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
            Enter competitions for luxury prizes at unbeatable prices
          </p>
          <Link
            to="/competitions"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-primary-foreground font-semibold rounded-full shadow-lg shadow-gold/30 active:scale-95 transition-transform"
          >
            Browse Competitions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Featured Competitions - 2 Column Grid */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured</h2>
          <Link to="/competitions" className="text-sm text-gold hover:underline font-medium">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : competitions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No competitions available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {competitions.map((comp) => (
              <Link
                key={comp.id}
                to={`/competitions/${comp.slug}`}
                className="block bg-card rounded-xl border border-border/50 overflow-hidden active:scale-[0.98] transition-transform"
              >
                {/* Image placeholder with gold accent */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1209] to-[#2d1f0e] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-gold/30" />
                  </div>
                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/90 text-primary-foreground text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                      LIVE
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-3">
                  <p className="font-medium text-sm line-clamp-2 leading-tight">{comp.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {comp.soldTickets}/{comp.totalTickets} sold
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full"
                      style={{ width: `${(comp.soldTickets / comp.totalTickets) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-gold mt-2">£{comp.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Teaser */}
      <section className="px-4 py-6">
        <div className="relative overflow-hidden rounded-[1.5rem]">
          <div className="p-1.5 rounded-[1.5rem] bg-gradient-to-br from-gold/20 to-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">How It Works</h2>
              <div className="flex items-center justify-around">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-2">
                      <step.icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-xs font-medium">{step.title}</p>
                    {idx < steps.length - 1 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:block">
                        <ArrowRight className="w-4 h-4 text-gold/50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Link
                to="/how-it-works"
                className="w-full mt-4 py-2.5 text-center text-sm text-gold font-medium border border-gold/30 rounded-xl hover:bg-gold/5 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 py-6 pb-24 space-y-3">
        <Link
          to="/winners"
          className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 active:bg-card/80"
        >
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold">🏆</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">Winners Dashboard</p>
            <p className="text-xs text-muted-foreground">See recent prize winners</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
        <Link
          to="/faq"
          className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50 active:bg-card/80"
        >
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
            <span className="text-gold">❓</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">FAQ</p>
            <p className="text-xs text-muted-foreground">Got questions? We have answers</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </Link>
      </section>
    </div>
  );
}
