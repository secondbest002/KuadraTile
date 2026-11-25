# Blueprint Pengembangan Media Pembelajaran Digital: KuadraTile (v2.1)

> **Subjudul:** Media Pembelajaran Interaktif Berbasis *Area Model* (Ubin Aljabar) untuk Penguasaan Konsep Perkalian Kuadrat dan Ekspansi Suku Dua.  
> **Versi Dokumen:** 2.1 *(Revisi Kesiapan Prototype Awal — Siap Bangun untuk Presentasi)*  
> **Dokumen Referensi:** [audit_v1.md](file:///f:/Personal/KuadraTile/.gemini/blueprint/audit_v1.md)  
> **Platform Target:** Web App Responsif (Mobile & Desktop) — *Client-Side Only* (Tanpa Server/Database).

---

## Ringkasan Pembaruan v2.1 (Fokus Prototype Awal & Perbaikan Celah Teknis)

Revisi v2.1 memangkas lingkup v2.0 agar **realistis dibangun tuntas dalam 1 sesi implementasi untuk presentasi besok**, sekaligus menutup 4 celah arsitektur yang ditemukan saat inspeksi v2.0:

1. **Pemisahan Tegas V0.1 (*Prototype Awal*) vs. V1.0 (*Produk Penuh & R&D*):**
   * **V0.1 (Bangun Sekarang):** Kamus Ubin & Jembatan Konsep (`CheatSheetModal`), Lab Eksplorasi Slider (`AreaSimulator`), Arena Latihan Interaktif Level 1–4 (`PracticeArena` dengan akses level bebas untuk demo), dan Ringkasan Sesi (`SessionSummary`).
   * **V1.0 (Tahap Lanjutan):** Level 5 non-monik, Mode Faktorisasi (*Mode Detektif*), Fase 1 *Story Slides*, Fase 4 Kuis Evaluasi Abstrak, Mode Guru, Ekspor PNG/CSV, Web Audio SFX, KaTeX, dan PWA.
2. **Solusi Target Sentuh Mobile (`u >= 24px`):** Pada V0.1, soal dibatasi pada bentuk monik $(x + a)(x + b)$ dengan $a, b \in \{-3, -2, -1, 1, 2, 3\}$. Dengan batas ini, ukuran minimum ubin satuan di layar HP `340px` terjaga pada **`24px–28px`** (memenuhi standar target sentuh WCAG 2.2 AA dan bebas *horizontal scroll*).
3. **State Machine Workspace & Interaksi Sel Lengkap:** Penambahan tahapan eksplisit `WorkspaceStage` (`building` $\rightarrow$ `zero_pairs` $\rightarrow$ `equation` $\rightarrow$ `completed`), mekanik **tap untuk hapus / drop untuk timpa satu sel**, serta aturan validasi lengkap `UNLIKE_TERMS_COMBINED` (menangkap baik $3x^3$ **maupun** $3x^2$ dan $5x$).
4. **Restorasi Aturan Bintang & Spesifikasi Lab Eksplorasi:** Penetapan ulang kriteria 1–3 bintang yang sempat hilang dari v2.0, 3 Misi Penemuan konkret di Lab, serta penghindaran nilai nol ($a, b \neq 0$) agar grid 4 kuadran selalu konsisten.
5. **Stack Ultra-Ringan Tanpa Risiko Build:** Mengganti KaTeX, Framer Motion, `html-to-image`, dan `vite-plugin-pwa` pada V0.1 dengan komponen `<MathExpr />` HTML/CSS semantik dan transisi CSS native agar bebas bug font, cache service worker, dan konflik *drag overlay* saat demo.

---

## 1. Identitas & Ruang Lingkup Prototype Awal (V0.1)

* **Nama Produk:** **KuadraTile** — *"Lihat Luasnya, Pahami Aljabarnya."*
* **Target Demo:** Siswa SMP/SMA (presentasi alur pembelajaran *Concrete–Pictorial–Abstract*) dan guru/dosen penguji (demonstrasi proyektor desktop + uji sentuh mobile).
* **Cakupan Materi V0.1:**
  * Perkalian suku dua monik positif: $(x + a)(x + b)$
  * Kuadrat jumlah: $(x + a)^2 = x^2 + 2ax + a^2$
  * Kuadrat selisih: $(x - a)^2 = x^2 - 2ax + a^2$
  * Selisih dua kuadrat & *Zero Pairs*: $(x + a)(x - b)$ dan $(x + a)(x - a) = x^2 - a^2$
  * *(Catatan: Generalisasi dua variabel $(a \pm b)^2$, koefisien non-monik $(ax+b)(cx+d)$, dan faktorisasi diposisikan pada Tahap V1.0 di Bagian 8).*

### 1.1 Masalah Pedagogis & Kode Deteksi di V0.1

| No. | Miskonsepsi Klasik | Contoh Kesalahan Siswa | Mekanisme Deteksi di KuadraTile V0.1 |
| :--- | :--- | :--- | :--- |
| **1** | **Freshman's Dream** | $(x + 3)^2 = x^2 + 9$ *(lupa suku tengah $6x$)* | Papan grid menyisakan dua area $x$ kosong di kanan dan bawah $x^2$; engine mengembalikan `MISSING_MIDDLE_TERM` + menyorot sel kosong tersebut. |
| **2** | **Kesalahan Tanda Negatif** | $(x - 2)(x - 3) = x^2 - 5x - 6$ atau lupa eliminasi $+x$ & $-x$ | Ubin negatif bertekstur arsir + sumbu perkalian; engine mendeteksi `SIGN_ERROR` (saat isi papan salah tanda) dan `UNELIMINATED_ZERO_PAIRS` (jika belum disederhanakan). |
| **3** | **Salah Penjumlahan Pangkat / Suku Tak Sejenis** | $x^2 + 2x = 3x^3$ atau $3x^2$, atau $2x + 3 = 5x$ | Secara visual ubin persegi $x^2$ berbeda dimensi dari batang $x$. Pada `TermBuilderInput`, siswa bebas memilih pangkat `x³ | x² | x | 1` sehingga `3x^3`, `3x^2`, maupun `5x` tertangkap sebagai `UNLIKE_TERMS_COMBINED`. |

---

## 2. Alur Penggunaan & Demonstrasi (Presentasi Besok)

Aplikasi menggunakan **navigasi datar tanpa penguncian level** pada V0.1 agar presenter dapat berpindah bebas antar fitur selama demo:

~~~text
[1. Lab Eksplorasi]  <--->  [2. Arena Latihan (Lv 1–4)]  <--->  [3. Ringkasan Sesi]
   (Slider + 3 Misi)          (Drag/Tap + Zero Pairs +            (Skor Bintang + Profil
                               Diagnosis Miskonsepsi)               Miskonsepsi Terdeteksi)
         ^                                ^
         +---- [Tombol "?" Kamus Ubin & Jembatan Negatif] ----+
~~~

### Rincian Fitur Setiap Tampilan V0.1:

1. **Kamus Ubin & Jembatan Didaktik (`CheatSheetModal.tsx` — Tombol `?` di Navbar):**
   * Ringkasan visual dimensi 3 bentuk ubin ($x^2$, $x$, $1$).
   * **Jembatan Didaktik:** Penjelasan singkat transisi dari *"luas kebun fisik positif"* ke *"tabel perkalian ubin aljabar bertanda"* (mengapa ubin merah berarsir mewakili nilai negatif dan $- \times - = +$).
   * Contoh animasi mikro aturan *Zero Pairs* ($+x + (-x) = 0$).
2. **Mode 1 — Lab Eksplorasi (`AreaSimulator.tsx`):**
   * Slider / tombol langkah untuk memilih $a, b \in \{-3, -2, -1, 1, 2, 3\}$ (nilai `0` dilewati agar papan selalu terbagi rapi menjadi 4 kuadran).
   * Menggunakan ulang komponen `AreaGridMat` dalam mode *read-only* (terisi otomatis secara *real-time*).
   * **Split View Toggle:** Memberi jarak antar 4 kuadran ($x^2$, $ax$, $bx$, $ab$) agar struktur luas terlihat jelas.
   * **Color-Link Hover/Tap:** Mengarahkan kursor/mengetuk suku pada ekspansi rumus di bawah papan menyorot kelompok ubin terkait di papan (dan sebaliknya).
   * **3 Kartu Misi Penemuan:**
     1. *Kuadrat Sempurna ($a=2, b=2$):* Menemukan dua blok kembar $+2x$ sehingga $(x+2)^2 = x^2 + 4x + 4 \neq x^2 + 4$.
     2. *Negatif $\times$ Negatif ($a=-2, b=-2$):* Mengamati mengapa pojok kanan bawah menjadi $+4$ (positif).
     3. *Penemuan Selisih Kuadrat ($a=3, b=-3$):* Melihat $+3x$ dan $-3x$ berpasangan saling meniadakan menyisakan $x^2 - 9$.
3. **Mode 2 — Arena Latihan Berjenjang (`PracticeArena.tsx`):**
   * **Selector Level Bebas (Demo-Friendly):** Presenter atau siswa dapat memilih langsung **Level 1–4** dan melompat ke nomor soal mana saja (`1/3`, `2/3`, `3/3`).
   * **Alur 3 Tahap Terkunci (*State Machine* `WorkspaceStage`):**
     * **Tahap `building` (Susun Papan):** Siswa menyusun ubin ke grid tengah.
       * Mendukung **Drag-and-Drop** (`@dnd-kit/core`) dan **Tap-to-Select $\rightarrow$ Tap-to-Place**.
       * **Orientasi Otomatis:** Batang $+x$ dan $-x$ otomatis berbentuk horizontal (`3.43u × u`) atau vertikal (`u × 3.43u`) sesuai sel tujuan.
       * **Edit Satu Sel:** Menjatuhkan/mengetuk ubin baru pada sel terisi akan **menimpa** ubin lama; mengetuk sel terisi (saat tidak memilih ubin di baki) akan **menghapus** ubin di sel tersebut tanpa perlu menekan `Reset`.
       * Menekan **`Cek Papan`** memvalidasi grid; jika benar, lanjut ke `zero_pairs` (jika soal memiliki pasangan berlawanan) atau langsung ke `equation`.
     * **Tahap `zero_pairs` (Eliminasi Pasangan Nol — khusus soal berpasangan):**
       * Siswa mengetuk ubin $+x$ lalu mengetuk ubin $-x$ (atau $+1$ dengan $-1$).
       * Pasangan diberi `pairId` unik dan menghilang halus (*fade/glow*).
       * Tersedia tombol **`Undo Pasangan`** untuk membatalkan pasangan terakhir.
       * Jika mengetuk dua ubin yang tidak berlawanan atau berbeda ukuran, muncul pesan panduan singkat.
       * Otomatis terbuka ke tahap `equation` saat seluruh pasangan nol habis (`countRemainingZeroPairs === 0`).
     * **Tahap `equation` (Susun Persamaan Akhir):**
       * Siswa menyusun hasil akhir lewat `TermBuilderInput` (`+ [koefisien] [x³ | x² | x | konstanta]`).
       * Menekan **`Cek Jawaban`** memvalidasi kesetaraan aljabar sekaligus mendeteksi kesalahan penggabungan suku tak sejenis (`3x^3`, `3x^2`, `5x`) atau suku belum disederhanakan (`UNSIMPLIFIED_LIKE_TERMS`).
     * **Tahap `completed`:** Menampilkan bintang yang diraih (`1–3 ★`) dan tombol `Soal Berikutnya`.
4. **Mode 3 — Ringkasan Sesi (`SessionSummary.tsx`):**
   * Menampilkan total bintang, progres soal tuntas per level, serta **Log Miskonsepsi Sesi** (berapa kali siswa/penguji memicu `MISSING_MIDDLE_TERM`, `SIGN_ERROR`, `UNLIKE_TERMS_COMBINED`, dll.) plus tombol **`Reset Progres Demo`**.

---

## 3. Struktur Kurikulum & Bank Soal V0.1 (12 Soal Terkurasi)

| Level | Nama Misi | Daftar Soal (3 Soal/Level) | Fokus Konsep & Demo | Scaffolding |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | *Fondasi Positif* | 1. $(x+1)(x+2)$<br>2. $(x+2)(x+3)$<br>3. $(x+1)(x+3)$ | Pemetaan panjang sisi ke area $x^2$, $x$, $1$ dan penjumlahan suku sejenis. | Garis bantu kuadran aktif penuh + label dimensi sumbu. |
| **Level 2** | *Identitas Kuadrat* | 1. $(x+2)^2$<br>2. $(x+3)^2$<br>3. $(x+1)^2$ | Membongkar *Freshman's Dream* ($(x+a)^2 \neq x^2+a^2$) lewat dua batang $x$ kembar. | Sorotan khusus `MISSING_MIDDLE_TERM` bila sisi tengah dibiarkan kosong. |
| **Level 3** | *Tantangan Negatif* | 1. $(x-2)^2$<br>2. $(x-1)(x-3)$<br>3. $(x-2)(x-3)$ | Perkalian tanda negatif ($- \times - = +$, $+ \times - = -$) menggunakan ubin merah berarsir. | Garis bantu kuadran aktif; diagnosis `SIGN_ERROR` menyorot sumbu pengali. |
| **Level 4** | *Pasangan Nol* | 1. $(x+2)(x-1)$<br>2. $(x+3)(x-2)$<br>3. $(x+3)(x-3)$ | Eliminasi *Zero Pairs* ($+x$ & $-x$) hingga penemuan selisih kuadrat $x^2 - 9$. | Tahap `zero_pairs` aktif wajib sebelum masuk `TermBuilderInput`. |

### Aturan Penilaian Bintang (Per Soal)
* **3 Bintang ($\star\star\star$):** Selesai tanpa menggunakan `Hint` dan maksimal **1 kali** salah cek (`attempts <= 2`).
* **2 Bintang ($\star\star$):** Selesai dengan `1 Hint` atau **2–3 kali** salah cek.
* **1 Bintang ($\star$):** Selesai setelah lebih dari 3 kali salah cek atau menggunakan $\ge 2$ `Hint`.

---

## 4. Desain UI/UX & Panduan Visual (*Design System*)

### 4.1 Skema Warna Kognitif & Aksesibilitas Buta Warna (*Deuteranopia-Safe*)
Setiap jenis ubin dibedakan lewat **3 kanal sekaligus**: **Warna + Pola Tekstur SVG + Label Teks Eksplisit**:

* **Ubin Positif (Garis Tepi Solid, Tanpa Arsiran):**
  * `$+x^2$`: **Biru Indigo** (`#2563EB`), teks putih tebal `+x²`.
  * `$+x$`: **Teal Zamrud** (`#0D9488` — kontras terhadap merah bagi *deuteranopia*), teks putih tebal `+x`.
  * `$+1$`: **Amber Gelap** (`#D97706`), teks putih kontras tinggi `+1`.
* **Ubin Negatif (Garis Tepi Putus-putus/Ganda, Pola Tekstur SVG Khas):**
  * `$-x^2$`: **Merah Koral** (`#DC2626`) + **arsiran diagonal $45^\circ$** + garis tepi putus-putus, label `−x²`.
  * `$-x$`: **Rose Crimson** (`#E11D48`) + **pola garis sejajar** + garis tepi putus-putus, label `−x`.
  * `$-1$`: **Terakota** (`#EA580C`) + **pola titik (*polka-dot*)** + garis tepi ganda, label `−1`.
* **Latar & Kontras:** Kanvas slate terang (`#F8FAFC`) dengan pola titik halus; teks utama slate gelap (`#0F172A`, rasio WCAG AAA $\ge 7:1$).

### 4.2 Prinsip Proporsi Geometri & Skala Dinamis (`ResizeObserver`)
1. **Rasio Non-Komensurabel:** Panjang sisi $x$ selalu $3.43 \times$ sisi $1$ ($L_x / L_1 = 3.43$) agar siswa tidak mengira $x$ bernilai bilangan bulat tertentu.
2. **Formula Anti-Overflow Mobile dengan Batas Sentuh Aman (`u >= 24px`):**
   * Karena seluruh soal V0.1 berbentuk $(x + a)(x + b)$ dengan $N_x = 1$ dan $N_1 \le 3$, lebar total papan dalam unit $u$ maksimal adalah $3.43(1 + 1) + 3 = 9.86u$.
   * `responsiveScale.ts` menghitung unit dasar $u = L_1$:
     $$u = \text{clamp}\!\left(24\text{px},\; \frac{W_{\text{avail}} - W_{\text{padding}}}{3.43 \cdot (N_x + 1) + N_1},\; 28\text{px}\right)$$
   * **Verifikasi Ukuran Layar:**
     * **Desktop ($W_{\text{avail}} \ge 400\text{px}$):** $u = 28\text{px}$, $L_x = 96\text{px}$ (ukuran optimal).
     * **Mobile Kecil ($W_{\text{avail}} = 340\text{px}$, soal terlebar $(x+3)(x+3)$):** $u \approx 28\text{px}$ (atau minimal `24px` pada layar sangat sempit), total lebar papan $\le 308\text{px}$ — **muat 100% tanpa scroll horizontal** dan tetap memenuhi ukuran target sentuh minimum `24px × 24px`.

### 4.3 Wireframe Tata Letak V0.1

**Tampilan Desktop (Landscape):**
~~~text
+-------------------------------------------------------------------------------+
| [KuadraTile]   (1) Lab Eksplorasi   (2) [Arena Latihan]   (3) Ringkasan  [?]  |
+-------------------------------------------------------------------------------+
|  Level: [Lv.1] [Lv.2] [Lv.3] [Lv.4 v] | Soal 1/3: (x + 2)(x - 1) [Reset] [💡] |
+---------------------------------------+---------------------------------------+
|          PAPAN PERKALIAN              |          BAKI UBIN & LANGKAH          |
|       Tahap 1/3: Susun Ubin           |                                       |
|                                       |  Pilih / Seret Ubin:                  |
|         [   x   ] [+1] [+1]           |  [ +x² ] [ +x ] [ +1 ]                |
|   +---+-----------+----+----+         |  [ -x² ] [ -x ] [ -1 ]                |
|   | x |  (sel)    |    |    |         |  *(Klik sel papan utk hapus/timpa)*   |
|   +---+-----------+----+----+         |                                       |
|   |-1 |           |    |    |         |  -----------------------------------  |
|   +---+-----------+----+----+         |  [ Cek Papan ]                        |
|                                       |  (Tahap 2: Eliminasi Zero Pairs)      |
|                                       |  (Tahap 3: Susun Persamaan Akhir)     |
+---------------------------------------+---------------------------------------+
|  💬 Diagnosis: "Ketuk 'Cek Papan' setelah seluruh sel perkalian terisi."      |
+-------------------------------------------------------------------------------+
~~~

**Tampilan Mobile (Portrait — Thumb-Friendly & Zero Horizontal Scroll):**
~~~text
+-----------------------------------+
| [KuadraTile] [Lab] [Latih*] [Ring]|
+-----------------------------------+
| [Lv 4 v] (x+2)(x-1)  [?][Reset][💡]|
+-----------------------------------+
|         PAPAN PERKALIAN           |
|        [   x   ] [+1][+1]         |
|    +---+---------+---+---+        |
|    | x |   +x²   | +x| +x|        |
|    +---+---------+---+---+        |
|    |-1 |   -x    | -1| -1|        |
|    +---+---------+---+---+        |
+-----------------------------------+
| 💬 Diagnosis singkat & sorotan sel|
+-----------------------------------+
| [+x²][+x][+1]  [-x²][-x][-1]      | <-- Baki Ubin (Tap / Drag)
| [ Cek Papan ] / [ Susun Hasil ]   |
+-----------------------------------+
~~~

---

## 5. Arsitektur Teknis & Tech Stack (V0.1 Siap Bangun)

### 5.1 Tech Stack Ringkas
| Lapisan | Teknologi | Alasan untuk Prototype Besok |
| :--- | :--- | :--- |
| **Framework** | **React 18+ & TypeScript** | Komponen modular dengan *type-safety* ketat untuk logika grid dan validator aljabar. |
| **Build Tool** | **Vite** | Setup instan, HMR cepat, hasil build statis siap *deploy* ke Vercel. |
| **Styling** | **Tailwind CSS** | Utilitas layout responsif cepat + transisi CSS native (tanpa overhead Framer Motion). |
| **Drag & Drop** | **`@dnd-kit/core`** | Dukungan `PointerSensor`, `TouchSensor`, dan `KeyboardSensor` yang stabil bersama *tap-to-place*. |
| **Render Aljabar** | **`<MathExpr />` (HTML/CSS Semantik)** | Render cepat polinomial (`<var>x</var><sup>2</sup>`) dengan **0 KB dependensi** dan bebas isu font saat demo. |
| **State & Storage** | **Zustand + `localStorage`** | Menyimpan bintang, status soal, dan riwayat miskonsepsi selama sesi presentasi. |

### 5.2 Struktur Direktori Proyek V0.1
~~~text
kuadratile/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── MathExpr.tsx          # Formatter ekspresi aljabar HTML/CSS ringan
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Navigasi 3 mode + tombol Kamus Ubin (?)
│   │   │   └── CheatSheetModal.tsx   # Kamus ubin, jembatan negatif & demo zero pairs
│   │   ├── sandbox/
│   │   │   └── AreaSimulator.tsx     # Lab Eksplorasi slider a,b + Split View + 3 Misi
│   │   ├── workspace/
│   │   │   ├── PracticeArena.tsx     # Pengelola Level 1-4 & state machine 3 tahap
│   │   │   ├── TileItem.tsx          # Render SVG ubin (auto-orientasi + tekstur buta warna)
│   │   │   ├── TileTray.tsx          # Baki 6 ubin (drag-and-drop & tap-to-select)
│   │   │   ├── AreaGridMat.tsx       # Papan grid dinamis (ResizeObserver + hapus/timpa sel)
│   │   │   ├── TermBuilderInput.tsx  # Input suku fleksibel (deteksi 3x^3, 3x^2, & unsimplified)
│   │   │   └── FeedbackBanner.tsx    # Banner diagnosis miskonsepsi + tombol aksi cepat
│   │   └── report/
│   │       └── SessionSummary.tsx    # Ringkasan bintang & profil miskonsepsi sesi
│   ├── data/
│   │   └── levels.ts                 # 12 soal Level 1-4 + 3 Misi Penemuan Lab
│   ├── engine/
│   │   ├── gridBuilder.ts            # Generator sumbu atas/kiri & GridCellState awal
│   │   ├── mathValidator.ts          # Validasi grid, zero pairs (pairId), & persamaan akhir
│   │   └── misconceptionDetector.ts  # Mesin klasifikasi 9 kode miskonsepsi
│   ├── store/
│   │   └── useProgressStore.ts       # Zustand store + localStorage + reset demo
│   ├── types/
│   │   └── algebra.ts                # Definisi tipe TypeScript v2.1
│   ├── utils/
│   │   └── responsiveScale.ts        # Kalkulator u = clamp(24px, ..., 28px) rasio 3.43:1
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
~~~

### 5.3 Model Data Inti (`src/types/algebra.ts`)

~~~typescript
export type TileType = 'x2' | 'neg_x2' | 'x' | 'neg_x' | 'one' | 'neg_one';

export type TileOrientation = 'square' | 'horizontal' | 'vertical';

export type AxisUnit = 'x' | 'neg_x' | 'one' | 'neg_one';

export type NonZeroConstant = -3 | -2 | -1 | 1 | 2 | 3;

export interface LinearFactor {
  coeffX: 1;
  constant: NonZeroConstant;
}

export interface PolynomialCoefficients {
  A: number; // Koefisien x^2
  B: number; // Koefisien x
  C: number; // Konstanta
}

export interface ExpansionProblem {
  id: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  factor1: LinearFactor; // Sumbu atas (kolom)
  factor2: LinearFactor; // Sumbu kiri (baris)
  expectedResult: PolynomialCoefficients;
  hasZeroPairs: boolean;
  showQuadrantGuides: boolean;
  hints: string[];
}

export type WorkspaceStage = 'building' | 'zero_pairs' | 'equation' | 'completed';

export interface GridCellState {
  rowIndex: number;
  colIndex: number;
  expectedTile: TileType;
  placedTile: TileType | null;
  orientation: TileOrientation; // Otomatis dihitung dari unit sumbu baris & kolom
  pairId?: string;              // Terisi saat pasangan dieliminasi pada tahap 'zero_pairs'
}

/** Suku pada Term-Builder Input untuk menangkap error pangkat (3x^3) & penggabungan (3x^2) */
export interface AlgebraicTermInput {
  id: string;
  coefficient: number;
  degree: 0 | 1 | 2 | 3;
}

export type MisconceptionCode =
  | 'CORRECT'
  | 'INCOMPLETE_BOARD'         // Ada sel kosong (selain pola lupa suku tengah)
  | 'MISSING_MIDDLE_TERM'      // Mengisi x^2 & konstanta pada (x+a)^2 tetapi melupakan sel x
  | 'SIGN_ERROR'               // Bentuk ubin benar/koefisien benar, tetapi tanda (+/-) keliru
  | 'WRONG_TILE_SHAPE'         // Dimensi ubin tidak sesuai perkalian panjang sisi baris x kolom
  | 'UNELIMINATED_ZERO_PAIRS'  // Masih ada pasangan +x/-x atau +1/-1 yang belum dieliminasi
  | 'UNSIMPLIFIED_LIKE_TERMS'  // Masih ada lebih dari satu suku berderajat sama di TermBuilderInput
  | 'UNLIKE_TERMS_COMBINED'    // Menggabungkan suku tak sejenis (3x^3, atau x^2+2x -> 3x^2, atau 2x+3 -> 5x)
  | 'SIMPLIFICATION_ERROR';    // Papan benar, perhitungan koefisien akhir keliru

export interface MisconceptionFeedback {
  code: MisconceptionCode;
  message: string;
  highlightCells?: Array<{ row: number; col: number }>;
  highlightAxes?: { top?: number[]; left?: number[] };
}

export interface DiscoveryMission {
  id: string;
  title: string;
  prompt: string;
  targetA: NonZeroConstant;
  targetB: NonZeroConstant;
  insight: string;
}

export interface ProblemProgress {
  problemId: string;
  level: 1 | 2 | 3 | 4;
  stars: 1 | 2 | 3;
  attempts: number;
  hintsUsed: number;
  completedAt: string;
}

export interface DiagnosticLog {
  timestamp: string;
  problemId: string;
  level: 1 | 2 | 3 | 4;
  code: MisconceptionCode;
}
~~~

### 5.4 Spesifikasi Logika Validasi Inti V0.1

1. **Pembangkitan Grid & Orientasi Otomatis (`gridBuilder.ts`):**
   * Sumbu atas (`topAxis`) dibangun dari `[ 'x', ...( |constant1| kali 'one' atau 'neg_one' ) ]`.
   * Sumbu kiri (`leftAxis`) dibangun dari `[ 'x', ...( |constant2| kali 'one' atau 'neg_one' ) ]`.
   * Untuk setiap sel `(rowIndex, colIndex)` dengan `rowUnit = leftAxis[rowIndex]` dan `colUnit = topAxis[colIndex]`:
     * `expectedTile` ditentukan oleh perkalian derajat (`x*x -> x2`, `x*1 -> x`, `1*1 -> one`) dan tanda (`+ * + = +`, `+ * - = -`, `- * - = +`).
     * `orientation`:
       * `'square'` jika `rowUnit` dan `colUnit` berderajat sama.
       * `'horizontal'` jika `colUnit` adalah `x`/`neg_x` dan `rowUnit` adalah `one`/`neg_one`.
       * `'vertical'` jika `colUnit` adalah `one`/`neg_one` dan `rowUnit` adalah `x`/`neg_x`.
2. **Validasi Papan Perkalian (`validateGrid`):**
   * **Prioritas 1 (`MISSING_MIDDLE_TERM`):** Jika semua sel `x^2` dan sel konstanta (`1`/`-1`) sudah terisi, tetapi **seluruh** sel batang `x` masih `null`, kembalikan `MISSING_MIDDLE_TERM` dan sorot sel batang `x` yang kosong.
   * **Prioritas 2 (`INCOMPLETE_BOARD`):** Jika masih ada sel bernilai `null` lainnya, sorot sel kosong dan kembalikan `INCOMPLETE_BOARD`.
   * **Prioritas 3 (`WRONG_TILE_SHAPE`):** Jika ada sel dengan `degree(placedTile) !== degree(expectedTile)` (misal menaruh `one` di sel `x`), sorot sel tersebut dan jelaskan dimensi baris $\times$ kolom.
   * **Prioritas 4 (`SIGN_ERROR`):** Jika semua bentuk benar tetapi ada tanda berlawanan, sorot sel bermasalah beserta `highlightAxes: { top: [col], left: [row] }`.
   * **Lulus Tahap `building`:** Seluruh sel cocok (`placedTile === expectedTile`).
3. **Validasi *Zero Pairs* (`zero_pairs`):**
   * Dua sel `(r1, c1)` dan `(r2, c2)` boleh dipasangkan bila belum punya `pairId`, berderajat sama (`x`/`neg_x` atau `one`/`neg_one`), dan bertanda berlawanan.
   * `countRemainingZeroPairs(grid)` menghitung `min(count(+x), count(-x)) + min(count(+1), count(-1))` pada sel yang belum memiliki `pairId`. Tahap `equation` terbuka saat fungsi mengembalikan `0`.
4. **Validasi Persamaan Akhir (`validateEquation`):**
   * **Cek 1 (`UNELIMINATED_ZERO_PAIRS`):** Pastikan `countRemainingZeroPairs(grid) === 0`.
   * **Cek 2 (`UNLIKE_TERMS_COMBINED`):**
     * Ada suku aktif (`coefficient !== 0`) dengan `degree === 3` (contoh $3x^3$), **ATAU**
     * Terdeteksi penggabungan $x^2$ dengan $x$: `inputA === A + B && inputB === 0 && B !== 0` (contoh $x^2 + 2x \rightarrow 3x^2$), **ATAU**
     * Terdeteksi penggabungan $x$ dengan konstanta: `inputB === B + C && inputC === 0 && C !== 0` (contoh $2x + 3 \rightarrow 5x$).
   * **Cek 3 (`UNSIMPLIFIED_LIKE_TERMS`):** Terdapat $\ge 2$ baris `AlgebraicTermInput` dengan `degree` yang sama (misal `+2x` dan `-1x` belum digabungkan).
   * **Cek 4 (`SIGN_ERROR`):** Nilai absolut `|inputA|===|A|, |inputB|===|B|, |inputC|===|C|` benar, tetapi minimal satu tanda berbeda.
   * **Cek 5 (`SIMPLIFICATION_ERROR`):** Koefisien tidak cocok dengan `expectedResult`.

---

## 6. Rencana Implementasi Kilat (Prototype Siap Presentasi Besok)

Eksekusi dibagi dalam 4 tahap berurutan agar selalu dalam kondisi bisa diuji setiap selesai satu tahap:

1. **Tahap 1 — Fondasi Proyek & Mesin Aljabar:** Inisialisasi Vite + React + TypeScript + Tailwind + `@dnd-kit/core` + Zustand; implementasi `types/algebra.ts`, `levels.ts`, `gridBuilder.ts`, `mathValidator.ts`, `misconceptionDetector.ts`, dan `responsiveScale.ts`.
2. **Tahap 2 — Komponen Visual Ubin & Workspace Latihan:** Bangun `MathExpr.tsx`, `TileItem.tsx` (pola SVG ramah buta warna), `TileTray.tsx`, `AreaGridMat.tsx` (drag-and-drop + tap-to-place + hapus/timpa sel + eliminasi *zero pairs*), `TermBuilderInput.tsx`, dan `FeedbackBanner.tsx`.
3. **Tahap 3 — Lab Eksplorasi, Kamus Ubin & Ringkasan Sesi:** Bangun `AreaSimulator.tsx` (slider + Split View + Color-Link + 3 Misi), `CheatSheetModal.tsx`, `SessionSummary.tsx`, dan `Navbar.tsx`.
4. **Tahap 4 — Verifikasi Build, Responsive & Uji Skenario Demo:** Jalankan `npm run build` bebas error, uji di viewport desktop dan mobile (`360px`) untuk memastikan tidak ada *horizontal overflow*, dan validasi 3 skenario miskonsepsi untuk demo presentasi.

---

## 7. Deployment Cepat untuk Demo (Opsional Sebelum Presentasi)

* Dapat dijalankan lokal via `npm run dev` atau langsung di-deploy statis gratis ke **Vercel** (`npm run build` $\rightarrow$ `dist`) agar bisa dibuka dari HP peserta/penguji lewat tautan publik saat presentasi.

---

## 8. Tahap 2: Roadmap Lanjutan Pasca-Prototype (V1.0 & Skripsi R&D)

Fitur-fitur berikut **sengaja dipisahkan dari V0.1** agar prototipe besok stabil, dan disiapkan untuk iterasi pasca-presentasi:

1. **Level 5 Non-Monik $(ax+b)(cx+d)$:** Memerlukan opsi *zoom/pan* atau pengisian blok massal di HP agar target sentuh tidak menyusut di bawah `24px`.
2. **Mode Faktorisasi (*Mode Detektif*) dengan Alur *Axis-First*:**
   * Siswa menyusun faktor dugaan pada sumbu atas & kiri terlebih dahulu (`isAxisEditable: true`) sehingga dimensi grid $R \times C$ terbentuk dinamis dan orientasi batang `x` tetap deterministik.
   * Mendukung penambahan *zero pairs* dari baki untuk pemfaktoran bentuk seperti $x^2 - 1$ atau $x^2 + x - 2$, serta validasi invarian-transposisi $P_{\text{top}}(x) \cdot P_{\text{left}}(x) \equiv P_{\text{target}}(x)$.
3. **Fase 1 Penuh (`IntroStory` + `ZeroPairDemo`), Galeri Identitas $(a \pm b)^2$, & Fase 4 (`MasteryQuiz` + `AbstractQuestionCard`):**
   * Menambahkan tipe `AbstractQuestion` dengan opsi pengecoh yang dipetakan ke `MisconceptionCode`.
4. **Mode Guru, Telemetri R&D, & Optimasi Offline:**
   * `TeacherModeModal` + `CustomProblemBuilder`, ekspor **Kartu Rapor PNG** via HTML5 `<canvas>` 2D (lebih stabil daripada `html-to-image` di Safari/WebView), ekspor **Log CSV/JSON** untuk analisis *N-Gain*, efek suara **Web Audio API**, dukungan KaTeX (`woff2` only bila materi meluas ke pecahan/akar), dan `vite-plugin-pwa`.
