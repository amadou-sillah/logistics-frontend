import { Routes, Route, Navigate } from 'react-router-dom';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Layout from './components/layout/Layout';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Landing from './pages/Landing';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Login from './pages/Login';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Registration from './pages/Registration';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from './pages/Dashboard';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Tracking from './pages/Tracking';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Admin from './pages/Admin';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Agent from './pages/Agent';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Profile from "./pages/Profile";
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import { useAuth } from './hooks/useAuth';
import Warehouses from "./pages/Warehouses";
import Agents from "./pages/Agents";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  const { user } = useAuth();

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
        <Route path="warehouses" element={<Warehouses />} />
        <Route path="agents" element={<Agents />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
