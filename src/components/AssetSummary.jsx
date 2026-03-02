export default function AssetSummary({ funds, estimates, loading, dailyLabel = '当日收益' }) {
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
    <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100">
      <div className="flex justify-between items-start">
        {/* 左侧：账户资产 */}
        <div>
          <div className="text-[12px] text-gray-400 mb-0.5">账户资产</div>
          <div className="text-[28px] font-bold text-gray-900 leading-tight">
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* 右侧：当日收益 */}
        <div className="text-right flex items-end gap-1 pt-1">
          <div>
            <div className="text-[12px] text-gray-400 mb-0.5">{dailyLabel}</div>
            {hasDailyData ? (
              <div className={`text-[22px] font-bold leading-tight ${isDailyUp ? 'text-profit' : 'text-loss'}`}>
                {isDailyUp ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
            ) : loading ? (
              <div className="skeleton w-20 h-7" />
            ) : (
              <div className="text-[22px] text-gray-300 font-bold leading-tight">--</div>
            )}
          </div>
          <svg className="w-4 h-4 text-gray-300 mb-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
