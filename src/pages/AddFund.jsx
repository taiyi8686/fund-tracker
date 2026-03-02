import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchFundEstimate, isValidFundCode } from '../utils/fundApi';
import { addFund, getFund } from '../utils/storage';

export default function AddFund() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editCode = searchParams.get('edit');

  const [code, setCode] = useState(editCode || '');
  const [fundName, setFundName] = useState('');
  const [shares, setShares] = useState('');
  const [cost, setCost] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Load existing fund data for editing
  useEffect(() => {
    if (editCode) {
      const existing = getFund(editCode);
      if (existing) {
        setShares(String(existing.shares));
        setCost(String(existing.cost));
        setConfirmed(true);
        // Fetch name
        fetchFundEstimate(editCode).then(data => {
          setFundName(data.name);
        }).catch(() => {
          setFundName(existing.name || '');
        });
      }
    }
  }, [editCode]);

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

  const costPrice = shares && cost && parseFloat(shares) > 0
    ? (parseFloat(cost) / parseFloat(shares)).toFixed(4)
    : null;

  const handleSubmit = () => {
    if (!confirmed || !shares || !cost) return;

    const sharesNum = parseFloat(shares);
    const costNum = parseFloat(cost);

    if (sharesNum <= 0 || costNum <= 0) return;

    addFund({
      code,
      name: fundName,
      shares: sharesNum,
      cost: costNum,
    });
    navigate('/', { replace: true });
  };

  const canSubmit = confirmed && shares && cost &&
    parseFloat(shares) > 0 && parseFloat(cost) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={editCode ? '编辑基金' : '添加基金'} showBack />

      <div className="px-4 mt-4 space-y-4">
        {/* Fund code input */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm text-gray-500 mb-2">基金代码</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={handleCodeChange}
              placeholder="输入6位基金代码，如 110011"
              disabled={!!editCode}
              className="flex-1 px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-60"
            />
            {!editCode && (
              <button
                onClick={searchFund}
                disabled={searching || code.length !== 6}
                className="px-4 py-2.5 bg-gradient-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {searching ? '搜索中...' : '查询'}
              </button>
            )}
          </div>
          {searchError && (
            <p className="text-red-500 text-xs mt-2">{searchError}</p>
          )}
          {confirmed && fundName && (
            <div className="mt-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-700">✓ {fundName}</span>
            </div>
          )}
        </div>

        {/* Shares and cost input */}
        {confirmed && (
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div>
              <label className="block text-sm text-gray-500 mb-2">持有份额</label>
              <input
                type="text"
                inputMode="decimal"
                value={shares}
                onChange={(e) => setShares(e.target.value.replace(/[^\d.]/g, ''))}
                placeholder="输入持有份额"
                className="w-full px-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">持仓成本（买入总金额）</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">¥</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={cost}
                  onChange={(e) => setCost(e.target.value.replace(/[^\d.]/g, ''))}
                  placeholder="输入买入总金额"
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50 rounded-lg text-base outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>
            </div>

            {costPrice && (
              <div className="text-sm text-gray-500">
                成本价：¥{costPrice} / 份
              </div>
            )}
          </div>
        )}

        {/* Submit button */}
        {confirmed && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-3 bg-gradient-primary text-white rounded-xl font-medium shadow-lg disabled:opacity-50 active:opacity-90 transition-opacity"
          >
            {editCode ? '保存修改' : '添加基金'}
          </button>
        )}
      </div>
    </div>
  );
}
