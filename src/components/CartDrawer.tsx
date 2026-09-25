import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag, Sparkles, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    calculateShippingFee,
    shippingSettings,
    setIsCheckoutOpen,
    setActiveTab,
  } = useApp();

  if (!isCartOpen) return null;

  const shippingFee = calculateShippingFee(cartSubtotal);
  const grandTotal = cartSubtotal + shippingFee;
  const threshold = shippingSettings.freeShippingThreshold;
  const amountNeeded = Math.max(0, threshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex w-full sm:max-w-md">
        <div className="w-full bg-[#FAF7F2] border-l border-[#E7DECD] shadow-2xl flex flex-col h-full">
          
          {/* Mobile Cart Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#E7DECD] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#B45309]" />
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-[#1C1917]">
                Shopping Bag
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAF4E8] text-[#78350F] border border-[#E7DECD]">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* All-India Free Delivery Banner */}
          <div className="bg-[#FAF4E8] p-2.5 sm:p-3 border-b border-[#E7DECD] text-[11px] sm:text-xs">
            <div className="flex items-center justify-between text-[#78350F] font-bold">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#B45309]" />
                <span>🚚 Free Delivery Across India</span>
              </div>
              <span className="text-[#15803D] bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                ₹0 Shipping
              </span>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#78716C]">
                <div className="w-14 h-14 rounded-full bg-[#FAF4E8] flex items-center justify-center text-[#B45309] mb-3">
                  <ShoppingBag className="w-7 h-7 opacity-50" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#292524]">
                  Your bag is empty
                </h3>
                <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                  Explore our curated home decor, fashion, and lifestyle collections.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('shop');
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#78350F] text-white text-xs font-bold"
                >
                  Explore Shop
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-2.5 sm:p-3 rounded-xl border border-[#E7DECD] flex gap-3 shadow-2xs items-center"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#FAF4E8] p-1 shrink-0 flex items-center justify-center border border-[#E7DECD]/50">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif-luxury text-xs sm:text-sm font-semibold text-[#1C1917] truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#A8A29E] hover:text-[#DC2626] p-0.5"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs sm:text-sm font-bold text-[#78350F] font-mono tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center border border-[#E7DECD] rounded-md bg-[#FAF7F2] overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#78350F] hover:bg-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#78350F] hover:bg-white font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-3.5 sm:p-4 border-t border-[#E7DECD] bg-white space-y-3">
              <div className="space-y-1 text-xs text-[#57534E]">
                <div className="flex justify-between">
                  <span>Products Subtotal</span>
                  <span className="font-mono font-semibold text-[#1C1917]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Delivery Fee</span>
                  <span className="font-mono">₹0 (FREE)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-1.5 border-t border-[#F5EEDC]">
                  <span>Grand Total</span>
                  <span className="text-[#78350F] font-mono">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <span>Proceed to Checkout (COD or UPI)</span>
                <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
