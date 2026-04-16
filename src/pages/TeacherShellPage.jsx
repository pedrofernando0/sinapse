import { useNavigate, useSearchParams } from 'react-router-dom';
import TeacherShell from '../../01-app-core/professor.jsx';

export default function TeacherShellPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') || 'overview';

  return (
    <TeacherShell
      key={initialView}
      initialView={initialView}
      onLogout={() => navigate('/login')}
    />
  );
}
