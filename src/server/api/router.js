import {
  handleGetSession,
  handleLogin,
  handleLogout,
  handleRecover,
  handleRegister,
} from './authHandlers.js';
import { errorResponse } from './http.js';
import {
  handleCreateMockExam,
  handleCreateRevision,
  handleDeleteMockExam,
  handleDeleteRevision,
  handleGetMockExams,
  handleGetNotifications,
  handleGetRevisions,
  handleMarkAllNotificationsAsRead,
  handleMarkNotificationAsRead,
  handleUpdateMockExam,
  handleUpdateRevision,
} from './studentHandlers.js';

const getPathSegments = (request) =>
  new URL(request.url)
    .pathname
    .replace(/^\/api\/?/, '')
    .split('/')
    .filter(Boolean);

export async function handleApiRequest(request) {
  const pathSegments = getPathSegments(request);
  const [scope, resource, resourceId] = pathSegments;
  const method = request.method.toUpperCase();

  if (scope === 'auth') {
    if (resource === 'session' && method === 'GET') {
      return handleGetSession(request);
    }

    if (resource === 'login' && method === 'POST') {
      return handleLogin(request);
    }

    if (resource === 'logout' && method === 'POST') {
      return handleLogout(request);
    }

    if (resource === 'register' && method === 'POST') {
      return handleRegister(request);
    }

    if (resource === 'recover' && method === 'POST') {
      return handleRecover(request);
    }
  }

  if (scope === 'student') {
    if (resource === 'notifications' && method === 'GET') {
      return handleGetNotifications(request);
    }

    if (resource === 'notifications' && resourceId === 'read-all' && method === 'POST') {
      return handleMarkAllNotificationsAsRead(request);
    }

    if (resource === 'notifications' && resourceId && method === 'PATCH') {
      return handleMarkNotificationAsRead(request, resourceId);
    }

    if (resource === 'mock-exams' && method === 'GET') {
      return handleGetMockExams(request);
    }

    if (resource === 'mock-exams' && method === 'POST') {
      return handleCreateMockExam(request);
    }

    if (resource === 'mock-exams' && resourceId && method === 'PATCH') {
      return handleUpdateMockExam(request, resourceId);
    }

    if (resource === 'mock-exams' && resourceId && method === 'DELETE') {
      return handleDeleteMockExam(request, resourceId);
    }

    if (resource === 'revisions' && method === 'GET') {
      return handleGetRevisions(request);
    }

    if (resource === 'revisions' && method === 'POST') {
      return handleCreateRevision(request);
    }

    if (resource === 'revisions' && resourceId && method === 'PATCH') {
      return handleUpdateRevision(request, resourceId);
    }

    if (resource === 'revisions' && resourceId && method === 'DELETE') {
      return handleDeleteRevision(request, resourceId);
    }
  }

  return errorResponse('Endpoint não encontrado.', {
    code: 'NOT_FOUND',
    status: 404,
  });
}
