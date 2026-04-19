import {
  apiRequest,
  cachedApiRequest,
  clearApiCache,
} from './api.js';

const VALID_PRIORITIES = new Set(['danger', 'warning', 'success', 'info']);
const buildNotificationId = () => `notification-${Math.random().toString(36).slice(2, 10)}`;
const STUDENT_NOTIFICATIONS_CACHE_KEY = 'student-notifications';
const STUDENT_MOCK_EXAMS_CACHE_KEY = 'student-mock-exams';
const STUDENT_REVISIONS_CACHE_KEY = 'student-revisions';

const normalizeNotification = (notification) => {
  const createdAt = new Date(notification?.createdAt);

  return {
    id: String(notification?.id ?? buildNotificationId()),
    title: notification?.title?.trim() || 'Notificação',
    body: notification?.body?.trim() || '',
    createdAt: Number.isNaN(createdAt.getTime())
      ? new Date().toISOString()
      : createdAt.toISOString(),
    read: Boolean(notification?.read),
    priority: VALID_PRIORITIES.has(notification?.priority)
      ? notification.priority
      : 'info',
  };
};

const extractNotifications = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

export async function getStudentNotifications() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_NOTIFICATIONS_CACHE_KEY,
    path: '/student/notifications',
  });

  return extractNotifications(response).map(normalizeNotification);
}

const normalizeMockExam = (mockExam) => ({
  acertos: String(mockExam?.acertos ?? mockExam?.correctAnswers ?? 0),
  date: String(mockExam?.date ?? mockExam?.examDate ?? new Date().toISOString().slice(0, 10)),
  id: String(mockExam?.id ?? buildNotificationId()),
  name: mockExam?.name?.trim() || 'Simulado',
  time: mockExam?.time ?? mockExam?.duration ?? '00:00',
  total: String(mockExam?.total ?? mockExam?.totalQuestions ?? 0),
});

const normalizeRevision = (revision) => ({
  date: String(revision?.date ?? revision?.scheduledFor ?? new Date().toISOString().slice(0, 10)),
  id: String(revision?.id ?? buildNotificationId()),
  status: revision?.status === 'done' ? 'done' : 'pending',
  subject: revision?.subject?.trim() || 'Geral',
  topic: revision?.topic?.trim() || 'Novo tópico',
});

const invalidateStudentCollections = () => {
  clearApiCache(STUDENT_MOCK_EXAMS_CACHE_KEY);
  clearApiCache(STUDENT_REVISIONS_CACHE_KEY);
};

export async function getStudentMockExams() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_MOCK_EXAMS_CACHE_KEY,
    path: '/student/mock-exams',
  });

  return extractNotifications(response).map(normalizeMockExam);
}

export async function createStudentMockExam(payload) {
  const response = await apiRequest({
    body: payload,
    method: 'POST',
    path: '/student/mock-exams',
  });

  clearApiCache(STUDENT_MOCK_EXAMS_CACHE_KEY);
  return normalizeMockExam(response);
}

export async function updateStudentMockExam(id, payload) {
  const response = await apiRequest({
    body: payload,
    method: 'PATCH',
    path: `/student/mock-exams/${id}`,
  });

  clearApiCache(STUDENT_MOCK_EXAMS_CACHE_KEY);
  return normalizeMockExam(response);
}

export async function deleteStudentMockExam(id) {
  const response = await apiRequest({
    method: 'DELETE',
    path: `/student/mock-exams/${id}`,
  });

  clearApiCache(STUDENT_MOCK_EXAMS_CACHE_KEY);
  return response;
}

export async function getStudentRevisions() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_REVISIONS_CACHE_KEY,
    path: '/student/revisions',
  });

  return extractNotifications(response).map(normalizeRevision);
}

export async function createStudentRevision(payload) {
  const response = await apiRequest({
    body: payload,
    method: 'POST',
    path: '/student/revisions',
  });

  clearApiCache(STUDENT_REVISIONS_CACHE_KEY);
  return normalizeRevision(response);
}

export async function updateStudentRevision(id, payload) {
  const response = await apiRequest({
    body: payload,
    method: 'PATCH',
    path: `/student/revisions/${id}`,
  });

  clearApiCache(STUDENT_REVISIONS_CACHE_KEY);
  return normalizeRevision(response);
}

export async function deleteStudentRevision(id) {
  const response = await apiRequest({
    method: 'DELETE',
    path: `/student/revisions/${id}`,
  });

  clearApiCache(STUDENT_REVISIONS_CACHE_KEY);
  return response;
}
