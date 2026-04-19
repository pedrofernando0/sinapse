import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRequest = vi.fn()
const signOut = vi.fn()
const updateUser = vi.fn()
const onAuthStateChange = vi.fn(() => ({
  data: {
    subscription: {
      unsubscribe: vi.fn(),
    },
  },
}))

vi.mock('./api.js', () => ({
  apiRequest,
}))

vi.mock('../lib/supabase/client.js', () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange,
      signOut,
      updateUser,
    },
  }),
}))

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_DEMO_SHORTCUT', 'true')
    vi.stubEnv('VITE_DEMO_STUDENT_EMAIL', 'demo.aluno.pedro@sinapse.app')
  })

  it('keeps the typed demo shortcut password when resolving the mapped account', async () => {
    apiRequest.mockResolvedValue({
      authUser: {
        email: 'demo.aluno.pedro@sinapse.app',
        id: 'student-user-id',
      },
      profileRecord: {
        email: 'demo.aluno.pedro@sinapse.app',
        full_name: 'Pedro Demo',
        hidden_student_views: [],
        role: 'aluno',
        user_id: 'student-user-id',
      },
      session: {
        email: 'demo.aluno.pedro@sinapse.app',
        hiddenStudentViews: [],
        name: 'Pedro Demo',
        profile: 'aluno',
        userId: 'student-user-id',
      },
    })

    const { loginWithCredentials } = await import('./auth.js')

    const authState = await loginWithCredentials({
      formData: {
        identifier: 'pedro',
        password: 'pedro',
      },
      profile: 'aluno',
    })

    expect(apiRequest).toHaveBeenCalledWith({
      body: {
        email: 'demo.aluno.pedro@sinapse.app',
        password: 'pedro',
        profile: 'aluno',
      },
      method: 'POST',
      path: '/auth/login',
    })
    expect(authState.session).toMatchObject({
      email: 'demo.aluno.pedro@sinapse.app',
      profile: 'aluno',
    })
  })
})
