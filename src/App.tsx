import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { siteConfig } from './config';
import './App.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage'));
const TCOPage = lazy(() => import('./pages/TCOPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-volt border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/kalkulator" element={<CalculatorPage />} />
            <Route path="/peta-spklu" element={<MapPage />} />
            <Route path="/trip-planner" element={<TripPlannerPage />} />
            <Route path="/tco-calculator" element={<TCOPage />} />
            <Route path="/komunitas" element={<CommunityPage />} />
          </Routes>
        </Suspense>
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
