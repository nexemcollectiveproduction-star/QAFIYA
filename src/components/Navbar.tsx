import React, { useState } from 'react';
import { 
  Compass, 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  UserCheck, 
  Calculator, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Search, 
  Calendar,
  Image as ImageIcon,
  Lock,
  LogOut,
  KeyRound
} from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { UserRole } from '../types';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  onRequestRoleSwitch: (role: UserRole) => void;
  onOpenGateway: (options?: any) => void;
  customLogo: string | null;
  onLogoutRole?: (role: UserRole) => void;
  announcementText?: string;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  userRole,
  onRequestRoleSwitch,
  onOpenGateway,
  customLogo,
  onLogoutRole,
  announcementText,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'paket', label: 'Paket & Jadwal' },
    { id: 'simulasi', label: 'Simulasi Syariah' },
    { id: 'pendaftaran', label: 'Pendaftaran' },
    { id: 'status', label: 'Status Jamaah' },
    { id: 'manasik', label: 'Manasik & Doa' },
    { id: 'mitra', label: 'Kemitraan' },
    { id: 'tentang', label: 'Tentang & FAQ' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Running Text Marquee (Teks Berjalan Paling Atas Layar) */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white text-[11px] py-1.5 overflow-hidden relative border-b border-emerald-800/80 shadow-inner select-none flex items-center">
        {/* Live status badge on top bar */}
        <div className="hidden sm:flex shrink-0 z-20 items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] px-3 py-1 ml-2 rounded-lg shadow-sm uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
          <span className="font-extrabold">LIVE INFO</span>
        </div>

        {/* Soft edge gradient fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-teal-950 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div 
          onClick={() => onOpenGateway({ targetPhone: 'primary', type: 'general' })}
          className="animate-marquee whitespace-nowrap flex items-center gap-8 cursor-pointer"
          title="Klik untuk membuka WhatsApp Gateway Resmi"
        >
          {/* Loop block 1 */}
          <div className="inline-flex items-center gap-6 text-xs shrink-0">
            {announcementText && (
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-3 py-0.5 rounded-full text-[11px] shadow-sm animate-pulse">
                📢 {announcementText}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" />
              QAFIYA × Darul Hikmah Wisata
            </span>
            <span className="font-semibold text-white">
              "{COMPANY_INFO.tagline}"
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Moto: <strong className="text-amber-300">"{COMPANY_INFO.motto}"</strong>
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-100">
              Izin PPIU: {COMPANY_INFO.kemenagPpiu}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Keberangkatan: {COMPANY_INFO.departureHub}
            </span>
            <span className="text-amber-400">•</span>
            <span className="bg-emerald-800/90 text-amber-300 border border-emerald-600/50 px-2 py-0.5 rounded-md font-bold">
              Program Cicilan Syariah DP 50% Tanpa Bank & Tanpa Bunga (0% Riba)
            </span>
            <span className="text-amber-400">•</span>
            <span className="inline-flex items-center gap-1 text-white font-extrabold bg-[#25D366] px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
              <Phone className="w-3 h-3 fill-white" />
              WhatsApp Gateway Server: {COMPANY_INFO.primaryWhatsApp}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Daftar Tambahan: {COMPANY_INFO.secondaryWhatsApp}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-100">
              Hotel Makkah: Maysam Al Maqom / Nada Ajyad (±150m) • Madinah: Madinah Star / Odest Hotel (±180m)
            </span>
          </div>

          {/* Loop block 2 for continuous seamless scroll */}
          <div className="inline-flex items-center gap-6 text-xs shrink-0" aria-hidden="true">
            {announcementText && (
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black px-3 py-0.5 rounded-full text-[11px] shadow-sm animate-pulse">
                📢 {announcementText}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3 text-slate-950" />
              QAFIYA × Darul Hikmah Wisata
            </span>
            <span className="font-semibold text-white">
              "{COMPANY_INFO.tagline}"
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Moto: <strong className="text-amber-300">"{COMPANY_INFO.motto}"</strong>
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-100">
              Izin PPIU: {COMPANY_INFO.kemenagPpiu}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Keberangkatan: {COMPANY_INFO.departureHub}
            </span>
            <span className="text-amber-400">•</span>
            <span className="bg-emerald-800/90 text-amber-300 border border-emerald-600/50 px-2 py-0.5 rounded-md font-bold">
              Program Cicilan Syariah DP 50% Tanpa Bank & Tanpa Bunga (0% Riba)
            </span>
            <span className="text-amber-400">•</span>
            <span className="inline-flex items-center gap-1 text-white font-extrabold bg-[#25D366] px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
              <Phone className="w-3 h-3 fill-white" />
              WhatsApp Gateway Server: {COMPANY_INFO.primaryWhatsApp}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-200">
              Daftar Tambahan: {COMPANY_INFO.secondaryWhatsApp}
            </span>
            <span className="text-amber-400">•</span>
            <span className="text-emerald-100">
              Hotel Makkah: Maysam Al Maqom / Nada Ajyad (±150m) • Madinah: Madinah Star / Odest Hotel (±180m)
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {customLogo ? (
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform">
                <img src={customLogo} alt="Logo QAFIYA DHW" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform border border-emerald-600/30">
                <div className="relative">
                  <Compass className="w-6 h-6 text-amber-300 animate-spin-slow" />
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-lg sm:text-xl font-black tracking-wider bg-gradient-to-r from-emerald-900 via-emerald-700 to-amber-700 bg-clip-text text-transparent ${
                  activeTab === 'beranda' ? 'animate-shimmer-text drop-shadow-xs' : ''
                }`}>
                  QAFIYA
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  × DHW
                </span>
                {activeTab === 'beranda' && (
                  <span title="Sedang di Beranda">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin-slow shrink-0" />
                  </span>
                )}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-tight">
                Darul Hikmah Wisata • Umrah & Haji Syariah
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50 shadow-inner font-bold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Role Selector & Fast WA CTA */}
          <div className="flex items-center gap-2">
            {/* Quick Role Switcher Pill */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => onRequestRoleSwitch('calon_jamaah')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  userRole === 'calon_jamaah'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Calon Jamaah: Akses Berpengaman Kata Sandi"
              >
                🔍 Calon
              </button>
              <button
                onClick={() => onRequestRoleSwitch('jamaah_terdaftar')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  userRole === 'jamaah_terdaftar'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Jamaah Terdaftar: Akses Berpengaman Kata Sandi"
              >
                ✅ Jamaah
              </button>
              <button
                onClick={() => onRequestRoleSwitch('mitra')}
                className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  userRole === 'mitra'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Mitra / Rombongan: Akses Berpengaman Kata Sandi"
              >
                🤝 Mitra
              </button>
              <button
                onClick={() => onRequestRoleSwitch('admin')}
                className={`px-2 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  userRole === 'admin'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Mode Administrator: Akses Berpengaman Kata Sandi Admin"
              >
                👩‍💼 Admin
              </button>

              {onLogoutRole && (
                <button
                  type="button"
                  onClick={() => onLogoutRole(userRole)}
                  className="ml-1 p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Kunci Akses / Ganti Akun Peran Ini"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Admin-only quick Logo QAFIYA changer button */}
            {userRole === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hidden lg:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1.5 rounded-xl text-xs font-bold shadow-xs border border-amber-500 transition-all cursor-pointer"
                title="Khusus Admin: Ganti Logo QAFIYA"
              >
                <ImageIcon className="w-3.5 h-3.5 text-slate-900" />
                <span>Ganti Logo QAFIYA</span>
              </button>
            )}

            {/* Fast WhatsApp CTA Button */}
            <button
              onClick={() => onOpenGateway({ type: 'general' })}
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-[#25D366]/25 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">Hubungi Gateway</span>
              <span className="sm:hidden">WA</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-emerald-100 shadow-xl px-4 py-4 space-y-3 animate-fadeIn">
          {/* Mobile User Role selector */}
          <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 px-1">
              Pilih Peran Pengguna (Dilindungi Kata Sandi):
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  onRequestRoleSwitch('calon_jamaah');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                  userRole === 'calon_jamaah' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
                }`}
              >
                <span>🔍 Calon Jamaah</span>
                {userRole === 'calon_jamaah' && <CheckCircleIcon />}
              </button>
              <button
                onClick={() => {
                  onRequestRoleSwitch('jamaah_terdaftar');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                  userRole === 'jamaah_terdaftar' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
                }`}
              >
                <span>✅ Jamaah Terdaftar</span>
                {userRole === 'jamaah_terdaftar' && <CheckCircleIcon />}
              </button>
              <button
                onClick={() => {
                  onRequestRoleSwitch('mitra');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                  userRole === 'mitra' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
                }`}
              >
                <span>🤝 Mitra Rombongan</span>
                {userRole === 'mitra' && <CheckCircleIcon />}
              </button>
              <button
                onClick={() => {
                  onRequestRoleSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                  userRole === 'admin' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
                }`}
              >
                <span>👩‍💼 Admin DHW</span>
                {userRole === 'admin' && <CheckCircleIcon />}
              </button>

              {onLogoutRole && (
                <button
                  onClick={() => {
                    onLogoutRole(userRole);
                    setMobileMenuOpen(false);
                  }}
                  className="col-span-2 p-2 rounded-xl text-center font-bold text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kunci Sesi / Ganti Kata Sandi Peran</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile links */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between ${
                  activeTab === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>

          {/* Quick contact buttons in drawer */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGateway({ targetPhone: 'primary', type: 'general' });
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              Layanan Utama: {COMPANY_INFO.primaryWhatsApp}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

function CheckCircleIcon() {
  return (
    <span className="w-2 h-2 rounded-full bg-white"></span>
  );
}
