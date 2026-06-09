import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/public/HomePage';
import JoinLifehousePage from '@/pages/public/JoinLifehousePage';
import BlogPulsePage from '@/pages/public/BlogPulsePage';
import ArticlePage from '@/pages/public/ArticlePage';
import VolunteerPage from '@/pages/public/VolunteerPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

function App() {
  useLenis();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
        <div className="min-h-screen font-general bg-pink-swirl text-bitter-liquorice overflow-x-hidden selection:bg-waxy-corn selection:text-bitter-liquorice">
          <Routes>
            {/* Public site */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/join-a-lifehouse"
              element={
                <>
                  <Navbar />
                  <JoinLifehousePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blog-pulse"
              element={
                <>
                  <Navbar />
                  <BlogPulsePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/blog-pulse/:slug"
              element={
                <>
                  <Navbar />
                  <ArticlePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/volunteer"
              element={
                <>
                  <Navbar />
                  <VolunteerPage />
                  <Footer />
                </>
              }
            />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard — protected (Phase 3 adds role-gated sub-routes) */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Suspense fallback={
                    <div className="min-h-screen bg-bitter-liquorice flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-4 border-waxy-corn border-t-transparent animate-spin" />
                    </div>
                  }>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
