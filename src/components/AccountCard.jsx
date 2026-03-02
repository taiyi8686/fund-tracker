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
      className="bg-white rounded-2xl p-5 shadow-sm active:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* 第一行：账户名 + 涨跌数 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-semibold text-gray-800">{account.name}</div>
        <div className="flex gap-3 text-sm">
          {upCount > 0 && <span className="text-profit font-medium">↑{upCount}</span>}
          {downCount > 0 && <span className="text-loss font-medium">↓{downCount}</span>}
        </div>
      </div>

      {/* 第二行：账户资产 */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-1">账户资产</div>
        <div className="text-xl font-bold text-gray-800">
          {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 第三行：持有收益 + 当日收益 并排 */}
      <div className="flex border-t border-gray-100 pt-3">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">持有收益</div>
          <div className={`text-base font-semibold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </div>
          <div className={`text-xs mt-0.5 ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-xs text-gray-400 mb-1">当日收益</div>
          {hasDailyData ? (
            <>
              <div className={`text-base font-semibold ${totalDailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
              <div className={`text-xs mt-0.5 ${dailyRate >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyRate >= 0 ? '+' : ''}{dailyRate.toFixed(2)}%
              </div>
            </>
          ) : (
            <div className="skeleton w-16 h-5 ml-auto mt-1" />
          )}
        </div>
      </div>
    </div>
  );
}
