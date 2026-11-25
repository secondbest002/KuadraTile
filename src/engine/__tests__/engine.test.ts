import { describe, expect, it } from 'vitest';
import { PROBLEMS } from '../../data/levels';
import { buildInitialGrid } from '../gridBuilder';
import {
  canFormZeroPair,
  countRemainingZeroPairs,
  validateEquation,
  validateGrid,
} from '../mathValidator';
import { computeTileUnitPx } from '../../utils/responsiveScale';
import type { AlgebraicTermInput } from '../../types/algebra';

describe('KuadraTile Algebraic Engine V0.1', () => {
  it('membangkitkan grid dan orientasi batang x secara otomatis', () => {
    const p = PROBLEMS.find((item) => item.id === 'L4-1')!; // (x + 2)(x - 1)
    const { topAxis, leftAxis, cells } = buildInitialGrid(p.factor1, p.factor2, true);

    expect(topAxis).toEqual(['x', 'one', 'one']);
    expect(leftAxis).toEqual(['x', 'neg_one']);
    expect(cells).toHaveLength(6);

    // (0,0): x * x -> x2 square
    expect(cells[0].expectedTile).toBe('x2');
    expect(cells[0].orientation).toBe('square');

    // (0,1): x * +1 -> x vertical
    expect(cells[1].expectedTile).toBe('x');
    expect(cells[1].orientation).toBe('vertical');

    // (1,0): -1 * x -> neg_x horizontal
    expect(cells[3].expectedTile).toBe('neg_x');
    expect(cells[3].orientation).toBe('horizontal');

    // (1,1): -1 * +1 -> neg_one square
    expect(cells[4].expectedTile).toBe('neg_one');
    expect(cells[4].orientation).toBe('square');
  });

  it('mendeteksi MISSING_MIDDLE_TERM saat hanya x^2 dan konstanta yang diisi pada (x+3)^2', () => {
    const p = PROBLEMS.find((item) => item.id === 'L2-2')!; // (x + 3)^2
    const { topAxis, leftAxis, cells } = buildInitialGrid(p.factor1, p.factor2, false);

    for (const cell of cells) {
      if (cell.expectedTile === 'x2' || cell.expectedTile === 'one') {
        cell.placedTile = cell.expectedTile;
      }
    }

    const res = validateGrid(cells, topAxis, leftAxis);
    expect(res.code).toBe('MISSING_MIDDLE_TERM');
    expect(res.highlightCells?.length).toBe(6);
  });

  it('mendeteksi WRONG_TILE_SHAPE dan SIGN_ERROR dengan prioritas yang benar', () => {
    const p = PROBLEMS.find((item) => item.id === 'L3-1')!; // (x - 2)^2
    const { topAxis, leftAxis, cells } = buildInitialGrid(p.factor1, p.factor2, true);

    // Salah tanda pada pojok (-1 * -1 -> seharusnya one, diisi neg_one)
    const lastCell = cells[cells.length - 1];
    lastCell.placedTile = 'neg_one';
    const signErr = validateGrid(cells, topAxis, leftAxis);
    expect(signErr.code).toBe('SIGN_ERROR');
    expect(signErr.highlightAxes?.top).toContain(lastCell.colIndex);

    // Salah bentuk (sel x diisi one)
    const middleCell = cells[1];
    middleCell.placedTile = 'one';
    const shapeErr = validateGrid(cells, topAxis, leftAxis);
    expect(shapeErr.code).toBe('WRONG_TILE_SHAPE');
  });

  it('menghitung dan memvalidasi eliminasi Zero Pairs berbasis pairId', () => {
    const p = PROBLEMS.find((item) => item.id === 'L4-3')!; // (x + 3)(x - 3)
    const { cells } = buildInitialGrid(p.factor1, p.factor2, true);

    expect(countRemainingZeroPairs(cells)).toBe(3);

    const posX = cells.find((c) => c.placedTile === 'x')!;
    const negX = cells.find((c) => c.placedTile === 'neg_x')!;
    const negOne = cells.find((c) => c.placedTile === 'neg_one')!;

    expect(canFormZeroPair(posX, negX)).toBe(true);
    expect(canFormZeroPair(posX, negOne)).toBe(false);

    posX.pairId = 'pair-1';
    negX.pairId = 'pair-1';
    expect(countRemainingZeroPairs(cells)).toBe(2);
  });

  it('mendeteksi UNLIKE_TERMS_COMBINED (3x^3, 3x^2, 5x), UNSIMPLIFIED_LIKE_TERMS, dan CORRECT', () => {
    const p = PROBLEMS.find((item) => item.id === 'L1-1')!; // x^2 + 3x + 2
    const { cells } = buildInitialGrid(p.factor1, p.factor2, true);

    const deg3: AlgebraicTermInput[] = [
      { id: '1', coefficient: 4, degree: 3 },
      { id: '2', coefficient: 2, degree: 0 },
    ];
    expect(validateEquation(deg3, p.expectedResult, cells).code).toBe('UNLIKE_TERMS_COMBINED');

    // x^2 + 3x digabung menjadi 4x^2
    const mergedX2: AlgebraicTermInput[] = [
      { id: '1', coefficient: 4, degree: 2 },
      { id: '2', coefficient: 2, degree: 0 },
    ];
    expect(validateEquation(mergedX2, p.expectedResult, cells).code).toBe('UNLIKE_TERMS_COMBINED');

    // 3x + 2 digabung menjadi 5x
    const mergedXConst: AlgebraicTermInput[] = [
      { id: '1', coefficient: 1, degree: 2 },
      { id: '2', coefficient: 5, degree: 1 },
    ];
    expect(validateEquation(mergedXConst, p.expectedResult, cells).code).toBe('UNLIKE_TERMS_COMBINED');

    // Belum disederhanakan: +2x + 1x terpisah
    const unsimplified: AlgebraicTermInput[] = [
      { id: '1', coefficient: 1, degree: 2 },
      { id: '2', coefficient: 2, degree: 1 },
      { id: '3', coefficient: 1, degree: 1 },
      { id: '4', coefficient: 2, degree: 0 },
    ];
    expect(validateEquation(unsimplified, p.expectedResult, cells).code).toBe('UNSIMPLIFIED_LIKE_TERMS');

    // Benar
    const valid: AlgebraicTermInput[] = [
      { id: '1', coefficient: 1, degree: 2 },
      { id: '2', coefficient: 3, degree: 1 },
      { id: '3', coefficient: 2, degree: 0 },
    ];
    expect(validateEquation(valid, p.expectedResult, cells).code).toBe('CORRECT');
  });

  it('menjaga skala ubin >= 24px pada layar mobile 340px dan 28px pada desktop', () => {
    const mobileU = computeTileUnitPx(340, 1, 3);
    const desktopU = computeTileUnitPx(540, 1, 3);

    expect(mobileU).toBeGreaterThanOrEqual(24);
    expect(mobileU).toBeLessThanOrEqual(28);
    expect(desktopU).toBe(28);
  });
});
