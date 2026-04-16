export const DEMO_SESSION_STORAGE_KEY = 'sinapse.demo-session';

export const normalizeCredential = (value = '') => value.trim().toLowerCase();

const DEMO_ACCOUNTS = {
  valentina: {
    username: 'valentina',
    password: 'valentina',
    name: 'Valentina',
    hiddenStudentViews: ['discursiva-ia'],
  },
  pedro: {
    username: 'pedro',
    password: 'pedro',
    hiddenStudentViews: [],
  },
};

const formatDisplayName = (value = '') =>
  value
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const getDemoAccountByCredentials = ({ username = '', password = '' } = {}) => {
  const normalizedUsername = normalizeCredential(username);
  const normalizedPassword = normalizeCredential(password);

  return (
    Object.values(DEMO_ACCOUNTS).find(
      (account) =>
        account.username === normalizedUsername &&
        account.password === normalizedPassword
    ) ?? null
  );
};

export function getDemoDisplayName({ name = '', username = '' } = {}) {
  if (name?.trim()) {
    return formatDisplayName(name);
  }

  const normalizedUsername = normalizeCredential(username);
  if (!normalizedUsername) {
    return null;
  }

  const knownAccount = DEMO_ACCOUNTS[normalizedUsername];
  if (knownAccount?.name) {
    return knownAccount.name;
  }

  return formatDisplayName(normalizedUsername.split('@')[0]);
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

  const knownAccount = getDemoAccountByCredentials(formData);
  if (!knownAccount) {
    return normalizeDemoSession(baseSession);
  }

  return normalizeDemoSession({
    ...baseSession,
    ...(knownAccount.name ? { name: knownAccount.name } : {}),
    hiddenStudentViews: profile === 'aluno' ? knownAccount.hiddenStudentViews : [],
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
