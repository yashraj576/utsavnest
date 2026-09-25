import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { Search, Package, Clock, CheckCircle2, Truck, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { orders, setActiveTab } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    const matched = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQuery ||
        o.customer.email.toLowerCase() === cleanQuery ||
        (Boolean(o.customer.phone) && o.customer.phone.includes(cleanQuery)) ||
        (Boolean(o.utrNumber) && o.utrNumber!.toLowerCase().includes(cleanQuery))
    );
    setSearchResult(matched || null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'Delivered':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Cancelled':
        return 'bg-stone-100 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const ordersToShow = searched
    ? searchResult
      ? [searchResult]
      : []
    : orders;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-5 animate-in fade-in duration-200 space-y-4">
      
      {/* Header */}
      <div>
        <h1 className="font-serif-luxury text-xl font-bold text-[#1C1917]">
          My Orders
        </h1>
        <p className="text-xs text-[#78716C]">
          Track live verification, packing and express courier dispatch across India
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID (e.g. UN-2026-9812) or Email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#D7CDBB] bg-white text-xs focus:outline-none focus:border-[#78350F]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#78350F] text-white text-xs font-bold shrink-0"
        >
          Track
        </button>
        {searched && (
          <button
            type="button"
            onClick={() => {
              setSearched(false);
              setQuery('');
              setSearchResult(null);
            }}
            className="px-3 py-2 rounded-xl bg-stone-200 text-stone-700 text-xs font-semibold"
          >
            Clear
          </button>
        )}
      </form>

      {/* Orders List */}
      {ordersToShow.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7DECD] p-8 text-center text-[#78716C]">
          <Package className="w-10 h-10 text-[#B45309]/50 mx-auto mb-2" />
          <h3 className="font-serif-luxury font-bold text-base text-[#1C1917]">
            {searched ? 'No matching order found' : 'No placed orders yet'}
          </h3>
          <p className="text-xs text-[#78716C] mt-1">
            {searched
              ? 'Please check your Order ID number or telephone number'
              : 'Browse our festive collection to place your first handcrafted order!'}
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="mt-3 px-4 py-2 rounded-xl bg-[#78350F] text-white text-xs font-bold"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ordersToShow.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#E7DECD] p-3.5 sm:p-4 shadow-2xs space-y-3"
            >
              {/* Top row */}
              <div className="flex items-center justify-between border-b border-[#F5EEDC] pb-2.5">
                <div>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#1C1917] block">
                    {order.id}
                  </span>
                  <span className="text-[10px] text-[#A8A29E]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    ● {order.status}
                  </span>
                  <span className="font-mono font-bold text-xs text-[#78350F] block mt-0.5">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                {order.items.map((it) => (
                  <div key={it.product.id} className="flex items-center gap-2 text-xs">
                    <img
                      src={it.product.image}
                      alt={it.product.title}
                      className="w-8 h-8 rounded bg-[#FAF4E8] object-contain border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1C1917] truncate">{it.product.title}</p>
                      <p className="text-[10px] text-[#78716C]">Qty: {it.quantity}</p>
                    </div>
                    <span className="font-mono font-semibold text-xs">
                      ₹{it.product.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Status Note or Shipping */}
              <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E7DECD]/60 text-xs text-[#57534E] space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Payment Method:</span>
                  <span className="font-bold text-[#78350F]">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI / Online Payment'}
                  </span>
                </div>
                {order.paymentMethod === 'UPI' && order.utrNumber && (
                  <div className="flex justify-between text-[11px]">
                    <span>UTR Reference:</span>
                    <span className="font-mono font-bold text-[#1C1917]">{order.utrNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] text-[#15803D] font-bold">
                  <span>Delivery Fee:</span>
                  <span className="font-mono">₹0 (FREE Delivery)</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>Delivering To:</span>
                  <span className="font-semibold text-[#1C1917] truncate max-w-[240px]">
                    {order.customer.fullName}, {order.customer.city} ({order.customer.pinCode})
                  </span>
                </div>
                {order.statusNotes ? (
                  <p className="text-[10px] text-[#B45309] font-medium pt-1 border-t border-[#E7DECD]/50">
                    ℹ️ {order.statusNotes}
                  </p>
                ) : order.status === 'Rejected' ? (
                  <p className="text-[10px] text-rose-700 font-medium pt-1 border-t border-rose-100">
                    ❌ This order has been declined by the merchant.
                  </p>
                ) : order.status === 'Cancelled' ? (
                  <p className="text-[10px] text-stone-600 font-medium pt-1 border-t border-stone-200">
                    ⚠️ This order has been cancelled.
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
