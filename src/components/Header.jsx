import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, leftContent, rightAction }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="min-w-[60px]">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 text-base flex items-center gap-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          ) : leftContent || null}
        </div>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        <div className="min-w-[60px] flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
