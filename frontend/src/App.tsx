import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Stock from './pages/Stock';

function App() {
  return (
    <Routes>
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
    </Routes>
  );
}

export default App;
