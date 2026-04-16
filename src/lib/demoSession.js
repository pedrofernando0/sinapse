export const DEMO_SESSION_STORAGE_KEY = 'sinapse.demo-session';

export const normalizeCredential = (value = '') => value.trim().toLowerCase();

const isValentinaCredentials = ({ username = '', password = '' }) =>
  normalizeCredential(username) === 'valentina' &&
  normalizeCredential(password) === 'valentina';

export function getDemoDisplayName({ name = '', username = '' } = {}) {
  if (name) {
    return name;
  }

  return normalizeCredential(username) === 'valentina' ? 'Valentina' : null;
}

export function normalizeDemoSession(session) {
  if (!session) {
    return null;
  }

  const username = normalizeCredential(session.username);
  const name = getDemoDisplayName({ name: session.name, username });
  const hiddenStudentViews =
    session.profile === 'aluno' && username === 'valentina'
      ? ['discursiva-ia']
      : session.hiddenStudentViews ?? [];

  return {
    ...session,
    username,
    ...(name ? { name } : {}),
    hiddenStudentViews,
  };
}

export function buildDemoSession({ profile, formData }) {
  const baseSession = {
    profile,
    username: normalizeCredential(formData?.username),
    hiddenStudentViews: [],
  };

  if (!isValentinaCredentials(formData)) {
    return normalizeDemoSession(baseSession);
  }

  return normalizeDemoSession({
    ...baseSession,
    name: 'Valentina',
    hiddenStudentViews: profile === 'aluno' ? ['discursiva-ia'] : [],
  });
}

export function persistDemoSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getStoredDemoSession(expectedProfile) {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawSession = window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = normalizeDemoSession(JSON.parse(rawSession));
    if (!parsedSession) {
      return null;
    }

    if (expectedProfile && parsedSession.profile !== expectedProfile) {
      return null;
    }

    return parsedSession;
  } catch (error) {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearDemoSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
}
