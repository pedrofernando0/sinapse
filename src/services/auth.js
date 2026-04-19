import { createClient } from '../lib/supabase/client.js'
import { apiRequest } from './api.js'

const supabase = createClient()

const DEMO_ALIAS = 'pedro'
const DEMO_ALIAS_PASSWORD = 'pedro'
const DEFAULT_DEMO_STUDENT_EMAIL = 'demo.aluno.pedro@sinapse.app'
const DEFAULT_DEMO_TEACHER_EMAIL = 'demo.professor.pedro@sinapse.app'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeValue = (value = '') => value.trim()
const normalizeIdentifier = (value = '') => normalizeValue(value).toLowerCase()
const normalizeRole = (value = '') => (normalizeIdentifier(value) === 'professor' ? 'professor' : 'aluno')
const normalizeHiddenStudentViews = (value) => (Array.isArray(value) ? value.filter(Boolean) : [])
const buildDisplayNameFromEmail = (email = '') => normalizeValue(email.split('@')[0] || 'Usuario Sinapse')

const createAuthError = (message, cause = null) => {
  const error = new Error(message)
  error.name = 'AuthError'
  if (cause) {
    error.cause = cause
  }
  return error
}

const getDemoStudentEmail = () => normalizeValue(import.meta.env.VITE_DEMO_STUDENT_EMAIL || DEFAULT_DEMO_STUDENT_EMAIL)
const getDemoTeacherEmail = () => normalizeValue(import.meta.env.VITE_DEMO_TEACHER_EMAIL || DEFAULT_DEMO_TEACHER_EMAIL)

const buildProfilePayload = (profileRecord = {}) => ({
  user_id: profileRecord.user_id,
  email: normalizeValue(profileRecord.email),
  full_name: normalizeValue(profileRecord.full_name),
  role: normalizeRole(profileRecord.role),
  hidden_student_views: normalizeHiddenStudentViews(profileRecord.hidden_student_views),
})

const buildSessionPayload = (session = {}) => ({
  userId: session.userId,
  email: normalizeValue(session.email),
  name: normalizeValue(session.name || buildDisplayNameFromEmail(session.email)),
  profile: normalizeRole(session.profile),
  hiddenStudentViews: normalizeHiddenStudentViews(session.hiddenStudentViews),
})

const normalizeAuthPayload = (payload = {}) => ({
  authUser: payload.authUser
    ? {
        id: payload.authUser.id,
        email: normalizeValue(payload.authUser.email),
      }
    : null,
  profileRecord: payload.profileRecord ? buildProfilePayload(payload.profileRecord) : null,
  session: payload.session ? buildSessionPayload(payload.session) : null,
})

const resolveLoginEmail = ({ profile, identifier }) => {
  const normalizedIdentifier = normalizeIdentifier(identifier)

  if (!normalizedIdentifier) {
    throw createAuthError('Informe seu e-mail para continuar.')
  }

  if (normalizedIdentifier === DEMO_ALIAS) {
    if (!isDemoShortcutEnabled()) {
      throw createAuthError('O atalho demo nao esta habilitado neste ambiente.')
    }

    return normalizeRole(profile) === 'professor'
      ? getDemoTeacherEmail()
      : getDemoStudentEmail()
  }

  if (!EMAIL_PATTERN.test(normalizedIdentifier)) {
    throw createAuthError('Informe um e-mail valido ou use o atalho demo autorizado.')
  }

  return normalizedIdentifier
}

const resolveLoginPassword = ({ identifier, password }) => {
  const normalizedIdentifier = normalizeIdentifier(identifier)
  const normalizedPassword = normalizeValue(password)

  if (!normalizedPassword) {
    throw createAuthError('Informe sua senha para continuar.')
  }

  if (normalizedIdentifier === DEMO_ALIAS && normalizedPassword === DEMO_ALIAS_PASSWORD) {
    return normalizedPassword
  }

  return normalizedPassword
}

export const isDemoShortcutEnabled = () => {
  if (import.meta.env.DEV) {
    return true
  }

  return normalizeIdentifier(import.meta.env.VITE_ENABLE_DEMO_SHORTCUT) === 'true'
}

export const getDemoShortcutHint = (role) => {
  if (!isDemoShortcutEnabled()) {
    return null
  }

  return `Atalho demo liberado: ${DEMO_ALIAS}/${DEMO_ALIAS} (${role})`
}

export const isPasswordRecoveryFlow = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.location.hash.includes('type=recovery')
}

export const clearPasswordRecoveryHash = () => {
  if (typeof window === 'undefined' || !window.location.hash) {
    return
  }

  window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`)
}

export async function getAuthSession() {
  try {
    const payload = await apiRequest({
      path: '/auth/session',
    })

    return normalizeAuthPayload(payload)
  } catch (error) {
    throw createAuthError('Nao foi possivel restaurar a sessao atual.', error)
  }
}

export async function loginWithCredentials({ formData, profile }) {
  const email = resolveLoginEmail({ profile, identifier: formData?.identifier || formData?.email || formData?.username })
  const password = resolveLoginPassword({
    identifier: formData?.identifier || formData?.email || formData?.username,
    password: formData?.password,
  })

  try {
    const payload = await apiRequest({
      body: {
        email,
        password,
        profile: normalizeRole(profile),
      },
      method: 'POST',
      path: '/auth/login',
    })

    return normalizeAuthPayload(payload)
  } catch (error) {
    throw createAuthError('Nao foi possivel entrar com essas credenciais.', error)
  }
}

export async function registerAccount({ email, fullName, password, profile }) {
  const normalizedEmail = normalizeIdentifier(email)
  const normalizedPassword = normalizeValue(password)
  const normalizedFullName = normalizeValue(fullName)
  const normalizedRole = normalizeRole(profile)

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw createAuthError('Informe um e-mail valido para criar a conta.')
  }

  if (!normalizedFullName) {
    throw createAuthError('Informe seu nome completo para criar a conta.')
  }

  if (!normalizedPassword) {
    throw createAuthError('Informe uma senha para criar a conta.')
  }

  try {
    const payload = await apiRequest({
      body: {
        email: normalizedEmail,
        fullName: normalizedFullName,
        password: normalizedPassword,
        profile: normalizedRole,
      },
      method: 'POST',
      path: '/auth/register',
    })

    if (payload?.requiresEmailConfirmation) {
      return {
        email: normalizeValue(payload.email || normalizedEmail),
        requiresEmailConfirmation: true,
        session: null,
      }
    }

    return {
      ...normalizeAuthPayload(payload),
      email: normalizedEmail,
      requiresEmailConfirmation: false,
    }
  } catch (error) {
    throw createAuthError('Nao foi possivel criar a conta agora.', error)
  }
}

export async function logoutSession() {
  try {
    await apiRequest({
      method: 'POST',
      path: '/auth/logout',
    })
  } catch (error) {
    throw createAuthError('Nao foi possivel encerrar a sessao atual.', error)
  }
}

export async function requestPasswordRecovery(email) {
  const normalizedEmail = normalizeIdentifier(email)

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw createAuthError('Informe um e-mail valido para recuperar a senha.')
  }

  try {
    await apiRequest({
      body: {
        email: normalizedEmail,
      },
      method: 'POST',
      path: '/auth/recover',
    })

    return {
      email: normalizedEmail,
    }
  } catch (error) {
    throw createAuthError('Nao foi possivel enviar o link de recuperacao.', error)
  }
}

export async function updateUserPassword(password) {
  const normalizedPassword = normalizeValue(password)

  if (!normalizedPassword) {
    throw createAuthError('Informe a nova senha para concluir a redefinicao.')
  }

  const { error } = await supabase.auth.updateUser({
    password: normalizedPassword,
  })

  if (error) {
    throw createAuthError('Nao foi possivel atualizar a senha.', error)
  }

  await supabase.auth.signOut()
  clearPasswordRecoveryHash()
}

export function subscribeToAuthChanges(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback?.({ event, session })
  })

  return () => subscription.unsubscribe()
}
