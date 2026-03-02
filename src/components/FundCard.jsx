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
      className={`fund-grid px-4 py-3.5 min-h-[56px] transition-colors duration-150 ${
        clickable ? 'cursor-pointer active:bg-gray-50' : ''
      }`}
    >
      {/* 列1：基金名 / ¥金额 */}
      <div className="min-w-0 pr-2">
        <div className="text-[15px] font-bold truncate" style={{ color: 'var(--color-text-primary)' }}>
          {estimate?.name || fund.name || fund.code}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
          ¥ {fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 列2：当日收益 (金额 / 涨幅%) */}
      <div className="text-right">
        {dailyProfit !== null ? (
          <>
            <div className={`text-[15px] font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}
            </div>
            <div className={`text-xs mt-0.5 ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </div>
          </>
        ) : (
          <>
            <div className="text-sm" style={{ color: '#DDD' }}>-</div>
            <div className="text-xs mt-0.5" style={{ color: '#DDD' }}>-</div>
          </>
        )}
      </div>

      {/* 列3：持有收益 (金额 / 收益率%) */}
      <div className="text-right">
        <div className={`text-[15px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
          {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
        </div>
        <div className={`text-xs mt-0.5 ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
          {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
