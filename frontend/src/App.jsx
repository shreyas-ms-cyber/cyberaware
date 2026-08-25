import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/index.css';
import AppShell from './components/layout/AppShell';
import Home from './pages/Home';
import Learn from './pages/Learn';
import ModuleDetail from './pages/ModuleDetail';
import Quiz from './pages/Quiz';
import Scenarios from './pages/Scenarios';
import Progress from './pages/Progress';
import Badges from './pages/Badges';
import AICoach from './pages/AICoach';
import Certificate from './pages/Certificate';
import Verify from './pages/Verify';
import About from './pages/About';

function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/module/:id" element={<ModuleDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz/:moduleId" element={<Quiz />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/scenarios/:moduleId" element={<Scenarios />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/verify/:id" element={<Verify />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AppShell>
    </Router>
  );
}

export default App;
