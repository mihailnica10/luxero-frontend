import { api } from "@luxero/api-client";
import { useCart } from "@luxero/cart";
import type { ApiResponse, Competition } from "@luxero/types";
import { Badge, Button, Skeleton } from "@luxero/ui";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  HelpCircle,
  Shield,
  ShoppingCart,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

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

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculateTimeLeft() {
      const difference = new Date(targetDate).getTime() - Date.now();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Minutes" },
        { value: timeLeft.seconds, label: "Seconds" },
      ].map((item) => (
        <div key={item.label} className="bg-card border border-gold/20 rounded-lg p-3">
          <div className="text-2xl font-bold text-gold">
            {item.value.toString().padStart(2, "0")}
          </div>
          <div className="text-xs text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export function CompetitionDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [related, setRelated] = useState<CompetitionRelated[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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

  function handleAddToCart() {
    if (!competition) return;

    setIsAdding(true);

    addItem({
      competitionId: competition.id,
      competitionTitle: competition.title,
      price: competition.ticketPrice ?? competition.price ?? 0,
      quantity,
      answerIndex: 0,
    });

    setTimeout(() => {
      setIsAdding(false);
      navigate("/cart");
    }, 1000);
  }

  const maxQty = competition?.maxTicketsPerUser ?? 10;

  const maxTickets = competition?.maxTickets ?? 0;
  const ticketsSold = competition?.ticketsSold ?? 0;
  const ticketsRemaining = maxTickets - ticketsSold;
  const totalPrice = quantity * (competition?.ticketPrice ?? competition?.price ?? 0);

  const existingCartItem = items.find((item) => item.competitionId === competition?.id);
  const currentInCart = existingCartItem?.quantity ?? 0;

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: {
      label: "Live Now",
      className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    ended: { label: "Ended", className: "bg-muted/20 text-muted-foreground border-border" },
    coming: { label: "Coming Soon", className: "bg-gold/20 text-gold border-gold/30" },
  };

  const faqs = [
    {
      question: "How do I enter this competition?",
      answer:
        "Select the number of tickets you wish to purchase, answer the qualifying question, then click 'Add to Cart' to proceed to checkout.",
    },
    {
      question: "How is the winner selected?",
      answer:
        "When all tickets are sold or the countdown ends, a winner is selected using a verified random number generator (RNG).",
    },
    {
      question: "When will the draw take place?",
      answer: competition?.drawDate
        ? `The draw is scheduled for ${new Date(competition.drawDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
        : "The draw date will be announced once all tickets are sold.",
    },
    {
      question: "How will I know if I've won?",
      answer:
        "The winner will be notified by email at the address used during purchase. Winner's names are also published on our Winners page.",
    },
    {
      question: "How long does prize delivery take?",
      answer:
        "Once the winner has been verified, prizes are typically dispatched within 14 working days.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-[2rem]" shimmer />
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-40 mb-3" shimmer />
                <Skeleton className="h-10 w-full mb-2" shimmer />
                <Skeleton className="h-5 w-3/4" shimmer />
              </div>
              <Skeleton className="h-24 w-full rounded-xl" shimmer />
              <Skeleton className="h-40 w-full rounded-xl" shimmer />
              <Skeleton className="h-4 w-full" shimmer />
              <Skeleton className="h-4 w-3/4" shimmer />
              <Skeleton className="h-4 w-1/2" shimmer />
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
            <p className="text-muted-foreground mb-4">
              {error || "This competition doesn't exist."}
            </p>
            <Button
              onClick={() => navigate("/competitions")}
              className="bg-gold hover:bg-gold-dark text-primary-foreground"
            >
              Browse Competitions
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = competition.prizeImageUrl
    ? [competition.prizeImageUrl]
    : competition.imageUrl
      ? [competition.imageUrl]
      : [];

  const progress = maxTickets > 0 ? (ticketsSold / maxTickets) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/competitions" className="hover:text-foreground transition-colors">
              Competitions
            </Link>
            <span>/</span>
            <span className="text-foreground truncate">{competition.title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl border border-gold/20 overflow-hidden">
                {images.length > 0 && images[currentImageIndex] ? (
                  <img
                    src={images[currentImageIndex]}
                    alt={competition.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-24 h-24 text-gold/40" />
                  </div>
                )}

                {/* Image navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                      }
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={() =>
                        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                      }
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Status badge */}
                <Badge
                  className={`absolute top-4 left-4 ${statusConfig[competition.status]?.className ?? statusConfig.active.className}`}
                >
                  {statusConfig[competition.status]?.label ?? "Active"}
                </Badge>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((_, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg border-2 bg-gradient-to-br from-gold/20 to-gold/5 flex-shrink-0 transition-all ${
                        idx === currentImageIndex
                          ? "border-gold"
                          : "border-border hover:border-gold/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Description */}
              {competition.description && (
                <div className="relative overflow-hidden rounded-[1.5rem]">
                  <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                    <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
                      <h3 className="font-semibold text-foreground mb-3 text-gold">
                        About This Prize
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {competition.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details & Purchase */}
            <div className="space-y-6">
              {/* Title & Prize */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {competition.title}
                </h1>
                {competition.shortDescription && (
                  <p className="text-lg text-muted-foreground mb-4">
                    {competition.shortDescription}
                  </p>
                )}
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gold">
                    £{competition.prizeValue?.toLocaleString()}
                  </div>
                  <span className="text-muted-foreground">cash equivalent</span>
                </div>
              </div>

              {/* Countdown */}
              {competition.drawDate && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold" />
                    <span className="font-medium text-foreground">Draw Countdown</span>
                  </div>
                  <CountdownTimer targetDate={competition.drawDate} />
                </div>
              )}

              {/* Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" />
                    <span className="font-medium text-foreground">Ticket Sales</span>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {ticketsRemaining.toLocaleString()} remaining
                  </span>
                </div>
                <div className="h-3 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-light to-gold rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{ticketsSold.toLocaleString()} sold</span>
                  <span>{progress.toFixed(1)}% complete</span>
                </div>
              </div>

              {/* Ticket Purchase Card */}
              <div className="relative overflow-hidden rounded-[1.5rem]">
                <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 space-y-6">
                    {/* Quantity Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="border-gold/30 hover:bg-gold/10"
                          >
                            <span>−</span>
                          </Button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 1;
                              setQuantity(Math.max(1, Math.min(maxQty, val)));
                            }}
                            min={1}
                            max={maxQty}
                            className="w-20 text-center text-lg font-semibold bg-input border border-border rounded-lg py-2"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                            disabled={quantity >= maxQty}
                            className="border-gold/30 hover:bg-gold/10"
                          >
                            <span>+</span>
                          </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          £{(competition.ticketPrice ?? 0).toFixed(2)} per ticket
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Quick add:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 25, 50, 100].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setQuantity(Math.min(maxQty, quantity + amount))}
                            disabled={quantity + amount > maxQty}
                            className="text-xs border-gold/30 hover:border-gold/50 hover:bg-gold/10"
                          >
                            +{amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-4 border-t border-b border-gold/10">
                      <span className="text-lg font-medium text-foreground">Total</span>
                      <span className="text-3xl font-bold text-gold">£{totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={competition.status !== "active" || isAdding}
                      className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold h-14 text-lg rounded-full"
                    >
                      {isAdding ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>

                    {currentInCart > 0 && (
                      <p className="text-center text-sm text-gold">
                        {currentInCart} ticket(s) already in cart
                      </p>
                    )}

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-4 pt-4 border-t border-gold/10">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="w-4 h-4" />
                        Secure Payment
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Ticket className="w-4 h-4" />
                        Verified Draw
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-gold" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border border-white/5 rounded-xl p-5">
                        <p className="font-medium text-foreground mb-2">{faq.question}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
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
                    <Link key={comp._id} to={`/competitions/${comp.slug}`} className="group block">
                      <div className="relative overflow-hidden rounded-[1.5rem]">
                        <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:ring-gold/30 transition-all duration-500">
                          <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden">
                            <div className="aspect-square bg-gradient-to-br from-gold/10 to-gold/5 relative">
                              {comp.prizeImageUrl || comp.imageUrl ? (
                                <img
                                  src={comp.prizeImageUrl || comp.imageUrl}
                                  alt={comp.title}
                                  className="w-full h-full object-cover"
                                />
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
                                <span className="text-gold font-bold text-sm">
                                  £{(comp.ticketPrice ?? 0).toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {soldPct}% sold
                                </span>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
