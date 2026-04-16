import { useNavigate } from 'react-router-dom';
import LoginScreen from '../../01-app-core/login.jsx';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ profile }) => {
    if (profile === 'professor') {
      navigate('/professor');
      return;
    }

    navigate('/aluno');
  };

  return <LoginScreen onLogin={handleLogin} />;
}
