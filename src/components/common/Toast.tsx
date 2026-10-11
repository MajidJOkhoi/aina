import React from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useMarketplace();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#00D68F] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#00C2FF] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#FF4D4F] shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
      <div className="bg-[#0B0B0F] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-white/10 text-xs font-medium max-w-sm">
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
