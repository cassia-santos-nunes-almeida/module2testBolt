import type { ReactNode } from 'react';

interface ComponentSectionLayoutProps {
  theory: ReactNode;
  materials: ReactNode;
  interactive: ReactNode;
}

/** Shared two-column layout for component sections (F13/F14). */
export function ComponentSectionLayout({ theory, materials, interactive }: ComponentSectionLayoutProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">{theory}</section>
        <section className="bg-white rounded-lg shadow-md p-6">{materials}</section>
      </div>
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">{interactive}</section>
      </div>
    </div>
  );
}
