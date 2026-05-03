import { api } from "@luxero/api-client";
import type { ApiResponse, Category, Competition } from "@luxero/types";
import { Button, Skeleton } from "@luxero/ui";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CategorySection } from "../components/home/CategorySection";
import { CompetitionCard } from "../components/home/CompetitionCard";
import { HeroSlider } from "../components/home/HeroSlider";
import { WinnersShowcase } from "../components/home/WinnersShowcase";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [competitionsByCategory, setCompetitionsByCategory] = useState<
    Record<string, Competition[]>
  >({});
  const [endingSoon, setEndingSoon] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catsRes, compsRes] = await Promise.all([
          api.get<ApiResponse<Category[]>>("/api/categories"),
          api.get<ApiResponse<Competition[]>>("/api/competitions"),
        ]);

        const cats: Category[] = catsRes.data ?? [];
        setCategories(cats);

        const allComps = compsRes.data ?? [];

        // Ending soon: active competitions ending within 7 days
        const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
        const soon = allComps
          .filter((c) => {
            if (c.status !== "active" || !c.endDate) return false;
            return new Date(c.endDate).getTime() <= sevenDaysFromNow;
          })
          .sort((a, b) => {
            const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
            const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
            return dateA - dateB;
          })
          .slice(0, 8);
        setEndingSoon(soon);

        // Group by category
        const byCat: Record<string, Competition[]> = {};
        cats.forEach((cat) => {
          byCat[cat.slug] = [];
        });
        allComps.forEach((comp) => {
          if (comp.category && byCat[comp.category]) {
            byCat[comp.category].push(comp);
          }
        });
        setCompetitionsByCategory(byCat);
      } catch (err) {
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setIsLoading(false);
        setTimeout(() => setInitialLoading(false), 300);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Initial loading skeleton */}
        {initialLoading && (
          <div className="relative">
            {/* Hero skeleton — matches actual slide height */}
            <div className="w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[600px] lg:min-h-[700px] bg-muted overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-background to-gold/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                  <div className="max-w-2xl space-y-4">
                    <Skeleton className="h-6 w-28" shimmer />
                    <Skeleton className="h-12 w-4/5" shimmer />
                    <Skeleton className="h-12 w-3/5" shimmer />
                    <Skeleton className="h-4 w-full max-w-sm" shimmer />
                    <Skeleton className="h-4 w-3/4" shimmer />
                    <div className="flex gap-3 pt-2">
                      <Skeleton className="h-12 w-36" shimmer />
                      <Skeleton className="h-12 w-28" shimmer />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section skeletons */}
            <div className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
              <div className="max-w-7xl mx-auto">
                <Skeleton className="h-8 w-40 mb-8" shimmer />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-xl border border-gold/10 p-4">
                      <Skeleton className="h-40 w-full rounded-lg mb-3" shimmer />
                      <Skeleton className="h-5 w-3/4 mb-2" shimmer />
                      <Skeleton className="h-4 w-1/2 mb-3" shimmer />
                      <Skeleton className="h-4 w-3/5" shimmer />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Slider */}
        <HeroSlider />

        {/* Ending Soon Section */}
        {endingSoon.length > 0 && (
          <section
            data-section-id="ending-soon"
            className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-card/30 scroll-mt-48"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h2 className="font-sans text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Ending Soon
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Don&apos;t miss out on these competitions ending soon
                </p>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card rounded-xl border border-gold/10 p-4">
                      <Skeleton className="h-40 w-full rounded-lg mb-3" shimmer />
                      <Skeleton className="h-5 w-3/4 mb-2" shimmer />
                      <Skeleton className="h-4 w-1/2 mb-3" shimmer />
                      <Skeleton className="h-4 w-3/5" shimmer />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {endingSoon.map((comp) => (
                    <CompetitionCard key={comp.id} competition={comp} variant="compact" />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Per-Category Competition Sections */}
        {categories.map((category) => {
          const catComps = competitionsByCategory[category.slug] ?? [];
          if (catComps.length === 0) return null;
          return (
            <CategorySection
              key={category.id}
              title={category.label}
              competitions={catComps}
              categorySlug={category.slug}
              viewAllText="View All"
            />
          );
        })}

        {/* Winners Showcase */}
        <WinnersShowcase />

        {/* Premium Features Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/30 to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-none mb-3 sm:mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                  Built Different
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
                Transparency, fairness, and excitement — built into every competition.
              </p>
            </div>

            {/* Asymmetric Feature Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Large featured feature */}
              <div className="lg:col-span-2">
                <div className="h-full p-6 sm:p-8 md:p-12 rounded-2xl bg-card border border-gold/10 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.1)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gold" />
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                        Fairness &amp; Security
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                        Every draw is powered by a certified random number generator. No
                        manipulation, no hidden rules — just pure, verifiable fairness.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            Secure
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gold" />
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side features */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-card border border-gold/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                        Instant Payouts
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Win and receive your prize immediately. No delays, no excuses.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-card border border-gold/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                        Community First
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Join thousands of players who trust Luxero for fair, exciting competitions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium CTA Section */}
        <section className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-gold/10" />
          <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-gold/20 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center space-y-6 sm:space-y-8">
              <div className="inline-flex items-center justify-center space-x-3 mb-4 sm:mb-6">
                <Zap className="w-6 h-6 text-gold" />
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                  Ready to Win?
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
                Join thousands of players already trying their luck on premium prizes.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 md:pt-8 px-4">
                <Link to="/competitions" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-primary-foreground font-semibold px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300 hover:-translate-y-1 min-h-[52px]"
                  >
                    Browse Competitions
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>

                <Link to="/auth/sign-up" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-gold/30 text-foreground hover:bg-card hover:border-gold/50 px-8 sm:px-10 py-5 sm:py-6 md:py-7 text-base sm:text-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg min-h-[52px]"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-8 text-xs sm:text-sm text-muted-foreground pt-4 sm:pt-6 md:pt-8 px-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Random Draw</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>47,821+ Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                  <span>Verified Winners</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
