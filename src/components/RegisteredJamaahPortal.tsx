import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  Upload, 
  MessageSquare, 
  Calendar, 
  Building2, 
  Plane, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  CheckSquare, 
  Square,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { RegistrationRecord, PaymentEntry } from '../types';
import { COMPANY_INFO, LUGGAGE_CHECKLIST } from '../data/mockData';
import { formatRupiah } from '../utils/whatsapp';

interface Props {
  registrations: RegistrationRecord[];
  onOpenGateway: (options?: any) => void;
  onUpdateRegistration: (updated: RegistrationRecord) => void;
}

export const RegisteredJamaahPortal: React.FC<Props> = ({
  registrations,
  onOpenGateway,
  onUpdateRegistration,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJamaahId, setSelectedJamaahId] = useState<string>(
    registrations[0]?.id || ''
  );
  const [checkedLuggage, setCheckedLuggage] = useState<Record<string, boolean>>({
    'c-01': true,
    'c-03': true,
    'c-04': true,
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [paymentTitle, setPaymentTitle] = useState('Angsuran Cicilan');
  const [paymentAmount, setPaymentAmount] = useState<number>(1479167);
  const [paymentNote, setPaymentNote] = useState('');

  const activeJamaah = registrations.find((r) => r.id === selectedJamaahId) || registrations[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const found = registrations.find(
      (r) =>
        r.registrationNo.toLowerCase().includes(query) ||
        r.fullName.toLowerCase().includes(query) ||
        r.phone.includes(query)
    );

    if (found) {
      setSelectedJamaahId(found.id);
    } else {
      alert(`Nomor pendaftaran atau nama "${searchQuery}" tidak ditemukan.`);
    }
  };

  const toggleLuggage = (id: string) => {
    setCheckedLuggage((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUploadPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeJamaah) return;

    const newPayment: PaymentEntry = {
      id: `pay-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      title: paymentTitle,
      amount: Number(paymentAmount),
      status: 'Menunggu Verifikasi',
      receiptNote: paymentNote || 'Bukti transfer diunggah melalui portal',
    };

    const newRemaining = Math.max(0, activeJamaah.remainingAmount - Number(paymentAmount));
    const updated: RegistrationRecord = {
      ...activeJamaah,
      remainingAmount: newRemaining,
      paymentHistory: [newPayment, ...activeJamaah.paymentHistory],
    };

    onUpdateRegistration(updated);
    setIsUploadModalOpen(false);

    // Prompt user to send proof via WhatsApp
    onOpenGateway({
      type: 'payment',
      jamaahName: activeJamaah.fullName,
      registrationNo: activeJamaah.registrationNo,
      dpAmount: Number(paymentAmount),
      notes: `${paymentTitle} sejumlah ${formatRupiah(Number(paymentAmount))}. Catatan: ${paymentNote || 'Transfer via rekening resmi'}`,
    });
  };

  const pipelineStages: RegistrationRecord['status'][] = [
    'Diterima',
    'Konsultasi & Akad',
    'Pembayaran',
    'Manasik & Dokumen',
    'Siap Berangkat',
  ];

  const currentStageIndex = activeJamaah
    ? pipelineStages.indexOf(activeJamaah.status)
    : 0;

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            Portal Jamaah Terdaftar
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Status Perjalanan & Kelengkapan Pribadi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Pantau status porsi pendaftaran, jadwal angsuran syariah, checklist perlengkapan, dan konfirmasi bukti bayar langsung via WhatsApp.
          </p>
        </div>

        {/* Search & Demo Switcher Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. Registrasi (contoh: QAF-2026-081) atau Nama Jamaah..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shrink-0"
            >
              Cari Data
            </button>
          </form>

          {/* Quick select demo buttons */}
          {registrations.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs pb-1 md:pb-0">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Pilih Jamaah:</span>
              {registrations.slice(0, 4).map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setSelectedJamaahId(reg.id)}
                  className={`py-1.5 px-3 rounded-xl border font-medium shrink-0 transition-all ${
                    selectedJamaahId === reg.id
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {reg.fullName.split(' ')[0]} ({reg.registrationNo})
                </button>
              ))}
            </div>
          )}
        </div>

        {activeJamaah ? (
          <div className="space-y-8">
            {/* Digital Jamaah Card & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Digital Identity Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 shadow-xl border border-emerald-700 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-emerald-700/60 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                        Kartu Tanda Jamaah Digital
                      </span>
                      <h4 className="text-base font-extrabold text-white">
                        {COMPANY_INFO.name}
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                      <QrCode className="w-6 h-6 text-amber-300" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] text-emerald-200 uppercase font-semibold">Nomor Registrasi / Porsi</div>
                      <div className="text-xl font-mono font-black text-amber-300 tracking-wide">
                        {activeJamaah.registrationNo}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-emerald-200 uppercase font-semibold">Nama Lengkap Jamaah</div>
                      <div className="text-lg font-bold text-white">
                        {activeJamaah.fullName}
                      </div>
                      <div className="text-xs text-emerald-200/80">
                        {activeJamaah.gender} • Seragam: {activeJamaah.uniformSize} • {activeJamaah.city}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-700/40 text-xs">
                      <div>
                        <div className="text-[10px] text-emerald-300 font-medium">Jadwal Berangkat</div>
                        <div className="font-bold text-white">{activeJamaah.departureDate}</div>
                        <div className="text-[10px] text-emerald-200">Jakarta PP</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-emerald-300 font-medium">Skema Pembayaran</div>
                        <div className="font-bold text-white">{activeJamaah.paymentScheme}</div>
                        <div className="text-[10px] text-amber-300">0% Riba & Denda</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-emerald-700/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Terverifikasi DHW Travel</span>
                  </div>
                  <button
                    onClick={() => onOpenGateway({
                      type: 'status',
                      jamaahName: activeJamaah.fullName,
                      registrationNo: activeJamaah.registrationNo,
                    })}
                    className="py-1 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-bold flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3 fill-white" />
                    <span>Tanya Petugas</span>
                  </button>
                </div>
              </div>

              {/* Right: Progress Tracker / Pipeline */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-bold text-slate-900">
                      Alur Tahapan Ibadah
                    </h4>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                      Status: {activeJamaah.status}
                    </span>
                  </div>

                  {/* Horizontal Stage Indicators */}
                  <div className="relative pt-2 pb-4">
                    <div className="absolute top-1/2 left-3 right-3 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-3 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${(currentStageIndex / (pipelineStages.length - 1)) * 100}%` }}
                    />

                    <div className="relative z-10 flex justify-between">
                      {pipelineStages.map((stage, idx) => {
                        const isCompleted = idx <= currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <div key={stage} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {idx + 1}
                            </div>
                            <span className={`text-[10px] mt-2 font-medium text-center max-w-[65px] leading-tight ${
                              isCurrent ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
                            }`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Status Notice Details */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Status Paspor:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${activeJamaah.passportStatus === 'Sudah Lengkap' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                      {activeJamaah.passportStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status Visa Umrah:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${activeJamaah.visaStatus === 'Terbit' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                      {activeJamaah.visaStatus}
                    </span>
                  </div>
                  <div className="sm:col-span-2 pt-2 border-t border-slate-200 text-slate-600">
                    <strong>Catatan Pembimbing:</strong> {activeJamaah.notes || 'Semua berkas awal telah kami terima dengan baik. Mohon persiapkan diri menghadiri pertemuan manasik.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Schedule & History Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Manajemen Keuangan Syariah
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Riwayat Pembayaran & Jadwal Angsuran
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Unggah Bukti Bayar</span>
                  </button>

                  <button
                    onClick={() => onOpenGateway({
                      type: 'payment',
                      jamaahName: activeJamaah.fullName,
                      registrationNo: activeJamaah.registrationNo,
                    })}
                    className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Kirim Bukti via WA</span>
                  </button>
                </div>
              </div>

              {/* Financial Balance Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500">Harga Paket Keseluruhan</div>
                  <div className="text-xl font-black text-slate-900 mt-1">
                    {formatRupiah(activeJamaah.packagePrice)}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-medium mt-0.5">All-In Jakarta PP</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs text-emerald-800">Total Telah Dibayarkan</div>
                  <div className="text-xl font-black text-emerald-800 mt-1">
                    {formatRupiah(activeJamaah.packagePrice - activeJamaah.remainingAmount)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">DP & Angsuran Masuk</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs text-amber-800">Sisa Angsuran Pelunasan</div>
                  <div className="text-xl font-black text-amber-900 mt-1">
                    {formatRupiah(activeJamaah.remainingAmount)}
                  </div>
                  <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                    {activeJamaah.remainingAmount === 0 ? 'Alhamdulillah LUNAS' : 'Tanpa Denda & Fleksibel'}
                  </div>
                </div>
              </div>

              {/* Friendly Reminder Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Pengingat Lembut Syariah:</strong> Angsuran pelunasan dapat disetorkan setiap tanggal 10 setiap bulannya sesuai kemampuan Anda. QAFIYA × Darul Hikmah Wisata memegang teguh prinsip tanpa denda keterlambatan dan tanpa bunga. Apabila terdapat kendala rezeki, silakan hubungi tim kami untuk musyawarah kekeluargaan.
                </div>
              </div>

              {/* Payment History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Tanggal Setor</th>
                      <th className="py-3 px-4">Keterangan Pembayaran</th>
                      <th className="py-3 px-4">Jumlah (Rp)</th>
                      <th className="py-3 px-4">Status Verifikasi</th>
                      <th className="py-3 px-4">Catatan Kuitansi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeJamaah.paymentHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-medium text-slate-900">{item.date}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{item.title}</td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                          {formatRupiah(item.amount)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Lunas'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{item.receiptNote || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Luggage & Equipment Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                    Persiapan Keberangkatan
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Checklist Perlengkapan & Koper Jamaah
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {Object.values(checkedLuggage).filter(Boolean).length} dari {LUGGAGE_CHECKLIST.length} Siap
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {LUGGAGE_CHECKLIST.map((item) => {
                  const isChecked = !!checkedLuggage[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleLuggage(item.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{item.item}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{item.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <UserCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Data Jamaah Terdaftar (0 Data)</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Data simulasi awal telah di-nol-kan. Anda dapat mendaftarkan diri secara resmi melalui formulir pendaftaran, atau mencari nomor registrasi jika telah mendaftar sebelumnya.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onOpenGateway({ type: 'general' })}
                className="py-2.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Konsultasikan Pendaftaran ke WA</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Unggah Bukti Bayar */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-emerald-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Unggah Bukti Transfer Pembayaran</h3>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadPayment} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Peruntukan Pembayaran</label>
                  <select
                    value={paymentTitle}
                    onChange={(e) => setPaymentTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Pelunasan DP 50%">Uang Muka (DP 50%) Akad Syariah</option>
                    <option value="Angsuran Cicilan Bulanan">Angsuran Cicilan Bulanan</option>
                    <option value="Pelunasan Penuh">Pelunasan Penuh All-In</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nominal Transfer (Rp)</label>
                  <input
                    type="number"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bank Pengirim / Keterangan</label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Contoh: Transfer via BSI a.n Ahmad Fauzi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-600 block">Pilih file foto slip atau tangkapan layar</span>
                  <input type="file" className="text-[10px] text-slate-500 mt-2" />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                  >
                    Simpan & Kirim ke WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
