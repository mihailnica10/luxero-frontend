"use client";

import { ArrowLeft, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@luxero/ui";
import { Button } from "@luxero/ui";
import { api } from "@luxero/api-client";
import type { ApiResponse, Competition } from "@luxero/types";

interface HeroSlide extends Competition {
  originalPrice?: number;
}

function formatTimeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Drag state
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await api.get<ApiResponse<Competition[]>>("/api/competitions/featured");
        setSlides(res.data ?? []);
      } catch {
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSlides();
  }, []);

  // Countdown timer
  const updateCountdown = useCallback(() => {
    if (slides.length === 0) return;
    const endDate = slides[currentSlide]?.drawDate;
    if (endDate) setTimeLeft(formatTimeLeft(endDate));
  }, [slides, currentSlide]);

  useEffect(() => {
    if (slides.length === 0) return;
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [slides, currentSlide, updateCountdown]);

  // Auto-advance
  const goToNext = useCallback(() => {
    setCurrentSlide((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    autoPlayRef.current = setInterval(goToNext, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, goToNext]);

  // Pause on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (slides.length <= 1) return;
    autoPlayRef.current = setInterval(goToNext, 5000);
  };

  // Pointer drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (slides.length <= 1) return;
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToPrev();
      else goToNext();
    }
    isDragging.current = false;
    dragStartX.current = null;
  };

  if (isLoading) {
    return (
      <div className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[600px] lg:min-h-[700px] bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-background to-gold/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
      </div>
    );
  }

  if (slides.length === 0) {
    // Fallback static hero
    return (
      <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[600px] lg:min-h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-background to-background" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 z-10 flex items-center select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge className="bg-gold/90 text-primary-foreground border-0 px-3 py-1 text-xs font-semibold mb-4">
                <TrendingUp className="w-3 h-3 mr-1.5" />
                Featured
              </Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold font-sans tracking-tight mb-4 leading-tight">
                <span className="text-gold-gradient">Win Big</span>
                <br />
                <span className="text-foreground">with Premium Prizes</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-8 max-w-xl hidden sm:block">
                Enter our luxury prize competitions and win amazing prizes. Fair, transparent, and
                exciting competitions every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/competitions">
                  <Button size="lg" className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-primary-foreground font-semibold px-8 py-5 shadow-xl shadow-gold/30">
                    Enter Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/competitions">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white font-semibold px-8 py-5">
                    Browse All
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative z-0 w-full overflow-hidden"
      aria-label="Featured competitions carousel"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          cursor: slides.length > 1 ? "grab" : "default",
          touchAction: "pan-y",
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {slides.map((s, index) => (
          <div
            key={s.id}
            className="w-full h-full flex-shrink-0 select-none"
            aria-label={`Slide ${index + 1} of ${slides.length}`}
            role="group"
            aria-roledescription="slide"
          >
            {/* Hero Slide */}
            <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[600px] lg:h-[700px] overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                {s.imageUrl ? (
                  <>
                    <div
                      className="absolute inset-0 md:hidden"
                      style={{
                        backgroundImage: `url(${s.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <img
                      src={s.imageUrl}
                      alt={s.title}
                      className="hidden md:block w-full h-full object-cover"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/30 via-background to-background" />
                )}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

              {/* Content */}
              <div className="absolute inset-0 z-20 flex items-center h-full select-none px-10 sm:px-16 lg:px-24 xl:px-32">
                <div className="w-full max-w-7xl mx-auto">
                  <div className="max-w-2xl text-white">
                    {/* Premium Badge */}
                    <div className="mb-4 sm:mb-6 select-none">
                      <Badge className="bg-gold/90 text-primary-foreground hover:bg-gold border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        Featured
                      </Badge>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold font-sans tracking-tight mb-4 sm:mb-6 leading-tight select-none">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark">
                        {s.title}
                      </span>
                    </h1>

                    {/* Description */}
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-xl hidden sm:block select-none">
                      {s.shortDescription || s.description}
                    </p>

                    {/* Price Section */}
                    <div className="mb-6 sm:mb-8 select-none">
                      {(s.originalPrice && s.ticketPrice && s.originalPrice > s.ticketPrice) ? (
                        <div className="flex items-center flex-wrap gap-3 sm:gap-4">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-400 line-through">
                              £{s.originalPrice.toFixed(2)}
                            </span>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold">
                              £{s.ticketPrice.toFixed(2)}
                            </span>
                          </div>
                          <Badge className="bg-green-600/90 text-white border-0 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold">
                            SAVE {Math.round(((s.originalPrice - s.ticketPrice) / s.originalPrice) * 100)}%
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-gold">
                          £{s.ticketPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Countdown Timer */}
                    {s.status === "active" && timeLeft && (
                      <div className="mb-6 sm:mb-8 select-none">
                        <div className="flex items-center space-x-1.5 sm:space-x-2 mb-2 sm:mb-3">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                          <span className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                            Draw Countdown
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 sm:gap-3 max-w-[280px] sm:max-w-md">
                          {[
                            { label: "Days", value: timeLeft.days },
                            { label: "Hours", value: timeLeft.hours },
                            { label: "Min", value: timeLeft.minutes },
                            { label: "Sec", value: timeLeft.seconds },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-white/10 rounded-lg p-2 sm:p-3 text-center border border-white/20"
                            >
                              <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white">
                                {String(item.value).padStart(2, "0")}
                              </div>
                              <div className="text-[9px] sm:text-[10px] sm:text-xs text-gray-400 uppercase mt-0.5 sm:mt-1">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 select-none">
                      <Link to={`/competitions/${s.slug || s.id}`} className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-primary-foreground font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
                        >
                          Enter Now
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>

                      <Link to="/competitions" className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto border-white/30 hover:bg-white/10 hover:border-white/50 text-white font-semibold px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base transition-all duration-300 active:scale-[0.98]"
                        >
                          View All
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - hidden on mobile */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            className="absolute left-2 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/30 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-2 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white border border-white/30 transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 touch-manipulation ${
                index === currentSlide
                  ? "w-8 sm:w-12 bg-gold"
                  : "w-6 sm:w-8 bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentSlide}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  );
}