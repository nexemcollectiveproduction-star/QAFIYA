import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Calculator, 
  Calendar, 
  Plane, 
  Building2, 
  Check, 
  HeartHandshake, 
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Compass
} from 'lucide-react';
import { COMPANY_INFO, PACKAGES } from '../data/mockData';
import { formatRupiah } from '../utils/whatsapp';

interface Props {
  onSelectTab: (tab: string) => void;
  onOpenGateway: (options?: any) => void;
  customLogo?: string | null;
}

export const HeroSection: React.FC<Props> = ({ onSelectTab, onOpenGateway, customLogo }) => {
  const featuredPackage = PACKAGES[0]; // Paket Umrah Istimewa 12 Hari

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background Islamic Geometric Pattern Accent */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Soft Glow Circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-500/40 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kemitraan Resmi: QAFIYA × Darul Hikmah Wisata</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 text-amber-200 px-3 py-1.5 rounded-full text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Izin PPIU Kemenag RI U.481/2021</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cirebon • Keberangkatan Jakarta PP</span>
          </div>
        </div>

        {/* Animated Modern Moving QAFIYA Showcase */}
        <div className="flex flex-col items-center justify-center my-4 sm:my-6 select-none">
          <div className="relative group animate-float-slow">
            {/* Glowing moving background aura */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/40 via-emerald-500/40 to-teal-400/40 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition-all duration-1000 animate-pulse-glow pointer-events-none" />

            {/* Modern Glass Card with kinetic moving typography */}
            <div className="relative px-6 py-3.5 sm:px-10 sm:py-5 rounded-3xl bg-emerald-950/90 backdrop-blur-2xl border-2 border-amber-300/50 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center gap-4 sm:gap-6">
              {/* Animated Floating Logo / Emblem */}
              {customLogo ? (
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-white p-1.5 shadow-2xl border-2 border-amber-300/70 flex items-center justify-center overflow-hidden shrink-0 group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 animate-gentle-tilt">
                  <img src={customLogo} alt="Logo QAFIYA DHW" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-600 to-teal-900 p-0.5 shadow-2xl border-2 border-amber-300/70 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform animate-gentle-tilt">
                  <div className="w-full h-full bg-emerald-950 rounded-[14px] flex items-center justify-center text-amber-300">
                    <Compass className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-slow text-amber-300" />
                  </div>
                </div>
              )}

              {/* Dynamic Animated Kinetic QAFIYA Letters */}
              <div className="text-left">
                <div className="flex items-center gap-2 sm:gap-3.5 flex-wrap">
                  {/* Staggered Animated Wave Letters */}
                  <span className="inline-flex tracking-wider uppercase font-black text-3xl sm:text-5xl lg:text-6xl drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]">
                    {['Q', 'A', 'F', 'I', 'Y', 'A'].map((letter, idx) => (
                      <span
                        key={idx}
                        className="inline-block animate-wave-letter bg-gradient-to-r from-amber-300 via-emerald-200 to-amber-100 bg-clip-text text-transparent hover:scale-125 transition-transform cursor-default"
                        style={{
                          animationDelay: `${idx * 0.15}s`,
                          animationDuration: '2.5s',
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>

                  <span className="text-[11px] sm:text-xs font-bold text-amber-300 bg-emerald-900/90 border border-emerald-500/60 px-3 py-1 rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                    × DHW Travel
                  </span>
                </div>
                
                <div className="text-[11px] sm:text-xs text-emerald-200/95 font-medium tracking-wide flex items-center gap-2 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow shrink-0" />
                  <span className="font-semibold text-white">Langkah Nyata Menuju Baitullah</span>
                  <span className="text-amber-400 hidden sm:inline">•</span>
                  <span className="text-emerald-300/90 hidden sm:inline">Amanah & Sesuai Sunnah</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Title & Slogan */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="font-arabic text-2xl sm:text-3xl text-amber-200/90 tracking-wide font-normal">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Langkah Nyata Menuju Baitullah
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-200 to-amber-200 mt-1">
              Aman, Nyaman, Terpercaya, InsyaAllah Berkah
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            Mewujudkan rindu Ka'bah dan ziarah Makam Rasulullah ﷺ dengan bimbingan sesuai Sunnah, fasilitas hotel dekat pelataran masjid, serta <strong className="text-amber-300 font-semibold">Program Pembiayaan Cicilan Syariah Tanpa Riba</strong>.
          </p>

          {/* Slogan & Principles Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="bg-emerald-950/90 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-xl">
              ✓ Tanpa Bank & Tanpa BI Checking
            </span>
            <span className="bg-emerald-950/90 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-xl">
              ✓ Tanpa Bunga (0% Riba)
            </span>
            <span className="bg-emerald-950/90 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-xl">
              ✓ Tanpa Denda & Tanpa Biaya Admin
            </span>
            <span className="bg-emerald-950/90 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-xl">
              ✓ DP 50% Pelunasan 1–2 Tahun
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={() => onOpenGateway({ type: 'general' })}
              className="w-full sm:w-auto flex-1 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#25D366]/30 transition-all cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Hubungi WA: {COMPANY_INFO.primaryWhatsApp}</span>
            </button>

            <button
              onClick={() => onSelectTab('simulasi')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/25 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-amber-300" />
              <span>Simulasi Cicilan Syariah</span>
            </button>
          </div>
        </div>

        {/* Highlight Cards Grid */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Paket Istimewa 12 Hari */}
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/30 hover:border-amber-400/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-amber-400 text-slate-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Paket Utama
                </span>
                <span className="text-xs text-emerald-200">12 Hari Perjalanan</span>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Paket Umrah Istimewa 12 Hari
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Waktu ibadah lebih leluasa di Makkah & Madinah. Fasilitas bintang empat dekat pelataran.
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 space-y-1.5 text-xs text-emerald-100">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">🕋</span>
                  <span>Makkah: <strong>Maysam Al Maqom / Nada Ajyad</strong> (±150m)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">🕌</span>
                  <span>Madinah: <strong>Madinah Star / Odest Hotel</strong> (±180m)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">✈️</span>
                  <span>Maskapai: <strong>Lion Air</strong> Jakarta PP</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Harga All-In Mulai</div>
                <div className="text-xl font-extrabold text-amber-300">
                  {formatRupiah(featuredPackage.price)}
                </div>
              </div>
              <button
                onClick={() => onSelectTab('paket')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Lihat rincian paket"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Paket Umrah Reguler 9 Hari */}
          <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-5 border border-emerald-500/30 hover:border-amber-400/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Pilihan Ringkas
                </span>
                <span className="text-xs text-emerald-200">9 Hari Perjalanan</span>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Paket Umrah Reguler 9 Hari
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Pilihan tepat bagi profesional atau yang memiliki alokasi waktu ringkas, tetap khusyuk dan nyaman.
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 space-y-1.5 text-xs text-emerald-100">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">✈️</span>
                  <span>Keberangkatan: <strong>Jakarta PP</strong> (Saudia/Lion)</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">🏨</span>
                  <span>Hotel: Bintang 4 Pilihan Strategis</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-300">🤝</span>
                  <span>Bimbingan Muthawwif sesuai Sunnah</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-300 uppercase tracking-wider">Harga Mulai</div>
                <div className="text-xl font-extrabold text-amber-300">
                  {formatRupiah(PACKAGES[1].price)}
                </div>
              </div>
              <button
                onClick={() => onSelectTab('paket')}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Lihat rincian paket"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: Pembiayaan Cicilan Syariah */}
          <div className="bg-gradient-to-b from-amber-950/40 via-emerald-950/60 to-emerald-900/60 backdrop-blur-md rounded-3xl p-5 border border-amber-500/40 hover:border-amber-400 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="bg-amber-400 text-slate-900 font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Program Syariah Mandiri
                </span>
                <span className="text-xs text-amber-200">DP 50%</span>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Cicilan Syariah 1–2 Tahun
              </h3>
              <p className="text-xs text-emerald-100/80 mt-1">
                Berangkat tenang tanpa beban riba. Pembiayaan kekeluargaan langsung bersama DHW Travel.
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-amber-950/50 border border-amber-500/20 space-y-1.5 text-xs text-amber-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span><strong>DP 50%</strong> saat akad kesepakatan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Pelunasan diangsur <strong>12 s/d 24 bulan</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span><strong>0% Bunga & 0 Denda</strong> Keterlambatan</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-amber-500/20 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-amber-200 uppercase tracking-wider">Mulai Angsuran</div>
                <div className="text-xl font-extrabold text-amber-300">
                  ± Rp 739.000 <span className="text-xs text-white/70 font-normal">/bln</span>
                </div>
              </div>
              <button
                onClick={() => onSelectTab('simulasi')}
                className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Hitung</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom trust banner */}
        <div className="mt-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-wrap items-center justify-around gap-4 text-xs text-emerald-200/90 text-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Penyelenggara Berizin Resmi Kemenag</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-300" />
            <span>Hotel Terjamin Dekat Pelataran Masjid</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            <span>Pendampingan Mutawwif Profesional & Sabar</span>
          </div>
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-amber-300" />
            <span>Penerbangan Pasti Jakarta PP</span>
          </div>
        </div>
      </div>
    </section>
  );
};
