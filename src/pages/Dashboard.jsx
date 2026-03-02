import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccountCard from '../components/AccountCard';
import { getAccounts, getAllFundCodes } from '../utils/storage';
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

  // Tab items
  const tabItems = [
    { id: 'summary', label: '账户汇总' },
    { id: 'all', label: '全部' },
    ...accounts.map(acc => ({ id: acc.id, label: acc.name })),
  ];

  // Determine which accounts to display
  const currentAccount = accounts.find(a => a.id === activeTab);
  const displayAccounts = currentAccount ? [currentAccount] : accounts;

  // Show funds inside cards?
  const showFunds = activeTab !== 'summary';

  // Total summary
  const allFunds = accounts.flatMap(a => a.funds);
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

  const isPositiveTotal = totalDailyProfit >= 0;
  const fmt = (n) => n.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleFundClick = (accountId, fundCode) => {
    navigate(`/fund/${accountId}/${fundCode}`);
  };

  return (
    <div
      style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      }}
    >
      {/* ===== Gradient Header ===== */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "16px 16px 24px",
          borderRadius: "0 0 20px 20px",
          color: "#fff",
        }}
      >
        {/* Title bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 17, fontWeight: 600 }}>太一基金小助手</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={handleLogout}
              style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", background: "none", border: "none", cursor: "pointer" }}
            >
              退出
            </button>
            <span style={{ fontSize: 13, opacity: 0.8 }}>{username}</span>
            <button
              onClick={loadData}
              disabled={loading}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", opacity: 0.8, padding: 0, display: "flex" }}
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pill Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 2 }} className="no-scrollbar">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                padding: "6px 14px", borderRadius: 18, border: "none",
                fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                background: activeTab === tab.id ? "rgba(255,255,255,0.93)" : "rgba(255,255,255,0.15)",
                color: activeTab === tab.id ? "#764ba2" : "rgba(255,255,255,0.85)",
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/add-account')}
            style={{
              padding: "6px 12px", borderRadius: 18,
              border: "1.5px dashed rgba(255,255,255,0.35)",
              background: "transparent", color: "rgba(255,255,255,0.6)",
              fontSize: 13, cursor: "pointer", flexShrink: 0,
            }}
          >
            +
          </button>
        </div>

        {/* Total Summary */}
        <div style={{ padding: "0 4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>账户资产</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>
              {fmt(totalAmount)}
            </span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.6 }}>当日收益</div>
              {hasDailyData ? (
                <div>
                  <span style={{ fontSize: 20, fontWeight: 600, color: isPositiveTotal ? "#7cffb2" : "#ff9b9b" }}>
                    {totalDailyProfit >= 0 ? "+" : ""}{totalDailyProfit.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 18, marginLeft: 6, cursor: "pointer", opacity: 0.7 }}>&gt;</span>
                </div>
              ) : loading ? (
                <div className="skeleton" style={{ width: 80, height: 24, opacity: 0.3 }} />
              ) : (
                <span style={{ fontSize: 20, fontWeight: 600, opacity: 0.4 }}>--</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Account Cards ===== */}
      <div style={{ padding: "14px 14px 100px" }}>
        {displayAccounts.length > 0 ? (
          <>
            {displayAccounts.map((acc, i) => (
              <AccountCard
                key={acc.id}
                account={acc}
                estimates={estimates}
                showFunds={showFunds}
                onClick={() => setTab(acc.id)}
                onFundClick={handleFundClick}
                iconGradient={ICON_GRADIENTS[accounts.indexOf(acc) % ICON_GRADIENTS.length]}
              />
            ))}

            {/* Bottom actions */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: "0 4px" }}>
              <button
                onClick={() => {
                  const targetId = currentAccount ? currentAccount.id : (accounts[0]?.id);
                  if (targetId) navigate(`/add/${targetId}`);
                }}
                style={{
                  padding: "12px 0", flex: 1, marginRight: 8,
                  borderRadius: 12, border: "1.5px dashed #d0d5dd",
                  background: "transparent", color: "#999", fontSize: 13, cursor: "pointer",
                }}
              >
                + 新增持有
              </button>
              <button
                onClick={() => navigate('/add-account')}
                style={{
                  padding: "12px 0", flex: 1, marginLeft: 8,
                  borderRadius: 12, border: "1px solid #e0e0e0",
                  background: "#fff", color: "#666", fontSize: 13, cursor: "pointer",
                }}
              >
                + 新增账户
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 60, padding: "0 32px" }}>
            <svg style={{ width: 72, height: 72, marginBottom: 16, color: "#ddd" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p style={{ fontSize: 15, color: "#999", marginBottom: 6 }}>还没有添加账户</p>
            <p style={{ fontSize: 12, color: "#ccc", marginBottom: 24 }}>先创建一个账户，比如「支付宝」</p>
            <button
              onClick={() => navigate('/add-account')}
              style={{
                padding: "12px 32px", fontSize: 15, fontWeight: 500,
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff", border: "none", borderRadius: 12, cursor: "pointer",
              }}
            >
              + 新建账户
            </button>
          </div>
        )}
      </div>

      {/* ===== Bottom Nav ===== */}
      <div
        style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex", justifyContent: "space-around",
          padding: "8px 0 22px",
        }}
      >
        {[
          { icon: "📊", label: "持有", active: true },
          { icon: "⭐", label: "自选" },
          { icon: "📈", label: "行情" },
          { icon: "📰", label: "资讯" },
          { icon: "💎", label: "会员" },
          { icon: "👤", label: "我的" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span
              style={{
                fontSize: 10,
                color: item.active ? "#764ba2" : "#999",
                fontWeight: item.active ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
