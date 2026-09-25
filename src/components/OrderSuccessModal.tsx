import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  Package,
  ArrowRight,
  ShieldCheck,
  Banknote,
  QrCode,
  MapPin,
} from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { completedOrder, setCompletedOrder, setActiveTab } = useApp();

  if (!completedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#FAF7F2] rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-[#E7DECD] shadow-2xl relative p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Success Header */}
        <div className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#15803D] to-[#22C55E] mx-auto flex items-center justify-center text-white shadow-lg shadow-green-600/30 mb-3 animate-bounce">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Thank You</span>
          </div>

          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#1C1917]">
            Order Placed Successfully!
          </h2>
          <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
            Your order has been recorded with <span className="font-semibold text-[#78350F]">UtsavNest</span>. We are preparing your pieces for doorstep dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="mt-5 bg-white p-4 sm:p-5 rounded-2xl border border-[#E7DECD] space-y-3.5">
          {/* Order ID & Status */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F5EEDC]">
            <div>
              <span className="text-[10px] text-[#78716C] block uppercase font-bold">Order ID</span>
              <span className="font-mono font-bold text-sm text-[#1C1917]">{completedOrder.id}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#78716C] block uppercase font-bold">Order Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D97706] bg-[#FFFBEB] px-2.5 py-0.5 rounded-full border border-[#FDE68A]">
                ● {completedOrder.status}
              </span>
            </div>
          </div>

          {/* Payment Method & Delivery Fee */}
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E7DECD] text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#78716C] flex items-center gap-1">
                {completedOrder.paymentMethod === 'COD' ? (
                  <Banknote className="w-3.5 h-3.5 text-[#78350F]" />
                ) : (
                  <QrCode className="w-3.5 h-3.5 text-[#78350F]" />
                )}
                <span>Payment Method:</span>
              </span>
              <span className="font-bold text-[#78350F]">
                {completedOrder.paymentMethod === 'COD'
                  ? 'Cash on Delivery (COD)'
                  : 'UPI / Online Payment'}
              </span>
            </div>

            {completedOrder.paymentMethod === 'UPI' && completedOrder.utrNumber && (
              <div className="flex justify-between">
                <span className="text-[#78716C]">UTR Reference:</span>
                <span className="font-mono font-bold text-[#1C1917]">{completedOrder.utrNumber}</span>
              </div>
            )}

            <div className="flex justify-between text-[#15803D] font-bold">
              <span>Delivery Fee:</span>
              <span className="font-mono">₹0 (FREE Delivery)</span>
            </div>

            <div className="flex justify-between font-bold text-[#1C1917] pt-1 border-t border-[#E7DECD]/60">
              <span>Total Amount:</span>
              <span className="font-mono text-[#78350F] text-sm">
                ₹{completedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Products Summary */}
          <div>
            <span className="text-[11px] font-bold text-[#44403C] uppercase tracking-wider block mb-2">
              Ordered Products ({completedOrder.items.reduce((s, it) => s + it.quantity, 0)} items):
            </span>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {completedOrder.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <div className="w-10 h-10 rounded-lg bg-[#FAF4E8] p-1 border border-stone-200 shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1C1917] truncate">{item.product.title}</p>
                    <p className="text-[11px] text-[#78716C]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-[#78350F]">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="pt-3 border-t border-[#F5EEDC] text-xs text-[#78716C] space-y-1">
            <span className="font-bold text-[#292524] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Delivery Address:</span>
            </span>
            <p className="text-[#1C1917] font-semibold">{completedOrder.customer.fullName}</p>
            <p className="text-[#57534E]">
              {completedOrder.customer.building ? `${completedOrder.customer.building}, ` : ''}
              {completedOrder.customer.street ? `${completedOrder.customer.street}, ` : ''}
              {completedOrder.customer.city}, {completedOrder.customer.state} -{' '}
              <span className="font-mono">{completedOrder.customer.pinCode}</span>
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-4 flex items-center gap-2 text-xs text-[#78716C] bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A]">
          <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            {completedOrder.paymentMethod === 'COD'
              ? 'Our courier partner will deliver to your doorstep. Keep cash or UPI ready at delivery.'
              : 'Our team will verify your UPI UTR reference and dispatch within 24 hours.'}
          </span>
        </div>

        {/* Action Buttons: Continue Shopping & View My Orders */}
        <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              setCompletedOrder(null);
              setActiveTab('orders');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#D7CDBB] hover:bg-[#FAF4E8] text-[#78350F] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </button>

          <button
            onClick={() => {
              setCompletedOrder(null);
              setActiveTab('shop');
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
          </button>
        </div>
      </div>
    </div>
  );
};
