import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddFund from './pages/AddFund';
import FundDetail from './pages/FundDetail';

export default function App() {
  return (
    <HashRouter>
      <div className="max-w-lg mx-auto min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddFund />} />
          <Route path="/fund/:code" element={<FundDetail />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
