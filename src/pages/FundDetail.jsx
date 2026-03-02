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

  const handleDelete = () => {
    removeFundFromAccount(accountId, code);
    navigate(`/?tab=${accountId}`, { replace: true });
  };

  return (
    <div className="min-h-screen safe-bottom" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header
        title="基金详情"
        showBack
        rightAction={
          <button
            onClick={() => navigate(`/add/${accountId}?edit=${code}`)}
            className="text-sm cursor-pointer"
            style={{ color: 'var(--color-accent)' }}
          >
            编辑
          </button>
        }
      />

      {/* 基金名称 + 实时估值 */}
      <div className="bg-white px-4 pt-4 pb-3">
        <div className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
          {estimate?.name || fund.name || '加载中...'}
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{fund.code}</div>

        {hasEstimate && (
          <div className="mt-4 flex items-end gap-3">
            <div>
              <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>实时估值</div>
              <div className="text-3xl font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                {estimate.estimateValue.toFixed(4)}
              </div>
            </div>
            <div className={`text-xl font-bold mb-0.5 ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </div>
          </div>
        )}
        {hasEstimate && (
          <div className="text-[11px] mt-2" style={{ color: '#CCC' }}>
            估算时间：{estimate.estimateTime} | 净值日期：{estimate.valueDate}
          </div>
        )}
        {loading && <div className="skeleton w-40 h-10 mt-4" />}
      </div>

      {/* 当日估算收益 + 持有收益 */}
      <div className="flex gap-2 mx-3 mt-2">
        {dailyProfit !== null && (
          <div
            className="flex-1 rounded-lg px-3.5 py-3"
            style={{ backgroundColor: dailyGrowth >= 0 ? '#FEF2F2' : '#F0FDF4' }}
          >
            <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>当日估算收益</div>
            <div className={`text-xl font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyProfit >= 0 ? '+' : ''}¥{dailyProfit.toFixed(2)}
            </div>
          </div>
        )}
        <div
          className="flex-1 rounded-lg px-3.5 py-3"
          style={{ backgroundColor: totalProfit >= 0 ? '#FEF2F2' : '#F0FDF4' }}
        >
          <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>持有收益</div>
          <div className={`text-xl font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toFixed(2)}
          </div>
          <div className={`text-xs mt-0.5 ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 明细信息 */}
      <div className="bg-white mx-3 mt-2 rounded-lg overflow-hidden">
        <InfoRow label="持有金额" value={`¥${fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} />
        <InfoRow label="买入成本" value={`¥${cost.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} />
        {hasEstimate && <InfoRow label="上个交易日净值" value={estimate.netValue.toFixed(4)} />}
        <InfoRow label="添加日期" value={fund.addedAt} last />
      </div>

      {/* 删除 */}
      <div className="px-3 mt-8 pb-8">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 rounded-lg text-sm cursor-pointer active:opacity-80 transition-opacity"
            style={{ color: '#E74C3C', backgroundColor: 'white', border: '1px solid #FCA5A5' }}
          >
            删除该基金
          </button>
        ) : (
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-lg text-sm cursor-pointer"
              style={{ backgroundColor: '#F3F4F6', color: 'var(--color-text-secondary)' }}
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-lg text-sm text-white cursor-pointer active:opacity-90 transition-opacity"
              style={{ backgroundColor: '#E74C3C' }}
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
      className="flex justify-between items-center px-4 py-3"
      style={last ? {} : { borderBottom: '1px solid var(--color-border)' }}
    >
      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  );
}
