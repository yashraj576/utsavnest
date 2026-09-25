import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Heart, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setActiveCategory } = useApp();

  const handleCategoryNav = (cat: string) => {
    setActiveCategory(cat);
    setActiveTab('shop');
  };

  return (
    <footer className="bg-[#292524] text-[#E7DECD] border-t border-[#44403C] mt-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Brand Info */}
          <div className="space-y-2">
            <span className="font-brand text-xl font-bold tracking-wider text-[#FDE68A] block">
              UtsavNest
            </span>
            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Heirloom festive living and sacred brass handcrafted in Moradabad & Jaipur.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#FDE68A] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
              <span>100% Solid Brass Guaranteed</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2">
            <h4 className="font-serif-luxury text-xs font-bold text-white uppercase tracking-wider">
              Curated Collections
            </h4>
            <ul className="space-y-1.5 text-xs text-[#D6D3D1]">
              <li>
                <button
                  onClick={() => handleCategoryNav('Home Decor')}
                  className="hover:text-[#FDE68A] transition-colors"
                >
                  Home Decor & Brass
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('Fashion')}
                  className="hover:text-[#FDE68A] transition-colors"
                >
                  Handloom Fashion
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('Gifts')}
                  className="hover:text-[#FDE68A] transition-colors"
                >
                  Artisanal Gifting
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryNav('All')}
                  className="hover:text-[#FDE68A] transition-colors"
                >
                  View All Products
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-2">
            <h4 className="font-serif-luxury text-xs font-bold text-white uppercase tracking-wider">
              Patron Care
            </h4>
            <ul className="space-y-1.5 text-xs text-[#D6D3D1]">
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="hover:text-[#FDE68A] transition-colors"
                >
                  Track Your Delivery
                </button>
              </li>
              <li>
                <span className="text-[#A8A29E]">Email: care@utsavnest.com</span>
              </li>
              <li>
                <span className="text-[#A8A29E]">🚚 Free Delivery Across India</span>
              </li>
              <li>
                <span className="text-[#A8A29E]">Dispatches within 24 Hours</span>
              </li>
            </ul>
          </div>

          {/* Direct UPI Payment Trust */}
          <div className="space-y-2 bg-[#1C1917] p-3.5 rounded-xl border border-[#44403C]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FDE68A]">
              <QrCode className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Direct UPI Payment</span>
            </div>
            <p className="text-[11px] text-[#A8A29E] leading-tight">
              Pay via Google Pay, PhonePe, Paytm, or BHIM. Zero payment gateway charges.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-[#D6D3D1] font-mono pt-1">
              <span className="bg-[#292524] px-1.5 py-0.5 rounded border border-[#44403C]">GPay</span>
              <span className="bg-[#292524] px-1.5 py-0.5 rounded border border-[#44403C]">PhonePe</span>
              <span className="bg-[#292524] px-1.5 py-0.5 rounded border border-[#44403C]">Paytm</span>
              <span className="bg-[#292524] px-1.5 py-0.5 rounded border border-[#44403C]">BHIM</span>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-[#44403C] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#A8A29E] gap-2 text-center sm:text-left">
          <p>© 2026 UtsavNest Artisanal Living. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#DC2626] fill-current" /> for Indian Festive Celebrations
          </p>
        </div>
      </div>
    </footer>
  );
};
