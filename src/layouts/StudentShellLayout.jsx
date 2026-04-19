import { useCallback, useEffect, useMemo } from 'react';
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { STUDENT_VIEW_IDS } from '../features/student/StudentShell.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';
import { useAppStore } from '../store/index.js';

export default function StudentShellLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getStoredDemoSession('aluno');
  const setSession = useAppStore((state) => state.setSession);
  const clearSession = useAppStore((state) => state.clearSession);
  const requestedView = searchParams.get('view');
  const initialView = requestedView || 'dashboard';
  const safeInitialView = !session || !STUDENT_VIEW_IDS.includes(initialView) || session.hiddenStudentViews?.includes(initialView)
    ? 'dashboard'
    : initialView;

  useEffect(() => {
    if (session) {
      setSession(session);
      return;
    }

    clearSession();
  }, [clearSession, session, setSession]);

  useEffect(() => {
    if (!session || requestedView === safeInitialView) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', safeInitialView);
    setSearchParams(nextSearchParams, { replace: true });
  }, [requestedView, safeInitialView, searchParams, session, setSearchParams]);

  const handleViewChange = useCallback((nextView) => {
    if (requestedView === nextView) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set('view', nextView);
    setSearchParams(nextSearchParams);
  }, [requestedView, searchParams, setSearchParams]);

  const handleLogout = useCallback(() => {
    clearSession();
    clearDemoSession();
    navigate('/login');
  }, [clearSession, navigate]);

  const outletContext = useMemo(() => ({
    session,
    safeInitialView,
    onViewChange: handleViewChange,
    onLogout: handleLogout,
  }), [handleLogout, handleViewChange, safeInitialView, session]);

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
}
