import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import Agent from './pages/Agent';
import Profile from './pages/Profile';
import Warehouses from './pages/Warehouses';
import Agents from './pages/Agents';
import Reports from './pages/Reports';
import AuditLogs from './pages/AuditLogs';
import { useAuth } from './hooks/useAuth';
import { Skeleton } from './components/ui/Skeleton';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  
  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-secondary-500">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tracking" element={<Tracking />} />
        <Route path="admin" element={<Admin />} />
        <Route path="agent" element={<Agent />} />
        <Route path="profile" element={<Profile />} />
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="agents" element={<Agents />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>
    </Routes>
  );
}
