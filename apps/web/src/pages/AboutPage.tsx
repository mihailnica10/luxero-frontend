import { ArrowRight, CheckCircle, Shield, Heart, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";

const features = [
  {
    title: "Fairness First",
    description: "Every draw uses certified random number generation for complete transparency.",
    icon: Shield,
  },
  {
    title: "Instant Payouts",
    description: "Win and receive your prize immediately. No delays, no excuses.",
    icon: CheckCircle,
  },
  {
    title: "Verified Winners",
    description: "All winners are verified and publicly announced. Real people, real prizes.",
    icon: Trophy,
  },
  {
    title: "Community Driven",
    description: "Join thousands of players who trust Luxero for fair, exciting competitions.",
    icon: Heart,
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Luxero
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re on a mission to make luxury accessible to everyone through fair, transparent prize competitions.
          </p>
        </div>

        {/* Story */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Luxero was founded with a simple belief: everyone deserves a chance to win amazing prizes. We curate exclusive luxury items and offer them at accessible ticket prices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Every competition is conducted with complete transparency, using certified random number generation to ensure fairness for all participants.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Why Choose Luxero</h2>
              </div>
              <ul className="space-y-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <li key={feature.title} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">{feature.title}</span>
                        <span className="text-muted-foreground"> — {feature.description}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-gold" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Our Commitment</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We are committed to providing a safe, fair, and enjoyable experience for all our members. Our team works tirelessly to ensure every competition meets the highest standards of integrity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From the prizes we select to the draws we conduct, every step is designed with our members in mind. Your trust means everything to us.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Enter?</h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of players already trying their luck on premium prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/competitions">
              <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-8">
                Browse Competitions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}