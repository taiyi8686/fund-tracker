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

  const setTab = (tab) => setSearchParams({ tab }, { replace: true });

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

  // 标签项组件
  const TabItem = ({ id, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className="relative px-5 py-3 whitespace-nowrap cursor-pointer transition-colors duration-150"
        style={{
          fontSize: '15px',
          fontWeight: isActive ? 700 : 400,
          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
        }}
      >
        {label}
        {isActive && (
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full"
            style={{ width: '24px', height: '2.5px', backgroundColor: 'var(--color-text-primary)' }}
          />
        )}
      </button>
    );
  };

  // 基金列表头 + 行（全部/单账户 共用）
  const FundListSection = ({ funds, accountId }) => (
    <>
      {/* 列头 */}
      <div
        className="fund-grid px-5 py-2"
        style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}
      >
        <div />
        <div className="text-right">
          <div className="text-[11px] leading-tight" style={{ color: 'var(--color-text-tertiary)' }}>当日收益</div>
          <div className="text-[11px] leading-tight" style={{ color: 'var(--color-text-tertiary)' }}>{dateStr}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] leading-tight" style={{ color: 'var(--color-text-tertiary)' }}>持有收益</div>
          <div className="text-[11px] leading-tight" style={{ color: 'var(--color-text-tertiary)' }}>{dateStr}</div>
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
              <div className="mx-5" style={{ borderBottom: '1px solid var(--color-border)' }} />
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header
        title="太一基金小助手"
        leftContent={
          <button onClick={handleLogout} className="text-xs cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>退出</button>
        }
        rightAction={
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{username}</span>
            <button onClick={loadData} disabled={loading} className="cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        }
      />

      {/* ===== 标签栏 ===== */}
      <div
        className="flex items-center bg-white overflow-x-auto no-scrollbar pl-2"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <TabItem id="summary" label="账户汇总" />
        <TabItem id="all" label="全部" />
        {accounts.map(acc => (
          <TabItem key={acc.id} id={acc.id} label={acc.name} />
        ))}
        <button
          onClick={() => navigate('/add-account')}
          className="px-5 py-3 text-lg leading-none whitespace-nowrap cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          +
        </button>
      </div>

      {/* ===== 账户汇总 ===== */}
      {activeTab === 'summary' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />

          {accounts.length > 0 ? (
            <div className="mt-2">
              {accounts.map((acc, i) => (
                <div key={acc.id}>
                  {i > 0 && <div className="h-2" style={{ backgroundColor: 'var(--color-bg)' }} />}
                  <AccountCard account={acc} estimates={estimates} onClick={() => setTab(acc.id)} />
                </div>
              ))}

              <div className="h-2" style={{ backgroundColor: 'var(--color-bg)' }} />
              <div className="bg-white px-5 py-3">
                <button
                  onClick={() => navigate('/add-account')}
                  className="text-sm cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  + 新增账户
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <svg className="w-20 h-20 mb-5" style={{ color: '#E0E0E0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-[15px] mb-2" style={{ color: 'var(--color-text-tertiary)' }}>还没有添加账户</p>
              <p className="text-xs mb-6" style={{ color: '#CCC' }}>先创建一个账户，比如「支付宝」</p>
              <button
                onClick={() => navigate('/add-account')}
                className="px-8 py-3 text-white rounded-lg text-[15px] font-medium cursor-pointer active:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                + 新建账户
              </button>
            </div>
          )}
        </>
      )}

      {/* ===== 全部（跨账户聚合） ===== */}
      {activeTab === 'all' && (
        <>
          <AssetSummary funds={allFunds} estimates={estimates} loading={loading} />
          {aggregatedFunds.length > 0 ? (
            <FundListSection funds={aggregatedFunds} accountId={null} />
          ) : (
            <div className="flex flex-col items-center justify-center mt-24">
              <p className="text-[15px]" style={{ color: 'var(--color-text-tertiary)' }}>还没有添加基金</p>
            </div>
          )}
        </>
      )}

      {/* ===== 单个账户 ===== */}
      {currentAccount && (
        <>
          <AssetSummary funds={currentAccount.funds} estimates={estimates} loading={loading} />

          {currentAccount.funds.length > 0 ? (
            <>
              <FundListSection funds={currentAccount.funds} accountId={currentAccount.id} />

              <div className="h-2" style={{ backgroundColor: 'var(--color-bg)' }} />
              <div className="bg-white px-5 py-3 flex justify-between">
                <button
                  onClick={() => navigate(`/add/${currentAccount.id}`)}
                  className="text-sm cursor-pointer"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  + 新增持有
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center mt-24 px-8">
              <p className="text-[15px] mb-5" style={{ color: 'var(--color-text-tertiary)' }}>该账户还没有添加基金</p>
              <button
                onClick={() => navigate(`/add/${currentAccount.id}`)}
                className="px-6 py-2.5 text-white rounded-lg text-sm font-medium cursor-pointer active:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-accent)' }}
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
