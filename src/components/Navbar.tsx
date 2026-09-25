import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, Sparkles, Truck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    triggerLogoTap,
    shippingSettings,
    themeMode,
  } = useApp();

  // Handle pointer down (low-latency tap registration on modern touchscreens and mice)
  const handleLogoPointerDown = () => {
    triggerLogoTap();
  };

  // Fallback for touch devices
  const handleLogoTouchStart = () => {
    triggerLogoTap();
  };

  // Normal logo behavior on click
  const handleLogoClick = () => {
    triggerLogoTap();
    // Only switch tab if user was on a different view (e.g. shop, categories, orders)
    // Never navigate away or disrupt homepage during the 7 taps
    if (activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  const handleSearchFocus = () => {
    setActiveTab('shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/98 backdrop-blur-md border-b border-[#E7DECD] shadow-2xs">
      {/* Top Announcement Bar - Highlights All-India Delivery */}
      <div className="bg-[#78350F] text-[#FEF3C7] text-[10px] sm:text-xs py-1 px-3 text-center font-medium tracking-wide flex items-center justify-center gap-1.5">
        <Truck className="w-3 h-3 text-[#FBBF24] shrink-0" />
        <span className="truncate">
          {shippingSettings.deliveryNoticeText || '🚚 Free Delivery Across India (₹0 Shipping)'}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo with Secret 7-Tap Hidden Admin Handler (NO ADMIN TEXT OR BUTTONS) */}
          <div
            onClick={handleLogoClick}
            onPointerDown={handleLogoPointerDown}
            onTouchStart={handleLogoTouchStart}
            style={{ touchAction: 'manipulation' }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0 group active:scale-95 transition-transform touch-manipulation"
            title="UtsavNest"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#92400E] via-[#D97706] to-[#F59E0B] flex items-center justify-center text-white shadow-xs">
              {/* Elegant Nest/Crown Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div>
              <span className="font-brand text-xl sm:text-2xl font-bold tracking-wider text-[#451A03] block leading-none">
                UtsavNest
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#B45309] font-medium block">
                {themeMode === 'festive' ? 'Festive & Living' : 'Curated Living'}
              </span>
            </div>
          </div>

          {/* Compact Integrated Search Bar for Mobile & Desktop */}
          <div className="flex-1 max-w-md relative">
            <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search home decor, fashion, accessories..."
              value={searchQuery}
              onFocus={handleSearchFocus}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab('shop');
              }}
              className="w-full pl-8 pr-3 py-1.5 sm:py-2 text-xs rounded-full border border-[#D7CDBB] bg-white/90 text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#78350F] focus:bg-white shadow-2xs"
            />
          </div>

          {/* Cart Icon with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#E7DECD] text-[#78350F] hover:bg-[#FAF4E8] flex items-center gap-1.5 shrink-0 shadow-2xs relative active:scale-95 transition-all"
            aria-label="Shopping Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-[#B45309]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#EA580C] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold">Bag</span>
          </button>

        </div>
      </div>
    </header>
  );
};
