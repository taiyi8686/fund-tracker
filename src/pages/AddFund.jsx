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
    <div
      style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      }}
    >
      <Header title={`${editCode ? '编辑' : '新增'}持有 · ${account.name}`} showBack />

      <div style={{ padding: 14 }}>
        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          {/* Fund Code */}
          <div style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                color: "#764ba2", background: "rgba(118,75,162,0.08)", flexShrink: 0,
              }}>
                基金名称
              </span>
              {confirmed && fundName ? (
                <span style={{ fontSize: 14, color: "#1a1a2e" }}>{fundName}</span>
              ) : (
                <input
                  type="text" inputMode="numeric" value={code}
                  onChange={handleCodeChange}
                  placeholder="请输入基金代码，如 002207"
                  disabled={!!editCode}
                  style={{
                    flex: 1, fontSize: 14, outline: "none", border: "none",
                    background: "transparent", color: "#1a1a2e",
                    opacity: editCode ? 0.6 : 1,
                  }}
                />
              )}
            </div>
            {!confirmed && !editCode && (
              <button
                onClick={searchFund}
                disabled={searching || code.length !== 6}
                style={{
                  width: "100%", marginTop: 12, padding: "10px 0", fontSize: 14,
                  fontWeight: 500, border: "none", borderRadius: 10, cursor: "pointer",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  opacity: (searching || code.length !== 6) ? 0.4 : 1,
                }}
              >
                {searching ? '查询中...' : '查询基金'}
              </button>
            )}
            {searchError && <p style={{ fontSize: 12, marginTop: 8, color: "#e94560" }}>{searchError}</p>}
            {confirmed && !editCode && (
              <button
                onClick={() => { setConfirmed(false); setFundName(''); setCode(''); }}
                style={{ fontSize: 12, marginTop: 6, color: "#764ba2", background: "none", border: "none", cursor: "pointer" }}
              >
                重新选择基金
              </button>
            )}
          </div>

          {confirmed && (
            <>
              <div style={{ borderTop: "1px solid #f3f3f3" }} />
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                  color: "#764ba2", background: "rgba(118,75,162,0.08)", flexShrink: 0,
                }}>
                  持有金额
                </span>
                <input
                  type="text" inputMode="decimal" value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="输入该基金的持有金额"
                  style={{ flex: 1, fontSize: 14, outline: "none", border: "none", background: "transparent", color: "#1a1a2e" }}
                />
              </div>
              <div style={{ borderTop: "1px solid #f3f3f3" }} />
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                  color: "#764ba2", background: "rgba(118,75,162,0.08)", flexShrink: 0,
                }}>
                  持有收益
                </span>
                <input
                  type="text" inputMode="decimal" value={profit}
                  onChange={(e) => setProfit(e.target.value.replace(/[^\d.\-]/g, ''))}
                  placeholder="亏损填负数，如 -457"
                  style={{ flex: 1, fontSize: 14, outline: "none", border: "none", background: "transparent", color: "#1a1a2e" }}
                />
              </div>
            </>
          )}
        </div>

        {confirmed && (
          <button
            onClick={handleSubmit}
            disabled={!confirmed || !amount || !(parseFloat(amount) > 0)}
            style={{
              width: "100%", marginTop: 14, padding: "12px 0", fontSize: 15,
              fontWeight: 500, border: "none", borderRadius: 12, cursor: "pointer",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              opacity: (!confirmed || !amount || !(parseFloat(amount) > 0)) ? 0.4 : 1,
            }}
          >
            完成
          </button>
        )}
      </div>
    </div>
  );
}
