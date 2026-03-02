import MiniChart from './MiniChart';

export default function AccountCard({ account, estimates, onClick }) {
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
    <div
      onClick={onClick}
      className="bg-white cursor-pointer transition-colors duration-200 active:bg-gray-50"
    >
      {/* 账户名 + 涨跌箭头 */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <span className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {account.name}
        </span>
        <div className="flex items-center gap-3 text-sm font-medium">
          {upCount > 0 && <span className="text-profit">↑{upCount}</span>}
          {downCount > 0 && <span className="text-loss">↓{downCount}</span>}
        </div>
      </div>

      {/* 账户资产 + 迷你曲线 */}
      <div className="flex items-end justify-between px-4 pb-1">
        <div>
          <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>账户资产</div>
          <div className="text-xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <MiniChart seed={account.id + account.name} isPositive={totalProfit >= 0} />
      </div>

      {/* 持有收益 + 当日收益 */}
      <div className="flex px-4 pt-2 pb-4">
        <div className="flex-1">
          <div className="text-xs mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>持有收益</div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className={`text-base font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            </span>
            <span className={`text-xs ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
              {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-xs mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>当日收益</div>
          {hasDailyData ? (
            <div className="flex items-baseline justify-end gap-1.5 flex-wrap">
              <span className={`text-base font-bold ${totalDailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </span>
              <span className={`text-xs ${dailyRate >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyRate >= 0 ? '+' : ''}{dailyRate.toFixed(2)}%
              </span>
            </div>
          ) : (
            <div className="skeleton w-20 h-5 ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
}
