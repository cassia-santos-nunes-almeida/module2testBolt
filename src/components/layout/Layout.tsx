import { useState, type ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AiTutor } from '../common/AiTutor';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
      {!isTutorOpen && (
        <button
          onClick={() => setIsTutorOpen(true)}
          className="flex items-center gap-2 px-3 py-4 bg-gradient-to-b from-engineering-blue-500 to-engineering-blue-700 hover:from-engineering-blue-600 hover:to-engineering-blue-800 text-white writing-mode-vertical rounded-l-lg shadow-lg transition-all z-50 shrink-0 self-center hover:shadow-xl"
          style={{ writingMode: 'vertical-rl' }}
          aria-label="Open AI Tutor"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">AI Circuit Tutor</span>
        </button>
      )}
      <AiTutor isOpen={isTutorOpen} onToggle={() => setIsTutorOpen(false)} />
    </div>
  );
}
