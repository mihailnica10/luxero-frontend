"use client";

import {
  Car,
  ChevronRight,
  Smartphone,
  Trophy,
  Watch,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@luxero/api-client";
import { Skeleton } from "@luxero/ui";
import type { ApiResponse, Category } from "@luxero/types";

interface NavCategory {
  id: string;
  label: string;
  href: string;
  sectionId: string;
  iconName: string;
}

const defaultCategories: NavCategory[] = [
  {
    id: "ending-soon",
    label: "Ending Soon",
    href: "/#ending-soon",
    sectionId: "ending-soon",
    iconName: "Zap",
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone: Smartphone,
  Car: Car,
  Watch: Watch,
  Zap: Zap,
  Trophy: Trophy,
};

export function CategoryNav() {
  const [activeSection, setActiveSection] = useState("ending-soon");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<NavCategory[]>(defaultCategories);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const [catsRes, compsRes] = await Promise.all([
          api.get<ApiResponse<Category[]>>("/api/categories"),
          api.get<ApiResponse<{ category?: string }[]>>("/api/competitions"),
        ]);
        const cats: Category[] = catsRes.data ?? [];
        const comps: { category?: string }[] = compsRes.data ?? [];
        const slugsWithComps = new Set(comps.map((c) => c.category).filter(Boolean));
        const navCategories: NavCategory[] = cats
          .filter((cat) => slugsWithComps.has(cat.slug))
          .map((cat) => ({
            id: cat.slug,
            label: cat.label,
            href: `/#${cat.slug}`,
            sectionId: cat.slug,
            iconName: cat.iconName ?? "Trophy",
          }));
        setDynamicCategories([defaultCategories[0], ...navCategories]);
      } catch {
        // keep default
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    const sections = document.querySelectorAll("[data-section-id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute("data-section-id") ?? "");
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [dynamicCategories]);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (element) {
      const headerHeight = 64 + 48; // row1 + row2 heights
      const top = element.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const allCategories =
    dynamicCategories.length > 1 ? dynamicCategories : defaultCategories;

  if (isLoading) {
    return (
      <nav
        className={`sticky top-16 z-30 w-full border-b transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-gold/10 shadow-lg shadow-gold/5"
            : "bg-background/90 backdrop-blur-lg border-gold/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-3 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-lg" shimmer />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      className={`sticky top-16 z-30 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-gold/10 shadow-lg shadow-gold/5"
          : "bg-background/90 backdrop-blur-lg border-gold/5"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Navigation - horizontal scroll on mobile, flex on desktop */}
        <div className="flex items-center">
          {/* Mobile: horizontal scroll container */}
          <div className="flex md:block overflow-x-auto hide-scrollbar touch-manipulation">
            <div className="flex md:items-center py-2 md:py-0 w-max md:w-auto md:flex-nowrap gap-1">
              {allCategories.map((category) => {
                const Icon = iconMap[category.iconName] || Trophy;
                const isActive = activeSection === category.sectionId;

                return (
                  <a
                    key={category.id}
                    href={category.href}
                    onClick={(e) => handleNavClick(e, category.sectionId)}
                    className={`group relative flex items-center gap-2.5 px-3 sm:px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? "text-gold bg-gold/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      isActive ? "bg-gold/20" : "bg-gold/5 group-hover:bg-gold/10"
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="whitespace-nowrap text-sm font-medium">
                      {category.label}
                    </span>
                    {/* Active indicator - bottom line */}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gold transition-all duration-300 ${
                      isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                    }`} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* View All Button - desktop only */}
          <div className="hidden md:block pl-3 pr-4 lg:pr-6 flex-shrink-0 ml-auto">
            <Link
              to="/competitions"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all bg-gold/10 text-gold hover:bg-gold/20 flex-shrink-0"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}