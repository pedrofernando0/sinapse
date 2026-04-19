import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearApiCache,
  getApiBaseUrl,
} from './api.js'
import {
  getStudentMockExams,
  getStudentNotifications,
  getStudentRevisions,
  markStudentNotificationAsRead,
  saveStudentMockExam,
  saveStudentRevision,
  updateStudentRevisionStatus,
  deleteStudentMockExam,
  deleteStudentRevision,
} from './student.js'

describe('student services', () => {
  beforeEach(() => {
    clearApiCache()
    vi.restoreAllMocks()
    global.fetch = vi.fn()
  })

  it('uses /api as the default base URL', () => {
    expect(getApiBaseUrl()).toBe('/api')
  })

  it('caches mock exams and invalidates after save/delete', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'exam-1', name: 'ENEM', total: 90, acertos: 72, time: '04:00', date: '2026-04-18' }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'exam-2', name: 'FUVEST', total: 90, acertos: 80, time: '04:00', date: '2026-04-19' }), {
          headers: { 'content-type': 'application/json' },
          status: 201,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )

    await getStudentMockExams()
    await getStudentMockExams()
    expect(global.fetch).toHaveBeenCalledTimes(1)

    await saveStudentMockExam({
      acertos: 80,
      date: '2026-04-19',
      name: 'FUVEST',
      time: '04:00',
      total: 90,
    })
    await deleteStudentMockExam('exam-2')
    await getStudentMockExams()

    expect(global.fetch).toHaveBeenCalledTimes(4)
  })

  it('caches revisions and invalidates after save/status update/delete', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'revision-1', subject: 'Matematica', topic: 'Geometria', status: 'pending', date: '2026-04-18' }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'revision-2', subject: 'Biologia', topic: 'Ecologia', status: 'pending', date: '2026-04-19' }), {
          headers: { 'content-type': 'application/json' },
          status: 201,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'revision-2', subject: 'Biologia', topic: 'Ecologia', status: 'done', date: '2026-04-19' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )

    await getStudentRevisions()
    await saveStudentRevision({
      date: '2026-04-19',
      subject: 'Biologia',
      topic: 'Ecologia',
    })
    await updateStudentRevisionStatus('revision-2', 'done')
    await deleteStudentRevision('revision-2')
    await getStudentRevisions()

    expect(global.fetch).toHaveBeenCalledTimes(5)
  })

  it('invalidates notifications cache after marking as read', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'notification-1', title: 'Novo alerta', body: 'Revise funcoes', priority: 'warning', read: false, createdAt: '2026-04-19T00:00:00.000Z' }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'notification-1', title: 'Novo alerta', body: 'Revise funcoes', priority: 'warning', read: true, createdAt: '2026-04-19T00:00:00.000Z' }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )

    await getStudentNotifications()
    await getStudentNotifications()
    expect(global.fetch).toHaveBeenCalledTimes(1)

    await markStudentNotificationAsRead('notification-1')
    await getStudentNotifications()

    expect(global.fetch).toHaveBeenCalledTimes(3)
  })
})
