# Blueprint Pengembangan Media Pembelajaran Digital: KuadraTile

> **Subjudul:** Media Pembelajaran Interaktif Berbasis *Area Model* (Ubin Aljabar) untuk Penguasaan Konsep Perkalian Kuadrat dan Ekspansi Suku Dua.  
> **Versi Dokumen:** 1.0  
> **Platform Target:** Web App Responsif (Mobile & Desktop) — *Client-Side Only* (Tanpa Server/Database).

---

## 1. Identitas & Konsep Dasar Produk

### 1.1 Nama Produk & Alternatif
* **Nama Utama:** **KuadraTile** *(Gabungan dari "Kuadrat" dan "Tile"/Ubin Aljabar — mudah diingat, modern, dan langsung menggambarkan mekanik visualnya).*
* **Alternatif Nama:**
  1. **AlgeBlock Lab** (Bernuansa laboratorium eksplorasi geometri-aljabar).
  2. **PolaKuadrat** (Fokus pada penemuan pola identitas kuadrat).
  3. **LuasAljabar** (Sangat eksplisit untuk konteks kurikulum SMP di Indonesia).
* **Tagline:** *"Lihat Luasnya, Pahami Aljabarnya."*

### 1.2 Target Pengguna & Kurikulum
* **Target Utama:** Siswa SMP Kelas VIII–IX dan SMA Kelas X (Fase D dan Fase E Kurikulum Merdeka).
* **Target Sekunder:** Guru Matematika (sebagai alat peraga proyektor di kelas atau LKPD digital mandiri).
* **Cakupan Materi:**
  * Perkalian suku dua umum: $(x + a)(x + b)$ dan $(ax + b)(cx + d)$
  * Kuadrat jumlah: $(a + b)^2 = a^2 + 2ab + b^2$
  * Kuadrat selisih: $(a - b)^2 = a^2 - 2ab + b^2$
  * Selisih dua kuadrat: $(a + b)(a - b) = a^2 - b^2$

### 1.3 Masalah Pedagogis yang Diselesaikan
Banyak siswa terjebak menghafal metode prosedural (seperti metode "pelangi" atau FOIL) tanpa memahami makna geometrisnya. Aplikasi ini dirancang khusus untuk membongkar 3 miskonsepsi klasik:
1. **Freshman's Dream:** Menganggap $(x + 3)^2 = x^2 + 9$ (melupakan suku tengah $6x$).
2. **Kesalahan Tanda Negatif:** Keliru mengalikan bilangan negatif pada $(x - 2)(x - 3)$ atau salah menggabungkan suku sejenis seperti $+3x$ dan $-5x$.
3. **Salah Penjumlahan Pangkat:** Menjumlahkan $x^2 + 2x$ menjadi $3x^3$ atau $3x^2$ karena tidak melihat bahwa bentuk fisik persegi $x^2$ berbeda dengan batang persegi panjang $x$.

---

## 2. Alur Pedagogis: Modul Belajar Dulu atau Langsung Latihan?

**Jawaban Desain:** **Jangan pisahkan modul teks panjang dengan latihan, dan jangan pula langsung melempar siswa ke latihan *drag-and-drop* tanpa konteks.**

Gunakan pendekatan **CPA (*Concrete–Pictorial–Abstract*)** yang dipadukan dengan **Micro-Interactive Guided Discovery** dalam **4 Fase Berurutan**. Modul belajarnya dibuat singkat, visual, dan langsung bisa diklik/digeser (bukan dinding teks seperti buku PDF).

~~~text
[Fase 1: Kenalan Ubin] ---> [Fase 2: Lab Eksplorasi] ---> [Fase 3: Arena Drag-and-Drop] ---> [Fase 4: Misi Cepat & Refleksi]
  (Modul Mikro 2 menit)       (Simulasi Slider Bebas)        (Latihan Berjenjang 5 Level)       (Evaluasi & Diagnosis)
~~~

### Rincian Setiap Fase:
1. **Fase 1 — Modul Pengenalan Interaktif (*Onboarding Concept*):**
   * *Konteks Nyata:* Dimulai dari ilustrasi kebun persegi berukuran $x \times x$ yang panjangnya diperluas $a$ meter dan lebarnya diperluas $b$ meter.
   * *Perkenalan Aktor (Ubin Aljabar):* Siswa mengetuk setiap jenis ubin untuk mengetahui ukuran sisi dan luasnya ($x^2$, $x$, $1$, serta versi negatifnya $-x^2$, $-x$, $-1$).
   * *Aturan Emas "Pasangan Nol" (Zero Pairs):* Animasi singkat interaktif di mana siswa menyeret ubin $+x$ menumpuk ke atas ubin $-x$ hingga keduanya lenyap ($+x - x = 0$).
2. **Fase 2 — Lab Simulasi (*Guided Sandbox*):**
   * Siswa menggeser *slider* nilai $a$ dan $b$ pada bentuk $(x + a)(x + b)$.
   * Bangun datar berubah ukuran secara *real-time*, terbagi menjadi 4 kuadran warna yang terhubung langsung dengan rumus ekspansi di bawahnya.
   * Dilengkapi **3 Kartu Misi Penemuan** (misal: *"Atur $a = 3$ dan $b = -3$. Apa yang terjadi dengan ubin hijau/merah di tengah?"*) agar siswa menemukan sendiri rumus $(a+b)(a-b) = a^2 - b^2$.
3. **Fase 3 — Arena Latihan *Drag-and-Drop* (Inti Aplikasi):**
   * Siswa diberikan soal perkalian kuadrat, lalu menyusun ubin yang tepat ke dalam papan grid luas, menyederhanakan *zero pairs*, dan menuliskan bentuk aljabar akhirnya.
   * Menggunakan sistem *scaffolding* (bantuan dikurangi bertahap seiring naiknya level).
4. **Fase 4 — Evaluasi & Diagnostik (*Mastery Challenge*):**
   * Mode kuis campuran (sebagian visual, sebagian abstrak tanpa bantuan ubin) untuk memastikan siswa bisa mentransfer pemahaman visual ke hitungan aljabar murni.
   * Diakhiri dengan **Kartu Rapor Diagnostik** yang memberi tahu letak kelemahan spesifik siswa.

---

## 3. Daftar Lengkap Komponen & Fitur Aplikasi

### 3.1 Komponen Global & Navigasi
* **Top Navigation Bar:** Logo, indikator fase aktif (*Belajar* | *Eksplorasi* | *Latihan* | *Evaluasi*), penghitung bintang/skor, dan tombol *toggle* suara efek (*SFX*).
* **Kamus Mini Ubin (*Floating Cheat Sheet*):** Tombol ikon `?` di pojok yang membuka *modal* pengingat ukuran tiap ubin dan aturan perkalian tanda ($+ \times + = +$, $+ \times - = -$, $- \times - = +$).
* **Peta Progres (*Progress Map*):** Menampilkan jalur level yang sudah terbuka, jumlah bintang per level (1–3 bintang), dan persentase ketuntasan.

### 3.2 Komponen Modul Belajar & Lab Eksplorasi
* **Interactive Story Card:** Slideshow 4–5 langkah singkat dengan ilustrasi SVG dinamis (bukan gambar statis).
* **Area Model Simulator:**
  * Kontrol *slider* atau tombol `+/-` untuk koefisien dan konstanta.
  * Mode **Split View** (memisahkan 4 bagian luas menjadi potongan terpisah agar siswa mudah menghitung masing-masing luas: $x^2$, $ax$, $bx$, $ab$).
  * Mode **Color Link Hover:** Saat siswa mengarahkan kursor/jari ke suku $2ab$ pada rumus, bagian persegi panjang yang bersesuaian pada gambar ikut menyala (*highlight*).
* **Galeri Identitas Khusus:** Tab khusus untuk membandingkan visualisasi $(a+b)^2$, $(a-b)^2$, dan $(a+b)(a-b)$ secara berdampingan.

### 3.3 Komponen Workspace *Drag-and-Drop* (Inti Latihan)
1. **Panel Soal (*Prompt Header*):** Menampilkan ekspresi target dengan format matematis rapi (misal: *Susun luas untuk $(x + 2)(x - 1)$*).
2. **Baki Ubin (*Tile Tray*):**
   * Berisi 6 jenis ubin yang bisa diseret berulang (*infinite source*):
     * Persegi besar: $+x^2$ dan $-x^2$
     * Batang vertikal/horizontal: $+x$ dan $-x$ (dilengkapi tombol **Putar $90^\circ$** atau otomatis menyesuaikan orientasi baris/kolom agar tidak merepotkan siswa!)
     * Persegi satuan kecil: $+1$ dan $-1$
   * *Aksesibilitas Layar Sentuh:* Selain *drag-and-drop*, sediakan fitur **Tap-to-Select & Tap-to-Place** (ketuk ubin di baki, lalu ketuk slot di papan) untuk siswa dengan HP layar kecil.
3. **Papan Perkalian (*Multiplication Area Mat*):**
   * Sumbu Atas (Horizontal): Menampilkan ubin pembentuk faktor pertama (misal $x$ dan $+2$).
   * Sumbu Kiri (Vertikal): Menampilkan ubin pembentuk faktor kedua (misal $x$ dan $-1$).
   * Zona Grid Tengah: Area *snap-to-grid* tempat siswa menjatuhkan ubin hasil perkalian.
4. **Panel Penyederhanaan (*Zero-Pair & Equation Builder*):**
   * Setelah papan terisi penuh dan benar, siswa masuk ke sub-langkah **Sederhanakan**:
     * Jika ada ubin $+x$ dan $-x$, siswa dapat menyeret keduanya agar saling meniadakan (*animasi kilau/hilang*).
     * Siswa memilih atau mengetikkan hasil akhir aljabarnya (misal mengisi kotak kosong: `[_]x^2 + [_]x + [_]`).
5. **Mesin Umpan Balik Cerdas (*Smart Misconception Engine*):**
   * Tidak hanya menampilkan "Salah, coba lagi!", tetapi mendiagnosis pola kesalahan:
     * *Kasus A (Lupa suku tengah):* Jika siswa hanya mengisi pojok kiri atas ($x^2$) dan kanan bawah ($9$) pada $(x+3)^2$, sistem menyorot 2 area kosong dan berkata: *"Lihat ruang kosong di samping kanan dan bawah $x^2$. Perkalian $x$ dengan $+3$ masih perlu diisi!"*
     * *Kasus B (Salah tanda):* Jika siswa meletakkan ubin $+1$ pada irisan $-1$ dan $+1$, sistem menyorot sumbu pengalinya: *"Perhatikan sumbunya: negatif dikali positif menghasilkan ubin bertanda negatif."*
     * *Kasus C (Salah penyederhanaan):* Jika papan benar tetapi input aljabar salah menjumlahkan koefisien $x$, sistem menghitung bersama ubin yang tersisa di layar.

### 3.4 Komponen Gamifikasi & Laporan Belajar
* **Sistem Bintang & Streak:**
  * 3 Bintang: Benar tanpa bantuan (*hint*) dan maksimal 1 kesalahan.
  * 2 Bintang: Benar dengan 1 bantuan atau beberapa percobaan.
  * 1 Bintang: Berhasil menyelesaikan level.
* **Lencana Pencapaian (*Badges*):**
  * *Arsitek Kuadrat* (Menuntaskan Fase 1 & 2).
  * *Penakluk Negatif* (Menuntaskan Level 2 tanpa salah tanda).
  * *Pemburu Pasangan Nol* (Berhasil mengeliminasi minimal 10 *zero pairs*).
  * *Anti-Miskonsepsi* (Menuntaskan Level Identitas Khusus sempurna).
* **Kartu Laporan Belajar (*Exportable Summary*):**
  * Karena tanpa server/login, siswa cukup memasukkan **Nama & Kelas** di awal/akhir sesi.
  * Tersedia tombol **"Unduh Bukti Belajar (PNG)"** atau **"Salin Ringkasan Teks"** berisi nama, tanggal, level tuntas, skor total, dan catatan kekuatan/kelemahan—siap dikirim ke Google Classroom atau WhatsApp guru.

---

## 4. Struktur Kurikulum & Progresi Level

Berikut rancangan 5 level latihan berjenjang pada Fase 3 untuk memastikan kurva kesulitan terasa mulus:

| Level | Nama Misi | Bentuk Matematis | Fokus Konsep | Mekanik Tambahan |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | *Fondasi Positif* | $(x + a)(x + b)$ dengan $a, b > 0$ | Pengenalan area $x^2$, $ax$, $bx$, $ab$ dan penjumlahan suku sejenis. | *Snap-to-grid* aktif penuh + garis bantu kuadran. |
| **Level 2** | *Identitas Kuadrat* | $(x + a)^2$ | Membongkar miskonsepsi $(x+a)^2 \neq x^2 + a^2$ melalui simetri persegi. | Penekanan visual bahwa kedua persegi panjang tengah kembar ($2ax$). |
| **Level 3** | *Tantangan Negatif* | $(x - a)^2$ dan $(x - a)(x - b)$ | Perkalian tanda negatif ($- \times - = +$, $+ \times - = -$). | Pengenalan ubin berwarna merah untuk nilai negatif. |
| **Level 4** | *Pasangan Nol* | $(x + a)(x - b)$ dan $(x + a)(x - a)$ | Eliminasi $+x$ dan $-x$ (*Zero Pairs*) serta penemuan selisih kuadrat $x^2 - a^2$. | Fitur interaktif penggabungan ubin saling menghilangkan. |
| **Level 5** | *Master Koefisien* | $(ax + b)(cx + d)$ dengan $a, c \in \{2, 3\}$ | Ekspansi bentuk umum non-monik (lebih dari satu ubin $x^2$). | Garis bantu diminimalkan; siswa menyusun lebih banyak blok $x^2$. |
| **Bonus** | *Mode Detektif (Faktorisasi)* | Diberikan $x^2 + bx + c$, susun jadi persegi panjang utuh | Menghubungkan perkalian kuadrat dengan inversnya (pemfaktoran). | Diberikan tumpukan ubin di luar papan; siswa mencari panjang & lebarnya. |

---

## 5. Desain UI/UX & Panduan Visual (*Design System*)

### 5.1 Skema Warna Kognitif (*Pedagogical Color-Coding*)
Warna tidak boleh sekadar dekorasi; warna harus menjadi penanda konsep matematika yang konsisten di seluruh aplikasi (terinspirasi dari standar *Algebra Tiles* internasional, disesuaikan agar ramah buta warna melalui tekstur/pola label):

* **Ubin Positif (Warna Cerah / Dingin):**
  * $+x^2$: **Biru Indigo** (`#3B82F6`) — label teks `$+x^2$` di tengah ubin.
  * $+x$: **Hijau Zamrud** (`#10B981`) — label teks `$+x$`.
  * $+1$: **Kuning Amber** (`#F59E0B`) — label teks `$+1$`.
* **Ubin Negatif (Warna Hangat / Kontras + Garis Tepi Putus-putus/Pola Diagonal):**
  * $-x^2$, $-x$, $-1$: **Merah Koral** (`#EF4444`) dengan gradasi/intensitas berbeda per ukuran serta label jelas (`$-x^2$`, `$-x$`, `$-1$`) agar tetap dapat dibedakan oleh pengguna dengan gangguan persepsi warna.
* **Latar Belakang & Permukaan:**
  * Latar kanvas: Abu-abu sangat muda (`#F8FAFC`) dengan pola titik (*dot grid*) halus layaknya kertas berpetak modern.
  * Warna Aksen Utama: Ungu/Biru gelap (`#1E293B`) untuk tipografi agar kontras baca tinggi.

### 5.2 Prinsip Proporsi Geometri (*Non-Commensurable Ratio*)
**Sangat Penting:** Panjang sisi $x$ **TIDAK BOLEH** merupakan kelipatan bilangan bulat dari panjang sisi $1$ (misalnya jangan buat panjang $x = 3$ satuan pas), agar siswa tidak keliru mengira $x$ selalu bernilai $3$.
* **Rekomendasi Rasio Piksel (Desktop):**
  * Ubin $1$: `28px x 28px`
  * Ubin $x$: `96px x 28px` (rasio $\approx 3.43$, jelas bukan kelipatan bulat!)
  * Ubin $x^2$: `96px x 96px`

### 5.3 Wireframe Tata Letak (Desktop vs Mobile)

**Tampilan Desktop (Landscape):**
~~~text
+-----------------------------------------------------------------------+
| [Logo KuadraTile]  (1)Belajar  (2)Lab  (3)[Latihan]  (4)Uji   [?] [★] |
+-----------------------------------------------------------------------+
|  SOAL 3/5 (Level 4): Susun luas untuk  (x + 2)(x - 1)     [Reset] [💡] |
+-----------------------------------+-----------------------------------+
|         PAPAN PERKALIAN           |         BAKI UBIN & HASIL         |
|                                   |                                   |
|        [   x   ] [+1] [+1]        |  Pilih / Seret Ubin:              |
|  +---+-----------+----+----+      |  [ +x^2 ] [ +x ] [ +1 ]           |
|  | x |           |    |    |      |  [ -x^2 ] [ -x ] [ -1 ]           |
|  +---+  (Drop)   |    |    |      |                                   |
|  |-1 |           |    |    |      |  -------------------------------  |
|  +---+-----------+----+----+      |  Bentuk Aljabar Sementara:        |
|                                   |  x^2 + 2x - 1x - 2                |
|                                   |  [ Sederhanakan / Cek Jawaban ]   |
+-----------------------------------+-----------------------------------+
|  💬 Feedback: "Bagus! Sekarang gabungkan +x dan -x yang berpasangan." |
+-----------------------------------------------------------------------+
~~~

**Tampilan Mobile (Portrait — Dioptimalkan untuk Ibu Jari):**
~~~text
+-------------------------------+
| [KuadraTile] Lv.4  [?] [★ 12] |
+-------------------------------+
| Soal: (x + 2)(x - 1)  [Reset] |
+-------------------------------+
|       PAPAN PERKALIAN         |
|      [  x  ] [+1] [+1]        |
|   +--+-------+----+----+      |
|   |x |  x^2  | +x | +x |      |
|   +--+-------+----+----+      |
|   |-1|  -x   | -1 | -1 |      |
|   +--+-------+----+----+      |
+-------------------------------+
| 💬 Feedback singkat di sini   |
+-------------------------------+
| [+x^2][+x][+1] [-x^2][-x][-1] | <-- Baki Ubin di bawah (mudah dijangkau)
|       [ Cek Jawaban ]         |
+-------------------------------+
~~~

---

## 6. Arsitektur Teknis & Tech Stack

### 6.1 Rekomendasi Tech Stack
| Lapisan | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Framework Utama** | **React 18+ & TypeScript** | Komponen modular, *type-safety* ketat untuk logika matematika dan koordinat grid. |
| **Build Tool** | **Vite** | Waktu *build* sangat cepat dan konfigurasi minimal untuk Vercel/GitHub Pages. |
| **Styling** | **Tailwind CSS** | Memudahkan pembuatan desain responsif (*mobile-first*) dan sistem warna konsisten. |
| **Drag-and-Drop** | **`@dnd-kit/core`** | Ringan, mendukung sentuhan layar HP (*TouchSensor*), mouse, dan keyboard (aksesibel). |
| **Animasi** | **Framer Motion** | Efek *snap-to-grid* halus, transisi antar fase, dan animasi lenyapnya *zero pairs*. |
| **Render Matematika** | **KaTeX** (`react-katex`) | Merender ekspresi LaTeX seperti $(2x - 3)^2$ dengan tajam dan jauh lebih cepat dari MathJax. |
| **Ekspor Laporan** | **`html-to-image`** | Mengonversi kartu rapor hasil belajar siswa menjadi file PNG di sisi klien. |
| **State & Storage** | **Zustand + `localStorage`** | Menyimpan progres level, bintang, dan lencana siswa secara persisten di browser tanpa perlu database backend. |

### 6.2 Struktur Direktori Proyek
~~~text
kuadratile/
├── public/
│   ├── favicon.svg
│   └── manifest.json           # Untuk dukungan PWA (bisa diinstal di HP)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── CheatSheetModal.tsx
│   │   ├── learn/
│   │   │   ├── IntroStory.tsx      # Fase 1: Modul mikro-interaktif
│   │   │   └── ZeroPairDemo.tsx
│   │   ├── sandbox/
│   │   │   ├── AreaSimulator.tsx   # Fase 2: Lab slider real-time
│   │   │   └── SpecialIdentities.tsx
│   │   ├── workspace/
│   │   │   ├── TileItem.tsx        # Visualisasi SVG/CSS tiap jenis ubin
│   │   │   ├── TileTray.tsx        # Baki ubin sumber
│   │   │   ├── AreaGridMat.tsx     # Papan grid penerima drop
│   │   │   ├── EquationInput.tsx   # Form penyederhanaan aljabar
│   │   │   └── FeedbackBanner.tsx  # Tampilan diagnosis kesalahan
│   │   └── report/
│   │       └── MasteryCard.tsx     # Rapor belajar + export PNG
│   ├── data/
│   │   └── levels.ts               # Bank soal terstruktur Level 1-5 + Bonus
│   ├── engine/
│   │   ├── mathValidator.ts        # Validasi grid & ekspansi polinomial
│   │   └── misconceptionDetector.ts# Logika pendeteksi jenis kesalahan siswa
│   ├── store/
│   │   └── useProgressStore.ts     # Zustand store + persist ke localStorage
│   ├── types/
│   │   └── algebra.ts              # Definisi tipe TypeScript
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
~~~

### 6.3 Model Data Inti (TypeScript Interface)
Untuk memastikan logika papan grid akurat dan mudah diuji, berikut rancangan skema datanya:

~~~typescript
export type TileType = 'x2' | 'neg_x2' | 'x' | 'neg_x' | 'one' | 'neg_one';

export type AxisUnit = 'x' | 'neg_x' | 'one' | 'neg_one';

export interface Problem {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  // Representasi (ax + b)(cx + d)
  factor1: { coeffX: number; constant: number };
  factor2: { coeffX: number; constant: number };
  // Kunci jawaban hasil ekspansi Ax^2 + Bx + C
  expectedResult: {
    A: number;
    B: number;
    C: number;
  };
  hints: string[];
  hasZeroPairs: boolean;
}

export interface GridCellState {
  rowIndex: number;
  colIndex: number;
  expectedTile: TileType;
  placedTile: TileType | null;
  isEliminated?: boolean; // Untuk mekanik Zero Pair
}

export interface MisconceptionFeedback {
  code: 'MISSING_MIDDLE_TERM' | 'SIGN_ERROR' | 'WRONG_TILE_SHAPE' | 'SIMPLIFICATION_ERROR' | 'CORRECT';
  message: string;
  highlightCells?: Array<{ row: number; col: number }>;
}
~~~

---

## 7. Strategi Hosting, Deployment & Performa

Karena aplikasi bersifat 100% *client-side* (statis), biaya operasionalnya adalah **Rp0 (Gratis)** dengan kecepatan akses tinggi melalui CDN global.

### 7.1 Alur Deployment Utama (Vercel — Direkomendasikan)
1. Inisialisasi repositori Git dan unggah proyek ke **GitHub**.
2. Hubungkan repositori tersebut ke **Vercel** (*Import Git Repository*).
3. Vercel otomatis menjalankan `npm run build` dan menerbitkan aplikasi di `https://kuadratile.vercel.app`.
4. Setiap pembaruan kode (`git push`) otomatis memicu *preview deployment* sebelum masuk ke produksi.

### 7.2 Alternatif Deployment (GitHub Pages)
Jika wajib menggunakan domain `username.github.io/kuadratile`:
1. Atur `base: '/kuadratile/'` pada `vite.config.ts`.
2. Tambahkan workflow **GitHub Actions** (`.github/workflows/deploy.yml`) untuk mem-build folder `dist` secara otomatis setiap push ke branch `main`.

### 7.3 Optimasi Khusus Sekolah (Koneksi Internet Terbatas)
* **Dukungan PWA (*Progressive Web App*):** Gunakan plugin `vite-plugin-pwa` agar siswa bisa mengakses aplikasi secara **offline** setelah halaman dimuat pertama kali—sangat membantu jika sinyal Wi-Fi sekolah tidak stabil.
* **Ukuran Bundle Ringan:** Hindari aset gambar raster besar (`.png`/`.jpg`); seluruh ubin dan ilustrasi digambar menggunakan **SVG & CSS** agar total ukuran aplikasi kurang dari 500 KB.

---

## 8. Roadmap Pengembangan & Panduan Pengujian

### 8.1 Linimasa Pengembangan (4 Minggu)
* **Minggu 1 — Fondasi & Prototipe Inti (MVP):**
  * Setup proyek Vite + React + TypeScript + Tailwind + `@dnd-kit`.
  * Membangun `TileItem`, `AreaGridMat`, dan `mathValidator` agar soal dasar $(x+a)(x+b)$ bisa dimainkan dengan *drag-and-drop* dan *tap-to-place*.
* **Minggu 2 — Konten Pedagogis & Mesin Diagnosis:**
  * Membangun Fase 1 (*IntroStory*) dan Fase 2 (*AreaSimulator* dengan slider).
  * Mengimplementasikan mekanik ubin negatif, animasi *Zero Pairs*, dan `misconceptionDetector`.
* **Minggu 3 — Kurikulum Lengkap, Gamifikasi & UI Polish:**
  * Memasukkan seluruh bank soal Level 1–5 + Mode Bonus.
  * Menambahkan penyimpanan progres (`localStorage`), lencana, efek suara ringan, dan fitur ekspor rapor PNG.
* **Minggu 4 — Pengujian, Revisi & Rilis:**
  * Uji responsivitas di berbagai ukuran layar HP (Android/iOS) dan desktop.
  * Uji coba ke calon pengguna (siswa/rekan sejawat), perbaikan *bug*, dan *deploy* versi 1.0.

### 8.2 Checklist Pengujian (Jika Digunakan untuk Penelitian / Skripsi)
Jika blueprint ini akan dikembangkan untuk tugas akhir/penelitian R&D (model ADDIE atau 4D), siapkan 3 instrumen evaluasi:
1. **Validasi Ahli Materi:** Mengecek ketepatan konsep matematis, kejelasan representasi ubin negatif, dan ketepatan pesan umpan balik miskonsepsi.
2. **Validasi Ahli Media:** Mengecek konsistensi warna, keterbacaan rumus LaTeX di layar HP, dan kelancaran interaksi *drag-and-drop* sentuh.
3. **Uji Kepraktisan & Efektivitas Siswa:**
   * *Kepraktisan:* Kuesioner SUS (*System Usability Scale*) dari siswa setelah mencoba selama 15–20 menit.
   * *Efektivitas:* *Pre-test* dan *Post-test* singkat berisi 5 soal perkalian kuadrat (khususnya mengecek penurunan kesalahan $(x+a)^2 = x^2+a^2$) untuk mengukur *N-Gain*.