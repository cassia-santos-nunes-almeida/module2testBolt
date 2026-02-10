import { NavLink } from 'react-router-dom';
import {
  Home,
  Zap,
  Clock,
  FunctionSquare,
  GitBranch,
  FlaskConical,
} from 'lucide-react';
import { cn } from '../../utils/cn';

const navigationLinks = [
  { to: '/', icon: Home, label: 'Overview' },
  { to: '/component-physics', icon: Zap, label: 'Component Physics' },
  { to: '/time-domain', icon: Clock, label: 'Time Domain' },
  { to: '/laplace-theory', icon: FunctionSquare, label: 'Laplace Theory' },
  { to: '/s-domain', icon: GitBranch, label: 'S-Domain Analysis' },
  { to: '/interactive-lab', icon: FlaskConical, label: 'Interactive Lab' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-engineering-blue-700">EM&AC Lab</h1>
        <p className="text-sm text-slate-600 mt-1">Module 2: Circuit Analysis</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-engineering-blue-100 text-engineering-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  )
                }
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 text-center">
          © 2026 LUT University
        </p>
        <p className="text-xs text-slate-500 text-center mt-1">
          CA/EM&CA Course
        </p>
      </div>
    </aside>
  );
}
