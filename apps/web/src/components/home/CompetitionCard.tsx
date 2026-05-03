"use client";

import type { Competition } from "@luxero/types";
import { Badge, Button } from "@luxero/ui";
import { cn } from "@luxero/utils";
import { Clock, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface CompetitionCardProps {
  competition: Competition;
  variant?: "default" | "compact";
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

export function CompetitionCard({ competition: comp, variant = "default" }: CompetitionCardProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Use ticketPrice from backend, falling back to price
  const ticketPrice = comp.ticketPrice ?? comp.price ?? 0;
  // Total tickets from backend
  const totalTickets = comp.maxTickets ?? comp.totalTickets ?? 0;
  // Tickets sold from backend
  const soldTickets = comp.ticketsSold ?? comp.soldTickets ?? 0;

  const isActive = comp.status === "active";
  const percentageSold = totalTickets > 0 ? Math.min((soldTickets / totalTickets) * 100, 100) : 0;
  const hasDiscount = comp.originalPrice && comp.originalPrice > ticketPrice;
  const discountPercent = hasDiscount
    ? Math.round(((comp.originalPrice! - ticketPrice) / comp.originalPrice!) * 100)
    : 0;
  const ticketsLeft = totalTickets - soldTickets;

  // Countdown timer
  useEffect(() => {
    if (!isActive || !comp.endDate) return;
    const update = () => setTimeLeft(formatTimeLeft(comp.endDate));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isActive, comp.endDate]);

  const statusConfig = {
    active: { label: "Active", className: "bg-success/20 text-success border-success/30" },
    ended: { label: "Ended", className: "bg-muted/20 text-muted-foreground border-border" },
    drawn: { label: "Drawn", className: "bg-gold/20 text-gold border-gold/30" },
    default: { label: comp.status, className: "bg-muted/20 text-muted-foreground border-border" },
  };
  const statusStyle =
    statusConfig[comp.status as keyof typeof statusConfig] ?? statusConfig.default;

  if (variant === "compact") {
    return (
      <Link to={`/competitions/${comp.slug || comp.id}`} className="group block">
        <div className="relative rounded-2xl bg-card border border-gold/10 overflow-hidden hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10">
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            {comp.imageUrl ? (
              <img
                src={comp.imageUrl}
                alt={comp.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/20 to-gold/5">
                <Trophy className="w-10 h-10 text-gold/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {/* Badges */}
            <div className="absolute top-2 right-2">
              <Badge className={cn("backdrop-blur-sm", statusStyle.className)}>
                {statusStyle.label}
              </Badge>
            </div>
            {comp.category && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-gold/90 text-primary-foreground backdrop-blur-sm">
                  {comp.category}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight">
              {comp.prizeTitle || comp.title}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {hasDiscount ? (
                <>
                  <span className="text-xs text-muted-foreground line-through">
                    £{comp.originalPrice?.toFixed(2)}
                  </span>
                  <span className="text-lg font-bold text-gold">£{ticketPrice.toFixed(2)}</span>
                  <Badge
                    variant="secondary"
                    className="bg-green-600 text-white text-[10px] px-1 py-0"
                  >
                    -{discountPercent}%
                  </Badge>
                </>
              ) : (
                <span className="text-lg font-bold text-gold">£{ticketPrice.toFixed(2)}</span>
              )}
            </div>

            {/* Progress */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{ticketsLeft.toLocaleString()} left</span>
                <span>{percentageSold.toFixed(0)}% sold</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-300"
                  style={{ width: `${percentageSold}%` }}
                />
              </div>
            </div>

            {/* Countdown or CTA */}
            {isActive && timeLeft && (
              <div className="flex items-center gap-1.5 text-gold">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-semibold">
                  {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
                  {String(timeLeft.hours).padStart(2, "0")}:
                  {String(timeLeft.minutes).padStart(2, "0")}:
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default (full) variant
  return (
    <Link
      to={`/competitions/${comp.slug || comp.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Double-Bezel Outer Shell */}
        <div className="relative rounded-[2rem] bg-black/5 p-1.5 shadow-xl shadow-gold/5 ring-1 ring-black/5">
          {/* Inner Core */}
          <div className="relative rounded-[calc(2rem-0.375rem)] bg-card overflow-hidden">
            {/* Image Section */}
            <div className="relative -mt-12 mb-[-3rem] pt-12 overflow-visible">
              <div className="relative h-56 sm:h-64 overflow-hidden rounded-b-3xl">
                {comp.imageUrl ? (
                  <img
                    src={comp.imageUrl}
                    alt={comp.title}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-700",
                      isHovered && "scale-105"
                    )}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/30 via-gold/10 to-amber-900/20">
                    <div className="w-20 h-20 rounded-full bg-gold/10 backdrop-blur-sm flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-gold/60" />
                    </div>
                  </div>
                )}

                {/* Gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                  <Badge className={cn("backdrop-blur-sm", statusStyle.className)}>
                    {statusStyle.label}
                  </Badge>
                </div>

                {/* Category Badge */}
                {comp.category && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-gold/90 text-primary-foreground backdrop-blur-sm">
                      {comp.category}
                    </Badge>
                  </div>
                )}

                {/* Countdown Overlay */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="bg-black/85 backdrop-blur-sm py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gold">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            Ends In
                          </span>
                        </div>
                        {timeLeft ? (
                          <div className="flex items-center gap-3">
                            {timeLeft.days > 0 && (
                              <div className="text-center">
                                <div className="text-base font-bold text-white">
                                  {timeLeft.days}
                                </div>
                                <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                  Days
                                </div>
                              </div>
                            )}
                            <div className="text-center">
                              <div className="text-base font-bold text-white">
                                {String(timeLeft.hours).padStart(2, "0")}
                              </div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                Hrs
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-base font-bold text-white">
                                {String(timeLeft.minutes).padStart(2, "0")}
                              </div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                Min
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-base font-bold text-gold">
                                {String(timeLeft.seconds).padStart(2, "0")}
                              </div>
                              <div className="text-[9px] text-gray-400 uppercase tracking-wide">
                                Sec
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-yellow-400">Draw Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="relative z-10 px-5 pb-5 pt-0">
              {/* Title & Description */}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-foreground line-clamp-2 leading-tight mb-1">
                  {comp.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {comp.shortDescription || comp.description}
                </p>
              </div>

              {/* Price & Prize */}
              <div className="flex items-baseline justify-between mb-4">
                <div className="flex items-center gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        £{comp.originalPrice?.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-gold">
                        £{ticketPrice.toFixed(2)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-600 text-white text-xs px-1.5 py-0"
                      >
                        -{discountPercent}%
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gold">£{ticketPrice.toFixed(2)}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Prize: £{comp.prizeValue.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Zap className="w-3 h-3 text-gold" />
                    {comp.soldTickets.toLocaleString()} / {comp.totalTickets.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {percentageSold.toFixed(0)}% sold
                  </span>
                </div>
                <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden ring-1 ring-inset ring-black/5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      percentageSold >= 75
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : percentageSold >= 50
                          ? "bg-gradient-to-r from-gold to-amber-400"
                          : "bg-gradient-to-r from-gold/80 to-gold"
                    )}
                    style={{ width: `${percentageSold}%` }}
                  />
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full font-semibold shadow-lg transition-all duration-500",
                  isActive
                    ? "bg-gold hover:bg-gold-dark text-primary-foreground shadow-gold/25 hover:shadow-gold/40 hover:-translate-y-0.5"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                disabled={!isActive}
              >
                {isActive ? (
                  <>
                    Enter Now
                    <Zap className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  "Not Available"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
