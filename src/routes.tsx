import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import Agent from './pages/Agent';
import Profile from "./pages/Profile";
import { useAuth } from './hooks/useAuth';

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
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
