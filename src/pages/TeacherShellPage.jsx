import { useCallback, useEffect } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TeacherShell, { TEACHER_VIEW_IDS } from '../features/teacher/TeacherShell.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';

export default function TeacherShellPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getStoredDemoSession('professor');

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const requestedView = searchParams.get('view');
  const initialView = requestedView || 'overview';
  const safeInitialView = TEACHER_VIEW_IDS.includes(initialView) ? initialView : 'overview';

  useEffect(() => {
    if (requestedView === safeInitialView) {
      return;
    }
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', safeInitialView);
    setSearchParams(nextSearchParams, { replace: true });
  }, [requestedView, safeInitialView, searchParams, setSearchParams]);

  const handleViewChange = useCallback((nextView) => {
    if (requestedView === nextView) {
      return;
    }
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', nextView);
    setSearchParams(nextSearchParams);
  }, [requestedView, searchParams, setSearchParams]);

  return (
    <TeacherShell
      initialView={safeInitialView}
      session={session}
      onViewChange={handleViewChange}
      onLogout={() => {
        clearDemoSession();
        navigate('/login');
      }}
    />
  );
}
