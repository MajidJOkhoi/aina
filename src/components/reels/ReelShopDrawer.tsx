import React from 'react';
import { AainaProduct } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { X, Sparkles, Box, ShoppingBag, Check } from 'lucide-react';

interface ReelShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: AainaProduct[];
}

export const ReelShopDrawer: React.FC<ReelShopDrawerProps> = ({ isOpen, onClose, products }) => {
  const { addToCart, formatPrice, startMirrorTryOn, startRoomExperience, openProductDetail } =
    useMarketplace();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur-md rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[75%] overflow-hidden flex flex-col transition-transform">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Products in this Reel</h3>
          <p className="text-xs text-slate-500">{products.length} tagged items available</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Product List */}
      <div className="p-4 overflow-y-auto space-y-3.5">
        {products.map(product => (
          <div
            key={product.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-all shadow-sm"
          >
            <img
              src={product.media.primary_image}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 cursor-pointer"
              onClick={() => {
                onClose();
                openProductDetail(product);
              }}
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {product.seller_name}
              </div>
              <h4
                className="text-xs font-semibold text-slate-900 truncate cursor-pointer hover:text-[#6C2BD9]"
                onClick={() => {
                  onClose();
                  openProductDetail(product);
                }}
              >
                {product.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono font-bold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && (
                  <span className="text-[11px] font-mono line-through text-slate-400">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              {product.aaina_mirror_enabled && (
                <button
                  onClick={() => {
                    onClose();
                    startMirrorTryOn(product);
                  }}
                  title="Try on with Aaina Mirror"
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#E9DEFB] text-[#6C2BD9] hover:bg-[#6C2BD9] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Try On</span>
                </button>
              )}

              {product.aaina_room_enabled && (
                <button
                  onClick={() => {
                    onClose();
                    startRoomExperience(product);
                  }}
                  title="View in 3D Room"
                  className="px-2.5 py-1.5 text-xs font-medium bg-[#00C2FF]/10 text-[#00C2FF] hover:bg-[#00C2FF] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">3D</span>
                </button>
              )}

              <button
                onClick={() => {
                  addToCart(product);
                }}
                className="p-2 bg-[#0B0B0F] hover:bg-[#6C2BD9] text-white rounded-lg transition-colors cursor-pointer"
                title="Add to bag"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
