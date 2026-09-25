import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { banners, setActiveCategory, setActiveTab } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const now = new Date().toISOString().split('T')[0];
  const activeBanners = banners.filter((b) => {
    if (!b.enabled) return false;
    if (b.startDate && now < b.startDate) return false;
    if (b.endDate && now > b.endDate) return false;
    return true;
  });

  // Auto-slide every 4.5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1 || isPaused) return;

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 4500);

    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [activeBanners.length, isPaused]);

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handleSlideClick = () => {
    if (currentBanner.categoryLink) {
      setActiveCategory(currentBanner.categoryLink);
    }
    setActiveTab('shop');
  };

  return (
    <div
      className="relative px-3 sm:px-6 lg:px-8 pt-3 pb-1 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        onClick={handleSlideClick}
        className="cursor-pointer relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 shadow-md h-[180px] sm:h-[260px] md:h-[320px] transition-all duration-300"
      >
        {/* Banner Graphic Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover sm:object-cover transition-transform duration-700 hover:scale-103"
          />
        </div>

        {/* Contrast Overlay Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-900/60 to-transparent" />

        {/* Slide Text Content */}
        <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-center max-w-[70%] sm:max-w-md z-10 space-y-1.5 sm:space-y-3">
          {currentBanner.discountBadge && (
            <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-[#FAF4E8]/20 backdrop-blur-xs text-[#FEF3C7] text-[9px] sm:text-[11px] font-bold uppercase tracking-wider border border-[#FDE68A]/30">
              <Sparkles className="w-2.5 h-2.5 text-[#FDE68A]" />
              <span>{currentBanner.discountBadge}</span>
            </div>
          )}

          <h2 className="font-serif-luxury text-base sm:text-2xl md:text-3xl font-bold text-white leading-tight line-clamp-2">
            {currentBanner.title}
          </h2>

          <p className="text-[11px] sm:text-xs text-stone-200 line-clamp-2 leading-relaxed">
            {currentBanner.subtitle}
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#78350F] text-[11px] sm:text-xs font-bold shadow-md transition-all">
              <span>{currentBanner.buttonText || 'Shop Collection'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Carousel Arrow Controls (Visible on hover or tablet/desktop) */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity z-20"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-opacity z-20"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-5 h-1.5 bg-[#F59E0B]'
                    : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
