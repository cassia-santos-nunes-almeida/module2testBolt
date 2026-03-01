import { MathWrapper } from '../../components/ui/MathWrapper';
import {
  capacitanceFormula,
  materials,
} from '../../utils/componentMath';
import { ComponentSectionLayout } from './ComponentSectionLayout';
import { CapacitorDiagram } from './CapacitorDiagram';

interface CapacitorSectionProps {
  area: number;
  distance: number;
  permittivity: number;
  capacitance: number;
  onAreaChange: (v: number) => void;
  onDistanceChange: (v: number) => void;
  onPermittivityChange: (v: number) => void;
}

export function CapacitorSection({
  area,
  distance,
  permittivity,
  capacitance,
  onAreaChange,
  onDistanceChange,
  onPermittivityChange,
}: CapacitorSectionProps) {
  // Normalized to slider ranges so SVG visibly changes
  // area: 0.005-0.10 (slider 0.5-10 cm2), distance: 0.0001-0.005 (slider 0.1-5 mm)
  const areaNorm = (area - 0.005) / (0.10 - 0.005);   // 0 -> 1
  const distNorm = (distance - 0.0001) / (0.005 - 0.0001); // 0 -> 1
  const plateH = 40 + areaNorm * 90;   // 40-130 px
  const gap = 25 + distNorm * 80;      // 25-105 px
  const plateFaceSize = 30 + areaNorm * 70; // 30-100 for cross-section

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
          <CapacitorDiagram
            plateH={plateH}
            gap={gap}
            plateFaceSize={plateFaceSize}
            plateX1={plateX1}
            plateX2={plateX2}
            cy={cy}
            area={area}
          />

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
