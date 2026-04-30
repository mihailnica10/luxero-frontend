import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { useEffect, useState } from "react";
import { Button } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { cn } from "@luxero/utils";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        const res = await api.get<ApiResponse<FaqItem[]>>("/api/faq?category=general");
        if (res.data) setFaqs(res.data);
      } catch {
        // fall back to static
      }
    }
    fetchFaqs();
  }, []);

  const staticFaqs: FaqItem[] = [
    { question: "How do I enter a competition?", answer: "Browse our competitions, select the prize you want to win, choose how many tickets you wish to purchase, and answer any qualifying question. Your tickets will be confirmed once payment is processed." },
    { question: "How are winners selected?", answer: "Winners are selected using certified random number generation (RNG). This ensures complete fairness and transparency in every draw." },
    { question: "How will I know if I have won?", answer: "Winners are contacted via email and announced on our Winners page. Make sure your email address is accurate and up to date." },
    { question: "How long does it take to receive my prize?", answer: "Once a winner is confirmed, prizes are typically dispatched within 5–7 working days. Larger prizes such as cars are coordinated directly with the winner." },
    { question: "Are the competitions fair?", answer: "Absolutely. Every competition draw uses certified random number generation. We publish draw results for every competition." },
    { question: "Can I buy multiple tickets?", answer: "Yes! You can purchase multiple tickets for any competition, up to the maximum limit per person. More tickets increase your chances of winning." },
    { question: "What happens if a competition is not sold out?", answer: "Competitions will run until their published end date regardless of sell-out status. If the minimum threshold is not met, a full refund will be issued." },
    { question: "How do I pay?", answer: "We accept all major credit and debit cards. Payment is processed securely through Stripe with full encryption." },
    { question: "Can I cancel my order?", answer: "Orders cannot be cancelled once placed as tickets are immediately allocated. Please ensure you have selected the correct competition before confirming." },
    { question: "Is Luxero licensed and regulated?", answer: "Yes. Luxero operates in full compliance with applicable regulations. All competitions are conducted fairly and transparently." },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : staticFaqs;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Questions
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our competitions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-8">
          {displayFaqs.map((faq, i) => (
            <div key={i} className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:ring-gold/20 transition-all duration-300">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center gap-3 px-6 py-5 text-left hover:bg-gold/5 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="font-semibold text-foreground flex-1 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300",
                        openIndex === i && "rotate-180"
                      )}
                    />
                  </button>
                  {openIndex === i && (
                    <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can&apos;t find what you&apos;re looking for? Our team is ready to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                    Contact Us
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-6">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}