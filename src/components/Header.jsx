import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, leftContent, rightAction }) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 16px',
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ minWidth: 48 }}>
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 44, height: 44, marginLeft: -8,
              background: 'none', border: 'none', cursor: 'pointer', color: '#fff',
            }}
          >
            <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : leftContent || null}
      </div>
      <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
      <div style={{ minWidth: 48, display: 'flex', justifyContent: 'flex-end' }}>{rightAction}</div>
    </header>
  );
}
