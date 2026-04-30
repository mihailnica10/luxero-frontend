import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";
import { cn } from "@luxero/utils";

function mapCompetition(c: any): Competition {
  return {
    id: c._id || c.id,
    _id: c._id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    shortDescription: c.shortDescription,
    category: c.category,
    status: c.status,
    ticketPrice: c.ticketPrice ?? c.price ?? 0,
    price: c.price,
    originalPrice: c.originalPrice,
    imageUrl: c.imageUrl,
    prizeImageUrl: c.prizeImageUrl,
    drawDate: c.drawDate,
    endDate: c.endDate,
    startDate: c.startDate,
    prizeTitle: c.prizeTitle,
    prizeValue: c.prizeValue ?? 0,
    totalTickets: c.maxTickets ?? c.totalTickets ?? 0,
    maxTickets: c.maxTickets ?? 0,
    soldTickets: c.ticketsSold ?? c.soldTickets ?? 0,
    ticketsSold: c.ticketsSold ?? c.soldTickets ?? 0,
    maxTicketsPerUser: c.maxTicketsPerUser,
    isFeatured: c.isFeatured,
    displayOrder: c.displayOrder,
    instantPrize: c.instantPrize,
  };
}

export function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await api.get<ApiResponse<Competition[]>>("/api/competitions");
        setCompetitions((res.data ?? []).map(mapCompetition));
      } catch {
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.shortDescription?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
  );

  const getProgress = (competition: Competition) => {
    const total = competition.maxTickets ?? competition.totalTickets ?? 0;
    if (!total) return 0;
    const sold = competition.ticketsSold ?? competition.soldTickets ?? 0;
    return Math.round((sold / total) * 100);
  };

  const getTicketsLeft = (competition: Competition) => {
    const total = competition.maxTickets ?? competition.totalTickets ?? 0;
    const sold = competition.ticketsSold ?? competition.soldTickets ?? 0;
    return total - sold;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-gold/10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                Competitions
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Browse our luxury prize competitions and enter for your chance to win amazing prizes.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gold/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gold/20 hover:bg-gold/10">
                  All
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
                  Active
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
                  Ending Soon
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Competitions Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-xl border border-gold/10 p-6">
                    <Skeleton className="aspect-[4/3] w-full rounded-lg mb-4" shimmer />
                    <Skeleton className="h-6 w-3/4 mb-2" shimmer />
                    <Skeleton className="h-4 w-1/2 mb-4" shimmer />
                    <Skeleton className="h-10 w-full" shimmer />
                  </div>
                ))}
              </div>
            ) : filteredCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetitions.map((competition) => {
                  const imgUrl = competition.prizeImageUrl || competition.imageUrl;
                  const title = competition.prizeTitle || competition.title;
                  const progress = getProgress(competition);
                  const left = getTicketsLeft(competition);

                  return (
                    <Link key={competition.id || competition._id} to={`/competitions/${competition.slug || competition.id || competition._id}`}>
                      <div className="bg-card rounded-xl border border-gold/10 p-6 hover:border-gold/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10 h-full flex flex-col">
                        {imgUrl && (
                          <img
                            src={imgUrl}
                            alt={title}
                            className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
                          />
                        )}
                        {!imgUrl && (
                          <div className="w-full aspect-[4/3] bg-gradient-to-br from-gold/20 to-gold/5 rounded-lg mb-4 flex items-center justify-center">
                            <span className="text-gold text-4xl">🏆</span>
                          </div>
                        )}
                        <h3 className="font-bold text-lg mb-1 text-foreground line-clamp-2">
                          {title}
                        </h3>
                        {competition.shortDescription && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {competition.shortDescription}
                          </p>
                        )}
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">
                                {progress}% Sold
                              </span>
                              <span className="text-muted-foreground">
                                {left.toLocaleString()} left
                              </span>
                            </div>
                            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  progress >= 75
                                    ? "bg-gradient-to-r from-green-500 to-green-400"
                                    : progress >= 50
                                      ? "bg-gradient-to-r from-gold to-amber-400"
                                      : "bg-gradient-to-r from-gold/80 to-gold"
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-gold font-bold">
                              £{(competition.ticketPrice ?? competition.price ?? 0).toFixed(2)} per ticket
                            </span>
                            <Button size="sm" className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold shadow-lg shadow-gold/20">
                              Enter Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No competitions found</p>
                <p className="text-muted-foreground text-sm mt-2">
                  Check back soon for new competitions!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
