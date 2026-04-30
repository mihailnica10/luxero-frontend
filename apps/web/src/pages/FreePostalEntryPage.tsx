import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquare, Phone, User } from "lucide-react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Button } from "@luxero/ui";
import { Link } from "react-router-dom";

export function FreePostalEntryPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Free{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Postal Entry
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Don&apos;t have a card? Enter our competitions for free by post
          </p>
        </div>

        {/* How to Enter Card */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">How to Enter by Post</h2>
                  <p className="text-muted-foreground">
                    Send us your entry details by post to be entered into any active competition
                    completely free.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gold" />
                  Postal Address
                </h3>
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  Regus Quatro House
                  <br />
                  Frimley Road
                  <br />
                  Camberley
                  <br />
                  England
                  <br />
                  GU16 7ER
                </p>
              </div>

              <h3 className="font-semibold mb-4">What to Include</h3>
              <ul className="space-y-3 mb-6">
                {[
                  { icon: User, text: "Your full name" },
                  { icon: MapPin, text: "Your full postal address (including postcode)" },
                  { icon: Phone, text: "Your phone number and email address" },
                  { icon: MessageSquare, text: "The competition name and your answer to any question" },
                ].map(({ icon: Icon, text }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                <p className="text-sm text-destructive font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Incomplete entries will not be accepted. Please include all required information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules Card */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
              <h2 className="text-xl font-semibold mb-6">Entry Rules</h2>
              <ul className="space-y-4">
                {[
                  { icon: CheckCircle, color: "text-emerald-400", text: "You may enter as many different competitions as you like — one entry per competition" },
                  { icon: AlertCircle, color: "text-amber-400", text: "Multiple entries for the same competition in the same envelope will not be accepted" },
                  { icon: CheckCircle, color: "text-emerald-400", text: "Each entry must be sent in a separate envelope with its own stamped addressed envelope" },
                  { icon: AlertCircle, color: "text-amber-400", text: "You must have an account with Luxero to claim any prize won via postal entry" },
                  { icon: CheckCircle, color: "text-emerald-400", text: "We'll email you to confirm your entry and notify you if you've won" },
                  { icon: AlertCircle, color: "text-amber-400", text: "Entries must be received before the competition draw date to be valid" },
                ].map(({ icon: Icon, color, text }, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${color} mt-0.5 flex-shrink-0`} />
                    <span className="text-muted-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Eligibility Card */}
        <div className="relative overflow-hidden rounded-[2rem] mb-8">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
              <h2 className="text-xl font-semibold mb-4">Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                Postal entries are open to residents of the United Kingdom who are 18 years or
                older. Employees of Luxero and their immediate families are not eligible to enter.
              </p>
              <p className="text-sm text-muted-foreground">
                By submitting a postal entry, you agree to be bound by our Terms & Conditions and
                confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Want faster entry?</p>
          <Link to="/competitions">
            <Button className="bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full px-8">
              Browse Competitions
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}