import { useNavigate } from 'react-router-dom';
import LoginScreen from '../../01-app-core/login.jsx';
import { buildDemoSession, persistDemoSession } from '../lib/demoSession.js';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ profile, formData }) => {
    const session = buildDemoSession({ profile, formData });
    persistDemoSession(session);

    if (profile === 'professor') {
      navigate('/professor');
      return;
    }

    navigate('/aluno');
  };

  return <LoginScreen onLogin={handleLogin} />;
}
