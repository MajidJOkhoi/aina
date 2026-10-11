import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AainaProduct } from '../../types';
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Package,
  Video,
  Bot,
  Plus,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  DollarSign,
  Send,
  Zap,
  Tag,
  Check,
} from 'lucide-react';

export const AainaStudio: React.FC = () => {
  const { products, orders, formatPrice, showToast } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<'kpis' | 'products' | 'reels-studio' | 'orders' | 'ai-assistant'>('kpis');

  // Reels Studio state for tagging products
  const [newReelTitle, setNewReelTitle] = useState('Urban Sunset Silk Layering');
  const [selectedTagProduct, setSelectedTagProduct] = useState(products[0].id);
  const [tagTimestampStart, setTagTimestampStart] = useState<number>(0);
  const [tagTimestampEnd, setTagTimestampEnd] = useState<number>(18);
  const [tagPosX, setTagPosX] = useState<number>(55);
  const [tagPosY, setTagPosY] = useState<number>(40);

  // Aaina AI Assistant state
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; action?: string }>>([
    {
      sender: 'ai',
      text: 'Hello Majid! 3 products need restocking this week. Also, your Aura Silk Bomber has achieved a +24.8% conversion lift with Aaina Mirror VTO enabled. How can I assist your catalog today?',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Stats calculation
  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0) + 14280;
  const vtoOrdersCount = orders.filter(o => o.items.some(i => i.try_on_session_id)).length + 184;

  const handleCreateReelTag = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === selectedTagProduct);
    showToast(`Published Reel with product tag: ${prod?.title} (${tagTimestampStart}s - ${tagTimestampEnd}s)`, 'success');
  };

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim()) return;

    const userQ = aiChatQuery;
    setAiMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setAiChatQuery('');
    setIsAiLoading(true);

    setTimeout(() => {
      let reply = '';
      let actionLabel: string | undefined;

      const lower = userQ.toLowerCase();
      if (lower.includes('stock') || lower.includes('inventory')) {
        reply = 'Analysis: Aura Silk Bomber (Size L) is at 6 units, and Nesso Chair (Charcoal) is at 4 units. Would you like me to draft an automated restock Purchase Order with Atelier Noir?';
        actionLabel = 'Draft Restock Purchase Order';
      } else if (lower.includes('reel') || lower.includes('script') || lower.includes('video')) {
        reply = 'Generated 15-second Reel Concept:\n\n• 00-04s: Quick zoom on titanium zipper detail with voiceover: "The jacket you’ll wear every single evening."\n• 05-10s: Model turns 360° showing iridescent violet cupro lining.\n• 11-15s: Call-to-action overlay: "Tap the mirror tag to see it on yourself."';
        actionLabel = 'Send Script to Reels Studio';
      } else if (lower.includes('seo') || lower.includes('description')) {
        reply = 'Generated High-Converting SEO Description:\n"Crafted from premium Japanese cupro silk, this structured luxury bomber jacket features signature cobalt edge accents and moisture-wicking technical durability. Perfect for transitional outerwear. Available for virtual try-on."';
        actionLabel = 'Apply to Product Details';
      } else {
        reply = `Aaina Intelligence processed: "${userQ}". Based on your last 30 days of data, virtual try-on engagement has reduced customer return inquiries by 58% compared to marketplace benchmarks.`;
      }

      setAiMessages(prev => [...prev, { sender: 'ai', text: reply, action: actionLabel }]);
      setIsAiLoading(false);
    }, 900);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6C2BD9] bg-[#E9DEFB] px-2.5 py-0.5 rounded-full">
              Aaina Studio & Command
            </span>
            <span className="text-xs text-slate-400 font-mono">Seller Dashboard v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Atelier Noir Merchant Console
          </h1>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'kpis', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Catalog & VTO', icon: Package },
            { id: 'reels-studio', label: 'Reels Studio', icon: Video },
            { id: 'orders', label: 'Fulfillment', icon: ShoppingBag },
            { id: 'ai-assistant', label: 'Aaina AI', icon: Bot },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: Overview & KPIs (PRD Section 4.1 & 6.5) */}
      {activeSubTab === 'kpis' && (
        <div className="mt-8 space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Gross Merchandise Value (GMV)</span>
                <span className="text-[#00D68F] font-bold font-mono">+18.4%</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-2">
                {formatPrice(totalGMV)}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">18% attributed to Reels discovery</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>VTO Conversion Lift</span>
                <Sparkles className="w-4 h-4 text-[#6C2BD9]" />
              </div>
              <div className="text-2xl font-black font-mono text-[#6C2BD9] mt-2">
                +24.8%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">vs. non-VTO catalog benchmark</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Apparel Return Rate</span>
                <span className="text-[#00D68F] font-bold font-mono">13.2%</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-2">
                13.2%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Industry avg: 32–36% (PRD 4.1)</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>VTO Try-On Sessions</span>
                <span className="text-[#00C2FF] font-bold font-mono">54,120</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-2">
                54.1k
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Avg 3.4 try-ons per active shopper</p>
            </div>
          </div>

          {/* Impact Hypothesis & Funnel Overview (PRD Section 10) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Shoppable Funnel Performance</span>
                <span className="text-xs text-slate-400 font-normal">Last 30 Days</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Reels Feed Video Impressions</span>
                    <span className="font-mono text-slate-900">482,900</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF3D71] h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Reels &rarr; Product Tag Click-Through (6.2%)</span>
                    <span className="font-mono text-slate-900">29,940</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#FF3D71] to-[#6C2BD9] h-full rounded-full" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Aaina Mirror AI Try-Ons</span>
                    <span className="font-mono text-slate-900">18,400</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#6C2BD9] h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Completed Purchases</span>
                    <span className="font-mono text-slate-900">3,890 orders</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00D68F] h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Restock Alert Box */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-500 font-bold text-xs mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Restock Action Required</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  3 Products Approaching Minimum Stock
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  High Reel conversion velocity has accelerated sell-through for Size M items.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="font-medium text-slate-700">Aura Bomber (Cobalt / L)</span>
                    <span className="font-mono font-bold text-amber-600">6 left</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                    <span className="font-medium text-slate-700">Nesso Lounge Chair (Charcoal)</span>
                    <span className="font-mono font-bold text-amber-600">4 left</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSubTab('ai-assistant');
                  showToast('Opened Aaina AI Seller Copilot');
                }}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-[#6C2BD9] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>Ask Aaina AI to Generate PO</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Product & VTO Management (PRD Section 6.5) */}
      {activeSubTab === 'products' && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Product Inventory & AI Features</h3>
              <p className="text-xs text-slate-500">Manage listings, variants, and toggle VTO / 3D models</p>
            </div>
            <button
              onClick={() => showToast('New product wizard opened', 'info')}
              className="px-3 py-1.5 rounded-xl bg-[#6C2BD9] text-white text-xs font-bold hover:bg-[#5720b0] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Aaina Mirror (VTO)</th>
                  <th className="px-4 py-3">Aaina Room (3D)</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={p.media.primary_image}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {p.id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{p.category}</td>
                    <td className="px-4 py-3.5 font-mono font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3.5 font-mono">
                      {p.variants.reduce((s, v) => s + v.stock, 0)} units
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.aaina_mirror_enabled
                            ? 'bg-[#E9DEFB] text-[#6C2BD9]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {p.aaina_mirror_enabled ? '✓ Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.aaina_room_enabled
                            ? 'bg-[#00C2FF]/10 text-[#00C2FF]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {p.aaina_room_enabled ? '✓ 3D / AR Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => showToast(`Updated settings for ${p.title}`)}
                        className="text-xs font-semibold text-[#6C2BD9] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Reels Studio (PRD Section 6.1: Seller Reels Studio) */}
      {activeSubTab === 'reels-studio' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tag Products in Reels</h3>
              <p className="text-xs text-slate-500">
                Set timestamp start/end and on-screen coordinates for interactive video tags.
              </p>
            </div>

            <form onSubmit={handleCreateReelTag} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reel Title / Caption
                </label>
                <input
                  type="text"
                  value={newReelTitle}
                  onChange={e => setNewReelTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Select Product to Tag
                </label>
                <select
                  value={selectedTagProduct}
                  onChange={e => setSelectedTagProduct(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#6C2BD9]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Timestamp Start (sec)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={tagTimestampStart}
                    onChange={e => setTagTimestampStart(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Timestamp End (sec)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={tagTimestampEnd}
                    onChange={e => setTagTimestampEnd(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Position X (%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={tagPosX}
                    onChange={e => setTagPosX(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] text-slate-400 font-mono text-right">{tagPosX}%</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Position Y (%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={tagPosY}
                    onChange={e => setTagPosY(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-[10px] text-slate-400 font-mono text-right">{tagPosY}%</div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#6C2BD9] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Save Tag to Video</span>
              </button>
            </form>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-900 rounded-2xl p-6 relative overflow-hidden border border-slate-800">
            <div className="relative w-[240px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <img
                src="/src/assets/images/reel_streetwear_thumb_1791689693812.jpg"
                alt="Reel Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Tag Dot position preview */}
              <div
                style={{ top: `${tagPosY}%`, left: `${tagPosX}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <div className="bg-[#6C2BD9] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-ping" />
                  <span>Tag ({tagTimestampStart}s-{tagTimestampEnd}s)</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 mt-4 font-mono">
              Live Preview: Tag renders at ({tagPosX}%, {tagPosY}%)
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: Fulfillment & Order Lifecycle */}
      {activeSubTab === 'orders' && (
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-500">Track shipments, VTO attribution, and delivery state</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {orders.map(order => (
              <div key={order.id} className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">#{order.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-medium text-slate-700">{order.buyer_name}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-mono">
                      {order.payment_method}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {order.items.map(i => `${i.title} (${i.qty}x)`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">{formatPrice(order.total)}</div>
                    <div className="text-[10px] text-[#00D68F] font-semibold">{order.status}</div>
                  </div>
                  <button
                    onClick={() => showToast(`Tracking updated for #${order.id}`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-slate-700 font-semibold cursor-pointer"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: Aaina AI Assistant (PRD Section 6.5) */}
      {activeSubTab === 'ai-assistant' && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[560px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Aaina AI Seller Copilot</h3>
                <p className="text-[11px] text-slate-500">Autonomous Restock, Reel Scripts & SEO Intelligence</p>
              </div>
            </div>

            {/* Chat Thread */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {aiMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.action && (
                    <button
                      onClick={() => showToast(`Executed: ${msg.action}!`, 'success')}
                      className="mt-2 text-xs font-semibold text-[#6C2BD9] bg-[#E9DEFB] hover:bg-[#6C2BD9] hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{msg.action}</span>
                    </button>
                  )}
                </div>
              ))}

              {isAiLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 animate-spin text-[#6C2BD9]" />
                  <span>Aaina AI is computing catalog analytics...</span>
                </div>
              )}
            </div>

            {/* Query Input */}
            <form onSubmit={handleSendAiPrompt} className="p-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Show products with low stock' or 'Draft a 15-second Reel script'..."
                value={aiChatQuery}
                onChange={e => setAiChatQuery(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C2BD9]"
              />
              <button
                type="submit"
                disabled={!aiChatQuery.trim() || isAiLoading}
                className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-[#6C2BD9] disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Prompts Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Suggested AI Workflows
            </h4>
            <div className="space-y-2">
              {[
                'Analyze products with low stock',
                'Generate a 15-second Reel script with captions',
                'Optimize SEO description for silk bomber',
                'Show Aaina Mirror VTO conversion lift',
              ].map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setAiChatQuery(promptText);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200 text-xs text-slate-700 transition-all cursor-pointer font-medium"
                >
                  &rarr; {promptText}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
