export interface RoleCredentials {
  adminPassword: string;
  mitraPassword: string;
  jamaahPassword: string;
  calonPassword: string;
}

export interface AdminSettings {
  logoUrl: string | null;
  serverPhone?: string;
  credentials: RoleCredentials;
}

export type UserRole = 'calon_jamaah' | 'jamaah_terdaftar' | 'mitra' | 'admin';

export type PackageCategory = 'semua' | 'istimewa' | 'reguler' | 'ramadhan' | 'badal';

export interface UmrahPackage {
  id: string;
  name: string;
  duration: number; // in days
  category: 'istimewa' | 'reguler' | 'ramadhan' | 'badal';
  price: number;
  hotelMakkah: string;
  hotelMakkahDistance: string;
  hotelMadinah: string;
  hotelMadinahDistance: string;
  airline: string;
  departurePoint: string;
  badge?: string;
  featured?: boolean;
  description: string;
  included: string[];
  excluded: string[];
  image: string;
  highlights: string[];
}

export interface DepartureSchedule {
  id: string;
  packageId: string;
  packageName: string;
  departureDate: string; // e.g. "12 November 2026"
  returnDate: string;
  seasonTag?: 'Awal Ramadhan' | 'Penuh Ramadhan' | 'Syawal' | 'Reguler' | 'Maulid';
  year: '2026' | '2027';
  price: number;
  totalQuota: number;
  filledQuota: number;
  status: 'Tersedia' | 'Hampir Penuh' | 'Penuh';
  notes?: string;
}

export interface FinancingSimulation {
  packageId: string;
  packageName: string;
  packagePrice: number;
  dpPercentage: number; // minimum 50%
  dpAmount: number;
  remainingAmount: number;
  tenorMonths: 6 | 12 | 18 | 24;
  monthlyInstallment: number;
  adminFee: 0;
  interestRate: 0;
}

export interface RegistrationRecord {
  id: string;
  registrationNo: string;
  fullName: string;
  nik: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  gender: 'Laki-laki' | 'Perempuan';
  uniformSize: 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
  packageId: string;
  packageName: string;
  departureScheduleId: string;
  departureDate: string;
  paymentScheme: 'Cash Keras' | 'Cicilan Syariah DP 50%';
  packagePrice: number;
  dpAmount: number;
  tenorMonths?: number;
  monthlyInstallment?: number;
  remainingAmount: number;
  notes?: string;
  status: 'Diterima' | 'Konsultasi & Akad' | 'Pembayaran' | 'Manasik & Dokumen' | 'Siap Berangkat';
  createdAt: string;
  passportStatus: 'Belum Ada' | 'Dalam Proses' | 'Sudah Lengkap';
  visaStatus: 'Menunggu' | 'Diajukan' | 'Terbit';
  paymentHistory: PaymentEntry[];
}

export interface PaymentEntry {
  id: string;
  date: string;
  title: string;
  amount: number;
  status: 'Lunas' | 'Menunggu Verifikasi' | 'Belum Bayar';
  receiptNote?: string;
}

export interface MitraReferral {
  id: string;
  mitraName: string;
  mitraCode: string;
  phone: string;
  jamaahCount: number;
  totalUjrah: number;
  groupName: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  occasion: string;
  arabic: string;
  latin: string;
  translation: string;
  audioSample?: string;
}

export interface ManasikStep {
  step: number;
  title: string;
  arabicName: string;
  description: string;
  location: string;
  rules: string[];
  prayers: PrayerItem[];
}
