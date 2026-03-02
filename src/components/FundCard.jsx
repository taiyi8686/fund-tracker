import { useNavigate } from 'react-router-dom';

export default function FundCard({ fund, estimate }) {
  const navigate = useNavigate();

  const hasEstimate = !!estimate;
  const marketValue = hasEstimate ? fund.shares * estimate.estimateValue : null;
  const profit = marketValue !== null ? marketValue - fund.cost : null;
  const profitRate = fund.cost > 0 && profit !== null ? (profit / fund.cost) * 100 : null;
  const isProfit = profit !== null ? profit >= 0 : null;

  const todayGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const isTodayUp = todayGrowth !== null ? todayGrowth >= 0 : null;

  return (
    <div
      onClick={() => navigate(`/fund/${fund.code}`)}
      className="bg-white rounded-xl p-4 shadow-sm active:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium text-gray-800 text-sm">
            {estimate?.name || fund.name || '加载中...'}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{fund.code}</div>
        </div>
        <div className="text-right">
          {todayGrowth !== null ? (
            <div className={`text-lg font-bold ${isTodayUp ? 'text-profit' : 'text-loss'}`}>
              {isTodayUp ? '+' : ''}{todayGrowth.toFixed(2)}%
            </div>
          ) : (
            <div className="skeleton w-16 h-6" />
          )}
          <div className="text-xs text-gray-400 mt-0.5">今日估值涨幅</div>
        </div>
      </div>

      <div className="flex justify-between items-end pt-2 border-t border-gray-50">
        <div className="text-xs text-gray-500">
          <span>持有 {fund.shares.toFixed(2)} 份</span>
          <span className="mx-2">|</span>
          <span>成本 ¥{fund.cost.toFixed(2)}</span>
        </div>
        <div className="text-right">
          {profit !== null ? (
            <span className={`text-sm font-medium ${isProfit ? 'text-profit' : 'text-loss'}`}>
              {isProfit ? '+' : ''}¥{profit.toFixed(2)}
            </span>
          ) : (
            <span className="skeleton inline-block w-14 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
