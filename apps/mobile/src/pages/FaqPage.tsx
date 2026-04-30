import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@luxero/api-client";
import type { ApiResponse } from "@luxero/types";
import { ArrowLeft, ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FaqCategory {
  id: string;
  name: string;
}

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [categories, setCategories] = useState<FaqCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<FaqItem[]>>("/api/faq"),
      api.get<ApiResponse<FaqCategory[]>>("/api/faq/categories"),
    ])
      .then(([faqsRes, catsRes]) => {
        setFaqs(faqsRes.data);
        setCategories(catsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fallback FAQs when API returns nothing
  const fallbackFaqs: FaqItem[] = [
    { id: "1", question: "How do I enter a competition?", answer: "Browse our competitions, select the number of tickets you want, and complete checkout. Your tickets will be added to your account immediately." },
    { id: "2", question: "How are winners selected?", answer: "Winners are selected using a certified random number generator (RNG) after the competition closes. Every ticket has an equal chance of winning." },
    { id: "3", question: "When will the winner be announced?", answer: "Winners are announced on the competition page after the draw date. We notify all winners by email within 7 days of the draw." },
    { id: "4", question: "How will I receive my prize?", answer: "Winners receive an email notification with instructions. After verification, prizes are dispatched within 14 working days via tracked delivery." },
    { id: "5", question: "Can I cancel my ticket purchase?", answer: "Ticket purchases are final and non-refundable once completed. Please ensure you have read the competition terms before entering." },
    { id: "6", question: "Is there a free entry method?", answer: "Yes, you can enter any competition free by post. Send your name, address, email, and chosen competition to our postal address. See the Free Postal Entry page for details." },
  ];

  const displayFaqs = faqs.length > 0 ? faqs : fallbackFaqs;
  const filteredFaqs = activeCategory === "all"
    ? displayFaqs
    : displayFaqs.filter((f) => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-lg border-b border-border/20">
        <div className="flex items-center gap-3 px-4 h-14">
          <Link to="/" className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-semibold">FAQ</span>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
            <HelpCircle className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            Frequently Asked <span className="text-gold">Questions</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Find answers to common questions about Luxero competitions.
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === "all"
                  ? "bg-gold text-primary-foreground"
                  : "bg-card border border-border/50 text-muted-foreground"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? "bg-gold text-primary-foreground"
                    : "bg-card border border-border/50 text-muted-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Accordion */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No FAQs available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="relative overflow-hidden rounded-xl bg-card border border-border/50"
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left active:bg-card/80"
                >
                  <span className="font-medium text-sm pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                      openId === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openId === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-6 p-4 bg-card rounded-xl border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            Can't find what you're looking for?
          </p>
          <Link
            to="/contact"
            className="block w-full mt-3 py-2.5 text-center text-sm font-medium text-gold border border-gold/30 rounded-xl hover:bg-gold/5 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}