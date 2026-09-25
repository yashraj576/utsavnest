import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, Search, ShoppingBag, PackageCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, cartCount, setIsCartOpen } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'shop', label: 'Search', icon: Search },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, isCart: true },
    { id: 'orders', label: 'Orders', icon: PackageCheck },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isCart) {
      setIsCartOpen(true);
    } else {
      setActiveTab(item.id as any);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-[#E7DECD] shadow-lg py-1 px-2 safe-area-bottom md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#78350F]'
                  : 'text-[#78716C] hover:text-[#292524]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'
                  }`}
                />
                {item.isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#EA580C] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-bold text-[#78350F]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#78350F] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
