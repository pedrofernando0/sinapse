import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store/appStore.js';
import {
  getAuthSession,
  loginWithCredentials,
  logoutSession,
  registerAccount,
  requestPasswordRecovery,
  updateUserProfile,
} from '../services/auth.js';

const buildResolvedAuthState = (payload) => ({
  session: payload?.session ?? null,
  status: payload?.session ? 'authenticated' : 'unauthenticated',
  user: payload?.user ?? null,
});

export function useAuth() {
  const authStatus = useAppStore((state) => state.authStatus);
  const session = useAppStore((state) => state.session);
  const user = useAppStore((state) => state.user);
  const resetAppState = useAppStore((state) => state.resetAppState);
  const setAuthState = useAppStore((state) => state.setAuthState);
  const setAuthStatus = useAppStore((state) => state.setAuthStatus);

  const refreshSession = useCallback(async () => {
    setAuthStatus('loading');

    try {
      const payload = await getAuthSession();
      setAuthState(buildResolvedAuthState(payload));
      return payload;
    } catch (error) {
      setAuthState({
        session: null,
        status: 'unauthenticated',
        user: null,
      });
      throw error;
    }
  }, [setAuthState, setAuthStatus]);

  const login = useCallback(
    async ({ formData, profile }) => {
      setAuthStatus('loading');

      try {
        const payload = await loginWithCredentials({ formData, profile });
        setAuthState(buildResolvedAuthState(payload));
        return payload;
      } catch (error) {
        setAuthState({
          session: null,
          status: 'unauthenticated',
          user: null,
        });
        throw error;
      }
    },
    [setAuthState, setAuthStatus],
  );

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      resetAppState();
      useAppStore.getState().setAuthState({
        session: null,
        status: 'unauthenticated',
        user: null,
      });
    }
  }, [resetAppState]);

  const register = useCallback(
    async (payload) => {
      const response = await registerAccount(payload);

      if (response?.session || response?.user) {
        setAuthState(buildResolvedAuthState(response));
      }

      return response;
    },
    [setAuthState],
  );

  const recoverPassword = useCallback(async (email) => {
    return requestPasswordRecovery(email);
  }, []);

  const updateProfile = useCallback(
    async (payload) => {
      const response = await updateUserProfile(payload);
      setAuthState(buildResolvedAuthState(response));
      return response;
    },
    [setAuthState],
  );

  return {
    login,
    logout,
    recoverPassword,
    refreshSession,
    register,
    session,
    status: authStatus,
    updateProfile,
    user,
  };
}

export function useAuthBootstrap() {
  const hasBootstrappedRef = useRef(false);
  const { refreshSession } = useAuth();

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return;
    }

    hasBootstrappedRef.current = true;
    refreshSession().catch(() => {});
  }, [refreshSession]);
}
