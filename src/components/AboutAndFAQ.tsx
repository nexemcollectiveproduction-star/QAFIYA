import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2,
  Mail,
  Heart
} from 'lucide-react';
import { COMPANY_INFO, FAQS } from '../data/mockData';

interface Props {
  onOpenGateway: (options?: any) => void;
}

export const AboutAndFAQ: React.FC<Props> = ({ onOpenGateway }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            Profil & Pusat Bantuan
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tentang QAFIYA × Darul Hikmah Wisata
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            "{COMPANY_INFO.tagline}"
          </p>
        </div>

        {/* Company Profile & Vision */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Kemitraan Layanan Ibadah Umrah & Haji
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Membimbing dengan Hati, Melayani dengan Sunnah
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>QAFIYA × Darul Hikmah Wisata (DHW Travel)</strong> lahir dari tekad tulus memberikan solusi perjalanan ibadah ke Tanah Suci yang aman, nyaman, dan terjaga kemurnian syariatnya. Kami hadir sebagai jawaban bagi kaum muslimin yang merindukan Baitullah dengan kepastian keberangkatan, fasilitas hotel terjamin dekat pelataran, dan terbebas dari jeratan riba.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Dengan basis pelayanan di <strong>Cirebon – Jawa Barat</strong> serta keberangkatan berpusat di <strong>Bandara Internasional Soekarno-Hatta (Jakarta PP)</strong>, kami melayani calon jamaah dari seluruh penjuru nusantara dengan dedikasi penuh kekeluargaan.
              </p>

              {/* 5 Syariah Principles */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMPANY_INFO.principles.map((pr, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-emerald-950">{pr.title}</div>
                      <div className="text-[11px] text-emerald-800/80">{pr.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal & Accreditation Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-700 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs text-amber-300 font-bold uppercase">Legalitas Resmi Pemerintah</div>
                  <div className="text-base font-extrabold text-white">PPIU Kemenag RI</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2 text-xs text-emerald-100">
                <div className="font-bold text-amber-300">{COMPANY_INFO.kemenagPpiu}</div>
                <p className="text-[11px] leading-relaxed text-slate-200">
                  Terakreditasi resmi oleh Kementerian Agama Republik Indonesia sebagai Penyelenggara Perjalanan Ibadah Umrah (PPIU). Terintegrasi dengan sistem Siskopatuh resmi Kemenag.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>IATA & Asosiasi Umrah Terdaftar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Kerjasama Resmi Mu\'assasah Arab Saudi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>Muthawwif & Muthawwifah Mukim Berijazah</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Office & Direct WhatsApp Contacts */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">
              Pusat Informasi & Kantor Pelayanan
            </h3>
            <p className="text-xs text-slate-500">
              Kedua nomor kontak resmi kami siap melayani konsultasi, pendaftaran, dan informasi kapan pun Anda butuhkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Contact Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border-2 border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-3 py-1 rounded-full">
                  Layanan Utama & Konsultasi
                </span>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-500">Nomor WhatsApp Resmi Gateway:</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
                  {COMPANY_INFO.primaryWhatsApp}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Konsultasi Paket, Akad Cicilan Syariah, Jadwal Berangkat
                </div>
              </div>

              <button
                onClick={() => onOpenGateway({ targetPhone: 'primary', type: 'general' })}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Buka WhatsApp Utama (Fast Response)</span>
              </button>
            </div>

            {/* Secondary Contact Card */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
                  Pendaftaran Tambahan
                </span>
                <span className="text-xs text-slate-500">Nomor Pendukung</span>
              </div>

              <div>
                <div className="text-xs text-slate-500">Nomor WhatsApp Registrasi Kedua:</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {COMPANY_INFO.secondaryWhatsApp}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Bantuan Berkas Paspor, Pengiriman Foto Dokumen & Administrasi
                </div>
              </div>

              <button
                onClick={() => onOpenGateway({ targetPhone: 'secondary', type: 'general' })}
                className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Hubungi Nomor Pendaftaran 2</span>
              </button>
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kantor Cirebon (Pusat):</span>
              </div>
              <p className="text-slate-600">{COMPANY_INFO.addressCirebon}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lounge Bandara Soekarno-Hatta:</span>
              </div>
              <p className="text-slate-600">{COMPANY_INFO.addressJakarta}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Jam Pelayanan:</span>
              </div>
              <p className="text-slate-600">{COMPANY_INFO.operatingHours}</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              Pertanyaan yang Sering Diajukan
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Daftar Pertanyaan Umum (FAQ)
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-700 flex items-center justify-between gap-3 bg-white"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 bg-slate-50 border-t border-slate-100 leading-relaxed animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
