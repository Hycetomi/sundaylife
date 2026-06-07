import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import VolunteerDashboard from './VolunteerDashboard';
import TriagePage from './TriagePage';
import SpacesPage from './SpacesPage';
import LifehousePage from './LifehousePage';
import AdminPage from './AdminPage';
import VolunteersPage from './VolunteersPage';

const DashboardPage = () => (
  <DashboardLayout>
    <Routes>
      <Route index element={<VolunteerDashboard />} />
      <Route
        path="triage"
        element={
          <ProtectedRoute requiredRole="Lead">
            <TriagePage />
          </ProtectedRoute>
        }
      />
      <Route path="spaces" element={<SpacesPage />} />
      <Route
        path="lifehouse"
        element={
          <ProtectedRoute requiredRole="Lead">
            <LifehousePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="volunteers"
        element={
          <ProtectedRoute requiredRole="Lead">
            <VolunteersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRole="Admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </DashboardLayout>
);

export default DashboardPage;
