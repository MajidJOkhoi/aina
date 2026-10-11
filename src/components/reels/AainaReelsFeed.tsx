import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ReelShopDrawer } from './ReelShopDrawer';
import {
  Heart,
  Bookmark,
  Share2,
  ShoppingBag,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Music,
  Play,
  Pause,
} from 'lucide-react';

export const AainaReelsFeed: React.FC = () => {
  const {
    reels,
    activeReelIndex,
    setActiveReelIndex,
    toggleLikeReel,
    toggleSaveReel,
    products,
    openProductDetail,
    startMirrorTryOn,
    showToast,
  } = useMarketplace();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(6);
  const [duration] = useState<number>(30);
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState<boolean>(false);
  const [selectedTagPreview, setSelectedTagPreview] = useState<string | null>(null);

  const currentReel = reels[activeReelIndex] || reels[0];

  // Map product tags to actual products
  const taggedProducts = currentReel.product_tags
    .map(t => products.find(p => p.id === t.product_id))
    .filter(Boolean);

  // Time scrubber simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime(prev => (prev >= duration ? 0 : prev + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        goToPrevReel();
      } else if (e.key === 'ArrowDown') {
        goToNextReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(p => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelIndex]);

  const goToNextReel = () => {
    if (activeReelIndex < reels.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
      setCurrentTime(0);
      setIsShopDrawerOpen(false);
    } else {
      setActiveReelIndex(0);
      setCurrentTime(0);
    }
  };

  const goToPrevReel = () => {
    if (activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
      setCurrentTime(0);
      setIsShopDrawerOpen(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Reel link copied to clipboard!', 'info');
  };

  // Find tags visible at current timestamp
  const visibleTags = currentReel.product_tags.filter(
    t => currentTime >= t.timestamp_start && currentTime <= t.timestamp_end
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row items-center justify-center gap-8 min-h-[calc(100vh-140px)]">
      {/* Left / Desktop Information Guide */}
      <div className="hidden lg:flex flex-col max-w-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D71]/10 text-[#FF3D71] text-xs font-semibold w-max mb-3">
          <span className="w-2 h-2 rounded-full bg-[#FF3D71] animate-ping" />
          Aaina Reels 9:16 Discovery
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Shop what you see.
          <br />
          <span className="text-gradient-reel">In the moment.</span>
        </h2>
        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          Interactive short-form video where every look is directly shoppable. Tap the pulsating tags on screen to preview items, try them on yourself in Aaina Mirror, or checkout with 1 tap.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Current Creator</span>
            <span className="text-[#6C2BD9]">Verified Partner</span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={currentReel.creator_avatar}
              alt={currentReel.creator_name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">{currentReel.creator_name}</div>
              <div className="text-xs text-slate-500">{currentReel.creator_handle}</div>
            </div>
            <button
              onClick={() => showToast(`Following ${currentReel.creator_name}!`)}
              className="ml-auto px-3 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-[#6C2BD9] transition-colors cursor-pointer"
            >
              Follow
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Views: {currentReel.stats.views.toLocaleString()}</span>
            <span>Likes: {currentReel.stats.likes.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Tip: Use <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono">↓</kbd> or Spacebar to navigate reels.
        </div>
      </div>

      {/* Center: Vertical 9:16 Video Player Container */}
      <div className="relative w-full max-w-[390px] aspect-[9/16] bg-[#0B0B0F] rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col justify-between">
        {/* Background Visual Asset (Thumbnail / Simulation) */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentReel.thumbnail}
            alt={currentReel.caption}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-[1.02]' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim per PRD anti-slop guidelines */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Top Overlay Controls */}
        <div className="relative z-20 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wider uppercase bg-[#FF3D71] px-2 py-0.5 rounded text-white shadow-sm">
              Reels
            </span>
            <span className="text-xs text-white/80 font-medium">
              {activeReelIndex + 1} of {reels.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(m => !m)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-colors cursor-pointer"
              aria-label="Toggle audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsPlaying(p => !p)}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-colors cursor-pointer"
              aria-label="Toggle playback"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* On-screen Timestamp-based Interactive Product Tags (PRD 6.1) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {visibleTags.map(tag => {
            const product = products.find(p => p.id === tag.product_id);
            if (!product) return null;
            return (
              <div
                key={tag.id}
                style={{ top: `${tag.position_y}%`, left: `${tag.position_x}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
                onClick={() => {
                  setSelectedTagPreview(product.id);
                  setIsShopDrawerOpen(true);
                }}
              >
                {/* Pulsing Tag Dot */}
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#00C2FF] opacity-75" />
                  <div className="relative inline-flex items-center gap-1.5 bg-black/85 backdrop-blur-md border border-white/40 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-lg group-hover:bg-[#6C2BD9] transition-all group-hover:scale-105">
                    <ShoppingBag className="w-3 h-3 text-[#00C2FF]" />
                    <span className="max-w-[130px] truncate">{tag.label || product.title}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right-Side Interaction Floating Actions */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
            onClick={() => toggleLikeReel(currentReel.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md border transition-colors ${
                currentReel.liked_by_user
                  ? 'bg-[#FF3D71] border-[#FF3D71] text-white'
                  : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${currentReel.liked_by_user ? 'fill-current' : ''}`}
              />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">
              {currentReel.stats.likes.toLocaleString()}
            </span>
          </button>

          {/* Shop Drawer Button */}
          <button
            onClick={() => setIsShopDrawerOpen(true)}
            className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform"
          >
            <div className="p-2.5 rounded-full bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] border border-white/30 text-white shadow-lg animate-pulse">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-[#00C2FF] tracking-tight">
              Shop ({taggedProducts.length})
            </span>
          </button>

          {/* Save / Wishlist */}
          <button
            onClick={() => toggleSaveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform"
          >
            <div
              className={`p-2.5 rounded-full backdrop-blur-md border transition-colors ${
                currentReel.saved_by_user
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'bg-black/40 border-white/20 text-white hover:bg-black/60'
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${currentReel.saved_by_user ? 'fill-current' : ''}`}
              />
            </div>
            <span className="text-[10px] font-semibold">Save</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 cursor-pointer group active:scale-90 transition-transform"
          >
            <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-colors">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold">Share</span>
          </button>
        </div>

        {/* Bottom Overlay: Caption, Creator, Music & Progress */}
        <div className="relative z-20 p-4 text-white">
          {/* Creator Profile */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={currentReel.creator_avatar}
              alt={currentReel.creator_name}
              className="w-8 h-8 rounded-full border border-white/30 object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-bold">{currentReel.creator_handle}</span>
            <button
              onClick={() => showToast(`Following ${currentReel.creator_name}!`)}
              className="text-[11px] font-semibold bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full backdrop-blur-sm ml-1"
            >
              Follow
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 line-clamp-2 leading-relaxed mb-2">
            {currentReel.caption}
          </p>

          {/* Music Track */}
          <div className="flex items-center gap-2 text-[11px] text-white/80 font-medium mb-3">
            <Music className="w-3.5 h-3.5 shrink-0 text-[#00C2FF] animate-spin" />
            <span className="truncate">{currentReel.sound_title}</span>
          </div>

          {/* Floating Shop Quick Pill */}
          <button
            onClick={() => setIsShopDrawerOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center justify-between hover:bg-slate-100 transition-colors shadow-lg cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#6C2BD9]" />
              <span>Shop {taggedProducts.length} items in this video</span>
            </div>
            <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </button>

          {/* Video Scrubber Bar */}
          <div className="w-full bg-white/20 h-1 rounded-full mt-3 overflow-hidden cursor-pointer">
            <div
              className="bg-[#00C2FF] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Shop Drawer Inside Reel */}
        <ReelShopDrawer
          isOpen={isShopDrawerOpen}
          onClose={() => setIsShopDrawerOpen(false)}
          products={taggedProducts as any}
        />
      </div>

      {/* Right / Next Reel Vertical Controllers */}
      <div className="flex lg:flex-col items-center gap-3">
        <button
          onClick={goToPrevReel}
          disabled={activeReelIndex === 0}
          className="p-3 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-[#6C2BD9] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all cursor-pointer"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <div className="text-xs font-mono font-bold text-slate-500">
          {activeReelIndex + 1}/{reels.length}
        </div>

        <button
          onClick={goToNextReel}
          className="p-3 rounded-full bg-white shadow-md border border-slate-200 text-slate-700 hover:text-[#6C2BD9] hover:scale-105 transition-all cursor-pointer"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
