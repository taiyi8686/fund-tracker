import { useNavigate } from 'react-router-dom';

export default function FundCard({ fund, estimate, accountId, clickable = true }) {
  const navigate = useNavigate();

  const hasEstimate = !!estimate;
  const dailyGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const dailyProfit = hasEstimate ? fund.amount * (estimate.estimateGrowth / 100) : null;
  const totalProfit = fund.profit;
  const cost = fund.amount - totalProfit;
  const totalProfitRate = cost > 0 ? (totalProfit / cost) * 100 : 0;

  const handleClick = () => {
    if (clickable && accountId) {
      navigate(`/fund/${accountId}/${fund.code}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-3 ${clickable ? 'active:bg-gray-50 cursor-pointer' : ''}`}
    >
      {/* 第一行：基金名 | 当日收益值 | 持有收益值 */}
      <div className="flex items-center">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[15px] font-bold text-gray-900 truncate block">
            {estimate?.name || fund.name || fund.code}
          </span>
        </div>
        <div className="w-[85px] text-right flex-shrink-0">
          {dailyProfit !== null ? (
            <span className={`text-[15px] font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}
            </span>
          ) : (
            <span className="text-[14px] text-gray-300">-</span>
          )}
        </div>
        <div className="w-[85px] text-right flex-shrink-0">
          <span className={`text-[15px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* 第二行：¥金额 | 当日涨幅% | 持有收益% */}
      <div className="flex items-center mt-1">
        <div className="flex-1 min-w-0 pr-2">
          <span className="text-[13px] text-gray-400">¥ {fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="w-[85px] text-right flex-shrink-0">
          {dailyGrowth !== null ? (
            <span className={`text-[13px] ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </span>
          ) : (
            <span className="text-[13px] text-gray-300">-</span>
          )}
        </div>
        <div className="w-[85px] text-right flex-shrink-0">
          <span className={`text-[13px] ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
