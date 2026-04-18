import { useNavigate } from 'react-router-dom';
import LoginScreen from '../features/auth/Login.jsx';
import { buildDemoSession, persistDemoSession } from '../lib/demoSession.js';
import { getLaunchDestination } from '../lib/launchExperience.js';
import { preloadShellPage } from '../lib/pageLoaders.js';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = ({ profile, formData }) => {
    const session = buildDemoSession({ profile, formData });
    if (!session) {
      return;
    }
    persistDemoSession(session);
    preloadShellPage(profile);
    navigate(getLaunchDestination(profile));
  };

  return <LoginScreen onLogin={handleLogin} />;
}
