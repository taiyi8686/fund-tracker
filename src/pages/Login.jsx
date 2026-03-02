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
    <div
      style={{
        maxWidth: 430, margin: "0 auto", minHeight: "100vh",
        background: "#f5f6fa",
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif',
      }}
    >
      {/* Brand */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "80px 20px 48px",
          borderRadius: "0 0 20px 20px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: 64, height: 64, borderRadius: 18,
            background: "rgba(255,255,255,0.2)",
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg style={{ width: 36, height: 36 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>太一基金小助手</h1>
        <p style={{ fontSize: 14, marginTop: 6, opacity: 0.8 }}>追踪基金涨跌，一目了然</p>
      </div>

      {/* Form */}
      <div style={{ padding: "20px 14px" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 18px", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#1a1a2e" }}>
            {isRegister ? '注册新账号' : '登录'}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, marginBottom: 6, color: "#666" }}>用户名</label>
              <input
                type="text" value={username}
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="输入你的用户名"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #eee", fontSize: 15, outline: "none",
                  background: "#f9fafb", color: "#1a1a2e", boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, marginBottom: 6, color: "#666" }}>密码</label>
              <input
                type="password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder={isRegister ? '设置密码（至少4位）' : '输入密码'}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 10,
                  border: "1px solid #eee", fontSize: 15, outline: "none",
                  background: "#f9fafb", color: "#1a1a2e", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {error && <p style={{ fontSize: 13, marginTop: 12, color: "#e94560" }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !username || !password}
            style={{
              width: "100%", marginTop: 20, padding: "12px 0", fontSize: 15,
              fontWeight: 500, border: "none", borderRadius: 12, cursor: "pointer",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
              opacity: (loading || !username || !password) ? 0.4 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? '请稍候...' : isRegister ? '注册' : '登录'}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ fontSize: 13, color: "#764ba2", background: "none", border: "none", cursor: "pointer" }}
          >
            {isRegister ? '已有账号？去登录' : '没有账号？注册一个'}
          </button>
        </div>
      </div>
    </div>
  );
}
