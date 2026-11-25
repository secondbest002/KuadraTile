# Hasil Audit Blueprint: KuadraTile (v1.0)

> **Dokumen yang Diaudit:** `blueprint_media_pembelajaran_kuadratile.md`  
> **Tanggal Audit:** 25 November 2026  
> **Status:** Ditemukan 11 celah kritis/menengah pada aspek pedagogi matematis, skema data TypeScript, skala responsif mobile, dan kelengkapan fitur.

---

## Ringkasan Eksekutif

Secara konsep pedagogis (*Concrete–Pictorial–Abstract* + *Smart Misconception Engine*) dan pemilihan *tech stack* (`React + TypeScript + Vite + Tailwind + @dnd-kit + KaTeX`), blueprint sudah memiliki fondasi yang kuat. Namun, terdapat **ketidaksinkronan antara janji fitur pedagogis (Bagian 1–4) dengan rancangan teknis/data (Bagian 5–7)** yang berpotensi menimbulkan *bug* arsitektural saat mulai masuk tahap *coding*.

---

## 1. Celah Pedagogis & Konsep Matematis (Kritis)

### 1.1 Lompatan Didaktik: Luas Geometris vs. Ubin Bertanda Negatif (Bagian 2 vs. Bagian 4)
* **Temuan:** Fase 1 memperkenalkan ubin melalui konteks *luas kebun nyata* ($x \times x$ diperluas $a$ dan $b$ meter). Namun pada Fase 2 (`a = 3, b = -3`) dan Level 3–4, sistem langsung memakai ubin negatif ($-x^2, -x, -1$) tanpa transisi konseptual mengenai makna panjang/luas negatif.
* **Dampak:** Siswa SMP sering bingung mengapa "luas kebun" bisa bernilai negatif, padahal luas secara geometri Euklides selalu non-negatif.
* **Rekomendasi Perbaikan:** Tambahkan **jembatan transisi eksplisit** di akhir Fase 1 / awal Level 3 bahwa papan perkalian bertransisi dari *"model luas kebun fisik"* menjadi *"tabel perkalian ubin aljabar bertanda"* (atau visualisasikan pengurangan luas sebagai daerah yang dipotong/diarsir keluar).

### 1.2 Ketidakcocokan Notasi Variabel $(a+b)^2$ vs. Skema $(ax+b)(cx+d)$ (Bagian 1.2 vs. 6.3)
* **Temuan:** Bagian 1.2 mencantumkan materi identitas umum dua variabel $(a+b)^2$, $(a-b)^2$, dan $(a+b)(a-b)$. Namun seluruh `TileType` (`x2`, `x`, `one`) dan interface `Problem` di Bagian 6.3 hanya mendukung **satu variabel $x$** berbentuk $(ax+b)(cx+d) = Ax^2 + Bx + C$.
* **Dampak:** Identitas $(a+b)^2$ dua variabel tidak dapat dirender oleh `AreaGridMat` maupun divalidasi oleh `mathValidator.ts`.
* **Rekomendasi Perbaikan:** Tegaskan sejak Bagian 1.2 bahwa visualisasi ubin difokuskan pada bentuk variabel tunggal $(x+a)^2$, $(x-a)^2$, dan $(x+a)(x-a)$, sementara generalisasi simbolik ke $(a+b)^2$ ditampilkan sebagai jembatan abstraksi di Galeri Identitas Khusus.

### 1.3 Miskonsepsi #3 Tidak Bisa Didiagnosis oleh UI (Bagian 1.3 vs. 3.3 & 6.3)
* **Temuan:** Bagian 1.3 menargetkan 3 miskonsepsi utama, termasuk **#3: Salah Penjumlahan Pangkat** ($x^2 + 2x = 3x^3$ atau $3x^2$). Akan tetapi:
  1. `EquationInput` memakai format kotak terkunci `[_]x^2 + [_]x + [_]`, sehingga siswa **mustahil** menginput $3x^3$.
  2. `MisconceptionFeedback['code']` di Bagian 6.3 tidak memiliki kode error untuk penggabungan suku tidak sejenis (misal `UNLIKE_TERMS_COMBINED`).
* **Rekomendasi Perbaikan:** Sediakan opsi input suku/pangkat pada tahap penyederhanaan (atau pilihan pengecoh diagnostik pada Fase 4) dan tambahkan kode `UNLIKE_TERMS_COMBINED` pada `MisconceptionFeedback`.

---

## 2. Celah Arsitektur Data & Mesin Logika (Kritis)

### 2.1 Mode Bonus (Faktorisasi) Tidak Didukung Interface `Problem` & `GridCellState` (Bagian 4 vs. 6.3)
* **Temuan:** Level Bonus (*Mode Detektif*) meminta siswa menyusun ubin $x^2 + bx + c$ menjadi persegi panjang utuh untuk menemukan panjang dan lebar faktornya. Namun:
  * `Problem` mengunci `factor1` dan `factor2` secara tetap.
  * `GridCellState` mengunci `expectedTile` berdasarkan koordinat `(rowIndex, colIndex)`.
* **Dampak:** Pada faktorisasi $(x+2)(x+3)$, susunan horizontal $(x+2) \times (x+3)$ dan susunan vertikal tertransposisi $(x+3) \times (x+2)$ **keduanya benar secara matematis**, tetapi `GridCellState` akan menyalahkan salah satunya. Selain itu, sumbu atas/kiri belum bersifat interaktif (*editable axis*).
* **Rekomendasi Perbaikan:** Pisahkan tipe soal menjadi union type `ExpansionProblem | FactorizationProblem`, tambahkan properti `isAxisEditable: boolean`, dan validasi faktorisasi berdasarkan **dimensi persegi panjang yang terbentuk & ekuivalensi polinomial**, bukan koordinat sel statis.

### 2.2 Status *Zero Pairs* Terlalu Sederhana (`isEliminated?: boolean`) (Bagian 6.3)
* **Temuan:** `GridCellState` hanya menyimpan `isEliminated?: boolean` tanpa referensi pasangan (`pairId` atau `pairedCell`).
* **Dampak:** Jika soal memiliki banyak pasang $+x$ dan $-x$ (misal $(2x+3)(x-2)$), sistem tidak dapat melacak pasangan mana yang saling meniadakan, tidak bisa membatalkan (*undo*) satu pasangan tertentu, dan sulit memvalidasi jika siswa membiarkan sisa pasangan nol belum dieliminasi.
* **Rekomendasi Perbaikan:** Gunakan `pairId?: string` pada `GridCellState` serta fungsi `countRemainingZeroPairs(grid)` di `mathValidator.ts`.

### 2.3 Orientasi Batang $x$ Tidak Tercatat di State (Bagian 3.3 vs. 6.3)
* **Temuan:** Bagian 3.3 menyebut tombol **Putar $90^\circ$** atau rotasi otomatis untuk ubin batang $x$, tetapi `TileType` hanya `'x' | 'neg_x'` tanpa metadata orientasi.
* **Rekomendasi Perbaikan:** Hapus tombol putar manual (mengurangi beban kognitif siswa) dan jadikan orientasi batang $x$ (`horizontal` vs `vertical`) **100% otomatis** mengikuti proporsi dimensi sel grid tujuan (`colWidth` vs `rowHeight`).

### 2.4 Komponen Fase 4 (*Mastery Challenge*) Hilang dari Struktur Folder (Bagian 2 vs. 6.2)
* **Temuan:** Bagian 6.2 mendefinisikan folder `learn/`, `sandbox/`, `workspace/`, dan `report/`, tetapi **tidak ada folder/komponen untuk Fase 4 (Evaluasi & Diagnostik)** yang berisi campuran soal visual dan soal aljabar abstrak tanpa ubin.
* **Rekomendasi Perbaikan:** Tambahkan `src/components/evaluate/` (misal `MasteryQuiz.tsx` dan `AbstractQuestionCard.tsx`) ke struktur proyek.

---

## 3. Celah UI/UX, Responsivitas Mobile & Aksesibilitas (Menengah–Tinggi)

### 3.1 Overflow Layar HP pada Level 5 (Bagian 5.2 vs. 5.3)
* **Temuan:** Ukuran piksel baku menetapkan ubin $x^2 = 96\text{px} \times 96\text{px}$ dan ubin $1 = 28\text{px} \times 28\text{px}$. Pada soal Level 5 seperti $(3x + 4)(3x + 4)$, lebar papan mencapai:
  $$\text{Sumbu Kiri } (96) + 3(96) + 4(28) = 496\text{px} \text{ (+ gap/padding } \approx 540\text{px)}$$
* **Dampak:** Lebar layar HP standar adalah `360px–390px`. Papan akan terpotong horizontal, sementara `overflow-x: auto` sering bentrok dengan gestur sentuh *drag-and-drop* `@dnd-kit/core`.
* **Rekomendasi Perbaikan:** Gunakan **skala proporsional dinamis** berbasis lebar kontainer (`ResizeObserver` atau CSS `clamp()`), dengan tetap mempertahankan rasio non-komensurabel $x : 1 \approx 3.4 : 1$ (misal pada HP kecil $x = 56\text{px}$, $1 = 16\text{px}$).

### 3.2 Kontras Warna Ubin Negatif & Buta Warna Merah-Hijau (Bagian 5.1)
* **Temuan:** Ubin positif memakai 3 warna berbeda (Biru, Hijau, Kuning), sedangkan seluruh ubin negatif ($-x^2, -x, -1$) memakai **satu warna Merah Koral (`#EF4444`)** yang hanya dibedakan lewat gradasi/intensitas. Selain itu, kombinasi Hijau (`#10B981`) dan Merah (`#EF4444`) sulit dibedakan pengguna buta warna merah-hijau (*deuteranopia*).
* **Rekomendasi Perbaikan:** Berikan tekstur garis diagonal (*hatching*) yang jelas pada seluruh ubin negatif serta perbedaan ikon/tepi luar yang kontras, tidak hanya mengandalkan gradasi merah.

---

## 4. Celah Fitur Pengguna, Performa & Kebutuhan Penelitian (Menengah)

### 4.1 Peran Guru / Mode Proyektor Tidak Terakomodasi di Alur (Bagian 1.2 vs. 3.1)
* **Temuan:** Guru matematika disebut sebagai target sekunder untuk demonstrasi proyektor kelas, tetapi peta progres mengunci level secara berurutan tanpa mode bebas guru.
* **Rekomendasi Perbaikan:** Sediakan **Mode Guru / Proyektor** (bisa diakses lewat menu pengaturan/ikon kunci guru) yang membuka seluruh level secara instan dan menampilkan panel kontrol soal kustom.

### 4.2 Target Bundle `< 500 KB` Berbenturan dengan Aset KaTeX + Framer Motion + SFX (Bagian 6.1 & 7.3)
* **Temuan:** Gabungan `react-katex` (beserta font matematisnya), `framer-motion`, `@dnd-kit/core`, `html-to-image`, dan file audio SFX berisiko melampaui batas `500 KB`.
* **Rekomendasi Perbaikan:**
  1. Gunakan **Web Audio API** (sintesis nada pendek via oscillator) untuk efek suara *snap*, *zero pair*, dan *level up* sehingga ukuran aset audio = **0 KB**.
  2. Muat hanya format font `woff2` pada KaTeX (hapus `.ttf` dan `.woff` lama saat build Vite).

### 4.3 Telemetri Diagnostik untuk Keperluan Skripsi R&D (Bagian 8.2)
* **Temuan:** Bagian 8.2 menyebut pengukuran *N-Gain* dan penurunan miskonsepsi jika dipakai untuk penelitian R&D (ADDIE/4D), namun sistem hanya mengekspor kartu rapor PNG untuk siswa.
* **Rekomendasi Perbaikan:** Tambahkan opsi **Ekspor Log Diagnostik (JSON/CSV)** tersembunyi di kartu rapor atau mode guru yang mencatat jumlah percobaan, waktu penyelesaian, dan frekuensi setiap `MisconceptionFeedback['code']` per siswa.
