import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherShell from '../../01-app-core/professor.jsx';
import { clearDemoSession, getStoredDemoSession } from '../lib/demoSession.js';

export default function TeacherShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session = getStoredDemoSession('professor');
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
