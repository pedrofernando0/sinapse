import {
  clearApiCache,
  getApiBaseUrl,
} from './api.js';
import {
  createStudentMockExam,
  createStudentRevision,
  deleteStudentMockExam,
  deleteStudentRevision,
  getStudentMockExams,
  getStudentRevisions,
  updateStudentMockExam,
  updateStudentRevision,
} from './student.js';

describe('student services', () => {
  beforeEach(() => {
    clearApiCache();
    vi.restoreAllMocks();
    global.fetch = vi.fn();
  });

  it('uses /api as the default base URL', () => {
    expect(getApiBaseUrl()).toBe('/api');
  });

  it('caches GET requests with TTL and invalidates after mutations', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'exam-1', name: 'ENEM', totalQuestions: 90, correctAnswers: 72 }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'exam-2', name: 'FUVEST', totalQuestions: 90, correctAnswers: 80 }), {
          headers: { 'content-type': 'application/json' },
          status: 201,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'exam-2', name: 'FUVEST', totalQuestions: 90, correctAnswers: 80 }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      );

    const firstRead = await getStudentMockExams();
    const secondRead = await getStudentMockExams();

    expect(firstRead).toHaveLength(1);
    expect(secondRead).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await createStudentMockExam({
      date: '2026-04-18',
      name: 'FUVEST',
      time: '04:00',
      total: 90,
      acertos: 80,
    });
    await getStudentMockExams();

    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('invalidates revisions cache after create, update and delete', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'revision-1', subject: 'Matemática', topic: 'Geometria', status: 'pending', scheduledFor: '2026-04-18' }]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'revision-2', subject: 'Biologia', topic: 'Ecologia', status: 'pending', scheduledFor: '2026-04-19' }), {
          headers: { 'content-type': 'application/json' },
          status: 201,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'revision-2', subject: 'Biologia', topic: 'Ecologia', status: 'done', scheduledFor: '2026-04-19' }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(null, { status: 204 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      );

    await getStudentRevisions();
    await createStudentRevision({
      date: '2026-04-19',
      subject: 'Biologia',
      topic: 'Ecologia',
    });
    await updateStudentRevision('revision-2', { status: 'done' });
    await deleteStudentRevision('revision-2');
    await getStudentRevisions();

    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  it('invalidates mock exam cache after update and delete', async () => {
    global.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'exam-1', name: 'ENEM', totalQuestions: 90, correctAnswers: 72 }), {
          headers: { 'content-type': 'application/json' },
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    await updateStudentMockExam('exam-1', {
      total: 90,
      acertos: 75,
    });
    await deleteStudentMockExam('exam-1');

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
