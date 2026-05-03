import { api } from "@luxero/api-client";
import { Button, Input, Label, Textarea } from "@luxero/ui";
import { Clock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await api.post("/api/contact", formData);
      setSuccessMsg("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMsg("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Us
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: Mail,
              title: "Email",
              value: "support@luxero.win",
              href: "mailto:support@luxero.win",
            },
            {
              icon: Clock,
              title: "Response Time",
              value: "Within 24 hours",
              href: null,
            },
            {
              icon: Clock,
              title: "Hours",
              value: "Mon–Fri, 9am–5pm",
              href: null,
            },
          ].map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="relative overflow-hidden rounded-[1.5rem]">
              <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
                <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-5 text-center">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{title}</p>
                  {href ? (
                    <a href={href} className="text-sm font-semibold text-gold hover:underline">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{value}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="relative overflow-hidden rounded-[1.5rem] mb-8">
          <div className="p-1.5 rounded-[1.5rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { label: "Facebook", href: "https://facebook.com/luxerowin" },
                  { label: "Twitter", href: "https://twitter.com/luxerowin" },
                  { label: "Instagram", href: "https://instagram.com/luxerowin" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-gold/20 text-sm font-medium text-muted-foreground hover:border-gold/40 hover:text-gold transition-all"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="p-1.5 rounded-[2rem] bg-white/5 ring-1 ring-white/10">
            <div className="rounded-[calc(2rem-0.375rem)] bg-card p-8">
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-muted-foreground">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold rounded-full py-3 text-base"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-2">Prefer talking to a human?</p>
          <Link to="/faq" className="text-sm text-gold hover:underline">
            Check our FAQ →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
