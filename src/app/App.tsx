import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '../components/layout/ErrorBoundary';
import { Layout } from '../components/layout/Layout';
import { Overview } from '../modules/overview/Overview';
import { ComponentPhysics } from '../modules/component-physics/ComponentPhysics';
import { TimeDomain } from '../modules/time-domain/TimeDomain';
import { LaplaceTheory } from '../modules/laplace-theory/LaplaceTheory';
import { SDomainAnalysis } from '../modules/s-domain/SDomainAnalysis';
import { InteractiveLab } from '../modules/interactive-lab/InteractiveLab';

function App() {
  return (
    <ErrorBoundary>
      <Router basename={import.meta.env.BASE_URL}>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/component-physics" element={<ComponentPhysics />} />
            <Route path="/circuit-analysis" element={<TimeDomain />} />
            <Route path="/laplace-theory" element={<LaplaceTheory />} />
            <Route path="/s-domain" element={<SDomainAnalysis />} />
            <Route path="/interactive-lab" element={<InteractiveLab />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
