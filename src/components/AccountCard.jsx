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
      const dp = fund.amount * (est.estimateGrowth / 100);
      totalDailyProfit += dp;
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
      className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* 账户名 + 涨跌数 */}
      <div className="flex justify-between items-center mb-3">
        <div className="font-medium text-gray-800 text-sm">{account.name}</div>
        <div className="flex gap-2 text-xs">
          {upCount > 0 && <span className="text-profit">↑{upCount}</span>}
          {downCount > 0 && <span className="text-loss">↓{downCount}</span>}
        </div>
      </div>

      <div className="flex justify-between items-end">
        {/* 账户资产 */}
        <div>
          <div className="text-xs text-gray-400">账户资产</div>
          <div className="text-lg font-bold text-gray-800">
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* 持有收益 */}
        <div className="text-center">
          <div className="text-xs text-gray-400">持有收益</div>
          <div className={`text-sm font-medium ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </div>
          <div className={`text-xs ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>

        {/* 当日收益 */}
        <div className="text-right">
          <div className="text-xs text-gray-400">当日收益</div>
          {hasDailyData ? (
            <>
              <div className={`text-sm font-medium ${totalDailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
              <div className={`text-xs ${dailyRate >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyRate >= 0 ? '+' : ''}{dailyRate.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="skeleton w-14 h-4 ml-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}
