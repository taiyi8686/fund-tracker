import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { getFund, removeFund } from '../utils/storage';
import { fetchFundEstimate } from '../utils/fundApi';

export default function FundDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [fund, setFund] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const stored = getFund(code);
    if (!stored) {
      navigate('/', { replace: true });
      return;
    }
    setFund(stored);

    fetchFundEstimate(code)
      .then(setEstimate)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code, navigate]);

  if (!fund) return null;

  const hasEstimate = !!estimate;
  const marketValue = hasEstimate ? fund.shares * estimate.estimateValue : null;
  const profit = marketValue !== null ? marketValue - fund.cost : null;
  const profitRate = fund.cost > 0 && profit !== null ? (profit / fund.cost) * 100 : null;
  const costPrice = fund.shares > 0 ? fund.cost / fund.shares : 0;
  const isProfit = profit !== null ? profit >= 0 : null;

  const handleDelete = () => {
    removeFund(code);
    navigate('/', { replace: true });
  };

  const InfoRow = ({ label, value, valueClass = '' }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 safe-bottom">
      <Header
        title="基金详情"
        showBack
        rightAction={
          <button
            onClick={() => navigate(`/add?edit=${code}`)}
            className="text-purple-600 text-sm"
          >
            编辑
          </button>
        }
      />

      {/* Fund name and today's change */}
      <div className="bg-white mx-4 mt-4 rounded-xl p-5 shadow-sm">
        <div className="text-lg font-semibold text-gray-800">
          {estimate?.name || fund.name || '加载中...'}
        </div>
        <div className="text-sm text-gray-400 mt-1">{fund.code}</div>

        {hasEstimate && (
          <div className="mt-4 flex items-end gap-4">
            <div>
              <div className="text-xs text-gray-400">实时估值</div>
              <div className="text-2xl font-bold text-gray-800">
                {estimate.estimateValue.toFixed(4)}
              </div>
            </div>
            <div className={`text-lg font-bold ${estimate.estimateGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {estimate.estimateGrowth >= 0 ? '+' : ''}{estimate.estimateGrowth.toFixed(2)}%
            </div>
          </div>
        )}
        {hasEstimate && (
          <div className="text-xs text-gray-300 mt-2">
            估算时间：{estimate.estimateTime} | 净值日期：{estimate.valueDate}
          </div>
        )}
        {loading && <div className="skeleton w-32 h-8 mt-4" />}
      </div>

      {/* Profit/Loss card */}
      {profit !== null && (
        <div className={`mx-4 mt-3 rounded-xl p-5 shadow-sm ${isProfit ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="text-sm text-gray-500 mb-1">持仓盈亏</div>
          <div className={`text-3xl font-bold ${isProfit ? 'text-profit' : 'text-loss'}`}>
            {isProfit ? '+' : ''}¥{profit.toFixed(2)}
          </div>
          <div className={`text-sm mt-1 ${isProfit ? 'text-profit' : 'text-loss'}`}>
            收益率 {isProfit ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
        <InfoRow label="持有份额" value={`${fund.shares.toFixed(2)} 份`} />
        <InfoRow label="持仓成本" value={`¥${fund.cost.toFixed(2)}`} />
        <InfoRow label="成本价" value={`¥${costPrice.toFixed(4)}`} />
        {hasEstimate && (
          <>
            <InfoRow label="最新估值净值" value={estimate.estimateValue.toFixed(4)} />
            <InfoRow label="上一交易日净值" value={estimate.netValue.toFixed(4)} />
            <InfoRow
              label="当前市值"
              value={`¥${marketValue.toFixed(2)}`}
              valueClass="text-gray-800"
            />
          </>
        )}
        <InfoRow label="添加日期" value={fund.addedAt} />
      </div>

      {/* Delete button */}
      <div className="px-4 mt-6 pb-8">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 text-red-500 bg-white rounded-xl border border-red-200 font-medium active:bg-red-50 transition-colors"
          >
            删除基金
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 font-medium"
            >
              取消
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium active:bg-red-600"
            >
              确认删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
