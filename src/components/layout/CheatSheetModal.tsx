import { useEffect, useRef } from 'react';
import { ArrowRightLeft, Layers, Sparkles, X } from 'lucide-react';
import { TileItem } from '../workspace/TileItem';

interface CheatSheetModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheatSheetModal({ open, onClose }: CheatSheetModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Sinkronkan state React saat dialog ditutup lewat Esc, backdrop, atau form method="dialog"
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('close', handleClose);

    // Fallback light-dismiss untuk browser tanpa dukungan closedby (mis. Safari)
    let cleanupFallback: (() => void) | undefined;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      let pressedOutside = false;
      const isOutside = (e: PointerEvent) => {
        const rect = dialog.getBoundingClientRect();
        return (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        );
      };
      const onPointerDown = (e: PointerEvent) => {
        pressedOutside = isOutside(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        if (pressedOutside && isOutside(e)) {
          dialog.close();
        }
        pressedOutside = false;
      };
      dialog.addEventListener('pointerdown', onPointerDown);
      dialog.addEventListener('pointerup', onPointerUp);
      cleanupFallback = () => {
        dialog.removeEventListener('pointerdown', onPointerDown);
        dialog.removeEventListener('pointerup', onPointerUp);
      };
    }

    return () => {
      dialog.removeEventListener('close', handleClose);
      cleanupFallback?.();
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      aria-labelledby="cheatsheet-title"
      className="m-auto max-h-[88vh] w-[min(94vw,44rem)] rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h1 id="cheatsheet-title" className="font-display text-lg font-bold text-slate-900">
            Kamus Mini Ubin & Jembatan Konsep
          </h1>
          <p className="text-xs text-slate-600">
            Panduan cepat dimensi ubin, tanda negatif, dan pasangan nol.
          </p>
        </div>
        <form method="dialog">
          <button
            type="submit"
            aria-label="Tutup Kamus Ubin"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </form>
      </div>

      <div className="max-h-[calc(88vh-4.5rem)] space-y-5 overflow-y-auto px-5 py-5 text-sm">
        <section>
          <h2 className="mb-2.5 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-slate-700">
            <Layers className="h-4 w-4 text-blue-700" aria-hidden="true" />
            1. Mengenal 6 Jenis Ubin Aljabar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                Ubin Positif (Tepi Solid)
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="x2" orientation="square" unitPx={18} />
                  <span className="text-[11px] font-medium text-slate-700">Sisi x × x</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="x" orientation="horizontal" unitPx={18} />
                  <span className="text-[11px] font-medium text-slate-700">Sisi x × 1</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="one" orientation="square" unitPx={22} />
                  <span className="text-[11px] font-medium text-slate-700">Sisi 1 × 1</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-rose-900">
                Ubin Negatif (Arsiran & Garis Putus)
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="neg_x2" orientation="square" unitPx={18} />
                  <span className="text-[11px] font-medium text-slate-700">Arsir Diagonal</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="neg_x" orientation="horizontal" unitPx={18} />
                  <span className="text-[11px] font-medium text-slate-700">Garis Sejajar</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TileItem type="neg_one" orientation="square" unitPx={22} />
                  <span className="text-[11px] font-medium text-slate-700">Pola Titik</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-slate-600">
            <strong>Mengapa panjang x bukan kelipatan bulat dari 1?</strong> Rasio sisi x sengaja dibuat{' '}
            <span className="font-semibold text-slate-900">3,43 : 1</span> agar kamu tidak keliru menganggap{' '}
            <var className="italic font-serif">x</var> selalu bernilai 3.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-slate-900">
            <ArrowRightLeft className="h-4 w-4 text-blue-700" aria-hidden="true" />
            2. Jembatan Konsep: Mengapa Ubin Bisa Negatif?
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">
            Pada bilangan positif, papan mewakili <strong>luas kebun nyata</strong>. Saat memasuki tanda negatif, papan
            berevolusi menjadi <strong>Tabel Perkalian Ubin Aljabar Bertanda</strong>: warna merah berarsir mewakili
            invers/pengurangan, sehingga berlaku aturan tanda:
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className="rounded-lg border border-slate-200 bg-white py-2 text-slate-800">
              (+) × (+) = (+)
            </div>
            <div className="rounded-lg border border-rose-200 bg-white py-2 text-rose-800">
              (+) × (−) = (−)
            </div>
            <div className="rounded-lg border border-emerald-200 bg-white py-2 text-emerald-800">
              (−) × (−) = (+)
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
          <h2 className="mb-1.5 flex items-center gap-2 font-display text-sm font-bold text-amber-950">
            <Sparkles className="h-4 w-4 text-amber-700" aria-hidden="true" />
            3. Aturan Emas Pasangan Nol (Zero Pairs)
          </h2>
          <p className="text-xs leading-relaxed text-amber-950">
            Jika di papan terdapat satu ubin positif dan satu ubin negatif yang <strong>ukurannya sama</strong>{' '}
            (misalnya <span className="font-bold text-teal-800">+x</span> dan{' '}
            <span className="font-bold text-rose-800">−x</span>), keduanya saling meniadakan karena{' '}
            <span className="font-semibold">+x + (−x) = 0</span>.
          </p>
        </section>
      </div>
    </dialog>
  );
}
