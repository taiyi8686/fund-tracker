import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { addAccount } from '../utils/storage';

const PLATFORMS = ['支付宝', '天天基金', '蛋卷基金', '腾讯理财通', '微信零钱通'];

export default function AddAccount() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleQuickSelect = (platformName) => {
    setName(platformName);
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = addAccount(trimmed);
    navigate(`/?tab=${id}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Header title="新建账户" showBack />

      <div className="px-4 mt-3 space-y-4">
        {/* 快捷选择 */}
        <div>
          <div className="text-[13px] text-gray-500 mb-2.5">快捷选择</div>
          <div className="grid grid-cols-2 gap-2.5">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => handleQuickSelect(p)}
                className={`py-3 px-4 rounded-xl border text-[14px] text-left transition-colors ${
                  name === p
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-700 active:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义名称 */}
        <div>
          <div className="text-[13px] text-gray-500 mb-2.5">自定义名称</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入账户名称"
            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-[15px] outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full py-3 bg-blue-500 text-white rounded-xl text-[15px] font-medium disabled:opacity-40 active:bg-blue-600 transition-colors"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
