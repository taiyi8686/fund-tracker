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
    <div className="min-h-screen bg-[#F5F6F8] safe-bottom">
      <Header
        title="基金详情"
        showBack
        rightAction={
          <button
            onClick={() => navigate(`/add/${accountId}?edit=${code}`)}
            className="text-blue-500 text-[14px]"
          >
            编辑
          </button>
        }
      />

      {/* 基金名称 + 实时估值 */}
      <div className="bg-white px-4 pt-4 pb-3">
        <div className="text-[17px] font-bold text-gray-900">
          {estimate?.name || fund.name || '加载中...'}
        </div>
        <div className="text-[13px] text-gray-400 mt-0.5">{fund.code}</div>

        {hasEstimate && (
          <div className="mt-4 flex items-end gap-3">
            <div>
              <div className="text-[12px] text-gray-400 mb-0.5">实时估值</div>
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
          <div className="text-[11px] text-gray-300 mt-2">
            估算时间：{estimate.estimateTime} | 净值日期：{estimate.valueDate}
          </div>
        )}
        {loading && <div className="skeleton w-40 h-10 mt-4" />}
      </div>

      {/* 当日估算收益 + 持有收益 */}
      <div className="flex gap-2 mx-3 mt-2">
        {dailyProfit !== null && (
          <div className={`flex-1 rounded-lg px-3.5 py-3 ${dailyGrowth >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
            <div className="text-[12px] text-gray-500 mb-1">当日估算收益</div>
            <div className={`text-[20px] font-bold ${dailyGrowth >= 0 ? 'text-profit' : 'text-loss'}`}>
              {dailyProfit >= 0 ? '+' : ''}¥{dailyProfit.toFixed(2)}
            </div>
          </div>
        )}
        <div className={`flex-1 rounded-lg px-3.5 py-3 ${totalProfit >= 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="text-[12px] text-gray-500 mb-1">持有收益</div>
          <div className={`text-[20px] font-bold ${totalProfit >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfit >= 0 ? '+' : ''}¥{totalProfit.toFixed(2)}
          </div>
          <div className={`text-[12px] mt-0.5 ${totalProfitRate >= 0 ? 'text-profit' : 'text-loss'}`}>
            {totalProfitRate >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* 明细信息 */}
      <div className="bg-white mx-3 mt-2 rounded-lg">
        <DetailRow label="持有金额" value={`¥${fund.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <DetailRow label="买入成本" value={`¥${cost.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        {hasEstimate && (
          <DetailRow label="上个交易日净值" value={estimate.netValue.toFixed(4)} />
        )}
        <DetailRow label="添加日期" value={fund.addedAt} last />
      </div>

      {/* 删除 */}
      <div className="px-3 mt-8 pb-8">
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full py-3 text-red-500 bg-white rounded-lg border border-red-200 text-[14px] active:bg-red-50"
          >
            删除该基金
          </button>
        ) : (
          <div className="flex gap-2.5">
            <button onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 bg-gray-100 rounded-lg text-gray-600 text-[14px]">
              取消
            </button>
            <button onClick={handleDelete}
              className="flex-1 py-3 bg-red-500 text-white rounded-lg text-[14px] active:bg-red-600">
              确认删除
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 ${last ? '' : 'border-b border-gray-50'}`}>
      <span className="text-[14px] text-gray-500">{label}</span>
      <span className="text-[14px] font-medium text-gray-800">{value}</span>
    </div>
  );
}
