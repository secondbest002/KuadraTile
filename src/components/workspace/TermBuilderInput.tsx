import { Minus, Plus, Trash2 } from 'lucide-react';
import type { AlgebraicTermInput } from '../../types/algebra';

interface TermBuilderInputProps {
  terms: AlgebraicTermInput[];
  disabled: boolean;
  onChange: (terms: AlgebraicTermInput[]) => void;
  onSubmit: () => void;
}

const DEGREE_OPTIONS: Array<{ degree: AlgebraicTermInput['degree']; label: string }> = [
  { degree: 3, label: 'x³' },
  { degree: 2, label: 'x²' },
  { degree: 1, label: 'x' },
  { degree: 0, label: '1 (konst.)' },
];

export function TermBuilderInput({
  terms,
  disabled,
  onChange,
  onSubmit,
}: TermBuilderInputProps) {
  const updateTerm = (id: string, patch: Partial<AlgebraicTermInput>) => {
    onChange(terms.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const addTerm = () => {
    const usedDegrees = new Set(terms.map((t) => t.degree));
    const fallbackDegree: AlgebraicTermInput['degree'] = !usedDegrees.has(1)
      ? 1
      : !usedDegrees.has(0)
        ? 0
        : 2;

    onChange([
      ...terms,
      {
        id: `term-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        coefficient: 1,
        degree: fallbackDegree,
      },
    ]);
  };

  const removeTerm = (id: string) => {
    if (terms.length <= 1) return;
    onChange(terms.filter((t) => t.id !== id));
  };

  const renderPreview = () => {
    const active = terms.filter((t) => t.coefficient !== 0);
    if (active.length === 0) return '0';
    return active.map((term, idx) => {
      const abs = Math.abs(term.coefficient);
      const sign = idx === 0 ? (term.coefficient < 0 ? '−' : '') : term.coefficient < 0 ? ' − ' : ' + ';
      const mag = term.degree === 0 ? String(abs) : abs === 1 ? '' : String(abs);
      return (
        <span key={term.id}>
          {sign}
          {mag}
          {term.degree >= 1 && <var className="italic font-serif">x</var>}
          {term.degree === 2 && <sup>2</sup>}
          {term.degree === 3 && <sup>3</sup>}
        </span>
      );
    });
  };

  return (
    <section
      aria-labelledby="term-builder-heading"
      className={`rounded-xl border p-3.5 ${
        disabled ? 'border-slate-200 bg-slate-100/70 opacity-60' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h2 id="term-builder-heading" className="text-xs font-bold uppercase tracking-wide text-slate-700">
          Susun Bentuk Aljabar Akhir
        </h2>
        <button
          type="button"
          disabled={disabled}
          onClick={addTerm}
          className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Tambah Suku
        </button>
      </div>

      <div className="space-y-2">
        {terms.map((term, index) => (
          <div
            key={term.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
          >
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateTerm(term.id, { coefficient: term.coefficient - 1 })
                }
                aria-label={`Kurangi koefisien suku ke-${index + 1}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Minus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>

              <label htmlFor={`coeff-${term.id}`} className="visually-hidden">
                Koefisien suku ke-{index + 1}
              </label>
              <input
                id={`coeff-${term.id}`}
                type="number"
                disabled={disabled}
                value={term.coefficient}
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value, 10);
                  updateTerm(term.id, {
                    coefficient: Number.isNaN(val) ? 0 : val,
                  });
                }}
                className="h-9 w-14 rounded-md border border-slate-300 bg-white text-center text-sm font-bold tabular-nums text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />

              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateTerm(term.id, { coefficient: term.coefficient + 1 })
                }
                aria-label={`Tambah koefisien suku ke-${index + 1}`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex items-center gap-1" role="group" aria-label={`Pilih pangkat suku ke-${index + 1}`}>
              {DEGREE_OPTIONS.map((opt) => (
                <button
                  key={opt.degree}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateTerm(term.id, { degree: opt.degree })}
                  aria-pressed={term.degree === opt.degree}
                  className={`min-h-9 rounded-md px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    term.degree === opt.degree
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {terms.length > 1 && (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeTerm(term.id)}
                  aria-label={`Hapus suku ke-${index + 1}`}
                  className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="text-xs text-slate-600">
          Pratinjau:{' '}
          <span className="ml-1 text-base font-bold text-slate-900 tabular-nums">
            {renderPreview()}
          </span>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={onSubmit}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          Cek Jawaban
        </button>
      </div>
    </section>
  );
}
