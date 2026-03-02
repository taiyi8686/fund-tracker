import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getFundFromAccount, removeFundFromAccount } from '../utils/storage';
import { fetchFundEstimate } from '../utils/fundApi';

export default function FundDetail() {
  const { accountId, code } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stored = getFundFromAccount(accountId, code);
    if (!stored) {
      navigate(`/?tab=${accountId}`, { replace: true });
      return;
    }
    setFund(stored);
    fetchFundEstimate(code)
      .then(setEstimate)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code, accountId, navigate]);

  if (!fund) return null;

  const hasEstimate = !!estimate;
  const dailyGrowth = hasEstimate ? estimate.estimateGrowth : null;
  const dailyProfit = hasEstimate ? fund.amount * (estimate.estimateGrowth / 100) : null;
  const totalProfit = fund.profit;
  const cost = fund.amount - fund.profit;
  const totalProfitRate = cost > 0 ? (totalProfit / cost) * 100 : 0;

  const up = '#e94560';
  const down = '#22c55e';

  const handleDelete = () => {
    removeFundFromAccount(accountId, code);
    navigate(`/?tab=${accountId}`, { replace: true });
  };

  return (
    <div className="app-shell safe-bottom" style={{ background: '#f5f6fa' }}>
      <Header
        title="基金详情"
        showBack
        rightAction={
          <button
            onClick={() => navigate(`/add/${accountId}?edit=${code}`)}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            编辑
          </button>
        }
      />

      {/* Fund Name + Estimate */}
      <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', padding: '20px 20px 16px' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#1a1a2e' }}>
          {estimate?.name || fund.name || '加载中...'}
        </div>
        <div style={{ fontSize: 12, marginTop: 2, color: '#999' }}>{fund.code}</div>

        {hasEstimate && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#999' }}>实时估值</div>
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, color: '#1a1a2e' }}>
                {estimate.estimateValue.toFixed(4)}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 2, color: dailyGrowth >= 0 ? up : down }}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </div>
          </div>
        )}
        {hasEstimate && (
          <div style={{ fontSize: 11, marginTop: 8, color: '#ccc' }}>
            估算时间：{estimate.estimateTime} | 净值日期：{estimate.valueDate}
          </div>
        )}
        {loading && <div className="skeleton" style={{ width: 160, height: 40, marginTop: 16 }} />}
      </div>

      {/* Profit Cards */}
      <div style={{ display: 'flex', gap: 10, margin: '12px 16px 0' }}>
        {dailyProfit !== null && (
          <div style={{
            flex: 1, borderRadius: 14, padding: '14px 16px',
            background: dailyGrowth >= 0 ? 'rgba(233,69,96,0.06)' : 'rgba(34,197,94,0.06)',
          }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>当日估算收益</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: dailyGrowth >= 0 ? up : down }}>
              {dailyProfit >= 0 ? '+' : ''}¥{dailyProfit.toFixed(2)}
            </div>
          </div>
        )}
        <div style={{
          flex: 1, borderRadius: 14, padding: '14px 16px',
          background: totalProfit >= 0 ? 'rgba(233,69,96,0.06)' : 'rgba(34,197,94,0.06)',
        }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>持有收益</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: totalProfit >= 0 ? up : down }}>
            {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, marginTop: 4, color: totalProfitRate >= 0 ? up : down }}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Detail Info */}
      <div style={{ margin: '12px 16px 0', background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
        <InfoRow label="持有金额" value={`¥${fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} />
        <InfoRow label="买入成本" value={`¥${cost.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} />
        {hasEstimate && <InfoRow label="上个交易日净值" value={estimate.netValue.toFixed(4)} />}
        <InfoRow label="添加日期" value={fund.addedAt} last />
      </div>

      {/* Delete */}
      <div style={{ padding: '32px 16px' }}>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              width: '100%', padding: 12, borderRadius: 12, fontSize: 14,
              color: '#e94560', background: '#fff', cursor: 'pointer',
              border: '1px solid rgba(233,69,96,0.3)',
            }}
          >
            删除该基金
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                flex: 1, padding: 12, borderRadius: 12, fontSize: 14,
                background: '#f3f4f6', color: '#666', border: 'none', cursor: 'pointer',
              }}
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              style={{
                flex: 1, padding: 12, borderRadius: 12, fontSize: 14,
                background: '#e94560', color: '#fff', border: 'none', cursor: 'pointer',
              }}
            >
              确认删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px',
        borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <span style={{ fontSize: 14, color: '#666' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#1a1a2e' }}>{value}</span>
    </div>
  );
}
