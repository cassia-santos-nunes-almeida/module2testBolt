import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * A collapsible/expandable panel. Starts collapsed by default.
 */
export function CollapsiblePanel({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-500" />
        )}
        <span className="text-sm font-semibold text-slate-700">{title}</span>
      </button>
      {isOpen && <div className="p-5 border-t border-slate-200">{children}</div>}
    </div>
  );
}
