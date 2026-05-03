import { api } from "@luxero/api-client";
import { useCart } from "@luxero/cart";
import type { ApiResponse, CompetitionDetail } from "@luxero/types";
import { Button } from "@luxero/ui";
import { ArrowLeft, Check, Minus, Plus, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export function CompetitionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    api
      .get<ApiResponse<CompetitionDetail>>(`/api/competitions/${slug}`)
      .then((res) => setCompetition(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  function handleAddToCart() {
    if (!competition) return;
    setAdding(true);
    addItem({
      competitionId: competition.id,
      competitionTitle: competition.title,
      price: competition.price ?? competition.ticketPrice,
      quantity,
      answerIndex: 0,
    });
    setTimeout(() => setAdding(false), 800);
  }

  function getStatusBadge() {
    if (!competition) return null;
    const soldRatio = competition.soldTickets / competition.totalTickets;
    if (soldRatio >= 1) {
      return { label: "SOLD OUT", className: "bg-muted text-muted-foreground" };
    }
    if (
      competition.status === "ended" ||
      competition.status === "drawn" ||
      competition.status === "cancelled"
    ) {
      return { label: "ENDED", className: "bg-muted text-muted-foreground" };
    }
    if (competition.status === "active") {
      return { label: "LIVE", className: "bg-gold text-primary-foreground" };
    }
    return { label: competition.status.toUpperCase(), className: "bg-muted text-muted-foreground" };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <p className="text-muted-foreground">Competition not found</p>
        <Link to="/competitions" className="mt-4 text-gold text-sm hover:underline">
          Back to competitions
        </Link>
      </div>
    );
  }

  const status = getStatusBadge();
  const soldRatio = competition.soldTickets / competition.totalTickets;
  const isSoldOut = soldRatio >= 1;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link to="/competitions" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-medium text-sm truncate">{competition.title}</span>
        </div>
      </header>

      <div className="pb-32">
        {/* Image Gallery Placeholder */}
        <div className="relative">
          <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1209] via-[#2d1f0e] to-[#1a1209] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gold/10 flex items-center justify-center">
                <Ticket className="w-10 h-10 text-gold/40" />
              </div>
            </div>
            {/* Gold border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />
          </div>
          {/* Status Badge */}
          {status && (
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>
          )}
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Prize info */}
          <div className="text-center">
            <h1 className="text-xl font-bold">{competition.prizeTitle || competition.title}</h1>
            {competition.prizeValue > 0 && (
              <p className="text-gold text-lg font-semibold mt-1">
                Prize Value: £{competition.prizeValue}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="relative overflow-hidden rounded-[1rem]">
            <div className="p-1.5 rounded-[1rem] bg-black/5 ring-1 ring-black/5">
              <div className="rounded-[calc(1rem-0.25rem)] bg-card p-4">
                <h2 className="font-semibold mb-2">About this competition</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {competition.description || competition.shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket info & Progress */}
          <div className="relative overflow-hidden rounded-[1rem]">
            <div className="p-1.5 rounded-[1rem] bg-black/5 ring-1 ring-black/5">
              <div className="rounded-[calc(1rem-0.25rem)] bg-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Price per ticket</p>
                    <p className="text-2xl font-bold text-gold">
                      £{competition.price ?? competition.ticketPrice}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Draw date</p>
                    <p className="font-medium text-sm">
                      {competition.drawDate
                        ? new Date(competition.drawDate).toLocaleDateString()
                        : "TBA"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tickets sold</span>
                    <span className="font-medium">
                      {competition.soldTickets}/{competition.totalTickets}
                    </span>
                  </div>
                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${soldRatio * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {competition.totalTickets - competition.soldTickets} tickets remaining
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Quantity Selector */}
          {!isSoldOut && competition.status === "active" && (
            <div className="relative overflow-hidden rounded-[1rem]">
              <div className="p-1.5 rounded-[1rem] bg-black/5 ring-1 ring-black/5">
                <div className="rounded-[calc(1rem-0.25rem)] bg-card p-4">
                  <h2 className="font-semibold mb-3 text-sm">Select Quantity</h2>
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-3xl font-bold">{quantity}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">tickets</p>
                    </div>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      disabled={quantity >= 10}
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/20 flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-gold">
                      £{((competition.price ?? competition.ticketPrice) * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Add to Cart Bar */}
      {!isSoldOut && competition.status === "active" && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-border/20 p-4 z-50">
          <Button
            className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold shadow-lg shadow-gold/30"
            size="lg"
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Added to Cart!
              </span>
            ) : (
              `Add to Cart — £${((competition.price ?? competition.ticketPrice) * quantity).toFixed(2)}`
            )}
          </Button>
        </div>
      )}

      {isSoldOut && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-border/20 p-4 z-50">
          <Button className="w-full" size="lg" disabled>
            Sold Out
          </Button>
        </div>
      )}
    </div>
  );
}
