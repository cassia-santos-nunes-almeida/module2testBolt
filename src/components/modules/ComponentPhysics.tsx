import { useState } from 'react';
import { MathWrapper } from '../common/MathWrapper';
import {
  resistanceFormula,
  capacitanceFormula,
  inductanceFormula,
  calculateResistance,
  calculateCapacitance,
  calculateInductance,
  materials,
} from '../../utils/componentMath';

type ComponentType = 'resistor' | 'capacitor' | 'inductor';

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

      <div className="flex gap-4 border-b border-slate-200">
        {(['resistor', 'capacitor', 'inductor'] as const).map((component) => (
          <button
            key={component}
            onClick={() => setActiveComponent(component)}
            className={`px-6 py-3 font-medium capitalize transition-colors border-b-2 ${
              activeComponent === component
                ? 'border-engineering-blue-600 text-engineering-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {component}
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

function ResistorSection({
  length,
  area,
  resistivity,
  resistance,
  onLengthChange,
  onAreaChange,
  onResistivityChange,
}: {
  length: number;
  area: number;
  resistivity: number;
  resistance: number;
  onLengthChange: (v: number) => void;
  onAreaChange: (v: number) => void;
  onResistivityChange: (v: number) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Theory</h3>
          <p className="text-slate-700 mb-4">
            A resistor opposes the flow of electric current. Resistance depends on the material's
            resistivity, its length, and cross-sectional area.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Basic Formula:</p>
              <MathWrapper formula={resistanceFormula.basic} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Ohm's Law:</p>
              <MathWrapper formula={resistanceFormula.ohmsLaw} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Power Dissipation:</p>
              <MathWrapper formula={resistanceFormula.power} block />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p className="mb-2">
              <strong>Where:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="\rho" /> = Resistivity (Ω·m)</li>
              <li><MathWrapper formula="L" /> = Length (m)</li>
              <li><MathWrapper formula="A" /> = Cross-sectional area (m²)</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Material Properties</h3>
          <div className="space-y-2">
            {materials.filter(m => m.resistivity).map((material) => (
              <button
                key={material.name}
                onClick={() => onResistivityChange(material.resistivity!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-engineering-blue-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  ρ = {material.resistivity?.toExponential(2)} Ω·m
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Representation</h3>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <svg viewBox="0 0 400 200" className="w-full">
              <rect x="50" y="80" width={length * 150} height={Math.sqrt(area * 1e6) * 40} fill="#d97706" stroke="#92400e" strokeWidth="2" />

              <line x1="20" y1="100" x2="50" y2="100" stroke="#1e40af" strokeWidth="3" />
              <line x1={50 + length * 150} y1="100" x2={50 + length * 150 + 30} y2="100" stroke="#1e40af" strokeWidth="3" />

              <line x1="50" y1="60" x2={50 + length * 150} y2="60" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead)" />
              <text x={50 + (length * 150) / 2} y="50" textAnchor="middle" className="text-xs fill-slate-600">Length (L)</text>

              <line x1="30" y1="80" x2="30" y2={80 + Math.sqrt(area * 1e6) * 40} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead)" />
              <text x="15" y={80 + (Math.sqrt(area * 1e6) * 40) / 2} textAnchor="middle" className="text-xs fill-slate-600">A</text>

              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#64748b" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Length: {length.toFixed(2)} m
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={length}
                onChange={(e) => onLengthChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Area: {(area * 1e6).toFixed(2)} mm²
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={area * 1e6}
                onChange={(e) => onAreaChange(parseFloat(e.target.value) * 1e-6)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resistivity: {resistivity.toExponential(2)} Ω·m
              </label>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={resistivity * 1e8}
                onChange={(e) => onResistivityChange(parseFloat(e.target.value) * 1e-8)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 bg-engineering-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-engineering-blue-900 mb-1">Calculated Resistance:</p>
            <p className="text-3xl font-bold text-engineering-blue-700">
              {resistance.toFixed(3)} Ω
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function CapacitorSection({
  area,
  distance,
  permittivity,
  capacitance,
  onAreaChange,
  onDistanceChange,
  onPermittivityChange,
}: {
  area: number;
  distance: number;
  permittivity: number;
  capacitance: number;
  onAreaChange: (v: number) => void;
  onDistanceChange: (v: number) => void;
  onPermittivityChange: (v: number) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Theory</h3>
          <p className="text-slate-700 mb-4">
            A capacitor stores energy in an electric field between two conductive plates
            separated by a dielectric material. Capacitance depends on plate area, separation
            distance, and the dielectric's permittivity.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Basic Formula:</p>
              <MathWrapper formula={capacitanceFormula.basic} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Current-Voltage Relation:</p>
              <MathWrapper formula={capacitanceFormula.currentVoltage} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Energy Storage:</p>
              <MathWrapper formula={capacitanceFormula.energy} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Impedance (AC):</p>
              <MathWrapper formula={capacitanceFormula.impedance} block />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p className="mb-2">
              <strong>Where:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="\epsilon" /> = Permittivity (F/m)</li>
              <li><MathWrapper formula="A" /> = Plate area (m²)</li>
              <li><MathWrapper formula="d" /> = Separation distance (m)</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Dielectric Materials</h3>
          <div className="space-y-2">
            {materials.filter(m => m.permittivity).map((material) => (
              <button
                key={material.name}
                onClick={() => onPermittivityChange(material.permittivity!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-engineering-blue-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  ε = {material.permittivity?.toExponential(2)} F/m
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Representation</h3>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <svg viewBox="0 0 400 200" className="w-full">
              <rect x="150" y="50" width="10" height={Math.sqrt(area) * 80} fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
              <rect x={150 + distance * 500} y="50" width="10" height={Math.sqrt(area) * 80} fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />

              <rect x="160" y="50" width={distance * 500} height={Math.sqrt(area) * 80} fill="#dbeafe" opacity="0.5" />

              <line x1="165" y1="140" x2={150 + distance * 500} y2="140" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5" />
              <text x={165 + (distance * 500) / 2} y="160" textAnchor="middle" className="text-xs fill-slate-600">
                Distance (d)
              </text>

              <line x1="120" y1="50" x2="120" y2={50 + Math.sqrt(area) * 80} stroke="#64748b" strokeWidth="1" />
              <text x="100" y={50 + (Math.sqrt(area) * 80) / 2} textAnchor="middle" className="text-xs fill-slate-600">
                Area
              </text>

              <text x="165" y="35" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">
                + + + +
              </text>
              <text x={165 + distance * 500} y="35" textAnchor="middle" className="text-xs fill-slate-600 font-semibold">
                - - - -
              </text>
            </svg>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plate Area: {(area * 100).toFixed(2)} cm²
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={area * 100}
                onChange={(e) => onAreaChange(parseFloat(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Distance: {(distance * 1000).toFixed(2)} mm
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={distance * 1000}
                onChange={(e) => onDistanceChange(parseFloat(e.target.value) / 1000)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Permittivity: {permittivity.toExponential(2)} F/m
              </label>
              <input
                type="range"
                min="8.854"
                max="40"
                step="0.1"
                value={permittivity * 1e12}
                onChange={(e) => onPermittivityChange(parseFloat(e.target.value) * 1e-12)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 bg-engineering-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-engineering-blue-900 mb-1">Calculated Capacitance:</p>
            <p className="text-3xl font-bold text-engineering-blue-700">
              {(capacitance * 1e12).toFixed(2)} pF
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function InductorSection({
  turns,
  area,
  length,
  permeability,
  inductance,
  onTurnsChange,
  onAreaChange,
  onLengthChange,
  onPermeabilityChange,
}: {
  turns: number;
  area: number;
  length: number;
  permeability: number;
  inductance: number;
  onTurnsChange: (v: number) => void;
  onAreaChange: (v: number) => void;
  onLengthChange: (v: number) => void;
  onPermeabilityChange: (v: number) => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Theory</h3>
          <p className="text-slate-700 mb-4">
            An inductor stores energy in a magnetic field created by current flowing through
            a coil of wire. Inductance depends on the number of turns, core material permeability,
            coil area, and length.
          </p>

          <div className="bg-slate-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Basic Formula:</p>
              <MathWrapper formula={inductanceFormula.basic} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Voltage-Current Relation:</p>
              <MathWrapper formula={inductanceFormula.voltageCurrents} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Energy Storage:</p>
              <MathWrapper formula={inductanceFormula.energy} block />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">Impedance (AC):</p>
              <MathWrapper formula={inductanceFormula.impedance} block />
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <p className="mb-2">
              <strong>Where:</strong>
            </p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="N" /> = Number of turns</li>
              <li><MathWrapper formula="\mu" /> = Permeability (H/m)</li>
              <li><MathWrapper formula="A" /> = Core area (m²)</li>
              <li><MathWrapper formula="l" /> = Coil length (m)</li>
            </ul>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Core Materials</h3>
          <div className="space-y-2">
            {materials.filter(m => m.permeability).slice(0, 3).map((material) => (
              <button
                key={material.name}
                onClick={() => onPermeabilityChange(material.permeability!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-engineering-blue-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  μ = {material.permeability?.toExponential(2)} H/m
                </span>
              </button>
            ))}
            <button
              onClick={() => onPermeabilityChange(6.3e-3)}
              className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-engineering-blue-50 transition-colors text-sm"
            >
              <span className="font-medium">Iron Core</span>
              <span className="text-slate-600 ml-2">
                μ = 6.30e-3 H/m
              </span>
            </button>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Visual Representation</h3>

          <div className="bg-slate-50 p-6 rounded-lg mb-6">
            <svg viewBox="0 0 400 200" className="w-full">
              {Array.from({ length: Math.min(turns, 20) }).map((_, i) => {
                const x = 100 + (i * length * 500) / Math.min(turns, 20);
                return (
                  <ellipse
                    key={i}
                    cx={x}
                    cy="100"
                    rx="15"
                    ry={Math.sqrt(area * 1000) * 40}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="3"
                  />
                );
              })}

              <line x1="100" y1="30" x2={100 + length * 500} y2="30" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5" />
              <text x={100 + (length * 500) / 2} y="20" textAnchor="middle" className="text-xs fill-slate-600">
                Length (l)
              </text>

              <line x1="70" y1={100 - Math.sqrt(area * 1000) * 40} x2="70" y2={100 + Math.sqrt(area * 1000) * 40} stroke="#64748b" strokeWidth="1" />
              <text x="50" y="100" textAnchor="middle" className="text-xs fill-slate-600">
                Area
              </text>
            </svg>
            <p className="text-center text-xs text-slate-600 mt-2">
              Number of turns: {turns} {turns > 20 && '(showing 20)'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Turns: {turns}
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={turns}
                onChange={(e) => onTurnsChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Core Area: {(area * 10000).toFixed(2)} cm²
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={area * 10000}
                onChange={(e) => onAreaChange(parseFloat(e.target.value) / 10000)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Coil Length: {(length * 100).toFixed(1)} cm
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={length * 100}
                onChange={(e) => onLengthChange(parseFloat(e.target.value) / 100)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Permeability: {permeability.toExponential(2)} H/m
              </label>
              <input
                type="range"
                min="1.257"
                max="10"
                step="0.1"
                value={permeability * 1e6}
                onChange={(e) => onPermeabilityChange(parseFloat(e.target.value) * 1e-6)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 bg-engineering-blue-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-engineering-blue-900 mb-1">Calculated Inductance:</p>
            <p className="text-3xl font-bold text-engineering-blue-700">
              {(inductance * 1000).toFixed(2)} mH
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
