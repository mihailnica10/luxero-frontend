import { Check, Copy, Gift, Mail, Share2, Ticket, TrendingUp, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { ProtectedRoute } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

interface Referral {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  count: number;
}

interface ReferralsData {
  referralCode: string | null;
  totalReferralCount: number;
  activeReferralCount: number;
  tierTickets: number;
  referralsToNextTier: number;
  pendingTickets: number;
  totalAwardedTickets: number;
  recentReferrals: Referral[];
  leaderboard: LeaderboardEntry[];
}

function ReferralsContent() {
  const [data, setData] = useState<ReferralsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<ReferralsData>>("/api/me/referrals")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to load referrals:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCopyCode = async () => {
    if (!data?.referralCode) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (!data?.referralCode) return;
    const url = `${window.location.origin}/auth/sign-up?ref=${data.referralCode}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Luxero - Win Amazing Prizes",
          text: `Use my referral code ${data.referralCode} to sign up!`,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const shareLinks = data?.referralCode
    ? {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`Join Luxero and win amazing prizes! Use my code ${data.referralCode} to sign up: ${window.location.origin}/auth/sign-up?ref=${data.referralCode}`)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join @Luxero and win amazing prizes! Use my code ${data.referralCode} to sign up.`)}&url=${encodeURIComponent(`${window.location.origin}/auth/sign-up?ref=${data.referralCode}`)}`,
        email: `mailto:?subject=${encodeURIComponent("Join Luxero - Win Amazing Prizes")}&body=${encodeURIComponent(`Hey!\n\nJoin Luxero and win amazing prizes. Use my referral code ${data.referralCode} when you sign up.\n\n${window.location.origin}/auth/sign-up?ref=${data.referralCode}`)}`,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Back link placeholder */}
          <Skeleton className="h-4 w-40" shimmer />
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" shimmer />
            <Skeleton className="h-10 w-80" shimmer />
            <Skeleton className="h-4 w-full max-w-md" shimmer />
          </div>
          {/* Referral code hero */}
          <Skeleton className="h-64 w-full rounded-2xl" shimmer />
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" shimmer />
            ))}
          </div>
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" shimmer />
            ))}
          </div>
          {/* Referral list */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" shimmer />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" shimmer />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Failed to load referrals</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Back link */}
        <div>
          <Link to="/dashboard" className="text-sm text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80 font-medium bg-gold/10 px-3 py-1 rounded-full">
              Referral Program
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Refer Friends,{" "}
            <span className="text-gold-gradient">Earn Tickets</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your code and earn tickets based on your referral activity
          </p>
        </div>

        {/* Referral Code Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-gold/5 p-6 md:p-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-gold" />
            </div>
            <p className="text-sm text-muted-foreground mb-3">Your Referral Code</p>
            {data.referralCode ? (
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="text-3xl md:text-4xl font-bold tracking-wider border border-gold/20 bg-card/80 px-6 py-3 rounded-xl">
                  {data.referralCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-10 h-10 rounded-xl bg-gold/10 hover:bg-gold/20 flex items-center justify-center transition-colors text-gold"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <p className="text-lg text-muted-foreground mb-6">Generating your code...</p>
            )}

            {/* Share Buttons */}
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={handleShare}
                className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </Button>
              {shareLinks && (
                <>
                  <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-gold/30 hover:bg-gold/10 h-10 w-10">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="WhatsApp">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </Button>
                  </a>
                  <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="border-gold/30 hover:bg-gold/10 h-10 w-10">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-label="X">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </Button>
                  </a>
                  <a href={shareLinks.email}>
                    <Button variant="outline" size="icon" className="border-gold/30 hover:bg-gold/10 h-10 w-10">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-gold/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Referral Tier Progress</h3>
              <p className="text-xs text-muted-foreground">
                {data.activeReferralCount} active referrals (last 30 days)
              </p>
            </div>
          </div>

          {/* Tier steps */}
          <div className="flex items-center gap-2 mb-4">
            {[
              { threshold: 5, tickets: 2, label: "5 referrals" },
              { threshold: 10, tickets: 5, label: "10 referrals" },
              { threshold: 15, tickets: 10, label: "15 referrals" },
            ].map((tier, i) => {
              const isAchieved = data.activeReferralCount >= tier.threshold;
              const isCurrent =
                !isAchieved &&
                (i === 0
                  ? data.activeReferralCount > 0
                  : data.activeReferralCount >= [5, 10, 15][i - 1]);

              return (
                <div key={tier.threshold} className="flex-1 text-center">
                  <div
                    className={`h-3 rounded-full mb-2 ${
                      isAchieved ? "bg-gold"
                      : isCurrent ? "bg-gold/50"
                      : "bg-border"
                    }`}
                  />
                  <p className="text-[10px] font-medium text-muted-foreground">{tier.tickets} tickets</p>
                  <p className="text-[9px] text-muted-foreground/60">{tier.label}</p>
                </div>
              );
            })}
          </div>

          {data.referralsToNextTier > 0 ? (
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-gold">{data.referralsToNextTier}</span> more
              active referrals to unlock{" "}
              <span className="font-medium text-gold">
                {data.activeReferralCount < 10 ? 5 : data.activeReferralCount < 15 ? 10 : 0} tickets
              </span>
            </p>
          ) : (
            <p className="text-xs text-muted-foreground text-center">
              You&apos;ve reached the highest tier! Keep referring for more rewards.
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="border-gold/20">
            <CardContent className="p-4 md:p-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                <Users className="w-4 h-4 text-gold" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">{data.activeReferralCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Active (30d)</p>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardContent className="p-4 md:p-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                <Ticket className="w-4 h-4 text-gold" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gold">{data.tierTickets}</p>
              <p className="text-xs text-muted-foreground mt-1">Tickets per Competition</p>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardContent className="p-4 md:p-5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                <Check className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">{data.totalAwardedTickets}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Awarded</p>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardContent className="p-4 md:p-5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                <Gift className="w-4 h-4 text-gold" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">{data.totalReferralCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Referred</p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                icon: Share2,
                title: "Share Your Code",
                description: "Send your unique referral code to friends via WhatsApp, email, or social media",
              },
              {
                step: "02",
                icon: Users,
                title: "Friend Purchases",
                description: "When your referred friend buys tickets within 30 days, they count as active",
              },
              {
                step: "03",
                icon: Ticket,
                title: "You Earn Tickets",
                description: "Earn 2-10 tickets per competition based on your tier (5, 10, or 15 active referrals)",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-border/50 bg-card/50 p-5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
                  Step {item.step}
                </span>
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mt-3 mb-3">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-sm font-bold mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Referrals */}
        {data.recentReferrals.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">Recent Referrals</h2>
            <div className="space-y-2">
              {data.recentReferrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3"
                >
                  <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-xs font-bold text-gold flex-shrink-0">
                    {ref.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ref.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Joined {new Date(ref.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {data.tierTickets > 0 && (
                    <span className="text-xs font-medium text-gold flex items-center gap-1">
                      <Ticket className="w-3 h-3" />
                      {data.tierTickets} tickets earned
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leaderboard */}
        {data.leaderboard.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              Top Referrers
            </h2>
            <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden">
              {data.leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="flex items-center gap-4 px-4 py-3 border-b border-border/30 last:border-0"
                >
                  <span
                    className={`text-sm font-bold w-6 text-center ${
                      entry.rank === 1 ? "text-gold"
                      : entry.rank === 2 ? "text-muted-foreground"
                      : entry.rank === 3 ? "text-amber-700"
                      : "text-muted-foreground/50"
                    }`}
                  >
                    {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{entry.count}</p>
                    <p className="text-[10px] text-muted-foreground">referrals</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export function DashboardReferralsPage() {
  return (
    <ProtectedRoute>
      <ReferralsContent />
    </ProtectedRoute>
  );
}