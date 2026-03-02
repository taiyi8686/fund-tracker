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

  const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-3.5 border-b border-gray-50 last:border-0">
      <span className="text-[14px] text-gray-500">{label}</span>
      <span className="text-[14px] font-medium text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6FA] safe-bottom">
      <Header
        title="基金详情"
        showBack
        rightAction={
          <button
            onClick={() => navigate(`/add/${accountId}?edit=${code}`)}
            className="text-blue-500 text-[15px]"
          >
            编辑
          </button>
        }
      />

      {/* 基金名称 + 实时估值 */}
      <div className="bg-white mx-4 mt-3 rounded-xl px-5 py-4">
        <div className="text-[17px] font-semibold text-gray-800">
          {estimate?.name || fund.name || '加载中...'}
        </div>
        <div className="text-[13px] text-gray-400 mt-0.5">{fund.code}</div>

        {hasEstimate && (
          <div className="mt-4 flex items-end gap-4">
            <div>
              <div className="text-[12px] text-gray-400 mb-1">实时估值</div>
              <div className="text-[28px] font-bold text-gray-900 leading-tight">
                {estimate.estimateValue.toFixed(4)}
              </div>
            </div>
            <div className={`text-[20px] font-bold mb-0.5 ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyGrowth >= 0 ? '+' : ''}{dailyGrowth.toFixed(2)}%
            </div>
          </div>
        )}
        {hasEstimate && (
          <div className="text-[11px] text-gray-300 mt-2.5">
            估算时间：{estimate.estimateTime} | 净值日期：{estimate.valueDate}
          </div>
        )}
        {loading && <div className="skeleton w-40 h-10 mt-4" />}
      </div>

      {/* 当日估算收益 + 持有收益 并排 */}
      <div className="flex gap-2.5 mx-4 mt-2.5">
        {dailyProfit !== null && (
          <div className={`flex-1 rounded-xl px-4 py-3.5 ${dailyGrowth >= 0 ? 'bg-profit-light' : 'bg-loss-light'}`}>
            <div className="text-[12px] text-gray-500 mb-1.5">当日估算收益</div>
            <div className={`text-[22px] font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyProfit >= 0 ? '+' : ''}¥{dailyProfit.toFixed(2)}
            </div>
          </div>
        )}
        <div className={`flex-1 rounded-xl px-4 py-3.5 ${totalProfit >= 0 ? 'bg-profit-light' : 'bg-loss-light'}`}>
          <div className="text-[12px] text-gray-500 mb-1.5">持有收益</div>
          <div className={`text-[22px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toFixed(2)}
          </div>
          <div className={`text-[12px] mt-0.5 ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 明细信息 */}
      <div className="bg-white mx-4 mt-2.5 rounded-xl px-5 py-1">
        <InfoRow label="持有金额" value={`¥${fund.amount.toFixed(2)}`} />
        <InfoRow label="买入成本" value={`¥${cost.toFixed(2)}`} />
        {hasEstimate && (
          <InfoRow label="上个交易日净值" value={estimate.netValue.toFixed(4)} />
        )}
        <InfoRow label="添加日期" value={fund.addedAt} />
      </div>

      {/* 删除 */}
      <div className="px-4 mt-8 pb-8">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 text-red-500 bg-white rounded-xl border border-red-200 text-[15px] active:bg-red-50 transition-colors"
          >
            删除该基金
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-gray-100 rounded-xl text-gray-600 text-[15px]">
              取消
            </button>
            <button onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-xl text-[15px] active:bg-red-600">
              确认删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
