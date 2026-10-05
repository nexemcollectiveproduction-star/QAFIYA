import React, { useState } from 'react';
import { MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface Props {
  onOpenGateway: () => void;
}

export const FloatingWhatsApp: React.FC<Props> = ({ onOpenGateway }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2 group">
      {/* Speech bubble badge */}
      <div 
        onClick={onOpenGateway}
        className="cursor-pointer bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-emerald-100 flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce shadow-emerald-950/10"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
        </span>
        <span className="text-[11px] sm:text-xs">
          Konsultasi WhatsApp: <strong className="text-emerald-700">{COMPANY_INFO.primaryWhatsApp}</strong>
        </span>
      </div>

      {/* Main floating button */}
      <button
        onClick={onOpenGateway}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Hubungi kami melalui WhatsApp Gateway"
        className="relative flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-pulse pointer-events-none"></span>

        {/* WhatsApp Icon */}
        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-6 h-6 fill-white text-white drop-shadow-sm" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 border-2 border-[#25D366] rounded-full"></span>
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-950/80 leading-none">
            Live Gateway WA
          </span>
          <span className="text-sm font-extrabold tracking-tight leading-snug">
            Tanya Kami Sekarang
          </span>
        </div>
      </button>
    </div>
  );
};
