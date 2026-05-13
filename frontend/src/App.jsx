import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import AppLayout from "./layouts/AppLayout";
import Clients from "./pages/Clients";
import Dashboard from "./pages/Dashboard";
import EducationHub from "./pages/EducationHub";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import Reminders from "./pages/Reminders";
import Renewals from "./pages/Renewals";
import Settings from "./pages/Settings";


function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-slate-500">Loading AdvisorFlow...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-8 text-sm text-slate-500">Loading AdvisorFlow...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/password-reset" element={<GuestRoute><PasswordReset /></GuestRoute>} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/renewals" element={<Renewals />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/education" element={<EducationHub />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
