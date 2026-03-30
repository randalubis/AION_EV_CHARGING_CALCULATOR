import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
// import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { siteConfig } from './config';
import './App.css';

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const TripPlannerPage = lazy(() => import('./pages/TripPlannerPage'));
const TCOPage = lazy(() => import('./pages/TCOPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FFC300] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/50 text-sm">Memuat...</p>
      </div>
    </div>
  );
}

function AppContent() {
  // Initialize Lenis smooth scroll - temporarily disabled for navigation fix
  // useLenis();

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
      <main className="relative w-full">
        <Suspense fallback={<PageLoader />}>
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
