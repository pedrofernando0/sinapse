import { apiRequest } from './api.js';

export async function getAuthSession() {
  return apiRequest({
    path: '/auth/session',
  });
}

export async function loginWithCredentials({ formData, profile }) {
  return apiRequest({
    body: {
      email: formData?.email ?? formData?.username ?? '',
      password: formData?.password ?? '',
      profile,
    },
    method: 'POST',
    path: '/auth/login',
  });
}

export async function logoutSession() {
  return apiRequest({
    method: 'POST',
    path: '/auth/logout',
  });
}

export async function registerAccount(payload) {
  return apiRequest({
    body: payload,
    method: 'POST',
    path: '/auth/register',
  });
}

export async function requestPasswordRecovery(email) {
  return apiRequest({
    body: { email },
    method: 'POST',
    path: '/auth/recover',
  });
}

export async function updateUserProfile(payload) {
  return apiRequest({
    body: payload,
    method: 'PATCH',
    path: '/auth/profile',
  });
}
