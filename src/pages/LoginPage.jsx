import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginScreen from '../features/auth/Login.jsx';
import { useAuth } from '../lib/useAuth.js';
import { getLaunchDestination } from '../lib/launchExperience.js';
import { preloadShellPage } from '../lib/pageLoaders.js';
import { isPasswordRecoveryFlow } from '../services/auth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    authStatus,
    login,
    recoverPassword,
    register,
    resetPassword,
    session,
  } = useAuth();

  useEffect(() => {
    if (!session) {
      return;
    }

    preloadShellPage(session.profile);
    navigate(getLaunchDestination(session.profile), { replace: true });
  }, [navigate, session]);

  const handleLogin = async ({ profile, formData }) => {
    const authState = await login({ formData, profile });
    preloadShellPage(authState.session.profile);
    navigate(getLaunchDestination(authState.session.profile), { replace: true });
    return authState;
  };

  const handleRegister = async (payload) => {
    const response = await register(payload);

    if (response?.session) {
      preloadShellPage(response.session.profile);
      navigate(getLaunchDestination(response.session.profile), { replace: true });
    }

    return response;
  };

  return (
    <LoginScreen
      authStatus={authStatus}
      forceResetPassword={isPasswordRecoveryFlow()}
      onLogin={handleLogin}
      onRecoverPassword={recoverPassword}
      onRegister={handleRegister}
      onResetPassword={resetPassword}
    />
  );
}
