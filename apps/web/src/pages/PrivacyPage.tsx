import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@luxero/ui";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          Luxero (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
        <p>
          Please read this Privacy Policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
        </p>
      </div>
    ),
  },
  {
    id: "data-collected",
    title: "2. Information We Collect",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Full name, email address, phone number, and postal address</li>
          <li>Payment and transaction information</li>
          <li>Competition entries and ticket purchase history</li>
          <li>Communication preferences and marketing consent</li>
          <li>Usage data and analytics when you visit our website</li>
        </ul>
      </div>
    ),
  },
  {
    id: "how-used",
    title: "3. How We Use Your Information",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We use your information to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Process competition entries and ticket purchases</li>
          <li>Notify winners and arrange prize delivery</li>
          <li>Provide customer support and respond to enquiries</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Improve our website and services</li>
        </ul>
        <p className="font-semibold text-foreground mt-4">We never sell your personal information.</p>
      </div>
    ),
  },
  {
    id: "legal-basis",
    title: "4. Legal Basis for Processing",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We process your data under the following legal bases:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Contract:</strong> To fulfil our agreement with you when you purchase tickets</li>
          <li><strong>Consent:</strong> For marketing communications you have opted into</li>
          <li><strong>Legitimate interests:</strong> For fraud prevention, security, and service improvement</li>
        </ul>
      </div>
    ),
  },
  {
    id: "data-sharing",
    title: "5. Data Sharing",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>We may share your data with:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Service providers (payment processors, delivery companies)</li>
          <li>Legal authorities when required by law</li>
          <li>Competitions partners for prize fulfilment</li>
        </ul>
        <p className="mt-3">We require all third parties to handle your data securely and in accordance with applicable laws.</p>
      </div>
    ),
  },
  {
    id: "rights",
    title: "6. Your Rights",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access the personal data we hold about you</li>
          <li>Correct any inaccurate or incomplete information</li>
          <li>Request deletion of your data (subject to legal requirements)</li>
          <li>Object to certain processing activities</li>
          <li>Withdraw marketing consent at any time</li>
        </ul>
        <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@luxero.win" className="text-gold hover:underline">privacy@luxero.win</a>.</p>
      </div>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We use cookies and similar technologies to maintain session state, remember your preferences, and understand how you use our website. You can control cookie settings through your browser.
        </p>
        <p>
          Essential cookies are required for the website to function properly. Optional cookies require your consent and can be managed through our cookie consent banner.
        </p>
      </div>
    ),
  },
  {
    id: "security",
    title: "8. Data Security",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We implement industry-standard security measures to protect your data, including SSL encryption, secure servers, and regular security audits.
        </p>
        <p>
          While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date.
        </p>
        <p>
          We encourage you to review this policy periodically to stay informed about how we protect your information.
        </p>
      </div>
    ),
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <div className="space-y-3 text-muted-foreground">
        <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Email: <a href="mailto:privacy@luxero.win" className="text-gold hover:underline">privacy@luxero.win</a></li>
          <li>Post: Regus Quatro House, Frimley Road, Camberley, England, GU16 7ER</li>
        </ul>
      </div>
    ),
  },
];

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
              Privacy
            </span>{" "}
            Policy
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
            Have more questions?
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