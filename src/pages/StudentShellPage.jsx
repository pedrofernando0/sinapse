import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StudentShell from '../../01-app-core/aluno.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';

export default function StudentShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getStoredDemoSession('aluno');
  const initialView = searchParams.get('view') || 'dashboard';
  const safeInitialView = session?.hiddenStudentViews?.includes(initialView) ? 'dashboard' : initialView;

  useEffect(() => {
    if (safeInitialView !== initialView) {
      navigate(`/aluno?view=${safeInitialView}`, { replace: true });
    }
  }, [initialView, navigate, safeInitialView]);

  return (
    <StudentShell
      key={safeInitialView}
      initialView={safeInitialView}
      session={session}
      onLogout={() => {
        clearDemoSession();
        navigate('/login');
      }}
    />
  );
}
