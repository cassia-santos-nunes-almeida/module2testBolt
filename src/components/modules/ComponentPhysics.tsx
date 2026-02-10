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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>
            <svg viewBox="0 0 400 180" className="w-full">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <polygon points="0 0, 10 5, 0 10" fill="#64748b" />
                </marker>
                <linearGradient id="resistorBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* Wire leads */}
              <line x1="20" y1="90" x2="80" y2="90" stroke="#1e40af" strokeWidth="3" />
              <line x1={80 + length * 120} y1="90" x2={80 + length * 120 + 60} y2="90" stroke="#1e40af" strokeWidth="3" />

              {/* Resistor body - rounded rectangle */}
              {(() => {
                const h = Math.max(Math.sqrt(area * 1e6) * 35, 24);
                const w = length * 120;
                return (
                  <>
                    <rect x="80" y={90 - h / 2} width={w} height={h} rx="6" ry="6" fill="url(#resistorBody)" stroke="#92400e" strokeWidth="2" />
                    {/* Color bands */}
                    <rect x={80 + w * 0.15} y={90 - h / 2 + 2} width={w * 0.06} height={h - 4} rx="1" fill="#b91c1c" opacity="0.8" />
                    <rect x={80 + w * 0.28} y={90 - h / 2 + 2} width={w * 0.06} height={h - 4} rx="1" fill="#7c3aed" opacity="0.8" />
                    <rect x={80 + w * 0.41} y={90 - h / 2 + 2} width={w * 0.06} height={h - 4} rx="1" fill="#b45309" opacity="0.8" />
                    <rect x={80 + w * 0.70} y={90 - h / 2 + 2} width={w * 0.06} height={h - 4} rx="1" fill="#d4af37" opacity="0.8" />

                    {/* Length dimension line */}
                    <line x1="80" y1={90 - h / 2 - 14} x2={80 + w} y2={90 - h / 2 - 14} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1="80" y1={90 - h / 2 - 20} x2="80" y2={90 - h / 2 - 8} stroke="#64748b" strokeWidth="0.5" />
                    <line x1={80 + w} y1={90 - h / 2 - 20} x2={80 + w} y2={90 - h / 2 - 8} stroke="#64748b" strokeWidth="0.5" />
                    <text x={80 + w / 2} y={90 - h / 2 - 22} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">L</text>

                    {/* Area dimension */}
                    <line x1={80 + w + 70} y1={90 - h / 2} x2={80 + w + 70} y2={90 + h / 2} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowhead)" />
                    <line x1={80 + w + 64} y1={90 - h / 2} x2={80 + w + 76} y2={90 - h / 2} stroke="#64748b" strokeWidth="0.5" />
                    <line x1={80 + w + 64} y1={90 + h / 2} x2={80 + w + 76} y2={90 + h / 2} stroke="#64748b" strokeWidth="0.5" />
                    <text x={80 + w + 82} y={93} textAnchor="start" className="text-xs fill-slate-600" fontStyle="italic">A</text>
                  </>
                );
              })()}

              {/* Current arrow */}
              <line x1="30" y1="130" x2="65" y2="130" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed)" />
              <text x="48" y="148" textAnchor="middle" className="text-xs fill-red-600" fontStyle="italic">i</text>
              <defs>
                <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <polygon points="0 1, 8 4, 0 7" fill="#dc2626" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              {/* Zigzag resistor symbol */}
              <line x1="20" y1="30" x2="60" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <polyline points="60,30 72,10 96,50 120,10 144,50 168,10 192,50 204,30" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="204" y1="30" x2="260" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <text x="132" y="8" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">R</text>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>
            <svg viewBox="0 0 400 200" className="w-full">
              <defs>
                <marker id="arrowCapDim" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <polygon points="0 1, 8 4, 0 7" fill="#64748b" />
                </marker>
                <linearGradient id="plateFill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {(() => {
                const plateH = Math.max(Math.sqrt(area) * 80, 50);
                const gap = Math.max(distance * 400, 30);
                const plateX1 = 160;
                const plateX2 = plateX1 + gap;
                const cy = 100;

                return (
                  <>
                    {/* Wire leads */}
                    <line x1="60" y1={cy} x2={plateX1} y2={cy} stroke="#1e40af" strokeWidth="3" />
                    <line x1={plateX2 + 12} y1={cy} x2="360" y2={cy} stroke="#1e40af" strokeWidth="3" />

                    {/* Plates */}
                    <rect x={plateX1 - 12} y={cy - plateH / 2} width="12" height={plateH} rx="2" fill="url(#plateFill)" stroke="#1e40af" strokeWidth="1.5" />
                    <rect x={plateX2} y={cy - plateH / 2} width="12" height={plateH} rx="2" fill="url(#plateFill)" stroke="#1e40af" strokeWidth="1.5" />

                    {/* Dielectric fill between plates */}
                    <rect x={plateX1} y={cy - plateH / 2} width={gap} height={plateH} fill="#fef3c7" opacity="0.6" />

                    {/* Electric field arrows between plates */}
                    {[-2, -1, 0, 1, 2].map((offset) => (
                      <line
                        key={offset}
                        x1={plateX1 + 4}
                        y1={cy + offset * (plateH / 6)}
                        x2={plateX2 - 2}
                        y2={cy + offset * (plateH / 6)}
                        stroke="#dc2626"
                        strokeWidth="1"
                        strokeDasharray="4,3"
                        markerEnd="url(#arrowEField)"
                      />
                    ))}

                    {/* Charge symbols */}
                    {[-2, -1, 0, 1, 2].map((offset) => (
                      <g key={`charge-${offset}`}>
                        <text x={plateX1 - 18} y={cy + offset * (plateH / 6) + 4} textAnchor="middle" className="text-xs font-bold" fill="#2563eb">+</text>
                        <text x={plateX2 + 18} y={cy + offset * (plateH / 6) + 4} textAnchor="middle" className="text-xs font-bold" fill="#2563eb">&minus;</text>
                      </g>
                    ))}

                    {/* Dimension: distance (d) */}
                    <line x1={plateX1} y1={cy + plateH / 2 + 16} x2={plateX2 + 12} y2={cy + plateH / 2 + 16} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowCapDim)" />
                    <line x1={plateX1} y1={cy + plateH / 2 + 10} x2={plateX1} y2={cy + plateH / 2 + 22} stroke="#64748b" strokeWidth="0.5" />
                    <line x1={plateX2 + 12} y1={cy + plateH / 2 + 10} x2={plateX2 + 12} y2={cy + plateH / 2 + 22} stroke="#64748b" strokeWidth="0.5" />
                    <text x={(plateX1 + plateX2 + 12) / 2} y={cy + plateH / 2 + 32} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">d</text>

                    {/* Dimension: area */}
                    <line x1={plateX1 - 30} y1={cy - plateH / 2} x2={plateX1 - 30} y2={cy + plateH / 2} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowCapDim)" />
                    <line x1={plateX1 - 36} y1={cy - plateH / 2} x2={plateX1 - 24} y2={cy - plateH / 2} stroke="#64748b" strokeWidth="0.5" />
                    <line x1={plateX1 - 36} y1={cy + plateH / 2} x2={plateX1 - 24} y2={cy + plateH / 2} stroke="#64748b" strokeWidth="0.5" />
                    <text x={plateX1 - 42} y={cy + 4} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">A</text>

                    {/* E-field label */}
                    <text x={(plateX1 + plateX2) / 2 + 6} y={cy - plateH / 2 + 14} textAnchor="middle" className="text-xs fill-red-500 font-medium">E field</text>
                  </>
                );
              })()}

              <defs>
                <marker id="arrowEField" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <polygon points="0 0.5, 6 3, 0 5.5" fill="#dc2626" />
                </marker>
              </defs>
            </svg>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              {/* Standard capacitor symbol - two parallel lines */}
              <line x1="20" y1="30" x2="120" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <line x1="120" y1="8" x2="120" y2="52" stroke="#1e40af" strokeWidth="3" />
              <line x1="136" y1="8" x2="136" y2="52" stroke="#1e40af" strokeWidth="3" />
              <line x1="136" y1="30" x2="260" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <text x="128" y="6" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">C</text>
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
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>
            <svg viewBox="0 0 400 200" className="w-full">
              <defs>
                <marker id="arrowIndDim" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                  <polygon points="0 1, 8 4, 0 7" fill="#64748b" />
                </marker>
              </defs>

              {/* Wire leads */}
              <line x1="40" y1="100" x2="95" y2="100" stroke="#1e40af" strokeWidth="3" />
              <line x1={105 + length * 500} y1="100" x2={105 + length * 500 + 55} y2="100" stroke="#1e40af" strokeWidth="3" />

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

              {/* Length dimension */}
              {(() => {
                const coilR = Math.sqrt(area * 1000) * 40;
                return (
                  <>
                    <line x1="100" y1={100 - coilR - 14} x2={100 + length * 500} y2={100 - coilR - 14} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowIndDim)" />
                    <line x1="100" y1={100 - coilR - 20} x2="100" y2={100 - coilR - 8} stroke="#64748b" strokeWidth="0.5" />
                    <line x1={100 + length * 500} y1={100 - coilR - 20} x2={100 + length * 500} y2={100 - coilR - 8} stroke="#64748b" strokeWidth="0.5" />
                    <text x={100 + (length * 500) / 2} y={100 - coilR - 22} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">l</text>

                    {/* Area dimension */}
                    <line x1="70" y1={100 - coilR} x2="70" y2={100 + coilR} stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowIndDim)" />
                    <line x1="64" y1={100 - coilR} x2="76" y2={100 - coilR} stroke="#64748b" strokeWidth="0.5" />
                    <line x1="64" y1={100 + coilR} x2="76" y2={100 + coilR} stroke="#64748b" strokeWidth="0.5" />
                    <text x="52" y="103" textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">A</text>
                  </>
                );
              })()}
            </svg>
            <p className="text-center text-xs text-slate-600 mt-2">
              Number of turns: {turns} {turns > 20 && '(showing 20)'}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              {/* Standard inductor symbol - series of bumps/arcs */}
              <line x1="20" y1="35" x2="60" y2="35" stroke="#059669" strokeWidth="2.5" />
              <path d="M60,35 C60,15 80,15 80,35 C80,15 100,15 100,35 C100,15 120,15 120,35 C120,15 140,15 140,35 C140,15 160,15 160,35 C160,15 180,15 180,35" fill="none" stroke="#059669" strokeWidth="2.5" />
              <line x1="180" y1="35" x2="260" y2="35" stroke="#059669" strokeWidth="2.5" />
              <text x="120" y="12" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">L</text>
            </svg>
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
