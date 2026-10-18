import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public: the sign in / create account page */}
        <Route path="/auth" element={<Auth />} />

        {/* Everything below requires an account. Signed-out visitors are
            redirected to /auth, so the site opens on the sign-in page. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock/:symbol" element={<Stock />} />
            {/* Placeholder routes for remaining sidebar items - build out
                as their own pages the same way Dashboard was built. */}
            <Route path="/portfolio" element={<Dashboard />} />
            <Route path="/analysis" element={<Dashboard />} />
            <Route path="/market" element={<Dashboard />} />
            <Route path="/community" element={<Dashboard />} />
            <Route path="/settings" element={<Dashboard />} />
            <Route path="/support" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
