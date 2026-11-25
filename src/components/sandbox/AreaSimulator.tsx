import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, Grid, SplitSquareHorizontal } from 'lucide-react';
import { DISCOVERY_MISSIONS } from '../../data/levels';
import { buildInitialGrid } from '../../engine/gridBuilder';
import { useProgressStore } from '../../store/useProgressStore';
import type { NonZeroConstant } from '../../types/algebra';
import { PolynomialExpr, ProductExpr } from '../common/MathExpr';
import { AreaGridMat } from '../workspace/AreaGridMat';

const CONSTANT_OPTIONS: NonZeroConstant[] = [-3, -2, -1, 1, 2, 3];

interface AreaSimulatorProps {
  onGoToPractice: () => void;
}

export function AreaSimulator({ onGoToPractice }: AreaSimulatorProps) {
  const [a, setA] = useState<NonZeroConstant>(2);
  const [b, setB] = useState<NonZeroConstant>(1);
  const [splitView, setSplitView] = useState(false);
  const [highlightedDegree, setHighlightedDegree] = useState<0 | 1 | 2 | null>(null);

  const completedMissions = useProgressStore((s) => s.completedMissions);
  const completeMission = useProgressStore((s) => s.completeMission);

  const factor1 = useMemo(() => ({ coeffX: 1 as const, constant: a }), [a]);
  const factor2 = useMemo(() => ({ coeffX: 1 as const, constant: b }), [b]);

  const { topAxis, leftAxis, cells } = useMemo(
    () => buildInitialGrid(factor1, factor2, true),
    [factor1, factor2],
  );

  // Otomatis tandai misi selesai jika kombinasi (a, b) sesuai target
  useEffect(() => {
    for (const mission of DISCOVERY_MISSIONS) {
      if (mission.targetA === a && mission.targetB === b) {
        completeMission(mission.id);
      }
    }
  }, [a, b, completeMission]);

  const sumMiddle = a + b;
  const prodConst = a * b;

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Lab Simulasi Interaktif (Guided Discovery)
          </p>
          <h1 className="font-display mt-0.5 flex flex-wrap items-center gap-2 text-lg font-bold text-slate-900 sm:text-xl">
            <span>Eksplorasi Bentuk</span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-blue-900">
              <ProductExpr factor1={factor1} factor2={factor2} />
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            aria-pressed={splitView}
            onClick={() => setSplitView((v) => !v)}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              splitView
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
            }`}
          >
            {splitView ? (
              <SplitSquareHorizontal className="h-4 w-4 text-blue-700" aria-hidden="true" />
            ) : (
              <Grid className="h-4 w-4 text-slate-600" aria-hidden="true" />
            )}
            <span>{splitView ? 'Satukan Kuadran' : 'Pisah 4 Kuadran'}</span>
          </button>

          <button
            type="button"
            onClick={onGoToPractice}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <span>Masuk Arena Latihan</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Visual Papan Ubin + Rumus Terhubung */}
        <div className="space-y-3 lg:col-span-7">
          <AreaGridMat
            topAxis={topAxis}
            leftAxis={leftAxis}
            cells={cells}
            readOnly
            splitView={splitView}
            showQuadrantGuides={!splitView}
            highlightedDegree={highlightedDegree}
            onHoverDegree={setHighlightedDegree}
          />

          {/* Panel Color-Link Persamaan */}
          <section
            aria-label="Persamaan hasil ekspansi terhubung warna"
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="mb-2 text-xs font-semibold text-slate-600">
              Arahkan kursor atau ketuk suku di bawah untuk menyorot ubin yang bersesuaian:
            </p>
            <div className="flex flex-wrap items-center gap-2 text-base font-bold sm:text-lg">
              <ProductExpr factor1={factor1} factor2={factor2} className="text-slate-900" />
              <span className="text-slate-500">=</span>

              <button
                type="button"
                onMouseEnter={() => setHighlightedDegree(2)}
                onMouseLeave={() => setHighlightedDegree(null)}
                onFocus={() => setHighlightedDegree(2)}
                onBlur={() => setHighlightedDegree(null)}
                onClick={() => setHighlightedDegree((d) => (d === 2 ? null : 2))}
                className={`rounded-md border px-2 py-1 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  highlightedDegree === 2
                    ? 'border-blue-600 bg-blue-100 text-blue-950'
                    : 'border-blue-200 bg-blue-50 text-blue-800'
                }`}
              >
                <var className="italic font-serif">x</var>
                <sup>2</sup>
              </button>

              <span className="text-slate-400">+</span>

              <button
                type="button"
                onMouseEnter={() => setHighlightedDegree(1)}
                onMouseLeave={() => setHighlightedDegree(null)}
                onFocus={() => setHighlightedDegree(1)}
                onBlur={() => setHighlightedDegree(null)}
                onClick={() => setHighlightedDegree((d) => (d === 1 ? null : 1))}
                className={`rounded-md border px-2 py-1 text-sm font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                  highlightedDegree === 1
                    ? 'border-teal-600 bg-teal-100 text-teal-950'
                    : 'border-teal-200 bg-teal-50 text-teal-900'
                }`}
              >
                ({a < 0 ? `−${Math.abs(a)}` : `+${a}`}<var className="italic font-serif">x</var>{' '}
                {b < 0 ? `− ${Math.abs(b)}` : `+ ${b}`}<var className="italic font-serif">x</var>)
              </button>

              <span className="text-slate-400">+</span>

              <button
                type="button"
                onMouseEnter={() => setHighlightedDegree(0)}
                onMouseLeave={() => setHighlightedDegree(null)}
                onFocus={() => setHighlightedDegree(0)}
                onBlur={() => setHighlightedDegree(null)}
                onClick={() => setHighlightedDegree((d) => (d === 0 ? null : 0))}
                className={`rounded-md border px-2 py-1 text-sm font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 ${
                  highlightedDegree === 0
                    ? 'border-amber-600 bg-amber-100 text-amber-950'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                ({prodConst < 0 ? `−${Math.abs(prodConst)}` : `+${prodConst}`})
              </button>

              <span className="text-slate-500">=</span>
              <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-white">
                <PolynomialExpr coeffs={{ A: 1, B: sumMiddle, C: prodConst }} />
              </span>
            </div>
          </section>
        </div>

        {/* Kontrol Parameter a, b & 3 Kartu Misi Penemuan */}
        <div className="space-y-3 lg:col-span-5">
          <section
            aria-labelledby="param-heading"
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <h2 id="param-heading" className="text-xs font-bold uppercase tracking-wide text-slate-700">
              Atur Nilai Konstanta Faktor
            </h2>

            <div className="mt-3 space-y-3">
              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-700">
                  Faktor 1 — Sumbu Atas (<var className="italic font-serif">x</var> + a):{' '}
                  <span className="font-bold text-slate-950 tabular-nums">
                    a = {a < 0 ? `−${Math.abs(a)}` : `+${a}`}
                  </span>
                </p>
                <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Pilih nilai a">
                  {CONSTANT_OPTIONS.map((val) => (
                    <button
                      key={`a-${val}`}
                      type="button"
                      onClick={() => setA(val)}
                      aria-pressed={a === val}
                      className={`min-h-10 rounded-lg text-xs font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        a === val
                          ? 'bg-blue-700 text-white'
                          : val < 0
                            ? 'border border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100'
                            : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {val < 0 ? `−${Math.abs(val)}` : `+${val}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold text-slate-700">
                  Faktor 2 — Sumbu Kiri (<var className="italic font-serif">x</var> + b):{' '}
                  <span className="font-bold text-slate-950 tabular-nums">
                    b = {b < 0 ? `−${Math.abs(b)}` : `+${b}`}
                  </span>
                </p>
                <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Pilih nilai b">
                  {CONSTANT_OPTIONS.map((val) => (
                    <button
                      key={`b-${val}`}
                      type="button"
                      onClick={() => setB(val)}
                      aria-pressed={b === val}
                      className={`min-h-10 rounded-lg text-xs font-bold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        b === val
                          ? 'bg-blue-700 text-white'
                          : val < 0
                            ? 'border border-rose-200 bg-rose-50 text-rose-900 hover:bg-rose-100'
                            : 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      {val < 0 ? `−${Math.abs(val)}` : `+${val}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="missions-heading"
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <h2 id="missions-heading" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
                <Compass className="h-4 w-4 text-blue-700" aria-hidden="true" />
                <span>3 Kartu Misi Penemuan</span>
              </h2>
              <span className="text-xs font-bold tabular-nums text-slate-600">
                {completedMissions.length}/3 ditemukan
              </span>
            </div>

            <div className="space-y-2.5">
              {DISCOVERY_MISSIONS.map((mission) => {
                const done = completedMissions.includes(mission.id);
                const isCurrent = a === mission.targetA && b === mission.targetB;

                return (
                  <div
                    key={mission.id}
                    className={`rounded-xl border p-3 text-xs ${
                      isCurrent
                        ? 'border-emerald-300 bg-emerald-50/70'
                        : done
                          ? 'border-slate-200 bg-slate-50'
                          : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">{mission.title}</p>
                      {done && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-emerald-700"
                          aria-label="Misi selesai"
                        />
                      )}
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-700">
                      {mission.prompt}
                    </p>

                    {done ? (
                      <p className="mt-2 rounded-lg bg-white/90 p-2 font-medium text-emerald-950 border border-emerald-200">
                        {mission.insight}
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setA(mission.targetA);
                          setB(mission.targetB);
                        }}
                        className="mt-2 inline-flex min-h-8 items-center rounded-md border border-slate-300 bg-slate-50 px-2.5 text-[11px] font-semibold text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        Terapkan (a = {mission.targetA < 0 ? `−${Math.abs(mission.targetA)}` : `+${mission.targetA}`}, b ={' '}
                        {mission.targetB < 0 ? `−${Math.abs(mission.targetB)}` : `+${mission.targetB}`})
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
