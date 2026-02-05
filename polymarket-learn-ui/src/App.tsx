import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SkipLink } from './components/SkipLink';

import { LessonSkeleton } from './components/LessonSkeleton';

// Lazy load components for code splitting
const Layout = lazy(() => import('./components/Layout').then(m => ({ default: m.Layout })));
const LessonView = lazy(() => import('./components/LessonView').then(m => ({ default: m.LessonView })));
const CategoryOverview = lazy(() => import('./components/CategoryOverview').then(m => ({ default: m.CategoryOverview })));
const WelcomeModal = lazy(() => import('./components/WelcomeModal').then(m => ({ default: m.WelcomeModal })));

// Landing page components - also lazy loaded
const Hero = lazy(() => import('./components/Hero').then(m => ({ default: m.Hero })));
const FeatureSection = lazy(() => import('./components/FeatureSection').then(m => ({ default: m.FeatureSection })));
const HowItWorks = lazy(() => import('./components/HowItWorks').then(m => ({ default: m.HowItWorks })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const Navbar = lazy(() => import('./components/Navbar').then(m => ({ default: m.Navbar })));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-zinc-500 text-sm">Loading...</span>
    </div>
  </div>
);

// Loading fallback for inline components
const InlineLoader = () => (
  <div className="flex items-center justify-center py-12">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Landing Page with all sections
const Landing = () => (
  <div className="bg-black">
    <SkipLink targetId="landing-main" />
    <Suspense fallback={<div className="h-16" />}>
      <Navbar />
    </Suspense>
    <main id="landing-main" tabIndex={-1} className="outline-none">
    <Suspense fallback={<div className="h-screen bg-black" />}>
      <Hero />
    </Suspense>
    <Suspense fallback={<InlineLoader />}>
      <FeatureSection />
    </Suspense>
    <Suspense fallback={<InlineLoader />}>
      <HowItWorks />
    </Suspense>
    <Suspense fallback={<InlineLoader />}>
      <FAQ />
    </Suspense>
    <Suspense fallback={<InlineLoader />}>
      <Footer />
    </Suspense>
    </main>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <WelcomeModal />
      </Suspense>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/learn" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Layout />
          </Suspense>
        }>
          {/* Default redirect to first lesson */}
          <Route index element={<Navigate to="/learn/get-started/what-is-polymarket" replace />} />
          {/* Category overview page */}
          <Route path=":category" element={
            <Suspense fallback={<InlineLoader />}>
              <CategoryOverview />
            </Suspense>
          } />
          {/* Individual lesson */}
          <Route path=":category/:slug" element={
            <Suspense fallback={<LessonSkeleton />}>
              <LessonView />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
