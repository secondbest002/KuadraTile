import { AlertCircle, ArrowRight, RotateCcw, Star } from 'lucide-react';
import { DISCOVERY_MISSIONS, LEVEL_METADATA, PROBLEMS } from '../../data/levels';
import { useProgressStore } from '../../store/useProgressStore';
import type { MisconceptionCode } from '../../types/algebra';
import { ProductExpr } from '../common/MathExpr';

interface SessionSummaryProps {
  onGoToPractice: () => void;
}

const MISCONCEPTION_LABELS: Record<Exclude<MisconceptionCode, 'CORRECT'>, string> = {
  MISSING_MIDDLE_TERM: 'Lupa Suku Tengah (Freshman’s Dream)',
  SIGN_ERROR: 'Kesalahan Tanda Positif/Negatif',
  WRONG_TILE_SHAPE: 'Dimensi / Bentuk Ubin Keliru',
  UNELIMINATED_ZERO_PAIRS: 'Pasangan Nol Belum Dieliminasi',
  UNSIMPLIFIED_LIKE_TERMS: 'Suku Sejenis Belum Disatukan',
  UNLIKE_TERMS_COMBINED: 'Menggabungkan Suku Tak Sejenis (mis. 3x³ / 3x²)',
  SIMPLIFICATION_ERROR: 'Kesalahan Hitung Koefisien Akhir',
  INCOMPLETE_BOARD: 'Papan Belum Terisi Penuh',
};

export function SessionSummary({ onGoToPractice }: SessionSummaryProps) {
  const progressByProblem = useProgressStore((s) => s.progressByProblem);
  const diagnosticLogs = useProgressStore((s) => s.diagnosticLogs);
  const completedMissions = useProgressStore((s) => s.completedMissions);
  const resetDemo = useProgressStore((s) => s.resetDemo);

  const completedList = Object.values(progressByProblem);
  const totalStars = completedList.reduce((sum, item) => sum + item.stars, 0);
  const maxStars = PROBLEMS.length * 3;

  const misconceptionCounts = diagnosticLogs.reduce<Record<string, number>>(
    (acc, log) => {
      if (log.code !== 'CORRECT') {
        acc[log.code] = (acc[log.code] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );
  const misconceptionEntries = Object.entries(misconceptionCounts).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="space-y-4">
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Ringkasan Sesi & Diagnostik Miskonsepsi
          </p>
          <h1 className="font-display mt-0.5 text-lg font-bold text-slate-900 sm:text-xl">
            Rekap Penguasaan KuadraTile
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 text-xs font-semibold text-rose-900 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>Reset Progres Demo</span>
          </button>

          <button
            type="button"
            onClick={onGoToPractice}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span>Kembali ke Latihan</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Ringkasan Angka Utama (Tata Letak Asimetris) */}
      <div className="grid gap-3 md:grid-cols-12">
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 md:col-span-5">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-900">
            Total Bintang Diperoleh
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <Star className="h-6 w-6 fill-amber-400 text-amber-600" aria-hidden="true" />
            <span className="font-display text-3xl font-bold tabular-nums text-amber-950">
              {totalStars}
            </span>
            <span className="text-sm font-semibold text-amber-800">/ {maxStars}</span>
          </div>
          <p className="mt-1 text-xs text-amber-900">
            {completedList.length} dari {PROBLEMS.length} soal latihan dituntaskan.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Misi Lab Penemuan
          </p>
          <p className="font-display mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {completedMissions.length} / {DISCOVERY_MISSIONS.length}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Eksplorasi mandiri pada Lab Simulasi Slider.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 md:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
            Deteksi Diagnosis
          </p>
          <p className="font-display mt-2 text-2xl font-bold tabular-nums text-slate-900">
            {diagnosticLogs.length}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Kejadian miskonsepsi tertangkap mesin.
          </p>
        </div>
      </div>

      {/* Tabel Progres Level & Profil Miskonsepsi */}
      <div className="grid gap-4 lg:grid-cols-12">
        <section
          aria-labelledby="level-table-heading"
          className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-7"
        >
          <h2 id="level-table-heading" className="mb-3 font-display text-sm font-bold text-slate-900">
            Progres Soal per Level
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th scope="col" className="py-2 pr-3 font-bold">Level</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Ekspresi</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Status</th>
                  <th scope="col" className="py-2 font-bold text-right">Bintang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PROBLEMS.map((prob) => {
                  const prog = progressByProblem[prob.id];
                  return (
                    <tr key={prob.id}>
                      <td className="py-2 pr-3 font-semibold text-slate-700">
                        Lv.{prob.level}{' '}
                        <span className="hidden sm:inline font-normal text-slate-500">
                          ({LEVEL_METADATA[prob.level].name})
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-slate-900">
                        <ProductExpr factor1={prob.factor1} factor2={prob.factor2} />
                      </td>
                      <td className="py-2 pr-3">
                        {prog ? (
                          <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-900">
                            Tuntas ({prog.attempts} cek)
                          </span>
                        ) : (
                          <span className="inline-block rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right font-bold tabular-nums text-amber-700">
                        {prog ? `${prog.stars} / 3` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-labelledby="misconception-heading"
          className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-5"
        >
          <h2 id="misconception-heading" className="mb-3 flex items-center gap-1.5 font-display text-sm font-bold text-slate-900">
            <AlertCircle className="h-4 w-4 text-rose-700" aria-hidden="true" />
            <span>Catatan Miskonsepsi Sesi</span>
          </h2>

          {misconceptionEntries.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
              Belum ada miskonsepsi tercatat pada sesi ini. Saat demo, coba uji kesalahan klasik (misalnya melupakan suku tengah pada (x+2)² atau menulis 3x³) agar terrekam di sini.
            </p>
          ) : (
            <ul className="space-y-2">
              {misconceptionEntries.map(([code, count]) => (
                <li
                  key={code}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {MISCONCEPTION_LABELS[code as Exclude<MisconceptionCode, 'CORRECT'>] ?? code}
                    </p>
                    <p className="font-mono text-[10px] text-slate-600">{code}</p>
                  </div>
                  <span className="rounded-md bg-rose-100 px-2 py-1 font-bold tabular-nums text-rose-900">
                    {count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
