import { useId } from 'react';
import { getTileLabel } from '../../engine/gridBuilder';
import { RATIO_X_TO_ONE } from '../../utils/responsiveScale';
import type { TileOrientation, TileType } from '../../types/algebra';

interface TileItemProps {
  type: TileType;
  orientation?: TileOrientation;
  unitPx?: number;
  isEliminated?: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  className?: string;
}

const TILE_VISUAL_CONFIG: Record<
  TileType,
  {
    bg: string;
    border: string;
    isNegative: boolean;
    patternKind: 'none' | 'diagonal' | 'stripes' | 'dots';
  }
> = {
  x2: { bg: '#2563EB', border: '#1E40AF', isNegative: false, patternKind: 'none' },
  x: { bg: '#0D9488', border: '#115E59', isNegative: false, patternKind: 'none' },
  one: { bg: '#D97706', border: '#92400E', isNegative: false, patternKind: 'none' },
  neg_x2: { bg: '#DC2626', border: '#7F1D1D', isNegative: true, patternKind: 'diagonal' },
  neg_x: { bg: '#E11D48', border: '#881337', isNegative: true, patternKind: 'stripes' },
  neg_one: { bg: '#EA580C', border: '#7C2D12', isNegative: true, patternKind: 'dots' },
};

export function getTileDimensions(
  type: TileType,
  orientation: TileOrientation,
  unitPx: number,
): { width: number; height: number } {
  const longSide = Math.round(unitPx * RATIO_X_TO_ONE);
  if (type === 'x2' || type === 'neg_x2') {
    return { width: longSide, height: longSide };
  }
  if (type === 'one' || type === 'neg_one') {
    return { width: unitPx, height: unitPx };
  }
  if (orientation === 'vertical') {
    return { width: unitPx, height: longSide };
  }
  return { width: longSide, height: unitPx };
}

export function TileItem({
  type,
  orientation = 'square',
  unitPx = 28,
  isEliminated = false,
  isHighlighted = false,
  isSelected = false,
  isDimmed = false,
  className = '',
}: TileItemProps) {
  const rawId = useId();
  const patternId = `pat-${rawId.replace(/:/g, '')}`;
  const cfg = TILE_VISUAL_CONFIG[type];
  const { width, height } = getTileDimensions(type, orientation, unitPx);
  const label = getTileLabel(type);
  const isTinyUnit = type === 'one' || type === 'neg_one';

  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`relative select-none overflow-hidden rounded-[5px] ${
        isEliminated ? 'animate-zero-pair-eliminated pointer-events-none' : ''
      } ${isSelected ? 'ring-3 ring-slate-900 ring-offset-2' : ''} ${
        isHighlighted ? 'ring-3 ring-amber-400 ring-offset-1' : ''
      } ${isDimmed ? 'opacity-35' : 'opacity-100'} motion-safe:transition-opacity motion-safe:duration-150 ${className}`}
    >
      <svg
        aria-hidden="true"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block h-full w-full"
      >
        <defs>
          {cfg.patternKind === 'diagonal' && (
            <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,255,255,0.34)" strokeWidth="2.5" />
            </pattern>
          )}
          {cfg.patternKind === 'stripes' && (
            <pattern id={patternId} width="7" height="7" patternUnits="userSpaceOnUse">
              <line x1="0" y1="3.5" x2="7" y2="3.5" stroke="rgba(255,255,255,0.34)" strokeWidth="2" />
            </pattern>
          )}
          {cfg.patternKind === 'dots' && (
            <pattern id={patternId} width="7" height="7" patternUnits="userSpaceOnUse">
              <circle cx="3.5" cy="3.5" r="1.4" fill="rgba(255,255,255,0.42)" />
            </pattern>
          )}
        </defs>

        <rect x="0" y="0" width={width} height={height} rx="4" fill={cfg.bg} />
        {cfg.patternKind !== 'none' && (
          <rect x="0" y="0" width={width} height={height} rx="4" fill={`url(#${patternId})`} />
        )}

        {/* Tepi solid untuk positif, garis putus/ganda untuk negatif */}
        <rect
          x="1"
          y="1"
          width={Math.max(1, width - 2)}
          height={Math.max(1, height - 2)}
          rx="3.5"
          fill="none"
          stroke={cfg.border}
          strokeWidth={type === 'neg_one' ? '2' : '1.75'}
          strokeDasharray={type === 'neg_x2' || type === 'neg_x' ? '4 2.5' : undefined}
        />
        {type === 'neg_one' && width >= 20 && (
          <rect
            x="4"
            y="4"
            width={Math.max(1, width - 8)}
            height={Math.max(1, height - 8)}
            rx="2"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1"
          />
        )}
      </svg>

      <span
        className={`pointer-events-none absolute inset-0 flex items-center justify-center font-bold tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.75)] ${
          isTinyUnit ? 'text-[11px] leading-none' : 'text-xs sm:text-sm'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
