import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    formatPrice,
    setIsCheckoutOpen,
    showToast,
  } = useMarketplace();

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState<string>('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'AAINA10') {
      setDiscountPercent(10);
      showToast('10% VIP Launch Discount Applied!', 'success');
    } else {
      setPromoError('Invalid promo code. Try "AAINA10"');
    }
  };

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const finalTotal = cartSubtotal - discountAmount;
  const freeShippingThreshold = 200;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#6C2BD9]" />
            <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-semibold">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700">
              {amountToFreeShipping === 0
                ? '🎉 You unlocked Free Express Shipping!'
                : `Add ${formatPrice(amountToFreeShipping)} more for Free Shipping`}
            </span>
            <span className="font-mono text-slate-500">
              {Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.5] text-slate-300" />
              <p className="text-sm font-medium text-slate-600">“Your mirror’s empty. Go find something.”</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl hover:bg-[#6C2BD9] transition-colors cursor-pointer"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-sm"
              >
                <img
                  src={item.product.media.primary_image}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.selectedVariant.name} · Size {item.selectedVariant.size}
                    </div>

                    {/* VTO Attribution Tag if item was tried on */}
                    {item.try_on_session_id && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6C2BD9] bg-[#E9DEFB]/40 px-2 py-0.5 rounded-md mt-1">
                        <Sparkles className="w-3 h-3 text-[#00C2FF]" />
                        <span>VTO Fit Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer font-mono"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer font-mono"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-900">
                      {formatPrice(item.selectedVariant.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code & Subtotal Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50/70 space-y-4">
            {/* Promo Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo (try AAINA10)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C2BD9] uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-[#6C2BD9] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="text-[11px] text-red-500 font-medium">{promoError}</p>}
            {discountPercent > 0 && (
              <p className="text-[11px] text-[#00D68F] font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>AAINA10 Applied (-{discountPercent}%)</span>
              </p>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-900">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#00D68F]">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-mono font-semibold">
                    -{formatPrice(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-semibold text-slate-900">
                  {amountToFreeShipping === 0 ? 'FREE' : formatPrice(15)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total</span>
                <span className="font-mono font-extrabold text-base text-[#6C2BD9]">
                  {formatPrice(finalTotal + (amountToFreeShipping === 0 ? 0 : 15))}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#6C2BD9] to-[#00C2FF] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D68F]" />
              <span>PCI-DSS AES-256 Encrypted Aaina Pay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
