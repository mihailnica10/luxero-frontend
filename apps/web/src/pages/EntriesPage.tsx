import { Loader2, Search, Ticket, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Input } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";

interface CompetitionEntry {
  id: string;
  competitionId: string;
  firstName: string | null;
  lastName: string | null;
  ticketNumbers: number[];
  createdAt: string;
  showLastName: boolean;
  showLocation: boolean;
  location: string | null;
  showSocials: boolean;
  quantity: number;
  [key: string]: unknown;
}

interface EntryApiResponse {
  entries: CompetitionEntry[];
  total: number;
  hasMore: boolean;
}

interface CompetitionWithStats extends Competition {
  entryCount?: number;
  winnerTicketNumber?: number | null;
}

export function EntriesPage() {
  const [competitions, setCompetitions] = useState<CompetitionWithStats[]>([]);
  const [filtered, setFiltered] = useState<CompetitionWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [entries, setEntries] = useState<CompetitionEntry[]>([]);
  const [entriesTotal, setEntriesTotal] = useState(0);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await api.get<ApiResponse<CompetitionWithStats[]>>("/api/competitions");
        setCompetitions(res.data);
        setFiltered(res.data);
      } catch {
        setCompetitions([]);
        setFiltered([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(
      competitions.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.shortDescription?.toLowerCase().includes(q) ?? false)
      )
    );
  }, [searchQuery, competitions]);

  const selectedCompetition = competitions.find((c) => c.id === selectedId);

  async function selectCompetition(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setIsLoadingEntries(true);
    setPage(1);

    try {
      const res = await api.get<EntryApiResponse>(
        `/api/entries?competitionId=${id}&page=1&limit=50`
      );
      setEntries(res.entries ?? []);
      setEntriesTotal(res.total ?? 0);
      setHasMore(res.hasMore ?? false);
      setPage(1);
    } catch {
      setEntries([]);
      setEntriesTotal(0);
      setHasMore(false);
    } finally {
      setIsLoadingEntries(false);
    }
  }

  async function loadMore() {
    if (!selectedId || isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const res = await api.get<EntryApiResponse>(
        `/api/entries?competitionId=${selectedId}&page=${nextPage}&limit=50`
      );
      setEntries((prev) => [...prev, ...(res.entries ?? [])]);
      setEntriesTotal(res.total ?? 0);
      setHasMore(res.hasMore ?? false);
      setPage(nextPage);
    } catch {
      // keep state
    } finally {
      setIsLoadingMore(false);
    }
  }

  const progressPercent =
    selectedCompetition && selectedCompetition.totalTickets
      ? Math.round((selectedCompetition.soldTickets / selectedCompetition.totalTickets) * 100)
      : 0;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatEntryName = (entry: CompetitionEntry) => {
    const first = entry.firstName || "Anonymous";
    if (entry.showLastName && entry.lastName) {
      return `${first} ${entry.lastName.charAt(0)}.`;
    }
    return first;
  };

  const activeCount = competitions.filter((c) => c.status === "active").length;
  const drawnCount = competitions.filter((c) => c.status === "drawn" || c.status === "ended").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <Badge variant="outline" className="text-[10px] border-gold/30 text-gold bg-gold/10 mb-4">
                Full Transparency
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Competition <span className="text-gold-gradient">Entries</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every ticket. Every participant. Every draw — fully transparent.
              </p>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="text-center p-3 rounded-xl bg-card border border-border">
                <p className="text-xl sm:text-2xl font-bold text-gold">{competitions.length}</p>
                <p className="text-[10px] text-muted-foreground">Competitions</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card border border-border">
                <p className="text-xl sm:text-2xl font-bold text-gold">
                  {competitions.reduce((s, c) => s + (c.entryCount ?? 0), 0).toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground">Total Entries</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card border border-border">
                <p className="text-xl sm:text-2xl font-bold text-success">{activeCount}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-card border border-border">
                <p className="text-xl sm:text-2xl font-bold text-gold">{drawnCount}</p>
                <p className="text-[10px] text-muted-foreground">Drawn</p>
              </div>
            </div>
          </div>
        </section>

        {/* Competition selector + entries */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left: competition list */}
              <div className="lg:col-span-2 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search competitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border rounded-xl"
                  />
                </div>

                {/* Competition list */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" shimmer />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <Ticket className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No competitions found</p>
                    </div>
                  ) : (
                    filtered.map((comp) => {
                      const pct =
                        comp.totalTickets > 0
                          ? Math.round((comp.soldTickets / comp.totalTickets) * 100)
                          : 0;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => selectCompetition(comp.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                            selectedId === comp.id
                              ? "bg-gold/10 border border-gold/30 shadow-sm"
                              : "bg-card border border-transparent hover:bg-card/80 hover:border-border"
                          }`}
                        >
                          {/* Prize image thumbnail */}
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            {comp.imageUrl ? (
                              <img
                                src={comp.imageUrl}
                                alt={comp.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Ticket className="w-5 h-5 text-gold/40" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {comp.prizeTitle || comp.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">
                                {(comp.entryCount ?? 0).toLocaleString()} entries
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 ${
                                  comp.status === "active"
                                    ? "border-success/30 text-success bg-success/10"
                                    : comp.status === "drawn"
                                      ? "border-gold/30 text-gold bg-gold/10"
                                      : "border-border text-muted-foreground"
                                }`}
                              >
                                {comp.status}
                              </Badge>
                            </div>
                            {/* Progress */}
                            <div className="mt-1.5 h-1 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right: entry list */}
              <div className="lg:col-span-3 space-y-4">
                {!selectedId ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Users className="w-12 h-12 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">
                      Select a competition to view its entries
                    </p>
                  </div>
                ) : isLoadingEntries ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded-xl" shimmer />
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-14 w-full rounded-xl" shimmer />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Competition info bar */}
                    {selectedCompetition && (
                      <div className="p-4 rounded-2xl bg-card border border-border">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-base font-semibold text-foreground">
                              {selectedCompetition.prizeTitle || selectedCompetition.title}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {entriesTotal.toLocaleString()} total entries
                              {selectedCompetition.winnerTicketNumber && (
                                <span className="text-gold ml-2">
                                  · Winner: #{selectedCompetition.winnerTicketNumber}
                                </span>
                              )}
                            </p>
                          </div>
                          {/* Progress */}
                          <div className="flex items-center gap-3 md:w-56">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-gold-dark to-gold transition-all"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gold whitespace-nowrap">
                              {progressPercent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Entries list */}
                    {entries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Ticket className="w-12 h-12 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground">No entries yet for this competition.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 hover:border-gold/20 transition-all"
                          >
                            {/* Ticket numbers */}
                            <div className="flex-shrink-0 w-28">
                              <div className="flex flex-wrap gap-1">
                                {entry.ticketNumbers.slice(0, 3).map((num) => (
                                  <span
                                    key={num}
                                    className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-mono bg-gold/10 text-gold rounded-md border border-gold/20"
                                  >
                                    #{num}
                                  </span>
                                ))}
                                {entry.ticketNumbers.length > 3 && (
                                  <span className="inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground">
                                    +{entry.ticketNumbers.length - 3}
                                  </span>
                                )}
                              </div>
                              {entry.quantity > 1 && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {entry.quantity} tickets
                                </p>
                              )}
                            </div>

                            <div className="hidden md:block w-px h-6 bg-border/50" />

                            {/* Name + location */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-foreground">
                                  {formatEntryName(entry)}
                                </span>
                                {entry.location && entry.showLocation && (
                                  <>
                                    <span className="text-muted-foreground/50">·</span>
                                    <span className="text-xs text-muted-foreground">
                                      {entry.location}
                                    </span>
                                  </>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {formatDate(entry.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {/* Load more */}
                        {hasMore && (
                          <div className="flex justify-center pt-4">
                            <Button
                              onClick={loadMore}
                              disabled={isLoadingMore}
                              variant="outline"
                              className="border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50 rounded-full px-8 transition-all"
                            >
                              {isLoadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Load More
                            </Button>
                          </div>
                        )}

                        <p className="text-center text-[10px] text-muted-foreground/60 pt-2">
                          Showing {entries.length} of {entriesTotal.toLocaleString()} entries — first names only
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}