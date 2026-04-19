export const createSessionSlice = (set) => ({
  authStatus: 'loading',
  session: null,
  profile: null,
  profileRecord: null,
  authUser: null,
  setSession: (session) =>
    set({
      authStatus: session ? 'authenticated' : 'unauthenticated',
      session,
      profile: session?.profile ?? null,
    }),
  setAuthStatus: (authStatus) =>
    set({
      authStatus,
    }),
  setAuthState: ({ session = null, profileRecord = null, authUser = null, status = null } = {}) =>
    set({
      authStatus: status ?? (session ? 'authenticated' : 'unauthenticated'),
      session,
      profile: session?.profile ?? profileRecord?.role ?? null,
      profileRecord,
      authUser,
    }),
  clearSession: () =>
    set({
      authStatus: 'unauthenticated',
      session: null,
      profile: null,
      profileRecord: null,
      authUser: null,
    }),
});
