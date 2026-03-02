import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../utils/auth';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      if (isRegister) await register(username, password);
      else await login(username, password);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* 品牌区 */}
      <div className="pt-20 pb-8 text-center">
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
        >
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>太一基金小助手</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>追踪基金涨跌，一目了然</p>
      </div>

      {/* 表单 */}
      <div className="px-5 flex-1">
        <div className="bg-white rounded-xl p-5">
          <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>
            {isRegister ? '注册新账号' : '登录'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>用户名</label>
              <input
                type="text" value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="输入你的用户名"
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{ backgroundColor: '#F9FAFB', color: 'var(--color-text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>密码</label>
              <input
                type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder={isRegister ? '设置密码（至少4位）' : '输入密码'}
                className="w-full px-4 py-3 rounded-lg text-base outline-none"
                style={{ backgroundColor: '#F9FAFB', color: 'var(--color-text-primary)' }}
              />
            </div>
          </div>

          {error && <p className="text-sm mt-3 text-profit">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !username || !password}
            className="w-full mt-5 py-3 text-white rounded-lg font-medium disabled:opacity-40 cursor-pointer active:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {loading ? '请稍候...' : isRegister ? '注册' : '登录'}
          </button>
        </div>

        <div className="text-center mt-5">
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-sm cursor-pointer"
            style={{ color: 'var(--color-accent)' }}
          >
            {isRegister ? '已有账号？去登录' : '没有账号？注册一个'}
          </button>
        </div>
      </div>
    </div>
  );
}
