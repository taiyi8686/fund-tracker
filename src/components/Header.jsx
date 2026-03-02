import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, leftContent, rightAction }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between h-11 px-5">
        <div className="min-w-12">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-11 h-11 -ml-2 cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : leftContent || null}
        </div>
        <h1 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>{title}</h1>
        <div className="min-w-12 flex justify-end">{rightAction}</div>
      </div>
    </header>
  );
}
