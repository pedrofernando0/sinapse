import { useCallback, useEffect, useRef } from 'react'
import { useAppStore } from '../store/index.js'
import {
  getAuthSession,
  loginWithCredentials,
  logoutSession,
  registerAccount,
  requestPasswordRecovery,
  subscribeToAuthChanges,
  updateUserPassword,
} from '../services/auth.js'

const clearAuthState = () => ({
  authUser: null,
  profileRecord: null,
  session: null,
  status: 'unauthenticated',
})

export function useAuth() {
  const authStatus = useAppStore((state) => state.authStatus)
  const session = useAppStore((state) => state.session)
  const profileRecord = useAppStore((state) => state.profileRecord)
  const authUser = useAppStore((state) => state.authUser)
  const clearSession = useAppStore((state) => state.clearSession)
  const setAuthState = useAppStore((state) => state.setAuthState)
  const setAuthStatus = useAppStore((state) => state.setAuthStatus)

  const refreshSession = useCallback(async () => {
    setAuthStatus('loading')

    try {
      const payload = await getAuthSession()
      setAuthState({
        ...payload,
        status: payload.session ? 'authenticated' : 'unauthenticated',
      })
      return payload
    } catch (error) {
      setAuthState(clearAuthState())
      throw error
    }
  }, [setAuthState, setAuthStatus])

  const login = useCallback(
    async ({ formData, profile }) => {
      setAuthStatus('loading')

      try {
        const payload = await loginWithCredentials({ formData, profile })
        setAuthState({
          ...payload,
          status: 'authenticated',
        })
        return payload
      } catch (error) {
        setAuthState(clearAuthState())
        throw error
      }
    },
    [setAuthState, setAuthStatus]
  )

  const logout = useCallback(async () => {
    try {
      await logoutSession()
    } finally {
      clearSession()
    }
  }, [clearSession])

  const register = useCallback(async (payload) => {
    const response = await registerAccount(payload)

    if (response.session) {
      setAuthState({
        authUser: response.authUser,
        profileRecord: response.profileRecord,
        session: response.session,
        status: 'authenticated',
      })
    }

    return response
  }, [setAuthState])

  const recoverPassword = useCallback(async (email) => {
    return requestPasswordRecovery(email)
  }, [])

  const resetPassword = useCallback(async (password) => {
    await updateUserPassword(password)
    clearSession()
  }, [clearSession])

  return {
    authStatus,
    authUser,
    login,
    logout,
    profileRecord,
    recoverPassword,
    refreshSession,
    register,
    resetPassword,
    session,
  }
}

export function AuthBootstrap() {
  const hasBootstrappedRef = useRef(false)
  const clearSession = useAppStore((state) => state.clearSession)
  const { refreshSession } = useAuth()

  useEffect(() => {
    if (hasBootstrappedRef.current) {
      return undefined
    }

    hasBootstrappedRef.current = true
    refreshSession().catch(() => {})

    return subscribeToAuthChanges(({ event }) => {
      if (event === 'SIGNED_OUT') {
        clearSession()
        return
      }

      refreshSession().catch(() => {})
    })
  }, [clearSession, refreshSession])

  return null
}
