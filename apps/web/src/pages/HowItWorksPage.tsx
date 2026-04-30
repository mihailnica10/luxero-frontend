import { ArrowRight, BarChart3, Bell, CreditCard, Gem, Headphones, HelpCircle, Lock, Search, Shield, Ticket, Clock, Trophy, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { useEffect, useState } from "react";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";

interface Step {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Ticket,
  CreditCard,
  Clock,
  Trophy,
  Users,
  Shield,
  Gem,
  Bell,
  BarChart3,
  Lock,
  Headphones,
};

export function HowItWorksPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    async function fetchContent() {
      try {
        const [stepsRes, featuresRes] = await Promise.all([
          api.get<ApiResponse<Step[]>>("/api/content/steps"),
          api.get<ApiResponse<Feature[]>>("/api/content/features"),
        ]);
        if (stepsRes.data) setSteps(stepsRes.data);
        if (featuresRes.data) setFeatures(featuresRes.data);
      } catch {
        // use static fallback below
      }
    }
    fetchContent();
  }, []);

  const staticSteps: Step[] = steps.length ? steps : [
    { stepNumber: 1, title: "Browse Competitions", description: "Explore our luxury competitions and find a prize that excites you.", icon: "Search" },
    { stepNumber: 2, title: "Select Your Tickets", description: "Choose how many tickets you'd like — more tickets increase your chances.", icon: "Ticket" },
    { stepNumber: 3, title: "Complete Purchase", description: "Quick and secure checkout with card, Apple Pay or Google Pay.", icon: "CreditCard" },
    { stepNumber: 4, title: "Await the Draw", description: "Sit back and watch the countdown. Winners are selected at random.", icon: "Clock" },
    { stepNumber: 5, title: "Win & Celebrate", description: "Winners are notified by email and prizes dispatched within 14 days.", icon: "Trophy" },
    { stepNumber: 6, title: "Refer Friends", description: "Share your win and earn free tickets for every friend who enters.", icon: "Users" },
  ];

  const staticFeatures: Feature[] = features.length ? features : [
    { title: "Verified Random Draws", description: "Every winner is selected using certified random number generation.", icon: "Shield" },
    { title: "Real Luxury Prizes", description: "Only authentic, high-value prizes from trusted brands and retailers.", icon: "Gem" },
    { title: "Instant Notifications", description: "Know immediately when you've won via email and your dashboard.", icon: "Bell" },
    { title: "Track Your Entries", description: "See all your tickets, draws, and wins in your personal dashboard.", icon: "BarChart3" },
    { title: "Secure Payments", description: "Stripe-powered checkout with full fraud protection and encryption.", icon: "Lock" },
    { title: "Dedicated Support", description: "Our team is here to help every day during business hours.", icon: "Headphones" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Steps Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">Works</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Getting started is easy. Follow these steps to enter our luxury prize competitions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {staticSteps.map((step, idx) => {
                const IconComponent = ICON_MAP[step.icon] || Trophy;
                return (
                  <div key={step.stepNumber} className="relative">
                    {idx < staticSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gold/30 to-transparent -translate-x-4 z-10" style={{ maxWidth: "2rem" }} />
                    )}
                    <div className="relative overflow-hidden rounded-[1.5rem]">
                      <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:ring-gold/30 transition-all duration-500">
                        <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                            <IconComponent className="w-8 h-8 text-gold" />
                          </div>
                          <span className="inline-block text-xs font-bold text-gold mb-3 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                            Step {step.stepNumber}
                          </span>
                          <h3 className="font-semibold text-lg text-foreground mb-2">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-card/50 to-transparent border-y border-gold/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">Luxero</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {staticFeatures.map((feature) => {
                const IconComponent = ICON_MAP[feature.icon] || Shield;
                return (
                  <div key={feature.title} className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-gold" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 sm:p-12">
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-8 h-8 text-gold" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">Have Questions?</h3>
                      <p className="text-muted-foreground mb-4">
                        Check our frequently asked questions for more details about how competitions work.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                        <Link to="/faq">
                          <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                            View FAQ
                          </Button>
                        </Link>
                        <Link to="/contact">
                          <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-6">
                            Contact Us
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5 border-y border-gold/20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground">
              Browse our active competitions and get your tickets today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/competitions">
                <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-8 py-3 text-base shadow-lg shadow-gold/20">
                  Browse Competitions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-8 py-3 text-base">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}