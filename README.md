# 🎫 Ticketing App

Aplikasi web pemesanan tiket (*event ticketing system*) modern berbasis **SvelteKit** dan **Svelte 5** dengan arsitektur **modular berorientasi domain**, pembayaran **transfer bank manual**, serta **penerbitan E-Ticket otomatis ke email pembeli** yang dilengkapi QR Code untuk validasi check-in di hari-H acara.

---

## 🏗️ Arsitektur Direktori Modular

Proyek ini menggunakan pendekatan **Domain-Driven Modular Components** yang memisahkan logika UI murni (*primitives*), komponen bisnis per fitur (*event*, *order*, *ticket*, *admin*), dan *server services*:

```text
ticketing-app/
├── src/
│   ├── app.d.ts                     # Ambient type declarations global
│   ├── app.html                     # HTML shell template
│   ├── app.css                      # Tailwind CSS v4 root stylesheet
│   │
│   ├── lib/                         # Shared modular library (diimpor via '#lib/*')
│   │   ├── types/                   # Definisi interface TypeScript terpadu
│   │   │   └── index.ts             # OrderDetail, TicketDetail, EventDetail, dsb.
│   │   │
│   │   ├── components/              # Komponen UI Modular (Svelte 5 Runes)
│   │   │   ├── ui/                  # 1. Atomic UI Primitives (Reusability Tinggi)
│   │   │   │   ├── Badge.svelte     # Badge indikator status (success, warning, info, danger)
│   │   │   │   ├── Card.svelte      # Kontainer card tema gelap konsisten
│   │   │   │   └── Modal.svelte     # Reusable dialog modal + backdrop blur + ESC handler
│   │   │   │
│   │   │   ├── event/               # 2. Modul Fitur Event & Pemesanan
│   │   │   │   ├── EventHero.svelte # Banner acara, metadata waktu/lokasi & value props
│   │   │   │   ├── TierCard.svelte  # Kartu kategori tiket + tombol kuota +/-
│   │   │   │   └── BookingSidebar.svelte # Form data pembeli + kalkulasi total biaya
│   │   │   │
│   │   │   ├── order/               # 3. Modul Fitur Pesanan & Pembayaran
│   │   │   │   ├── OrderStatusBanner.svelte # Banner status dinamis (Pending/Verified/Reject)
│   │   │   │   ├── BankTransferCard.svelte  # Info rekening tujuan + tombol salin rekening
│   │   │   │   └── ProofUploader.svelte     # Dropzone upload struk + pratinjau instan
│   │   │   │
│   │   │   ├── ticket/              # 4. Modul E-Ticket
│   │   │   │   └── DigitalTicket.svelte     # Desain tiket fisik + QR code + ramah print/PDF
│   │   │   │
│   │   │   ├── admin/               # 5. Modul Admin & Verifikasi
│   │   │   │   ├── AdminStatsGrid.svelte    # 4 Metrik card (Pendapatan, Tiket, Antrean)
│   │   │   │   ├── OrderFilterTabs.svelte   # Tab penyaring status pesanan + badge counter
│   │   │   │   ├── OrdersTable.svelte       # Tabel daftar pesanan + thumbnail bukti
│   │   │   │   ├── ProofReviewModal.svelte  # Modal zoom bukti transfer + tombol verifikasi
│   │   │   │   └── RejectModal.svelte       # Modal catatan alasan penolakan pesanan
│   │   │   │
│   │   │   └── index.ts             # Central barrel export seluruh komponen
│   │   │
│   │   └── server/                  # Server-Only Modules (hanya berjalan di server)
│   │       ├── db/                  # Koneksi database & schema Drizzle ORM
│   │       │   ├── schema.ts        # Skema tabel PostgreSQL
│   │       │   ├── seed.ts          # Script seeding data bawaan
│   │       │   └── index.ts         # Instance Drizzle & PostgreSQL client
│   │       └── services/            # Business Logic Services
│   │           ├── ticketService.ts # Layanan pemesanan, tiket, verifikasi & check-in
│   │           ├── emailService.ts  # Layanan pengiriman email Resend & generator QR
│   │           └── mockStore.ts     # Data store fallback untuk pengujian offline/lokal
│   │
│   └── routes/                      # SvelteKit File-Based Routing (Clean & Compact)
│       ├── +layout.svelte           # Root layout aplikasi
│       ├── +page.svelte             # Landing page & form beli tiket
│       ├── +page.server.ts          # Server load event & action checkout
│       │
│       ├── order/[id]/              # Halaman Invoice & Upload Bukti Pembeli
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       │
│       ├── ticket/[code]/           # Halaman Web E-Ticket Peserta
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       │
│       └── admin/                   # Portal Pengelola Acara
│           ├── login/               # Halaman Login Admin
│           │   ├── +page.svelte
│           │   └── +page.server.ts
│           ├── logout/              # Endpoint Keluar Sesi Admin
│           │   └── +server.ts
│           ├── +layout.svelte       # Layout terproteksi admin dengan navbar
│           ├── +layout.server.ts    # Guard autentikasi sesi cookie
│           ├── +page.svelte         # Dashboard daftar pesanan & verifikasi
│           ├── +page.server.ts      # Action verifikasi & tolak pembayaran
│           └── check-in/            # Pemindai Check-in Hari-H
│               ├── +page.svelte
│               └── +page.server.ts
│
├── drizzle.config.ts                # Konfigurasi Drizzle Kit untuk PostgreSQL
├── PRD.md                           # Product Requirements Document lengkap
├── AGENTS.md                        # Panduan aturan AI Agent & Svelte 5 Runes
└── vite.config.ts                   # Konfigurasi Vite & Tailwind CSS v4
```

---

## 🌟 Fitur Utama

### 1. Sisi Pembeli (Customer Facing)
- **Katalog & Detail Event:** Informasi lengkap acara, poster, lokasi, jadwal, dan daftar kategori tiket (*Early Bird, Presale, Regular, VIP*).
- **Pemesanan Cepat Tanpa Akun:** Pembeli cukup mengisi data diri (Nama, Email, No. WhatsApp) tanpa harus membuat akun (*frictionless checkout*).
- **Informasi Pembayaran Jelas:** Halaman invoice pesanan yang menampilkan total biaya, rekening tujuan transfer bank, dan tombol salin nomor rekening instan.
- **Upload Bukti Transfer:** Formulir unggah foto/struk bukti transfer dengan pratinjau gambar instan sebelum dikirim.
- **Pelacakan Status Pesanan:** Cek status pesanan secara berkala (`Pending`, `Menunggu Verifikasi`, `Terverifikasi`, `Ditolak`).
- **Web E-Ticket Digital:** Tiket digital berdesain kartu fisik dengan QR Code resolusi tinggi yang siap ditunjukkan atau dicetak/disimpan sebagai PDF.

### 2. Sisi Admin & Verifikator
- **Autentikasi Aman:** Login admin terproteksi sesi berbasis cookie HTTP-Only.
- **Dashboard Ringkasan:** Statistik pendapatan, jumlah tiket terjual, sisa kuota tiap tier, dan antrean pesanan yang butuh verifikasi.
- **Verifikasi Bukti Pembayaran:**
  - Tinjau bukti transfer yang diunggah pembeli dengan modal zoom resolusi penuh.
  - Verifikasi satu klik: Menyetujui pembayaran secara otomatis menerbitkan tiket dan memicu pengiriman email E-Ticket.
  - Penolakan pesanan dengan input pesan catatan alasan penolakan.
- **Scanner Check-in Hari-H:** Scanner QR Code terintegrasi via kamera browser / barcode reader untuk validasi tiket peserta di pintu masuk (mencegah tiket ganda / duplikasi).

### 3. Otomasi & Notifikasi Email
- **Email E-Ticket Otomatis:** Didukung oleh **Resend API**, email otomatis dikirim ke inbox pembeli tepat saat admin mengklik "Verifikasi".
- **QR Code Kriptografis Unik:** Setiap tiket memiliki kode unik dan hash QR untuk dipindai saat kedatangan.

---

## 🛠️ Tech Stack

- **Fullstack Framework:** [SvelteKit](https://svelte.dev/docs/kit) (v3+)
- **Reactivity & Components:** [Svelte 5](https://svelte.dev/docs/svelte/overview) (Runes mode strictly enforced: `$state`, `$derived`, `$props`, `$bindable`)
- **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4+)
- **Database:** PostgreSQL ([Supabase](https://supabase.com/) / [Neon](https://neon.tech/))
- **ORM & Migrations:** [Drizzle ORM](https://orm.drizzle.team/)
- **Email Service:** [Resend](https://resend.com/)
- **QR Code Engine:** `qrcode`

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- Node.js versi 20+ atau LTS terbaru
- Package manager `npm`
- Instance PostgreSQL (opsional untuk tahap dev, sistem otomatis menggunakan in-memory store jika database belum aktif)
- Akun [Resend](https://resend.com/) untuk pengiriman email (opsional, sistem memiliki mode simulasi saat dev)

### 2. Menjalankan Server Development

```bash
# Jalankan server lokal
npm run dev
```

Buka peramban di:
- **Halaman Acara (Beli Tiket):** `http://localhost:5173/`
- **Dashboard Admin:** `http://localhost:5173/admin` *(Email: `admin@eventorganizer.com` | Sandi: `adminpassword123`)*
- **Pemindai Check-in:** `http://localhost:5173/admin/check-in`

### 3. Validasi & Pengujian Kode

```bash
# Typecheck & validasi Svelte 5 Runes
npm run check

# Build production bundle
npm run build
```
