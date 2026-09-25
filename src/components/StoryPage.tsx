import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export const StoryPage: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-300 space-y-16">
      
      {/* Hero Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Generations of Indian Heritage</span>
        </div>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#1C1917] tracking-tight">
          The Soul of UtsavNest
        </h1>
        <p className="text-base text-[#57534E] max-w-2xl mx-auto leading-relaxed">
          UtsavNest was born from a desire to return reverence and authenticity to our festive celebrations — replacing disposable plastics with heirloom metals, pure silks, and sacred brass crafted by hand.
        </p>
      </div>

      {/* Chapter 1: Moradabad Brass Casting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-[#E7DECD] shadow-xs">
        <div className="space-y-4">
          <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider">
            01. The Metal of Kings
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold text-[#1C1917]">
            Hand-Forged in the City of Brass
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Every Uruli, Diya, and Lantern in our collection begins in traditional clay furnace pits in Moradabad, Uttar Pradesh. Generational artisans melt high-grade virgin brass, pour it into hand-carved sand casts, and hand-chisel every peacock feather and floral petal.
          </p>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
            Unlike machine-stamped decor, these heavy brass vessels develop a warm golden patina over decades, becoming heirlooms you pass down to your children.
          </p>
        </div>

        <div className="aspect-[4/3] rounded-2xl bg-[#FAF4E8] p-6 border border-[#E7DECD] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#78350F] text-[#FDE68A] flex items-center justify-center mb-3 shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-[#1C1917]">
            100% Solid Cast Brass
          </h3>
          <p className="text-xs text-[#78716C] mt-1 max-w-xs">
            Certified lead-free, heavy-gauge virgin brass finished with antique gold lacquer to resist tarnishing under diya oils and water.
          </p>
        </div>
      </div>

      {/* Chapter 2: Ethical Trade & Direct UPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E7DECD] space-y-3">
          <HeartHandshake className="w-6 h-6 text-[#B45309]" />
          <h3 className="font-serif-luxury text-base font-bold text-[#1C1917]">Fair Artisan Wages</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            We work directly with 32 master craftsman families, ensuring fair compensation and preserving ancestral sculpting crafts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7DECD] space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#B45309]" />
          <h3 className="font-serif-luxury text-base font-bold text-[#1C1917]">Direct UPI Economy</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            By avoiding commercial automated payment gateways, 100% of your money funds the authentic craft and materials rather than middlemen fees.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E7DECD] space-y-3">
          <Sparkles className="w-6 h-6 text-[#B45309]" />
          <h3 className="font-serif-luxury text-base font-bold text-[#1C1917]">Zero-Waste Packaging</h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            All orders ship in reusable festive rigid boxes, cushioned with recycled honeycomb paper and dried marigold potpourri.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-8 border-t border-[#E7DECD]">
        <button
          onClick={() => setActiveTab('shop')}
          className="px-8 py-3.5 rounded-2xl bg-[#78350F] hover:bg-[#92400E] text-white text-sm font-bold shadow-lg shadow-[#78350F]/20 inline-flex items-center gap-2"
        >
          <span>Explore The Curated Collection</span>
          <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
        </button>
      </div>

    </div>
  );
};
