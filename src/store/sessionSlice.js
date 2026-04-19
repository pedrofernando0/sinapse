export const AUTH_STATUS = Object.freeze({
  authenticated: 'authenticated',
  loading: 'loading',
  unauthenticated: 'unauthenticated',
});

export const getInitialSessionState = () => ({
  authStatus: AUTH_STATUS.loading,
  profile: null,
  session: null,
  user: null,
});

const resolveProfile = ({ session = null, user = null } = {}) =>
  session?.profile ?? user?.profile ?? null;

export const createSessionSlice = (set, get) => ({
  setAuthStatus: (authStatus) =>
    set({
      authStatus,
    }),
  setAuthState: ({ session = null, status = null, user = null } = {}) =>
    set({
      authStatus:
        status ?? (session ? AUTH_STATUS.authenticated : AUTH_STATUS.unauthenticated),
      profile: resolveProfile({ session, user }),
      session,
      user,
    }),
  setSession: (session, user = null) =>
    get().setAuthState({
      session,
      user: user ?? session?.user ?? null,
    }),
  clearSession: () =>
    set({
      authStatus: AUTH_STATUS.unauthenticated,
      profile: null,
      session: null,
      user: null,
    }),
});
