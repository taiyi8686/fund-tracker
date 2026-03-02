import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ title, showBack = false, rightAction }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="w-16">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 text-sm flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回
            </button>
          )}
        </div>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>
        <div className="w-16 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
