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

export const CategoryBar: React.FC = () => {
  const { storeCategories, activeCategory, setActiveCategory, setActiveTab } = useApp();

  const activeCategories = storeCategories.filter((c) => c.enabled);

  const handleSelectCategory = (catName: string) => {
    setActiveCategory(catName);
    setActiveTab('shop');
  };

  return (
    <div className="bg-white border-b border-[#E7DECD] py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Horizontal scrollable category row */}
        <div className="flex items-center gap-3.5 sm:gap-6 overflow-x-auto scrollbar-none pb-0.5 -mx-2 px-2 scroll-smooth">
          {activeCategories.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Sparkles;
            const isSelected =
              activeCategory === cat.name || (cat.name === 'All' && activeCategory === 'All');

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.name)}
                className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none"
              >
                {/* Compact circular/rounded category card */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-[#78350F] to-[#B45309] text-white ring-2 ring-[#D97706] ring-offset-2 scale-105 shadow-sm'
                      : 'bg-[#FAF4E8] text-[#78350F] group-hover:bg-[#F5EEDC] group-active:scale-95 border border-[#E7DECD]'
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2]" />
                </div>

                {/* Category label */}
                <span
                  className={`text-[10px] sm:text-xs font-medium whitespace-nowrap tracking-tight transition-colors ${
                    isSelected
                      ? 'font-bold text-[#78350F]'
                      : 'text-[#44403C] group-hover:text-[#92400E]'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
