import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CustomerDetails, PaymentMethod, INDIAN_STATES_AND_UTS } from '../types';
import {
  X,
  Copy,
  Check,
  UploadCloud,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Lock,
  Truck,
  Banknote,
  ShieldCheck,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSubtotal,
    upiSettings,
    placeOrder,
  } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [utrError, setUtrError] = useState<string | null>(null);

  // Customer mobile field is blank by default - NO unwanted/hardcoded phone number
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: '',
    phone: '',
    email: '',
    building: '',
    street: '',
    city: '',
    district: '',
    state: 'Delhi (NCT)',
    pinCode: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  if (!isCheckoutOpen) return null;

  // Delivery fee is ALWAYS ₹0 as per Requirement 11
  const deliveryFee = 0;
  const grandTotal = cartSubtotal; // Products Total + ₹0

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const validateStep1 = () => {
    const errors: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!customer.fullName.trim()) errors.fullName = 'Full Name is required';
    const cleanPhone = customer.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10)
      errors.phone = 'Valid 10-digit Indian mobile number required';
    if (!customer.email.trim() || !customer.email.includes('@'))
      errors.email = 'Valid email required for delivery updates';
    if (!customer.building.trim()) errors.building = 'House/Flat/Building is required';
    if (!customer.street.trim()) errors.street = 'Street/Area is required';
    if (!customer.city.trim()) errors.city = 'City/Town is required';
    if (!customer.district.trim()) errors.district = 'District is required';
    if (!customer.state.trim()) errors.state = 'Please select your State / UT';

    const cleanPin = customer.pinCode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      errors.pinCode = 'Valid 6-digit Indian PIN code required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setScreenshotError('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setScreenshotError('File exceeds 5MB limit');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setScreenshotData(uploadEvent.target?.result as string);
      setScreenshotError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFinalOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'UPI') {
      let hasError = false;
      const cleanedUtr = utrNumber.trim().replace(/\s/g, '');
      if (!cleanedUtr || cleanedUtr.length < 6) {
        setUtrError('Please enter your UTR/UPI transaction reference number');
        hasError = true;
      } else {
        setUtrError(null);
      }

      if (!screenshotData) {
        setScreenshotError('Please upload your payment screenshot');
        hasError = true;
      } else {
        setScreenshotError(null);
      }

      if (hasError) return;

      placeOrder(customer, 'UPI', { utr: cleanedUtr, screenshot: screenshotData });
    } else {
      // Cash on Delivery (COD) - Do not ask for UTR or screenshot
      placeOrder(customer, 'COD');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col border border-[#E7DECD] shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-[#E7DECD] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-brand text-base font-bold text-[#78350F]">UtsavNest</span>
              <span className="text-xs text-[#A8A29E]">·</span>
              <span className="text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                {step === 1 ? '1. All-India Shipping Address' : '2. Payment Method'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5">
          {/* STEP 1: Shipping Details */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-3">
              {/* Prominent All-India Free Delivery Banner */}
              <div className="bg-[#FAF4E8] p-2.5 rounded-xl border border-[#E7DECD] flex items-center justify-between text-xs text-[#78350F] font-bold">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B45309] shrink-0" />
                  <span>🚚 We deliver across all India</span>
                </div>
                <span className="bg-[#15803D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  FREE DELIVERY (₹0)
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                />
                {formErrors.fullName && (
                  <span className="text-[10px] text-[#DC2626]">{formErrors.fullName}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F] font-mono"
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.email && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.email}</span>
                  )}
                </div>
              </div>

              {/* House/Flat/Building and Street/Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    House / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.building}
                    onChange={(e) => setCustomer({ ...customer, building: e.target.value })}
                    placeholder="House/Flat/Building name & no."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.building && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.building}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    Street / Area / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.street}
                    onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                    placeholder="Street, locality or landmark"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.street && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.street}</span>
                  )}
                </div>
              </div>

              {/* City, District, State, PIN Code (All 28 Indian States & 8 UTs) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.city && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.district}
                    onChange={(e) => setCustomer({ ...customer, district: e.target.value })}
                    placeholder="District"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.district && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.district}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    State / UT *
                  </label>
                  <select
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    className="w-full px-2 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                  >
                    {INDIAN_STATES_AND_UTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pinCode}
                    onChange={(e) =>
                      setCustomer({ ...customer, pinCode: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="6-digit PIN"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white font-mono focus:outline-none focus:border-[#78350F]"
                  />
                  {formErrors.pinCode && (
                    <span className="text-[10px] text-[#DC2626]">{formErrors.pinCode}</span>
                  )}
                </div>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customer.notes || ''}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  placeholder="e.g. Ring bell or leave with security"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                />
              </div>

              {/* Order Summary with ZERO Delivery Fee */}
              <div className="pt-3 border-t border-[#E7DECD] space-y-1 text-xs">
                <div className="flex justify-between text-[#57534E]">
                  <span>Products Total:</span>
                  <span className="font-mono font-semibold text-[#1C1917]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#15803D] font-bold">
                  <span>Delivery Fee:</span>
                  <span className="font-mono">₹0 (FREE)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#78350F] pt-1 border-t border-[#F5EEDC]">
                  <span>Grand Total:</span>
                  <span className="font-mono">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Continue to Payment Method</span>
                  <ArrowRight className="w-4 h-4 text-[#FDE68A]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method Choice (COD or UPI) */}
          {step === 2 && (
            <form onSubmit={handleFinalOrderSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-[#44403C] uppercase tracking-wider mb-2">
                  Select Payment Choice:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'COD'
                        ? 'border-[#78350F] bg-[#FAF4E8] shadow-xs'
                        : 'border-[#E7DECD] bg-white hover:border-[#D7CDBB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#78350F] flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'COD'
                            ? 'border-[#78350F] bg-[#78350F]'
                            : 'border-stone-300'
                        }`}
                      >
                        {paymentMethod === 'COD' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#1C1917] block">Cash on Delivery</span>
                      <span className="text-[10px] text-[#78716C]">Pay at your doorstep</span>
                    </div>
                  </div>

                  {/* Option 2: UPI / Online Payment */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'UPI'
                        ? 'border-[#78350F] bg-[#FAF4E8] shadow-xs'
                        : 'border-[#E7DECD] bg-white hover:border-[#D7CDBB]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#78350F] flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'UPI'
                            ? 'border-[#78350F] bg-[#78350F]'
                            : 'border-stone-300'
                        }`}
                      >
                        {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-[#1C1917] block">UPI / Online</span>
                      <span className="text-[10px] text-[#78716C]">GPay / PhonePe / Paytm</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Amount Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#78350F] to-[#92400E] text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-[#FDE68A] uppercase font-bold block">
                    Total Amount Due
                  </span>
                  <span className="text-xl font-bold font-mono">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#FEF3C7] block">
                    (Products: ₹{cartSubtotal.toLocaleString('en-IN')} + Delivery: ₹0)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/80 block">Payment Method</span>
                  <span className="text-xs font-bold text-[#FDE68A]">
                    {paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Manual Payment'}
                  </span>
                </div>
              </div>

              {/* COD Content Details */}
              {paymentMethod === 'COD' && (
                <div className="bg-white p-4 rounded-2xl border border-[#E7DECD] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span>No Advance Payment Required</span>
                  </div>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    You can pay in cash or via UPI when the courier agent delivers your parcel to your address:{' '}
                    <strong>{customer.building}, {customer.street}, {customer.city} ({customer.pinCode})</strong>.
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#FAF4E8] text-[11px] text-[#78350F]">
                    ✓ No UTR number or payment screenshot needed for Cash on Delivery.
                  </div>
                </div>
              )}

              {/* UPI Content Details */}
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  {/* UPI QR & ID Display */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#E7DECD] flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-36 h-36 bg-[#FAF7F2] p-1.5 rounded-xl border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img
                        src={upiSettings.qrImage}
                        alt="UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="w-full space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#78716C] uppercase block">
                          Payee UPI ID:
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-xs font-bold text-[#1C1917] bg-[#FAF7F2] px-2 py-1 rounded border border-stone-200 truncate flex-1">
                            {upiSettings.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-2.5 py-1 rounded bg-[#78350F] text-[#FEF3C7] text-xs font-bold shrink-0"
                          >
                            {copiedUpi ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#57534E] bg-[#FFFBEB] p-2 rounded-lg border border-[#FDE68A]">
                        <p>1. Open Google Pay, PhonePe, Paytm or BHIM</p>
                        <p>2. Scan QR code or transfer ₹{grandTotal} to UPI ID</p>
                        <p>3. Enter 12-digit UTR and upload receipt screenshot below</p>
                      </div>
                    </div>
                  </div>

                  {/* UTR Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                      12-Digit UTR / UPI Reference No *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="Enter 12-digit UTR code"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#D7CDBB] bg-white focus:outline-none focus:border-[#78350F]"
                    />
                    {utrError && <p className="text-[10px] text-[#DC2626] mt-0.5">{utrError}</p>}
                  </div>

                  {/* Payment Screenshot Upload */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#44403C] uppercase tracking-wide mb-1">
                      Payment Screenshot Proof *
                    </label>

                    {screenshotData ? (
                      <div className="rounded-xl border border-[#15803D] bg-[#F0FDF4] p-2.5 flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded bg-white overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={screenshotData}
                            alt="Proof Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-[#15803D] block">
                            ✓ Screenshot Attached
                          </span>
                          <span className="text-[10px] text-[#166534]">
                            Ready to place order
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setScreenshotData('')}
                          className="text-xs text-[#DC2626] font-semibold px-2"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-[#D7CDBB] hover:border-[#78350F] rounded-xl p-3.5 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors">
                        <UploadCloud className="w-6 h-6 text-[#B45309] mb-1" />
                        <span className="text-xs font-bold text-[#78350F]">
                          Tap to Upload Payment Screenshot
                        </span>
                        <span className="text-[9px] text-[#A8A29E]">
                          JPG, PNG, WEBP supported
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                    {screenshotError && (
                      <p className="text-[10px] text-[#DC2626] mt-0.5">{screenshotError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 border-t border-[#E7DECD] flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-2.5 px-3 rounded-xl border border-[#D7CDBB] text-xs font-bold text-[#78350F] hover:bg-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#78350F] hover:bg-[#92400E] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  <Lock className="w-4 h-4 text-[#FDE68A]" />
                  <span>
                    {paymentMethod === 'COD'
                      ? 'Confirm & Place COD Order (₹0 Delivery)'
                      : 'Place Order with UPI Proof (₹0 Delivery)'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
