interface InductorDiagramProps {
  coilR: number;
  coilW: number;
  crossR: number;
  turns: number;
  area: number;
}

export function InductorDiagram({
  coilR,
  coilW,
  crossR,
  turns,
  area,
}: InductorDiagramProps) {
  return (
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
  );
}
