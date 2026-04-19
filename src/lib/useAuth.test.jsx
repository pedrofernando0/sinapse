import { act, renderHook, waitFor } from '@testing-library/react';
import { useAppStore } from '../store/appStore.js';
import {
  getAuthSession,
  loginWithCredentials,
  logoutSession,
  registerAccount,
  requestPasswordRecovery,
  updateUserProfile,
} from '../services/auth.js';
import { useAuth } from './useAuth.js';

vi.mock('../services/auth.js', () => ({
  getAuthSession: vi.fn(),
  loginWithCredentials: vi.fn(),
  logoutSession: vi.fn(),
  registerAccount: vi.fn(),
  requestPasswordRecovery: vi.fn(),
  updateUserProfile: vi.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.getState().resetAppState();
  });

  it('hydrates the session from the server', async () => {
    getAuthSession.mockResolvedValue({
      session: {
        profile: 'aluno',
        hiddenStudentViews: [],
        user: { id: 'user-1', email: 'valentina@example.com' },
      },
      user: {
        id: 'user-1',
        email: 'valentina@example.com',
        fullName: 'Valentina',
        profile: 'aluno',
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.session?.profile).toBe('aluno');
    expect(result.current.user?.fullName).toBe('Valentina');
  });

  it('logs in and then logs out while resetting runtime state', async () => {
    loginWithCredentials.mockResolvedValue({
      session: {
        profile: 'professor',
        hiddenStudentViews: [],
        user: { id: 'teacher-1', email: 'prof@example.com' },
      },
      user: {
        id: 'teacher-1',
        email: 'prof@example.com',
        fullName: 'Professor Pedro',
        profile: 'professor',
      },
    });
    logoutSession.mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useAuth());

    useAppStore.getState().initializeTeacherShell({
      allowedViews: ['overview', 'students'],
      initialView: 'students',
      session: { name: 'Professor Pedro', username: 'prof' },
      students: [{ id: 'student-1' }],
    });

    await act(async () => {
      await result.current.login({
        formData: { password: 'secret', username: 'prof@example.com' },
        profile: 'professor',
      });
    });

    expect(result.current.status).toBe('authenticated');
    expect(result.current.session?.profile).toBe('professor');

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.status).toBe('unauthenticated');
    expect(useAppStore.getState().teacherCurrentView).toBe('overview');
    expect(useAppStore.getState().session).toBeNull();
  });

  it('delegates register, recover and update profile through the auth service', async () => {
    registerAccount.mockResolvedValue({ ok: true, requiresEmailConfirmation: true });
    requestPasswordRecovery.mockResolvedValue({ ok: true });
    updateUserProfile.mockResolvedValue({
      session: {
        profile: 'aluno',
        hiddenStudentViews: [],
        user: { id: 'user-1', email: 'valentina@example.com' },
      },
      user: {
        id: 'user-1',
        email: 'valentina@example.com',
        fullName: 'Valentina Souza',
        profile: 'aluno',
      },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({
        email: 'valentina@example.com',
        fullName: 'Valentina',
        password: 'SenhaSegura123!',
        profile: 'aluno',
      });
    });

    await act(async () => {
      await result.current.recoverPassword('valentina@example.com');
    });

    await act(async () => {
      await result.current.updateProfile({ fullName: 'Valentina Souza' });
    });

    await waitFor(() => {
      expect(result.current.user?.fullName).toBe('Valentina Souza');
    });

    expect(registerAccount).toHaveBeenCalledTimes(1);
    expect(requestPasswordRecovery).toHaveBeenCalledWith('valentina@example.com');
    expect(updateUserProfile).toHaveBeenCalledWith({ fullName: 'Valentina Souza' });
  });
});
