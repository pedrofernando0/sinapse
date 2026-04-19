import { createClient } from '../lib/supabase/client.js'

const supabase = createClient()

const DEMO_ALIAS = 'pedro'
const DEMO_ALIAS_PASSWORD = 'pedro'
const DEFAULT_DEMO_STUDENT_EMAIL = 'demo.aluno.pedro@sinapse.app'
const DEFAULT_DEMO_TEACHER_EMAIL = 'demo.professor.pedro@sinapse.app'
const CANONICAL_PRODUCTION_URL = 'https://sinapse-dusky.vercel.app'
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

const getAppOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return CANONICAL_PRODUCTION_URL
}

const buildRedirectUrl = (path = '/login') => new URL(path, getAppOrigin()).toString()

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

const buildProfilePayload = (profileRecord = {}) => ({
  user_id: profileRecord.user_id,
  email: normalizeValue(profileRecord.email),
  full_name: normalizeValue(profileRecord.full_name),
  role: normalizeRole(profileRecord.role),
  hidden_student_views: normalizeHiddenStudentViews(profileRecord.hidden_student_views),
})

const buildSessionPayload = ({ user, profileRecord }) => ({
  userId: user.id,
  email: normalizeValue(profileRecord?.email || user.email || ''),
  name: normalizeValue(profileRecord?.full_name || user.user_metadata?.full_name || buildDisplayNameFromEmail(user.email)),
  profile: normalizeRole(profileRecord?.role),
  hiddenStudentViews: normalizeHiddenStudentViews(profileRecord?.hidden_student_views),
})

const ensureOwnProfile = async (user) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('user_id, email, full_name, role, hidden_student_views')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    throw createAuthError('Nao foi possivel carregar o perfil da conta.', error)
  }

  if (data) {
    return buildProfilePayload(data)
  }

  throw createAuthError('O perfil da conta nao foi inicializado corretamente.')
}

const resolveCurrentAuthState = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw createAuthError('Nao foi possivel restaurar a sessao atual.', error)
  }

  const authSession = data?.session
  const authUser = authSession?.user

  if (!authUser) {
    return {
      authUser: null,
      profileRecord: null,
      session: null,
    }
  }

  const profileRecord = await ensureOwnProfile(authUser)

  return {
    authUser,
    profileRecord,
    session: buildSessionPayload({ user: authUser, profileRecord }),
  }
}

export async function getAuthSession() {
  return resolveCurrentAuthState()
}

export async function loginWithCredentials({ formData, profile }) {
  const email = resolveLoginEmail({ profile, identifier: formData?.identifier || formData?.email || formData?.username })
  const password = resolveLoginPassword({
    identifier: formData?.identifier || formData?.email || formData?.username,
    password: formData?.password,
  })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw createAuthError('Nao foi possivel entrar com essas credenciais.', error)
  }

  const authState = await resolveCurrentAuthState()

  if (!authState.session || authState.session.profile !== normalizeRole(profile)) {
    await supabase.auth.signOut()
    throw createAuthError('Esta conta nao pertence ao perfil selecionado.')
  }

  return authState
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

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password: normalizedPassword,
    options: {
      data: {
        full_name: normalizedFullName,
        role: normalizedRole,
      },
      emailRedirectTo: buildRedirectUrl('/login'),
    },
  })

  if (error) {
    throw createAuthError('Nao foi possivel criar a conta agora.', error)
  }

  if (!data.session || !data.user) {
    return {
      email: normalizedEmail,
      requiresEmailConfirmation: true,
      session: null,
    }
  }

  const authState = await resolveCurrentAuthState()

  return {
    ...authState,
    email: normalizedEmail,
    requiresEmailConfirmation: false,
  }
}

export async function logoutSession() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw createAuthError('Nao foi possivel encerrar a sessao atual.', error)
  }
}

export async function requestPasswordRecovery(email) {
  const normalizedEmail = normalizeIdentifier(email)

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw createAuthError('Informe um e-mail valido para recuperar a senha.')
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: buildRedirectUrl('/login'),
  })

  if (error) {
    throw createAuthError('Nao foi possivel enviar o link de recuperacao.', error)
  }

  return {
    email: normalizedEmail,
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
