import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Flame,
  Sun,
  Lamp,
  Flower2,
  Palette,
  Gift,
  Bell,
  Package,
  Home,
  Shirt,
  Watch,
  Coffee,
  Heart,
  Grid,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Sun,
  Lamp,
  Flower2,
  Palette,
  Gift,
  Bell,
  Package,
  Home,
  Shirt,
  Watch,
  Coffee,
  Heart,
  Grid,
};

export const CategoriesView: React.FC = () => {
  const { products, storeCategories, setActiveCategory, setActiveTab } = useApp();

  const activeCategories = storeCategories.filter((c) => c.enabled);

  const handleSelect = (categoryName: string) => {
    setActiveCategory(categoryName);
    setActiveTab('shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 animate-in fade-in duration-200">
      <div className="mb-4">
        <h1 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
          Shop by Category
        </h1>
        <p className="text-xs text-[#78716C]">
          Browse all curated collections and artisanal essentials
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {activeCategories.map((cat) => {
          const Icon = iconMap[cat.iconName] || Sparkles;
          const count =
            cat.name === 'All'
              ? products.length
              : products.filter((p) => p.category.toLowerCase() === cat.name.toLowerCase()).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelect(cat.name)}
              className="bg-white p-3.5 rounded-2xl border border-[#E7DECD] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF4E8] text-[#78350F] flex items-center justify-center border border-[#E7DECD]">
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#B45309]">
                  {count} items
                </span>
              </div>

              <div>
                <h3 className="font-serif-luxury font-bold text-sm text-[#1C1917] leading-tight">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#78350F] font-semibold flex items-center gap-1 mt-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
