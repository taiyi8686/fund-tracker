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
    if (!isValidFundCode(code)) { setSearchError('请输入6位基金代码'); return; }
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
    addFundToAccount(accountId, {
      code, name: fundName, amount: amountNum, profit: parseFloat(profit) || 0,
    });
    navigate(`/?tab=${accountId}`, { replace: true });
  };

  if (!account) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header title={`${editCode ? '编辑' : '新增'}持有 · ${account.name}`} showBack />

      <div className="p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* 基金名称 */}
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded shrink-0"
                style={{ color: 'var(--color-accent)', backgroundColor: '#EFF6FF' }}
              >
                基金名称
              </span>
              {confirmed && fundName ? (
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{fundName}</span>
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="请输入基金代码，如 002207"
                  disabled={!!editCode}
                  className="flex-1 text-sm outline-none bg-transparent disabled:opacity-60"
                  style={{ color: 'var(--color-text-primary)' }}
                />
              )}
            </div>
            {!confirmed && !editCode && (
              <button
                onClick={searchFund}
                disabled={searching || code.length !== 6}
                className="w-full mt-3 py-2.5 text-white rounded-lg text-sm font-medium disabled:opacity-40 cursor-pointer active:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {searching ? '查询中...' : '查询基金'}
              </button>
            )}
            {searchError && <p className="text-xs mt-2" style={{ color: 'var(--color-profit)' }}>{searchError}</p>}
            {confirmed && !editCode && (
              <button
                onClick={() => { setConfirmed(false); setFundName(''); setCode(''); }}
                className="text-xs mt-1.5 cursor-pointer"
                style={{ color: 'var(--color-accent)' }}
              >
                重新选择基金
              </button>
            )}
          </div>

          {confirmed && (
            <>
              <div style={{ borderTop: '1px solid var(--color-border)' }} />
              <div className="px-4 py-3.5 flex items-center gap-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded shrink-0"
                  style={{ color: 'var(--color-accent)', backgroundColor: '#EFF6FF' }}
                >
                  持有金额
                </span>
                <input
                  type="text" inputMode="decimal" value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="输入该基金的持有金额"
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: 'var(--color-text-primary)' }}
                />
              </div>
              <div style={{ borderTop: '1px solid var(--color-border)' }} />
              <div className="px-4 py-3.5 flex items-center gap-3">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded shrink-0"
                  style={{ color: 'var(--color-accent)', backgroundColor: '#EFF6FF' }}
                >
                  持有收益
                </span>
                <input
                  type="text" inputMode="decimal" value={profit}
                  onChange={(e) => setProfit(e.target.value.replace(/[^\d.\-]/g, ''))}
                  placeholder="亏损填负数，如 -457"
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: 'var(--color-text-primary)' }}
                />
              </div>
            </>
          )}
        </div>

        {confirmed && (
          <button
            onClick={handleSubmit}
            disabled={!confirmed || !amount || !(parseFloat(amount) > 0)}
            className="w-full mt-4 py-3 text-white rounded-lg text-[15px] font-medium disabled:opacity-40 cursor-pointer active:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            完成
          </button>
        )}
      </div>
    </div>
  );
}
