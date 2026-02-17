import { useState, type ReactNode } from 'react';
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

      <div className="flex border-b-2 border-slate-200">
        {([
          { id: 'resistor' as const, label: 'Resistor', color: 'border-red-500 text-red-700 bg-red-50' },
          { id: 'capacitor' as const, label: 'Capacitor', color: 'border-green-500 text-green-700 bg-green-50' },
          { id: 'inductor' as const, label: 'Inductor', color: 'border-purple-500 text-purple-700 bg-purple-50' },
        ]).map((component) => (
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

/** Shared two-column layout for component sections (F13/F14). */
function ComponentSectionLayout({ theory, materials, interactive }: {
  theory: ReactNode;
  materials: ReactNode;
  interactive: ReactNode;
}) {
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

/* ─── RESISTOR ─── */
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
  const bodyW = 40 + length * 100; // 40–240 px
  const bodyH = Math.max(20 + Math.sqrt(area * 1e6) * 16, 24); // height responds to area
  const crossR = 8 + Math.sqrt(area * 1e6) * 12; // cross-section radius 8–46

  return (
    <ComponentSectionLayout
      theory={<>
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
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="\rho" /> = Resistivity (&Omega;&middot;m)</li>
              <li><MathWrapper formula="L" /> = Length (m)</li>
              <li><MathWrapper formula="A" /> = Cross-sectional area (m&sup2;)</li>
            </ul>
          </div>
      </>}
      materials={<>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Material Properties</h3>
          <div className="space-y-2">
            {materials.filter(m => m.resistivity).map((material) => (
              <button
                key={material.name}
                onClick={() => onResistivityChange(material.resistivity!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-red-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  &rho; = {material.resistivity?.toExponential(2)} &Omega;&middot;m
                </span>
              </button>
            ))}
          </div>
      </>}
      interactive={<>
          {/* 1. Circuit Symbol */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              <line x1="20" y1="30" x2="60" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <polyline points="60,30 72,10 96,50 120,10 144,50 168,10 192,50 204,30" fill="none" stroke="#1e40af" strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="204" y1="30" x2="260" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <text x="132" y="8" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">R</text>
            </svg>
          </div>

          {/* 2. Engineering Drawing: Side View + Cross-Section */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>

            {/* Side view (longitudinal) */}
            <div className="mb-3">
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Side View</p>
              <svg viewBox="0 0 400 140" className="w-full">
                <defs>
                  <marker id="rArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0 1, 8 4, 0 7" fill="#64748b" />
                  </marker>
                  <linearGradient id="rBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#b45309" />
                  </linearGradient>
                  <marker id="rArrowRed" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0 1, 8 4, 0 7" fill="#dc2626" />
                  </marker>
                </defs>

                {/* Wire leads */}
                <line x1="20" y1="70" x2="80" y2="70" stroke="#1e40af" strokeWidth="3" />
                <line x1={80 + bodyW} y1="70" x2={80 + bodyW + 50} y2="70" stroke="#1e40af" strokeWidth="3" />

                {/* Body */}
                <rect x="80" y={70 - bodyH / 2} width={bodyW} height={bodyH} rx="5" fill="url(#rBody)" stroke="#92400e" strokeWidth="1.5" />

                {/* Color bands */}
                <rect x={80 + bodyW * 0.15} y={70 - bodyH / 2 + 2} width={bodyW * 0.05} height={bodyH - 4} rx="1" fill="#b91c1c" opacity="0.8" />
                <rect x={80 + bodyW * 0.28} y={70 - bodyH / 2 + 2} width={bodyW * 0.05} height={bodyH - 4} rx="1" fill="#7c3aed" opacity="0.8" />
                <rect x={80 + bodyW * 0.41} y={70 - bodyH / 2 + 2} width={bodyW * 0.05} height={bodyH - 4} rx="1" fill="#b45309" opacity="0.8" />
                <rect x={80 + bodyW * 0.70} y={70 - bodyH / 2 + 2} width={bodyW * 0.05} height={bodyH - 4} rx="1" fill="#d4af37" opacity="0.8" />

                {/* Length dimension */}
                <line x1="80" y1={70 - bodyH / 2 - 14} x2={80 + bodyW} y2={70 - bodyH / 2 - 14} stroke="#64748b" strokeWidth="1" markerEnd="url(#rArrow)" />
                <line x1="80" y1={70 - bodyH / 2 - 20} x2="80" y2={70 - bodyH / 2 - 8} stroke="#64748b" strokeWidth="0.5" />
                <line x1={80 + bodyW} y1={70 - bodyH / 2 - 20} x2={80 + bodyW} y2={70 - bodyH / 2 - 8} stroke="#64748b" strokeWidth="0.5" />
                <text x={80 + bodyW / 2} y={70 - bodyH / 2 - 22} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">L</text>

                {/* Cross-section cut line */}
                <line x1={80 + bodyW + 16} y1={70 - bodyH / 2 - 6} x2={80 + bodyW + 16} y2={70 + bodyH / 2 + 6} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,2" />
                <text x={80 + bodyW + 16} y={70 + bodyH / 2 + 18} textAnchor="middle" className="fill-slate-400" style={{ fontSize: '9px' }}>A-A</text>

                {/* Current arrow */}
                <line x1="30" y1="105" x2="65" y2="105" stroke="#dc2626" strokeWidth="2" markerEnd="url(#rArrowRed)" />
                <text x="48" y="120" textAnchor="middle" className="text-xs fill-red-600" fontStyle="italic">i</text>
              </svg>
            </div>

            {/* Front view (cross-section) */}
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Cross-Section A-A (shows area <em>A</em>)</p>
              <svg viewBox="0 0 180 140" className="w-full max-w-[200px] mx-auto">
                {/* Outer body circle */}
                <circle cx="90" cy="65" r={crossR + 8} fill="#d97706" stroke="#92400e" strokeWidth="1.5" opacity="0.3" />
                {/* Conductor cross-section */}
                <circle cx="90" cy="65" r={crossR} fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
                <text x="90" y={65 + 4} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: '11px' }}>A</text>

                {/* Dimension line for radius */}
                <line x1="90" y1="65" x2={90 + crossR} y2="65" stroke="#64748b" strokeWidth="1" />
                <line x1={90 + crossR} y1="58" x2={90 + crossR} y2="72" stroke="#64748b" strokeWidth="0.5" />
                <text x={90 + crossR / 2} y="58" textAnchor="middle" className="fill-slate-500" style={{ fontSize: '9px' }}>r</text>

                <text x="90" y="130" textAnchor="middle" className="text-xs fill-slate-500">{(area * 1e6).toFixed(2)} mm&sup2;</text>
              </svg>
            </div>
          </div>

          {/* 3. Sliders */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Length: <span className="text-red-600 font-semibold">{length.toFixed(2)} m</span>
              </label>
              <input type="range" min="0.1" max="2" step="0.1" value={length} onChange={(e) => onLengthChange(parseFloat(e.target.value))} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Area: <span className="text-red-600 font-semibold">{(area * 1e6).toFixed(2)} mm&sup2;</span>
              </label>
              <input type="range" min="0.1" max="10" step="0.1" value={area * 1e6} onChange={(e) => onAreaChange(parseFloat(e.target.value) * 1e-6)} className="w-full accent-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Resistivity: <span className="text-red-600 font-semibold">{resistivity.toExponential(2)} &Omega;&middot;m</span>
              </label>
              <input type="range" min="1" max="100" step="1" value={resistivity * 1e8} onChange={(e) => onResistivityChange(parseFloat(e.target.value) * 1e-8)} className="w-full accent-red-500" />
            </div>
          </div>

          {/* 4. Result */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm font-semibold text-red-900 mb-1">Calculated Resistance:</p>
            <p className="text-3xl font-bold text-red-700">{resistance.toFixed(3)} &#937;</p>
          </div>
      </>}
    />
  );
}

/* ─── CAPACITOR ─── */
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
  // Normalized to slider ranges so SVG visibly changes
  // area: 0.005–0.10 (slider 0.5–10 cm²), distance: 0.0001–0.005 (slider 0.1–5 mm)
  const areaNorm = (area - 0.005) / (0.10 - 0.005);   // 0 → 1
  const distNorm = (distance - 0.0001) / (0.005 - 0.0001); // 0 → 1
  const plateH = 40 + areaNorm * 90;   // 40–130 px
  const gap = 25 + distNorm * 80;      // 25–105 px
  const plateFaceSize = 30 + areaNorm * 70; // 30–100 for cross-section

  const plateX1 = 160;
  const plateX2 = plateX1 + gap;
  const cy = 90;

  return (
    <ComponentSectionLayout
      theory={<>
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
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="\epsilon" /> = Permittivity (F/m)</li>
              <li><MathWrapper formula="A" /> = Plate area (m&sup2;)</li>
              <li><MathWrapper formula="d" /> = Separation distance (m)</li>
            </ul>
          </div>
      </>}
      materials={<>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Dielectric Materials</h3>
          <div className="space-y-2">
            {materials.filter(m => m.permittivity).map((material) => (
              <button
                key={material.name}
                onClick={() => onPermittivityChange(material.permittivity!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-green-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  &epsilon; = {material.permittivity?.toExponential(2)} F/m
                </span>
              </button>
            ))}
          </div>
      </>}
      interactive={<>
          {/* 1. Circuit Symbol */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              <line x1="20" y1="30" x2="120" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <line x1="120" y1="8" x2="120" y2="52" stroke="#1e40af" strokeWidth="3" />
              <line x1="136" y1="8" x2="136" y2="52" stroke="#1e40af" strokeWidth="3" />
              <line x1="136" y1="30" x2="260" y2="30" stroke="#1e40af" strokeWidth="2.5" />
              <text x="128" y="6" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">C</text>
            </svg>
          </div>

          {/* 2. Engineering Drawing: Side View + Front View */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>

            {/* Side view */}
            <div className="mb-3">
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Side View (showing gap <em>d</em> and plate height)</p>
              <svg viewBox="0 0 400 200" className="w-full">
                <defs>
                  <marker id="cArrowDim" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0 1, 8 4, 0 7" fill="#64748b" />
                  </marker>
                  <marker id="cArrowE" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <polygon points="0 0.5, 6 3, 0 5.5" fill="#dc2626" />
                  </marker>
                  <linearGradient id="cPlate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>

                {/* Wire leads */}
                <line x1="60" y1={cy} x2={plateX1} y2={cy} stroke="#1e40af" strokeWidth="3" />
                <line x1={plateX2 + 12} y1={cy} x2="360" y2={cy} stroke="#1e40af" strokeWidth="3" />

                {/* Plates */}
                <rect x={plateX1 - 12} y={cy - plateH / 2} width="12" height={plateH} rx="2" fill="url(#cPlate)" stroke="#1e40af" strokeWidth="1.5" />
                <rect x={plateX2} y={cy - plateH / 2} width="12" height={plateH} rx="2" fill="url(#cPlate)" stroke="#1e40af" strokeWidth="1.5" />

                {/* Dielectric fill */}
                <rect x={plateX1} y={cy - plateH / 2} width={gap} height={plateH} fill="#fef3c7" opacity="0.5" />

                {/* Electric field arrows */}
                {[-2, -1, 0, 1, 2].filter(o => Math.abs(o) * (plateH / 6) < plateH / 2 - 4).map((offset) => (
                  <line
                    key={offset}
                    x1={plateX1 + 4}
                    y1={cy + offset * (plateH / 6)}
                    x2={plateX2 - 2}
                    y2={cy + offset * (plateH / 6)}
                    stroke="#dc2626"
                    strokeWidth="1"
                    strokeDasharray="4,3"
                    markerEnd="url(#cArrowE)"
                  />
                ))}

                {/* Charge symbols */}
                {[-2, -1, 0, 1, 2].filter(o => Math.abs(o) * (plateH / 6) < plateH / 2 - 4).map((offset) => (
                  <g key={`ch-${offset}`}>
                    <text x={plateX1 - 18} y={cy + offset * (plateH / 6) + 4} textAnchor="middle" className="text-xs font-bold" fill="#2563eb">+</text>
                    <text x={plateX2 + 18} y={cy + offset * (plateH / 6) + 4} textAnchor="middle" className="text-xs font-bold" fill="#2563eb">&minus;</text>
                  </g>
                ))}

                {/* Dimension: gap d */}
                <line x1={plateX1} y1={cy + plateH / 2 + 16} x2={plateX2 + 12} y2={cy + plateH / 2 + 16} stroke="#64748b" strokeWidth="1" markerEnd="url(#cArrowDim)" />
                <line x1={plateX1} y1={cy + plateH / 2 + 10} x2={plateX1} y2={cy + plateH / 2 + 22} stroke="#64748b" strokeWidth="0.5" />
                <line x1={plateX2 + 12} y1={cy + plateH / 2 + 10} x2={plateX2 + 12} y2={cy + plateH / 2 + 22} stroke="#64748b" strokeWidth="0.5" />
                <text x={(plateX1 + plateX2 + 12) / 2} y={cy + plateH / 2 + 32} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">d</text>

                {/* Dimension: plate height (represents A) */}
                <line x1={plateX1 - 30} y1={cy - plateH / 2} x2={plateX1 - 30} y2={cy + plateH / 2} stroke="#64748b" strokeWidth="1" markerEnd="url(#cArrowDim)" />
                <line x1={plateX1 - 36} y1={cy - plateH / 2} x2={plateX1 - 24} y2={cy - plateH / 2} stroke="#64748b" strokeWidth="0.5" />
                <line x1={plateX1 - 36} y1={cy + plateH / 2} x2={plateX1 - 24} y2={cy + plateH / 2} stroke="#64748b" strokeWidth="0.5" />
                <text x={plateX1 - 42} y={cy + 4} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">A</text>

                {/* E-field label */}
                <text x={(plateX1 + plateX2) / 2 + 6} y={cy - plateH / 2 + 12} textAnchor="middle" className="text-xs fill-red-500 font-medium">E field</text>
              </svg>
            </div>

            {/* Front view (plate face) */}
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Front View (plate face, area <em>A</em>)</p>
              <svg viewBox="0 0 180 150" className="w-full max-w-[200px] mx-auto">
                {/* Plate face as square */}
                <rect
                  x={90 - plateFaceSize / 2}
                  y={68 - plateFaceSize / 2}
                  width={plateFaceSize}
                  height={plateFaceSize}
                  rx="3"
                  fill="#93c5fd"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                />
                <text x="90" y={72} textAnchor="middle" className="fill-blue-900 font-bold" style={{ fontSize: '11px' }}>A</text>

                {/* Charge symbols on face */}
                {[-1, 0, 1].map(r => [-1, 0, 1].map(c => (
                  <text
                    key={`${r}-${c}`}
                    x={90 + c * (plateFaceSize * 0.28)}
                    y={68 + r * (plateFaceSize * 0.28) + 3}
                    textAnchor="middle"
                    fill="#1e40af"
                    opacity="0.4"
                    style={{ fontSize: '10px' }}
                  >+</text>
                )))}

                {/* Width dimension */}
                <line x1={90 - plateFaceSize / 2} y1={68 + plateFaceSize / 2 + 12} x2={90 + plateFaceSize / 2} y2={68 + plateFaceSize / 2 + 12} stroke="#64748b" strokeWidth="0.8" />
                <line x1={90 - plateFaceSize / 2} y1={68 + plateFaceSize / 2 + 7} x2={90 - plateFaceSize / 2} y2={68 + plateFaceSize / 2 + 17} stroke="#64748b" strokeWidth="0.5" />
                <line x1={90 + plateFaceSize / 2} y1={68 + plateFaceSize / 2 + 7} x2={90 + plateFaceSize / 2} y2={68 + plateFaceSize / 2 + 17} stroke="#64748b" strokeWidth="0.5" />

                <text x="90" y="145" textAnchor="middle" className="text-xs fill-slate-500">{(area * 10000).toFixed(2)} cm&sup2;</text>
              </svg>
            </div>
          </div>

          {/* 3. Sliders */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plate Area: <span className="text-green-600 font-semibold">{(area * 10000).toFixed(2)} cm&sup2;</span>
              </label>
              <input type="range" min="0.5" max="10" step="0.5" value={area * 10000} onChange={(e) => onAreaChange(parseFloat(e.target.value) / 10000)} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Distance: <span className="text-green-600 font-semibold">{(distance * 1000).toFixed(2)} mm</span>
              </label>
              <input type="range" min="0.1" max="5" step="0.1" value={distance * 1000} onChange={(e) => onDistanceChange(parseFloat(e.target.value) / 1000)} className="w-full accent-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Permittivity: <span className="text-green-600 font-semibold">{permittivity.toExponential(2)} F/m</span>
              </label>
              <input type="range" min="8.854" max="40" step="0.1" value={permittivity * 1e12} onChange={(e) => onPermittivityChange(parseFloat(e.target.value) * 1e-12)} className="w-full accent-green-500" />
            </div>
          </div>

          {/* 4. Result */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm font-semibold text-green-900 mb-1">Calculated Capacitance:</p>
            <p className="text-3xl font-bold text-green-700">{(capacitance * 1e12).toFixed(2)} pF</p>
          </div>
      </>}
    />
  );
}

/* ─── INDUCTOR ─── */
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
  const coilR = Math.max(Math.sqrt(area * 10000) * 35, 18); // ellipse ry, 18–70
  const coilW = length * 500; // total coil width px
  const crossR = Math.max(Math.sqrt(area * 10000) * 30, 14); // cross-section radius

  return (
    <ComponentSectionLayout
      theory={<>
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
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 ml-4">
              <li><MathWrapper formula="N" /> = Number of turns</li>
              <li><MathWrapper formula="\mu" /> = Permeability (H/m)</li>
              <li><MathWrapper formula="A" /> = Core area (m&sup2;)</li>
              <li><MathWrapper formula="l" /> = Coil length (m)</li>
            </ul>
          </div>
      </>}
      materials={<>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Core Materials</h3>
          <div className="space-y-2">
            {materials.filter(m => m.permeability).slice(0, 3).map((material) => (
              <button
                key={material.name}
                onClick={() => onPermeabilityChange(material.permeability!)}
                className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-purple-50 transition-colors text-sm"
              >
                <span className="font-medium">{material.name}</span>
                <span className="text-slate-600 ml-2">
                  &mu; = {material.permeability?.toExponential(2)} H/m
                </span>
              </button>
            ))}
            <button
              onClick={() => onPermeabilityChange(6.3e-3)}
              className="w-full text-left px-4 py-2 rounded bg-slate-50 hover:bg-purple-50 transition-colors text-sm"
            >
              <span className="font-medium">Iron Core</span>
              <span className="text-slate-600 ml-2">&mu; = 6.30e-3 H/m</span>
            </button>
          </div>
      </>}
      interactive={<>
          {/* 1. Circuit Symbol */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Circuit Symbol</p>
            <svg viewBox="0 0 280 60" className="w-full max-w-xs mx-auto">
              <line x1="20" y1="35" x2="60" y2="35" stroke="#059669" strokeWidth="2.5" />
              <path d="M60,35 C60,15 80,15 80,35 C80,15 100,15 100,35 C100,15 120,15 120,35 C120,15 140,15 140,35 C140,15 160,15 160,35 C160,15 180,15 180,35" fill="none" stroke="#059669" strokeWidth="2.5" />
              <line x1="180" y1="35" x2="260" y2="35" stroke="#059669" strokeWidth="2.5" />
              <text x="120" y="12" textAnchor="middle" className="text-xs fill-slate-700 font-semibold">L</text>
            </svg>
          </div>

          {/* 2. Engineering Drawing: Side View + Cross-Section */}
          <div className="bg-slate-50 p-4 rounded-lg mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Physical Structure</p>

            {/* Side view */}
            <div className="mb-3">
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Side View (shows turns <em>N</em> and length <em>l</em>)</p>
              <svg viewBox="0 0 400 200" className="w-full">
                <defs>
                  <marker id="iArrowDim" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <polygon points="0 1, 8 4, 0 7" fill="#64748b" />
                  </marker>
                </defs>

                {/* Wire leads */}
                <line x1="40" y1="100" x2="95" y2="100" stroke="#1e40af" strokeWidth="3" />
                <line x1={105 + coilW} y1="100" x2={105 + coilW + 55} y2="100" stroke="#1e40af" strokeWidth="3" />

                {/* Coil turns */}
                {Array.from({ length: Math.min(turns, 20) }).map((_, i) => {
                  const x = 100 + (i * coilW) / Math.min(turns, 20);
                  return (
                    <ellipse
                      key={i}
                      cx={x}
                      cy="100"
                      rx="15"
                      ry={coilR}
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {/* Length dimension */}
                <line x1="100" y1={100 - coilR - 14} x2={100 + coilW} y2={100 - coilR - 14} stroke="#64748b" strokeWidth="1" markerEnd="url(#iArrowDim)" />
                <line x1="100" y1={100 - coilR - 20} x2="100" y2={100 - coilR - 8} stroke="#64748b" strokeWidth="0.5" />
                <line x1={100 + coilW} y1={100 - coilR - 20} x2={100 + coilW} y2={100 - coilR - 8} stroke="#64748b" strokeWidth="0.5" />
                <text x={100 + coilW / 2} y={100 - coilR - 22} textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">l</text>

                {/* Area dimension (coil height) */}
                <line x1="70" y1={100 - coilR} x2="70" y2={100 + coilR} stroke="#64748b" strokeWidth="1" markerEnd="url(#iArrowDim)" />
                <line x1="64" y1={100 - coilR} x2="76" y2={100 - coilR} stroke="#64748b" strokeWidth="0.5" />
                <line x1="64" y1={100 + coilR} x2="76" y2={100 + coilR} stroke="#64748b" strokeWidth="0.5" />
                <text x="52" y="103" textAnchor="middle" className="text-xs fill-slate-600" fontStyle="italic">A</text>
              </svg>
              <p className="text-center text-xs text-slate-500 mt-1">
                N = {turns} turns {turns > 20 && '(showing 20)'}
              </p>
            </div>

            {/* Front view (core cross-section) */}
            <div>
              <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase tracking-wider">Cross-Section (core area <em>A</em>)</p>
              <svg viewBox="0 0 180 140" className="w-full max-w-[200px] mx-auto">
                {/* Coil wire ring (outer) */}
                <circle cx="90" cy="65" r={crossR + 12} fill="none" stroke="#7c3aed" strokeWidth="10" opacity="0.2" />
                {/* Core */}
                <circle cx="90" cy="65" r={crossR} fill="#e9d5ff" stroke="#7c3aed" strokeWidth="1.5" />
                <text x="90" y={69} textAnchor="middle" className="fill-purple-800 font-bold" style={{ fontSize: '11px' }}>A</text>

                {/* Radius dimension */}
                <line x1="90" y1="65" x2={90 + crossR} y2="65" stroke="#64748b" strokeWidth="1" />
                <line x1={90 + crossR} y1="58" x2={90 + crossR} y2="72" stroke="#64748b" strokeWidth="0.5" />
                <text x={90 + crossR / 2} y="58" textAnchor="middle" className="fill-slate-500" style={{ fontSize: '9px' }}>r</text>

                <text x="90" y="130" textAnchor="middle" className="text-xs fill-slate-500">{(area * 10000).toFixed(2)} cm&sup2;</text>
              </svg>
            </div>
          </div>

          {/* 3. Sliders */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Turns: <span className="text-purple-600 font-semibold">{turns}</span>
              </label>
              <input type="range" min="10" max="500" step="10" value={turns} onChange={(e) => onTurnsChange(parseFloat(e.target.value))} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Core Area: <span className="text-purple-600 font-semibold">{(area * 10000).toFixed(2)} cm&sup2;</span>
              </label>
              <input type="range" min="0.5" max="10" step="0.5" value={area * 10000} onChange={(e) => onAreaChange(parseFloat(e.target.value) / 10000)} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Coil Length: <span className="text-purple-600 font-semibold">{(length * 100).toFixed(1)} cm</span>
              </label>
              <input type="range" min="5" max="50" step="1" value={length * 100} onChange={(e) => onLengthChange(parseFloat(e.target.value) / 100)} className="w-full accent-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Permeability: <span className="text-purple-600 font-semibold">{permeability.toExponential(2)} H/m</span>
              </label>
              <input type="range" min="1.257" max="10" step="0.1" value={permeability * 1e6} onChange={(e) => onPermeabilityChange(parseFloat(e.target.value) * 1e-6)} className="w-full accent-purple-500" />
            </div>
          </div>

          {/* 4. Result */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm font-semibold text-purple-900 mb-1">Calculated Inductance:</p>
            <p className="text-3xl font-bold text-purple-700">{(inductance * 1000).toFixed(2)} mH</p>
          </div>
      </>}
    />
  );
}
