import React, { useState } from 'react';
import { 
  Check, 
  X, 
  Calendar, 
  MapPin, 
  Plane, 
  Building2, 
  MessageSquare, 
  Calculator, 
  UserPlus, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Users,
  Info
} from 'lucide-react';
import { PACKAGES, SCHEDULES, COMPANY_INFO } from '../data/mockData';
import { UmrahPackage, PackageCategory } from '../types';
import { formatRupiah } from '../utils/whatsapp';

interface Props {
  onSelectPackageForSimulation: (pkg: UmrahPackage) => void;
  onSelectPackageForRegistration: (pkg: UmrahPackage, scheduleId?: string) => void;
  onOpenGateway: (options?: any) => void;
  packages?: UmrahPackage[];
  isAdmin?: boolean;
  onEditPackage?: (pkg: UmrahPackage) => void;
}

export const PackagesSection: React.FC<Props> = ({
  onSelectPackageForSimulation,
  onSelectPackageForRegistration,
  onOpenGateway,
  packages = PACKAGES,
  isAdmin = false,
  onEditPackage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PackageCategory>('semua');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>('umrah-istimewa-12d');
  const [scheduleYearFilter, setScheduleYearFilter] = useState<'Semua' | '2026' | '2027'>('Semua');

  const filteredPackages = packages.filter((p) => {
    if (selectedCategory === 'semua') return true;
    return p.category === selectedCategory;
  });

  const filteredSchedules = SCHEDULES.filter((s) => {
    if (scheduleYearFilter === 'Semua') return true;
    return s.year === scheduleYearFilter;
  });

  const toggleExpand = (id: string) => {
    setExpandedPackageId(expandedPackageId === id ? null : id);
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Pilihan Paket Umrah & Haji
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Paket Perjalanan Terpercaya & Transparan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Semua paket dirancang dengan standar kenyamanan tinggi, hotel dekat pelataran, penerbangan Jakarta PP, bimbingan sesuai Sunnah, dan opsi skema cicilan syariah tanpa riba.
          </p>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {[
              { id: 'semua', label: 'Semua Paket' },
              { id: 'istimewa', label: 'Umrah Istimewa 12 Hari' },
              { id: 'reguler', label: 'Umrah Reguler 9 Hari' },
              { id: 'ramadhan', label: 'Ramadhan & Syawal' },
              { id: 'badal', label: 'Badal Umrah' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as PackageCategory)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPackages.map((pkg) => {
            const isExpanded = expandedPackageId === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  pkg.featured
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Image and Badges */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Badge top-left */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {pkg.badge && (
                      <span className="bg-amber-400 text-slate-950 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-md">
                        {pkg.badge}
                      </span>
                    )}
                    <span className="bg-emerald-800/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border border-emerald-500/30">
                      {pkg.duration} Hari
                    </span>
                  </div>

                  {/* Admin Edit Package Image Button */}
                  {isAdmin && onEditPackage && (
                    <button
                      type="button"
                      onClick={() => onEditPackage(pkg)}
                      className="absolute top-4 right-4 z-10 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500"
                      title="Edit Gambar & Rincian Paket Ini"
                    >
                      <span>✏️ Ganti Gambar Paket</span>
                    </button>
                  )}

                  {/* Title & Departure on Image Bottom */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-amber-300 font-semibold mb-0.5 flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5" />
                      <span>Keberangkatan: {pkg.departurePoint}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold leading-tight text-white drop-shadow-sm">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4 flex-1">
                  {/* Price Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        Biaya Paket Resmi
                      </div>
                      <div className="text-2xl font-extrabold text-emerald-900">
                        {formatRupiah(pkg.price)}
                        <span className="text-xs font-normal text-slate-500 ml-1.5">/ Jamaah (All-In)</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-slate-500 block">Tersedia Cicilan Syariah</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        DP 50%: {formatRupiah(pkg.price * 0.5)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Hotel & Airline Key Specifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hotel Makkah</span>
                      </div>
                      <div className="font-bold text-slate-900">{pkg.hotelMakkah}</div>
                      <div className="text-[11px] text-emerald-700 font-medium">{pkg.hotelMakkahDistance}</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Hotel Madinah</span>
                      </div>
                      <div className="font-bold text-slate-900">{pkg.hotelMadinah}</div>
                      <div className="text-[11px] text-teal-700 font-medium">{pkg.hotelMadinahDistance}</div>
                    </div>
                  </div>

                  {/* Airline Info */}
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 text-xs text-slate-700 font-medium">
                    <Plane className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maskapai Penerbangan: <strong>{pkg.airline}</strong></span>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-bold text-slate-700">Keunggulan Paket:</div>
                    <div className="space-y-1">
                      {pkg.highlights.slice(0, 3).map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accordion for Included/Excluded */}
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleExpand(pkg.id)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 py-1"
                    >
                      <span>{isExpanded ? 'Sembunyikan Fasilitas Lengkap' : 'Lihat Fasilitas Termasuk & Tidak Termasuk'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fadeIn">
                        <div>
                          <div className="font-bold text-emerald-800 mb-2 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sudah Termasuk (Included):</span>
                          </div>
                          <ul className="space-y-1 text-slate-600">
                            {pkg.included.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 text-[10px]">●</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="font-bold text-rose-800 mb-2 flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-rose-600" />
                            <span>Belum Termasuk (Excluded):</span>
                          </div>
                          <ul className="space-y-1 text-slate-600">
                            {pkg.excluded.length > 0 ? (
                              pkg.excluded.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-rose-500 text-[10px]">✕</span>
                                  <span>{item}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-slate-500 italic">Sudah All-In tanpa tambahan</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectPackageForRegistration(pkg)}
                    className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Daftar Sekarang</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPackageForSimulation(pkg)}
                    className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-white border border-slate-300 hover:border-emerald-400 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Hitung cicilan paket ini"
                  >
                    <Calculator className="w-4 h-4 text-emerald-700" />
                    <span>Simulasi Cicilan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenGateway({ 
                      type: 'package', 
                      packageName: pkg.name, 
                      packagePrice: pkg.price 
                    })}
                    className="w-full sm:w-auto p-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    title="Konsultasikan paket ini via WhatsApp resmi"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span className="sm:hidden text-xs font-bold">Tanya WA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* JADWAL KEBERANGKATAN 2026 - 2027 */}
        <div className="pt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                  Jadwal Resmi Keberangkatan
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Jadwal Musim Umrah 2026 – 2027
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  Pemberangkatan berpusat dari Bandara Internasional Soekarno-Hatta (Jakarta PP). Penanda khusus Ramadhan & Syawal.
                </p>
              </div>

              {/* Year Filter */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
                {(['Semua', '2026', '2027'] as const).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setScheduleYearFilter(yr)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      scheduleYearFilter === yr
                        ? 'bg-white text-emerald-800 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tahun {yr}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedules Table / Cards */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Paket & Penanda Musim</th>
                    <th className="py-3.5 px-4">Tanggal Keberangkatan (Jakarta PP)</th>
                    <th className="py-3.5 px-4">Harga Paket</th>
                    <th className="py-3.5 px-4">Sisa Kuota</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi Pendaftaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedules.map((sch) => {
                    const matchedPackage = PACKAGES.find((p) => p.id === sch.packageId) || PACKAGES[0];
                    const remainingSeats = sch.totalQuota - sch.filledQuota;

                    return (
                      <tr key={sch.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-4 px-4 font-medium">
                          <div className="font-bold text-slate-900 text-sm">{sch.packageName}</div>
                          {sch.seasonTag && (
                            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sch.seasonTag === 'Penuh Ramadhan'
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : sch.seasonTag === 'Awal Ramadhan'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : sch.seasonTag === 'Syawal'
                                ? 'bg-teal-100 text-teal-800 border border-teal-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              ★ {sch.seasonTag}
                            </span>
                          )}
                          {sch.notes && (
                            <div className="text-[11px] text-slate-500 mt-0.5">{sch.notes}</div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-emerald-800 text-sm">{sch.departureDate}</div>
                          <div className="text-[11px] text-slate-500">Pulang: {sch.returnDate}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">
                            {formatRupiah(sch.price)}
                          </div>
                          <div className="text-[10px] text-emerald-700">DP 50% Cicilan Syariah</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{remainingSeats} seat tersisa</span>
                          </div>
                          <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                remainingSeats < 10 ? 'bg-rose-500' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${(sch.filledQuota / sch.totalQuota) * 100}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            sch.status === 'Hampir Penuh'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {sch.status}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectPackageForRegistration(matchedPackage, sch.id)}
                              className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                            >
                              Pilih Seat
                            </button>

                            <button
                              type="button"
                              onClick={() => onOpenGateway({
                                type: 'package',
                                packageName: `${sch.packageName} (${sch.departureDate})`,
                                packagePrice: sch.price,
                                scheduleDate: sch.departureDate
                              })}
                              className="p-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
                              title="Tanya ketersediaan jadwal ini di WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Schedule Footnote */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Catatan Keberangkatan:</strong> Tanggal keberangkatan dapat disesuaikan mengikuti jadwal slot maskapai penerbangan dan penerbitan visa Mu\'assasah Arab Saudi. Jamaah disarankan mendaftar minimal 45–60 hari sebelum jadwal untuk kelengkapan paspor & biometrik.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
