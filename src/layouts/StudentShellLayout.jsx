import { useCallback, useEffect, useMemo } from 'react';
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { STUDENT_VIEW_IDS } from '../features/student/StudentShell.jsx';
import { getLaunchDestination } from '../lib/launchExperience.js';
import { logoutSession } from '../services/auth.js';
import { useAppStore } from '../store/index.js';

export default function StudentShellLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const authStatus = useAppStore((state) => state.authStatus);
  const session = useAppStore((state) => state.session);
  const clearSession = useAppStore((state) => state.clearSession);
  const requestedView = searchParams.get('view');
  const initialView = requestedView || 'dashboard';
  const safeInitialView = !session || !STUDENT_VIEW_IDS.includes(initialView) || session.hiddenStudentViews?.includes(initialView)
    ? 'dashboard'
    : initialView;

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
    logoutSession().catch(() => {}).finally(() => {
      clearSession();
      navigate('/login', { replace: true });
    });
  }, [clearSession, navigate]);

  const outletContext = useMemo(() => ({
    session,
    safeInitialView,
    onViewChange: handleViewChange,
    onLogout: handleLogout,
  }), [handleLogout, handleViewChange, safeInitialView, session]);

  if (authStatus === 'loading') {
    return <div className="min-h-screen bg-[#050505]" />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.profile !== 'aluno') {
    return <Navigate to={getLaunchDestination(session.profile)} replace />;
  }

  return <Outlet context={outletContext} />;
}
