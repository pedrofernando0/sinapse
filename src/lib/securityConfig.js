const normalizePublicValue = (value = '') => value.trim();
const normalizePublicUsername = (value = '') => normalizePublicValue(value).toLowerCase();

const parseStorageMode = (value = '') => {
  const normalizedValue = normalizePublicValue(value).toLowerCase();
  return normalizedValue === 'local' ? 'local' : 'session';
};

const parsePositiveInteger = (value, fallbackValue) => {
  const parsedValue = Number.parseInt(value ?? '', 10);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallbackValue;
};

export const SECURITY_CONFIG = Object.freeze({
  demoStudentUsername: normalizePublicUsername(import.meta.env.VITE_DEMO_STUDENT_USERNAME || 'valentina'),
  demoStudentPassword: normalizePublicValue(import.meta.env.VITE_DEMO_STUDENT_PASSWORD || ''),
  demoPowerUserUsername: normalizePublicUsername(import.meta.env.VITE_DEMO_POWER_USER_USERNAME || 'pedro'),
  demoPowerUserPassword: normalizePublicValue(import.meta.env.VITE_DEMO_POWER_USER_PASSWORD || ''),
  demoSessionStorage: parseStorageMode(import.meta.env.VITE_DEMO_SESSION_STORAGE),
  demoSessionTtlMinutes: parsePositiveInteger(import.meta.env.VITE_DEMO_SESSION_TTL_MINUTES, 240),
});
