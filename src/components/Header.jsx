import { useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle, showBack = false, rightAction, gradient = "purple" }) {
  const navigate = useNavigate();
  const bg = gradient === "blue"
    ? "linear-gradient(135deg, #1a5ce0 0%, #2d7ff9 100%)"
    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <div
      style={{
        background: bg,
        padding: "16px 16px 20px",
        color: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none", border: "none", color: "#fff",
              fontSize: 22, cursor: "pointer", padding: 0, lineHeight: 1,
            }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11, opacity: 0.7 }}>{subtitle}</div>}
        </div>
        <div style={{ minWidth: 22, display: "flex", justifyContent: "flex-end" }}>
          {rightAction || <div style={{ width: 22 }} />}
        </div>
      </div>
    </div>
  );
}
