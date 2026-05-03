import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { Button } from "@luxero/ui";
import { cn } from "@luxero/utils";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  name: string;
}

export function FaqPage() {
  const [categories, setCategories] = useState<FaqCategory[]>([
    { id: "general", name: "General" },
    { id: "payment", name: "Payment" },
    { id: "delivery", name: "Shipping & Delivery" },
  ]);
  const [activeCategory, setActiveCategory] = useState("general");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get<ApiResponse<FaqCategory[]>>("/api/faq/categories");
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch {
        // use defaults
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchFaqs() {
      setIsLoading(true);
      try {
        const res = await api.get<ApiResponse<FaqItem[]>>(`/api/faq?category=${activeCategory}`);
        if (res.data) setFaqs(res.data);
      } catch {
        // fall back to static
      } finally {
        setIsLoading(false);
      }
    }
    fetchFaqs();
  }, [activeCategory]);

  const staticFaqsByCategory: Record<string, FaqItem[]> = {
    general: [
      {
        question: "How do I enter a competition?",
        answer:
          "Browse our competitions, select your desired prize, choose how many tickets you'd like to purchase, and complete the checkout process. You'll receive a confirmation email with your ticket numbers.",
      },
      {
        question: "How are winners selected?",
        answer:
          "Winners are selected using a verified random number generator (RNG) that picks a winning ticket number after the competition closes. The winner is notified via email within 7 days of the draw.",
      },
      {
        question: "When will the draw take place?",
        answer:
          "Each competition page shows the scheduled draw date and time. Draws occur automatically once all tickets are sold or the countdown timer reaches zero, whichever comes first.",
      },
      {
        question: "How will I know if I've won?",
        answer:
          "We'll email the winner at the email address used during purchase. The winner's name and prize will also be displayed on our Winners page. Make sure to keep your account email up to date.",
      },
      {
        question: "How long does prize delivery take?",
        answer:
          "Once winner verification is complete, prizes are typically dispatched within 14 working days. UK deliveries usually arrive within 5-7 working days.",
      },
      {
        question: "Can I get a refund on my tickets?",
        answer:
          "All ticket purchases are final and non-refundable. Competition entries remain valid even if the draw date changes.",
      },
      {
        question: "Are there any age restrictions?",
        answer:
          "Yes, you must be 18 years or older to participate in any competition. We reserve the right to verify the age of winners.",
      },
      {
        question: "Can I buy tickets for someone else?",
        answer:
          "Yes, you can purchase tickets as a gift. The tickets will be assigned to your account, but you can notify us after the draw to update delivery details.",
      },
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit and debit cards including Visa, Mastercard, and American Express. Apple Pay and Google Pay are also supported for faster checkout.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. All payments are processed through Stripe, one of the world's most trusted payment platforms. We never store your card details.",
      },
      {
        question: "Can I use a promo code?",
        answer:
          "Yes, you can enter a promo code at checkout for discounts or bonus tickets. Promo codes cannot be combined with other offers and have expiry dates.",
      },
    ],
    delivery: [
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by destination. All customs duties and import taxes are the responsibility of the recipient.",
      },
      {
        question: "What happens if I'm not home for delivery?",
        answer:
          "The courier will usually attempt delivery twice before returning the package. We recommend providing a safe location or office address for prize deliveries.",
      },
    ],
  };

  const displayFaqs =
    faqs.length > 0 ? faqs : staticFaqsByCategory[activeCategory] || staticFaqsByCategory.general;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
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

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                activeCategory === cat.id
                  ? "bg-gold text-primary-foreground shadow-lg shadow-gold/20"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-gold/10 border border-gold/10"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-8">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : displayFaqs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No FAQs in this category yet.
            </div>
          ) : (
            displayFaqs.map((faq, i) => (
              <div key={i} className="relative overflow-hidden rounded-[1.5rem]">
                <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10 hover:ring-gold/20 transition-all duration-300">
                  <div className="rounded-[calc(1.5rem-0.375rem)] bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center gap-3 px-6 py-5 text-left hover:bg-gold/5 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="font-semibold text-foreground flex-1 pr-4">
                        {faq.question}
                      </span>
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
            ))
          )}
        </div>

        {/* Still have questions */}
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="p-1.5 rounded-[2rem] bg-gold/5 ring-1 ring-gold/20">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8 text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">
                Didn&apos;t find your answer?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our support team at support@luxero.win or use the contact form.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-6">
                    Get in touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button
                    variant="outline"
                    className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-6"
                  >
                    How It Works
                    <HelpCircle className="w-4 h-4 ml-2" />
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
