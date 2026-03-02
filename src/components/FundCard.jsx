import { useNavigate } from 'react-router-dom';

export default function FundCard({ fund, estimate, accountId }) {
  const navigate = useNavigate();

  const hasEstimate = !!estimate;
  const dailyGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const dailyProfit = hasEstimate ? fund.amount * (estimate.estimateGrowth / 100) : null;

  const totalProfit = fund.profit;
  const cost = fund.amount - totalProfit;
  const totalProfitRate = cost > 0 ? (totalProfit / cost) * 100 : 0;

  return (
    <div
      onClick={() => navigate(`/fund/${accountId}/${fund.code}`)}
      className="active:bg-gray-50 cursor-pointer transition-colors py-3.5"
    >
      {/* 基金名 + 持有金额 */}
      <div className="flex justify-between items-center mb-2.5">
        <div className="text-[15px] text-gray-800 font-medium truncate mr-4">
          {estimate?.name || fund.name || fund.code}
        </div>
        <div className="text-[13px] text-gray-400 whitespace-nowrap">¥{fund.amount.toFixed(2)}</div>
      </div>

      {/* 当日收益 + 持有收益 */}
      <div className="flex">
        <div className="flex-1">
          {dailyProfit !== null ? (
            <>
              <div className={`text-[16px] font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}
              </div>
              <div className={`text-[11px] mt-0.5 ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
                {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
              </div>
            </>
          ) : (
            <>
              <div className="skeleton w-16 h-5 mb-1" />
              <div className="skeleton w-12 h-3" />
            </>
          )}
        </div>

        <div className="flex-1 text-right">
          <div className={`text-[16px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </div>
          <div className={`text-[11px] mt-0.5 ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}
