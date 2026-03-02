import { useState, useEffect, useCallback, useRef } from 'react';
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
  const tabsRef = useRef(null);

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

  // 当前账户（如果选择了某个账户 tab）
  const currentAccount = accounts.find(a => a.id === activeTab);

  // 所有基金汇总（用于 AssetSummary）
  const allFunds = accounts.flatMap(a => a.funds);

  // 当前展示的基金列表
  const displayFunds = currentAccount ? currentAccount.funds : [];

  const dateStr = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  return (
    <div className="min-h-screen bg-gray-50 safe-bottom">
      <Header
        title="太一基金小助手"
        leftContent={
          <button onClick={handleLogout} className="text-xs text-gray-400">退出</button>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 max-w-[50px] truncate">{username}</span>
            <button onClick={loadData} disabled={loading} className="text-gray-500">
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
      <div ref={tabsRef} className="flex items-center bg-white border-b border-gray-100 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setTab('summary')}
          className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
            activeTab === 'summary'
              ? 'border-blue-500 text-blue-600 font-medium'
              : 'border-transparent text-gray-500'
          }`}
        >
          账户汇总
        </button>
        {accounts.map(acc => (
          <button
            key={acc.id}
            onClick={() => setTab(acc.id)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === acc.id
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500'
            }`}
          >
            {acc.name}
          </button>
        ))}
        <button
          onClick={() => navigate('/add-account')}
          className="px-3 py-2.5 text-gray-400 text-lg leading-none whitespace-nowrap"
        >
          +
        </button>
      </div>

      {/* 账户汇总视图 */}
      {activeTab === 'summary' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />

          {accounts.length > 0 ? (
            <div className="px-4 mt-3 space-y-3 pb-6">
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
                className="w-full py-3 text-sm text-blue-500 flex items-center justify-center gap-1"
              >
                <span className="text-lg leading-none">+</span> 新增账户
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-400 text-sm mb-2">还没有添加账户</p>
              <p className="text-gray-300 text-xs mb-6">先创建一个账户，比如「支付宝」</p>
              <button
                onClick={() => navigate('/add-account')}
                className="px-8 py-2.5 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600"
              >
                + 新建账户
              </button>
            </div>
          )}
        </>
      )}

      {/* 单个账户视图 */}
      {currentAccount && (
        <>
          <AssetSummary funds={currentAccount.funds} estimates={estimates} loading={loading} />

          {currentAccount.funds.length > 0 ? (
            <>
              <div className="flex justify-between items-center px-4 py-2 bg-gray-50 text-xs text-gray-400">
                <span className="flex-1">基金</span>
                <span className="text-right mx-4 min-w-[70px]">当日收益 {dateStr}</span>
                <span className="text-right min-w-[70px]">持有收益</span>
              </div>

              <div className="bg-white">
                {currentAccount.funds.map((fund, i) => (
                  <div key={fund.code}>
                    <div className="px-4">
                      <FundCard
                        fund={fund}
                        estimate={estimates[fund.code]}
                        accountId={currentAccount.id}
                      />
                    </div>
                    {i < currentAccount.funds.length - 1 && (
                      <div className="border-b border-gray-50 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 px-8">
              <p className="text-gray-400 text-sm mb-4">该账户还没有添加基金</p>
            </div>
          )}

          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={() => navigate(`/add/${currentAccount.id}`)}
              className="text-sm text-blue-500 flex items-center gap-1"
            >
              <span className="text-lg leading-none">+</span> 新增持有
            </button>
          </div>
        </>
      )}
    </div>
  );
}
