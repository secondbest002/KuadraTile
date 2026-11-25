import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Star,
  Undo2,
} from 'lucide-react';
import { LEVEL_METADATA, PROBLEMS } from '../../data/levels';
import { buildInitialGrid } from '../../engine/gridBuilder';
import {
  canFormZeroPair,
  countRemainingZeroPairs,
  validateEquation,
  validateGrid,
} from '../../engine/mathValidator';
import { useProgressStore } from '../../store/useProgressStore';
import type {
  AlgebraicTermInput,
  AxisUnit,
  ExpansionProblem,
  GridCellState,
  MisconceptionFeedback,
  TileOrientation,
  TileType,
  WorkspaceStage,
} from '../../types/algebra';
import { ProductExpr } from '../common/MathExpr';
import { AreaGridMat } from './AreaGridMat';
import { FeedbackBanner } from './FeedbackBanner';
import { TermBuilderInput } from './TermBuilderInput';
import { TileItem } from './TileItem';
import { TileTray } from './TileTray';

function createDefaultTerms(): AlgebraicTermInput[] {
  return [
    { id: 't-x2', coefficient: 1, degree: 2 },
    { id: 't-x', coefficient: 1, degree: 1 },
    { id: 't-c', coefficient: 1, degree: 0 },
  ];
}

export function PracticeArena() {
  const [selectedLevel, setSelectedLevel] = useState<ExpansionProblem['level']>(1);
  const levelProblems = useMemo(
    () => PROBLEMS.filter((p) => p.level === selectedLevel),
    [selectedLevel],
  );
  const [problemIdx, setProblemIdx] = useState(0);
  const problem = levelProblems[problemIdx] ?? levelProblems[0];

  const [gridState, setGridState] = useState<{
    topAxis: AxisUnit[];
    leftAxis: AxisUnit[];
    cells: GridCellState[];
  }>(() => buildInitialGrid(problem.factor1, problem.factor2, false));

  const [stage, setStage] = useState<WorkspaceStage>('building');
  const [selectedTrayTile, setSelectedTrayTile] = useState<TileType | null>(null);
  const [selectedZeroPairCell, setSelectedZeroPairCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [pairHistory, setPairHistory] = useState<string[]>([]);
  const [terms, setTerms] = useState<AlgebraicTermInput[]>(createDefaultTerms);
  const [feedback, setFeedback] = useState<MisconceptionFeedback | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [earnedStars, setEarnedStars] = useState<1 | 2 | 3 | null>(null);
  const [unitPx, setUnitPx] = useState(28);
  const [activeDragTile, setActiveDragTile] = useState<TileType | null>(null);
  const [dragHoverOrientation, setDragHoverOrientation] =
    useState<TileOrientation | null>(null);

  const progressByProblem = useProgressStore((s) => s.progressByProblem);
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const recordCompletion = useProgressStore((s) => s.recordCompletion);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 130, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const loadProblem = useCallback((nextProblem: ExpansionProblem) => {
    setGridState(buildInitialGrid(nextProblem.factor1, nextProblem.factor2, false));
    setStage('building');
    setSelectedTrayTile(null);
    setSelectedZeroPairCell(null);
    setPairHistory([]);
    setTerms(createDefaultTerms());
    setFeedback(null);
    setAttempts(0);
    setHintsRevealed(0);
    setEarnedStars(null);
  }, []);

  const handleSelectLevel = (lvl: ExpansionProblem['level']) => {
    setSelectedLevel(lvl);
    setProblemIdx(0);
    const first = PROBLEMS.find((p) => p.level === lvl)!;
    loadProblem(first);
  };

  const handleSelectProblemIdx = (idx: number) => {
    setProblemIdx(idx);
    loadProblem(levelProblems[idx]);
  };

  const handlePlaceOrToggleCell = (row: number, col: number) => {
    if (stage === 'building') {
      setFeedback(null);
      setGridState((prev) => ({
        ...prev,
        cells: prev.cells.map((cell) => {
          if (cell.rowIndex !== row || cell.colIndex !== col) return cell;
          if (selectedTrayTile !== null) {
            return { ...cell, placedTile: selectedTrayTile };
          }
          // Ketuk sel terisi tanpa pilihan baki -> hapus satu sel
          if (cell.placedTile !== null) {
            return { ...cell, placedTile: null };
          }
          return cell;
        }),
      }));
      return;
    }

    if (stage === 'zero_pairs') {
      const clickedCell = gridState.cells.find(
        (c) => c.rowIndex === row && c.colIndex === col,
      );
      if (!clickedCell || clickedCell.pairId || !clickedCell.placedTile) return;

      if (!selectedZeroPairCell) {
        setSelectedZeroPairCell({ row, col });
        setFeedback(null);
        return;
      }

      if (
        selectedZeroPairCell.row === row &&
        selectedZeroPairCell.col === col
      ) {
        setSelectedZeroPairCell(null);
        return;
      }

      const firstCell = gridState.cells.find(
        (c) =>
          c.rowIndex === selectedZeroPairCell.row &&
          c.colIndex === selectedZeroPairCell.col,
      );
      if (!firstCell) return;

      if (!canFormZeroPair(firstCell, clickedCell)) {
        setSelectedZeroPairCell({ row, col });
        setFeedback({
          code: 'SIGN_ERROR',
          message:
            'Pasangan nol harus memiliki ukuran sama dengan tanda berlawanan (misal +x dengan −x).',
        });
        return;
      }

      const newPairId = `pair-${pairHistory.length + 1}-${Date.now()}`;
      const nextCells = gridState.cells.map((cell) => {
        const isPairMember =
          (cell.rowIndex === firstCell.rowIndex &&
            cell.colIndex === firstCell.colIndex) ||
          (cell.rowIndex === clickedCell.rowIndex &&
            cell.colIndex === clickedCell.colIndex);
        return isPairMember ? { ...cell, pairId: newPairId } : cell;
      });

      setGridState((prev) => ({ ...prev, cells: nextCells }));
      setPairHistory((prev) => [...prev, newPairId]);
      setSelectedZeroPairCell(null);

      const remaining = countRemainingZeroPairs(nextCells);
      if (remaining === 0) {
        setStage('equation');
        setFeedback({
          code: 'CORRECT',
          message:
            'Semua pasangan nol telah dieliminasi! Sekarang susun bentuk aljabar akhir dari ubin tersisa.',
        });
      } else {
        setFeedback({
          code: 'CORRECT',
          message: `Pasangan nol berhasil dieliminasi! Tersisa ${remaining} pasangan lagi.`,
        });
      }
    }
  };

  const handleUndoPair = () => {
    if (pairHistory.length === 0) return;
    const lastPairId = pairHistory[pairHistory.length - 1];
    setGridState((prev) => ({
      ...prev,
      cells: prev.cells.map((cell) =>
        cell.pairId === lastPairId ? { ...cell, pairId: undefined } : cell,
      ),
    }));
    setPairHistory((prev) => prev.slice(0, -1));
    setStage('zero_pairs');
    setFeedback(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const tile = event.active.data.current?.tileType as TileType | undefined;
    if (tile) {
      setActiveDragTile(tile);
      setSelectedTrayTile(tile);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const orientation = event.over?.data.current?.orientation as
      | TileOrientation
      | undefined;
    setDragHoverOrientation(orientation ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const tile = event.active.data.current?.tileType as TileType | undefined;
    const overData = event.over?.data.current as
      | { rowIndex?: number; colIndex?: number }
      | undefined;

    if (
      stage === 'building' &&
      tile &&
      overData?.rowIndex !== undefined &&
      overData?.colIndex !== undefined
    ) {
      const r = overData.rowIndex;
      const c = overData.colIndex;
      setFeedback(null);
      setGridState((prev) => ({
        ...prev,
        cells: prev.cells.map((cell) =>
          cell.rowIndex === r && cell.colIndex === c
            ? { ...cell, placedTile: tile }
            : cell,
        ),
      }));
    }

    setActiveDragTile(null);
    setDragHoverOrientation(null);
  };

  const handleCheckBoard = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const res = validateGrid(
      gridState.cells,
      gridState.topAxis,
      gridState.leftAxis,
    );
    setFeedback(res);
    recordAttempt(problem.id, problem.level, res.code);

    if (res.code === 'CORRECT') {
      setSelectedTrayTile(null);
      const remainingPairs = countRemainingZeroPairs(gridState.cells);
      if (remainingPairs > 0) {
        setStage('zero_pairs');
        setFeedback({
          code: 'CORRECT',
          message: `Papan benar! Terdapat ${remainingPairs} pasangan nol (+x dan −x). Ketuk pasangan berlawanan untuk meniadakannya.`,
        });
      } else {
        setStage('equation');
        setFeedback({
          code: 'CORRECT',
          message:
            'Papan perkalian tepat! Sekarang susun bentuk aljabar akhir di panel kanan.',
        });
      }
    }
  };

  const handleCheckEquation = () => {
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    const res = validateEquation(terms, problem.expectedResult, gridState.cells);
    setFeedback(res);
    recordAttempt(problem.id, problem.level, res.code);

    if (res.code === 'CORRECT') {
      const stars = recordCompletion(
        problem.id,
        problem.level,
        nextAttempts,
        hintsRevealed,
      );
      setEarnedStars(stars);
      setStage('completed');
    }
  };

  const handleGoNext = () => {
    if (problemIdx + 1 < levelProblems.length) {
      handleSelectProblemIdx(problemIdx + 1);
      return;
    }
    if (selectedLevel < 4) {
      handleSelectLevel((selectedLevel + 1) as ExpansionProblem['level']);
    }
  };

  const remainingZeroPairs = countRemainingZeroPairs(gridState.cells);
  const levelInfo = LEVEL_METADATA[selectedLevel];
  const hasNextProblem = problemIdx + 1 < levelProblems.length || selectedLevel < 4;

  const neutralPrompt =
    stage === 'building'
      ? 'Pilih atau seret ubin dari baki ke papan. Ketuk sel terisi tanpa pilihan baki untuk menghapusnya.'
      : stage === 'zero_pairs'
        ? `Tahap Eliminasi: Ketuk sepasang ubin berlawanan tanda (${remainingZeroPairs} pasang tersisa).`
        : stage === 'equation'
          ? 'Hitung ubin tersisa di papan dan susun bentuk aljabar paling sederhana.'
          : 'Soal selesai! Lanjutkan ke soal berikutnya atau uji level lain.';

  return (
    <div className="space-y-4">
      {/* Selector Level & Soal (Demo-Friendly: Semua Level Terbuka) */}
      <section
        aria-label="Pemilih Level dan Soal"
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Pilih Level">
            {([1, 2, 3, 4] as const).map((lvl) => {
              const active = selectedLevel === lvl;
              const solvedCount = PROBLEMS.filter(
                (p) => p.level === lvl && progressByProblem[p.id],
              ).length;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleSelectLevel(lvl)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:text-sm ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>Lv.{lvl}</span>
                  <span className="hidden md:inline font-medium">
                    {LEVEL_METADATA[lvl].name}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] tabular-nums ${
                      active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {solvedCount}/3
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5" role="group" aria-label="Pilih Nomor Soal">
            {levelProblems.map((item, idx) => {
              const saved = progressByProblem[item.id];
              const active = idx === problemIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectProblemIdx(idx)}
                  aria-pressed={active}
                  className={`inline-flex min-h-10 items-center gap-1 rounded-lg px-2.5 text-xs font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {saved && <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />}
                  <span>Soal {idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Level {selectedLevel}: {levelInfo.name} — {problem.title}
            </p>
            <h1 className="font-display mt-0.5 flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
              <span>Susun luas untuk</span>
              <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-blue-900">
                <ProductExpr factor1={problem.factor1} factor2={problem.factor2} />
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setHintsRevealed((prev) =>
                  Math.min(problem.hints.length, prev + 1),
                )
              }
              disabled={hintsRevealed >= problem.hints.length}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
            >
              <Lightbulb className="h-4 w-4 text-amber-700" aria-hidden="true" />
              <span>Bantuan ({hintsRevealed}/{problem.hints.length})</span>
            </button>
            <button
              type="button"
              onClick={() => loadProblem(problem)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {hintsRevealed > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-950">
            <p className="font-bold">Petunjuk:</p>
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {problem.hints.slice(0, hintsRevealed).map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Workspace 2 Kolom (Desktop) / Bertumpuk (Mobile) */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Papan Perkalian */}
          <div className="space-y-3 lg:col-span-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Papan Perkalian — Tahap:{' '}
                <span className="text-blue-800">
                  {stage === 'building'
                    ? '1. Susun Ubin'
                    : stage === 'zero_pairs'
                      ? '2. Eliminasi Zero Pairs'
                      : stage === 'equation'
                        ? '3. Tulis Persamaan'
                        : 'Selesai'}
                </span>
              </span>
            </div>

            <AreaGridMat
              topAxis={gridState.topAxis}
              leftAxis={gridState.leftAxis}
              cells={gridState.cells}
              stage={stage}
              showQuadrantGuides={problem.showQuadrantGuides}
              selectedTrayTile={selectedTrayTile}
              selectedZeroPairCell={selectedZeroPairCell}
              feedback={feedback}
              onCellClick={handlePlaceOrToggleCell}
              onUnitPxChange={setUnitPx}
            />

            <FeedbackBanner feedback={feedback} neutralPrompt={neutralPrompt} />
          </div>

          {/* Baki Ubin & Kontrol Langkah */}
          <div className="space-y-3 lg:col-span-5">
            <TileTray
              selectedTile={selectedTrayTile}
              onSelectTile={setSelectedTrayTile}
              stage={stage}
            />

            {/* Aksi Tahap 1 & Tahap 2 */}
            {stage === 'building' && (
              <button
                type="button"
                onClick={handleCheckBoard}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white shadow-xs hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Cek Papan Perkalian</span>
              </button>
            )}

            {stage === 'zero_pairs' && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-700" aria-hidden="true" />
                    <span className="text-xs font-bold uppercase tracking-wide text-amber-950">
                      Eliminasi Pasangan Nol ({remainingZeroPairs} tersisa)
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={pairHistory.length === 0}
                    onClick={handleUndoPair}
                    className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-amber-400 bg-white px-2.5 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                  >
                    <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Undo Pair</span>
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-amber-900">
                  Ketuk satu ubin positif lalu ketuk pasangan ubin negatifnya yang berukuran sama hingga tersisa 0 pasangan.
                </p>
              </div>
            )}

            {/* Tahap 3: Term Builder */}
            <TermBuilderInput
              terms={terms}
              disabled={stage !== 'equation'}
              onChange={setTerms}
              onSubmit={handleCheckEquation}
            />

            {/* Tahap 4: Completion Card */}
            {stage === 'completed' && earnedStars && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3.5">
                <div>
                  <div className="flex items-center gap-1" aria-label={`Meraih ${earnedStars} dari 3 bintang`}>
                    {[1, 2, 3].map((n) => (
                      <Star
                        key={n}
                        className={`h-5 w-5 ${
                          n <= earnedStars
                            ? 'fill-amber-400 text-amber-600'
                            : 'text-slate-300'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-emerald-950">
                    Soal dituntaskan dalam {attempts} pengecekan.
                  </p>
                </div>

                {hasNextProblem && (
                  <button
                    type="button"
                    onClick={handleGoNext}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 text-xs font-bold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                  >
                    <span>Soal Berikutnya</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeDragTile ? (
            <div className="pointer-events-none opacity-95 shadow-xl">
              <TileItem
                type={activeDragTile}
                orientation={dragHoverOrientation ?? 'horizontal'}
                unitPx={unitPx}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
