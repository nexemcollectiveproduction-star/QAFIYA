import React, { useState } from 'react';
import { 
  UserPlus, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Upload, 
  Sparkles, 
  Calendar, 
  Phone, 
  User, 
  MapPin, 
  CreditCard,
  MessageSquare,
  ArrowRight,
  Info
} from 'lucide-react';
import { PACKAGES, SCHEDULES, COMPANY_INFO } from '../data/mockData';
import { RegistrationRecord, UmrahPackage } from '../types';
import { formatRupiah, buildWhatsAppLink } from '../utils/whatsapp';

interface Props {
  preselectedPackage?: UmrahPackage;
  preselectedDp?: number;
  preselectedTenor?: number;
  onSuccessRegister: (newRecord: RegistrationRecord) => void;
  onOpenGateway: (options?: any) => void;
}

export const RegistrationForm: React.FC<Props> = ({
  preselectedPackage,
  preselectedDp,
  preselectedTenor,
  onSuccessRegister,
  onOpenGateway,
}) => {
  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [uniformSize, setUniformSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'>('L');

  const [packageId, setPackageId] = useState(preselectedPackage?.id || PACKAGES[0].id);
  const [scheduleId, setScheduleId] = useState(SCHEDULES[0].id);
  const [paymentScheme, setPaymentScheme] = useState<'Cash Keras' | 'Cicilan Syariah DP 50%'>(
    preselectedTenor ? 'Cicilan Syariah DP 50%' : 'Cicilan Syariah DP 50%'
  );
  const [tenorMonths, setTenorMonths] = useState<number>(preselectedTenor || 12);
  const [notes, setNotes] = useState('');

  const [hasKtp, setHasKtp] = useState(true);
  const [hasKk, setHasKk] = useState(true);
  const [hasPaspor, setHasPaspor] = useState(false);
  const [hasBukuNikah, setHasBukuNikah] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredRecord, setRegisteredRecord] = useState<RegistrationRecord | null>(null);

  const selectedPkg = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];
  const selectedSch = SCHEDULES.find((s) => s.id === scheduleId) || SCHEDULES[0];

  const calculatedDp = paymentScheme === 'Cicilan Syariah DP 50%'
    ? Math.round(selectedPkg.price * 0.5)
    : selectedPkg.price;

  const remaining = paymentScheme === 'Cicilan Syariah DP 50%'
    ? selectedPkg.price - calculatedDp
    : 0;

  const monthly = paymentScheme === 'Cicilan Syariah DP 50%'
    ? Math.round(remaining / tenorMonths)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      alert('Mohon lengkapi Nama Lengkap, Nomor WhatsApp, dan Kota Domisili.');
      return;
    }

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const yearPrefix = new Date().getFullYear();
    const generatedNo = `QAF-${yearPrefix}-${randomSuffix}`;

    const newRecord: RegistrationRecord = {
      id: `reg-${Date.now()}`,
      registrationNo: generatedNo,
      fullName: fullName.trim(),
      nik: nik.trim() || 'Dalam Proses Verifikasi',
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      address: address.trim(),
      gender,
      uniformSize,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      departureScheduleId: selectedSch.id,
      departureDate: selectedSch.departureDate,
      paymentScheme,
      packagePrice: selectedPkg.price,
      dpAmount: calculatedDp,
      tenorMonths: paymentScheme === 'Cicilan Syariah DP 50%' ? tenorMonths : undefined,
      monthlyInstallment: paymentScheme === 'Cicilan Syariah DP 50%' ? monthly : undefined,
      remainingAmount: remaining,
      notes: notes.trim(),
      status: 'Diterima',
      createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
      passportStatus: hasPaspor ? 'Sudah Lengkap' : 'Belum Ada',
      visaStatus: 'Menunggu',
      paymentHistory: [
        {
          id: `pay-dp-${Date.now()}`,
          date: 'Hari ini',
          title: paymentScheme === 'Cash Keras' ? 'Pelunasan Cash Keras' : 'Uang Muka (DP 50%) Akad Syariah',
          amount: calculatedDp,
          status: 'Menunggu Verifikasi',
          receiptNote: 'Menunggu transfer ke rekening resmi kemitraan',
        },
      ],
    };

    setRegisteredRecord(newRecord);
    setIsSubmitted(true);
    onSuccessRegister(newRecord);

    // Auto open WhatsApp directly with prefilled summary
    const waUrl = buildWhatsAppLink({
      type: 'registration',
      targetPhone: 'primary',
      jamaahName: newRecord.fullName,
      registrationNo: newRecord.registrationNo,
      packageName: `${newRecord.packageName} (${newRecord.departureDate})`,
      scheduleDate: newRecord.departureDate,
      notes: `Skema: ${newRecord.paymentScheme}${newRecord.tenorMonths ? ` (${newRecord.tenorMonths} bln)` : ''}. Domisili: ${newRecord.city}. Telp: ${newRecord.phone}`,
    });

    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.log('Popup blocked, available via button.');
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
            Formulir Pendaftaran Calon Jamaah
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pendaftaran Umrah & Haji Syariah
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Silakan lengkapi formulir pendaftaran di bawah ini. Setelah terkirim, data Anda akan diverifikasi dan Anda dapat langsung terhubung via WhatsApp resmi <strong>0821 4134 5551</strong>.
          </p>
        </div>

        {/* If successfully registered, show confirmation card */}
        {isSubmitted && registeredRecord ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-300 shadow-xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Alhamdulillah, Pendaftaran Berhasil Dikirim
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Nomor Registrasi: {registeredRecord.registrationNo}
              </h3>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                Data calon jamaah atas nama <strong>{registeredRecord.fullName}</strong> telah masuk ke sistem kami. Tim DHW Travel akan segera memproses akad dan kuitansi.
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Paket Pilihan:</span>
                <span className="font-bold text-slate-900">{registeredRecord.packageName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Keberangkatan:</span>
                <span className="font-bold text-emerald-800">{registeredRecord.departureDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Skema Pembayaran:</span>
                <span className="font-bold text-slate-900">{registeredRecord.paymentScheme}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Uang Muka / DP:</span>
                <span className="font-bold text-emerald-700">{formatRupiah(registeredRecord.dpAmount)}</span>
              </div>
            </div>

            {/* WhatsApp Direct Action */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Tahap Selanjutnya:</strong> Klik tombol hijau di bawah untuk mengirim konfirmasi dan rincian pendaftaran ini ke nomor WhatsApp resmi kami <strong>{COMPANY_INFO.primaryWhatsApp}</strong>.
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenGateway({
                    type: 'registration',
                    targetPhone: 'primary',
                    jamaahName: registeredRecord.fullName,
                    registrationNo: registeredRecord.registrationNo,
                    packageName: registeredRecord.packageName,
                    scheduleDate: registeredRecord.departureDate,
                  });
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/25 transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Buka WhatsApp & Kirim Data Pendaftaran</span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                ← Isi Formulir Pendaftaran Lainnya
              </button>
            </div>
          </div>
        ) : (
          /* The Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
            {/* Step 1: Data Diri */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-slate-900">Data Diri Calon Jamaah</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nama Lengkap Sesuai KTP / Paspor <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: H. Ahmad Fauzi Ridwan"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081234567890"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    NIK KTP (16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="3209..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Kota / Kabupaten Domisili <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Contoh: Cirebon / Jakarta / Indramayu"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Jenis Kelamin
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Laki-laki', 'Perempuan'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          gender === g
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Ukuran Seragam Batik
                  </label>
                  <select
                    value={uniformSize}
                    onChange={(e) => setUniformSize(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="S">S (Small)</option>
                    <option value="M">M (Medium)</option>
                    <option value="L">L (Large)</option>
                    <option value="XL">XL (Extra Large)</option>
                    <option value="XXL">XXL (Double XL)</option>
                    <option value="XXXL">XXXL (Triple XL)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan, kelurahan, kecamatan..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Pilihan Paket & Jadwal */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-slate-900">Pilihan Paket & Jadwal</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Pilih Paket Umrah
                  </label>
                  <select
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {PACKAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatRupiah(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Pilihan Jadwal Keberangkatan (Jakarta PP)
                  </label>
                  <select
                    value={scheduleId}
                    onChange={(e) => setScheduleId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    {SCHEDULES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.departureDate} ({s.packageName}) - {s.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Skema Pembayaran Syariah */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <h3 className="text-base font-bold text-slate-900">Skema Pembayaran Transparan</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentScheme('Cicilan Syariah DP 50%')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentScheme === 'Cicilan Syariah DP 50%'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Cicilan Syariah Mandiri</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full">
                      Paling Fleksibel
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    DP 50% ({formatRupiah(selectedPkg.price * 0.5)}) • Pelunasan 1–2 Tahun tanpa bunga & tanpa bank.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentScheme('Cash Keras')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentScheme === 'Cash Keras'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">Cash Keras / Lunas</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                      Langsung Selesai
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Pelunasan sekaligus saat konfirmasi akad ({formatRupiah(selectedPkg.price)}).
                  </div>
                </button>
              </div>

              {paymentScheme === 'Cicilan Syariah DP 50%' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Pilih Jangka Waktu Cicilan:</span>
                    <span className="font-bold text-emerald-700">{tenorMonths} Bulan ({tenorMonths / 12} Tahun)</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[6, 12, 18, 24].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTenorMonths(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          tenorMonths === m
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m} Bulan
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-slate-600 pt-1">
                    Angsuran: <strong>{formatRupiah(monthly)}</strong> / bulan selama {tenorMonths} bulan (0% Riba, Tanpa Denda).
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Kesiapan Dokumen */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-7 h-7 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="text-base font-bold text-slate-900">Kelengkapan Dokumen Awal</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasKtp}
                    onChange={(e) => setHasKtp(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>KTP Elektronik</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasKk}
                    onChange={(e) => setHasKk(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>Kartu Keluarga</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasPaspor}
                    onChange={(e) => setHasPaspor(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>Paspor Asli</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={hasBukuNikah}
                    onChange={(e) => setHasBukuNikah(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <span>Buku Nikah / Akta</span>
                </label>
              </div>

              <p className="text-[11px] text-slate-500">
                *Dokumen fisik/foto dapat disusulkan dan dikirimkan via WhatsApp resmi atau diantar langsung ke kantor layanan DHW Travel Cirebon & Jakarta.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/25 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>Kirim Pendaftaran & Hubungkan ke WhatsApp</span>
              </button>
              <div className="text-center text-[11px] text-slate-500 mt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Data Anda aman dan terlindungi sesuai prinsip amanah syariah.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
