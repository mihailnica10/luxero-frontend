"use client";

import { ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { useEffect, useRef, useState } from "react";
import type { Competition } from "@luxero/types";
import { cn } from "@luxero/utils";

interface CategorySectionProps {
  title: string;
  description?: string;
  competitions: Competition[];
  categorySlug: string;
  viewAllText?: string;
}

function formatTimeLeft(endDate: string | undefined) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function CategorySection({
  title,
  description,
  competitions,
  categorySlug,
  viewAllText = "View All",
}: CategorySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const currentCompetition = competitions[currentIndex];
  const isActive = currentCompetition?.status === "active";

  // Helpers to map backend fields
  const getTicketPrice = (c: Competition) => c.ticketPrice ?? c.price ?? 0;
  const getTotalTickets = (c: Competition) => c.maxTickets ?? c.totalTickets ?? 0;
  const getSoldTickets = (c: Competition) => c.ticketsSold ?? c.soldTickets ?? 0;
  const getEndDate = (c: Competition) => c.endDate ?? c.drawDate;

  // Countdown
  useEffect(() => {
    const end = getEndDate(currentCompetition);
    if (!end) return;
    const update = () => setTimeLeft(formatTimeLeft(end));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [currentCompetition]);

  // Touch/pointer handlers for swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const diff = e.clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex > 0) {
        setCurrentIndex((i) => i - 1);
      } else if (diff < 0 && currentIndex < competitions.length - 1) {
        setCurrentIndex((i) => i + 1);
      }
    }
    isDragging.current = false;
    touchStartX.current = null;
  };

  if (competitions.length === 0) return null;

  const pct = (() => {
    const total = getTotalTickets(currentCompetition);
    const sold = getSoldTickets(currentCompetition);
    return total > 0 ? Math.round((sold / total) * 100) : 0;
  })();

  return (
    <section
      data-section-id={categorySlug}
      className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-48"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
              {title}
            </h2>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
            )}
          </div>
          <Link
            to={`/competitions?category=${categorySlug}`}
            className="hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors text-sm font-medium"
          >
            <span>{viewAllText}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: Single featured card with carousel dots */}
        <div className="md:hidden">
          {currentCompetition && (
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/20 shadow-xl shadow-gold/10 cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              style={{ touchAction: "pan-y" }}
            >
              <div className="relative h-[500px] sm:h-[550px] overflow-hidden rounded-2xl sm:rounded-3xl">
                {currentCompetition.imageUrl ? (
                  <Link to={`/competitions/${currentCompetition.slug || currentCompetition.id || currentCompetition._id}`}>
                    <img
                      src={currentCompetition.imageUrl}
                      alt={currentCompetition.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                ) : (
                  <Link to={`/competitions/${currentCompetition.slug || currentCompetition.id || currentCompetition._id}`}>
                    <div className="w-full h-full bg-gradient-to-br from-gold/30 to-gold/5" />
                  </Link>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/90 z-10" />

                {/* Content */}
                <div className="absolute inset-0 z-20 p-4 sm:p-6 flex flex-col">
                  <div className="mb-3 sm:mb-4">
                    <Badge className="bg-gold/90 text-primary-foreground border-0 px-2 sm:px-3 py-1 text-xs font-semibold">
                      {title}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <Link to={`/competitions/${currentCompetition.slug || currentCompetition.id || currentCompetition._id}`}>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2">
                        {currentCompetition.title}
                      </h3>
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-3 sm:mb-4">
                      {currentCompetition.shortDescription ||
                        currentCompetition.description}
                    </p>

                    {/* Price */}
                    <div className="mb-3 sm:mb-4">
                      {(() => {
                        const tp = getTicketPrice(currentCompetition);
                        const op = currentCompetition.originalPrice;
                        const hasDiscount = op && op > tp;
                        return (
                          hasDiscount ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                              <span className="text-lg sm:text-xl font-bold text-gray-400 line-through">
                                £{op.toFixed(2)}
                              </span>
                              <span className="text-2xl sm:text-3xl font-bold text-gold">
                                £{tp.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl sm:text-3xl font-bold text-gold">
                              £{tp.toFixed(2)}
                            </span>
                          )
                        );
                      })()}
                    </div>

                    {/* Progress */}
                    <div className="mb-3 sm:mb-4">
                      <div className="flex justify-between text-xs text-gray-300 mb-1">
                        <span>
                          {(getTotalTickets(currentCompetition) - getSoldTickets(currentCompetition)).toLocaleString()} left
                        </span>
                        <span>{pct}% sold</span>
                      </div>
                      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Countdown */}
                    {isActive && timeLeft && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
                          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Ends in:
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                          {[
                            { label: "D", value: timeLeft.days },
                            { label: "H", value: timeLeft.hours },
                            { label: "M", value: timeLeft.minutes },
                            { label: "S", value: timeLeft.seconds },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-white/10 rounded-lg p-1.5 sm:p-2 text-center border border-white/20"
                            >
                              <div className="text-base sm:text-lg font-bold text-white">
                                {String(item.value).padStart(2, "0")}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/competitions/${currentCompetition.slug || currentCompetition.id || currentCompetition._id}`}
                    className="block w-full"
                  >
                    <Button className="w-full bg-gold hover:bg-gold-dark text-primary-foreground font-semibold px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base shadow-lg shadow-gold/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      Enter Competition
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Dots */}
          {competitions.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {competitions.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === currentIndex
                      ? "w-8 sm:w-12 bg-gold"
                      : "w-6 sm:w-8 bg-white/30"
                  )}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <Link
            to={`/competitions?category=${categorySlug}`}
            className="sm:hidden mt-4 block text-center text-gold hover:text-gold-dark text-sm font-medium"
          >
            {viewAllText}
          </Link>
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {competitions.map((comp) => {
            const tp = getTicketPrice(comp);
            const total = getTotalTickets(comp);
            const sold = getSoldTickets(comp);
            const ticketPct = total > 0 ? Math.round((sold / total) * 100) : 0;
            const hasDiscount = comp.originalPrice && comp.originalPrice > tp;

            return (
              <Link key={comp.id || comp._id} to={`/competitions/${comp.slug || comp.id || comp._id}`} className="group">
                <div className="relative h-full overflow-hidden rounded-xl border border-gold/10 bg-card hover:shadow-lg hover:shadow-gold/10 transition-all duration-300 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {comp.imageUrl ? (
                      <img
                        src={comp.imageUrl}
                        alt={comp.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                        <span className="text-gold/40 text-4xl font-bold">
                          {title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
                      {comp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {comp.shortDescription || comp.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            £{comp.originalPrice!.toFixed(2)}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-gold">
                            £{tp.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg sm:text-xl font-bold text-gold">
                          £{tp.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{(total - sold).toLocaleString()} left</span>
                        <span>{ticketPct}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold transition-all duration-300"
                          style={{ width: `${ticketPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
