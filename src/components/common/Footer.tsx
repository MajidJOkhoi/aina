import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ShieldCheck, Sparkles, Box, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useMarketplace();

  return (
    <footer className="bg-[#0B0B0F] text-[#F8F9FC] border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#00C2FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Aaina Mirror VTO</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Photorealistic AI fit simulation with MediaPipe landmark warping.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#6C2BD9]">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Aaina Room WebXR</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                True-to-scale 3D furniture & home staging before ordering.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#FF3D71]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Zero-Guess Returns</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Tested to reduce size mismatches from 34% down to under 14%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#00D68F]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Aaina Pay & Protection</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Multi-currency, encrypted checkout, and buyer delivery guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Details */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-white/10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#6C2BD9] to-[#00C2FF] flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Aaina</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              “See it on you. Then buy it.” The next-generation social commerce platform uniting shoppable short-form video, AI virtual try-on, and spatial 3D visualization.
            </p>
            <p className="text-[11px] text-slate-500">
              Urdu / Hindi / Arabic: نیئآ (Mirror) · Confidential PRD v2.0
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Experiences</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('reels')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina Reels (Shoppable)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('mirror')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina Mirror (AI VTO)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('room')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina Room (3D/AR)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('live')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina Live Shopping
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Seller Suite</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('studio')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina Studio Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('studio')} className="hover:text-white transition-colors cursor-pointer">
                  Reels Tagging Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('studio')} className="hover:text-white transition-colors cursor-pointer">
                  Aaina AI Seller Copilot
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('studio')} className="hover:text-white transition-colors cursor-pointer">
                  VTO Conversion Analytics
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Privacy & Trust</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Ephemeral VTO photo policy (auto-deleted within 24h)</li>
              <li>Explicit opt-in biometric consent</li>
              <li>PCI-DSS Scope & AES-256 at rest</li>
              <li>Creator affiliate attribution</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Aaina Technologies Inc. All rights reserved. Har shopping, apne aaine mein.
          </div>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>VTO Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
