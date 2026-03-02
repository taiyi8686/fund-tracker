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
    <div className="app-shell" style={{ background: '#f5f6fa' }}>
      <Header title="新建账户" showBack />

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 13, marginBottom: 10, color: '#666', paddingLeft: 4 }}>快捷选择</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PLATFORMS.map((p) => (
              <button
                key={p}
                onClick={() => setName(p)}
                style={{
                  padding: '12px 16px', borderRadius: 12, fontSize: 14, textAlign: 'left',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: name === p ? 'rgba(118,75,162,0.08)' : '#fff',
                  border: `1.5px solid ${name === p ? '#764ba2' : '#eee'}`,
                  color: name === p ? '#764ba2' : '#1a1a2e',
                  fontWeight: name === p ? 500 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, marginBottom: 10, color: '#666', paddingLeft: 4 }}>自定义名称</div>
          <input
            type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入账户名称"
            style={{
              width: '100%', padding: '12px 16px', borderRadius: 12,
              border: '1.5px solid #eee', fontSize: 15, outline: 'none',
              background: '#fff', color: '#1a1a2e', boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="gradient-btn"
          style={{ width: '100%', padding: '12px 0', fontSize: 15 }}
        >
          下一步
        </button>
      </div>
    </div>
  );
}
