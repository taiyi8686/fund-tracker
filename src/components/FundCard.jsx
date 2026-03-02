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

  const up = '#e94560';
  const down = '#22c55e';

  return (
    <div
      onClick={handleClick}
      className="fund-grid"
      style={{
        padding: '14px 20px',
        minHeight: 56,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background-color 0.15s',
      }}
    >
      {/* Col 1: Fund name / Amount */}
      <div style={{ minWidth: 0, paddingRight: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {estimate?.name || fund.name || fund.code}
        </div>
        <div style={{ fontSize: 12, marginTop: 2, color: '#999' }}>
          ¥ {fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* Col 2: Daily profit */}
      <div style={{ textAlign: 'right' }}>
        {dailyProfit !== null ? (
          <>
            <div style={{ fontSize: 15, fontWeight: 600, color: dailyGrowth >= 0 ? up : down }}>
              {dailyProfit >= 0 ? '+' : ''}{dailyProfit.toFixed(2)}
            </div>
            <div style={{ fontSize: 12, marginTop: 2, color: dailyGrowth >= 0 ? up : down }}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: '#ddd' }}>-</div>
            <div style={{ fontSize: 12, marginTop: 2, color: '#ddd' }}>-</div>
          </>
        )}
      </div>

      {/* Col 3: Total profit */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: totalProfit >= 0 ? up : down }}>
          {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
        </div>
        <div style={{ fontSize: 12, marginTop: 2, color: totalProfitRate >= 0 ? up : down }}>
          {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
