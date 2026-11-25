import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { MisconceptionFeedback } from '../../types/algebra';

interface FeedbackBannerProps {
  feedback: MisconceptionFeedback | null;
  neutralPrompt: string;
}

export function FeedbackBanner({ feedback, neutralPrompt }: FeedbackBannerProps) {
  const isCorrect = feedback?.code === 'CORRECT';
  const isError = feedback !== null && !isCorrect;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${
        isCorrect
          ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
          : isError
            ? 'border-rose-300 bg-rose-50 text-rose-950'
            : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      {isCorrect ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
      ) : isError ? (
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
      ) : (
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
      )}

      <div className="min-w-0 flex-1">
        {isError && feedback && (
          <span className="mb-0.5 inline-block rounded bg-rose-200/70 px-1.5 py-0.5 font-mono text-[11px] font-bold text-rose-950">
            {feedback.code}
          </span>
        )}
        <p className="leading-snug font-medium">
          {feedback ? feedback.message : neutralPrompt}
        </p>
      </div>
    </div>
  );
}
