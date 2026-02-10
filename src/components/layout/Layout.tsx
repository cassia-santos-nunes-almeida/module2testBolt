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
        {!isTutorOpen && (
          <button
            onClick={() => setIsTutorOpen(true)}
            className="fixed bottom-6 right-6 bg-engineering-blue-600 hover:bg-engineering-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 z-50"
            aria-label="Open AI Tutor"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        )}
      </main>
      <AiTutor isOpen={isTutorOpen} onToggle={() => setIsTutorOpen(false)} />
    </div>
  );
}
