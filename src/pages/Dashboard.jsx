import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import AssetSummary from '../components/AssetSummary';
import AccountCard from '../components/AccountCard';
import FundCard from '../components/FundCard';
import { getAccounts, getAllFundCodes } from '../utils/storage';
import { fetchMultipleFundEstimates } from '../utils/fundApi';
import { getCurrentUser, logout } from '../utils/auth';

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [estimates, setEstimates] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'summary';
  const navigate = useNavigate();
  const username = getCurrentUser();

  const setTab = (tab) => {
    setSearchParams({ tab }, { replace: true });
  };

  const loadData = useCallback(async () => {
    const accs = getAccounts();
    setAccounts(accs);

    const codes = getAllFundCodes();
    if (codes.length === 0) return;

    setLoading(true);
    try {
      const data = await fetchMultipleFundEstimates(codes);
      setEstimates(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadData]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const currentAccount = accounts.find(a => a.id === activeTab);
  const allFunds = accounts.flatMap(a => a.funds);

  const dateStr = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  return (
    <div className="min-h-screen bg-[#F5F6FA] safe-bottom">
      <Header
        title="太一基金小助手"
        leftContent={
          <button onClick={handleLogout} className="text-[13px] text-gray-400">退出</button>
        }
        rightAction={
          <div className="flex items-center gap-2.5">
            <span className="text-[13px] text-gray-400">{username}</span>
            <button onClick={loadData} disabled={loading} className="text-gray-400">
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        }
      />

      {/* 标签栏 */}
      <div className="flex items-center bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTab('summary')}
          className={`relative px-5 py-3 text-[15px] whitespace-nowrap transition-colors ${
            activeTab === 'summary'
              ? 'tab-active'
              : 'text-gray-500'
          }`}
        >
          账户汇总
        </button>
        {accounts.map(acc => (
          <button
            key={acc.id}
            onClick={() => setTab(acc.id)}
            className={`relative px-5 py-3 text-[15px] whitespace-nowrap transition-colors ${
              activeTab === acc.id
                ? 'tab-active'
                : 'text-gray-500'
            }`}
          >
            {acc.name}
          </button>
        ))}
        <button
          onClick={() => navigate('/add-account')}
          className="px-4 py-3 text-gray-300 text-[20px] leading-none whitespace-nowrap"
        >
          +
        </button>
      </div>

      {/* ========== 账户汇总 ========== */}
      {activeTab === 'summary' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />

          {accounts.length > 0 ? (
            <div className="px-4 mt-3 space-y-3 pb-8">
              {accounts.map(acc => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  estimates={estimates}
                  onClick={() => setTab(acc.id)}
                />
              ))}
              <button
                onClick={() => navigate('/add-account')}
                className="w-full py-3 text-[15px] text-blue-500 bg-white rounded-xl flex items-center justify-center gap-1 active:bg-gray-50"
              >
                <span className="text-[18px] leading-none">+</span> 新增账户
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <svg className="w-20 h-20 text-gray-200 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-400 text-[15px] mb-2">还没有添加账户</p>
              <p className="text-gray-300 text-[13px] mb-6">先创建一个账户，比如「支付宝」</p>
              <button
                onClick={() => navigate('/add-account')}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl text-[15px] font-medium active:bg-blue-600"
              >
                + 新建账户
              </button>
            </div>
          )}
        </>
      )}

      {/* ========== 单个账户 ========== */}
      {currentAccount && (
        <>
          <AssetSummary funds={currentAccount.funds} estimates={estimates} loading={loading} />

          {currentAccount.funds.length > 0 ? (
            <>
              {/* 表头 */}
              <div className="flex items-center px-5 py-2 bg-[#F5F6FA] text-[12px] text-gray-400">
                <span className="flex-1">基金</span>
                <span className="flex-1 text-center">当日收益 {dateStr}</span>
                <span className="flex-1 text-right">持有收益</span>
              </div>

              {/* 基金列表 */}
              <div className="bg-white">
                {currentAccount.funds.map((fund, i) => (
                  <div key={fund.code}>
                    <div className="px-5">
                      <FundCard
                        fund={fund}
                        estimate={estimates[fund.code]}
                        accountId={currentAccount.id}
                      />
                    </div>
                    {i < currentAccount.funds.length - 1 && (
                      <div className="border-b border-gray-50 mx-5" />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <p className="text-gray-400 text-[15px] mb-5">该账户还没有添加基金</p>
            </div>
          )}

          <div className="px-5 py-4">
            <button
              onClick={() => navigate(`/add/${currentAccount.id}`)}
              className="text-[15px] text-blue-500 flex items-center gap-1"
            >
              <span className="text-[18px] leading-none">+</span> 新增持有
            </button>
          </div>
        </>
      )}
    </div>
  );
}
