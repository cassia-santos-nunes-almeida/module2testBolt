interface CapacitorDiagramProps {
  plateH: number;
  gap: number;
  plateFaceSize: number;
  plateX1: number;
  plateX2: number;
  cy: number;
  area: number;
}

export function CapacitorDiagram({
  plateH,
  gap,
  plateFaceSize,
  plateX1,
  plateX2,
  cy,
  area,
}: CapacitorDiagramProps) {
  return (
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
  );
}
