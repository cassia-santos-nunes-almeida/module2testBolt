import { BookOpen, SlidersHorizontal, Activity } from 'lucide-react';
import { Tabs } from '../../components/ui/Tabs';
import { TheoryTab } from './TheoryTab';
import { InteractiveTab } from './InteractiveTab';
import { DampingTab } from './DampingTab';

export function SDomainAnalysis() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">S-Domain Analysis</h1>
        <p className="text-lg text-slate-600">
          Transfer functions, poles, zeros, and stability analysis
        </p>
      </div>

      <Tabs
        tabs={[
          {
            label: 'Theory',
            icon: <BookOpen className="w-4 h-4" />,
            content: <TheoryTab />,
          },
          {
            label: 'Interactive Lab',
            icon: <SlidersHorizontal className="w-4 h-4" />,
            content: <InteractiveTab />,
          },
          {
            label: 'Damping & Takeaways',
            icon: <Activity className="w-4 h-4" />,
            content: <DampingTab />,
          },
        ]}
      />
    </div>
  );
}
