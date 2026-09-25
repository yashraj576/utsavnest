import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Star, Heart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct, wishlistIds, toggleWishlist } = useApp();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = wishlistIds.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockStatus === 'out_of_stock') return;
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-xl sm:rounded-2xl border border-[#E7DECD] overflow-hidden flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-md transition-all duration-200 relative select-none"
    >
      {/* Product Image Slot: height ~160-190px on mobile */}
      <div className="relative w-full h-[160px] sm:h-[185px] bg-[#FAF4E8] overflow-hidden flex items-center justify-center p-2.5">
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Small Top Badge (e.g. Bestseller, 25% OFF, etc) */}
        {product.badge ? (
          <div className="absolute top-2 left-2 bg-[#92400E] text-[#FEF3C7] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight shadow-xs">
            {product.badge}
          </div>
        ) : discountPercent > 0 ? (
          <div className="absolute top-2 left-2 bg-[#DC2626] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded tracking-tight shadow-xs">
            {discountPercent}% OFF
          </div>
        ) : null}

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-[#78716C] hover:text-[#DC2626] transition-colors shadow-xs"
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
              isWishlisted ? 'fill-[#DC2626] text-[#DC2626]' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Out of Stock overlay if applicable */}
        {product.stockStatus === 'out_of_stock' && (
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-white text-[#78350F] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Compact Product Details */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] text-[#78716C] mb-1">
            <span className="font-semibold text-[#B45309] truncate max-w-[90px]">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-[#D97706] shrink-0">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span className="font-bold text-[#292524]">{product.rating}</span>
            </div>
          </div>

          {/* Product Title (2-line compact clamp) */}
          <h3 className="font-serif-luxury text-xs sm:text-sm font-semibold text-[#1C1917] line-clamp-2 leading-snug group-hover:text-[#92400E] transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Action Area */}
        <div className="mt-2 pt-2 border-t border-[#F5EEDC]">
          {/* Pricing Row */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-[#78350F] font-mono tabular-nums leading-none">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[10px] text-[#A8A29E] line-through font-mono tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[9px] font-bold text-[#16A34A]">
                {discountPercent}% off
              </span>
            )}
          </div>

          {/* Stock indication */}
          {product.stockStatus === 'low_stock' && (
            <span className="text-[9px] text-[#D97706] font-semibold block mt-0.5">
              Only few left
            </span>
          )}

          {/* Add to Cart button inside card */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockStatus === 'out_of_stock'}
            className={`mt-2 w-full py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.97] ${
              product.stockStatus === 'out_of_stock'
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : addedAnimation
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'bg-[#78350F] hover:bg-[#92400E] text-[#FEF3C7] shadow-2xs'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3 h-3 stroke-[3]" />
                <span className="text-[11px]">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 text-[#FDE68A]" />
                <span className="text-[11px]">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
