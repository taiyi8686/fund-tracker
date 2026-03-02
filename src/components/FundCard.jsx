import { useNavigate } from 'react-router-dom';

export default function FundCard({ fund, estimate, accountId }) {
  const navigate = useNavigate();

  const hasEstimate = !!estimate;

  // 当日收益 = 持有金额 × 当日涨跌幅%
  const dailyGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const dailyProfit = hasEstimate ? fund.amount * (estimate.estimateGrowth / 100) : null;

  // 持有收益（用户填入的）
  const totalProfit = fund.profit;
  const totalProfitRate = fund.amount > 0
    ? (totalProfit / (fund.amount - totalProfit)) * 100
    : 0;

  return (
    <div
      onClick={() => navigate(`/fund/${accountId}/${fund.code}`)}
      className="active:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="py-3">
        {/* 基金名称和金额 */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-800 truncate">
              {estimate?.name || fund.name || fund.code}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">¥ {fund.amount.toFixed(2)}</div>
          </div>

          {/* 当日收益 */}
          <div className="text-right mx-4 min-w-[70px]">
            {dailyProfit !== null ? (
              <>
                <div className={`text-sm font-medium ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}
                </div>
                <div className={`text-xs ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
                </div>
              </>
            ) : (
              <>
                <div className="skeleton w-14 h-4 mb-1 ml-auto" />
                <div className="skeleton w-10 h-3 ml-auto" />
              </>
            )}
          </div>

          {/* 持有收益 */}
          <div className="text-right min-w-[70px]">
            <div className={`text-sm font-medium ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
            </div>
            <div className={`text-xs ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
