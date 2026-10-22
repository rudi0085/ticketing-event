# 🎫 Ticketing App

Aplikasi web pemesanan tiket (*event ticketing system*) modern berbasis **SvelteKit** dan **Svelte 5** dengan sistem **pembayaran transfer bank manual** dan **penerbitan E-Ticket otomatis ke email pembeli** yang dilengkapi QR Code untuk validasi check-in di hari-H.

---

## 🌟 Fitur Utama

### 1. Sisi Pembeli (Customer Facing)
- **Katalog & Detail Event:** Informasi lengkap acara, poster, lokasi, jadwal, dan daftar kategori tiket (*Early Bird, Presale, Regular, VIP*).
- **Pemesanan Cepat Tanpa Akun:** Pembeli cukup mengisi data diri (Nama, Email, No. WhatsApp) tanpa harus membuat akun (*frictionless checkout*).
- **Informasi Pembayaran Jelas:** Halaman invoice pesanan yang menampilkan total biaya, rekening tujuan transfer bank, dan batas waktu pembayaran.
- **Upload Bukti Transfer:** Formulir unggah foto/struk bukti transfer langsung di halaman invoice pesanan.
- **Pelacakan Status Pesanan:** Cek status pesanan secara berkala (`Pending`, `Menunggu Verifikasi`, `Terverifikasi`, `Ditolak`).
- **Web E-Ticket Interaktif:** Halaman akses tiket digital dengan QR Code unik yang siap ditunjukkan atau dicetak.

### 2. Sisi Admin & Verifikator
- **Autentikasi Aman:** Login admin terproteksi sesi berbasis cookie HTTP-Only.
- **Dashboard Ringkasan:** Statistik pendapatan, jumlah tiket terjual, sisa kuota tiap tier, dan antrean pesanan yang butuh verifikasi.
- **Verifikasi Bukti Pembayaran:**
  - Tinjau bukti transfer yang diunggah pembeli (zoom gambar resolusi penuh).
  - Verifikasi satu klik: Menyetujui pembayaran secara otomatis menerbitkan tiket dan memicu pengiriman email E-Ticket.
  - Penolakan pesanan dengan pesan catatan alasan penolakan (misal nominal tidak sesuai).
- **Scanner Check-in Hari-H:** Scanner QR Code terintegrasi via kamera browser untuk validasi tiket peserta di pintu masuk (mencegah tiket ganda / duplikasi).

### 3. Otomasi & Notifikasi Email
- **Email E-Ticket Otomatis:** Didukung oleh **Resend API**, email otomatis dikirim ke inbox pembeli tepat saat admin mengklik "Verifikasi".
- **QR Code Unik:** Setiap tiket memiliki kode unik terenkripsi/hash dan gambar QR Code untuk dipindai saat kedatangan.

---

## 🛠️ Tech Stack

- **Frontend & Fullstack Framework:** [SvelteKit](https://svelte.dev/docs/kit) (v3+)
- **Reactivity & Components:** [Svelte 5](https://svelte.dev/docs/svelte/overview) (Mode Runes strictly enforced: `$state`, `$derived`, `$props`)
- **Bahasa Pemrograman:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** PostgreSQL ([Supabase](https://supabase.com/) / [Neon](https://neon.tech/))
- **ORM & Migrations:** [Drizzle ORM](https://orm.drizzle.team/)
- **Email Service:** [Resend](https://resend.com/)
- **QR Code Generator & Scanner:** `qrcode` & `html5-qrcode`

---

## 📁 Struktur Direktori

```text
ticketing-app/
├── src/
│   ├── app.d.ts                # Tipe ambient global
│   ├── app.html                # Shell HTML template
│   ├── lib/
│   │   ├── assets/             # Static assets (logo, favicon)
│   │   ├── components/         # Reusable Svelte 5 UI components
│   │   │   ├── ui/             # Tombol, input, modal, badge
│   │   │   └── qr/             # Komponen display & scanner QR
│   │   ├── server/             # Server-only logic (tidak boleh diimpor di klien)
│   │   │   ├── db/             # Koneksi database & skema Drizzle
│   │   │   ├── email/          # Integrasi Resend & template email HTML
│   │   │   └── storage/        # Handler upload bukti transfer
│   │   └── types/              # Definisi interface TypeScript
│   └── routes/
│       ├── +layout.svelte      # Root layout
│       ├── +page.svelte        # Landing page & form pemesanan tiket
│       ├── order/
│       │   └── [id]/           # Halaman instruksi pembayaran & upload struk
│       ├── ticket/
│       │   └── [code]/         # Halaman E-Ticket digital untuk pembeli
│       └── admin/
│           ├── login/          # Halaman login admin
│           ├── +layout.svelte  # Admin layout dengan sidebar/navigasi
│           ├── +page.svelte    # Dashboard metrik & ringkasan
│           ├── orders/         # Tabel daftar pesanan & modal verifikasi
│           └── check-in/       # Pemindai kamera QR Code check-in
├── static/                     # Aset statis publik
├── drizzle/                    # File SQL migrasi database
├── drizzle.config.ts           # Konfigurasi Drizzle ORM
├── package.json
├── PRD.md                      # Product Requirements Document lengkap
├── AGENTS.md                   # Aturan & konvensi pengembangan AI Agent
└── vite.config.ts
```

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- Node.js versi 20+ atau LTS terbaru
- Package manager `npm` (disarankan)
- Instance PostgreSQL (bisa menggunakan [Supabase](https://supabase.com/), [Neon](https://neon.tech/), atau PostgreSQL lokal)
- Akun [Resend](https://resend.com/) untuk pengiriman email

### 2. Instalasi Dependensi
Clone repository ini dan pasang seluruh modul yang diperlukan:

```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root proyek dengan mencontoh format berikut:

```env
# Database PostgreSQL URL (Supabase / Neon)
DATABASE_URL="postgresql://user:password@host:5432/ticketing_db"

# Admin Authentication Secret
ADMIN_EMAIL="admin@eventorganizer.com"
ADMIN_PASSWORD_HASH="$2b$10$..."
SESSION_SECRET="super-secret-random-key-minimal-32-karakter"

# Resend API Key & Email Pengirim
RESEND_API_KEY="re_xxxxxxxxxxxxxx"
EMAIL_FROM="Tiket Resmi <tickets@domainkamu.com>"

# App URL Publik (untuk tautan di email & QR code)
PUBLIC_APP_URL="http://localhost:5173"
```

### 4. Setup Database & Migrasi
Jalankan migrasi skema tabel ke PostgreSQL:

```bash
# Push skema langsung ke database (development)
npx drizzle-kit push

# Atau generate dan jalankan migration
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 5. Menjalankan Server Development
Mulai server lokal:

```bash
npm run dev
```

Buka peramban di `http://localhost:5173`.

---

## 🧪 Validasi & Pengujian Kode

Proyek ini menggunakan TypeScript dan Svelte 5 Runes. Selalu pastikan kode bersih dari tipe eror:

```bash
# Jalankan typecheck & validasi Svelte
npm run check

# Mode watch saat koding
npm run check:watch

# Build production
npm run build
```

---

## 📜 Dokumen Kebutuhan Produk (PRD)

Untuk mempelajari arsitektur alur data, spesifikasi skema database relasional, enum status pesanan, serta aturan bisnis lengkap, silakan merujuk ke dokumen [PRD.md](file:///Users/rudiwicaksono/File Rudi/Development/Other/ticketing/ticketing-app/PRD.md).

---

## 🤝 Kontribusi & Standar Kode

- Selalu gunakan sintaks **Svelte 5 Runes** (`$state`, `$derived`, `$props`, `{@render ...}`). Jangan gunakan sintaks Svelte 3/4 yang sudah *deprecated* (`export let`, `$:`, `<slot />`).
- Semua fungsi database dan kredensial sensitif wajib diletakkan di `src/lib/server/` atau file `+page.server.ts`.
- Pelajari panduan khusus agen di [AGENTS.md](file:///Users/rudiwicaksono/File Rudi/Development/Other/ticketing/ticketing-app/AGENTS.md).
