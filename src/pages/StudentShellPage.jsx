import { useNavigate, useSearchParams } from 'react-router-dom';
import StudentShell from '../../01-app-core/aluno.jsx';

export default function StudentShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') || 'dashboard';

  return (
    <StudentShell
      key={initialView}
      initialView={initialView}
      onLogout={() => navigate('/login')}
    />
  );
}
