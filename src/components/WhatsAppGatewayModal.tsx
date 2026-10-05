import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, Building2, User, FileText, CreditCard } from 'lucide-react';
import { COMPANY_INFO } from '../data/mockData';
import { buildWhatsAppLink, WhatsAppContextMessageOptions, TargetPhoneType } from '../utils/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialOptions?: WhatsAppContextMessageOptions;
}

export const WhatsAppGatewayModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialOptions = { type: 'general' },
}) => {
  const [selectedTarget, setSelectedTarget] = useState<TargetPhoneType>(initialOptions.targetPhone || 'primary');
  const [topicType, setTopicType] = useState<WhatsAppContextMessageOptions['type']>(initialOptions.type || 'general');
  const [userName, setUserName] = useState(initialOptions.jamaahName || '');
  const [regNo, setRegNo] = useState(initialOptions.registrationNo || '');
  const [userNotes, setUserNotes] = useState(initialOptions.notes || '');

  if (!isOpen) return null;

  const currentOptions: WhatsAppContextMessageOptions = {
    type: topicType,
    targetPhone: selectedTarget,
    jamaahName: userName || initialOptions.jamaahName,
    registrationNo: regNo || initialOptions.registrationNo,
    packageName: initialOptions.packageName,
    packagePrice: initialOptions.packagePrice,
    dpAmount: initialOptions.dpAmount,
    tenorMonths: initialOptions.tenorMonths,
    monthlyInstallment: initialOptions.monthlyInstallment,
    scheduleDate: initialOptions.scheduleDate,
    notes: userNotes || initialOptions.notes,
  };

  const previewLink = buildWhatsAppLink(currentOptions);
  // Decode URL for clean human preview
  const previewText = decodeURIComponent(previewLink.split('text=')[1] || '');

  const handleLaunch = () => {
    window.open(previewLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-white shadow-inner">
              <MessageSquare className="w-6 h-6 text-[#25D366] fill-[#25D366]/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live Gateway WhatsApp
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]"></span>
                </span>
                <span className="text-[11px] text-emerald-200">Online 24 Jam</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">QAFIYA × Darul Hikmah Wisata</h3>
              <p className="text-xs text-emerald-100/90">Layanan pesan instan resmi tanpa perlu simpan nomor</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 flex-1">
          {/* Target Phone Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Tujuan Pesan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTarget('primary')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  selectedTarget === 'primary'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedTarget === 'primary' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  1
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Layanan Utama</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">Utama</span>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{COMPANY_INFO.primaryWhatsApp}</div>
                  <div className="text-[11px] text-slate-500">Konsultasi, Paket & Syariah</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTarget('secondary')}
                className={`p-3 rounded-2xl border text-left transition-all flex items-start gap-2.5 ${
                  selectedTarget === 'secondary'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  selectedTarget === 'secondary' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  2
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">Pendaftaran 2</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">Cadangan</span>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-700 mt-0.5">{COMPANY_INFO.secondaryWhatsApp}</div>
                  <div className="text-[11px] text-slate-500">Registrasi & Administrasi</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Topics */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Kebutuhan / Topik Cepat
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { key: 'general', label: 'Konsultasi Umum', icon: MessageSquare },
                { key: 'package', label: 'Info Paket & Biaya', icon: Sparkles },
                { key: 'simulation', label: 'Simulasi Cicilan', icon: CreditCard },
                { key: 'registration', label: 'Pendaftaran Baru', icon: User },
                { key: 'status', label: 'Cek Status Jamaah', icon: FileText },
                { key: 'payment', label: 'Konfirmasi Bayar', icon: CreditCard },
                { key: 'document', label: 'Paspor & Berkas', icon: FileText },
                { key: 'mitra', label: 'Kemitraan / Grup', icon: Building2 },
                { key: 'emergency', label: 'Bantuan Darurat', icon: Phone },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = topicType === t.key;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTopicType(t.key as any)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User detail helpers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">Nama Anda (Opsional)</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: H. Ahmad"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 mb-1 block">No. Pendaftaran (Jika ada)</label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="Contoh: QAF-2026-081"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 mb-1 block">Pesan Tambahan (Opsional)</label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Tulis pesan atau pertanyaan khusus..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Live Message Preview */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-semibold flex items-center gap-1 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Format Pesan Otomatis:
              </span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">Siap Kirim</span>
            </div>
            <div className="text-[12px] text-slate-700 font-mono whitespace-pre-wrap bg-white p-2.5 rounded-xl border border-slate-100 max-h-28 overflow-y-auto leading-relaxed">
              {previewText}
            </div>
          </div>

          {/* Trust points */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Aman & Resmi
            </span>
            <span>•</span>
            <span>Respon Cepat Tim Cirebon & Jakarta</span>
            <span>•</span>
            <span>Tanpa Biaya Admin</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleLaunch}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
          >
            <Send className="w-4 h-4 fill-white" />
            Buka WhatsApp Sekarang
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
