import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";
import { Search, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const categories = [
  { id: "all", label: "All" },
  { id: "tech", label: "Tech" },
  { id: "car", label: "Cars" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "travel", label: "Travel" },
  { id: "home", label: "Home" },
];

export function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    api
      .get<ApiResponse<Competition[]>>("/api/competitions")
      .then((res) => setCompetitions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (comp: Competition) => {
    const soldRatio = comp.soldTickets / comp.totalTickets;
    if (soldRatio >= 1) {
      return { label: "Sold Out", className: "bg-muted text-muted-foreground" };
    }
    if (comp.drawDate && new Date(comp.drawDate) < new Date()) {
      return { label: "Ended", className: "bg-muted text-muted-foreground" };
    }
    return { label: "LIVE", className: "bg-gold text-primary-foreground" };
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="px-4 h-14 flex items-center">
          <h1 className="font-semibold">Competitions</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search competitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card rounded-xl border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 pb-3 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-gold text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No competitions found</p>
          </div>
        ) : (
          filteredCompetitions.map((comp) => {
            const status = getStatusBadge(comp);
            return (
              <Link
                key={comp.id}
                to={`/competitions/${comp.slug}`}
                className="block bg-card rounded-xl border border-border/50 overflow-hidden active:scale-[0.98] transition-transform"
              >
                <div className="flex">
                  {/* Image placeholder */}
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1a1209] to-[#2d1f0e] flex items-center justify-center shrink-0">
                    <Ticket className="w-8 h-8 text-gold/30" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm line-clamp-2 leading-tight">{comp.title}</p>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    {comp.prizeValue > 0 && (
                      <p className="text-xs text-gold font-medium">Value: £{comp.prizeValue}</p>
                    )}

                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {comp.soldTickets}/{comp.totalTickets} sold
                        </span>
                        <span>{comp.totalTickets - comp.soldTickets} left</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${(comp.soldTickets / comp.totalTickets) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-gold">£{comp.price}</p>
                      {comp.drawDate && (
                        <p className="text-xs text-muted-foreground">
                          Draw: {new Date(comp.drawDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
