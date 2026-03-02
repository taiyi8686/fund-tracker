import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AssetSummary from '../components/AssetSummary';
import FundCard from '../components/FundCard';
import { getFunds } from '../utils/storage';
import { fetchMultipleFundEstimates } from '../utils/fundApi';

export default function Dashboard() {
  const [funds, setFunds] = useState([]);
  const [estimates, setEstimates] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    const storedFunds = getFunds();
    setFunds(storedFunds);
    if (storedFunds.length === 0) return;

    setLoading(true);
    try {
      const codes = storedFunds.map(f => f.code);
      const data = await fetchMultipleFundEstimates(codes);
      setEstimates(data);
    } catch {
      // silently fail, show cached data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh when returning to this page
  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 safe-bottom">
      <Header
        title="基金小助手"
        rightAction={
          <button onClick={loadData} disabled={loading} className="text-gray-500">
            <svg
              className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        }
      />

      {funds.length > 0 ? (
        <>
          <AssetSummary funds={funds} estimates={estimates} />

          <div className="px-4 mt-4 mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              持有基金 ({funds.length})
            </span>
            {loading && (
              <span className="text-xs text-gray-400">更新中...</span>
            )}
          </div>

          <div className="px-4 space-y-3 pb-24">
            {funds.map((fund) => (
              <FundCard
                key={fund.code}
                fund={fund}
                estimate={estimates[fund.code]}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-32 px-8">
          <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-400 text-base mb-2">还没有添加基金</p>
          <p className="text-gray-300 text-sm">点击下方按钮开始追踪你的基金</p>
        </div>
      )}

      <div className="fixed bottom-6 left-0 right-0 px-4 safe-bottom">
        <button
          onClick={() => navigate('/add')}
          className="w-full py-3 bg-gradient-primary text-white rounded-xl font-medium shadow-lg active:opacity-90 transition-opacity"
        >
          + 添加基金
        </button>
      </div>
    </div>
  );
}
