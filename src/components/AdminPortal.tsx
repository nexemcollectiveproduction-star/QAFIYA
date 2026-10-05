import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  Users, 
  Coins, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Filter, 
  Download, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  KeyRound, 
  Lock, 
  Sparkles, 
  Save, 
  Check,
  Package,
  Building2,
  Plane,
  X,
  Cloud,
  Database,
  RefreshCw,
  Radio
} from 'lucide-react';
import { RegistrationRecord, RoleCredentials, UmrahPackage } from '../types';
import { COMPANY_INFO } from '../data/mockData';
import { formatRupiah } from '../utils/whatsapp';

interface Props {
  registrations: RegistrationRecord[];
  onUpdateRegistration: (updated: RegistrationRecord) => void;
  onClearAllRegistrations: () => void;
  onOpenGateway: (options?: any) => void;
  customLogo: string | null;
  onUpdateLogo: (newLogo: string | null) => void;
  credentials: RoleCredentials;
  onUpdateCredentials: (newCreds: RoleCredentials) => void;
  packages: UmrahPackage[];
  onUpdatePackage: (updatedPkg: UmrahPackage) => void;
  onResetPackages: () => void;
  announcementText?: string;
  onUpdateAnnouncement?: (text: string) => void;
  firebaseConnected?: boolean;
  onSyncToFirebase?: () => Promise<void>;
}

export const AdminPortal: React.FC<Props> = ({
  registrations,
  onUpdateRegistration,
  onClearAllRegistrations,
  onOpenGateway,
  customLogo,
  onUpdateLogo,
  credentials,
  onUpdateCredentials,
  packages,
  onUpdatePackage,
  onResetPackages,
  announcementText = '',
  onUpdateAnnouncement,
  firebaseConnected = true,
  onSyncToFirebase,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'jamaah' | 'logo' | 'paket' | 'keamanan' | 'cloud'>('jamaah');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);

  // Logo manager state
  const [inputLogoUrl, setInputLogoUrl] = useState('');
  const [logoSuccessMessage, setLogoSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Package editing state
  const [editingPkg, setEditingPkg] = useState<UmrahPackage | null>(null);
  const [pkgSuccessMessage, setPkgSuccessMessage] = useState('');
  const pkgFileInputRef = useRef<HTMLInputElement>(null);

  // Password manager state
  const [adminPass, setAdminPass] = useState(credentials.adminPassword);
  const [mitraPass, setMitraPass] = useState(credentials.mitraPassword);
  const [jamaahPass, setJamaahPass] = useState(credentials.jamaahPassword);
  const [calonPass, setCalonPass] = useState(credentials.calonPassword || 'calon@qafiya2026');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showMitraPass, setShowMitraPass] = useState(false);
  const [showJamaahPass, setShowJamaahPass] = useState(false);
  const [showCalonPass, setShowCalonPass] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [credSuccessMessage, setCredSuccessMessage] = useState('');

  // Marquee announcement and Firebase Cloud state
  const [inputAnnouncement, setInputAnnouncement] = useState(announcementText);
  const [announcementSaved, setAnnouncementSaved] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
    const matchesStatus = statusFilter === 'Semua' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalJamaah = registrations.length;
  const totalRevenue = registrations.reduce((sum, r) => sum + (r.packagePrice - r.remainingAmount), 0);
  const totalRemaining = registrations.reduce((sum, r) => sum + r.remainingAmount, 0);

  const handleStatusChange = (record: RegistrationRecord, newStatus: RegistrationRecord['status']) => {
    const updated: RegistrationRecord = {
      ...record,
      status: newStatus,
    };
    onUpdateRegistration(updated);
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(updated);
    }
  };

  // Logo file upload handler (converting image file to base64 Data URL)
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file gambar maksimal 2 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateLogo(base64);
        setLogoSuccessMessage('Logo berhasil diperbarui dan diterapkan ke seluruh aplikasi!');
        setTimeout(() => setLogoSuccessMessage(''), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyLogoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLogoUrl.trim()) return;
    onUpdateLogo(inputLogoUrl.trim());
    setInputLogoUrl('');
    setLogoSuccessMessage('Logo baru dari tautan URL berhasil diterapkan!');
    setTimeout(() => setLogoSuccessMessage(''), 4000);
  };

  const handleResetLogo = () => {
    onUpdateLogo(null);
    setLogoSuccessMessage('Logo telah dikembalikan ke logo bawaan.');
    setTimeout(() => setLogoSuccessMessage(''), 4000);
  };

  const handleCopyPassword = (text: string, keyName: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCredentials({
      adminPassword: adminPass.trim(),
      mitraPassword: mitraPass.trim(),
      jamaahPassword: jamaahPass.trim(),
      calonPassword: calonPass.trim(),
    });
    setCredSuccessMessage('Kata sandi akses Admin, Mitra, Jamaah, dan Calon Jamaah berhasil disimpan!');
    setTimeout(() => setCredSuccessMessage(''), 4000);
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Panel Kontrol Administrator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Pengelolaan Pusat DHW Travel
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola data pendaftaran jamaah, penggantian logo resmi, dan manajemen kata sandi akses peran.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenGateway({
                type: 'general',
                notes: 'Pesan internal koordinasi admin DHW Travel',
              })}
              className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Buka WA Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveAdminTab('jamaah')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'jamaah'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Pendaftaran Jamaah ({totalJamaah})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('logo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'logo'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Ganti Logo QAFIYA (Hanya Admin)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('paket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'paket'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Kelola Paket & Gambar ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('keamanan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'keamanan'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Kelola Kata Sandi Akses</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('cloud')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'cloud'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-500" />
            <span>Firebase Cloud & Teks Berjalan</span>
            {firebaseConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Cloud Active" />
            )}
          </button>
        </div>

        {/* TAB 1: DATA JAMAAH & KEUANGAN */}
        {activeAdminTab === 'jamaah' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Stats Row (All 0 if no data) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Total Jamaah Terdaftar</span>
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Users className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2">{totalJamaah}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  {totalJamaah === 0 ? 'Data bersih (0 jamaah)' : 'Semua kloter 2026–2027'}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Dana Terbayar Masuk</span>
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Coins className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">
                  {formatRupiah(totalRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {totalRevenue === 0 ? 'Rp 0 (Belum ada dana masuk)' : 'DP & Angsuran terverifikasi'}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Sisa Angsuran Berjalan</span>
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Clock className="w-4 h-4" />
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-900 mt-2">
                  {formatRupiah(totalRemaining)}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">
                  {totalRemaining === 0 ? 'Rp 0' : 'Piutang syariah tanpa bunga'}
                </div>
              </div>
            </div>

            {/* Clear to 0 Button Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Status Data Simulasi:</strong> Data awal telah di-nol-kan (0 data). Formulir pendaftaran siap menerima pendaftaran jamaah baru secara riil.
                </span>
              </div>
              {registrations.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin mengosongkan / menolkan semua data jamaah?')) {
                      onClearAllRegistrations();
                    }
                  }}
                  className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shrink-0 transition-colors"
                >
                  Kosongkan / Nolkan Data Sekarang
                </button>
              )}
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama, nomor registrasi, atau no HP..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto text-xs">
                <span className="text-slate-400 font-semibold shrink-0">Filter Status:</span>
                {['Semua', 'Diterima', 'Konsultasi & Akad', 'Pembayaran', 'Manasik & Dokumen', 'Siap Berangkat'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-xl border font-medium shrink-0 transition-all ${
                      statusFilter === st
                        ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Registrations Table or Empty State (0) */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {filtered.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Belum Ada Data Jamaah Terdaftar (0 Data)
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Data simulasi telah dibersihkan menjadi 0. Ketika calon jamaah mengisi formulir pendaftaran, data resmi akan otomatis tercatat dan muncul di tabel ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">No. Registrasi</th>
                        <th className="py-3.5 px-4">Nama Jamaah & Kontak</th>
                        <th className="py-3.5 px-4">Paket & Jadwal</th>
                        <th className="py-3.5 px-4">Skema Bayar</th>
                        <th className="py-3.5 px-4">Sisa Tagihan</th>
                        <th className="py-3.5 px-4">Status Tahapan</th>
                        <th className="py-3.5 px-4 text-center">Aksi Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                            {record.registrationNo}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{record.fullName}</div>
                            <div className="text-[11px] text-slate-500">{record.phone} • {record.city}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-800">{record.packageName}</div>
                            <div className="text-[11px] text-emerald-700 font-bold">{record.departureDate}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">{record.paymentScheme}</div>
                            {record.tenorMonths && (
                              <div className="text-[11px] text-slate-500">Tenor: {record.tenorMonths} Bulan</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-amber-900">
                              {formatRupiah(record.remainingAmount)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {record.remainingAmount === 0 ? 'Lunas' : 'Belum Lunas'}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={record.status}
                              onChange={(e) => handleStatusChange(record, e.target.value as any)}
                              className="py-1 px-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Diterima">1. Diterima</option>
                              <option value="Konsultasi & Akad">2. Konsultasi & Akad</option>
                              <option value="Pembayaran">3. Pembayaran</option>
                              <option value="Manasik & Dokumen">4. Manasik & Dokumen</option>
                              <option value="Siap Berangkat">5. Siap Berangkat</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedRecord(record)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                title="Lihat Rincian Jamaah"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => onOpenGateway({
                                  type: 'status',
                                  jamaahName: record.fullName,
                                  registrationNo: record.registrationNo,
                                })}
                                className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
                                title="Hubungi Jamaah via WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GANTI LOGO APLIKASI OLEH ADMIN */}
        {activeAdminTab === 'logo' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Kustomisasi Merek
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Ganti Logo Resmi QAFIYA × Darul Hikmah Wisata
              </h3>
              <p className="text-xs text-slate-500">
                Logo yang diunggah akan langsung diterapkan di bilah navigasi, kartu identitas jamaah digital, dan bagian bawah (footer) aplikasi.
              </p>
            </div>

            {logoSuccessMessage && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{logoSuccessMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
              {/* Left: Current Logo Preview Card */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-center">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pratinjau Logo Saat Ini
                </div>

                <div className="w-32 h-32 mx-auto rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-3 overflow-hidden">
                  {customLogo ? (
                    <img src={customLogo} alt="Logo QAFIYA DHW" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 flex items-center justify-center text-amber-300 shadow-md">
                      <ShieldCheck className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {customLogo ? 'Logo Kustom Aktif' : 'Logo Bawaan QAFIYA × DHW'}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {customLogo ? 'Menggunakan gambar yang diunggah oleh admin' : 'Menggunakan lambang resmi standar'}
                  </div>
                </div>

                {customLogo && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Kembalikan ke Logo Default</span>
                  </button>
                )}
              </div>

              {/* Right: Upload Actions */}
              <div className="space-y-6">
                {/* Option 1: File Upload */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Upload className="w-4 h-4 text-emerald-700" />
                    <span>Opsi 1: Unggah File Gambar dari Komputer / HP</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Format didukung: PNG, JPG, JPEG, SVG, WebP. Disarankan gambar dengan latar transparan atau rasio persegi (1:1).
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Pilih & Ganti Logo Sekarang</span>
                  </button>
                </div>

                {/* Option 2: Image URL */}
                <form onSubmit={handleApplyLogoUrl} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-700" />
                    <span>Opsi 2: Masukkan Tautan / URL Gambar Logo</span>
                  </div>

                  <input
                    type="url"
                    value={inputLogoUrl}
                    onChange={(e) => setInputLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo-qafiya.png"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
                  >
                    Terapkan Logo dari URL
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB: KELOLA PAKET & EDIT GAMBAR PER PAKET */}
        {activeAdminTab === 'paket' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  Katalog Paket Umrah
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Kelola & Edit Gambar Per Paket Umrah
                </h3>
                <p className="text-xs text-slate-500">
                  Admin dapat mengganti foto visual setiap paket, memperbarui harga, durasi, hotel, dan fasilitas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Kembalikan semua foto dan data paket ke setelan awal pabrik?')) {
                    onResetPackages();
                    setPkgSuccessMessage('Semua paket dikembalikan ke setelan default.');
                    setTimeout(() => setPkgSuccessMessage(''), 3000);
                  }
                }}
                className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Paket ke Default</span>
              </button>
            </div>

            {pkgSuccessMessage && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{pkgSuccessMessage}</span>
              </div>
            )}

            {/* Packages Grid in Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                  <div className="relative h-44 bg-slate-900 overflow-hidden group">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="bg-emerald-800/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pkg.duration} Hari
                      </span>
                      {pkg.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {pkg.badge}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <div className="font-extrabold text-sm truncate">{pkg.name}</div>
                      <div className="text-amber-300 font-bold text-xs">{formatRupiah(pkg.price)}</div>
                    </div>
                  </div>

                  <div className="p-4 space-y-2 text-xs flex-1">
                    <div className="space-y-1 text-slate-600">
                      <div>🏨 Makkah: <strong>{pkg.hotelMakkah}</strong></div>
                      <div>🕌 Madinah: <strong>{pkg.hotelMadinah}</strong></div>
                      <div>✈️ Maskapai: <strong>{pkg.airline}</strong></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingPkg({ ...pkg })}
                      className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Gambar & Paket Ini</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Edit Paket & Gambar */}
        {editingPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 border border-emerald-100 space-y-5 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <ImageIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Edit Gambar & Data: {editingPkg.name}
                    </h3>
                    <span className="text-[11px] text-slate-500">Hanya dapat diubah oleh Administrator</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Package Image Editing Area */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">
                  Foto Visual Paket Saat Ini:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-5 h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 relative shadow-sm">
                    <img
                      src={editingPkg.image}
                      alt={editingPkg.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                      Pratinjau
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-2">
                    <input
                      ref={pkgFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 3 * 1024 * 1024) {
                            alert('Ukuran file maksimal 3 MB.');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingPkg({
                              ...editingPkg,
                              image: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => pkgFileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih Foto Baru dari Komputer/HP</span>
                    </button>

                    <div className="text-[11px] text-slate-500 text-center font-medium">atau gunakan tautan URL:</div>

                    <input
                      type="url"
                      value={editingPkg.image}
                      onChange={(e) => setEditingPkg({ ...editingPkg, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Pilihan Cepat Foto Islami Resolusi Tinggi:</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { title: 'Ka\'bah & Multazam', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop' },
                          { title: 'Masjid Nabawi Madinah', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop' },
                          { title: 'Thawaf Malam Syahdu', url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1200&auto=format&fit=crop' },
                          { title: 'Jabal Rahmah & Arafah', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop' },
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingPkg({ ...editingPkg, image: preset.url })}
                            className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 h-14 bg-slate-800 transition-all cursor-pointer"
                            title={preset.title}
                          >
                            <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            <span className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center text-[9px] text-white font-bold p-1 text-center leading-tight">
                              {preset.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Package Details Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Paket</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.name}
                    onChange={(e) => setEditingPkg({ ...editingPkg, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Harga Resmi (Rp)</label>
                  <input
                    type="number"
                    required
                    value={editingPkg.price}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Durasi (Hari)</label>
                  <input
                    type="number"
                    value={editingPkg.duration}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Label Badge (Opsional)</label>
                  <input
                    type="text"
                    value={editingPkg.badge || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, badge: e.target.value })}
                    placeholder="Contoh: Paling Diminati · All-In"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hotel Makkah</label>
                  <input
                    type="text"
                    value={editingPkg.hotelMakkah}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelMakkah: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hotel Madinah</label>
                  <input
                    type="text"
                    value={editingPkg.hotelMadinah}
                    onChange={(e) => setEditingPkg({ ...editingPkg, hotelMadinah: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Maskapai Penerbangan</label>
                  <input
                    type="text"
                    value={editingPkg.airline}
                    onChange={(e) => setEditingPkg({ ...editingPkg, airline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Deskripsi Singkat Paket</label>
                  <textarea
                    rows={2}
                    value={editingPkg.description}
                    onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onUpdatePackage(editingPkg);
                    setPkgSuccessMessage(`Perubahan paket "${editingPkg.name}" berhasil disimpan!`);
                    setTimeout(() => setPkgSuccessMessage(''), 4000);
                    setEditingPkg(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Gambar & Paket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAJEMEN KATA SANDI AKSES */}
        {activeAdminTab === 'keamanan' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                Keamanan & Akses Terbatas
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Kelola Kata Sandi Akses (Hanya Diketahui Admin)
              </h3>
              <p className="text-xs text-slate-500">
                Setiap pengguna yang ingin masuk ke Portal Admin, Portal Mitra, atau Portal Jamaah Terdaftar wajib memasukkan kata sandi yang telah Anda tetapkan di bawah ini.
              </p>
            </div>

            {credSuccessMessage && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>{credSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveCredentials} className="space-y-5 max-w-xl">
              {/* Admin Password */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>1. Kata Sandi Login Admin:</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Administrator</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(adminPass, 'admin')}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'admin' ? '✓ Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPass ? 'text' : 'password'}
                    required
                    value={adminPass}
                    onChange={(e) => setAdminPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">Digunakan untuk login ke panel administrator ini.</div>
              </div>

              {/* Mitra Password */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>2. Kata Sandi Login Mitra Rombongan:</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">Mitra / Asatidz</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(mitraPass, 'mitra')}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'mitra' ? '✓ Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showMitraPass ? 'text' : 'password'}
                    required
                    value={mitraPass}
                    onChange={(e) => setMitraPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMitraPass(!showMitraPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showMitraPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">Berikan kata sandi ini kepada Ustadz atau Koordinator Rombongan.</div>
              </div>

              {/* Jamaah Password */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>3. Kata Sandi Login Jamaah Terdaftar:</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-medium">Jamaah Resmi</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(jamaahPass, 'jamaah')}
                    className="text-[11px] text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'jamaah' ? '✓ Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showJamaahPass ? 'text' : 'password'}
                    required
                    value={jamaahPass}
                    onChange={(e) => setJamaahPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowJamaahPass(!showJamaahPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showJamaahPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">Berikan kata sandi ini kepada jamaah yang telah memiliki nomor registrasi.</div>
              </div>

              {/* Calon Jamaah Password */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>4. Kata Sandi Login Calon Jamaah:</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">Calon Jamaah</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(calonPass, 'calon')}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {copiedKey === 'calon' ? '✓ Tersalin' : 'Salin'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showCalonPass ? 'text' : 'password'}
                    required
                    value={calonPass}
                    onChange={(e) => setCalonPass(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCalonPass(!showCalonPass)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCalonPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">Diberikan kepada calon jamaah untuk membuka akses pendaftaran & bimbingan awal.</div>
              </div>

              {/* Gateway Server Phone Info Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-emerald-800 block text-[11px] uppercase tracking-wider">
                    Nomor WhatsApp Gateway Server Aktif:
                  </span>
                  <div className="text-base font-extrabold text-slate-900 font-mono">
                    {COMPANY_INFO.primaryWhatsApp}
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Format link: https://wa.me/{COMPANY_INFO.primaryWhatsAppClean}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenGateway({ targetPhone: 'primary', type: 'general' })}
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Tes Gateway</span>
                </button>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kata Sandi</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: FIREBASE CLOUD & TEKS BERJALAN */}
        {activeAdminTab === 'cloud' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Cloud Status Banner */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl border border-emerald-700/60 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-xs font-semibold text-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>Cloud Firestore: Connected & Synced</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <Database className="w-6 h-6 text-amber-400" />
                    <span>Firebase Cloud Data Center</span>
                  </h3>
                  <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
                    Database cloud Firestore aktif di regional <strong>us-west1</strong> untuk sinkronisasi paket, pendaftaran jamaah baru, dan teks pengumuman real-time.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    if (onSyncToFirebase) {
                      setIsSyncing(true);
                      await onSyncToFirebase();
                      setIsSyncing(false);
                      setSyncSuccess(true);
                      setTimeout(() => setSyncSuccess(false), 3000);
                    }
                  }}
                  disabled={isSyncing}
                  className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data ke Cloud'}</span>
                </button>
              </div>

              {syncSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-800/90 border border-emerald-400/50 text-emerald-100 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Semua paket dan data pendaftaran berhasil disinkronkan ke Firebase Firestore!</span>
                </div>
              )}

              {/* Technical Cloud Meta */}
              <div className="mt-6 pt-4 border-t border-emerald-800/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-emerald-200/80">
                <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Project ID</div>
                  <div className="font-mono text-white font-semibold">gen-lang-client-0109861866</div>
                </div>
                <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Firestore Region</div>
                  <div className="font-mono text-emerald-300 font-semibold">us-west1</div>
                </div>
                <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
                  <div className="text-slate-400 text-[10px] uppercase font-bold">Security Rules</div>
                  <div className="text-amber-300 font-semibold">Hardened ABAC Deployed</div>
                </div>
              </div>
            </div>

            {/* Top Running Text Marquee Management Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
                    <span>Kelola Teks Berjalan Paling Atas (Running Text Header)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Teks ini akan langsung berjalan di bilah pita paling atas website QAFIYA untuk mengabarkan promo, pengumuman, atau jadwal terbaru.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  Paling Atas Layar (Top Marquee)
                </span>
              </div>

              {announcementSaved && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pengumuman teks berjalan berhasil disimpan dan langsung aktif di bilah paling atas!</span>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Teks Pengumuman Tambahan (Akan disorot di marquee paling atas):
                </label>
                <textarea
                  value={inputAnnouncement}
                  onChange={(e) => setInputAnnouncement(e.target.value)}
                  placeholder="Contoh: 🌟 PROMO SPESIAL UMRAH SYAWAL 1447H DISKON HINGGA 3 JUTA! SEAT TERBATAS SISA 4 KURSI LAGI."
                  rows={3}
                  className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Tip: Jika dikosongkan, bilah paling atas tetap menampilkan informasi default kemitraan resmi QAFIYA × DHW, moto, izin PPIU, dan nomor WhatsApp gateway server.
                </p>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pratinjau Bilah Teks Berjalan:</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white text-xs overflow-hidden flex items-center gap-3 shadow-inner">
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                    LIVE
                  </span>
                  <div className="truncate text-emerald-200 text-xs">
                    {inputAnnouncement.trim() ? (
                      <strong className="text-amber-300">📢 {inputAnnouncement}</strong>
                    ) : (
                      <span>QAFIYA × Darul Hikmah Wisata • "{COMPANY_INFO.tagline}" • WhatsApp {COMPANY_INFO.primaryWhatsApp}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateAnnouncement) {
                      onUpdateAnnouncement(inputAnnouncement.trim());
                      setAnnouncementSaved(true);
                      setTimeout(() => setAnnouncementSaved(false), 3000);
                    }
                  }}
                  className="py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan & Terapkan Pengumuman</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setInputAnnouncement('');
                    if (onUpdateAnnouncement) {
                      onUpdateAnnouncement('');
                      setAnnouncementSaved(true);
                      setTimeout(() => setAnnouncementSaved(false), 3000);
                    }
                  }}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset ke Default</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Record Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-emerald-100 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Rincian Calon Jamaah</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedRecord.fullName}</h3>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">No. Registrasi</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedRecord.registrationNo}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">No. Telepon / WA</span>
                  <span className="font-bold text-slate-900">{selectedRecord.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Paket & Jadwal</span>
                  <span className="font-bold text-slate-900">{selectedRecord.packageName}</span>
                  <span className="text-emerald-700 block text-[10px]">{selectedRecord.departureDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <span className="text-slate-400 block text-[10px]">Status Tahapan</span>
                  <span className="font-bold text-emerald-800">{selectedRecord.status}</span>
                </div>
              </div>

              {/* Payment entries */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">Riwayat Setoran:</h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedRecord.paymentHistory.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center bg-slate-50">
                      <div>
                        <div className="font-bold text-slate-800">{p.title}</div>
                        <div className="text-[10px] text-slate-400">{p.date} • {p.receiptNote || '-'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-800">{formatRupiah(p.amount)}</div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 rounded">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    onOpenGateway({
                      type: 'status',
                      jamaahName: selectedRecord.fullName,
                      registrationNo: selectedRecord.registrationNo,
                    });
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Kirim Pesan WA ke Jamaah</span>
                </button>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
