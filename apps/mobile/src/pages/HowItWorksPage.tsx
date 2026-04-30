import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, CreditCard, Search, Ticket, Trophy } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Competitions",
    description: "Explore our luxury competitions and find a prize that excites you.",
    number: 1,
  },
  {
    icon: Ticket,
    title: "Select Your Tickets",
    description: "Choose how many tickets you'd like — more tickets increase your chances of winning.",
    number: 2,
  },
  {
    icon: CreditCard,
    title: "Complete Purchase",
    description: "Quick and secure checkout with card, Apple Pay or Google Pay.",
    number: 3,
  },
  {
    icon: Trophy,
    title: "Win & Celebrate",
    description: "Winners are notified by email and prizes dispatched within 14 working days.",
    number: 4,
  },
];

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold">How It Works</span>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            How <span className="text-gold">Luxero</span> Works
          </h1>
          <p className="text-muted-foreground text-sm">
            Getting started is easy. Follow these steps to enter our luxury prize competitions.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-black/5 ring-1 ring-black/5">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0">
                      <step.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gold px-2 py-0.5 rounded-full bg-gold/10">
                          Step {step.number}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee badge */}
        <div className="mt-6 relative overflow-hidden rounded-[1.5rem]">
          <div className="p-1.5 rounded-[1.5rem] bg-gradient-to-br from-gold/20 to-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Verified Random Draws</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Every winner is selected using certified random number generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link
            to="/competitions"
            className="block w-full py-3.5 bg-gold text-primary-foreground font-semibold text-center rounded-xl shadow-lg shadow-gold/30 active:scale-[0.98] transition-transform"
          >
            Browse Competitions
          </Link>
        </div>
      </div>
    </div>
  );
}