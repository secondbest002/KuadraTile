import type {
  AxisUnit,
  GridCellState,
  LinearFactor,
  TileOrientation,
  TileType,
} from '../types/algebra';

/** Bangkitkan daftar unit sumbu (1 unit x diikuti |constant| unit satuan). */
export function buildAxisUnits(factor: LinearFactor): AxisUnit[] {
  const unitTile: AxisUnit = factor.constant > 0 ? 'one' : 'neg_one';
  const count = Math.abs(factor.constant);
  return ['x', ...Array.from({ length: count }, () => unitTile)];
}

export function getAxisUnitDegree(unit: AxisUnit): 0 | 1 {
  return unit === 'x' || unit === 'neg_x' ? 1 : 0;
}

export function getAxisUnitSign(unit: AxisUnit): 1 | -1 {
  return unit === 'neg_x' || unit === 'neg_one' ? -1 : 1;
}

export function getTileDegree(tile: TileType): 0 | 1 | 2 {
  if (tile === 'x2' || tile === 'neg_x2') return 2;
  if (tile === 'x' || tile === 'neg_x') return 1;
  return 0;
}

export function getTileSign(tile: TileType): 1 | -1 {
  return tile === 'neg_x2' || tile === 'neg_x' || tile === 'neg_one' ? -1 : 1;
}

export function getTileLabel(tile: TileType): string {
  switch (tile) {
    case 'x2':
      return '+x²';
    case 'neg_x2':
      return '−x²';
    case 'x':
      return '+x';
    case 'neg_x':
      return '−x';
    case 'one':
      return '+1';
    case 'neg_one':
      return '−1';
  }
}

export function getAxisUnitLabel(unit: AxisUnit): string {
  switch (unit) {
    case 'x':
      return 'x';
    case 'neg_x':
      return '−x';
    case 'one':
      return '+1';
    case 'neg_one':
      return '−1';
  }
}

export function multiplyAxisUnits(rowUnit: AxisUnit, colUnit: AxisUnit): TileType {
  const degreeSum = getAxisUnitDegree(rowUnit) + getAxisUnitDegree(colUnit);
  const sign = getAxisUnitSign(rowUnit) * getAxisUnitSign(colUnit);

  if (degreeSum === 2) return sign > 0 ? 'x2' : 'neg_x2';
  if (degreeSum === 1) return sign > 0 ? 'x' : 'neg_x';
  return sign > 0 ? 'one' : 'neg_one';
}

export function computeTileOrientation(
  rowUnit: AxisUnit,
  colUnit: AxisUnit,
): TileOrientation {
  const rowDeg = getAxisUnitDegree(rowUnit);
  const colDeg = getAxisUnitDegree(colUnit);
  if (rowDeg === colDeg) return 'square';
  return colDeg === 1 ? 'horizontal' : 'vertical';
}

export function buildInitialGrid(
  factor1: LinearFactor,
  factor2: LinearFactor,
  prefill = false,
): {
  topAxis: AxisUnit[];
  leftAxis: AxisUnit[];
  cells: GridCellState[];
} {
  const topAxis = buildAxisUnits(factor1);
  const leftAxis = buildAxisUnits(factor2);
  const cells: GridCellState[] = [];

  for (let rowIndex = 0; rowIndex < leftAxis.length; rowIndex++) {
    for (let colIndex = 0; colIndex < topAxis.length; colIndex++) {
      const rowUnit = leftAxis[rowIndex];
      const colUnit = topAxis[colIndex];
      const expectedTile = multiplyAxisUnits(rowUnit, colUnit);

      cells.push({
        rowIndex,
        colIndex,
        expectedTile,
        placedTile: prefill ? expectedTile : null,
        orientation: computeTileOrientation(rowUnit, colUnit),
      });
    }
  }

  return { topAxis, leftAxis, cells };
}
