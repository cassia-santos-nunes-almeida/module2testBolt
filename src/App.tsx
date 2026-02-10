import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { Overview } from './components/modules/Overview';
import { ComponentPhysics } from './components/modules/ComponentPhysics';
import { TimeDomain } from './components/modules/TimeDomain';
import { LaplaceTheory } from './components/modules/LaplaceTheory';
import { SDomainAnalysis } from './components/modules/SDomainAnalysis';
import { InteractiveLab } from './components/modules/InteractiveLab';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/component-physics" element={<ComponentPhysics />} />
            <Route path="/time-domain" element={<TimeDomain />} />
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
