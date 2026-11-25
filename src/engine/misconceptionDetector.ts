import type {
  AlgebraicTermInput,
  AxisUnit,
  GridCellState,
  MisconceptionFeedback,
  PolynomialCoefficients,
} from '../types/algebra';
import {
  getAxisUnitLabel,
  getTileDegree,
  getTileLabel,
} from './gridBuilder';
import { getRemainingTileSummary } from './mathValidator';

/** Mendeteksi miskonsepsi spesifik dari keadaan papan grid perkalian. */
export function detectGridMisconception(
  cells: GridCellState[],
  topAxis: AxisUnit[],
  leftAxis: AxisUnit[],
): MisconceptionFeedback {
  const emptyCells = cells.filter((c) => c.placedTile === null);

  if (emptyCells.length > 0) {
    const x2Cells = cells.filter((c) => getTileDegree(c.expectedTile) === 2);
    const xCells = cells.filter((c) => getTileDegree(c.expectedTile) === 1);
    const constCells = cells.filter((c) => getTileDegree(c.expectedTile) === 0);

    const allX2Filled = x2Cells.every((c) => c.placedTile !== null);
    const allConstFilled = constCells.every((c) => c.placedTile !== null);
    const allXEmpty = xCells.length > 0 && xCells.every((c) => c.placedTile === null);

    if (allX2Filled && allConstFilled && allXEmpty) {
      return {
        code: 'MISSING_MIDDLE_TERM',
        message:
          'Lihat dua ruang kosong di sebelah kanan dan bawah x². Perkalian x dengan konstanta menghasilkan suku tengah yang tidak boleh dilewati!',
        highlightCells: xCells.map((c) => ({ row: c.rowIndex, col: c.colIndex })),
      };
    }

    return {
      code: 'INCOMPLETE_BOARD',
      message: `Masih ada ${emptyCells.length} kotak kosong di papan perkalian. Lengkapi seluruh area sebelum lanjut.`,
      highlightCells: emptyCells.map((c) => ({ row: c.rowIndex, col: c.colIndex })),
    };
  }

  const wrongShapeCells = cells.filter(
    (c) =>
      c.placedTile !== null &&
      getTileDegree(c.placedTile) !== getTileDegree(c.expectedTile),
  );

  if (wrongShapeCells.length > 0) {
    const first = wrongShapeCells[0];
    const rowLabel = getAxisUnitLabel(leftAxis[first.rowIndex]);
    const colLabel = getAxisUnitLabel(topAxis[first.colIndex]);
    return {
      code: 'WRONG_TILE_SHAPE',
      message: `Bentuk ubin tidak sesuai dimensi sisi! Pada sel tersorot, sisi (${rowLabel}) dikali (${colLabel}) seharusnya berbentuk ${getTileLabel(first.expectedTile).replace('+', '').replace('−', '')}.`,
      highlightCells: wrongShapeCells.map((c) => ({
        row: c.rowIndex,
        col: c.colIndex,
      })),
      highlightAxes: {
        top: [...new Set(wrongShapeCells.map((c) => c.colIndex))],
        left: [...new Set(wrongShapeCells.map((c) => c.rowIndex))],
      },
    };
  }

  const signErrorCells = cells.filter(
    (c) => c.placedTile !== null && c.placedTile !== c.expectedTile,
  );

  if (signErrorCells.length > 0) {
    const first = signErrorCells[0];
    const rowLabel = getAxisUnitLabel(leftAxis[first.rowIndex]);
    const colLabel = getAxisUnitLabel(topAxis[first.colIndex]);
    return {
      code: 'SIGN_ERROR',
      message: `Perhatikan aturan tanda pada sumbu tersorot: (${rowLabel}) × (${colLabel}) menghasilkan ubin ${getTileLabel(first.expectedTile)}.`,
      highlightCells: signErrorCells.map((c) => ({
        row: c.rowIndex,
        col: c.colIndex,
      })),
      highlightAxes: {
        top: [...new Set(signErrorCells.map((c) => c.colIndex))],
        left: [...new Set(signErrorCells.map((c) => c.rowIndex))],
      },
    };
  }

  return {
    code: 'CORRECT',
    message: 'Susunan papan perkalian tepat!',
  };
}

/** Format ringkasan suku tersisa menjadi string aljabar untuk umpan balik edukatif. */
function formatSummaryText(summary: PolynomialCoefficients): string {
  const parts: string[] = [];
  if (summary.A !== 0) parts.push(`${summary.A === 1 ? '' : summary.A}x²`);
  if (summary.B !== 0) {
    const absB = Math.abs(summary.B);
    const mag = absB === 1 ? 'x' : `${absB}x`;
    parts.push(parts.length === 0 ? (summary.B < 0 ? `−${mag}` : mag) : `${summary.B < 0 ? '−' : '+'} ${mag}`);
  }
  if (summary.C !== 0) {
    const absC = Math.abs(summary.C);
    parts.push(parts.length === 0 ? `${summary.C}` : `${summary.C < 0 ? '−' : '+'} ${absC}`);
  }
  return parts.length > 0 ? parts.join(' ') : '0';
}

/** Mendeteksi miskonsepsi saat siswa menyusun persamaan akhir di TermBuilderInput. */
export function detectEquationMisconception(
  terms: AlgebraicTermInput[],
  expected: PolynomialCoefficients,
  cells: GridCellState[],
): MisconceptionFeedback {
  const nonZeroTerms = terms.filter((t) => t.coefficient !== 0);

  if (nonZeroTerms.length === 0) {
    return {
      code: 'SIMPLIFICATION_ERROR',
      message: 'Tambahkan minimal satu suku aljabar sesuai ubin yang tersisa di papan.',
    };
  }

  // Cek error derajat 3 (misal x^2 + 2x = 3x^3)
  const degree3Term = nonZeroTerms.find((t) => t.degree === 3);
  if (degree3Term) {
    return {
      code: 'UNLIKE_TERMS_COMBINED',
      message:
        'Ubin persegi x² dan batang x berbeda dimensi sehingga pangkatnya tidak bisa dijumlahkan menjadi x³. Pertahankan masing-masing suku secara terpisah.',
    };
  }

  // Jumlahkan per derajat untuk mendeteksi penggabungan suku tak sejenis maupun duplikasi suku
  const degreeCounts: Record<0 | 1 | 2, number> = { 0: 0, 1: 0, 2: 0 };
  let inputA = 0;
  let inputB = 0;
  let inputC = 0;

  for (const term of nonZeroTerms) {
    if (term.degree === 2) {
      inputA += term.coefficient;
      degreeCounts[2]++;
    } else if (term.degree === 1) {
      inputB += term.coefficient;
      degreeCounts[1]++;
    } else if (term.degree === 0) {
      inputC += term.coefficient;
      degreeCounts[0]++;
    }
  }

  // Deteksi kasus klasik x^2 + 2x -> 3x^2 atau 2x + 3 -> 5x
  if (
    expected.B !== 0 &&
    inputA === expected.A + expected.B &&
    inputB === 0
  ) {
    return {
      code: 'UNLIKE_TERMS_COMBINED',
      message:
        'Hati-hati! Kamu menggabungkan koefisien x² dan x menjadi satu suku x². Persegi x² dan batang x tidak sejenis sehingga tidak dapat dijumlahkan.',
    };
  }

  if (
    expected.C !== 0 &&
    expected.B !== 0 &&
    inputB === expected.B + expected.C &&
    inputC === 0
  ) {
    return {
      code: 'UNLIKE_TERMS_COMBINED',
      message:
        'Hati-hati! Batang x dan ubin satuan konstanta tidak sejenis sehingga tidak boleh digabungkan menjadi satu suku x.',
    };
  }

  // Deteksi suku sejenis belum disederhanakan (misal +2x dan -1x dimasukkan terpisah)
  if (degreeCounts[2] > 1 || degreeCounts[1] > 1 || degreeCounts[0] > 1) {
    return {
      code: 'UNSIMPLIFIED_LIKE_TERMS',
      message:
        'Masih ada lebih dari satu suku dengan pangkat yang sama. Gabungkan suku sejenis tersebut menjadi satu koefisien.',
    };
  }

  if (
    inputA === expected.A &&
    inputB === expected.B &&
    inputC === expected.C
  ) {
    return {
      code: 'CORRECT',
      message: 'Tepat sekali! Bentuk aljabar akhir sesuai dengan luas ubin di papan.',
    };
  }

  if (
    Math.abs(inputA) === Math.abs(expected.A) &&
    Math.abs(inputB) === Math.abs(expected.B) &&
    Math.abs(inputC) === Math.abs(expected.C)
  ) {
    return {
      code: 'SIGN_ERROR',
      message:
        'Angka koefisienmu sudah benar, tetapi ada tanda positif/negatif yang tertukar. Cek warna ubin tersisa di papan (biru/teal/amber positif, merah negatif).',
    };
  }

  const remaining = getRemainingTileSummary(cells);
  return {
    code: 'SIMPLIFICATION_ERROR',
    message: `Hasil hitungan belum cocok dengan ubin tersisa di papan. Coba hitung ulang jumlah ubin x², batang x, dan satuan 1 (tersisa ${formatSummaryText(remaining)}).`,
  };
}
