export default function AssetSummary({ funds, estimates, loading }) {
  let totalAmount = 0;
  let totalProfit = 0;
  let totalDailyProfit = 0;
  let hasDailyData = false;

  funds.forEach((fund) => {
    totalAmount += fund.amount;
    totalProfit += fund.profit;
    const est = estimates[fund.code];
    if (est) {
      totalDailyProfit += fund.amount * (est.estimateGrowth / 100);
      hasDailyData = true;
    }
  });

  const totalCost = totalAmount - totalProfit;
  const profitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const isDailyUp = totalDailyProfit >= 0;

  return (
    <div className="bg-white px-5 pt-5 pb-4">
      {/* 账户资产 */}
      <div className="text-[13px] text-gray-400 mb-1">账户资产（元）</div>
      <div className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
        {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>

      {/* 持有收益 + 当日估算收益 */}
      <div className="flex">
        <div className="flex-1">
          <div className="text-[13px] text-gray-400 mb-1">持有收益</div>
          <div className={`text-[18px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </div>
          <div className={`text-[12px] mt-0.5 ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[13px] text-gray-400 mb-1">当日估算收益</div>
          {hasDailyData ? (
            <>
              <div className={`text-[18px] font-bold ${isDailyUp ? 'text-profit' : 'text-loss'}`}>
                {isDailyUp ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
              <div className={`text-[12px] mt-0.5 ${isDailyUp ? 'text-profit' : 'text-loss'}`}>
                {isDailyUp ? '+' : ''}{(totalAmount > 0 ? (totalDailyProfit / totalAmount) * 100 : 0).toFixed(2)}%
              </div>
            </>
          ) : loading ? (
            <div className="skeleton w-20 h-6 ml-auto mt-1" />
          ) : (
            <div className="text-[18px] text-gray-300 font-bold">--</div>
          )}
        </div>
      </div>
    </div>
  );
}
