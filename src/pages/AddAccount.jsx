import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { addAccount } from '../utils/storage';

const PLATFORMS = ['支付宝', '天天基金', '蛋卷基金', '腾讯理财通', '微信零钱通'];

export default function AddAccount() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = addAccount(trimmed);
    navigate(`/?tab=${id}`, { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header title="新建账户" showBack />

      <div className="p-4 space-y-4">
        <div>
          <div className="text-xs mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>快捷选择</div>
          <div className="grid grid-cols-2 gap-2.5">
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setName(p)}
                className="py-3 px-4 rounded-lg text-sm text-left cursor-pointer transition-colors duration-150"
                style={{
                  backgroundColor: name === p ? '#EFF6FF' : 'white',
                  border: `1px solid ${name === p ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  color: name === p ? 'var(--color-accent)' : 'var(--color-text-primary)',
                  fontWeight: name === p ? 500 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs mb-2.5" style={{ color: 'var(--color-text-secondary)' }}>自定义名称</div>
          <input
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入账户名称"
            className="w-full px-4 py-3 rounded-lg text-[15px] outline-none"
            style={{
              backgroundColor: 'white',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full py-3 text-white rounded-lg text-[15px] font-medium disabled:opacity-40 cursor-pointer active:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
