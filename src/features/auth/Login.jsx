import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
} from 'lucide-react'
import { getDemoShortcutHint, isDemoShortcutEnabled } from '../../services/auth.js'

const BRAND_COPY = {
  aluno: {
    accent: 'from-cyan-400 to-blue-500',
    badge: 'Jornada do aluno',
    features: [
      { icon: BookOpen, title: 'Revisoes vivas', description: 'Persistencia real para manter o seu ritmo em qualquer sessao.' },
      { icon: Sparkles, title: 'Tutoria conectada', description: 'Notificacoes, simulados e progresso entram no mesmo fluxo.' },
      { icon: ShieldCheck, title: 'Conta propria', description: 'Cadastro, login e redefinicao de senha com Supabase Auth.' },
    ],
    headline: 'Seu ambiente de estudo agora abre com auth real e dados persistidos.',
  },
  professor: {
    accent: 'from-indigo-300 to-blue-500',
    badge: 'Portal docente',
    features: [
      { icon: GraduationCap, title: 'Acesso por perfil', description: 'A entrada respeita o tipo de conta e abre o shell correto.' },
      { icon: BrainCircuit, title: 'Demo controlado', description: 'O atalho pedro/pedro existe so em local e preview.' },
      { icon: ShieldCheck, title: 'Conta propria', description: 'Criacao de conta, login e recuperacao centralizados no Supabase.' },
    ],
    headline: 'O portal docente passa a usar a mesma base autenticada e rastreavel.',
  },
}

const INITIAL_LOGIN_FORM = {
  identifier: '',
  password: '',
}

const INITIAL_REGISTER_FORM = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const INITIAL_RECOVERY_FORM = {
  email: '',
}

const INITIAL_RESET_FORM = {
  password: '',
  confirmPassword: '',
}

const AUTH_MODES = {
  login: 'login',
  register: 'register',
  recovery: 'recovery',
  reset: 'reset',
  confirmEmail: 'confirm-email',
  recoverySent: 'recovery-sent',
  resetDone: 'reset-done',
}

const PANEL_BASE_CLASS = 'rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.75)] backdrop-blur-2xl'

const normalizeErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage
  }

  const message = error.message?.trim()
  return message || fallbackMessage
}

const ModeButton = ({ active, children, ...props }) => (
  <button
    type="button"
    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-white text-slate-900 shadow-sm'
        : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`}
    {...props}
  >
    {children}
  </button>
)

const AuthInput = ({ label, hint, ...props }) => (
  <label className="space-y-2">
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">{label}</span>
      {hint ? <span className="text-[11px] text-white/35">{hint}</span> : null}
    </div>
    <input
      className="w-full rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/25 focus:bg-slate-950/70"
      {...props}
    />
  </label>
)

const ResultCard = ({ icon: Icon, title, description, ctaLabel, onCta }) => (
  <div className="space-y-6">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
      <Icon size={24} />
    </div>
    <div className="space-y-3">
      <h2 className="text-3xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="max-w-md text-sm leading-relaxed text-white/65">{description}</p>
    </div>
    <button
      type="button"
      onClick={onCta}
      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
    >
      {ctaLabel}
    </button>
  </div>
)

export default function Login({
  authStatus = 'unauthenticated',
  forceResetPassword = false,
  onLogin,
  onRecoverPassword,
  onRegister,
  onResetPassword,
}) {
  const [profile, setProfile] = useState(null)
  const [mode, setMode] = useState(forceResetPassword ? AUTH_MODES.reset : AUTH_MODES.login)
  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN_FORM)
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM)
  const [recoveryForm, setRecoveryForm] = useState(INITIAL_RECOVERY_FORM)
  const [resetForm, setResetForm] = useState(INITIAL_RESET_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const [contextValue, setContextValue] = useState('')

  const isSubmitting = authStatus === 'loading'
  const demoEnabled = isDemoShortcutEnabled()
  const selectedProfile = profile || 'aluno'
  const brand = BRAND_COPY[selectedProfile]

  useEffect(() => {
    if (forceResetPassword) {
      setMode(AUTH_MODES.reset)
      setErrorMessage('')
    }
  }, [forceResetPassword])

  const clearMessages = () => {
    setErrorMessage('')
    setContextValue('')
  }

  const selectProfile = (nextProfile) => {
    setProfile(nextProfile)
    setMode(AUTH_MODES.login)
    clearMessages()
  }

  const handleBack = () => {
    if (forceResetPassword) {
      setMode(AUTH_MODES.login)
      return
    }

    setProfile(null)
    setMode(AUTH_MODES.login)
    clearMessages()
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    clearMessages()
  }

  const handleLoginChange = ({ target: { name, value } }) => {
    setLoginForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleRegisterChange = ({ target: { name, value } }) => {
    setRegisterForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleRecoveryChange = ({ target: { name, value } }) => {
    setRecoveryForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const handleResetChange = ({ target: { name, value } }) => {
    setResetForm((current) => ({ ...current, [name]: value }))
    if (errorMessage) {
      setErrorMessage('')
    }
  }

  const submitLogin = async (event) => {
    event.preventDefault()

    if (!profile) {
      setErrorMessage('Selecione se voce quer entrar como aluno ou professor.')
      return
    }

    try {
      clearMessages()
      await onLogin?.({ formData: loginForm, profile })
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error, 'Nao foi possivel entrar agora.'))
    }
  }

  const submitRegister = async (event) => {
    event.preventDefault()

    if (!profile) {
      setErrorMessage('Selecione se voce quer criar a conta de aluno ou professor.')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('As senhas precisam ser iguais para concluir o cadastro.')
      return
    }

    try {
      clearMessages()
      const response = await onRegister?.({
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        profile,
      })

      if (response?.requiresEmailConfirmation) {
        setContextValue(response.email || registerForm.email)
        setMode(AUTH_MODES.confirmEmail)
        return
      }
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error, 'Nao foi possivel criar a conta agora.'))
    }
  }

  const submitRecovery = async (event) => {
    event.preventDefault()

    try {
      clearMessages()
      const response = await onRecoverPassword?.(recoveryForm.email)
      setContextValue(response?.email || recoveryForm.email)
      setMode(AUTH_MODES.recoverySent)
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error, 'Nao foi possivel enviar o link de recuperacao.'))
    }
  }

  const submitReset = async (event) => {
    event.preventDefault()

    if (resetForm.password !== resetForm.confirmPassword) {
      setErrorMessage('As senhas precisam ser iguais para concluir a redefinicao.')
      return
    }

    try {
      clearMessages()
      await onResetPassword?.(resetForm.password)
      setMode(AUTH_MODES.resetDone)
    } catch (error) {
      setErrorMessage(normalizeErrorMessage(error, 'Nao foi possivel atualizar a senha.'))
    }
  }

  const resetToLogin = () => {
    setMode(AUTH_MODES.login)
    setResetForm(INITIAL_RESET_FORM)
    setRecoveryForm(INITIAL_RECOVERY_FORM)
    setRegisterForm(INITIAL_REGISTER_FORM)
    clearMessages()
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className={`${PANEL_BASE_CLASS} relative overflow-hidden px-8 py-10 sm:px-10 lg:px-12`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_36%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />

          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
                  <BrainCircuit className="text-cyan-300" size={26} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">Sinapse</p>
                  <h1 className="text-2xl font-semibold tracking-tight">Auth + Persistencia</h1>
                </div>
              </div>

              <div className="space-y-5">
                <span className={`inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-r ${brand.accent}`}>
                  {brand.badge}
                </span>
                <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {brand.headline}
                </h2>
                <p className="max-w-2xl text-base leading-relaxed text-white/62">
                  O login deixou de ser uma sessao local. Agora o acesso autentica no Supabase e a conta escolhe automaticamente o shell correto.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {brand.features.map(({ description, icon: Icon, title }) => (
                <div key={title} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                  <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm leading-relaxed text-white/58">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${PANEL_BASE_CLASS} flex flex-col justify-between px-6 py-8 sm:px-8 sm:py-10`}>
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/38">Acesso</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  {mode === AUTH_MODES.reset ? 'Redefinir senha' : 'Entre ou crie sua conta'}
                </h2>
              </div>
              {profile && !forceResetPassword && mode !== AUTH_MODES.resetDone ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
              ) : null}
            </div>

            {!profile && !forceResetPassword ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-white/62">
                  Escolha primeiro qual ambiente voce quer acessar. Depois disso voce pode entrar, criar conta ou recuperar a senha no mesmo fluxo.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => selectProfile('aluno')}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 text-left transition hover:border-cyan-400/30 hover:bg-slate-950/60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                      <BookOpen size={22} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">Aluno</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      Entrar no shell do estudante, criar conta nova ou usar o demo controlado.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectProfile('professor')}
                    className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 text-left transition hover:border-indigo-300/30 hover:bg-slate-950/60"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200">
                      <GraduationCap size={22} />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">Professor</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/58">
                      Abrir o portal docente, criar conta ou testar o demo separado por perfil.
                    </p>
                  </button>
                </div>
              </div>
            ) : mode === AUTH_MODES.confirmEmail ? (
              <ResultCard
                icon={Mail}
                title="Confirme seu e-mail"
                description={`A conta foi criada para ${contextValue}. Antes do primeiro login, abra o e-mail de confirmacao enviado pelo Supabase.`}
                ctaLabel="Voltar para login"
                onCta={resetToLogin}
              />
            ) : mode === AUTH_MODES.recoverySent ? (
              <ResultCard
                icon={KeyRound}
                title="Link enviado"
                description={`Se ${contextValue} existir na base, voce recebera um link para redefinir a senha e voltar ao login com a conta certa.`}
                ctaLabel="Voltar para login"
                onCta={resetToLogin}
              />
            ) : mode === AUTH_MODES.resetDone ? (
              <ResultCard
                icon={ShieldCheck}
                title="Senha atualizada"
                description="A redefinicao foi concluida. A sessao de recuperacao foi encerrada e voce ja pode entrar novamente com a nova senha."
                ctaLabel="Ir para login"
                onCta={resetToLogin}
              />
            ) : (
              <div className="space-y-6">
                {!forceResetPassword ? (
                  <div className="space-y-4">
                    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                      <ModeButton active={mode === AUTH_MODES.login} onClick={() => handleModeChange(AUTH_MODES.login)}>
                        Entrar
                      </ModeButton>
                      <ModeButton active={mode === AUTH_MODES.register} onClick={() => handleModeChange(AUTH_MODES.register)}>
                        Criar conta
                      </ModeButton>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleModeChange(AUTH_MODES.recovery)}
                      className="block text-sm text-white/55 transition hover:text-white"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                ) : null}

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/42 p-6">
                  {errorMessage ? (
                    <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      {errorMessage}
                    </div>
                  ) : null}

                  {mode === AUTH_MODES.login ? (
                    <form className="space-y-4" onSubmit={submitLogin}>
                      <AuthInput
                        autoComplete="username"
                        disabled={isSubmitting}
                        label="E-mail ou usuario demo"
                        name="identifier"
                        onChange={handleLoginChange}
                        placeholder="voce@dominio.com"
                        value={loginForm.identifier}
                      />
                      <AuthInput
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        hint={demoEnabled ? getDemoShortcutHint(selectedProfile) : null}
                        label="Senha"
                        name="password"
                        onChange={handleLoginChange}
                        placeholder={demoEnabled ? 'Sua senha ou pedro' : 'Sua senha'}
                        type="password"
                        value={loginForm.password}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
                        Entrar como {selectedProfile}
                      </button>
                    </form>
                  ) : null}

                  {mode === AUTH_MODES.register ? (
                    <form className="space-y-4" onSubmit={submitRegister}>
                      <AuthInput
                        autoComplete="name"
                        disabled={isSubmitting}
                        label="Nome completo"
                        name="fullName"
                        onChange={handleRegisterChange}
                        placeholder="Seu nome completo"
                        value={registerForm.fullName}
                      />
                      <AuthInput
                        autoComplete="email"
                        disabled={isSubmitting}
                        label="E-mail"
                        name="email"
                        onChange={handleRegisterChange}
                        placeholder="voce@dominio.com"
                        type="email"
                        value={registerForm.email}
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <AuthInput
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          label="Senha"
                          name="password"
                          onChange={handleRegisterChange}
                          placeholder="Crie uma senha"
                          type="password"
                          value={registerForm.password}
                        />
                        <AuthInput
                          autoComplete="new-password"
                          disabled={isSubmitting}
                          label="Confirmar senha"
                          name="confirmPassword"
                          onChange={handleRegisterChange}
                          placeholder="Repita a senha"
                          type="password"
                          value={registerForm.confirmPassword}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <UserRoundPlus size={18} />}
                        Criar conta de {selectedProfile}
                      </button>
                    </form>
                  ) : null}

                  {mode === AUTH_MODES.recovery ? (
                    <form className="space-y-4" onSubmit={submitRecovery}>
                      <AuthInput
                        autoComplete="email"
                        disabled={isSubmitting}
                        label="E-mail"
                        name="email"
                        onChange={handleRecoveryChange}
                        placeholder="voce@dominio.com"
                        type="email"
                        value={recoveryForm.email}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                        Enviar link de recuperacao
                      </button>
                    </form>
                  ) : null}

                  {mode === AUTH_MODES.reset ? (
                    <form className="space-y-4" onSubmit={submitReset}>
                      <AuthInput
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        label="Nova senha"
                        name="password"
                        onChange={handleResetChange}
                        placeholder="Digite a nova senha"
                        type="password"
                        value={resetForm.password}
                      />
                      <AuthInput
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        label="Confirmar nova senha"
                        name="confirmPassword"
                        onChange={handleResetChange}
                        placeholder="Repita a nova senha"
                        type="password"
                        value={resetForm.confirmPassword}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
                        Atualizar senha
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/42">
            {demoEnabled
              ? 'Demo habilitado apenas para desenvolvimento local e previews autorizados.'
              : 'Atalhos demo desligados neste ambiente. Use e-mail real para entrar.'}
          </div>
        </section>
      </div>
    </div>
  )
}
