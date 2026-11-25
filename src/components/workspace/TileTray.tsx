import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { getTileLabel } from '../../engine/gridBuilder';
import type { TileType, WorkspaceStage } from '../../types/algebra';
import { TileItem } from './TileItem';

interface TileTrayProps {
  selectedTile: TileType | null;
  onSelectTile: (tile: TileType | null) => void;
  stage: WorkspaceStage;
}

const TRAY_TILES: Array<{ type: TileType; desc: string }> = [
  { type: 'x2', desc: 'Persegi positif x kuadrat' },
  { type: 'x', desc: 'Batang positif x (otomatis mendatar/tegak)' },
  { type: 'one', desc: 'Satuan positif 1' },
  { type: 'neg_x2', desc: 'Persegi negatif x kuadrat' },
  { type: 'neg_x', desc: 'Batang negatif x (otomatis mendatar/tegak)' },
  { type: 'neg_one', desc: 'Satuan negatif 1' },
];

function DraggableTrayButton({
  type,
  desc,
  isSelected,
  disabled,
  onSelect,
}: {
  type: TileType;
  desc: string;
  isSelected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-${type}`,
    data: { tileType: type },
    disabled,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      disabled={disabled}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      aria-pressed={isSelected || attributes['aria-pressed']}
      aria-label={`Ubin ${getTileLabel(type)}: ${desc}. Ketuk atau seret ke papan.`}
      className={`group relative flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-xl border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 touch-none ${
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-100 opacity-50'
          : isSelected
            ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-600'
            : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
      } ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex h-11 items-center justify-center">
        <TileItem
          type={type}
          orientation={type === 'x' || type === 'neg_x' ? 'horizontal' : 'square'}
          unitPx={type === 'x2' || type === 'neg_x2' ? 12 : type === 'x' || type === 'neg_x' ? 16 : 26}
        />
      </div>
      <span className="text-[11px] font-semibold text-slate-700">
        {getTileLabel(type)}
      </span>
      {isSelected && (
        <span className="absolute right-1.5 top-1.5 rounded bg-blue-700 px-1 py-0.5 text-[9px] font-bold uppercase text-white">
          Aktif
        </span>
      )}
    </button>
  );
}

export function TileTray({ selectedTile, onSelectTile, stage }: TileTrayProps) {
  const disabled = stage !== 'building';

  return (
    <section aria-labelledby="tray-heading" className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 id="tray-heading" className="text-xs font-bold uppercase tracking-wide text-slate-700">
          Baki Ubin (Seret atau Ketuk)
        </h2>
        {selectedTile && !disabled && (
          <button
            type="button"
            onClick={() => onSelectTile(null)}
            className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
          >
            Batal pilih
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TRAY_TILES.map((item) => (
          <DraggableTrayButton
            key={item.type}
            type={item.type}
            desc={item.desc}
            isSelected={selectedTile === item.type}
            disabled={disabled}
            onSelect={() =>
              onSelectTile(selectedTile === item.type ? null : item.type)
            }
          />
        ))}
      </div>
    </section>
  );
}
