import { ArrowLeft, CheckCircle, ChevronDown, Clock, Copy, HelpCircle, Ticket, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { Skeleton } from "@luxero/ui";
import { api } from "@luxero/api-client";
import { useCart } from "@luxero/cart";
import type { ApiResponse, Competition } from "@luxero/types";
import { cn } from "@luxero/utils";
import { useMemo } from "react";

interface CompetitionRelated {
  _id: string;
  slug: string;
  title: string;
  prizeTitle?: string;
  prizeValue?: number;
  prizeImageUrl?: string;
  imageUrl?: string;
  ticketPrice?: number;
  ticketsSold?: number;
  maxTickets?: number;
}

export function CompetitionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [related, setRelated] = useState<CompetitionRelated[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const mapComp = (c: any): Competition => ({
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
  });

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        const res = await api.get<ApiResponse<Competition>>(`/api/competitions/${slug}`);
        const comp = mapComp(res.data);
        setCompetition(comp);

        // Fetch related competitions (same category, exclude self)
        if (comp.category) {
          try {
            const relatedRes = await api.get<ApiResponse<CompetitionRelated[]>>(
              `/api/competitions?category=${encodeURIComponent(comp.category)}&exclude=${comp.id}&limit=4`
            );
            if (relatedRes.data) setRelated(relatedRes.data);
          } catch {
            // ignore
          }
        }
      } catch (_err) {
        setError("Failed to load competition");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    const endDate = competition?.endDate ?? competition?.drawDate;
    if (!endDate) return;

    function updateCountdown() {
      const draw = new Date(endDate!).getTime();
      const now = Date.now();
      const diff = draw - now;

      if (diff <= 0) {
        setCountdown("Draw announced");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m`);
      } else {
        setCountdown(`${minutes}m`);
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [competition]);

  function handleAddToCart() {
    if (!competition) return;
    addItem({
      competitionId: competition.id,
      competitionTitle: competition.title,
      price: competition.ticketPrice ?? competition.price ?? 0,
      quantity,
      answerIndex: 0,
    });
    navigate("/cart");
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const maxQty = competition?.maxTicketsPerUser ?? 10;

  const faqs = useMemo(() => [
    { question: "How do I enter this competition?", answer: "Select the number of tickets you wish to purchase using the +/- buttons, then click 'Add to Cart' to proceed to checkout. You'll receive your ticket numbers via email once the transaction is complete." },
    { question: "How is the winner selected?", answer: "When all tickets are sold or the countdown ends, a winner is selected using a verified random number generator (RNG). The winning ticket is chosen from the full range of available ticket numbers." },
    { question: "When will the draw take place?", answer: competition?.drawDate
      ? `The draw is scheduled for ${new Date(competition.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
      : "The draw date will be announced once all tickets are sold." },
    { question: "How will I know if I've won?", answer: "The winner will be notified by email at the address used during purchase. Winner's names are also published on our Winners page." },
    { question: "How long does prize delivery take?", answer: "Once the winner has been verified, prizes are typically dispatched within 14 working days. UK deliveries usually arrive within 5-7 working days." },
  ], [competition]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-[2rem]" shimmer />
            <div className="space-y-6">
              <div><Skeleton className="h-6 w-40 mb-3" shimmer /><Skeleton className="h-10 w-full mb-2" shimmer /><Skeleton className="h-5 w-3/4" shimmer /></div>
              <Skeleton className="h-24 w-full rounded-xl" shimmer />
              <Skeleton className="h-40 w-full rounded-xl" shimmer />
              <Skeleton className="h-4 w-full" shimmer /><Skeleton className="h-4 w-3/4" shimmer /><Skeleton className="h-4 w-1/2" shimmer />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Competition Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "This competition doesn't exist."}</p>
            <Button onClick={() => navigate("/competitions")} className="bg-gold hover:bg-gold-dark text-primary-foreground">
              Browse Competitions
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalTickets = competition.maxTickets ?? competition.totalTickets ?? 0;
  const soldTickets = competition.ticketsSold ?? 0;
  const availableTickets = totalTickets - soldTickets;
  const progress = totalTickets > 0 ? Math.round((soldTickets / totalTickets) * 100) : 0;
  const ticketPrice = competition.ticketPrice ?? competition.price ?? 0;
  const totalPrice = quantity * ticketPrice;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/competitions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Competitions
          </Link>
        </div>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Prize Image */}
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="p-1.5 rounded-[2rem] bg-gradient-to-br from-gold/10 to-gold/5 ring-1 ring-gold/20">
                <div className="rounded-[calc(2rem-0.375rem)] aspect-square overflow-hidden bg-card">
                  {competition.imageUrl || competition.prizeImageUrl ? (
                    <img
                      src={competition.imageUrl || competition.prizeImageUrl}
                      alt={competition.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                      <Trophy className="w-24 h-24 text-gold/40" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-gold border-gold/30 font-medium">
                  {competition.status.toUpperCase()}
                </Badge>
                {competition.category && (
                  <Badge variant="outline" className="border-gold/20 text-muted-foreground capitalize">
                    {competition.category.replace(/-/g, " ")}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {competition.title}
              </h1>

              {/* Short Description */}
              {competition.shortDescription && (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {competition.shortDescription}
                </p>
              )}

              {/* Countdown */}
              {countdown && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold font-semibold text-sm">
                  <Clock className="w-4 h-4" />
                  {countdown} remaining
                </div>
              )}

              {/* Prize Value + Progress */}
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Prize Value</p>
                        <p className="text-3xl font-bold text-gold">
                          £{(competition.prizeValue ?? 0).toLocaleString()}
                        </p>
                      </div>
                      {competition.prizeTitle && (
                        <p className="text-sm font-semibold text-foreground">{competition.prizeTitle}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{progress}% Sold</span>
                        <span className="text-muted-foreground">{availableTickets.toLocaleString()} left</span>
                      </div>
                      <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-700",
                            progress >= 75
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                              : progress >= 50
                                ? "bg-gradient-to-r from-gold to-amber-400"
                                : "bg-gradient-to-r from-gold/80 to-gold"
                          )}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Selector */}
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Ticket Price</p>
                        <p className="text-2xl font-bold text-gold">£{ticketPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Max {maxQty} per person</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-3">Number of Tickets</p>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 border-gold/20 hover:bg-gold/10"
                          >
                            −
                          </Button>
                          <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                            className="w-10 h-10 border-gold/20 hover:bg-gold/10"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gold/10">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-gold">£{totalPrice.toFixed(2)}</span>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full py-3 text-base shadow-lg shadow-gold/20"
                        onClick={handleAddToCart}
                      >
                        <Ticket className="w-5 h-5 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                {competition.drawDate && (
                  <div className="bg-card/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Draw Date</p>
                    <p className="text-sm font-semibold">
                      {new Date(competition.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                )}
                <div className="bg-card/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Tickets</p>
                  <p className="text-sm font-semibold">{totalTickets.toLocaleString()}</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gold/20 hover:bg-gold/10 font-medium"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/20 hover:bg-gold/10"
                  asChild
                >
                  <a
                    href={`https://twitter.com/intent/tweet?text=I just entered to win ${encodeURIComponent(competition.title)} on Luxero!&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" /></svg>
                    Share
                  </a>
                </Button>
                              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {competition.description && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
                  <h2 className="text-xl font-bold text-foreground mb-4">About This Competition</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{competition.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative overflow-hidden rounded-[2rem]">
            <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
              <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border border-white/5 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gold/5 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="font-medium text-foreground flex-1 pr-4">{faq.question}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                            openFaqIndex === i && "rotate-180"
                          )}
                        />
                      </button>
                      {openFaqIndex === i && (
                        <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Competitions */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((comp) => {
                const soldPct = comp.maxTickets
                  ? Math.round(((comp.ticketsSold ?? 0) / comp.maxTickets) * 100)
                  : 0;
                return (
                  <Link
                    key={comp._id}
                    to={`/competitions/${comp.slug}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:ring-gold/30 transition-all duration-500">
                        <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden">
                          <div className="aspect-square bg-gradient-to-br from-gold/10 to-gold/5 relative">
                            {comp.prizeImageUrl || comp.imageUrl ? (
                              <img src={comp.prizeImageUrl || comp.imageUrl} alt={comp.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Trophy className="w-10 h-10 text-gold/30" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-foreground text-sm truncate group-hover:text-gold transition-colors">
                              {comp.prizeTitle || comp.title}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-gold font-bold text-sm">£{((comp.ticketPrice ?? 0)).toFixed(2)}</span>
                              <span className="text-xs text-muted-foreground">{soldPct}% sold</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}