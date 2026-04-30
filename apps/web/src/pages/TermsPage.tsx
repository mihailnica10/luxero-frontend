import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@luxero/ui";

const sections = [
  {
    id: "promoter",
    title: "1. The Promoter",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          The promoter of these competitions is <strong>Luxero</strong>, a company registered in England and Wales.
        </p>
        <p>
          Registered address: Regus Quatro House, Frimley Road, Camberley, England, GU16 7ER
        </p>
        <p>
          Email: <a href="mailto:support@luxero.win" className="text-gold hover:underline">support@luxero.win</a>
        </p>
      </div>
    ),
  },
  {
    id: "competition",
    title: "2. Competition Eligibility",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>To enter our competitions you must:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Be aged 18 years or over</li>
          <li>Be a resident of the United Kingdom</li>
          <li>Have a valid Luxero account</li>
          <li>Not be an employee of Luxero or their immediate family</li>
        </ul>
        <p className="mt-3">Geographic restrictions may apply to certain prizes. All entries are subject to verification.</p>
      </div>
    ),
  },
  {
    id: "how-to-enter",
    title: "3. How to Enter",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You can enter our competitions:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Online:</strong> Browse our competitions, select your tickets, complete the purchase</li>
          <li><strong>By post:</strong> Send your details to our postal address — one entry per envelope</li>
        </ul>
        <p className="mt-3">Entries must be received before the published closing date. Incomplete entries will not be accepted.</p>
      </div>
    ),
  },
  {
    id: "choosing-winner",
    title: "4. Choosing the Winner",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Standard competitions:</strong> A winner is selected using a verified random number generator (RNG) after the closing date</li>
          <li><strong>Instant win competitions:</strong> The winning ticket number is predetermined at the time of ticket purchase using a secret algorithm</li>
        </ul>
        <p className="mt-3">
          Winners are notified by email within 7 days of the draw. The winner&apos;s name and prize may be published on our website and social media channels.
        </p>
      </div>
    ),
  },
  {
    id: "prize",
    title: "5. Prize Details",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          <li>Prizes are non-transferable and non-exchangeable</li>
          <li>Cash alternatives will not be offered unless explicitly stated</li>
          <li>Prize values are as advertised at the time of the competition launch</li>
          <li>For cars, the winner is responsible for road tax, insurance, and registration costs</li>
        </ul>
      </div>
    ),
  },
  {
    id: "claiming",
    title: "6. Claiming Your Prize",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          <li>Winners must respond to the winner notification within 14 days</li>
          <li>Identity verification may be required before a prize is dispatched</li>
          <li>Prizes are typically dispatched within 14 working days of verification</li>
          <li>UK delivery usually takes 5–7 working days</li>
        </ul>
      </div>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Luxero shall not be liable for any indirect, incidental, or consequential damages arising from participation in competitions or receipt of any prize.
        </p>
        <p>
          Our liability is limited to the maximum extent permitted by law. This does not affect your statutory rights as a consumer.
        </p>
      </div>
    ),
  },
  {
    id: "general",
    title: "8. General",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <ul className="list-disc list-inside space-y-2">
          <li>Competitions may be withdrawn or amended at any time with notice</li>
          <li>The promoter&apos;s decision is final and no correspondence will be entered into</li>
          <li>These terms are governed by the laws of England and Wales</li>
          <li>Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales</li>
        </ul>
      </div>
    ),
  },
];

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Terms
            </span>{" "}
            of Service
          </h1>
          <p className="text-muted-foreground">Last updated: April 2026</p>
        </div>

        {/* Table of Contents */}
        <div className="relative overflow-hidden rounded-[1.5rem] mb-8">
          <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6">
              <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Contents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors py-1"
                  >
                    <Hash className="w-3.5 h-3.5 text-gold/50 flex-shrink-0" />
                    <span>{section.title.replace(/^\d+\.\s*/, "")}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} id={section.id} className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                  {section.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Questions about these terms?
          </p>
          <Link to="/contact">
            <Button variant="outline" className="border-gold/30 hover:bg-gold/10 font-semibold rounded-full px-6">
              Contact Us
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}