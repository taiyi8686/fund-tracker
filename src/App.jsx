import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './utils/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddFund from './pages/AddFund';
import FundDetail from './pages/FundDetail';

function ProtectedRoute({ children }) {
  if (!getCurrentUser()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <div className="max-w-lg mx-auto min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddFund /></ProtectedRoute>} />
          <Route path="/fund/:code" element={<ProtectedRoute><FundDetail /></ProtectedRoute>} />
        </Routes>
      </div>
    </HashRouter>
  );
}
