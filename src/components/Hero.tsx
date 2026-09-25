import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <div className="px-3 sm:px-6 lg:px-8 pt-3 pb-2">
      {/* Compact Festive Mobile Banner */}
      <div
        onClick={() => setActiveTab('shop')}
        className="cursor-pointer relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white shadow-md p-4 sm:p-6 flex items-center justify-between gap-4"
      >
        {/* Festive Background Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#F59E0B]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5 max-w-[65%] sm:max-w-md">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF4E8]/20 backdrop-blur-xs text-[#FEF3C7] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 text-[#FDE68A]" />
            <span>Diwali Special 2026</span>
          </div>

          <h2 className="font-serif-luxury text-base sm:text-2xl font-bold leading-tight">
            Sacred Brass & Festive Decor
          </h2>

          <p className="text-[11px] sm:text-xs text-[#FEF3C7]/90 leading-tight">
            Handcrafted Moradabad Urulis, Torans & Lanterns.
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#FDE68A] hover:underline">
              <span>Explore Offers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Small Festive Illustration preview */}
        <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#FEF08A]/30 to-[#F59E0B]/20 p-2 flex items-center justify-center border border-[#FDE68A]/30 shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <ellipse cx="50" cy="65" rx="35" ry="12" fill="#78350F" opacity="0.3"/>
              <path d="M 20 55 C 20 75, 80 75, 80 55 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5"/>
              <ellipse cx="50" cy="55" rx="30" ry="8" fill="#B45309"/>
              <circle cx="50" cy="40" r="10" fill="#FEF08A" opacity="0.5"/>
              <path d="M 50 25 C 44 38, 44 48, 50 52 C 56 48, 56 38, 50 25 Z" fill="#EA580C"/>
              <ellipse cx="50" cy="42" rx="2" ry="4" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
