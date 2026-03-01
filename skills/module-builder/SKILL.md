# module-builder Skill

## When to use
User wants to create a new learning module page for the EM&AC Lab.

## Workflow
1. Create a new directory under `src/modules/<module-name>/`
2. Create the main orchestrator component (`<ModuleName>.tsx`) — should be <100 lines
3. Create sub-components for each section/tab in the same directory
4. Register the route in `src/app/App.tsx`
5. Add the navigation entry in `src/components/layout/Sidebar.tsx`

## File structure
```
src/modules/<module-name>/
├── <ModuleName>.tsx          ← Main orchestrator (tab switching, state)
├── <SectionA>.tsx            ← Sub-component per section/tab
├── <SectionB>.tsx
└── ...
```

## Rules
- Never use class components — functional components only
- All shared types come from `src/types/circuit.ts`
- Use `MathWrapper` from `src/components/ui/` for all LaTeX math
- Use `Tabs` from `src/components/ui/` for tab switching
- Use `cn()` from `src/utils/cn` for conditional Tailwind classes
- Import circuit solver functions from `src/utils/circuitSolver`
- Import formula constants from `src/utils/componentMath`
- Keep each file under 200 lines
- Use `useMemo` for expensive computations (circuit responses, chart data)

## Template
```tsx
import { useState } from 'react';
import { Tabs } from '../../components/ui/Tabs';

export function NewModule() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Module Title</h1>
        <p className="text-lg text-slate-600">Module description</p>
      </div>
      <Tabs
        tabs={[
          { label: 'Theory', icon: BookOpen, content: <TheoryTab /> },
          { label: 'Interactive', icon: SlidersHorizontal, content: <InteractiveTab /> },
        ]}
      />
    </div>
  );
}
```

## Registration
In `src/app/App.tsx`, add:
```tsx
import { NewModule } from '../modules/new-module/NewModule';
// In Routes:
<Route path="/new-module" element={<NewModule />} />
```

In `src/components/layout/Sidebar.tsx`, add to the `steps` array:
```tsx
{ label: 'New Module', path: '/new-module', icon: IconName }
```
