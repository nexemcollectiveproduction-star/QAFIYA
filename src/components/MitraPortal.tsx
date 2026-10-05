import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Building2, 
  Coins, 
  Sparkles, 
  Award, 
  Download, 
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { COMPANY_INFO, PACKAGES } from '../data/mockData';
import { formatRupiah } from '../utils/whatsapp';

interface Props {
  onOpenGateway: (options?: any) => void;
}

export const MitraPortal: React.FC<Props> = ({ onOpenGateway }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [groupCount, setGroupCount] = useState<number>(10);

  // Ujrah / Bisyarah syariah per jamaah estimasi Rp 1.000.000 - Rp 1.500.000 atau reward 1 seat gratis per 15 jamaah
  const estimatedUjrahPerJamaah = 1250000;
  const totalEstimatedUjrah = groupCount * estimatedUjrahPerJamaah;
  const freeSeatBonus = Math.floor(groupCount / 15);

  const promoTexts = [
    {
      title: 'Broadcast Singkat: Paket Istimewa 12 Hari',
      text: `🕋 *UNDANGAN MENUJU BAITULLAH BERSAMA QAFIYA × DARUL HIKMAH WISATA (DHW TRAVEL)* 🕋\n\n_"Labbaikallahumma Labbaik..."_\nBismillah, mari wujudkan kerinduan sujud di pelataran Ka'bah & ziarah Makam Rasulullah ﷺ dengan bimbingan sesuai Sunnah.\n\n✨ *Paket Umrah Istimewa — 12 Hari* | Rp 35.500.000,- All-In\n🏨 Hotel Makkah: Maysam Al Maqom / Nada Ajyad (Dekat Pelataran Haram)\n🏨 Hotel Madinah: Madinah Star / Odest Hotel (Dekat Pintu Nabawi)\n✈️ Penerbangan: Lion Air Jakarta PP\n\n⭐ *PROGRAM CICILAN SYARIAH:* DP 50% di awal, sisa pelunasan diangsur 1–2 tahun!\n❌ Tanpa Bank  ❌ Tanpa Bunga (0% Riba)  ❌ Tanpa BI Checking  ❌ Tanpa Denda\n\n📞 Konsultasi & Pendaftaran Hubungi:\nWhatsApp Resmi: *${COMPANY_INFO.primaryWhatsApp}*\n*Bersama QAFIYA Raih Ridha-Nya.*`,
    },
    {
      title: 'Broadcast Program Cicilan Syariah Tanpa Riba',
      text: `🪙 *INGIN UMRAH TAPI TERKENDALA DANA PENUH?*\n\nAlhamdulillah kini hadir solusi amanah dari *QAFIYA × Darul Hikmah Wisata*:\n\n✨ *Program Pembiayaan Mandiri Cicilan Syariah*\n✓ Cukup DP 50% saat akad kesepakatan\n✓ Pelunasan diangsur fleksibel 12 hingga 24 bulan\n✓ 100% Bebas Riba, Bunga 0%\n✓ Tanpa Bank & Tanpa BI Checking\n✓ Tanpa Denda jika ada kendala\n\nIbadah tenang, keluarga berkah, pasti berangkat dengan izin resmi Kemenag RI U.481/2021.\n\n📲 Info lengkap & simulasi angsuran:\nWhatsApp: *${COMPANY_INFO.primaryWhatsApp}*`,
    },
    {
      title: 'Pengumuman Rombongan Majelis / Pengajian',
      text: `Assalamu’alaikum Warahmatullahi Wabarakatuh Jamaah Tercinta,\n\nInsyaAllah kelompok pengajian / majelis kita merencanakan *Keberangkatan Umrah Bersama* difasilitasi oleh QAFIYA × Darul Hikmah Wisata (Jakarta PP).\n\nMari daftarkan nama bapak/ibu dan keluarga untuk mengamankan kuota seat. Tersedia pendampingan khusus rombongan dari Cirebon sampai Tanah Suci.\n\nHubungi koordinator rombongan atau langsung WhatsApp ke: *${COMPANY_INFO.primaryWhatsApp}*`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            Portal Kemitraan & Pemimpin Rombongan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kemitraan Amanah Bersama QAFIYA × DHW
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Peluang khidmah mulia bagi para Asatidz, Pimpinan Majelis Taklim, KBIH, Pesantren, dan Tokoh Masyarakat di Ciayumajakuning & Seluruh Indonesia untuk membimbing jamaah menuju Baitullah.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ujrah Syariah & Reward Tour Leader</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dapatkan bisyarah / ujrah kemitraan syariah yang transparan untuk setiap jamaah terdaftar, atau reward 1 tiket gratis berangkat bersama rombongan (kelipatan 15 jamaah).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Materi Promosi Siap Pakai</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tersedia teks siaran WhatsApp siap salin, template flyer digital berlogo majelis Anda, dan formulir pendaftaran khusus grup.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Dukungan Manasik di Lokasi Anda</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tim asatidz DHW Travel siap hadir memberikan pembekalan manasik langsung di majelis taklim atau pesantren tempat rombongan Anda berkumpul.
            </p>
          </div>
        </div>

        {/* Kalkulator Simulasi Mitra */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-700/60 pb-5">
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                Kalkulator Kemitraan Kelompok
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Simulasi Apresiasi & Ujrah Syariah Rombongan
              </h3>
            </div>
            <button
              onClick={() => onOpenGateway({
                type: 'mitra',
                notes: `Saya ingin mendaftarkan rombongan sekitar ${groupCount} jamaah.`,
              })}
              className="py-2.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs flex items-center gap-2 self-start md:self-auto shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Daftarkan Rombongan via WA</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <label className="text-xs font-semibold text-emerald-200 block">
                Perkiraan Jumlah Jamaah yang Dibantu Pendaftarannya:
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={groupCount}
                  onChange={(e) => setGroupCount(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-2xl font-black text-amber-300 min-w-[70px] text-right">
                  {groupCount} <span className="text-xs text-white font-normal">Org</span>
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-emerald-300">
                <span>Minimal 5 Jamaah</span>
                <span>Rombongan Besar 50+ Jamaah</span>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
                <div className="text-[11px] text-emerald-200">Estimasi Ujrah Kemitraan:</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                  {formatRupiah(totalEstimatedUjrah)}
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">Sesuai kesepakatan akad syariah</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-center">
                <div className="text-[11px] text-emerald-200">Reward Tiket Gratis:</div>
                <div className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
                  {freeSeatBonus > 0 ? `${freeSeatBonus} Seat Gratis` : 'Setiap 15 Jamaah'}
                </div>
                <div className="text-[10px] text-emerald-300/80 mt-0.5">
                  {freeSeatBonus > 0 ? 'Dapat berangkat mendampingi' : 'Tersisa seat menuju gratis'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Kit: Broadcast Texts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Bahan Siap Sebar
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Materi Siaran WhatsApp untuk Jamaah & Grup Majelis
            </h3>
            <p className="text-xs text-slate-500">
              Cukup klik tombol "Salin Teks" lalu bagikan langsung ke grup WhatsApp pengajian, keluarga, atau status Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promoTexts.map((promo, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-2">
                    {promo.title}
                  </h4>
                  <div className="text-[11px] text-slate-600 font-mono bg-white p-3 rounded-xl border border-slate-200 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {promo.text}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleCopy(promo.text, idx)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Teks</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => onOpenGateway({
                      type: 'custom',
                      customMessage: promo.text,
                    })}
                    className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white"
                    title="Buka langsung di WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
