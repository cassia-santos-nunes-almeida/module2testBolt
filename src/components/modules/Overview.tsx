import { BookOpen, Target, Compass, AlertTriangle, Scale } from 'lucide-react';
import { MathWrapper } from '../common/MathWrapper';

export function Overview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          EM&AC Lab: Module 2 - Circuit Analysis
        </h1>
        <p className="text-lg text-slate-600">
          LUT University | Electromagnetism and Circuit Analysis Course
        </p>
      </div>

      <section className="bg-white rounded-lg shadow-md p-6 border-l-4 border-engineering-blue-600">
        <div className="flex items-start gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-engineering-blue-600 mt-1" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Course Orientation</h2>
            <p className="text-slate-700 leading-relaxed">
              This platform is tailored for the Electromagnetism and Circuit Analysis course.
              It bridges the gap between <span className="font-semibold text-engineering-blue-700">physical intuition</span> and{' '}
              <span className="font-semibold text-engineering-blue-700">rigorous mathematical modeling</span>.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-engineering-blue-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Physical Domain
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Understanding energy storage in <strong>Electric Fields</strong> (Capacitors) and{' '}
              <strong>Magnetic Fields</strong> (Inductors) using time-domain differential equations.
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-lg border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <FunctionSquare className="w-5 h-5" />
              Mathematical Domain
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Using the <strong>Laplace Transform</strong> to linearize differential equations
              into algebraic problems for easy solution.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <Target className="w-6 h-6 text-green-600 mt-1" />
          <h2 className="text-2xl font-semibold text-slate-900">Learning Objectives</h2>
        </div>

        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              Master the constitutive laws of resistors, capacitors, and inductors:{' '}
              <MathWrapper formula="V=IR" />,{' '}
              <MathWrapper formula="I=C \frac{dV}{dt}" />,{' '}
              <MathWrapper formula="V=L \frac{dI}{dt}" />.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              Analyze first-order (RC, RL) and second-order (RLC) circuits in the time domain.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              Apply the Laplace Transform to solve circuit differential equations algebraically.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-slate-700">
              Visualize transient responses and understand the effect of damping ratios{' '}
              (<MathWrapper formula="\zeta" />) and natural frequency{' '}
              (<MathWrapper formula="\omega_0" />).
            </p>
          </li>
        </ul>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <Compass className="w-6 h-6 text-engineering-blue-600 mt-1" />
          <h2 className="text-2xl font-semibold text-slate-900">Platform Guide</h2>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Navigation</h4>
            <p className="text-slate-700 text-sm">
              Use the sidebar to move between topics. The content is structured sequentially
              from physics basics to advanced simulation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">Interactive Simulation</h4>
            <p className="text-slate-700 text-sm">
              The 'Interactive Lab' allows you to tweak circuit parameters ({' '}
              <MathWrapper formula="R" />, <MathWrapper formula="L" />, <MathWrapper formula="C" />
              ) and see the voltage/current response in real-time.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">AI Tutor</h4>
            <p className="text-slate-700 text-sm">
              Click the floating button in the bottom right to ask questions. The AI is powered
              by Gemini and specialized in circuit theory.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-amber-50 rounded-lg shadow-md p-6 border-l-4 border-amber-500">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-1" />
          <h2 className="text-2xl font-semibold text-amber-900">Educational Disclaimer</h2>
        </div>

        <p className="text-slate-700 text-sm leading-relaxed mb-4">
          This application is designed for educational purposes to assist with the
          "Electromagnetism and Circuit Analysis" curriculum. While the simulations are accurate
          for ideal linear components, real-world circuits may exhibit non-linear behavior,
          parasitic effects, and tolerance variations not modeled here. The AI Tutor provides
          generated responses which should be verified against course textbooks and official
          lecture notes.
        </p>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
          <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            ATTENTION: AI Generation Disclaimer
          </h4>
          <p className="text-red-800 text-sm leading-relaxed">
            This educational application was generated using AI technology. While designed to
            align with rigorous engineering standards, it may contain errors, simplifications,
            or hallucinations. <strong>Cross-reference all formulas, diagrams, and explanations
            with your official course reference books.</strong> If discrepancies are found,
            inform your teacher. This tool is a supplementary study aid and should not be used
            as the sole resource for exam preparation.
          </p>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-3 mb-4">
          <Scale className="w-6 h-6 text-slate-600 mt-1" />
          <h2 className="text-2xl font-semibold text-slate-900">License & Ownership</h2>
        </div>

        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <strong>© 2026 CA/EM&CA, LUT University.</strong>
          </p>
          <p>
            This work is licensed under a{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-engineering-blue-600 underline hover:text-engineering-blue-700"
            >
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
            </a>
            .
          </p>

          <div className="bg-slate-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-slate-800 mb-2">Usage in Teaching</h4>
            <p className="text-slate-600 text-sm">
              This tool is provided for educational purposes within LUT University. Any third-party
              copyrighted materials included (such as textbook excerpts) are used under the
              Kopiosto Copyright License for Higher Education.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function FunctionSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" />
      <path d="M9 11.2h5.7" />
    </svg>
  );
}
