import React from 'react';
import { 
  Compass, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  MessageSquare, 
  Heart, 
  Clock, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';

interface Props {
  onSelectTab: (tab: string) => void;
  onOpenGateway: (options?: any) => void;
  customLogo?: string | null;
}

export const Footer: React.FC<Props> = ({ onSelectTab, onOpenGateway, customLogo }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-950">
      {/* Top CTA Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <div className="font-arabic text-lg text-amber-300">
              وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Siap Melangkah Menuju Baitullah?
            </h3>
            <p className="text-xs text-emerald-100">
              Konsultasikan rencana ibadah Anda dan keluarga bersama tim pembimbing amanah kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenGateway({ targetPhone: 'primary', type: 'general' })}
              className="py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp: {COMPANY_INFO.primaryWhatsApp}</span>
            </button>

            <button
              onClick={() => onSelectTab('pendaftaran')}
              className="py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-900 font-bold text-xs sm:text-sm transition-all"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Identity & Moto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              {customLogo ? (
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-700 flex items-center justify-center p-0.5 overflow-hidden">
                  <img src={customLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-amber-300 border border-emerald-500/40">
                  <Compass className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  QAFIYA <span className="text-emerald-400 font-normal text-xs">× DHW</span>
                </span>
                <span className="text-[11px] text-slate-400 block -mt-1">
                  Darul Hikmah Wisata
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              "{COMPANY_INFO.tagline}"
            </p>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-amber-300 font-medium">
              ★ {COMPANY_INFO.motto}
            </div>

            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{COMPANY_INFO.kemenagPpiu}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('beranda')} className="hover:text-white transition-colors">
                  Beranda & Paket Unggulan
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('paket')} className="hover:text-white transition-colors">
                  Jadwal Keberangkatan 2026–2027
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('simulasi')} className="hover:text-white transition-colors">
                  Simulasi Cicilan Syariah (DP 50%)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('pendaftaran')} className="hover:text-white transition-colors">
                  Formulir Pendaftaran Online
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('status')} className="hover:text-white transition-colors">
                  Portal Cek Status Jamaah
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('manasik')} className="hover:text-white transition-colors">
                  Manasik, Doa & Audio Talbiyah
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('mitra')} className="hover:text-white transition-colors">
                  Kemitraan & Rombongan Majelis
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Paket Utama & Layanan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Paket & Pembiayaan
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Paket Umrah Istimewa 12 Hari (Rp 35,5 Juta)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Paket Umrah Reguler 9 Hari (Rp 36,95 Juta)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Paket Awal & Penuh Ramadhan (Lailatul Qadar)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Paket Umrah Bulan Syawal Berkah</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Layanan Badal Umrah Bersertifikat</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>Cicilan Syariah Tanpa Bank & BI Checking</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak Resmi & Alamat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Kontak Resmi Gateway
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] text-amber-300 font-bold uppercase">Nomor WhatsApp Utama:</div>
                <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>{COMPANY_INFO.primaryWhatsApp}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Pendaftaran Tambahan:</div>
                <div className="text-sm font-bold text-slate-200">
                  {COMPANY_INFO.secondaryWhatsApp}
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1 text-[11px]">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.serviceRegion} • Keberangkatan {COMPANY_INFO.departureHub}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center">
          <div>
            © {new Date().getFullYear()} QAFIYA × Darul Hikmah Wisata (DHW Travel). Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-2">
            <span>Sesuai Syariat</span>
            <span>•</span>
            <span>Tanpa Riba</span>
            <span>•</span>
            <span>Amanah & Berkah</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
