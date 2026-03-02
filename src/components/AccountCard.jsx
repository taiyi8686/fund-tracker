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
      className="bg-white active:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* 第一行：账户名 + 涨跌数 */}
      <div className="flex justify-between items-center px-4 pt-3.5 pb-2">
        <div className="text-[16px] font-bold text-gray-900">{account.name}</div>
        <div className="flex items-center gap-3 text-[14px]">
          {upCount > 0 && <span className="text-profit font-medium">↑{upCount}</span>}
          {downCount > 0 && <span className="text-loss font-medium">↓{downCount}</span>}
        </div>
      </div>

      {/* 第二行：账户资产 + 迷你曲线图 */}
      <div className="flex items-end justify-between px-4">
        <div>
          <div className="text-[12px] text-gray-400">账户资产</div>
          <div className="text-[20px] font-bold text-gray-900 leading-tight">
            {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <MiniChart seed={account.id + account.name} isPositive={totalProfit >= 0} />
      </div>

      {/* 第三行：持有收益 + 当日收益 */}
      <div className="flex px-4 pt-2 pb-3.5">
        <div className="flex-1">
          <div className="text-[12px] text-gray-400 mb-0.5">持有收益</div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-[16px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            </span>
            <span className={`text-[12px] ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
              {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[12px] text-gray-400 mb-0.5">当日收益</div>
          {hasDailyData ? (
            <div className="flex items-baseline justify-end gap-1.5">
              <span className={`text-[16px] font-bold ${totalDailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </span>
              <span className={`text-[12px] ${dailyRate >= 0 ? 'text-profit' : 'text-loss'}`}>
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
