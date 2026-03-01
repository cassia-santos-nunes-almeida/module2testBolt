import { useState } from 'react';
import type { ComponentType } from '../../types/circuit';
import {
  calculateResistance,
  calculateCapacitance,
  calculateInductance,
} from '../../utils/componentMath';
import { ResistorSection } from './ResistorSection';
import { CapacitorSection } from './CapacitorSection';
import { InductorSection } from './InductorSection';

const tabs = [
  { id: 'resistor' as const, label: 'Resistor', color: 'border-red-500 text-red-700 bg-red-50' },
  { id: 'capacitor' as const, label: 'Capacitor', color: 'border-green-500 text-green-700 bg-green-50' },
  { id: 'inductor' as const, label: 'Inductor', color: 'border-purple-500 text-purple-700 bg-purple-50' },
];

export function ComponentPhysics() {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('resistor');

  const [resistorLength, setResistorLength] = useState(1);
  const [resistorArea, setResistorArea] = useState(1e-6);
  const [resistorMaterial, setResistorMaterial] = useState(1.68e-8);

  const [capacitorArea, setCapacitorArea] = useState(0.01);
  const [capacitorDistance, setCapacitorDistance] = useState(0.001);
  const [capacitorPermittivity, setCapacitorPermittivity] = useState(8.854e-12);

  const [inductorTurns, setInductorTurns] = useState(100);
  const [inductorArea, setInductorArea] = useState(0.0001);
  const [inductorLength, setInductorLength] = useState(0.1);
  const [inductorPermeability, setInductorPermeability] = useState(1.257e-6);

  const resistance = calculateResistance(resistorMaterial, resistorLength, resistorArea);
  const capacitance = calculateCapacitance(capacitorPermittivity, capacitorArea, capacitorDistance);
  const inductance = calculateInductance(inductorPermeability, inductorTurns, inductorArea, inductorLength);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Component Physics</h1>
        <p className="text-lg text-slate-600">
          Understanding the physical foundations of circuit components
        </p>
      </div>

      <div className="flex border-b-2 border-slate-200">
        {tabs.map((component) => (
          <button
            key={component.id}
            onClick={() => setActiveComponent(component.id)}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-3 -mb-[2px] ${
              activeComponent === component.id
                ? component.color
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {component.label}
          </button>
        ))}
      </div>

      {activeComponent === 'resistor' && (
        <ResistorSection
          length={resistorLength}
          area={resistorArea}
          resistivity={resistorMaterial}
          resistance={resistance}
          onLengthChange={setResistorLength}
          onAreaChange={setResistorArea}
          onResistivityChange={setResistorMaterial}
        />
      )}

      {activeComponent === 'capacitor' && (
        <CapacitorSection
          area={capacitorArea}
          distance={capacitorDistance}
          permittivity={capacitorPermittivity}
          capacitance={capacitance}
          onAreaChange={setCapacitorArea}
          onDistanceChange={setCapacitorDistance}
          onPermittivityChange={setCapacitorPermittivity}
        />
      )}

      {activeComponent === 'inductor' && (
        <InductorSection
          turns={inductorTurns}
          area={inductorArea}
          length={inductorLength}
          permeability={inductorPermeability}
          inductance={inductance}
          onTurnsChange={setInductorTurns}
          onAreaChange={setInductorArea}
          onLengthChange={setInductorLength}
          onPermeabilityChange={setInductorPermeability}
        />
      )}
    </div>
  );
}
