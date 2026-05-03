import { api } from "@luxero/api-client";
import { useAuth } from "@luxero/auth";
import type { ApiResponse } from "@luxero/types";
import { Button, ProtectedRoute, Skeleton } from "@luxero/ui";
import {
  ArrowRight,
  Gift,
  Package,
  Sparkles,
  Ticket,
  TrendingUp,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface Stats {
  activeEntries: number;
  totalWins: number;
  totalSpent: number;
  totalEntries: number;
}

interface Entry {
  _id: string;
  competitionId: {
    _id: string;
    title: string;
    prizeTitle?: string;
    prizeImageUrl?: string;
    imageUrl?: string;
    status: string;
    drawDate?: string;
    maxTickets: number;
    soldTickets: number;
    ticketPrice: number;
    slug: string;
  };
  ticketNumbers: number[];
  quantity: number;
}

interface Competition {
  _id: string;
  title: string;
  prizeTitle?: string;
  prizeValue: number;
  prizeImageUrl?: string;
  imageUrl?: string;
  status: string;
  drawDate?: string;
  maxTickets: number;
  soldTickets: number;
  ticketPrice: number;
  slug: string;
}

interface ReferralsData {
  referralCode: string | null;
  totalReferralCount: number;
}

// Double-bezel stat card
function StatCard({
  value,
  label,
  sublabel,
  variant = "default",
}: {
  value: string | number;
  label: string;
  sublabel?: string;
  variant?: "default" | "gold";
}) {
  return (
    <div
      className={`p-1.5 rounded-[2rem] ring-1 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] hover:-translate-y-0.5 ${
        variant === "gold"
          ? "bg-gold/5 ring-gold/20"
          : "bg-white/5 ring-white/10 dark:bg-black/5 dark:ring-black/10"
      }`}
    >
      <div
        className={`rounded-[calc(2rem-0.375rem)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
          variant === "gold" ? "bg-gradient-to-br from-card to-gold/5" : "bg-card"
        }`}
      >
        <p
          className={`text-4xl lg:text-5xl font-bold tracking-tight ${
            variant === "gold"
              ? "text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark"
              : "text-foreground"
          }`}
        >
          {value}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
        {sublabel && <p className="text-xs text-gold/60 mt-0.5 font-medium">{sublabel}</p>}
      </div>
    </div>
  );
}

// Win celebration banner
function WinCelebration({ winsCount }: { winsCount: number }) {
  if (winsCount === 0) return null;
  return (
    <div className="relative overflow-hidden rounded-[2rem]">
      <div className="p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20">
        <div className="relative rounded-[calc(2rem-0.375rem)] bg-gradient-to-br from-gold/20 via-card to-gold/5 p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -top-4 -right-4 w-24 h-24 opacity-10">
            <Trophy className="w-full h-full text-gold" />
          </div>
          <div className="relative flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/30">
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-gold/50 animate-ping" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-gold font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Congratulations!
              </span>
              <p className="text-lg md:text-xl font-bold text-foreground">
                You&apos;ve won {winsCount} prize{winsCount !== 1 ? "s" : ""}!
              </p>
              <p className="text-sm text-muted-foreground mt-1">Check your wins page for details</p>
            </div>
            <Link to="/dashboard/wins" className="flex-shrink-0">
              <Button
                size="sm"
                className="bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 font-semibold rounded-full px-5 group"
              >
                View
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Active entry row
function ActiveEntryRow({ entry }: { entry: Entry }) {
  const comp = entry.competitionId;
  if (!comp) return null;

  const soldPct = Math.round(((comp.soldTickets || 0) / (comp.maxTickets || 1)) * 100);
  const ticketCount = entry.ticketNumbers?.length || entry.quantity || 0;
  const imageUrl = comp.prizeImageUrl || comp.imageUrl;

  return (
    <div className="group p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:bg-gold/5 hover:ring-gold/30 transition-all duration-500">
      <Link
        to={`/competitions/${comp.slug || comp._id}`}
        className="flex items-center gap-4 rounded-[calc(1.5rem-0.375rem)] bg-card p-4 transition-all duration-500"
      >
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gold/20 to-gold/5">
          {imageUrl ? (
            <img src={imageUrl} alt={comp.title} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-gold/30" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">
            {comp.prizeTitle || comp.title}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Ticket className="w-3 h-3" />
              {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-muted-foreground">{soldPct}% sold</span>
          </div>
          <div className="h-1.5 bg-border/50 rounded-full overflow-hidden mt-2 max-w-[200px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
              style={{ width: `${Math.min(soldPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 hover:border-gold/40 rounded-full h-11 min-w-[90px] flex items-center justify-center px-4 text-xs font-semibold transition-all duration-300">
            Buy More
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}

// Hot competition mini card
function HotCompetitionCard({ comp }: { comp: Competition }) {
  const imageUrl = comp.prizeImageUrl || comp.imageUrl;
  const soldPct = Math.round(((comp.soldTickets || 0) / (comp.maxTickets || 1)) * 100);

  return (
    <Link to={`/competitions/${comp.slug || comp._id}`}>
      <div className="group p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:bg-gold/5 hover:ring-gold/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)]">
        <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden">
          <div className="relative h-32 bg-gradient-to-br from-gold/20 to-gold/5">
            {imageUrl ? (
              <img src={imageUrl} alt={comp.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-gold/20" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-gold/90 text-primary text-[10px] font-bold px-2 py-1 rounded-full">
              £{comp.ticketPrice.toFixed(2)}/ticket
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-foreground truncate group-hover:text-gold transition-colors">
              {comp.prizeTitle || comp.title}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-gold">
                £{comp.prizeValue.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">{soldPct}% sold</span>
            </div>
            <div className="h-1 bg-border/50 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark"
                style={{ width: `${soldPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Referral earn card
function ReferralCard({ code }: { code: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem]">
      <div className="p-1.5 rounded-[2rem] bg-black/5 ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <div className="relative rounded-[calc(2rem-0.375rem)] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-card to-gold/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5 sm:gap-6 p-6 md:p-8">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-7 h-7 text-gold" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                Refer Friends, Earn Tickets
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {code ? `Your code: ${code}` : "Share your code to earn bonus tickets"}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {code && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs font-sans bg-gold/10 text-gold px-4 py-2 rounded-full hover:bg-gold/20 transition-all border border-gold/20"
                >
                  {copied ? "Copied!" : code}
                </button>
              )}
              <Link to="/dashboard/referrals">
                <Button
                  size="sm"
                  className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-5 group"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    activeEntries: 0,
    totalWins: 0,
    totalSpent: 0,
    totalEntries: 0,
  });
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hotComps, setHotComps] = useState<Competition[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, entriesRes, compsRes, refsRes] = await Promise.all([
          api.get<ApiResponse<Stats>>("/api/me/stats").catch(() => null),
          api.get<ApiResponse<Entry[]>>("/api/me/entries").catch(() => null),
          api.get<ApiResponse<Competition[]>>("/api/competitions?status=active").catch(() => null),
          api.get<ApiResponse<ReferralsData>>("/api/me/referrals").catch(() => null),
        ]);

        if (statsRes) setStats(statsRes.data);
        if (entriesRes) setEntries(entriesRes.data || []);
        if (refsRes) setReferralCode(refsRes.data?.referralCode || null);

        if (compsRes?.data) {
          const enteredIds = new Set(entriesRes?.data?.map((e) => e.competitionId?._id) || []);
          const unentered = (compsRes.data as Competition[])
            .filter((c) => !enteredIds.has(c._id))
            .slice(0, 4);
          setHotComps(unentered);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const firstName = user?.fullName?.split(" ")[0] || user?.email?.split("@")[0] || "Player";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome banner skeleton */}
          <div className="rounded-[2rem] p-1.5 bg-gradient-to-br from-gold/10 via-card to-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(2rem-0.375rem)] px-6 py-8 md:px-10 md:py-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <Skeleton className="w-20 md:w-24 h-20 md:h-24 rounded-full" shimmer />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-24" shimmer />
                  <Skeleton className="h-10 w-64" shimmer />
                  <Skeleton className="h-5 w-full max-w-md" shimmer />
                  <div className="flex gap-3 mt-4">
                    <Skeleton className="h-11 w-44" shimmer />
                    <Skeleton className="h-11 w-36" shimmer />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats bento skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
              <Skeleton className="h-32 rounded-[2rem]" shimmer />
              <Skeleton className="h-32 rounded-[2rem]" shimmer />
              <div className="col-span-2">
                <Skeleton className="h-32 rounded-[2rem]" shimmer />
              </div>
            </div>
            <Skeleton className="h-64 rounded-[2rem]" shimmer />
          </div>
          {/* Active entries skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" shimmer />
            <Skeleton className="h-20 w-full rounded-[1.5rem]" shimmer />
            <Skeleton className="h-20 w-full rounded-[1.5rem]" shimmer />
            <Skeleton className="h-20 w-full rounded-[1.5rem]" shimmer />
          </div>
          {/* Hot competitions skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-48" shimmer />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-48 rounded-[1.5rem]" shimmer />
              <Skeleton className="h-48 rounded-[1.5rem]" shimmer />
              <Skeleton className="h-48 rounded-[1.5rem]" shimmer />
              <Skeleton className="h-48 rounded-[1.5rem]" shimmer />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const activeEntries = entries.filter((e) => e.competitionId?.status === "active");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-10">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="p-1.5 rounded-[2rem] bg-gradient-to-br from-gold/10 via-card to-gold/5 ring-1 ring-gold/20">
            <div className="relative rounded-[calc(2rem-0.375rem)] px-6 py-8 md:px-10 md:py-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center border-2 border-gold/30 shadow-xl shadow-gold/10">
                    <User className="w-10 h-10 md:w-12 md:h-12 text-gold" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-semibold bg-gold/10 px-3 py-1.5 rounded-full">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Dashboard
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                    Welcome back,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                      {firstName}
                    </span>
                  </h1>
                  <p className="text-muted-foreground mt-2 text-base md:text-lg max-w-xl">
                    Your next life-changing win is just a ticket away.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <Link to="/competitions">
                      <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6 py-2.5 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all group">
                        <Zap className="w-4 h-4 mr-2" />
                        Browse Competitions
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/dashboard/tickets">
                      <Button
                        variant="outline"
                        className="border-gold/30 text-foreground hover:bg-gold/10 hover:border-gold/50 rounded-full px-6 py-2.5 transition-all"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        My Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Win Celebration */}
        <WinCelebration winsCount={stats.totalWins} />

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 md:gap-6">
            <StatCard
              value={stats.activeEntries}
              label="Active Entries"
              sublabel="competitions entered"
            />
            <StatCard
              value={stats.totalWins}
              label="Total Wins"
              sublabel="prizes won"
              variant="gold"
            />
            <div className="col-span-2">
              <StatCard
                value={`£${(stats.totalSpent || 0).toFixed(0)}`}
                label="Total Spent"
                sublabel="on tickets"
              />
            </div>
          </div>

          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-5 h-full">
              <p className="text-sm font-semibold text-foreground mb-4">Quick Links</p>
              <div className="space-y-2">
                {[
                  { href: "/dashboard/orders", label: "My Orders", icon: Package },
                  { href: "/dashboard/wins", label: "My Wins", icon: Trophy },
                  { href: "/dashboard/referrals", label: "Referrals", icon: Gift },
                  { href: "/dashboard/profile", label: "Profile", icon: User },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} to={item.href}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gold/10 transition-all duration-300 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-gold/20 transition-all">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                          {item.label}
                        </span>
                        <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Active Entries */}
        {activeEntries.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-5 h-5 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-semibold">
                    Your Entries
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  Active Entries
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeEntries.length} competition{activeEntries.length !== 1 ? "s" : ""}{" "}
                  you&apos;re in
                </p>
              </div>
              <Link to="/dashboard/tickets" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground gap-2 group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {activeEntries.map((entry) => (
                <ActiveEntryRow key={entry._id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Hot Right Now */}
        {hotComps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-semibold">
                    Trending
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                  Hot Right Now
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  You haven&apos;t entered these yet
                </p>
              </div>
              <Link to="/competitions" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground gap-2 group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotComps.map((comp) => (
                <HotCompetitionCard key={comp._id} comp={comp} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {activeEntries.length === 0 && hotComps.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20 mb-6">
              <div className="w-20 h-20 rounded-[calc(2rem-0.375rem)] bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Zap className="w-10 h-10 text-gold/60" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Play?</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Browse our active competitions and get your tickets for a chance to win incredible
              prizes
            </p>
            <Link to="/competitions">
              <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-8 py-3 shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 transition-all group">
                Browse Competitions
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        )}

        {/* Referral Card */}
        <ReferralCard code={referralCode} />
      </main>
      <Footer />
    </div>
  );
}

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
