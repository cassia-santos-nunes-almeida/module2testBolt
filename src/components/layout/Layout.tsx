import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AiTutor } from '../common/AiTutor';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
      <AiTutor />
    </div>
  );
}
