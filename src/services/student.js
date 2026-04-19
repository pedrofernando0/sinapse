import { apiRequest, isApiConfigured } from './api.js';

const MOCK_NOTIFICATION_RESPONSE = [
  {
    id: 'demo-1',
    title: 'Revisão agendada para hoje',
    body: 'Sua revisão de Biologia sobre Ecologia vence às 19h.',
    createdAt: '2026-04-18T19:00:00.000Z',
    read: false,
    priority: 'warning',
  },
  {
    id: 'demo-2',
    title: 'Tutoria com IA liberada',
    body: 'Seu tutor já pode montar um plano para o próximo simulado.',
    createdAt: '2026-04-18T18:00:00.000Z',
    read: false,
    priority: 'success',
  },
  {
    id: 'demo-3',
    title: 'Prazo importante',
    body: 'As inscrições do ENEM entram na janela de atenção nesta semana.',
    createdAt: '2026-04-17T12:00:00.000Z',
    read: true,
    priority: 'danger',
  },
];

const VALID_PRIORITIES = new Set(['danger', 'warning', 'success', 'info']);
const buildNotificationId = () => `notification-${Math.random().toString(36).slice(2, 10)}`;

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
  if (import.meta.env.DEV && !isApiConfigured()) {
    return MOCK_NOTIFICATION_RESPONSE.map(normalizeNotification);
  }

  const response = await apiRequest({
    path: '/student/notifications',
  });

  return extractNotifications(response).map(normalizeNotification);
}
