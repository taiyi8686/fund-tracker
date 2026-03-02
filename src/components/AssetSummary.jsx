export default function AssetSummary({ funds, estimates, loading }) {
  let totalAmount = 0;
  let totalDailyProfit = 0;
  let hasDailyData = false;

  funds.forEach((fund) => {
    totalAmount += fund.amount;
    const est = estimates[fund.code];
    if (est) {
      totalDailyProfit += fund.amount * (est.estimateGrowth / 100);
      hasDailyData = true;
    }
  });

  const isDailyUp = totalDailyProfit >= 0;

  return (
    <div className="bg-white px-5 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <div className="flex justify-between items-start">
        {/* 左侧：账户资产 */}
        <div className="flex-1">
          <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>账户资产</div>
          <div className="text-3xl font-bold mt-0.5 leading-tight" style={{ color: 'var(--color-text-primary)' }}>
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* 右侧：当日收益 */}
        <div className="text-right shrink-0 flex items-end gap-1">
          <div>
            <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>当日收益</div>
            {hasDailyData ? (
              <div className={`text-xl font-bold mt-0.5 leading-tight ${isDailyUp ? 'text-profit' : 'text-loss'}`}>
                {isDailyUp ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
            ) : loading ? (
              <div className="skeleton w-20 h-7 mt-0.5" />
            ) : (
              <div className="text-xl font-bold mt-0.5 leading-tight" style={{ color: '#DDD' }}>--</div>
            )}
          </div>
          <svg className="w-4 h-4 mb-1.5 shrink-0" style={{ color: '#CCC' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
