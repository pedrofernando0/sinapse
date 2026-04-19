import { useCallback, useEffect, useMemo } from 'react';
import {
  Navigate,
  Outlet,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { TEACHER_VIEW_IDS } from '../features/teacher/TeacherShell.jsx';
import { useAuth } from '../lib/useAuth.js';

export default function TeacherShellLayout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, session, status } = useAuth();
  const requestedView = searchParams.get('view');
  const initialView = requestedView || 'overview';
  const safeInitialView = !session || !TEACHER_VIEW_IDS.includes(initialView) ? 'overview' : initialView;

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
    logout().finally(() => {
      navigate('/login');
    });
  }, [logout, navigate]);

  const outletContext = useMemo(() => ({
    session,
    safeInitialView,
    onViewChange: handleViewChange,
    onLogout: handleLogout,
  }), [handleLogout, handleViewChange, safeInitialView, session]);

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
}
