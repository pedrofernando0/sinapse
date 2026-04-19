import { beforeEach, describe, expect, it, vi } from 'vitest'

const signInWithPassword = vi.fn()
const getSession = vi.fn()
const signOut = vi.fn()
const maybeSingle = vi.fn()
const eq = vi.fn(() => ({ maybeSingle }))
const select = vi.fn(() => ({ eq }))
const from = vi.fn(() => ({ select }))

vi.mock('../lib/supabase/client.js', () => ({
  createClient: () => ({
    auth: {
      getSession,
      signInWithPassword,
      signOut,
    },
    from,
  }),
}))

describe('auth service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('VITE_ENABLE_DEMO_SHORTCUT', 'true')
    vi.stubEnv('VITE_DEMO_STUDENT_EMAIL', 'demo.aluno.pedro@sinapse.app')
  })

  it('keeps the typed demo shortcut password when resolving the mapped account', async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'student-user-id',
            email: 'demo.aluno.pedro@sinapse.app',
            user_metadata: { full_name: 'Pedro Demo' },
          },
        },
      },
      error: null,
    })
    maybeSingle.mockResolvedValue({
      data: {
        user_id: 'student-user-id',
        email: 'demo.aluno.pedro@sinapse.app',
        full_name: 'Pedro Demo',
        role: 'aluno',
        hidden_student_views: [],
      },
      error: null,
    })

    const { loginWithCredentials } = await import('./auth.js')

    const authState = await loginWithCredentials({
      formData: {
        identifier: 'pedro',
        password: 'pedro',
      },
      profile: 'aluno',
    })

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'demo.aluno.pedro@sinapse.app',
      password: 'pedro',
    })
    expect(signOut).not.toHaveBeenCalled()
    expect(authState.session).toMatchObject({
      email: 'demo.aluno.pedro@sinapse.app',
      profile: 'aluno',
    })
  })
})
