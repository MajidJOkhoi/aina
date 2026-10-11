import React, { useState, useEffect, useRef } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LiveMessage } from '../../types';
import {
  Radio,
  Eye,
  Send,
  Heart,
  Flame,
  Sparkles,
  ShoppingBag,
  Clock,
  CheckCircle,
  Share2,
} from 'lucide-react';

const INITIAL_MESSAGES: LiveMessage[] = [
  { id: 'm1', user: 'Sophia L.', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', text: 'Does the bomber run true to size?', time: 'Just now' },
  { id: 'm2', user: 'Sarah Chen (Host)', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', text: 'Yes Sophia! It has an intentional relaxed drop, but true to standard sizing.', time: 'Just now', isHost: true },
  { id: 'm3', user: 'Marcus K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', text: 'Just tested Aaina Mirror on my phone, fit looks incredible 🔥', time: 'Just now' },
  { id: 'm4', user: 'Ayla R.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', text: 'How many pieces left for the live flash drop?', time: 'Just now' },
];

export const AainaLiveShopping: React.FC = () => {
  const { products, addToCart, formatPrice, showToast, startMirrorTryOn } = useMarketplace();

  const [messages, setMessages] = useState<LiveMessage[]>(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [viewersCount, setViewersCount] = useState<number>(1482);
  const [heartsCount, setHeartsCount] = useState<number>(8920);
  const [flashTimeLeft, setFlashTimeLeft] = useState<number>(540); // 9 minutes countdown

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const featuredProduct = products[0]; // Silk Bomber Jacket

  // Countdown timer for live drop
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTimeLeft(prev => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Viewer count variance
  useEffect(() => {
    const vTimer = setInterval(() => {
      setViewersCount(v => v + Math.floor(Math.random() * 7) - 3);
    }, 3500);
    return () => clearInterval(vTimer);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: LiveMessage = {
      id: `msg_${Date.now()}`,
      user: 'You',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: inputMessage,
      time: 'Just now',
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');

    // Host simulated reply after 3s
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `host_${Date.now()}`,
          user: 'Sarah Chen (Host)',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          text: 'Great question! Free express shipping is included on all live orders today ✨',
          time: 'Just now',
          isHost: true,
        },
      ]);
    }, 2800);
  };

  const handleSendHeart = () => {
    setHeartsCount(h => h + 1);
    showToast('Sent reaction to live host!', 'info');
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D71]/10 text-[#FF3D71] text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Aaina Live Shopping · Airing Now</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Fall Luxury Capsule & Virtual Styling
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hosted by Sarah Chen (@sarah_styles) · Live Try-On & Exclusive 20% Drop
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>LIVE</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-medium">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{viewersCount.toLocaleString()} watching</span>
          </div>
        </div>
      </div>

      {/* Main Live Layout: 8 cols stream + 4 cols chat/pinned deal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Live Video Stream & Pinned Offer (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-[16/10] bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Live Stream Visual Mockup */}
            <img
              src="/src/assets/images/hero_fashion_showcase_1791689679703.jpg"
              alt="Live Shopping Stream Host"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Bar inside Stream */}
            <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between">
              <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Host"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-bold">Sarah Chen</span>
                <span className="text-[10px] text-white/70">Host</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Shared live stream link!', 'info')}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pinned Deal Banner on Bottom of Stream */}
            <div className="absolute bottom-4 inset-x-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="relative">
                  <img
                    src={featuredProduct.media.primary_image}
                    alt={featuredProduct.title}
                    className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#FF3D71] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                    PINNED
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#FF3D71] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Deal ends in {formatTimer(flashTimeLeft)}</span>
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                      8 left in stock
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {featuredProduct.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-extrabold text-[#6C2BD9] font-mono">
                      {formatPrice(featuredProduct.price)}
                    </span>
                    <span className="text-xs font-mono line-through text-slate-400">
                      {formatPrice(featuredProduct.original_price || 240)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => startMirrorTryOn(featuredProduct)}
                  className="flex-1 sm:flex-none px-3 py-2 text-xs font-semibold bg-[#E9DEFB] text-[#6C2BD9] hover:bg-[#6C2BD9] hover:text-white rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Try On Fit</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(featuredProduct);
                    showToast('Added live flash drop to bag!');
                  }}
                  className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold bg-[#0B0B0F] hover:bg-[#6C2BD9] text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>1-Tap Claim</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat & Reactions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col h-[520px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Live Studio Chat
              </h3>
              <span className="text-[11px] text-slate-400">· Real-time</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#FF3D71] font-bold font-mono">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{heartsCount.toLocaleString()}</span>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(m => (
              <div
                key={m.id}
                className={`p-2.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                  m.isHost
                    ? 'bg-[#E9DEFB]/40 border border-[#6C2BD9]/20'
                    : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <img
                  src={m.avatar}
                  alt={m.user}
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${m.isHost ? 'text-[#6C2BD9]' : 'text-slate-800'}`}>
                      {m.user}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Floating Reactions Bar */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Send reaction:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSendHeart}
                className="p-1.5 rounded-full hover:bg-slate-200 text-[#FF3D71] transition-transform active:scale-125 cursor-pointer"
                title="Heart"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleSendHeart}
                className="p-1.5 rounded-full hover:bg-slate-200 text-amber-500 transition-transform active:scale-125 cursor-pointer"
                title="Fire"
              >
                <Flame className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={handleSendHeart}
                className="p-1.5 rounded-full hover:bg-slate-200 text-[#00C2FF] transition-transform active:scale-125 cursor-pointer"
                title="Sparkle"
              >
                <Sparkles className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* Chat Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Sarah about size, drape, or shipping..."
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6C2BD9]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2 rounded-xl bg-[#6C2BD9] text-white disabled:opacity-40 hover:bg-[#5921b3] transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
