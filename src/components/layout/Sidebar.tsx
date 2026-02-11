import { NavLink, useLocation } from 'react-router-dom';
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
  { to: '/', icon: Home, label: 'Overview', step: 0 },
  { to: '/component-physics', icon: Zap, label: 'Component Physics', step: 1 },
  { to: '/circuit-analysis', icon: Clock, label: 'Circuit Analysis', step: 2 },
  { to: '/laplace-theory', icon: FunctionSquare, label: 'Laplace Theory', step: 3 },
  { to: '/s-domain', icon: GitBranch, label: 'S-Domain Analysis', step: 4 },
  { to: '/interactive-lab', icon: FlaskConical, label: 'Interactive Lab', step: 5 },
];

export function Sidebar() {
  const location = useLocation();
  const currentIndex = navigationLinks.findIndex(link =>
    link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to)
  );

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-br from-engineering-blue-600 to-engineering-blue-800">
        <h1 className="text-xl font-bold text-white">EM&AC Lab</h1>
        <p className="text-sm text-engineering-blue-200 mt-1">Module 2: Circuit Analysis</p>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-2">Learning Path</p>
        <ul className="space-y-1">
          {navigationLinks.map((link, index) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm',
                    isActive
                      ? 'bg-engineering-blue-50 text-engineering-blue-700 font-semibold border-l-3 border-engineering-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )
                }
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors',
                  index === currentIndex
                    ? 'bg-engineering-blue-600 text-white'
                    : index < currentIndex
                    ? 'bg-engineering-blue-100 text-engineering-blue-600'
                    : 'bg-slate-100 text-slate-400'
                )}>
                  <link.icon className="w-3.5 h-3.5" />
                </div>
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[10px] text-slate-400 text-center font-medium tracking-wide">
          CA/EM&CA Course
        </p>
        <p className="text-[10px] text-slate-400 text-center mt-0.5">
          &copy; 2026 LUT University
        </p>
      </div>
    </aside>
  );
}
