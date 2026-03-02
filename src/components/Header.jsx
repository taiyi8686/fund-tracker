import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = false, leftContent, rightAction }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-[50px] px-5">
        <div className="min-w-[60px]">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="text-gray-800 text-base flex items-center"
            >
              <svg className="w-6 h-6 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : leftContent || null}
        </div>
        <h1 className="text-[17px] font-semibold text-gray-900">{title}</h1>
        <div className="min-w-[60px] flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
