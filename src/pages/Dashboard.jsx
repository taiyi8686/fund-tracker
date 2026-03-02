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
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadData]);

  // 获取当前日期 MM-DD
  const today = new Date();
  const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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
          <AssetSummary funds={funds} estimates={estimates} loading={loading} />

          {/* 表头 */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 text-xs text-gray-400">
            <span className="flex-1">基金</span>
            <span className="text-right mx-4 min-w-[70px]">当日收益 {dateStr}</span>
            <span className="text-right min-w-[70px]">持有收益</span>
          </div>

          {/* 基金列表 */}
          <div className="bg-white">
            {funds.map((fund, i) => (
              <div key={fund.code}>
                <div className="px-4">
                  <FundCard fund={fund} estimate={estimates[fund.code]} />
                </div>
                {i < funds.length - 1 && <div className="border-b border-gray-50 mx-4" />}
              </div>
            ))}
          </div>

          {/* 底部操作 */}
          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={() => navigate('/add')}
              className="text-sm text-blue-500 flex items-center gap-1"
            >
              <span className="text-lg leading-none">+</span> 新增持有
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center mt-32 px-8">
          <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p className="text-gray-400 text-sm mb-2">还没有添加基金</p>
          <p className="text-gray-300 text-xs mb-6">点击下方按钮，添加你持有的基金</p>
          <button
            onClick={() => navigate('/add')}
            className="px-8 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600"
          >
            + 新增持有
          </button>
        </div>
      )}
    </div>
  );
}
