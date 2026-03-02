import MiniChart from './MiniChart';

export default function AccountCard({ account, estimates, onClick, iconGradient }) {
  let totalAmount = 0;
  let totalProfit = 0;
  let totalDailyProfit = 0;
  let hasDailyData = false;
  let upCount = 0;
  let downCount = 0;

  account.funds.forEach((fund) => {
    totalAmount += fund.amount;
    totalProfit += fund.profit;
    const est = estimates[fund.code];
    if (est) {
      totalDailyProfit += fund.amount * (est.estimateGrowth / 100);
      hasDailyData = true;
      if (est.estimateGrowth >= 0) upCount++;
      else downCount++;
    }
  });

  const totalCost = totalAmount - totalProfit;
  const profitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const dailyRate = totalAmount > 0 ? (totalDailyProfit / totalAmount) * 100 : 0;

  return (
    <div onClick={onClick} className="account-card">
      {/* Card Header: Icon + Name + Up/Down badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 10,
              background: iconGradient || 'linear-gradient(135deg, #1677ff, #4096ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#fff', fontWeight: 600,
            }}
          >
            {account.name.slice(-1)}
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>{account.name}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {upCount > 0 && (
            <span style={{
              fontSize: 12, color: '#e94560',
              background: 'rgba(233,69,96,0.08)',
              padding: '3px 8px', borderRadius: 8,
            }}>
              ↑{upCount}
            </span>
          )}
          {downCount > 0 && (
            <span style={{
              fontSize: 12, color: '#22c55e',
              background: 'rgba(34,197,94,0.08)',
              padding: '3px 8px', borderRadius: 8,
            }}>
              ↓{downCount}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Left: Assets + Hold Profit */}
        <div>
          <div style={{ fontSize: 11, color: '#999', marginBottom: 2 }}>账户资产</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', letterSpacing: -0.5, lineHeight: 1.2 }}>
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 11, color: '#999', marginRight: 4 }}>持有收益</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: totalProfit >= 0 ? '#e94560' : '#22c55e' }}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            </span>
            <span style={{ fontSize: 11, color: totalProfit >= 0 ? '#e94560' : '#22c55e', marginLeft: 4 }}>
              {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Right: MiniChart + Day Profit */}
        <div style={{ textAlign: 'right' }}>
          <MiniChart seed={account.id + account.name} isPositive={totalProfit >= 0} />
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, color: '#999' }}>当日 </span>
            {hasDailyData ? (
              <>
                <span style={{ fontSize: 16, fontWeight: 600, color: totalDailyProfit >= 0 ? '#e94560' : '#22c55e' }}>
                  {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
                </span>
                <span style={{ fontSize: 11, color: totalDailyProfit >= 0 ? '#e94560' : '#22c55e', marginLeft: 3 }}>
                  {dailyRate >= 0 ? '+' : ''}{dailyRate.toFixed(2)}%
                </span>
              </>
            ) : (
              <span className="skeleton" style={{ width: 60, height: 18, display: 'inline-block' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
