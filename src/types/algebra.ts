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

export type ActiveView = 'lab' | 'practice' | 'summary';
