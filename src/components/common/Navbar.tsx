import React from 'react';
import { useMarketplace, NavigationTab } from '../../context/MarketplaceContext';
import { CURRENCIES } from '../../data/mockData';
import { CurrencyCode } from '../../types';
import { Search, ShoppingBag, Radio, Sparkles, Box, PlaySquare, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cartCount,
    setIsCartOpen,
    currency,
    setCurrency,
    setIsSearchOpen,
    orders,
    setIsOrderTrackingOpen,
    setSelectedTrackingOrder,
  } = useMarketplace();

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'discover', label: 'Discover' },
    { id: 'reels', label: 'Reels' },
    { id: 'mirror', label: 'Mirror VTO' },
    { id: 'room', label: 'Room 3D' },
    { id: 'live', label: 'Live' },
    { id: 'studio', label: 'Studio' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      {/* Top Banner (PRD promotional restraint: max 1 slim banner <= 40px) */}
      <div className="bg-[#0B0B0F] text-[#F8F9FC] text-xs py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="font-medium tracking-wide">
          “See it on you. Then buy it.” — Aaina Virtual Try-On 2.0 is live
        </span>
        <button
          onClick={() => setActiveTab('mirror')}
          className="text-[#00C2FF] hover:underline font-semibold text-xs ml-1 inline-flex items-center gap-1 cursor-pointer"
        >
          Try on with AI &rarr;
        </button>
      </div>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single element Brand Wordmark + Logo */}
        <button
          onClick={() => setActiveTab('discover')}
          className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
        >
          {/* Mirror-A monogram per PRD section 2.3 */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] flex items-center justify-center shadow-sm text-white font-bold group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 fill-current text-white"
              viewBox="0 0 24 24"
            >
              {/* Facing mirror panels with negative space play-triangle */}
              <path d="M4 19L9.5 5h1L5 19H4zm15 0l-5.5-14h-1L19 19h1z" />
              <polygon points="10,13 10,8 14.5,10.5" fill="#FFFFFF" opacity="0.95" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0B0B0F] leading-none">
              Aaina
            </span>
            <span className="text-[10px] tracking-wider text-[#6B7280] font-medium uppercase mt-0.5">
              Immersive Commerce
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B7280]">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-2 cursor-pointer ${
                  isActive
                    ? 'text-[#6C2BD9] font-semibold'
                    : 'hover:text-[#0B0B0F]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#6C2BD9] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + helper utilities */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search catalog"
            className="p-2 text-[#6B7280] hover:text-[#0B0B0F] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Currency Switcher */}
          <div className="relative">
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as CurrencyCode)}
              className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0B0B0F] py-1.5 px-2.5 rounded-lg border-0 cursor-pointer focus:ring-1 focus:ring-[#6C2BD9] transition-colors"
              aria-label="Select currency"
            >
              {Object.keys(CURRENCIES).map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Order Status quick link if orders exist */}
          {orders.length > 0 && (
            <button
              onClick={() => {
                setSelectedTrackingOrder(orders[0]);
                setIsOrderTrackingOpen(true);
              }}
              className="hidden lg:flex items-center text-xs font-medium text-[#6B7280] hover:text-[#6C2BD9] transition-colors cursor-pointer"
            >
              Orders ({orders.length})
            </button>
          )}

          {/* Primary Action: Shopping Bag with counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0B0B0F] hover:bg-[#1E1E24] rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 group active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#00C2FF] group-hover:scale-110 transition-transform" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#6C2BD9] text-white rounded-full text-[11px] font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 bg-white gap-4 text-xs font-medium text-slate-600 no-scrollbar">
        {navLinks.map(link => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors ${
              activeTab === link.id
                ? 'bg-[#E9DEFB] text-[#6C2BD9] font-bold'
                : 'text-slate-600'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
