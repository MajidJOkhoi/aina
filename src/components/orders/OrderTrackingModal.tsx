import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Download,
  RotateCcw,
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    selectedTrackingOrder,
    formatPrice,
    startMirrorTryOn,
    products,
    showToast,
  } = useMarketplace();

  if (!isOrderTrackingOpen || !selectedTrackingOrder) return null;

  const order = selectedTrackingOrder;

  const steps = [
    { label: 'Order Confirmed', completed: true, time: 'Oct 11, 2026' },
    { label: 'Quality Fitting & Packed', completed: order.status !== 'Processing', time: 'In Warehouse' },
    { label: 'Shipped (Express)', completed: order.status === 'Shipped' || order.status === 'Delivered', time: 'Carrier Transit' },
    { label: 'Delivered', completed: order.status === 'Delivered', time: 'Estimated 2 Days' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 relative my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00D68F]/10 text-[#00D68F] flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Order #{order.id}</h2>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Tracking: {order.tracking_number}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celebratory Tagline per PRD 2.7 */}
        <div className="bg-gradient-to-r from-[#6C2BD9]/10 via-[#00C2FF]/10 to-transparent p-4 border-b border-slate-100">
          <p className="text-xs font-bold text-[#6C2BD9]">
            “It’s yours. And it looks great on you.”
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Your items are being prepped with our zero-guess fit inspection.
          </p>
        </div>

        {/* Progress Timeline */}
        <div className="p-6 border-b border-slate-100">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                    st.completed
                      ? 'bg-[#00D68F] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {st.completed ? '✓' : idx + 1}
                </div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  {st.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{st.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Items in this Shipment
          </h3>

          {order.items.map((item, idx) => {
            const productRef = products.find(p => p.id === item.product_id);
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl bg-white border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.variant_desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {formatPrice(item.price * item.qty)} (Qty: {item.qty})
                      </span>
                      {item.try_on_session_id && (
                        <span className="text-[10px] text-[#6C2BD9] bg-[#E9DEFB] px-1.5 py-0.5 rounded font-semibold">
                          VTO Attributed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* PRD Section 2.8: Deep link to "Try it on again" */}
                {productRef && productRef.aaina_mirror_enabled && (
                  <button
                    onClick={() => {
                      setIsOrderTrackingOpen(false);
                      startMirrorTryOn(productRef);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-[#6C2BD9] text-[#6C2BD9] rounded-xl flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try On Again</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Address & Invoice Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Delivering to:</div>
            <div className="font-semibold text-slate-800">
              {order.shipping_address.fullName} · {order.shipping_address.street}, {order.shipping_address.city}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => showToast('Order invoice PDF downloaded', 'info')}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>

            <button
              onClick={() => showToast('Return portal initiated: 30-day window active', 'info')}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-center gap-1.5 hover:bg-[#6C2BD9] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Easy Return</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
