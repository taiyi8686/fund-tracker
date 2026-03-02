import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import AssetSummary from '../components/AssetSummary';
import AccountCard from '../components/AccountCard';
import FundCard from '../components/FundCard';
import { getAccounts, getAllFundCodes, getAllFundsAggregated } from '../utils/storage';
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
  const aggregatedFunds = useMemo(() => getAllFundsAggregated(), [accounts]);

  const dateStr = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  // 基金列表渲染（全部/单账户 共用）
  const renderFundList = (funds, accountId) => (
    <>
      {/* 列头 */}
      <div className="flex items-center px-4 py-2 bg-[#F5F6F8] border-b border-gray-100">
        <div className="flex-1" />
        <div className="w-[85px] text-right flex-shrink-0">
          <div className="text-[11px] text-gray-400 leading-tight">当日收益</div>
          <div className="text-[11px] text-gray-400 leading-tight">{dateStr}</div>
        </div>
        <div className="w-[85px] text-right flex-shrink-0">
          <div className="text-[11px] text-gray-400 leading-tight">持有收益</div>
          <div className="text-[11px] text-gray-400 leading-tight">{dateStr}</div>
        </div>
      </div>

      {/* 基金行 */}
      <div className="bg-white">
        {funds.map((fund, i) => (
          <div key={fund.code}>
            <FundCard
              fund={fund}
              estimate={estimates[fund.code]}
              accountId={accountId}
              clickable={!!accountId}
            />
            {i < funds.length - 1 && (
              <div className="border-b border-gray-100 mx-4" />
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] safe-bottom">
      <Header
        title="太一基金小助手"
        leftContent={
          <button onClick={handleLogout} className="text-[13px] text-gray-400">退出</button>
        }
        rightAction={
          <div className="flex items-center gap-2">
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

      {/* ===== 标签栏 ===== */}
      <div className="flex items-center bg-white overflow-x-auto no-scrollbar border-b border-gray-100">
        {/* 账户汇总 */}
        <button
          onClick={() => setTab('summary')}
          className={`relative px-4 py-2.5 text-[15px] whitespace-nowrap ${
            activeTab === 'summary'
              ? 'text-gray-900 font-bold'
              : 'text-gray-400'
          }`}
        >
          账户汇总
          {activeTab === 'summary' && (
            <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-gray-900 rounded-full" />
          )}
        </button>

        {/* 全部 */}
        <button
          onClick={() => setTab('all')}
          className={`relative px-4 py-2.5 text-[15px] whitespace-nowrap ${
            activeTab === 'all'
              ? 'text-gray-900 font-bold'
              : 'text-gray-400'
          }`}
        >
          全部
          {activeTab === 'all' && (
            <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-gray-900 rounded-full" />
          )}
        </button>

        {/* 各账户 */}
        {accounts.map(acc => (
          <button
            key={acc.id}
            onClick={() => setTab(acc.id)}
            className={`relative px-4 py-2.5 text-[15px] whitespace-nowrap ${
              activeTab === acc.id
                ? 'text-gray-900 font-bold'
                : 'text-gray-400'
            }`}
          >
            {acc.name}
            {activeTab === acc.id && (
              <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-gray-900 rounded-full" />
            )}
          </button>
        ))}

        {/* + */}
        <button
          onClick={() => navigate('/add-account')}
          className="px-4 py-2.5 text-gray-300 text-[18px] leading-none whitespace-nowrap"
        >
          +
        </button>
      </div>

      {/* ===== 账户汇总页 ===== */}
      {activeTab === 'summary' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />

          {accounts.length > 0 ? (
            <div className="mt-2">
              {accounts.map((acc, i) => (
                <div key={acc.id}>
                  {i > 0 && <div className="h-2 bg-[#F5F6F8]" />}
                  <AccountCard
                    account={acc}
                    estimates={estimates}
                    onClick={() => setTab(acc.id)}
                  />
                </div>
              ))}

              {/* 底部操作栏 */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center mt-2">
                <button
                  onClick={() => navigate('/add-account')}
                  className="text-[14px] text-gray-500"
                >
                  + 新增账户
                </button>
              </div>
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

      {/* ===== 全部页（跨账户聚合） ===== */}
      {activeTab === 'all' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />

          {aggregatedFunds.length > 0 ? (
            renderFundList(aggregatedFunds, null)
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <p className="text-gray-400 text-[15px]">还没有添加基金</p>
            </div>
          )}
        </>
      )}

      {/* ===== 单个账户页 ===== */}
      {currentAccount && (
        <>
          <AssetSummary funds={currentAccount.funds} estimates={estimates} loading={loading} />

          {currentAccount.funds.length > 0 ? (
            <>
              {renderFundList(currentAccount.funds, currentAccount.id)}

              {/* 底部操作栏 */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 flex justify-between items-center mt-2">
                <button
                  onClick={() => navigate(`/add/${currentAccount.id}`)}
                  className="text-[14px] text-gray-500"
                >
                  + 新增持有
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <p className="text-gray-400 text-[15px] mb-5">该账户还没有添加基金</p>
              <button
                onClick={() => navigate(`/add/${currentAccount.id}`)}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl text-[14px] font-medium active:bg-blue-600"
              >
                + 新增持有
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
