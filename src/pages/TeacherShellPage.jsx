import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import TeacherShell from '../features/teacher/TeacherShell.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';

export default function TeacherShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getStoredDemoSession('professor');

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const initialView = searchParams.get('view') || 'overview';

  return (
    <TeacherShell
      key={initialView}
      initialView={initialView}
      session={session}
      onLogout={() => {
        clearDemoSession();
        navigate('/login');
      }}
    />
  );
}
