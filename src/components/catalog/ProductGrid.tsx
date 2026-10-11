import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AainaProduct } from '../../types';
import {
  Sparkles,
  Box,
  ShoppingBag,
  ArrowRight,
  Play,
  Heart,
  SlidersHorizontal,
  ChevronRight,
  Star,
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    openProductDetail,
    startMirrorTryOn,
    startRoomExperience,
    addToCart,
    formatPrice,
    setActiveTab,
    reels,
    openReelByProduct,
    wishlist,
    toggleWishlist,
  } = useMarketplace();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const categories = ['All', 'Apparel', 'Home & Living', 'Footwear'];

  let filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="space-y-16">
      {/* 1. Storefront Hero: 1 bold campaign focal point (Retail guidelines) */}
      <section className="relative bg-[#0B0B0F] text-white rounded-3xl overflow-hidden shadow-2xl mx-4 sm:mx-6 lg:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#00C2FF] text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Next-Gen Immersive Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white max-w-xl">
                See it on you. <br />
                <span className="text-gradient-aaina">Then buy it.</span>
              </h1>

              <p className="text-base text-slate-300 mt-5 max-w-lg leading-relaxed font-normal">
                Never guess fit or scale again. Scroll shoppable creator Reels, preview clothes on your body with Aaina Mirror AI, and stage 3D designer furniture in your space.
              </p>
            </div>

            {/* Hero Interactive CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveTab('reels')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF3D71] to-[#6C2BD9] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Scroll Shoppable Reels</span>
              </button>

              <button
                onClick={() => setActiveTab('mirror')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/20 backdrop-blur-md active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#00C2FF]" />
                <span>Launch Aaina Mirror (VTO)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual (5 cols) */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_fashion_showcase_1791689679703.jpg"
              alt="Aaina Campaign Showcase"
              className="w-full h-full object-cover lg:absolute lg:inset-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0B0B0F] via-transparent to-transparent" />

            {/* Floating Live Indicator Card */}
            <div className="absolute bottom-6 right-6 bg-black/75 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 text-white shadow-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00D68F] animate-ping" />
              <div>
                <div className="text-[11px] font-bold">Fall Capsule Live</div>
                <div className="text-[10px] text-slate-300">12 designers · AI try-on enabled</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shoppable Reels Quick Preview Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Trending on Aaina Reels
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Watch looks in motion and tap timestamped tags to purchase directly.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('reels')}
            className="text-xs font-bold text-[#FF3D71] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Watch All Reels</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reels.map(reel => (
            <div
              key={reel.id}
              onClick={() => {
                const prodId = reel.product_tags[0]?.product_id;
                if (prodId) openReelByProduct(prodId);
                else setActiveTab('reels');
              }}
              className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-slate-900 shadow-md cursor-pointer border border-slate-200"
            >
              <img
                src={reel.thumbnail}
                alt={reel.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Top Tag Count */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                <ShoppingBag className="w-3 h-3 text-[#FF3D71]" />
                <span>{reel.product_tags.length} Products Tagged</span>
              </div>

              {/* Bottom Caption & Play Overlay */}
              <div className="absolute bottom-4 inset-x-4 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <img
                    src={reel.creator_avatar}
                    alt={reel.creator_name}
                    className="w-6 h-6 rounded-full object-cover border border-white/40"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-bold">{reel.creator_handle}</span>
                </div>
                <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                  {reel.caption}
                </p>
              </div>

              {/* Play Hover Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <div className="w-12 h-12 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Collection Grid (Retail Guidelines: 3-col desktop, 2-col tablet) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Curated Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Explore apparel with AI Virtual Try-On and designer interiors with 3D AR.
            </p>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 py-1.5 px-3 rounded-xl focus:ring-1 focus:ring-[#6C2BD9] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
          {filtered.map(product => {
            const isWish = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Product Image Area (takes 65-75% height) */}
                <div
                  className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => openProductDetail(product)}
                >
                  <img
                    src={product.media.primary_image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.aaina_mirror_enabled && (
                      <span className="px-2.5 py-1 rounded-full bg-[#6C2BD9] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 text-[#00C2FF]" />
                        Try-On
                      </span>
                    )}
                    {product.aaina_room_enabled && (
                      <span className="px-2.5 py-1 rounded-full bg-[#00C2FF] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Box className="w-3 h-3" />
                        3D Room
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isWish
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500'
                    }`}
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content & Metadata (Clean Unboxed Typography per Anti-Slop) */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>{product.seller_name}</span>
                      <div className="flex items-center gap-1 text-slate-700 font-semibold">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => openProductDetail(product)}
                      className="text-base font-bold text-slate-900 mt-1 cursor-pointer hover:text-[#6C2BD9] transition-colors truncate"
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Price & Actions Strip */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold font-mono text-slate-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.original_price && (
                        <div className="text-[11px] font-mono text-slate-400 line-through">
                          {formatPrice(product.original_price)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {product.aaina_mirror_enabled && (
                        <button
                          onClick={() => startMirrorTryOn(product)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-[#E9DEFB] hover:bg-[#6C2BD9] text-[#6C2BD9] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Try this garment in Aaina Mirror"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Try On</span>
                        </button>
                      )}

                      {product.aaina_room_enabled && (
                        <button
                          onClick={() => startRoomExperience(product)}
                          className="px-2.5 py-1.5 text-xs font-semibold bg-[#00C2FF]/10 hover:bg-[#00C2FF] text-[#00C2FF] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="Place in 3D AR Room"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>3D</span>
                        </button>
                      )}

                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-slate-900 hover:bg-[#6C2BD9] text-white rounded-lg transition-colors cursor-pointer"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
