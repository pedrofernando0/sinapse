import { SECURITY_CONFIG } from './securityConfig.js';

export const DEMO_SESSION_STORAGE_KEY = 'sinapse.demo-session';

export const normalizeCredential = (value = '') => value.trim().toLowerCase();
const normalizePassword = (value = '') => value.trim();

const DEMO_SESSION_TTL_MS = SECURITY_CONFIG.demoSessionTtlMinutes * 60 * 1000;

const DEMO_ACCOUNTS = [
  {
    username: SECURITY_CONFIG.demoStudentUsername,
    password: SECURITY_CONFIG.demoStudentPassword,
    name: 'Valentina',
    hiddenStudentViews: ['discursiva-ia'],
  },
  {
    username: SECURITY_CONFIG.demoPowerUserUsername,
    password: SECURITY_CONFIG.demoPowerUserPassword,
    name: 'Pedro',
    hiddenStudentViews: [],
  },
].filter((account) => account.username);

const DEMO_ACCOUNTS_BY_USERNAME = Object.fromEntries(
  DEMO_ACCOUNTS.map((account) => [account.username, account])
);
const hasConfiguredStudentDemoAccounts = DEMO_ACCOUNTS.some((account) => account.password);

const formatDisplayName = (value = '') =>
  value
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const getPreferredStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return SECURITY_CONFIG.demoSessionStorage === 'local'
    ? window.localStorage
    : window.sessionStorage;
};

const getSessionStorages = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  const storages = [getPreferredStorage(), window.localStorage, window.sessionStorage].filter(Boolean);
  return storages.filter((storage, index) => storages.indexOf(storage) === index);
};

const readStoredSession = () => {
  for (const storage of getSessionStorages()) {
    const rawSession = storage.getItem(DEMO_SESSION_STORAGE_KEY);
    if (rawSession) {
      return { rawSession, storage };
    }
  }

  return null;
};

const buildSessionExpiry = () => Date.now() + DEMO_SESSION_TTL_MS;

const isExpiredSession = (expiresAt) =>
  !Number.isFinite(expiresAt) || expiresAt <= Date.now();

const getDemoAccountByCredentials = ({ username = '', password = '' } = {}) => {
  const normalizedUsername = normalizeCredential(username);
  const normalizedPassword = normalizePassword(password);

  return (
    DEMO_ACCOUNTS.find(
      (account) =>
        account.password &&
        account.username === normalizedUsername &&
        account.password === normalizedPassword
    ) ?? null
  );
};

export function isDemoLoginAllowed({ profile, formData } = {}) {
  const username = normalizeCredential(formData?.username);
  const password = normalizePassword(formData?.password);

  if (!username || !password) {
    return false;
  }

  if (profile !== 'aluno') {
    return true;
  }

  if (!hasConfiguredStudentDemoAccounts) {
    return true;
  }

  return Boolean(getDemoAccountByCredentials(formData));
}

export function getDemoDisplayName({ name = '', username = '' } = {}) {
  if (name?.trim()) {
    return formatDisplayName(name);
  }

  const normalizedUsername = normalizeCredential(username);
  if (!normalizedUsername) {
    return null;
  }

  const knownAccount = DEMO_ACCOUNTS_BY_USERNAME[normalizedUsername];
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
  const knownAccount = DEMO_ACCOUNTS_BY_USERNAME[username];
  const hiddenStudentViews =
    session.profile === 'aluno'
      ? session.hiddenStudentViews ?? knownAccount?.hiddenStudentViews ?? []
      : [];
  const expiresAt = Number(session.expiresAt);

  return {
    ...session,
    username,
    ...(name ? { name } : {}),
    hiddenStudentViews,
    expiresAt,
  };
}

export function buildDemoSession({ profile, formData }) {
  if (!isDemoLoginAllowed({ profile, formData })) {
    return null;
  }

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
  const normalizedSession = normalizeDemoSession(session);
  const preferredStorage = getPreferredStorage();

  if (!normalizedSession || !preferredStorage) {
    return;
  }

  const persistedSession = {
    ...normalizedSession,
    expiresAt: buildSessionExpiry(),
  };

  clearDemoSession();
  preferredStorage.setItem(DEMO_SESSION_STORAGE_KEY, JSON.stringify(persistedSession));
}

export function getStoredDemoSession(expectedProfile) {
  const storedSession = readStoredSession();
  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = normalizeDemoSession(JSON.parse(storedSession.rawSession));
    if (!parsedSession || isExpiredSession(parsedSession.expiresAt)) {
      clearDemoSession();
      return null;
    }

    if (expectedProfile && parsedSession.profile !== expectedProfile) {
      return null;
    }

    return parsedSession;
  } catch (error) {
    storedSession.storage.removeItem(DEMO_SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearDemoSession() {
  getSessionStorages().forEach((storage) => {
    storage.removeItem(DEMO_SESSION_STORAGE_KEY);
  });
}
