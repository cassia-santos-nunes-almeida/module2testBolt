import { MathWrapper } from './MathWrapper';

/**
 * Displays a KaTeX formula with a label and real-time substituted numeric values below it.
 * The `formula` prop is the symbolic KaTeX string (e.g. "v_C(t) = V_s(1 - e^{-t/\\tau})").
 * The `substituted` prop is a KaTeX string with actual numbers plugged in.
 */
export function LiveEquation({
  label,
  formula,
  substituted,
}: {
  label?: string;
  formula: string;
  substituted: string;
}) {
  return (
    <div className="bg-engineering-blue-50 rounded-lg p-4 border border-engineering-blue-200">
      {label && (
        <p className="text-xs font-semibold text-engineering-blue-700 uppercase tracking-wide mb-2">
          {label}
        </p>
      )}
      <div className="space-y-2">
        <MathWrapper formula={formula} block />
        <div className="border-t border-engineering-blue-200 pt-2">
          <p className="text-xs text-slate-500 mb-1">With your values:</p>
          <MathWrapper formula={substituted} block />
        </div>
      </div>
    </div>
  );
}
