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
      className="bg-white rounded-xl px-4 py-4 active:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* 账户名 + 涨跌数 */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-[15px] font-semibold text-gray-800">{account.name}</div>
        <div className="flex items-center gap-2 text-[13px]">
          {upCount > 0 && (
            <span className="text-profit flex items-center gap-0.5">
              <span className="text-[11px]">▲</span>{upCount}
            </span>
          )}
          {downCount > 0 && (
            <span className="text-loss flex items-center gap-0.5">
              <span className="text-[11px]">▼</span>{downCount}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* 账户资产 */}
      <div className="mb-3">
        <div className="text-[12px] text-gray-400 mb-0.5">账户资产</div>
        <div className="text-[22px] font-bold text-gray-900">
          {totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 持有收益 + 当日收益 */}
      <div className="flex pt-3 border-t border-gray-100">
        <div className="flex-1">
          <div className="text-[12px] text-gray-400 mb-0.5">持有收益</div>
          <div className={`text-[16px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </div>
          <div className={`text-[11px] mt-0.5 ${profitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {profitRate >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[12px] text-gray-400 mb-0.5">当日收益</div>
          {hasDailyData ? (
            <>
              <div className={`text-[16px] font-bold ${totalDailyProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {totalDailyProfit >= 0 ? '+' : ''}{totalDailyProfit.toFixed(2)}
              </div>
              <div className={`text-[11px] mt-0.5 ${dailyRate >= 0 ? 'text-profit' : 'text-loss'}`}>
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
