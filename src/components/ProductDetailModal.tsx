import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Zap,
  Check,
  Heart,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    setIsCheckoutOpen,
    wishlistIds,
    toggleWishlist,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedProduct) return null;

  const isWishlisted = wishlistIds.includes(selectedProduct.id);

  const discountPercent = Math.round(
    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100
  );

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-[#E7DECD] shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Controls */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className="p-2 rounded-full bg-white/90 text-[#78716C] shadow-sm hover:text-[#DC2626]"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#DC2626] text-[#DC2626]' : ''
              }`}
            />
          </button>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-2 rounded-full bg-white/90 text-[#1C1917] shadow-sm hover:bg-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 pb-24">
          {/* Large Product Image */}
          <div className="w-full aspect-[4/3] rounded-2xl bg-white p-4 border border-[#E7DECD] flex items-center justify-center relative shadow-2xs">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-full h-full object-contain"
            />
            {selectedProduct.badge && (
              <span className="absolute top-3 left-3 bg-[#78350F] text-[#FEF3C7] text-[10px] font-bold px-2 py-0.5 rounded tracking-tight">
                {selectedProduct.badge}
              </span>
            )}
          </div>

          {/* Details Section */}
          <div className="mt-4 space-y-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#B45309] uppercase tracking-wider">
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-1 text-[#D97706]">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold text-[#1C1917]">{selectedProduct.rating}</span>
                <span className="text-[#78716C]">({selectedProduct.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#1C1917] leading-snug">
              {selectedProduct.title}
            </h2>

            {/* Pricing Banner */}
            <div className="bg-white p-3 rounded-xl border border-[#E7DECD] flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-[#78350F] font-mono tabular-nums">
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-xs text-[#A8A29E] line-through font-mono tabular-nums">
                      ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs font-bold text-[#16A34A]">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#16A34A] font-medium block mt-0.5">
                  ✓ Free delivery across all India on all orders (₹0 Delivery)
                </span>
              </div>

              {/* Stock Status Tag */}
              <div className="text-right">
                {selectedProduct.stockStatus === 'in_stock' && (
                  <span className="text-[11px] font-semibold text-[#16A34A] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    In Stock
                  </span>
                )}
                {selectedProduct.stockStatus === 'low_stock' && (
                  <span className="text-[11px] font-semibold text-[#D97706] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Few Left
                  </span>
                )}
                {selectedProduct.stockStatus === 'out_of_stock' && (
                  <span className="text-[11px] font-semibold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-[#E7DECD]">
              <span className="text-xs font-semibold text-[#44403C]">Select Quantity:</span>
              <div className="flex items-center border border-[#D7CDBB] rounded-lg bg-[#FAF7F2] overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || selectedProduct.stockStatus === 'out_of_stock'}
                  className="px-3 py-1 text-xs text-[#78350F] hover:bg-white font-bold disabled:opacity-40"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold font-mono tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={selectedProduct.stockStatus === 'out_of_stock'}
                  className="px-3 py-1 text-xs text-[#78350F] hover:bg-white font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                Craft Details
              </span>
              <p className="text-xs text-[#44403C] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#E7DECD]">
              <div>
                <span className="text-[#78716C] block text-[10px]">Dimensions:</span>
                <span className="font-semibold text-[#1C1917] text-[11px]">{selectedProduct.dimensions}</span>
              </div>
              <div>
                <span className="text-[#78716C] block text-[10px]">Material:</span>
                <span className="font-semibold text-[#1C1917] text-[11px]">{selectedProduct.material}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-[#78716C] pt-2">
              <div className="flex flex-col items-center gap-0.5">
                <Truck className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Express Dispatch</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Pure Metal Cert</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <RotateCcw className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Transit Safe</span>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY BOTTOM ACTION BAR ON MOBILE */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E7DECD] p-3 shadow-lg flex items-center gap-2 safe-area-bottom z-30">
          <button
            onClick={handleAddToCart}
            disabled={selectedProduct.stockStatus === 'out_of_stock'}
            className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedProduct.stockStatus === 'out_of_stock'
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : added
                ? 'bg-[#15803D] text-white'
                : 'bg-[#FAF4E8] text-[#78350F] border border-[#78350F]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#B45309]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={selectedProduct.stockStatus === 'out_of_stock'}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#92400E] via-[#B45309] to-[#78350F] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Zap className="w-4 h-4 text-[#FDE68A]" />
            <span>Buy Now (UPI)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
