import { useEffect, useState } from 'react';
import { CheatSheetModal } from './components/layout/CheatSheetModal';
import { Navbar } from './components/layout/Navbar';
import { SessionSummary } from './components/report/SessionSummary';
import { AreaSimulator } from './components/sandbox/AreaSimulator';
import { PracticeArena } from './components/workspace/PracticeArena';
import type { ActiveView } from './types/algebra';

const PAGE_TITLES: Record<ActiveView, string> = {
  lab: 'Lab Eksplorasi | KuadraTile',
  practice: 'Arena Latihan | KuadraTile',
  summary: 'Ringkasan Sesi | KuadraTile',
};

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('practice');
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLES[activeView];
  }, [activeView]);

  return (
    <div className="dot-grid-canvas min-h-screen text-slate-900">
      <Navbar
        activeView={activeView}
        onChangeView={setActiveView}
        onOpenCheatSheet={() => setCheatSheetOpen(true)}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-3 py-5 sm:px-6 sm:py-6">
        {activeView === 'lab' && (
          <AreaSimulator onGoToPractice={() => setActiveView('practice')} />
        )}
        {activeView === 'practice' && <PracticeArena />}
        {activeView === 'summary' && (
          <SessionSummary onGoToPractice={() => setActiveView('practice')} />
        )}
      </main>

      <CheatSheetModal
        open={cheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
      />
    </div>
  );
}
