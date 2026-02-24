import { CheckCircle } from 'lucide-react';

/**
 * "What you now know" summary block shown at the end of a module.
 */
export function ModuleSummary({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-slate-700">
            <span className="text-green-600 font-bold mt-0.5">{'\u2713'}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
