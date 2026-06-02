import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/public/HomePage';
import JoinLifehousePage from '@/pages/public/JoinLifehousePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
