import { PartyPopper, Ticket, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Card, CardContent } from "@luxero/ui";

export function CheckoutSuccessPage() {
  const location = useLocation();
  const orderId = location.state?.orderId as string | undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-lg">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-6 animate-in">
            <PartyPopper className="w-12 h-12 text-gold" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-3">Purchase Complete!</h1>
          <p className="text-muted-foreground text-lg mb-2">
            Your order has been confirmed and your tickets are now active.
          </p>
          {orderId && (
            <p className="text-sm font-mono text-muted-foreground mb-8">
              Order ID: {orderId.slice(-8)}
            </p>
          )}

          {/* What happens next */}
          <Card className="border-gold/20 mb-8 text-left">
            <CardContent className="p-6 space-y-3">
              <h2 className="font-semibold">What's Next?</h2>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Your tickets are confirmed</p>
                    <p className="text-xs text-muted-foreground">
                      Check your dashboard to see your ticket numbers
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Wait for the draw</p>
                    <p className="text-xs text-muted-foreground">
                      The winner will be selected randomly when the competition ends
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <PartyPopper className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Win and celebrate!</p>
                    <p className="text-xs text-muted-foreground">
                      If you're lucky, we'll notify you and arrange prize delivery
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard/tickets">
              <Button variant="outline" className="btn-luxury-outline">
                View My Tickets
              </Button>
            </Link>
            <Link to="/competitions">
              <Button className="btn-luxury">Browse More Competitions</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
