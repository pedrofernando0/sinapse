import { useAppStore } from './appStore.js';

describe('appStore shell state', () => {
  beforeEach(() => {
    useAppStore.getState().resetAppState();
  });

  it('sanitizes invalid and hidden student views and closes the sidebar on navigation', () => {
    const store = useAppStore.getState();

    store.setStudentSidebarOpen(true);
    store.initializeStudentShell({
      allowedViews: ['dashboard', 'cronograma', 'discursiva-ia'],
      initialView: 'discursiva-ia',
      session: {
        hiddenStudentViews: ['discursiva-ia'],
        name: 'Valentina',
      },
    });

    expect(useAppStore.getState().studentCurrentView).toBe('dashboard');

    store.setStudentSidebarOpen(true);
    store.navigateStudentShell('cronograma');

    expect(useAppStore.getState().studentCurrentView).toBe('cronograma');
    expect(useAppStore.getState().studentSidebarOpen).toBe(false);
  });

  it('falls back to the default teacher view when the requested one is invalid', () => {
    const store = useAppStore.getState();

    store.initializeTeacherShell({
      allowedViews: ['overview', 'students', 'planner'],
      initialView: 'unknown-view',
      session: {
        name: 'Professor Pedro',
        username: 'pedro',
      },
      students: [{ id: 's1' }, { id: 's2' }],
    });

    expect(useAppStore.getState().teacherCurrentView).toBe('overview');
    expect(useAppStore.getState().selectedTeacherStudentId).toBe('s1');
  });

  it('clears session and runtime state on reset', () => {
    const store = useAppStore.getState();

    store.setSession({
      profile: 'aluno',
      hiddenStudentViews: [],
      user: { id: 'user-1', email: 'valentina@example.com' },
    });
    store.initializeStudentShell({
      allowedViews: ['dashboard', 'cronograma'],
      initialView: 'cronograma',
      session: {
        name: 'Valentina',
        hiddenStudentViews: [],
      },
    });
    store.setTeacherSidebarOpen(true);

    store.resetAppState();

    expect(useAppStore.getState().session).toBeNull();
    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().profile).toBeNull();
    expect(useAppStore.getState().studentCurrentView).toBe('dashboard');
    expect(useAppStore.getState().teacherCurrentView).toBe('overview');
    expect(useAppStore.getState().studentSidebarOpen).toBe(false);
    expect(useAppStore.getState().teacherSidebarOpen).toBe(false);
  });
});
