import { BarChart3, FlaskConical, Grid2x2, HelpCircle, Star } from 'lucide-react';
import { PROBLEMS } from '../../data/levels';
import { useProgressStore } from '../../store/useProgressStore';
import type { ActiveView } from '../../types/algebra';

interface NavbarProps {
  activeView: ActiveView;
  onChangeView: (view: ActiveView) => void;
  onOpenCheatSheet: () => void;
}

export function Navbar({
  activeView,
  onChangeView,
  onOpenCheatSheet,
}: NavbarProps) {
  const progressByProblem = useProgressStore((s) => s.progressByProblem);
  const totalStars = Object.values(progressByProblem).reduce(
    (sum, item) => sum + item.stars,
    0,
  );
  const maxStars = PROBLEMS.length * 3;

  const navItems: Array<{
    id: ActiveView;
    label: string;
    shortLabel: string;
    icon: typeof FlaskConical;
  }> = [
    { id: 'lab', label: 'Lab Eksplorasi', shortLabel: 'Lab', icon: FlaskConical },
    { id: 'practice', label: 'Arena Latihan', shortLabel: 'Latih', icon: Grid2x2 },
    { id: 'summary', label: 'Ringkasan Sesi', shortLabel: 'Ringkas', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95">
      <a
        href="#main-content"
        className="visually-hidden fixed left-3 top-3 z-50 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
      >
        Lewati ke konten utama
      </a>

      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-3 py-2.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div
            aria-hidden="true"
            className="grid h-9 w-9 grid-cols-2 grid-rows-2 gap-0.5 rounded-lg bg-slate-900 p-1.5"
          >
            <span className="rounded-[2px] bg-blue-500" />
            <span className="rounded-[2px] bg-teal-500" />
            <span className="rounded-[2px] bg-teal-500" />
            <span className="rounded-[2px] bg-amber-500" />
          </div>
          <div>
            <span className="font-display block text-base font-bold leading-tight text-slate-900 sm:text-lg">
              KuadraTile
            </span>
            <span className="hidden text-[11px] font-medium text-slate-600 sm:block">
              Lihat Luasnya, Pahami Aljabarnya
            </span>
          </div>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="order-3 grid w-full grid-cols-3 gap-1 border-t border-slate-100 pt-2 md:order-none md:flex md:w-auto md:items-center md:gap-1.5 md:border-t-0 md:pt-0"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onChangeView(item.id)}
                className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-3.5 sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-900 sm:text-sm"
            aria-label={`Total bintang ${totalStars} dari ${maxStars}`}
          >
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-600" aria-hidden="true" />
            <span>
              {totalStars}/{maxStars}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenCheatSheet}
            aria-label="Buka Kamus Mini Ubin dan Panduan Konsep"
            className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-3 sm:text-sm"
          >
            <HelpCircle className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
            <span className="hidden md:inline">Kamus Ubin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
