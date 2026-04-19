export const createSessionSlice = (set) => ({
  session: null,
  profile: null,
  setSession: (session) =>
    set({
      session,
      profile: session?.profile ?? null,
    }),
  clearSession: () =>
    set({
      session: null,
      profile: null,
    }),
});
