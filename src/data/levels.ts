import type { DiscoveryMission, ExpansionProblem } from '../types/algebra';

export const LEVEL_METADATA: Record<
  ExpansionProblem['level'],
  { name: string; subtitle: string; focus: string }
> = {
  1: {
    name: 'Fondasi Positif',
    subtitle: 'Perkalian (x + a)(x + b)',
    focus: 'Pemetaan panjang sisi ke luas x², x, dan 1 serta penjumlahan suku sejenis.',
  },
  2: {
    name: 'Identitas Kuadrat',
    subtitle: 'Kuadrat Jumlah (x + a)²',
    focus: 'Membongkar miskonsepsi (x + a)² ≠ x² + a² lewat dua batang x kembar.',
  },
  3: {
    name: 'Tantangan Negatif',
    subtitle: 'Perkalian Tanda Negatif',
    focus: 'Memahami aturan tanda (− × − = +, + × − = −) dengan ubin merah berarsir.',
  },
  4: {
    name: 'Pasangan Nol',
    subtitle: 'Eliminasi Zero Pairs',
    focus: 'Menghilangkan pasangan +x dan −x hingga menemukan selisih kuadrat x² − a².',
  },
};

export const PROBLEMS: ExpansionProblem[] = [
  // Level 1: Fondasi Positif
  {
    id: 'L1-1',
    level: 1,
    title: 'Persegi Panjang Awal',
    factor1: { coeffX: 1, constant: 1 },
    factor2: { coeffX: 1, constant: 2 },
    expectedResult: { A: 1, B: 3, C: 2 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Mulai dari pojok kiri atas: x dikali x menghasilkan ubin persegi biru +x².',
      'Di samping kanan dan bawah +x², kalikan sisi x dengan +1 untuk menghasilkan batang +x.',
      'Pojok kanan bawah adalah perkalian konstanta (+1) × (+1) sebanyak dua kotak (+1).',
    ],
  },
  {
    id: 'L1-2',
    level: 1,
    title: 'Luas Kebun Diperluas',
    factor1: { coeffX: 1, constant: 2 },
    factor2: { coeffX: 1, constant: 3 },
    expectedResult: { A: 1, B: 5, C: 6 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Isi 1 ubin +x² di irisan x × x.',
      'Ada 2 batang +x di kanan atas dan 3 batang +x di kiri bawah. Totalnya 5 batang +x.',
      'Pojok kanan bawah terdiri dari 2 × 3 = 6 ubin satuan +1.',
    ],
  },
  {
    id: 'L1-3',
    level: 1,
    title: 'Ekspansi Positif Lanjut',
    factor1: { coeffX: 1, constant: 3 },
    factor2: { coeffX: 1, constant: 1 },
    expectedResult: { A: 1, B: 4, C: 3 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Perhatikan sumbu atas memiliki 1 ubin x dan 3 ubin +1.',
      'Sisi bawah hanya memiliki 1 baris satuan +1, sehingga terbentuk 3 ubin +1 di kanan bawah.',
    ],
  },

  // Level 2: Identitas Kuadrat
  {
    id: 'L2-1',
    level: 2,
    title: 'Membongkar Kuadrat (x + 2)²',
    factor1: { coeffX: 1, constant: 2 },
    factor2: { coeffX: 1, constant: 2 },
    expectedResult: { A: 1, B: 4, C: 4 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Jangan hanya mengisi +x² dan +4! Perhatikan dua ruang batang di kanan dan bawah +x².',
      'Ada dua kelompok batang +x yang sama besar (masing-masing 2 batang) sehingga suku tengahnya +4x.',
    ],
  },
  {
    id: 'L2-2',
    level: 2,
    title: 'Simetri Persegi (x + 3)²',
    factor1: { coeffX: 1, constant: 3 },
    factor2: { coeffX: 1, constant: 3 },
    expectedResult: { A: 1, B: 6, C: 9 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Perhatikan simetri persegi: di kanan +x² ada 3 batang +x, dan di bawah +x² juga ada 3 batang +x.',
      'Jadi (x + 3)² bukan x² + 9, melainkan x² + 6x + 9.',
    ],
  },
  {
    id: 'L2-3',
    level: 2,
    title: 'Kuadrat Sederhana (x + 1)²',
    factor1: { coeffX: 1, constant: 1 },
    factor2: { coeffX: 1, constant: 1 },
    expectedResult: { A: 1, B: 2, C: 1 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Di luar +x² dan +1, terdapat dua batang kembar +x di kanan dan bawah.',
      'Total hasil ekspansi adalah x² + 2x + 1.',
    ],
  },

  // Level 3: Tantangan Negatif
  {
    id: 'L3-1',
    level: 3,
    title: 'Kuadrat Selisih (x − 2)²',
    factor1: { coeffX: 1, constant: -2 },
    factor2: { coeffX: 1, constant: -2 },
    expectedResult: { A: 1, B: -4, C: 4 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Positif x dikali negatif 1 menghasilkan batang merah berarsir −x.',
      'Hati-hati di pojok kanan bawah: (−1) × (−1) menghasilkan ubin POSITIF (+1)!',
    ],
  },
  {
    id: 'L3-2',
    level: 3,
    title: 'Dua Faktor Negatif',
    factor1: { coeffX: 1, constant: -1 },
    factor2: { coeffX: 1, constant: -3 },
    expectedResult: { A: 1, B: -4, C: 3 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Gabungkan 1 batang −x di kanan dengan 3 batang −x di bawah menjadi −4x.',
      'Irisan baris −1 dan kolom −1 menghasilkan 3 ubin positif (+1).',
    ],
  },
  {
    id: 'L3-3',
    level: 3,
    title: 'Master Tanda Negatif',
    factor1: { coeffX: 1, constant: -2 },
    factor2: { coeffX: 1, constant: -3 },
    expectedResult: { A: 1, B: -5, C: 6 },
    hasZeroPairs: false,
    showQuadrantGuides: true,
    hints: [
      'Sumbu negatif × sumbu positif menghasilkan −x (total 5 batang −x).',
      'Sumbu negatif × sumbu negatif menghasilkan +1 (total 6 kotak +1).',
    ],
  },

  // Level 4: Pasangan Nol
  {
    id: 'L4-1',
    level: 4,
    title: 'Satu Pasangan Nol',
    factor1: { coeffX: 1, constant: 2 },
    factor2: { coeffX: 1, constant: -1 },
    expectedResult: { A: 1, B: 1, C: -2 },
    hasZeroPairs: true,
    showQuadrantGuides: false,
    hints: [
      'Setelah papan penuh, pasangkan 1 batang +x dengan 1 batang −x agar saling meniadakan (= 0).',
      'Sisa di papan setelah eliminasi adalah 1 ubin +x², 1 batang +x, dan 2 ubin −1.',
    ],
  },
  {
    id: 'L4-2',
    level: 4,
    title: 'Sisa Suku Tengah',
    factor1: { coeffX: 1, constant: 3 },
    factor2: { coeffX: 1, constant: -2 },
    expectedResult: { A: 1, B: 1, C: -6 },
    hasZeroPairs: true,
    showQuadrantGuides: false,
    hints: [
      'Terdapat 3 batang +x di atas dan 2 batang −x di kiri bawah.',
      'Pasangkan 2 pasang (+x, −x) hingga menyisakan 1 batang +x dan 6 ubin −1.',
    ],
  },
  {
    id: 'L4-3',
    level: 4,
    title: 'Selisih Dua Kuadrat (x + 3)(x − 3)',
    factor1: { coeffX: 1, constant: 3 },
    factor2: { coeffX: 1, constant: -3 },
    expectedResult: { A: 1, B: 0, C: -9 },
    hasZeroPairs: true,
    showQuadrantGuides: false,
    hints: [
      'Ketiga batang +x dan ketiga batang −x berpasangan habis menjadi 0!',
      'Hasil akhirnya tidak memiliki suku x: cukup tulis x² − 9.',
    ],
  },
];

export const DISCOVERY_MISSIONS: DiscoveryMission[] = [
  {
    id: 'M1',
    title: 'Misi 1: Misteri Kuadrat Sempurna',
    prompt: 'Atur a = 2 dan b = 2 untuk membentuk (x + 2)². Mengapa luas totalnya bukan x² + 4?',
    targetA: 2,
    targetB: 2,
    insight:
      'Selain persegi x² dan 4 satuan di pojok, selalu terbentuk dua kelompok batang kembar (+2x dan +2x) di tengah sehingga hasilnya x² + 4x + 4.',
  },
  {
    id: 'M2',
    title: 'Misi 2: Negatif Kali Negatif',
    prompt: 'Atur a = −2 dan b = −2 untuk membentuk (x − 2)². Mengapa pojok kanan bawah berwarna kuning positif (+4)?',
    targetA: -2,
    targetB: -2,
    insight:
      'Dalam tabel ubin aljabar bertanda, pengurangan dua arah (−2) × (−2) menghasilkan nilai positif (+4), sedangkan suku tengah menjadi negatif (−4x).',
  },
  {
    id: 'M3',
    title: 'Misi 3: Suku Tengah Menghilang',
    prompt: 'Atur a = 3 dan b = −3 untuk membentuk (x + 3)(x − 3). Apa yang terjadi pada batang +3x dan −3x?',
    targetA: 3,
    targetB: -3,
    insight:
      'Tiga batang +x dan tiga batang −x tepat berpasangan menjadi nol (Zero Pairs), menyisakan identitas selisih kuadrat x² − 9.',
  },
];
