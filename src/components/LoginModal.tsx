import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, KeyRound, AlertCircle, Sparkles, MessageSquare, Info, Copy, Check } from 'lucide-react';
import { RoleCredentials, UserRole } from '../types';
import { COMPANY_INFO } from '../data/mockData';

interface Props {
  isOpen: boolean;
  targetRole: UserRole | null;
  credentials: RoleCredentials;
  onSuccess: (role: UserRole) => void;
  onClose: () => void;
  onOpenWhatsApp?: (options?: any) => void;
}

export const LoginModal: React.FC<Props> = ({
  isOpen,
  targetRole,
  credentials,
  onSuccess,
  onClose,
  onOpenWhatsApp,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !targetRole) return null;

  const roleLabels: Record<UserRole, { title: string; subtitle: string; iconBg: string; badge: string; defaultKey: keyof RoleCredentials }> = {
    admin: {
      title: 'Login Administrator QAFIYA',
      subtitle: 'Khusus Admin resmi untuk kelola logo, foto paket, data jamaah, dan kata sandi.',
      iconBg: 'bg-emerald-800 text-white',
      badge: 'Level Tertinggi · Administrator',
      defaultKey: 'adminPassword',
    },
    mitra: {
      title: 'Login Portal Mitra & Pembimbing',
      subtitle: 'Khusus Mitra, KBIH, dan Koordinator Rombongan jamaah QAFIYA × DHW.',
      iconBg: 'bg-amber-600 text-white',
      badge: 'Portal Kemitraan Syariah',
      defaultKey: 'mitraPassword',
    },
    jamaah_terdaftar: {
      title: 'Login Jamaah Terdaftar',
      subtitle: 'Khusus Jamaah terdaftar untuk cek status berkas, kuitansi bayar, dan id card.',
      iconBg: 'bg-teal-700 text-white',
      badge: 'Portal Jamaah Terdaftar',
      defaultKey: 'jamaahPassword',
    },
    calon_jamaah: {
      title: 'Login Calon Jamaah',
      subtitle: 'Masukkan kata sandi akses calon jamaah yang diberikan oleh Admin QAFIYA.',
      iconBg: 'bg-emerald-600 text-white',
      badge: 'Portal Calon Jamaah',
      defaultKey: 'calonPassword',
    },
  };

  const currentRoleInfo = roleLabels[targetRole] || {
    title: 'Autentikasi Akses',
    subtitle: 'Masukkan kata sandi untuk melanjutkan.',
    iconBg: 'bg-slate-800 text-white',
    badge: 'Akses Berpengaman',
    defaultKey: 'calonPassword' as keyof RoleCredentials,
  };

  const getTargetPassword = () => {
    switch (targetRole) {
      case 'admin':
        return credentials.adminPassword;
      case 'mitra':
        return credentials.mitraPassword;
      case 'jamaah_terdaftar':
        return credentials.jamaahPassword;
      case 'calon_jamaah':
        return credentials.calonPassword;
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const correctPassword = getTargetPassword();

    if (password.trim() === correctPassword) {
      setPassword('');
      setErrorMsg('');
      setShowHint(false);
      onSuccess(targetRole);
    } else {
      setErrorMsg('Kata sandi salah. Silakan periksa kembali atau hubungi Administrator via WhatsApp.');
    }
  };

  const handleCopyHint = () => {
    const pwd = getTargetPassword();
    navigator.clipboard?.writeText(pwd);
    setPassword(pwd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100 flex flex-col transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={() => {
              setPassword('');
              setErrorMsg('');
              setShowHint(false);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${currentRoleInfo.iconBg} flex items-center justify-center shadow-lg ring-2 ring-white/20`}>
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-600/40">
                {currentRoleInfo.badge}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">{currentRoleInfo.title}</h3>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 mt-2 font-light leading-relaxed">
            {currentRoleInfo.subtitle}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Kata Sandi Akses <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showHint ? 'Tutup Petunjuk' : 'Lihat Kata Sandi Awal'}</span>
              </button>
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Ketik kata sandi..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {showHint && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1.5 animate-fadeIn">
              <div className="flex items-center justify-between font-semibold">
                <span>Kata Sandi Resmi Saat Ini:</span>
                <button
                  type="button"
                  onClick={handleCopyHint}
                  className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Tersalin & Terisi' : 'Salin & Isi'}</span>
                </button>
              </div>
              <p className="font-mono bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 text-emerald-950 font-bold tracking-wider select-all">
                {getTargetPassword()}
              </p>
              <p className="text-[10px] text-emerald-700 leading-tight">
                *Hanya Admin yang dapat mengubah kata sandi ini di menu Pengaturan Admin.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Keamanan Syariah:</strong> Semua role (Admin, Mitra, Jemaah, dan Calon) dilindungi kata sandi yang dikontrol langsung oleh Admin untuk perlindungan data jamaah.
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk Sekarang</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPassword('');
                  setErrorMsg('');
                  setShowHint(false);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold text-center cursor-pointer"
              >
                Batal
              </button>
            </div>

            {/* Hubungi admin button */}
            <button
              type="button"
              onClick={() => {
                if (onOpenWhatsApp) {
                  onOpenWhatsApp({
                    type: 'general',
                    customMessage: `Assalamu’alaikum Admin QAFIYA × DHW Travel (Server ${COMPANY_INFO.primaryWhatsApp}). Mohon bantuan kata sandi untuk akses role ${currentRoleInfo.title}.`,
                  });
                } else {
                  window.open(`https://wa.me/${COMPANY_INFO.primaryWhatsAppClean}?text=${encodeURIComponent(`Assalamu’alaikum Admin QAFIYA. Mohon bantuan info kata sandi akses role ${currentRoleInfo.title}.`)}`, '_blank');
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Belum tahu kata sandi? Hubungi Admin via WA ({COMPANY_INFO.primaryWhatsApp})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
