import type {
  AlgebraicTermInput,
  AxisUnit,
  GridCellState,
  MisconceptionFeedback,
  PolynomialCoefficients,
} from '../types/algebra';
import { getTileDegree, getTileSign } from './gridBuilder';
import {
  detectEquationMisconception,
  detectGridMisconception,
} from './misconceptionDetector';

/** Menghitung jumlah pasangan nol (+ dan - dengan derajat sama) yang belum dieliminasi. */
export function countRemainingZeroPairs(cells: GridCellState[]): number {
  const active = cells.filter((c) => !c.pairId && c.placedTile !== null);

  let posX2 = 0;
  let negX2 = 0;
  let posX = 0;
  let negX = 0;
  let posOne = 0;
  let negOne = 0;

  for (const cell of active) {
    switch (cell.placedTile) {
      case 'x2':
        posX2++;
        break;
      case 'neg_x2':
        negX2++;
        break;
      case 'x':
        posX++;
        break;
      case 'neg_x':
        negX++;
        break;
      case 'one':
        posOne++;
        break;
      case 'neg_one':
        negOne++;
        break;
    }
  }

  return Math.min(posX2, negX2) + Math.min(posX, negX) + Math.min(posOne, negOne);
}

/** Memeriksa apakah dua sel di papan dapat saling meniadakan sebagai pasangan nol. */
export function canFormZeroPair(
  cellA: GridCellState,
  cellB: GridCellState,
): boolean {
  if (cellA.rowIndex === cellB.rowIndex && cellA.colIndex === cellB.colIndex) {
    return false;
  }
  if (cellA.pairId || cellB.pairId || !cellA.placedTile || !cellB.placedTile) {
    return false;
  }
  return (
    getTileDegree(cellA.placedTile) === getTileDegree(cellB.placedTile) &&
    getTileSign(cellA.placedTile) !== getTileSign(cellB.placedTile)
  );
}

/** Menghitung jumlah koefisien ubin tersisa (yang belum masuk pairId) di papan. */
export function getRemainingTileSummary(
  cells: GridCellState[],
): PolynomialCoefficients {
  let A = 0;
  let B = 0;
  let C = 0;

  for (const cell of cells) {
    if (cell.pairId || !cell.placedTile) continue;
    const deg = getTileDegree(cell.placedTile);
    const sign = getTileSign(cell.placedTile);
    if (deg === 2) A += sign;
    else if (deg === 1) B += sign;
    else C += sign;
  }

  return { A, B, C };
}

export function validateGrid(
  cells: GridCellState[],
  topAxis: AxisUnit[],
  leftAxis: AxisUnit[],
): MisconceptionFeedback {
  return detectGridMisconception(cells, topAxis, leftAxis);
}

export function validateEquation(
  terms: AlgebraicTermInput[],
  expected: PolynomialCoefficients,
  cells: GridCellState[],
): MisconceptionFeedback {
  const remainingPairs = countRemainingZeroPairs(cells);
  if (remainingPairs > 0) {
    return {
      code: 'UNELIMINATED_ZERO_PAIRS',
      message: `Masih ada ${remainingPairs} pasangan nol (+ dan −) di papan. Pasangkan terlebih dahulu sebelum memeriksa persamaan.`,
    };
  }

  return detectEquationMisconception(terms, expected, cells);
}
