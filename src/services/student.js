import {
  apiRequest,
  cachedApiRequest,
  clearApiCache,
} from './api.js'

const VALID_PRIORITIES = new Set(['danger', 'warning', 'success', 'info'])
const VALID_REVISION_STATUSES = new Set(['pending', 'done'])
const STUDENT_NOTIFICATIONS_CACHE_KEY = 'student-notifications'
const STUDENT_MOCK_EXAMS_CACHE_KEY = 'student-mock-exams'
const STUDENT_REVISIONS_CACHE_KEY = 'student-revisions'

const buildFallbackId = () => `student-${Math.random().toString(36).slice(2, 10)}`
const normalizeValue = (value = '') => String(value).trim()

const normalizeNotification = (notification) => {
  const createdAt = new Date(notification?.createdAt)

  return {
    id: String(notification?.id ?? buildFallbackId()),
    title: normalizeValue(notification?.title) || 'Notificacao',
    body: normalizeValue(notification?.body),
    createdAt: Number.isNaN(createdAt.getTime())
      ? new Date().toISOString()
      : createdAt.toISOString(),
    read: Boolean(notification?.read),
    priority: VALID_PRIORITIES.has(notification?.priority)
      ? notification.priority
      : 'info',
  }
}

const normalizeRevision = (revision) => ({
  date: String(revision?.date ?? revision?.scheduledFor ?? new Date().toISOString().slice(0, 10)),
  id: String(revision?.id ?? buildFallbackId()),
  status: VALID_REVISION_STATUSES.has(revision?.status) ? revision.status : 'pending',
  subject: normalizeValue(revision?.subject) || 'Geral',
  topic: normalizeValue(revision?.topic) || 'Novo topico',
})

const determineExamLevel = ({ acertos, total }) => {
  const numericTotal = Number(total)

  if (!numericTotal) {
    return 'bad'
  }

  const percentage = Number(acertos) / numericTotal

  if (percentage >= 0.7) {
    return 'good'
  }

  if (percentage >= 0.5) {
    return 'average'
  }

  return 'bad'
}

const normalizeMockExam = (exam) => {
  const acertos = Number(exam?.acertos ?? exam?.correctAnswers ?? 0)
  const total = Number(exam?.total ?? exam?.totalQuestions ?? 0)

  return {
    acertos,
    date: String(exam?.date ?? exam?.examDate ?? new Date().toISOString().slice(0, 10)),
    id: String(exam?.id ?? buildFallbackId()),
    level: determineExamLevel({ acertos, total }),
    name: normalizeValue(exam?.name) || 'Simulado',
    time: String(exam?.time ?? exam?.duration ?? '00:00'),
    total,
  }
}

const invalidateNotifications = () => clearApiCache(STUDENT_NOTIFICATIONS_CACHE_KEY)
const invalidateMockExams = () => clearApiCache(STUDENT_MOCK_EXAMS_CACHE_KEY)
const invalidateRevisions = () => clearApiCache(STUDENT_REVISIONS_CACHE_KEY)

export async function getStudentNotifications() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_NOTIFICATIONS_CACHE_KEY,
    path: '/student/notifications',
  })

  return Array.isArray(response) ? response.map(normalizeNotification) : []
}

export async function markStudentNotificationAsRead(notificationId) {
  await apiRequest({
    method: 'PATCH',
    path: `/student/notifications/${notificationId}`,
  })

  invalidateNotifications()
}

export async function markAllStudentNotificationsAsRead() {
  await apiRequest({
    method: 'POST',
    path: '/student/notifications/read-all',
  })

  invalidateNotifications()
}

export async function getStudentRevisions() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_REVISIONS_CACHE_KEY,
    path: '/student/revisions',
  })

  return Array.isArray(response) ? response.map(normalizeRevision) : []
}

export async function createStudentRevision(payload) {
  const response = await apiRequest({
    body: payload,
    method: 'POST',
    path: '/student/revisions',
  })

  invalidateRevisions()
  return normalizeRevision(response)
}

export async function updateStudentRevision(id, payload) {
  const response = await apiRequest({
    body: payload,
    method: 'PATCH',
    path: `/student/revisions/${id}`,
  })

  invalidateRevisions()
  return normalizeRevision(response)
}

export async function saveStudentRevision(revision) {
  if (revision?.id) {
    return updateStudentRevision(revision.id, revision)
  }

  return createStudentRevision(revision)
}

export async function updateStudentRevisionStatus(revisionId, status) {
  return updateStudentRevision(revisionId, { status })
}

export async function deleteStudentRevision(revisionId) {
  await apiRequest({
    method: 'DELETE',
    path: `/student/revisions/${revisionId}`,
  })

  invalidateRevisions()
}

export async function getStudentMockExams() {
  const response = await cachedApiRequest({
    cacheKey: STUDENT_MOCK_EXAMS_CACHE_KEY,
    path: '/student/mock-exams',
  })

  return Array.isArray(response) ? response.map(normalizeMockExam) : []
}

export async function createStudentMockExam(payload) {
  const response = await apiRequest({
    body: payload,
    method: 'POST',
    path: '/student/mock-exams',
  })

  invalidateMockExams()
  return normalizeMockExam(response)
}

export async function updateStudentMockExam(id, payload) {
  const response = await apiRequest({
    body: payload,
    method: 'PATCH',
    path: `/student/mock-exams/${id}`,
  })

  invalidateMockExams()
  return normalizeMockExam(response)
}

export async function saveStudentMockExam(exam) {
  if (exam?.id) {
    return updateStudentMockExam(exam.id, exam)
  }

  return createStudentMockExam(exam)
}

export async function deleteStudentMockExam(examId) {
  await apiRequest({
    method: 'DELETE',
    path: `/student/mock-exams/${examId}`,
  })

  invalidateMockExams()
}
