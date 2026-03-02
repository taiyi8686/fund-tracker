export default function AssetSummary({ funds, estimates }) {
  let totalCost = 0;
  let totalMarketValue = 0;

  funds.forEach((fund) => {
    totalCost += fund.cost;
    const est = estimates[fund.code];
    if (est) {
      totalMarketValue += fund.shares * est.estimateValue;
    } else {
      // Fallback: use cost as market value when no estimate available
      totalMarketValue += fund.cost;
    }
  });

  const totalProfit = totalMarketValue - totalCost;
  const profitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  const isProfit = totalProfit >= 0;

  return (
    <div className="mx-4 mt-4 p-5 rounded-2xl bg-gradient-primary text-white shadow-lg">
      <div className="text-sm opacity-80 mb-1">总资产估值</div>
      <div className="text-3xl font-bold mb-3">
        ¥{totalMarketValue.toFixed(2)}
      </div>
      <div className="flex gap-6 text-sm">
        <div>
          <div className="opacity-70">总成本</div>
          <div className="font-medium">¥{totalCost.toFixed(2)}</div>
        </div>
        <div>
          <div className="opacity-70">总盈亏</div>
          <div className="font-medium">
            {isProfit ? '+' : ''}¥{totalProfit.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="opacity-70">收益率</div>
          <div className="font-medium">
            {isProfit ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}
