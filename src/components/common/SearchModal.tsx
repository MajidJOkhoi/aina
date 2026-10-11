import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Search, X, Sparkles, Box, Video, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    openProductDetail,
    startMirrorTryOn,
    startRoomExperience,
    formatPrice,
  } = useMarketplace();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          p.seller_name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, query, selectedCategory]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items, designers, reels, or try 'silk bomber jacket'..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          {['All', 'Apparel', 'Home & Living', 'Footwear', 'Accessories'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching products found. Try keywords like "bomber", "chair", or "blazer".
            </div>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-all cursor-pointer"
                onClick={() => {
                  openProductDetail(product);
                  setIsSearchOpen(false);
                }}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={product.media.primary_image}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs text-slate-500 font-medium">{product.seller_name}</div>
                    <div className="text-sm font-semibold text-slate-900 group-hover:text-[#6C2BD9] transition-colors">
                      {product.title}
                    </div>
                    <div className="text-xs font-mono font-medium text-slate-800 mt-0.5">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  {product.aaina_mirror_enabled && (
                    <button
                      onClick={() => {
                        startMirrorTryOn(product);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-[#6C2BD9] bg-[#E9DEFB] hover:bg-[#6C2BD9] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Try On</span>
                    </button>
                  )}
                  {product.aaina_room_enabled && (
                    <button
                      onClick={() => {
                        startRoomExperience(product);
                        setIsSearchOpen(false);
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-[#00C2FF] bg-[#00C2FF]/10 hover:bg-[#00C2FF] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D Room</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      openProductDetail(product);
                      setIsSearchOpen(false);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
