import { errorResponse, jsonResponse, noContentResponse, parseJsonBody } from './http.js';
import { createSupabaseServerClient } from './supabase.js';

const formatTime = (durationMinutes) => {
  const hours = Math.floor((durationMinutes ?? 0) / 60);
  const minutes = (durationMinutes ?? 0) % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const parseTime = (value = '') => {
  const [hours = '0', minutes = '0'] = String(value).split(':');
  return Number(hours) * 60 + Number(minutes);
};

const normalizeExamPayload = (payload) => {
  const totalQuestions = Number(payload.total);
  const correctAnswers = Number(payload.acertos);

  return {
    correct_answers: correctAnswers,
    duration_minutes: parseTime(payload.time),
    exam_date: String(payload.date ?? ''),
    name: String(payload.name ?? '').trim(),
    total_questions: totalQuestions,
  };
};

const normalizeRevisionPayload = (payload) => ({
  scheduled_for: String(payload.date ?? ''),
  status: payload.status === 'done' ? 'done' : 'pending',
  subject: String(payload.subject ?? '').trim(),
  topic: String(payload.topic ?? '').trim(),
});

const mapExamRow = (row) => ({
  acertos: String(row.correct_answers),
  date: row.exam_date,
  id: row.id,
  name: row.name,
  time: formatTime(row.duration_minutes),
  total: String(row.total_questions),
});

const mapRevisionRow = (row) => ({
  date: row.scheduled_for,
  id: row.id,
  status: row.status,
  subject: row.subject,
  topic: row.topic,
});

async function getAuthorizedContext(request) {
  const context = createSupabaseServerClient(request);

  if (!context.configured || !context.supabase) {
    return {
      context,
      response: errorResponse('Supabase não está configurado no servidor.', {
        code: 'CONFIG_ERROR',
        status: 500,
      }),
      user: null,
    };
  }

  const {
    data: { user },
  } = await context.supabase.auth.getUser();

  if (!user) {
    return {
      context,
      response: errorResponse('Sua sessão expirou. Entre novamente.', {
        code: 'UNAUTHORIZED',
        status: 401,
      }),
      user: null,
    };
  }

  return {
    context,
    response: null,
    user,
  };
}

export async function handleGetNotifications(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { data, error } = await context.supabase
    .from('student_notifications')
    .select('id, title, body, created_at, priority, read')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return errorResponse(error.message || 'Não foi possível carregar notificações.', {
      code: 'NOTIFICATIONS_ERROR',
      status: 500,
    });
  }

  return jsonResponse(
    data.map((item) => ({
      body: item.body,
      createdAt: item.created_at,
      id: item.id,
      priority: item.priority,
      read: item.read,
      title: item.title,
    })),
    { headers: context.responseHeaders },
  );
}

export async function handleMarkNotificationAsRead(request, notificationId) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { error } = await context.supabase
    .from('student_notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse(error.message || 'Não foi possível atualizar a notificação.', {
      code: 'NOTIFICATION_UPDATE_ERROR',
      status: 400,
    });
  }

  return noContentResponse(context.responseHeaders);
}

export async function handleMarkAllNotificationsAsRead(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { error } = await context.supabase
    .from('student_notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false);

  if (error) {
    return errorResponse(error.message || 'Não foi possível atualizar as notificações.', {
      code: 'NOTIFICATIONS_BULK_UPDATE_ERROR',
      status: 400,
    });
  }

  return noContentResponse(context.responseHeaders);
}

export async function handleGetMockExams(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { data, error } = await context.supabase
    .from('student_mock_exams')
    .select('id, name, exam_date, correct_answers, total_questions, duration_minutes')
    .eq('user_id', user.id)
    .order('exam_date', { ascending: false });

  if (error) {
    return errorResponse(error.message || 'Não foi possível carregar simulados.', {
      code: 'MOCK_EXAMS_ERROR',
      status: 500,
    });
  }

  return jsonResponse(data.map(mapExamRow), { headers: context.responseHeaders });
}

export async function handleCreateMockExam(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const payload = normalizeExamPayload(await parseJsonBody(request));

  if (!payload.name || !payload.exam_date) {
    return errorResponse('Informe nome e data do simulado.', {
      code: 'INVALID_EXAM',
      status: 400,
    });
  }

  if (!Number.isFinite(payload.total_questions) || !Number.isFinite(payload.correct_answers)) {
    return errorResponse('Total de questões e acertos precisam ser números válidos.', {
      code: 'INVALID_EXAM_NUMBERS',
      status: 400,
    });
  }

  if (payload.correct_answers > payload.total_questions) {
    return errorResponse('O número de acertos não pode ser maior que o total.', {
      code: 'INVALID_EXAM_SCORE',
      status: 400,
    });
  }

  const { data, error } = await context.supabase
    .from('student_mock_exams')
    .insert({
      ...payload,
      user_id: user.id,
    })
    .select('id, name, exam_date, correct_answers, total_questions, duration_minutes')
    .single();

  if (error) {
    return errorResponse(error.message || 'Não foi possível salvar o simulado.', {
      code: 'MOCK_EXAM_CREATE_ERROR',
      status: 400,
    });
  }

  return jsonResponse(mapExamRow(data), { headers: context.responseHeaders, status: 201 });
}

export async function handleUpdateMockExam(request, examId) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const payload = normalizeExamPayload(await parseJsonBody(request));

  const { data, error } = await context.supabase
    .from('student_mock_exams')
    .update(payload)
    .eq('id', examId)
    .eq('user_id', user.id)
    .select('id, name, exam_date, correct_answers, total_questions, duration_minutes')
    .single();

  if (error) {
    return errorResponse(error.message || 'Não foi possível atualizar o simulado.', {
      code: 'MOCK_EXAM_UPDATE_ERROR',
      status: 400,
    });
  }

  return jsonResponse(mapExamRow(data), { headers: context.responseHeaders });
}

export async function handleDeleteMockExam(request, examId) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { error } = await context.supabase
    .from('student_mock_exams')
    .delete()
    .eq('id', examId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse(error.message || 'Não foi possível excluir o simulado.', {
      code: 'MOCK_EXAM_DELETE_ERROR',
      status: 400,
    });
  }

  return noContentResponse(context.responseHeaders);
}

export async function handleGetRevisions(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { data, error } = await context.supabase
    .from('student_revisions')
    .select('id, subject, topic, scheduled_for, status')
    .eq('user_id', user.id)
    .order('scheduled_for', { ascending: true });

  if (error) {
    return errorResponse(error.message || 'Não foi possível carregar revisões.', {
      code: 'REVISIONS_ERROR',
      status: 500,
    });
  }

  return jsonResponse(data.map(mapRevisionRow), { headers: context.responseHeaders });
}

export async function handleCreateRevision(request) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const payload = normalizeRevisionPayload(await parseJsonBody(request));

  if (!payload.subject || !payload.topic || !payload.scheduled_for) {
    return errorResponse('Informe disciplina, tópico e data da revisão.', {
      code: 'INVALID_REVISION',
      status: 400,
    });
  }

  const { data, error } = await context.supabase
    .from('student_revisions')
    .insert({
      ...payload,
      user_id: user.id,
    })
    .select('id, subject, topic, scheduled_for, status')
    .single();

  if (error) {
    return errorResponse(error.message || 'Não foi possível salvar a revisão.', {
      code: 'REVISION_CREATE_ERROR',
      status: 400,
    });
  }

  return jsonResponse(mapRevisionRow(data), { headers: context.responseHeaders, status: 201 });
}

export async function handleUpdateRevision(request, revisionId) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const payload = normalizeRevisionPayload(await parseJsonBody(request));

  const { data, error } = await context.supabase
    .from('student_revisions')
    .update(payload)
    .eq('id', revisionId)
    .eq('user_id', user.id)
    .select('id, subject, topic, scheduled_for, status')
    .single();

  if (error) {
    return errorResponse(error.message || 'Não foi possível atualizar a revisão.', {
      code: 'REVISION_UPDATE_ERROR',
      status: 400,
    });
  }

  return jsonResponse(mapRevisionRow(data), { headers: context.responseHeaders });
}

export async function handleDeleteRevision(request, revisionId) {
  const { context, response, user } = await getAuthorizedContext(request);

  if (response) {
    return response;
  }

  const { error } = await context.supabase
    .from('student_revisions')
    .delete()
    .eq('id', revisionId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse(error.message || 'Não foi possível excluir a revisão.', {
      code: 'REVISION_DELETE_ERROR',
      status: 400,
    });
  }

  return noContentResponse(context.responseHeaders);
}
