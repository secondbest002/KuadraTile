import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  getAxisUnitDegree,
  getAxisUnitLabel,
  getTileDegree,
  getTileLabel,
} from '../../engine/gridBuilder';
import { computeTileUnitPx, RATIO_X_TO_ONE } from '../../utils/responsiveScale';
import type {
  AxisUnit,
  GridCellState,
  MisconceptionFeedback,
  TileOrientation,
  TileType,
  WorkspaceStage,
} from '../../types/algebra';
import { TileItem } from './TileItem';

interface AreaGridMatProps {
  topAxis: AxisUnit[];
  leftAxis: AxisUnit[];
  cells: GridCellState[];
  stage?: WorkspaceStage;
  readOnly?: boolean;
  splitView?: boolean;
  showQuadrantGuides?: boolean;
  selectedTrayTile?: TileType | null;
  selectedZeroPairCell?: { row: number; col: number } | null;
  feedback?: MisconceptionFeedback | null;
  highlightedDegree?: 0 | 1 | 2 | null;
  onCellClick?: (row: number, col: number) => void;
  onHoverDegree?: (degree: 0 | 1 | 2 | null) => void;
  onUnitPxChange?: (unitPx: number) => void;
}

function AxisBadge({
  unit,
  width,
  height,
  isHighlighted,
}: {
  unit: AxisUnit;
  width: number;
  height: number;
  isHighlighted: boolean;
}) {
  const isNeg = unit === 'neg_x' || unit === 'neg_one';

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`flex items-center justify-center rounded-md border text-xs font-bold select-none ${
        isHighlighted
          ? 'border-amber-600 bg-amber-100 text-amber-950 ring-2 ring-amber-500'
          : isNeg
            ? 'border-rose-300 bg-rose-50 text-rose-900'
            : 'border-slate-300 bg-slate-100 text-slate-800'
      }`}
    >
      {getAxisUnitLabel(unit)}
    </div>
  );
}

function GridCellSlot({
  cell,
  width,
  height,
  baseUnitPx,
  stage,
  readOnly,
  isHighlighted,
  isSelectedZeroPair,
  isDimmed,
  hasSelectedTray,
  onClick,
  onHoverDegree,
}: {
  cell: GridCellState;
  width: number;
  height: number;
  baseUnitPx: number;
  stage: WorkspaceStage;
  readOnly: boolean;
  isHighlighted: boolean;
  isSelectedZeroPair: boolean;
  isDimmed: boolean;
  hasSelectedTray: boolean;
  onClick?: () => void;
  onHoverDegree?: (degree: 0 | 1 | 2 | null) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${cell.rowIndex}-${cell.colIndex}`,
    data: { rowIndex: cell.rowIndex, colIndex: cell.colIndex, orientation: cell.orientation },
    disabled: readOnly || stage !== 'building',
  });

  const isEliminated = Boolean(cell.pairId);
  const expectedDegree = getTileDegree(cell.expectedTile);

  const ariaLabel = cell.placedTile
    ? `Sel baris ${cell.rowIndex + 1} kolom ${cell.colIndex + 1}, berisi ${getTileLabel(cell.placedTile)}${isEliminated ? ', telah dieliminasi' : ''}`
    : `Sel kosong baris ${cell.rowIndex + 1} kolom ${cell.colIndex + 1}`;

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHoverDegree?.(expectedDegree)}
      onMouseLeave={() => onHoverDegree?.(null)}
      onFocus={() => onHoverDegree?.(expectedDegree)}
      onBlur={() => onHoverDegree?.(null)}
      disabled={readOnly && !onHoverDegree}
      aria-label={ariaLabel}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative flex items-center justify-center rounded-[6px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
        cell.placedTile
          ? 'bg-transparent'
          : isOver
            ? 'border-2 border-blue-600 bg-blue-100/70'
            : hasSelectedTray && stage === 'building' && !readOnly
              ? 'border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-100/60'
              : 'border-2 border-dashed border-slate-300 bg-white/80 hover:border-slate-400'
      } ${isHighlighted && !cell.placedTile ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-500' : ''}`}
    >
      {cell.placedTile && (
        <TileItem
          type={cell.placedTile}
          orientation={cell.orientation as TileOrientation}
          unitPx={baseUnitPx}
          isEliminated={isEliminated}
          isHighlighted={isHighlighted}
          isSelected={isSelectedZeroPair}
          isDimmed={isDimmed}
        />
      )}
    </button>
  );
}

export function AreaGridMat({
  topAxis,
  leftAxis,
  cells,
  stage = 'building',
  readOnly = false,
  splitView = false,
  showQuadrantGuides = false,
  selectedTrayTile = null,
  selectedZeroPairCell = null,
  feedback = null,
  highlightedDegree = null,
  onCellClick,
  onHoverDegree,
  onUnitPxChange,
}: AreaGridMatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unitPx, setUnitPx] = useState(28);

  const countXCols = topAxis.filter((u) => getAxisUnitDegree(u) === 1).length;
  const countOneCols = topAxis.length - countXCols;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const nextU = computeTileUnitPx(el.clientWidth, countXCols, countOneCols);
      setUnitPx(nextU);
      onUnitPxChange?.(nextU);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [countXCols, countOneCols, onUnitPxChange]);

  const longSide = Math.round(unitPx * RATIO_X_TO_ONE);
  const leftAxisWidth = leftAxis.some((u) => getAxisUnitDegree(u) === 1) ? longSide : unitPx;
  const topAxisHeight = 32;

  const colWidths = topAxis.map((u) => (getAxisUnitDegree(u) === 1 ? longSide : unitPx));
  const rowHeights = leftAxis.map((u) => (getAxisUnitDegree(u) === 1 ? longSide : unitPx));

  const highlightedSet = new Set(
    (feedback?.highlightCells ?? []).map((c) => `${c.row}-${c.col}`),
  );

  return (
    <div ref={containerRef} className="w-full">
      <div className="mx-auto flex w-fit flex-col items-start rounded-xl border border-slate-200 bg-white/90 p-2.5 shadow-xs sm:p-3.5">
        {/* Sumbu Atas */}
        <div className="mb-1.5 flex items-center gap-1">
          <div
            style={{ width: `${leftAxisWidth}px`, height: `${topAxisHeight}px` }}
            className="flex items-center justify-center rounded-md bg-slate-900 text-xs font-bold text-white"
            aria-hidden="true"
          >
            ×
          </div>
          {topAxis.map((unit, colIdx) => (
            <div
              key={`top-${colIdx}`}
              className={splitView && colIdx === 1 ? 'ml-2' : ''}
            >
              <AxisBadge
                unit={unit}
                width={colWidths[colIdx]}
                height={topAxisHeight}
                isHighlighted={Boolean(feedback?.highlightAxes?.top?.includes(colIdx))}
              />
            </div>
          ))}
        </div>

        {/* Baris Grid + Sumbu Kiri */}
        <div className="relative flex flex-col gap-1">
          {leftAxis.map((rowUnit, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className={`flex items-center gap-1 ${
                splitView && rowIdx === 1
                  ? 'mt-2'
                  : showQuadrantGuides && rowIdx === 1
                    ? 'border-t-2 border-dashed border-slate-300 pt-1.5'
                    : ''
              }`}
            >
              <AxisBadge
                unit={rowUnit}
                width={leftAxisWidth}
                height={rowHeights[rowIdx]}
                isHighlighted={Boolean(feedback?.highlightAxes?.left?.includes(rowIdx))}
              />

              {topAxis.map((_, colIdx) => {
                const cell = cells.find(
                  (c) => c.rowIndex === rowIdx && c.colIndex === colIdx,
                );
                if (!cell) return null;

                const isHighlighted = highlightedSet.has(`${rowIdx}-${colIdx}`);
                const isSelectedZeroPair =
                  selectedZeroPairCell?.row === rowIdx &&
                  selectedZeroPairCell?.col === colIdx;
                const cellDegree = getTileDegree(cell.expectedTile);
                const isDimmed =
                  highlightedDegree !== null && cellDegree !== highlightedDegree;

                return (
                  <div
                    key={`cell-${rowIdx}-${colIdx}`}
                    className={
                      splitView && colIdx === 1
                        ? 'ml-2'
                        : showQuadrantGuides && colIdx === 1
                          ? 'border-l-2 border-dashed border-slate-300 pl-1.5'
                          : ''
                    }
                  >
                    <GridCellSlot
                      cell={cell}
                      width={colWidths[colIdx]}
                      height={rowHeights[rowIdx]}
                      baseUnitPx={unitPx}
                      stage={stage}
                      readOnly={readOnly}
                      isHighlighted={isHighlighted}
                      isSelectedZeroPair={isSelectedZeroPair}
                      isDimmed={isDimmed}
                      hasSelectedTray={selectedTrayTile !== null}
                      onClick={() => onCellClick?.(rowIdx, colIdx)}
                      onHoverDegree={onHoverDegree}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
