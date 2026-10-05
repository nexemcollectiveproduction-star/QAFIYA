import { GoogleGenAI } from '@google/genai';
import { COMPANY_INFO, PACKAGES } from '../data/mockData';

// System prompt grounding for Mascot QAFI
const SYSTEM_INSTRUCTION = `
Anda adalah "QAFI", maskot dan asisten pemandu ibadah Umrah & Haji resmi dari "QAFIYA × Darul Hikmah Wisata (DHW Travel)".
Karakter Anda:
- Ramah, hangat, santun, islami, penuh senyum, dan terpercaya.
- Selalu menyapa dengan salam islami (Assalamu’alaikum Warahmatullahi Wabarakatuh atau Bismillah).
- Slogan: "Langkah Nyata Menuju Baitullah — Aman, Nyaman, Terpercaya, InsyaAllah Berkah".
- Moto: "Bersama QAFIYA Raih Ridha-Nya".
- Nomor WhatsApp Resmi Gateway: 08214134551 (Utama) dan 0821 2710 1589 (Pendaftaran Cadangan).
- Keberangkatan: Jakarta PP (Bandara Soekarno-Hatta).
- Wilayah pelayanan: Cirebon – Jawa Barat, melayani seluruh Indonesia.
- Legalitas: Izin Kemenag RI PPIU SK No. U.481/2021.
- Prinsip pembiayaan: 100% Syariah, Tanpa Bank, Tanpa BI Checking, 0% Bunga (Bebas Riba), Tanpa Denda, Tanpa Biaya Admin. DP minimal 50%, pelunasan diangsur 1-2 tahun (12-24 bulan).
- Paket Utama:
  1. Paket Umrah Istimewa 12 Hari: Rp 35.500.000,- All-In (Hotel Makkah: Maysam Al Maqom / Nada Ajyad ±150m ke Haram, Hotel Madinah: Madinah Star / Odest Hotel ±180m ke Nabawi, Lion Air Jakarta PP).
  2. Paket Umrah Reguler 9 Hari: Rp 36.950.000,-
  3. Paket Ramadhan (Awal Ramadhan, Penuh Ramadhan & Lailatul Qadar, Syawal).
  4. Badal Umrah: Rp 3.500.000,- bersertifikat.
- Berikan jawaban yang ringkas, terstruktur, ramah, dan solutif.
- Di akhir jawaban, ajak jamaah untuk konsultasi lebih lanjut melalui WhatsApp resmi gateway 08214134551 jika membutuhkan kepastian jadwal atau akad.
`;

export async function askMascotQafi(userMessage: string, history: Array<{ role: 'user' | 'model'; text: string }> = []): Promise<string> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const promptWithHistory = history
        .map((h) => `${h.role === 'user' ? 'Jamaah' : 'QAFI'}: ${h.text}`)
        .concat([`Jamaah: ${userMessage}`])
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptWithHistory,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      if (response.text && response.text.trim().length > 0) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call skipped or errored, using built-in Mascot QAFI engine:', err);
    }
  }

  // Built-in intelligent Islamic Umrah knowledge engine for Maskot QAFI
  return generateOfflineQafiResponse(userMessage);
}

function generateOfflineQafiResponse(input: string): string {
  const query = input.toLowerCase();

  if (query.includes('paket') || query.includes('harga') || query.includes('biaya') || query.includes('istimewa') || query.includes('reguler')) {
    return `Assalamu’alaikum Warahmatullahi Wabarakatuh! 😊

Alhamdulillah, QAFI bantu jelaskan pilihan paket Umrah unggulan kami ya:

🕋 **1. Paket Umrah Istimewa — 12 Hari (Paling Diminati)**
• Biaya: **Rp 35.500.000,-** All-In
• Hotel Makkah: *Maysam Al Maqom / Nada Ajyad* (±150m ke Masjidil Haram)
• Hotel Madinah: *Madinah Star / Odest Hotel* (±180m ke Masjid Nabawi)
• Maskapai: *Lion Air* Jakarta PP

🕋 **2. Paket Umrah Reguler — 9 Hari**
• Biaya: Mulai **Rp 36.950.000,-**
• Cocok untuk jamaah dengan alokasi waktu ringkas

🕋 **3. Paket Ramadhan & Syawal**
• Awal Ramadhan (12 Hari) & Penuh Ramadhan Lailatul Qadar (16 Hari)
• Paket Syawal Berkah

Semua paket di atas bisa dicicil dengan **Program Cicilan Syariah DP 50%** tanpa bank dan tanpa bunga!

Ingin QAFI bantu sambungkan ke WhatsApp resmi kami di **08214134551** untuk amankan seat?`;
  }

  if (query.includes('cicil') || query.includes('angsur') || query.includes('syariah') || query.includes('riba') || query.includes('bank') || query.includes('dp')) {
    return `Bismillah, kabar gembira bagi sahabat jamaah! ✨

Program **Pembiayaan Cicilan Syariah** di QAFIYA × Darul Hikmah Wisata dirancang murni mandiri & kekeluargaan:

✓ **DP Minimal 50%** saat penandatanganan akad kesepakatan
✓ **Jangka Waktu:** Diangsur 12 hingga 24 bulan (1–2 tahun)
✓ **100% Bebas Riba (0% Bunga)**
✓ **Tanpa Bank & Tanpa BI Checking**
✓ **Tanpa Denda** keterlambatan bila ada udzur rezeki
✓ **Tanpa Biaya Administrasi Tersembunyi**

Contoh Paket Istimewa (Rp 35,5 Juta):
• DP 50%: Rp 17.750.000,-
• Angsuran 12 bulan: ± Rp 1.479.000/bln
• Angsuran 24 bulan: ± Rp 739.000/bln

Yuk langsung konsultasikan simulasi Anda ke WhatsApp resmi: **0821 4134 5551**!`;
  }

  if (query.includes('hotel') || query.includes('makkah') || query.includes('madinah') || query.includes('jarak') || query.includes('lokasi')) {
    return `Assalamu’alaikum! QAFI sangat mengutamakan kenyamanan ibadah sahabat semua:

🏨 **Di Makkah Al-Mukarramah:**
Kami menggunakan Hotel **Maysam Al Maqom / Nada Ajyad** (Bintang 4).
• Jarak: Hanya **±150 meter** dari pelataran Masjidil Haram
• Akses jalan landai tanpa tanjakan, sangat ramah lansia & anak-anak
• Restoran menyajikan menu khas nusantara Indonesia

🏨 **Di Madinah Al-Munawwarah:**
Kami menggunakan Hotel **Madinah Star / Odest Hotel** (Bintang 4).
• Jarak: Hanya **±180 meter** ke pelataran Masjid Nabawi
• Sangat dekat dengan pintu utama dan akses ziarah Raudhah

Dengan hotel yang dekat, sahabat bisa dengan tenang sholat lima waktu berjamaah di masjid tanpa kelelahan! 🕌`;
  }

  if (query.includes('manasik') || query.includes('rukun') || query.includes('tata cara') || query.includes('ihram') || query.includes('tawaf') || query.includes('thawaf') || query.includes('sa\'i') || query.includes('sai') || query.includes('tahallul')) {
    return `Alhamdulillah, bekal ilmu adalah kunci umrah yang mabrur! QAFI ingatkan 4 Rukun Umrah yang wajib dikerjakan runtut:

1. **Ihram & Niat dari Miqat:** Mandi sunnah, mengenakan kain ihram (ikhwan) atau pakaian syar'i (akhwat), lalu berniat dan memperbanyak Talbiyah.
2. **Thawaf 7 Putaran:** Mengelilingi Ka'bah berlawanan arah jarum jam, dimulai dan diakhiri di garis Hajar Aswad dalam keadaan suci/wudhu.
3. **Sa'i 7 Kali:** Berjalan antara bukit Shafa dan bukit Marwah (dimulai di Shafa, berakhir di Marwah).
4. **Tahallul:** Mencukur gundul/memendekkan rambut (ikhwan) atau menggunting ujung rambut ±1 ruas jari (akhwat).

Di aplikasi ini, sahabat bisa buka tab **"Manasik & Doa"** untuk mendengarkan Audio Talbiyah dan membaca doa-doa Arab beserta artinya!`;
  }

  if (query.includes('syarat') || query.includes('dokumen') || query.includes('paspor') || query.includes('vaksin') || query.includes('visa')) {
    return `Untuk kelengkapan pendaftaran Umrah, berkas dasar yang perlu disiapkan:

📄 **Dokumen Utama:**
1. Paspor asli berlaku minimal 7 bulan sebelum keberangkatan (nama minimal 2–3 kata).
2. KTP Elektronik & Kartu Keluarga (KK).
3. Buku Nikah (bagi suami-istri) atau Akta Lahir (bagi anak).
4. Pas foto 4x6 latar belakang putih (fokus wajah 80%).
5. Buku Kuning / Sertifikat Vaksinasi Meningitis.

Foto dokumen bisa langsung difoto dan dikirimkan lewat WhatsApp resmi pendaftaran kami di **08214134551** atau nomor cadangan **0821 2710 1589**!`;
  }

  if (query.includes('jadwal') || query.includes('keberangkatan') || query.includes('kapan') || query.includes('bulan')) {
    return `Jadwal keberangkatan Umrah 2026–2027 kami berlangsung rutin setiap bulan berpusat dari **Jakarta PP (Bandara Soekarno-Hatta)**:

✈️ Kloter Musim Reguler: Oktober, November, Desember 2026 & Januari 2027
🌙 Kloter Awal Ramadhan 1448 H (Februari 2027)
⭐ Kloter Penuh Ramadhan & I'tikaf Lailatul Qadar (Maret 2027)
🌸 Kloter Syawal Berkah (Maret–April 2027)

Silakan buka tab **"Paket & Jadwal"** di menu atas untuk melihat sisa kuota seat per tanggalnya ya!`;
  }

  if (query.includes('kontak') || query.includes('wa') || query.includes('nomor') || query.includes('alamat') || query.includes('kantor') || query.includes('telepon')) {
    return `Sahabat bisa menghubungi tim pelayanan resmi kami:

📞 **Nomor WhatsApp Resmi Gateway Utama:**
**${COMPANY_INFO.primaryWhatsApp}** (Fast Response / Konsultasi & Pendaftaran)

📞 **Nomor Pendaftaran Tambahan:**
**${COMPANY_INFO.secondaryWhatsApp}** (Administrasi Berkas & Paspor)

🏢 **Kantor Layanan:**
• Pusat: ${COMPANY_INFO.addressCirebon}
• Lounge Hub: ${COMPANY_INFO.addressJakarta}

Tim kami siap melayani dengan senang hati dan amanah!`;
  }

  // Default friendly guidance
  return `Assalamu’alaikum Warahmatullahi Wabarakatuh! 😊

Saya **QAFI**, sahabat pemandu ibadah Anda di QAFIYA × Darul Hikmah Wisata. QAFI siap membantu Anda seputar:
1. Informasi Paket Umrah Istimewa 12 Hari & Reguler 9 Hari
2. Simulasi Program Cicilan Syariah (DP 50% tanpa bank & tanpa bunga)
3. Jadwal Keberangkatan Jakarta PP 2026–2027
4. Panduan Manasik, Doa, dan Hotel Dekat di Makkah & Madinah
5. Pendaftaran & Bantuan Dokumen

Ada yang ingin sahabat tanyakan lebih detail? Atau ingin langsung terhubung ke WhatsApp resmi kami di **08214134551**?`;
}
