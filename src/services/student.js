import { createClient } from '../lib/supabase/client.js'

const supabase = createClient()

const VALID_NOTIFICATION_PRIORITIES = new Set(['danger', 'warning', 'success', 'info'])
const VALID_REVISION_STATUSES = new Set(['pending', 'done'])

const normalizeValue = (value = '') => value.trim()

const createStudentServiceError = (message, cause = null) => {
  const error = new Error(message)
  error.name = 'StudentServiceError'
  if (cause) {
    error.cause = cause
  }
  return error
}

const determineExamLevel = ({ acertos, total }) => {
  if (!total) {
    return 'bad'
  }

  const percentage = acertos / total

  if (percentage >= 0.7) {
    return 'good'
  }

  if (percentage >= 0.5) {
    return 'average'
  }

  return 'bad'
}

const formatDuration = (durationMinutes = 0) => {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const parseDurationToMinutes = (value = '') => {
  const [hours = '0', minutes = '0'] = String(value).split(':')
  return Number(hours) * 60 + Number(minutes)
}

const mapNotificationRow = (row) => ({
  id: String(row.id),
  title: normalizeValue(row.title) || 'Notificacao',
  body: normalizeValue(row.body),
  createdAt: row.created_at,
  read: Boolean(row.read),
  priority: VALID_NOTIFICATION_PRIORITIES.has(row.priority) ? row.priority : 'info',
})

const mapRevisionRow = (row) => ({
  id: row.id,
  subject: normalizeValue(row.subject),
  topic: normalizeValue(row.topic),
  date: row.scheduled_for,
  status: VALID_REVISION_STATUSES.has(row.status) ? row.status : 'pending',
})

const mapMockExamRow = (row) => {
  const acertos = Number(row.correct_answers)
  const total = Number(row.total_questions)
  const durationMinutes = Number(row.duration_minutes || 0)

  return {
    id: row.id,
    name: normalizeValue(row.name),
    date: row.exam_date,
    acertos,
    total,
    time: formatDuration(durationMinutes),
    level: determineExamLevel({ acertos, total }),
  }
}

const requireCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    throw createStudentServiceError('Nao foi possivel validar a sessao atual.', error)
  }

  if (!user) {
    throw createStudentServiceError('Voce precisa estar autenticado para acessar esses dados.')
  }

  return user
}

export async function getStudentNotifications() {
  const { data, error } = await supabase
    .from('student_notifications')
    .select('id, title, body, priority, read, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    throw createStudentServiceError('Nao foi possivel carregar as notificacoes.', error)
  }

  return (data || []).map(mapNotificationRow)
}

export async function markStudentNotificationAsRead(notificationId) {
  const { error } = await supabase
    .from('student_notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) {
    throw createStudentServiceError('Nao foi possivel atualizar a notificacao.', error)
  }
}

export async function markAllStudentNotificationsAsRead() {
  const user = await requireCurrentUser()
  const { error } = await supabase
    .from('student_notifications')
    .update({ read: true })
    .eq('user_id', user.id)
    .eq('read', false)

  if (error) {
    throw createStudentServiceError('Nao foi possivel marcar todas as notificacoes como lidas.', error)
  }
}

export async function getStudentRevisions() {
  const { data, error } = await supabase
    .from('student_revisions')
    .select('id, subject, topic, scheduled_for, status')
    .order('scheduled_for', { ascending: true })

  if (error) {
    throw createStudentServiceError('Nao foi possivel carregar as revisoes.', error)
  }

  return (data || []).map(mapRevisionRow)
}

export async function saveStudentRevision(revision) {
  const user = await requireCurrentUser()
  const payload = {
    user_id: user.id,
    subject: normalizeValue(revision.subject),
    topic: normalizeValue(revision.topic),
    scheduled_for: revision.date,
    status: VALID_REVISION_STATUSES.has(revision.status) ? revision.status : 'pending',
  }

  const query = revision.id
    ? supabase.from('student_revisions').update(payload).eq('id', revision.id)
    : supabase.from('student_revisions').insert(payload)

  const { data, error } = await query
    .select('id, subject, topic, scheduled_for, status')
    .single()

  if (error) {
    throw createStudentServiceError('Nao foi possivel salvar a revisao.', error)
  }

  return mapRevisionRow(data)
}

export async function updateStudentRevisionStatus(revisionId, status) {
  const { data, error } = await supabase
    .from('student_revisions')
    .update({ status })
    .eq('id', revisionId)
    .select('id, subject, topic, scheduled_for, status')
    .single()

  if (error) {
    throw createStudentServiceError('Nao foi possivel atualizar o status da revisao.', error)
  }

  return mapRevisionRow(data)
}

export async function deleteStudentRevision(revisionId) {
  const { error } = await supabase
    .from('student_revisions')
    .delete()
    .eq('id', revisionId)

  if (error) {
    throw createStudentServiceError('Nao foi possivel excluir a revisao.', error)
  }
}

export async function getStudentMockExams() {
  const { data, error } = await supabase
    .from('student_mock_exams')
    .select('id, name, exam_date, correct_answers, total_questions, duration_minutes')
    .order('exam_date', { ascending: false })

  if (error) {
    throw createStudentServiceError('Nao foi possivel carregar os simulados.', error)
  }

  return (data || []).map(mapMockExamRow)
}

export async function saveStudentMockExam(exam) {
  const user = await requireCurrentUser()
  const payload = {
    user_id: user.id,
    name: normalizeValue(exam.name),
    exam_date: exam.date,
    correct_answers: Number(exam.acertos),
    total_questions: Number(exam.total),
    duration_minutes: parseDurationToMinutes(exam.time),
  }

  const query = exam.id
    ? supabase.from('student_mock_exams').update(payload).eq('id', exam.id)
    : supabase.from('student_mock_exams').insert(payload)

  const { data, error } = await query
    .select('id, name, exam_date, correct_answers, total_questions, duration_minutes')
    .single()

  if (error) {
    throw createStudentServiceError('Nao foi possivel salvar o simulado.', error)
  }

  return mapMockExamRow(data)
}

export async function deleteStudentMockExam(examId) {
  const { error } = await supabase
    .from('student_mock_exams')
    .delete()
    .eq('id', examId)

  if (error) {
    throw createStudentServiceError('Nao foi possivel excluir o simulado.', error)
  }
}
