import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { products, storeCategories, activeCategory, setActiveCategory, searchQuery, setSearchQuery } = useApp();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const activeCategories = storeCategories.filter((c) => c.enabled);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          activeCategory === 'All' ||
          p.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStock = inStockOnly ? p.stockStatus !== 'out_of_stock' : true;
        const isVisible = p.enabled !== false;
        return isVisible && matchesCategory && matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [products, activeCategory, searchQuery, sortBy, inStockOnly]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 animate-in fade-in duration-200">
      
      {/* Search & Sort Controls Bar */}
      <div className="bg-white p-3 rounded-xl border border-[#E7DECD] shadow-2xs mb-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search home decor, fashion, gifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-xs rounded-lg border border-[#D7CDBB] bg-[#FAF7F2] focus:outline-none focus:border-[#78350F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-[#A8A29E] hover:text-[#1C1917]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {activeCategories.map((cat) => {
            const isSelected =
              activeCategory === cat.name || (cat.name === 'All' && activeCategory === 'All');
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#78350F] text-white shadow-2xs'
                    : 'bg-[#FAF7F2] text-[#57534E] hover:bg-[#F5EEDC]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Sort and In-Stock Row */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F5EEDC] text-xs">
          <div className="flex items-center gap-1 text-[#78716C]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-[#1C1917] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs text-[#57534E] cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#78350F] focus:ring-[#78350F]"
            />
            <span className="font-medium text-[11px]">In-Stock Only</span>
          </label>
        </div>
      </div>

      {/* Result Count and Active Filters */}
      <div className="flex items-center justify-between mb-3 text-xs text-[#78716C] px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> items in{' '}
          <strong className="text-[#78350F]">{activeCategory}</strong>
        </span>
        {(activeCategory !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
            }}
            className="text-[11px] text-[#B45309] font-bold hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* 2-COLUMN MOBILE PRODUCT GRID (3 on tablet, 4 on desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7DECD] p-8 text-center text-[#78716C] my-4">
          <h3 className="font-serif-luxury text-base font-bold text-[#1C1917]">
            No products found
          </h3>
          <p className="text-xs text-[#78716C] mt-1">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setInStockOnly(false);
            }}
            className="mt-3 px-4 py-2 rounded-xl bg-[#78350F] text-white text-xs font-semibold"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
