export const RATIO_X_TO_ONE = 3.43;

/**
 * Menghitung ukuran piksel unit dasar (1x1) secara dinamis dengan batas sentuh aman >= 24px
 * dan ukuran maksimal desktop 28px (membuat sisi x = 96px di desktop).
 */
export function computeTileUnitPx(
  availableWidth: number,
  countXCols: number,
  countOneCols: number,
): number {
  const totalColsWithLeftAxis = countXCols + countOneCols + 1;
  const gapsAndPadding = totalColsWithLeftAxis * 4 + 20;
  const usableWidth = Math.max(0, availableWidth - gapsAndPadding);
  const totalRatioUnits = RATIO_X_TO_ONE * (countXCols + 1) + countOneCols;

  if (totalRatioUnits <= 0 || usableWidth <= 0) {
    return 24;
  }

  const rawUnit = usableWidth / totalRatioUnits;
  return Math.round(Math.max(24, Math.min(28, rawUnit)));
}
