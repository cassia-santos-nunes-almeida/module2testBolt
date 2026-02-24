import { useRef, useEffect, useState, type ReactNode } from 'react';

/**
 * A styled block for plain-language explanations.
 * No LaTeX, no Greek letters. Conversational tone only.
 * Includes a gate: the student must scroll to the bottom or click "I understand".
 */
export function PlainLanguageBlock({
  children,
  onUnderstood,
}: {
  children: ReactNode;
  onUnderstood?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const checkScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      if (atBottom) setHasScrolledToBottom(true);
    };

    // Check immediately in case content is short enough to not scroll
    checkScroll();
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const handleConfirm = () => {
    setConfirmed(true);
    onUnderstood?.();
  };

  const satisfied = hasScrolledToBottom || confirmed;

  return (
    <div className="bg-amber-50 rounded-lg border border-amber-200 overflow-hidden">
      <div
        ref={containerRef}
        className="p-6 max-h-[400px] overflow-y-auto text-slate-800 leading-relaxed text-base space-y-4"
      >
        {children}
      </div>

      <div className="border-t border-amber-200 bg-amber-100/50 px-6 py-3 flex items-center justify-end">
        {satisfied ? (
          <span className="text-sm font-medium text-green-700 flex items-center gap-1.5">
            <span className="text-green-600">{'\u2713'}</span> Got it!
          </span>
        ) : (
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            I understand
          </button>
        )}
      </div>
    </div>
  );
}
