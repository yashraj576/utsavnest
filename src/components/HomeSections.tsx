import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Sparkles,
  ArrowRight,
  Truck,
  ShieldCheck,
  QrCode,
  Flame,
  Award,
} from 'lucide-react';

export const HomeSections: React.FC = () => {
  const {
    products,
    setActiveTab,
    setActiveCategory,
    themeMode,
    homepageSections,
    storeCategories,
    shippingSettings,
  } = useApp();

  const visibleProducts = products.filter((p) => p.enabled !== false);
  const trendingProducts = visibleProducts.slice(0, 4);
  const featuredProducts = visibleProducts.slice(0, 8);
  const activeCategories = storeCategories
    .filter((c) => c.enabled && c.name !== 'All')
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const handleCategoryClick = (catName: string) => {
    setActiveCategory(catName);
    setActiveTab('shop');
  };

  return (
    <div className="space-y-5 sm:space-y-8 pb-6">
      
      {/* 1. Offers / Benefits Row (All-India Delivery highlighted!) */}
      {homepageSections.showOffersStrip && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-2 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E7DECD] shadow-2xs text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <Truck className="w-4 h-4 text-[#B45309]" />
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-[#1C1917] block leading-tight">
                  All-India Delivery
                </span>
                <span className="text-[8px] sm:text-[10px] text-[#15803D] font-bold block leading-tight">
                  100% Free Shipping (₹0)
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 border-x border-[#F5EEDC]">
              {themeMode === 'festive' ? (
                <Flame className="w-4 h-4 text-[#D97706]" />
              ) : (
                <Award className="w-4 h-4 text-[#D97706]" />
              )}
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-[#1C1917] block leading-tight">
                  {themeMode === 'festive' ? 'Pure Brass' : 'Artisanal Craft'}
                </span>
                <span className="text-[8px] sm:text-[10px] text-[#78716C] block leading-tight">
                  Heirloom Quality
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
              <QrCode className="w-4 h-4 text-[#B45309]" />
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-[#1C1917] block leading-tight">
                  Direct UPI
                </span>
                <span className="text-[8px] sm:text-[10px] text-[#78716C] block leading-tight">
                  Zero Surcharge
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Trending Products — STRICT 2-COLUMN MOBILE GRID */}
      {homepageSections.showTrendingProducts && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-[#B45309] rounded-full" />
              <h2 className="font-serif-luxury text-base sm:text-xl font-bold text-[#1C1917]">
                {themeMode === 'festive' ? 'Trending Festive Picks' : 'Trending Now'}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('shop')}
              className="text-[11px] sm:text-xs font-bold text-[#78350F] hover:text-[#92400E] flex items-center gap-0.5"
            >
              <span>See All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 3. Shop By Category (Visual Tiles) */}
      {homepageSections.showShopByCategory && activeCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-[#D97706] rounded-full" />
              <h2 className="font-serif-luxury text-base sm:text-xl font-bold text-[#1C1917]">
                Shop by Category
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
            {activeCategories.slice(0, 8).map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white p-2 rounded-xl border border-[#E7DECD] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF4E8] active:scale-95 transition-all shadow-2xs"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF4E8] flex items-center justify-center text-[#78350F] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-[#292524] line-clamp-1 leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Promotional Banner (Controlled from Admin) */}
      {homepageSections.showPromotionalBanner && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div
            onClick={() => setActiveTab('shop')}
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-[#292524] via-[#44403C] to-[#1C1917] text-white p-5 sm:p-8 relative overflow-hidden shadow-md flex items-center justify-between"
          >
            <div className="relative z-10 max-w-sm space-y-1">
              <span className="text-[10px] font-bold text-[#FDE68A] uppercase tracking-widest block">
                {themeMode === 'festive' ? 'Festive Season Offer' : 'Curated Living'}
              </span>
              <h3 className="font-serif-luxury text-base sm:text-2xl font-bold leading-tight">
                Crafted for Every Space & Moment
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-300">
                Ethical handcrafted decor and artisanal designs delivered all across India.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FDE68A] underline">
                  Explore The Collection <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-full bg-[#FAF4E8]/10 items-center justify-center border border-[#FAF4E8]/20">
              <Sparkles className="w-8 h-8 text-[#FDE68A]" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Featured Collection — STRICT 2-COLUMN MOBILE GRID */}
      {homepageSections.showFeaturedProducts && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-4 bg-[#78350F] rounded-full" />
              <h2 className="font-serif-luxury text-base sm:text-xl font-bold text-[#1C1917]">
                Featured Collection
              </h2>
            </div>
            <span className="text-[10px] sm:text-xs text-[#78716C]">
              {featuredProducts.length} Items
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. All-India Delivery Trust Strip */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-[#FAF4E8] p-3 rounded-xl border border-[#E7DECD] text-center text-xs text-[#78350F]">
          <span className="font-bold block mb-0.5">
            {shippingSettings.deliveryNoticeText || '🚚 We deliver across India'}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[#78716C]">
            Safe door-to-door courier service · All Indian States & Union Territories supported
          </span>
        </div>
      </div>

    </div>
  );
};
