import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { siteConfig } from './config';
import './App.css';

// Eager load all pages to fix navigation issue
import LandingPage from './pages/LandingPage';
import CalculatorPage from './pages/CalculatorPage';
import MapPage from './pages/MapPage';
import TripPlannerPage from './pages/TripPlannerPage';
import TCOPage from './pages/TCOPage';
import CommunityPage from './pages/CommunityPage';

function AppContent() {
  useEffect(() => {
    if (siteConfig.siteTitle) {
      document.title = siteConfig.siteTitle;
    }
    if (siteConfig.siteDescription) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', siteConfig.siteDescription);
    }
    if (siteConfig.language) {
      document.documentElement.lang = siteConfig.language;
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-forest-dark">
      <Navbar />
      <SpeedInsights />
      <Analytics />
      <main className="relative w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/kalkulator" element={<CalculatorPage />} />
          <Route path="/peta-spklu" element={<MapPage />} />
          <Route path="/trip-planner" element={<TripPlannerPage />} />
          <Route path="/tco-calculator" element={<TCOPage />} />
          <Route path="/komunitas" element={<CommunityPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
