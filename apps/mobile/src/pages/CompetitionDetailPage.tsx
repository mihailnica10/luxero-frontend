import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@luxero/api-client";
import type { ApiResponse, CompetitionDetail } from "@luxero/types";
import { useCart } from "@luxero/cart";
import { Button } from "@luxero/ui";
import { Ticket, ArrowLeft } from "lucide-react";

export function CompetitionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [competition, setCompetition] = useState<CompetitionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
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
      price: competition.price,
      quantity: 1,
      answerIndex: 0,
    });
    setTimeout(() => setAdding(false), 500);
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

      <div className="px-4 py-6 space-y-6">
        {/* Prize info */}
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <Ticket className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-xl font-bold">{competition.prizeTitle || competition.title}</h1>
          {competition.prizeValue > 0 && (
            <p className="text-gold text-lg font-semibold mt-1">Value: £{competition.prizeValue}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="font-semibold mb-2">About this competition</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {competition.description || competition.shortDescription}
          </p>
        </div>

        {/* Ticket info */}
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Price per ticket</p>
              <p className="text-2xl font-bold text-gold">£{competition.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Draw date</p>
              <p className="font-medium">{new Date(competition.drawDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/20">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets sold</span>
              <span>
                {competition.soldTickets}/{competition.totalTickets}
              </span>
            </div>
            <div className="mt-1.5 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full"
                style={{ width: `${(competition.soldTickets / competition.totalTickets) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add to cart */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToCart}
          disabled={adding || competition.status !== "active"}
        >
          {adding
            ? "Added!"
            : competition.status === "active"
              ? "Add to Cart — £" + competition.price
              : "Not Available"}
        </Button>
      </div>
    </div>
  );
}
