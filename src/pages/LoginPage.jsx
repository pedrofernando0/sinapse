import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginScreen from '../features/auth/Login.jsx';
import { useAuth } from '../lib/useAuth.js';
import { getLaunchDestination } from '../lib/launchExperience.js';
import { preloadShellPage } from '../lib/pageLoaders.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, recoverPassword, register, session, status } = useAuth();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.profile) {
      return;
    }

    navigate(getLaunchDestination(session.profile), { replace: true });
  }, [navigate, session, status]);

  const handleLogin = async ({ profile, formData }) => {
    const payload = await login({ profile, formData });
    preloadShellPage(profile);
    navigate(getLaunchDestination(profile));
    return payload;
  };

  const handleRegister = async (payload) => {
    const response = await register(payload);

    if (response?.session) {
      preloadShellPage(payload.profile);
      navigate(getLaunchDestination(payload.profile));
    }

    return response;
  };

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onRecover={recoverPassword}
      onRegister={handleRegister}
    />
  );
}
