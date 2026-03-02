import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchFundEstimate, isValidFundCode } from '../utils/fundApi';
import { addFundToAccount, getFundFromAccount, getAccount } from '../utils/storage';

export default function AddFund() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editCode = searchParams.get('edit');

  const [code, setCode] = useState(editCode || '');
  const [fundName, setFundName] = useState('');
  const [amount, setAmount] = useState('');
  const [profit, setProfit] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const account = getAccount(accountId);

  useEffect(() => {
    if (editCode && accountId) {
      const existing = getFundFromAccount(accountId, editCode);
      if (existing) {
        setAmount(String(existing.amount));
        setProfit(String(existing.profit));
        setConfirmed(true);
        fetchFundEstimate(editCode).then(data => {
          setFundName(data.name);
        }).catch(() => {
          setFundName(existing.name || '');
        });
      }
    }
  }, [editCode, accountId]);

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(val);
    setConfirmed(false);
    setFundName('');
    setSearchError('');
  };

  const searchFund = async () => {
    if (!isValidFundCode(code)) {
      setSearchError('请输入6位基金代码');
      return;
    }
    setSearching(true);
    setSearchError('');
    try {
      const data = await fetchFundEstimate(code);
      setFundName(data.name);
      setConfirmed(true);
    } catch {
      setSearchError('未找到该基金，请检查代码是否正确');
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (!confirmed || !amountNum || amountNum <= 0) return;

    const profitNum = parseFloat(profit) || 0;

    addFundToAccount(accountId, {
      code,
      name: fundName,
      amount: amountNum,
      profit: profitNum,
    });
    navigate(`/?tab=${accountId}`, { replace: true });
  };

  const canSubmit = confirmed && amount && parseFloat(amount) > 0;

  if (!account) return null;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header title={`${editCode ? '编辑' : '新增'}持有 · ${account.name}`} showBack />

      <div className="px-4 mt-3">
        <div className="bg-white rounded-xl px-5 py-4 space-y-4">
          {/* 基金名称 */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[13px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap">基金名称</span>
              {confirmed && fundName ? (
                <span className="text-[14px] text-gray-800 truncate">{fundName}</span>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="请输入基金代码，如 002207"
                  disabled={!!editCode}
                  className="flex-1 text-[14px] text-gray-800 outline-none bg-transparent placeholder-gray-300 disabled:opacity-60"
                />
              )}
            </div>
            {!confirmed && !editCode && (
              <button
                onClick={searchFund}
                disabled={searching || code.length !== 6}
                className="w-full py-2.5 bg-blue-500 text-white rounded-lg text-[14px] font-medium disabled:opacity-40 active:bg-blue-600"
              >
                {searching ? '查询中...' : '查询基金'}
              </button>
            )}
            {searchError && (
              <p className="text-red-500 text-[12px] mt-2">{searchError}</p>
            )}
            {confirmed && !editCode && (
              <button
                onClick={() => { setConfirmed(false); setFundName(''); setCode(''); }}
                className="text-[12px] text-blue-500 mt-1"
              >
                重新选择基金
              </button>
            )}
          </div>

          {confirmed && (
            <>
              <div className="border-t border-gray-100" />
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap">持有金额</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="输入该基金的持有金额"
                  className="flex-1 text-[14px] text-gray-800 outline-none bg-transparent placeholder-gray-300"
                />
              </div>
              <div className="border-t border-gray-100" />
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg whitespace-nowrap">持有收益</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={profit}
                  onChange={(e) => setProfit(e.target.value.replace(/[^\d.\-]/g, ''))}
                  placeholder="亏损填负数，如 -457"
                  className="flex-1 text-[14px] text-gray-800 outline-none bg-transparent placeholder-gray-300"
                />
              </div>
            </>
          )}
        </div>

        {confirmed && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl text-[15px] font-medium disabled:opacity-40 active:bg-blue-600 transition-colors"
          >
            完成
          </button>
        )}
      </div>
    </div>
  );
}
