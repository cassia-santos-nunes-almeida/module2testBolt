import { MathWrapper } from '../../components/ui/MathWrapper';
import {
  inductanceFormula,
  materials,
} from '../../utils/componentMath';
import { ComponentSectionLayout } from './ComponentSectionLayout';
import { InductorDiagram } from './InductorDiagram';

interface InductorSectionProps {
  turns: number;
  area: number;
  length: number;
  permeability: number;
  inductance: number;
  onTurnsChange: (v: number) => void;
  onAreaChange: (v: number) => void;
  onLengthChange: (v: number) => void;
  onPermeabilityChange: (v: number) => void;
}

export function InductorSection({
  turns,
  area,
  length,
  permeability,
  inductance,
  onTurnsChange,
  onAreaChange,
  onLengthChange,
  onPermeabilityChange,
}: InductorSectionProps) {
  const coilR = Math.max(Math.sqrt(area * 10000) * 35, 18); // ellipse ry, 18-70
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
          <InductorDiagram
            coilR={coilR}
            coilW={coilW}
            crossR={crossR}
            turns={turns}
            area={area}
          />

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
