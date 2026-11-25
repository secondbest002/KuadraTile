import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DiagnosticLog,
  ExpansionProblem,
  MisconceptionCode,
  ProblemProgress,
} from '../types/algebra';

interface ProgressState {
  progressByProblem: Record<string, ProblemProgress>;
  diagnosticLogs: DiagnosticLog[];
  completedMissions: string[];
  recordAttempt: (
    problemId: string,
    level: ExpansionProblem['level'],
    code: MisconceptionCode,
  ) => void;
  recordCompletion: (
    problemId: string,
    level: ExpansionProblem['level'],
    attempts: number,
    hintsUsed: number,
  ) => 1 | 2 | 3;
  completeMission: (missionId: string) => void;
  resetDemo: () => void;
}

export function calculateStars(attempts: number, hintsUsed: number): 1 | 2 | 3 {
  if (hintsUsed === 0 && attempts <= 2) return 3;
  if (hintsUsed <= 1 && attempts <= 4) return 2;
  return 1;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progressByProblem: {},
      diagnosticLogs: [],
      completedMissions: [],

      recordAttempt: (problemId, level, code) => {
        if (code === 'CORRECT') return;
        const entry: DiagnosticLog = {
          timestamp: new Date().toISOString(),
          problemId,
          level,
          code,
        };
        set((state) => ({
          diagnosticLogs: [...state.diagnosticLogs, entry],
        }));
      },

      recordCompletion: (problemId, level, attempts, hintsUsed) => {
        const earned = calculateStars(attempts, hintsUsed);
        const existing = get().progressByProblem[problemId];
        const bestStars = existing
          ? (Math.max(existing.stars, earned) as 1 | 2 | 3)
          : earned;

        set((state) => ({
          progressByProblem: {
            ...state.progressByProblem,
            [problemId]: {
              problemId,
              level,
              stars: bestStars,
              attempts,
              hintsUsed,
              completedAt: new Date().toISOString(),
            },
          },
        }));

        return earned;
      },

      completeMission: (missionId) => {
        set((state) => {
          if (state.completedMissions.includes(missionId)) return state;
          return {
            completedMissions: [...state.completedMissions, missionId],
          };
        });
      },

      resetDemo: () => {
        set({
          progressByProblem: {},
          diagnosticLogs: [],
          completedMissions: [],
        });
      },
    }),
    {
      name: 'kuadratile-v01-progress',
    },
  ),
);
