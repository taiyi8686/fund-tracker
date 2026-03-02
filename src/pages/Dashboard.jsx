import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccountCard from '../components/AccountCard';
import FundCard from '../components/FundCard';
import { getAccounts, getAllFundCodes, getAllFundsAggregated } from '../utils/storage';
import { fetchMultipleFundEstimates } from '../utils/fundApi';
import { getCurrentUser, logout } from '../utils/auth';

const ICON_GRADIENTS = [
  'linear-gradient(135deg, #1677ff, #4096ff)',
  'linear-gradient(135deg, #ff6b35, #ffa726)',
  'linear-gradient(135deg, #9333ea, #c084fc)',
  'linear-gradient(135deg, #06b6d4, #67e8f9)',
  'linear-gradient(135deg, #e94560, #f472b6)',
];

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

  // Summary calculation based on active view
  const summaryFunds = currentAccount ? currentAccount.funds : allFunds;
  let totalAmount = 0;
  let totalDailyProfit = 0;
  let hasDailyData = false;

  summaryFunds.forEach((fund) => {
    totalAmount += fund.amount;
    const est = estimates[fund.code];
    if (est) {
      totalDailyProfit += fund.amount * (est.estimateGrowth / 100);
      hasDailyData = true;
    }
  });

  const dailyRate = totalAmount > 0 ? (totalDailyProfit / totalAmount) * 100 : 0;
  const isDailyUp = totalDailyProfit >= 0;

  const dateStr = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const tabItems = [
    { id: 'summary', label: '账户汇总' },
    { id: 'all', label: '全部' },
    ...accounts.map(acc => ({ id: acc.id, label: acc.name })),
  ];

  const FundListSection = ({ funds, accountId }) => (
    <>
      {/* Column Header */}
      <div
        className="fund-grid"
        style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>当日收益</div>
          <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.4 }}>{dateStr}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#999', lineHeight: 1.4 }}>持有收益</div>
          <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.4 }}>{dateStr}</div>
        </div>
      </div>

      {/* Fund Rows */}
      {funds.map((fund, i) => (
        <div key={fund.code}>
          <FundCard
            fund={fund}
            estimate={estimates[fund.code]}
            accountId={accountId}
            clickable={!!accountId}
          />
          {i < funds.length - 1 && (
            <div style={{ margin: '0 20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="app-shell safe-bottom">
      {/* ===== Gradient Header ===== */}
      <div className="gradient-header">
        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>太一基金小助手</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={handleLogout}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              退出
            </button>
            <span style={{ fontSize: 14, opacity: 0.85 }}>{username}</span>
            <button
              onClick={loadData}
              disabled={loading}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.85, padding: 0, display: 'flex' }}
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pill Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }} className="no-scrollbar">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`pill-tab ${activeTab === tab.id ? 'pill-tab-active' : 'pill-tab-inactive'}`}
            >
              {tab.label}
            </button>
          ))}
          <button onClick={() => navigate('/add-account')} className="pill-tab-add">
            + 新增
          </button>
        </div>

        {/* Asset Summary */}
        <div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4, letterSpacing: 0.5 }}>
            账户资产 (元)
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
              {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>当日收益</div>
              {hasDailyData ? (
                <div>
                  <span style={{ fontSize: 22, fontWeight: 600, color: isDailyUp ? '#7cffb2' : '#ff6b6b' }}>
                    {isDailyUp ? '+' : ''}{totalDailyProfit.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 12, marginLeft: 4, opacity: 0.8, color: isDailyUp ? '#7cffb2' : '#ff6b6b' }}>
                    {isDailyUp ? '+' : ''}{dailyRate.toFixed(2)}%
                  </span>
                </div>
              ) : loading ? (
                <div className="skeleton" style={{ width: 80, height: 28, opacity: 0.3 }} />
              ) : (
                <span style={{ fontSize: 22, fontWeight: 600, opacity: 0.4 }}>--</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Content Area ===== */}

      {/* 账户汇总 */}
      {activeTab === 'summary' && (
        <div style={{ padding: '16px 16px 32px' }}>
          {accounts.length > 0 ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 12, paddingLeft: 4 }}>
                账户明细
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {accounts.map((acc, i) => (
                  <AccountCard
                    key={acc.id}
                    account={acc}
                    estimates={estimates}
                    onClick={() => setTab(acc.id)}
                    iconGradient={ICON_GRADIENTS[i % ICON_GRADIENTS.length]}
                  />
                ))}
              </div>
              <button onClick={() => navigate('/add-account')} className="dashed-add-btn">
                <span style={{ fontSize: 18 }}>+</span>
                新增账户
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, padding: '0 32px' }}>
              <svg style={{ width: 72, height: 72, marginBottom: 16, color: '#ddd' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p style={{ fontSize: 15, color: '#999', marginBottom: 6 }}>还没有添加账户</p>
              <p style={{ fontSize: 12, color: '#ccc', marginBottom: 24 }}>先创建一个账户，比如「支付宝」</p>
              <button
                onClick={() => navigate('/add-account')}
                className="gradient-btn"
                style={{ padding: '12px 32px', fontSize: 15 }}
              >
                + 新建账户
              </button>
            </div>
          )}
        </div>
      )}

      {/* 全部（跨账户聚合） */}
      {activeTab === 'all' && (
        <div style={{ padding: '16px 16px 32px' }}>
          {aggregatedFunds.length > 0 ? (
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <FundListSection funds={aggregatedFunds} accountId={null} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
              <p style={{ fontSize: 15, color: '#999' }}>还没有添加基金</p>
            </div>
          )}
        </div>
      )}

      {/* 单个账户 */}
      {currentAccount && (
        <div style={{ padding: '16px 16px 32px' }}>
          {currentAccount.funds.length > 0 ? (
            <>
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                <FundListSection funds={currentAccount.funds} accountId={currentAccount.id} />
              </div>
              <button onClick={() => navigate(`/add/${currentAccount.id}`)} className="dashed-add-btn">
                <span style={{ fontSize: 18 }}>+</span>
                新增持有
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
              <p style={{ fontSize: 15, color: '#999', marginBottom: 20 }}>该账户还没有添加基金</p>
              <button
                onClick={() => navigate(`/add/${currentAccount.id}`)}
                className="gradient-btn"
                style={{ padding: '10px 24px', fontSize: 14 }}
              >
                + 新增持有
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
