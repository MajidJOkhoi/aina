import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AainaProduct, ProductVariant } from '../../types';
import {
  X,
  Sparkles,
  Box,
  ShoppingBag,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    closeProductDetail,
    formatPrice,
    addToCart,
    startMirrorTryOn,
    startRoomExperience,
    wishlist,
    toggleWishlist,
    showToast,
  } = useMarketplace();

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const isWishlisted = wishlist.includes(product.id);

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    closeProductDetail();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 relative my-auto">
        {/* Close Button */}
        <button
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 bg-slate-50/70 border-r border-slate-100 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Primary Image Display */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200/60">
                <img
                  src={product.media.images[selectedImageIndex] || product.media.primary_image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.aaina_mirror_enabled && (
                    <span className="px-2.5 py-1 rounded-full bg-[#6C2BD9] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#00C2FF]" />
                      Mirror VTO Ready
                    </span>
                  )}
                  {product.aaina_room_enabled && (
                    <span className="px-2.5 py-1 rounded-full bg-[#00C2FF] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Box className="w-3 h-3" />
                      3D Room Preview
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Selector */}
              {product.media.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {product.media.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#6C2BD9] ring-2 ring-[#6C2BD9]/20'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Immersive Launch Buttons Strip */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
              {product.aaina_mirror_enabled && (
                <button
                  onClick={() => startMirrorTryOn(product)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#E9DEFB] hover:bg-[#6C2BD9] text-[#6C2BD9] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Try on yourself in Mirror</span>
                </button>
              )}

              {product.aaina_room_enabled && (
                <button
                  onClick={() => startRoomExperience(product)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#00C2FF]/10 hover:bg-[#00C2FF] text-[#00C2FF] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer group"
                >
                  <Box className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>View in Your Room (3D)</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (6 cols) */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Seller & Title */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span>{product.seller_name}</span>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating} ({product.review_count})</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                {product.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{product.tagline}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {formatPrice(selectedVariant.price)}
                </span>
                {product.original_price && (
                  <span className="text-sm font-mono text-slate-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#00D68F] bg-[#00D68F]/10 px-2 py-0.5 rounded-md">
                  In Stock ({selectedVariant.stock} available)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed mt-4">
                {product.description}
              </p>

              {/* Variant Picker (Color / Size) */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-2">
                    Select Variant: <span className="font-normal text-slate-500">{selectedVariant.name}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.sku}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                          selectedVariant.sku === variant.sku
                            ? 'border-[#6C2BD9] bg-[#E9DEFB]/20 text-[#6C2BD9] font-bold shadow-sm'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                        <span>{variant.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors font-mono cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-xs font-mono font-bold text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(q => Math.min(selectedVariant.stock, q + 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 transition-colors font-mono cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">
                      Subtotal: <strong className="text-slate-900 font-mono">{formatPrice(selectedVariant.price * quantity)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#6C2BD9]" />
                  <span>Free tracked 2-day delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#00C2FF]" />
                  <span>30-day effortless returns</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-6 rounded-xl bg-slate-900 hover:bg-[#6C2BD9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag ({formatPrice(selectedVariant.price * quantity)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
