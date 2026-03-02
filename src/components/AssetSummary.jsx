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
    <div className="bg-white px-4 py-5 border-b border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400 mb-1">账户资产</div>
          <div className="text-2xl font-bold text-gray-800">
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400 mb-1">当日估算收益</div>
          {hasDailyData ? (
            <div className={`text-xl font-bold ${isDailyUp ? 'text-profit' : 'text-loss'}`}>
              {isDailyUp ? '+' : ''}{totalDailyProfit.toFixed(2)}
            </div>
          ) : loading ? (
            <div className="skeleton w-20 h-7 ml-auto" />
          ) : (
            <div className="text-xl text-gray-300">--</div>
          )}
        </div>
      </div>
    </div>
  );
}
