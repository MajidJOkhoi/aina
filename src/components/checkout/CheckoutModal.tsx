import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  Sparkles,
  ArrowRight,
  Banknote,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    formatPrice,
    currency,
    createOrder,
    user,
    showToast,
  } = useMarketplace();

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'Aaina Pay' | 'Credit Card' | 'Klarna BNPL' | 'Cash on Delivery'>('Aaina Pay');

  const [fullName, setFullName] = useState(user.name);
  const [street, setStreet] = useState('420 Orchard Street, Suite 5B');
  const [city, setCity] = useState('San Francisco, CA');
  const [postalCode, setPostalCode] = useState('94103');
  const [country, setCountry] = useState('United States');

  if (!isCheckoutOpen) return null;

  const shippingCost = cartSubtotal > 200 ? 0 : 15;
  const finalTotal = cartSubtotal + shippingCost;
  const installmentAmount = finalTotal / 4;

  const handleCompleteOrder = () => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6C2BD9', '#00C2FF', '#FF3D71', '#00D68F'],
    });

    const orderItems = cart.map(item => ({
      product_id: item.product.id,
      title: item.product.title,
      variant_sku: item.selectedVariant.sku,
      variant_desc: `${item.selectedVariant.name} · Size ${item.selectedVariant.size}`,
      image_url: item.product.media.primary_image,
      qty: item.quantity,
      price: item.selectedVariant.price,
      try_on_session_id: item.try_on_session_id,
    }));

    createOrder({
      buyer_id: user.id,
      buyer_name: fullName,
      buyer_email: user.email,
      items: orderItems,
      status: 'Processing',
      payment_status: paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Paid',
      payment_method: paymentMethod,
      currency,
      subtotal: cartSubtotal,
      discount: 0,
      shipping: shippingCost,
      total: finalTotal,
      shipping_address: {
        fullName,
        street,
        city,
        postalCode,
        country,
      },
    });

    showToast('“It’s yours. And it looks great on you.” Order placed!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Aaina Pay Secure Checkout</h2>
              <p className="text-[11px] text-slate-500">256-bit Encrypted · Order Guarantee</p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setStep('details')}
            className={`flex items-center gap-2 cursor-pointer ${
              step === 'details' ? 'text-[#6C2BD9]' : 'text-slate-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-[#6C2BD9] text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Delivery Address</span>
          </button>

          <span className="text-slate-300">———</span>

          <button
            onClick={() => setStep('payment')}
            className={`flex items-center gap-2 cursor-pointer ${
              step === 'payment' ? 'text-[#6C2BD9]' : 'text-slate-500'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 'payment' ? 'bg-[#6C2BD9] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span>Payment Method</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {step === 'details' ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Where should we deliver?</h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City / State
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={e => setPostalCode(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Select Payment Method</h3>

              {/* Payment Methods Options */}
              <div className="space-y-2.5">
                {/* 1. Aaina Pay 1-Click */}
                <div
                  onClick={() => setPaymentMethod('Aaina Pay')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Aaina Pay'
                      ? 'border-[#6C2BD9] bg-[#E9DEFB]/20 ring-2 ring-[#6C2BD9]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] flex items-center justify-center text-white font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Aaina Pay 1-Click</div>
                      <div className="text-[11px] text-slate-500">Biometric tokenized instant express</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00D68F] uppercase bg-[#00D68F]/10 px-2 py-0.5 rounded">
                    Fastest
                  </span>
                </div>

                {/* 2. Credit / Debit Card */}
                <div
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Credit Card'
                      ? 'border-[#6C2BD9] bg-[#E9DEFB]/20 ring-2 ring-[#6C2BD9]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-slate-700 p-1 bg-slate-100 rounded-lg" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Credit / Debit Card</div>
                      <div className="text-[11px] text-slate-500">Visa, Mastercard, Amex via Stripe</div>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>

                {/* 3. Klarna BNPL (PRD Section 6.4) */}
                <div
                  onClick={() => setPaymentMethod('Klarna BNPL')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Klarna BNPL'
                      ? 'border-[#6C2BD9] bg-[#E9DEFB]/20 ring-2 ring-[#6C2BD9]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center">
                      Kl.
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Klarna 4-Pay BNPL</div>
                      <div className="text-[11px] text-slate-500">
                        4 interest-free payments of {formatPrice(installmentAmount)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600">0% APR</span>
                </div>

                {/* 4. Cash on Delivery (COD) per Retail guidelines */}
                <div
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#6C2BD9] bg-[#E9DEFB]/20 ring-2 ring-[#6C2BD9]/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-8 h-8 text-emerald-600 p-1 bg-emerald-50 rounded-lg" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-slate-500">Pay cash upon verified doorstep arrival</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Available</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary Strip */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total ({cart.length})</span>
              <span className="font-mono">{formatPrice(cartSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-mono">{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
              <span>Amount Due</span>
              <span className="font-mono text-[#6C2BD9] text-base">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          {step === 'details' ? (
            <>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Bag
              </button>
              <button
                onClick={() => setStep('payment')}
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-[#6C2BD9] rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('details')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                &larr; Back to Address
              </button>
              <button
                onClick={handleCompleteOrder}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] hover:opacity-95 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Place Order</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
