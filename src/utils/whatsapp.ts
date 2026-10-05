import { COMPANY_INFO } from '../data/mockData';

export type TargetPhoneType = 'primary' | 'secondary';

export interface WhatsAppContextMessageOptions {
  type?: 'general' | 'package' | 'simulation' | 'status' | 'registration' | 'payment' | 'mitra' | 'document' | 'emergency';
  packageName?: string;
  packagePrice?: number;
  dpAmount?: number;
  tenorMonths?: number;
  monthlyInstallment?: number;
  registrationNo?: string;
  jamaahName?: string;
  scheduleDate?: string;
  notes?: string;
  customMessage?: string;
  targetPhone?: TargetPhoneType;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppLink(options: WhatsAppContextMessageOptions): string {
  const phone = options.targetPhone === 'secondary'
    ? COMPANY_INFO.secondaryWhatsAppClean
    : COMPANY_INFO.primaryWhatsAppClean;

  let message = '';

  if (options.customMessage && options.customMessage.trim().length > 0) {
    message = options.customMessage.trim();
  } else {
    switch (options.type) {
      case 'package':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim Layanan QAFIYA × Darul Hikmah Wisata.\n\nSaya ingin berkonsultasi mengenai:\n🕋 *${options.packageName || 'Paket Umrah'}*\n💰 Harga: ${options.packagePrice ? formatRupiah(options.packagePrice) : 'Sesuai Paket'}\n✈️ Keberangkatan: Jakarta PP\n\nMohon info ketersediaan seat, fasilitas hotel, dan berkas pendaftaran. Terima kasih. Semoga Allah meridhoi niat ibadah kami.`;
        break;

      case 'simulation':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim QAFIYA × DHW Travel.\n\nSaya telah membuat simulasi *Program Pembiayaan Cicilan Syariah*:\n🕋 *Paket:* ${options.packageName || 'Umrah Istimewa 12 Hari'}\n💵 *Harga Total:* ${options.packagePrice ? formatRupiah(options.packagePrice) : '-'}\n🪙 *DP Akad (50%):* ${options.dpAmount ? formatRupiah(options.dpAmount) : '-'}\n📅 *Jangka Waktu:* ${options.tenorMonths || 12} Bulan (Tanpa Bank & Bunga)\n💳 *Perkiraan Angsuran:* ${options.monthlyInstallment ? formatRupiah(options.monthlyInstallment) : '-'}/bulan\n\nSaya berminat melanjutkan konsultasi dan penandatanganan akad syariah. Mohon panduannya. Terima kasih.`;
        break;

      case 'registration':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim Pendaftaran QAFIYA × Darul Hikmah Wisata.\n\nSaya baru saja mengisi formulir pendaftaran Umrah:\n👤 *Nama Calon Jamaah:* ${options.jamaahName || '-'}\n🆔 *No. Registrasi / NIK:* ${options.registrationNo || '-'}\n🕋 *Pilihan Paket:* ${options.packageName || '-'}\n✈️ *Jadwal Keberangkatan:* ${options.scheduleDate || '-'}\n📝 *Catatan:* ${options.notes || 'Pendaftaran online melalui aplikasi'}\n\nMohon konfirmasi penerimaan pendaftaran dan informasi tahapan selanjutnya. Jazakumullah khair.`;
        break;

      case 'status':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim Layanan Jamaah QAFIYA × DHW.\n\nSaya sudah terdaftar sebagai jamaah:\n🆔 *No. Registrasi:* ${options.registrationNo || '-'}\n👤 *Nama:* ${options.jamaahName || '-'}\n\nSaya ingin menanyakan perkembangan proses dokumen (paspor/visa) dan persiapan manasik keberangkatan. Mohon informasinya. Terima kasih.`;
        break;

      case 'payment':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Bagian Keuangan QAFIYA × Darul Hikmah Wisata.\n\nSaya ingin mengonfirmasi bukti transfer pembayaran Umrah:\n👤 *Nama Jamaah:* ${options.jamaahName || '-'}\n🆔 *No. Registrasi:* ${options.registrationNo || '-'}\n💵 *Jumlah Transfer:* ${options.dpAmount ? formatRupiah(options.dpAmount) : '-'}\n📝 *Peruntukan:* ${options.notes || 'Pembayaran DP / Angsuran Cicilan Syariah'}\n\nLampiran bukti transfer terlampir bersama pesan ini. Mohon verifikasi dan diterbitkan kuitansi resminya. Terima kasih.`;
        break;

      case 'mitra':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Manajemen Kemitraan QAFIYA × Darul Hikmah Wisata.\n\nSaya ingin berkonsultasi mengenai *Program Kemitraan / Pendaftaran Rombongan Jamaah Umrah* (Majelis Taklim / KBIH / Komunitas).\n\nMohon informasi skema kerjasama syariah, materi promosi, dan pendampingan dari tim DHW Travel. Terima kasih.`;
        break;

      case 'document':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim Administrasi QAFIYA × DHW.\n\nSaya ingin menanyakan syarat dan panduan dokumen:\n👤 *Nama:* ${options.jamaahName || 'Calon Jamaah'}\n❓ *Pertanyaan:* Seputar pembuatan Paspor 3 suku kata, vaksin meningitis, dan kelengkapan visa Umrah.\n\nMohon penjelasannya. Terima kasih.`;
        break;

      case 'emergency':
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, PUSAT BANTUAN DARURAT QAFIYA × DARUL HIKMAH WISATA.\n\nSaya memerlukan bantuan cepat mengenai perjalanan ibadah Umrah:\n👤 *Nama:* ${options.jamaahName || '-'}\n🆔 *No. Jamaah:* ${options.registrationNo || '-'}\n📍 *Kebutuhan:* ${options.notes || 'Pertolongan darurat / konsultasi penting di Tanah Suci / Bandara'}\n\nMohon segera direspon. Terima kasih.`;
        break;

      case 'general':
      default:
        message = `Assalamu’alaikum Warahmatullahi Wabarakatuh, Tim Layanan QAFIYA × Darul Hikmah Wisata.\n\nSaya tertarik mengetahui informasi lengkap paket Umrah & Haji Khusus yang tersedia, jadwal keberangkatan Jakarta PP, serta program pembiayaan cicilan syariah tanpa riba.\n\nMohon informasinya. Terima kasih.\n*Bersama QAFIYA Raih Ridha-Nya.*`;
        break;
    }
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function openWhatsAppDirect(options: WhatsAppContextMessageOptions): void {
  const url = buildWhatsAppLink(options);
  // Safely open in new window/tab
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    window.location.href = url;
  }
}
