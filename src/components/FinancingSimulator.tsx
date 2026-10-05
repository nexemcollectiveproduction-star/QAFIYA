import React, { useState } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare, 
  ArrowRight, 
  Sparkles, 
  HelpCircle, 
  Coins, 
  CalendarClock, 
  FileCheck2,
  DollarSign,
  Heart
} from 'lucide-react';
import { PACKAGES, COMPANY_INFO } from '../data/mockData';
import { UmrahPackage } from '../types';
import { formatRupiah, openWhatsAppDirect } from '../utils/whatsapp';

interface Props {
  initialPackage?: UmrahPackage;
  onProceedToRegistration: (pkg: UmrahPackage, dpAmount: number, tenor: number) => void;
  onOpenGateway: (options?: any) => void;
}

export const FinancingSimulator: React.FC<Props> = ({
  initialPackage,
  onProceedToRegistration,
  onOpenGateway,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackage?.id || PACKAGES[0].id
  );
  const [dpPercentage, setDpPercentage] = useState<number>(50); // Default 50% DP
  const [tenorMonths, setTenorMonths] = useState<number>(12); // Default 12 months (1 year)
  const [customPrice, setCustomPrice] = useState<number | null>(null);

  const activePackage = PACKAGES.find((p) => p.id === selectedPackageId) || PACKAGES[0];
  const totalPrice = customPrice || activePackage.price;

  const dpAmount = Math.round(totalPrice * (dpPercentage / 100));
  const remainingAmount = totalPrice - dpAmount;
  const monthlyInstallment = Math.round(remainingAmount / tenorMonths);

  const handleSendToWhatsApp = () => {
    onOpenGateway({
      type: 'simulation',
      packageName: activePackage.name,
      packagePrice: totalPrice,
      dpAmount: dpAmount,
      tenorMonths: tenorMonths,
      monthlyInstallment: monthlyInstallment,
      notes: `Simulasi: DP ${dpPercentage}% (${formatRupiah(dpAmount)}), Tenor ${tenorMonths} Bulan (${formatRupiah(monthlyInstallment)}/bln).`,
    });
  };

  const handleProceed = () => {
    onProceedToRegistration(activePackage, dpAmount, tenorMonths);
  };

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-slate-50 via-emerald-50/30 to-slate-50 text-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-amber-700" />
            Program Mandiri Syariah
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simulasi Pembiayaan Cicilan Syariah
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Wujudkan impian ke Tanah Suci dengan tenang, tanpa beban bunga, dan tanpa keterlibatan pihak ketiga. Skema mandiri kekeluargaan bersama QAFIYA × DHW Travel.
          </p>
        </div>

        {/* Sharia Principles Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 shadow-md border border-emerald-700/50">
          <div className="flex items-center gap-2.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            Prinsip Bebas Riba 100% Sesuai Syariat
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-sm">
              <div className="font-bold text-amber-300 text-sm mb-0.5">0% Bunga</div>
              <div className="text-[11px] text-emerald-100">Bebas Riba Murni</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-sm">
              <div className="font-bold text-amber-300 text-sm mb-0.5">Tanpa Bank</div>
              <div className="text-[11px] text-emerald-100">Langsung ke Travel</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-sm">
              <div className="font-bold text-amber-300 text-sm mb-0.5">Tanpa BI Checking</div>
              <div className="text-[11px] text-emerald-100">Asas Kepercayaan</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-sm">
              <div className="font-bold text-amber-300 text-sm mb-0.5">Tanpa Denda</div>
              <div className="text-[11px] text-emerald-100">Jika Ada Kendala</div>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white/10 rounded-2xl p-2.5 border border-white/10 backdrop-blur-sm">
              <div className="font-bold text-amber-300 text-sm mb-0.5">Tanpa Admin</div>
              <div className="text-[11px] text-emerald-100">Biaya Transparan</div>
            </div>
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            {/* 1. Pilih Paket */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                1. Pilih Paket Umrah
              </label>
              <div className="space-y-2">
                {PACKAGES.filter((p) => p.category !== 'badal').map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => {
                      setSelectedPackageId(pkg.id);
                      setCustomPrice(null);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedPackageId === pkg.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{pkg.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {pkg.duration} Hari • Hotel Dekat Makkah & Madinah • Lion Air / Saudia
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <div className="font-extrabold text-emerald-800 text-xs sm:text-sm">
                        {formatRupiah(pkg.price)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Uang Muka / DP (Min 50%) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Besaran DP Akad (Minimal 50%)
                </label>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {dpPercentage}% ({formatRupiah(dpAmount)})
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {[50, 60, 70, 80].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDpPercentage(pct)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      dpPercentage === pct
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {pct}% {pct === 50 ? '(Minimal)' : ''}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={dpPercentage}
                onChange={(e) => setDpPercentage(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>DP Minimal: 50%</span>
                <span>DP Maksimal: 90%</span>
              </div>
            </div>

            {/* 3. Jangka Waktu Pelunasan (Tenor 1 - 2 Tahun) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. Jangka Waktu Pelunasan (Tenor)
                </label>
                <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {tenorMonths} Bulan ({tenorMonths / 12} Tahun)
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { m: 6, label: '6 Bulan', sub: '0.5 Tahun' },
                  { m: 12, label: '12 Bulan', sub: '1 Tahun' },
                  { m: 18, label: '18 Bulan', sub: '1.5 Tahun' },
                  { m: 24, label: '24 Bulan', sub: '2 Tahun' },
                ].map((t) => (
                  <button
                    key={t.m}
                    type="button"
                    onClick={() => setTenorMonths(t.m)}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      tenorMonths === t.m
                        ? 'bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{t.label}</div>
                    <div className={`text-[10px] ${tenorMonths === t.m ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {t.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Calculation Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-emerald-200 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Ringkasan Rencana Pembiayaan
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activePackage.name}
                </h3>
              </div>
              <span className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                <Calculator className="w-5 h-5" />
              </span>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Harga Total Paket:</span>
                <span className="font-extrabold text-slate-900">{formatRupiah(totalPrice)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Uang Muka / DP ({dpPercentage}%):</span>
                <span className="font-extrabold text-emerald-700">{formatRupiah(dpAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Sisa Pelunasan:</span>
                <span className="font-bold text-slate-800">{formatRupiah(remainingAmount)}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Jangka Waktu:</span>
                <span className="font-bold text-slate-800">{tenorMonths} Bulan ({tenorMonths / 12} Tahun)</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-500">
                <span>Margin Bunga / Riba:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  0% (Tanpa Riba)
                </span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-500">
                <span>Biaya Administrasi:</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Rp 0 (Gratis)
                </span>
              </div>
            </div>

            {/* Highlighted Monthly Installment Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-900 text-white shadow-inner text-center space-y-1">
              <div className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                Perkiraan Angsuran Bulanan:
              </div>
              <div className="text-3xl font-black text-amber-300 tracking-tight">
                {formatRupiah(monthlyInstallment)}
                <span className="text-xs font-normal text-white/80 ml-1">/bulan</span>
              </div>
              <div className="text-[11px] text-emerald-200/90 pt-1">
                Dicicil fleksibel sesuai kemampuan tanpa denda
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Konsultasikan Simulasi Ini via WA</span>
              </button>

              <button
                type="button"
                onClick={handleProceed}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Lanjut Isi Formulir Pendaftaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Small declaration note */}
            <div className="text-[11px] text-slate-500 leading-normal bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2">
              <Heart className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Simulasi ini bersifat edukatif dan mengikat setelah penandatanganan akad syariah di kantor DHW Travel atau secara tertulis jarak jauh.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
