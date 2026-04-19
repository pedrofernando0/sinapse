import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Bot,
  Brain,
  BrainCircuit,
  Building2,
  CalendarDays,
  Eye,
  EyeOff,
  FileQuestion,
  GraduationCap,
  LayoutList,
  LineChart,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Sparkles,
  Target,
  User,
} from 'lucide-react';

const INITIAL_FORM_DATA = {
  confirmPassword: '',
  email: '',
  fullName: '',
  password: '',
  unit: 'Cursinho Popular da Poli-USP',
};

const STUDENT_FEATURES = [
  { icon: Activity, title: 'Raio-X', desc: 'Análise de prioridades de estudo.' },
  { icon: Target, title: 'Diagnóstico', desc: 'Avaliação inicial de conhecimentos.' },
  { icon: CalendarDays, title: 'Cronograma', desc: 'Rotinas e metas pré-definidas.' },
  { icon: Brain, title: 'Revisões', desc: 'Retomada inteligente de conteúdos.' },
];

const TEACHER_FEATURES = [
  { icon: Bot, title: 'Risco de Evasão', desc: 'Sinais de alerta de alunos.' },
  { icon: LineChart, title: 'Analytics', desc: 'Métricas de desempenho e foco.' },
  { icon: FileQuestion, title: 'Questões', desc: 'Base de dados otimizada.' },
  { icon: LayoutList, title: 'Gestão', desc: 'Planejamento unificado de turmas.' },
];

const RITUAL_TEXTS = {
  aluno: [
    'Autenticando credenciais...',
    'Sincronizando suas trilhas de estudo...',
    'Carregando o Raio-X de desempenho...',
    'Ambiente pronto. Iniciando sessão...',
  ],
  professor: [
    'Verificando permissões docentes...',
    'Atualizando dados de turmas...',
    'Gerando relatórios preditivos...',
    'Portal preparado. Iniciando sessão...',
  ],
};

const AUTH_MODE_COPY = {
  login: {
    description: 'Entre com seu e-mail institucional ou pessoal para retomar a sessão.',
    submitLabel: 'Acessar painel',
    title: 'Entrar na plataforma',
  },
  recover: {
    description: 'Enviamos o link de redefinição para o e-mail associado à sua conta.',
    submitLabel: 'Enviar recuperação',
    title: 'Recuperar senha',
  },
  register: {
    description: 'Crie a conta que será usada para acessar cronogramas, revisões e relatórios.',
    submitLabel: 'Cadastrar agora',
    title: 'Criar conta',
  },
};

const buildDisplayName = ({ email = '', fullName = '' } = {}) => {
  if (fullName.trim()) {
    return fullName.trim().split(/\s+/)[0];
  }

  const [emailName = ''] = email.trim().split('@');
  return emailName || '';
};

const buildFieldErrors = (formData, authMode) => {
  const nextErrors = {};
  const normalizedEmail = formData.email.trim().toLowerCase();

  if (authMode === 'register' && !formData.fullName.trim()) {
    nextErrors.fullName = true;
  }

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    nextErrors.email = true;
  }

  if (authMode !== 'recover' && !formData.password) {
    nextErrors.password = true;
  }

  if (authMode === 'register') {
    if (formData.password.length < 8) {
      nextErrors.password = true;
    }

    if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = true;
    }
  }

  return nextErrors;
};

const buildErrorMessage = (fieldErrors, authMode) => {
  if (fieldErrors.fullName) {
    return 'Informe o nome completo para criar a conta.';
  }

  if (fieldErrors.email) {
    return authMode === 'recover'
      ? 'Use um e-mail válido para recuperar a senha.'
      : 'Use um e-mail válido para continuar.';
  }

  if (fieldErrors.confirmPassword) {
    return 'As senhas precisam ser iguais para concluir o cadastro.';
  }

  if (fieldErrors.password) {
    return authMode === 'register'
      ? 'A senha precisa ter pelo menos 8 caracteres.'
      : 'Informe a senha da sua conta.';
  }

  return 'Revise os campos destacados antes de continuar.';
};

export default function Login({
  onLogin,
  onRecover,
  onRegister,
}) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const emailRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (step !== 3) {
      return undefined;
    }

    setLoadingTextIdx(0);
    const interval = setInterval(() => {
      setLoadingTextIdx((prev) => (prev < 3 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (step !== 2) {
      return undefined;
    }

    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const frameId = window.requestAnimationFrame(() => {
        emailRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    return undefined;
  }, [authMode, step]);

  const displayName = buildDisplayName(formData);
  const welcomeTitle = displayName
    ? `Bem-vindo(a), ${profile === 'professor' ? 'Prof. ' : ''}${displayName}!`
    : 'Bem-vindo(a) de volta!';
  const isAluno = profile === 'aluno';
  const currentCopy = AUTH_MODE_COPY[authMode];
  const isRecoverMode = authMode === 'recover';
  const isRegisterMode = authMode === 'register';

  const resetTransientState = () => {
    setAuthError('');
    setAuthSuccess('');
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleProfileSelect = (selectedProfile) => {
    resetTransientState();
    setProfile(selectedProfile);
    setAuthMode('login');
    setFormData(INITIAL_FORM_DATA);
    setStep(2);
  };

  const handleBack = () => {
    resetTransientState();
    setStep(1);
    setProfile(null);
    setAuthMode('login');
    setFormData(INITIAL_FORM_DATA);
  };

  const handleModeChange = (nextMode) => {
    resetTransientState();
    setAuthMode(nextMode);
    setStep(2);
    setFormData((previousFormData) => ({
      ...previousFormData,
      confirmPassword: '',
      fullName: nextMode === 'register' ? previousFormData.fullName : '',
      password: '',
    }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((previousErrors) => ({
        ...previousErrors,
        [name]: false,
      }));
    }

    if (authError) {
      setAuthError('');
    }

    if (authSuccess) {
      setAuthSuccess('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextFieldErrors = buildFieldErrors(formData, authMode);

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setAuthError(buildErrorMessage(nextFieldErrors, authMode));
      return;
    }

    setIsSubmitting(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      if (authMode === 'login') {
        setStep(3);
        await onLogin?.({ formData, profile });
        return;
      }

      if (authMode === 'register') {
        const response = await onRegister?.({
          email: formData.email.trim().toLowerCase(),
          fullName: formData.fullName.trim(),
          password: formData.password,
          profile,
        });

        setAuthMode('login');
        setFormData((previousFormData) => ({
          ...previousFormData,
          confirmPassword: '',
          fullName: '',
          password: '',
        }));
        setAuthSuccess(
          response?.requiresEmailConfirmation
            ? 'Conta criada. Verifique seu e-mail para confirmar o cadastro.'
            : 'Conta criada. Você já pode entrar com suas credenciais.',
        );
        return;
      }

      await onRecover?.(formData.email.trim().toLowerCase());
      setAuthMode('login');
      setFormData((previousFormData) => ({
        ...previousFormData,
        password: '',
      }));
      setAuthSuccess(
        'Se existir uma conta para esse e-mail, você receberá o link de recuperação.',
      );
    } catch (error) {
      setStep(2);
      setAuthError(error.message || 'Não foi possível concluir a solicitação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#050505] p-4 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 sm:p-6 lg:p-8">
      <style>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04;
          mix-blend-mode: overlay;
          pointer-events: none;
        }
        @keyframes blob {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(30px, -50px) scale(1.1); }
          66%  { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 12s infinite alternate ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      <div className="bg-noise absolute inset-0 z-0" />
      <div className="absolute left-1/4 top-1/4 h-[50vw] w-[50vw] animate-blob rounded-full bg-cyan-600/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="animation-delay-2000 absolute right-1/4 top-1/3 h-[45vw] w-[45vw] animate-blob rounded-full bg-blue-700/20 blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="animation-delay-4000 absolute bottom-1/4 left-1/3 h-[55vw] w-[55vw] animate-blob rounded-full bg-indigo-600/15 blur-[120px] mix-blend-screen pointer-events-none" />

      <div className={`relative z-10 flex h-full max-h-[870px] w-full max-w-[1200px] flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-all duration-1000 lg:flex-row ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-10 lg:flex">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-50" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] shadow-inner backdrop-blur-md">
                <BrainCircuit className="text-cyan-400" size={24} />
              </div>
              <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Sinapse
              </h1>
            </div>
          </div>

          <div className="relative z-10 mt-12 flex flex-1 flex-col justify-center">
            <BrandingPanel active={step === 1} direction="left">
              <h2 className="mb-6 text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-white">
                Inteligência <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  educacional
                </span>
              </h2>
              <p className="max-w-sm text-lg leading-relaxed text-white/50">
                Uma experiência fluida e analítica. Ligue os pontos da sua jornada acadêmica com precisão e tecnologia de ponta.
              </p>
            </BrandingPanel>

            <BrandingPanel active={step !== 1 && isAluno} direction="right">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
                  <GraduationCap size={14} /> Espaço do Estudante
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white">O seu ecossistema.</h2>
              </div>
              <FeatureList
                dimmed={step === 3}
                features={STUDENT_FEATURES}
                hoverBorder="group-hover:border-cyan-500/30"
                iconColor="text-cyan-400"
              />
            </BrandingPanel>

            <BrandingPanel active={step !== 1 && !isAluno && profile !== null} direction="right">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
                  <Sparkles size={14} /> Portal do Docente
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Poder analítico.</h2>
              </div>
              <FeatureList
                dimmed={step === 3}
                features={TEACHER_FEATURES}
                hoverBorder="group-hover:border-blue-500/30"
                iconColor="text-blue-400"
              />
            </BrandingPanel>
          </div>

          <div className="relative z-10 mt-12">
            <div className={`flex items-center gap-3 transition-all duration-700 ${step === 1 ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              <Building2 size={20} className="text-white/30" />
              <div>
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">Tecnologia por</p>
                <p className="text-sm font-medium text-white/70">Cursinho Popular da Poli-USP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col justify-center p-6 sm:p-10 lg:w-7/12 xl:p-16">
          <div className="mb-8 flex flex-col items-center justify-center gap-4 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] shadow-inner backdrop-blur-md">
              <BrainCircuit className="text-cyan-400" size={28} />
            </div>
            <h1 className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-2xl font-bold text-transparent">
              Sinapse Educação
            </h1>
          </div>

          <div className="relative mx-auto h-[640px] w-full max-w-[420px]">
            <StepPanel active={step === 1} enter="scale-100" exit="scale-95">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">Acessar conta</h2>
                <p className="text-sm text-white/50">Selecione o seu perfil para prosseguir para o painel.</p>
              </div>
              <div className="flex flex-col gap-4">
                <ProfileButton
                  desc="Acessar trilhas, revisões e métricas."
                  hoverColor="cyan"
                  icon={GraduationCap}
                  label="Sou Estudante"
                  onClick={() => handleProfileSelect('aluno')}
                />
                <ProfileButton
                  desc="Gestão de turmas e alertas preditivos."
                  hoverColor="blue"
                  icon={Sparkles}
                  label="Sou Professor"
                  onClick={() => handleProfileSelect('professor')}
                />
              </div>
            </StepPanel>

            <StepPanel active={step === 2} enter="translate-y-0" exit="translate-y-8" startAlign>
              <button
                className="group mb-6 flex w-fit items-center text-[13px] font-medium text-white/40 transition-colors hover:text-white/90 disabled:opacity-50"
                disabled={isSubmitting}
                onClick={handleBack}
                type="button"
              >
                <div className="mr-2.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all group-hover:bg-white/10">
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                </div>
                Alterar perfil
              </button>

              <div className="mb-5">
                <h2 className="mb-1.5 text-[1.65rem] font-bold leading-tight tracking-tight text-white">
                  {authMode === 'login' ? welcomeTitle : currentCopy.title}
                </h2>
                <p className="text-sm text-white/50">{currentCopy.description}</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
                  <Building2 size={11} className="text-white/30" />
                  <span className="text-[10px] font-medium text-white/35">Cursinho Popular da Poli-USP</span>
                </div>
              </div>

              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                {isRegisterMode ? (
                  <CredentialField
                    autoComplete="name"
                    disabled={isSubmitting}
                    hasError={fieldErrors.fullName}
                    icon={User}
                    isAluno={isAluno}
                    label="Nome completo"
                    name="fullName"
                    onChange={handleChange}
                    placeholder="Como seu nome deve aparecer"
                    type="text"
                    value={formData.fullName}
                  />
                ) : null}

                <CredentialField
                  autoComplete="email"
                  disabled={isSubmitting}
                  hasError={fieldErrors.email}
                  icon={Mail}
                  inputRef={emailRef}
                  isAluno={isAluno}
                  label="E-mail"
                  name="email"
                  onChange={handleChange}
                  placeholder="voce@exemplo.com"
                  type="email"
                  value={formData.email}
                />

                {!isRecoverMode ? (
                  <CredentialField
                    autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                    disabled={isSubmitting}
                    hasError={fieldErrors.password}
                    icon={Lock}
                    isAluno={isAluno}
                    label="Senha"
                    name="password"
                    onChange={handleChange}
                    onToggle={() => setShowPassword((currentValue) => !currentValue)}
                    placeholder="••••••••"
                    showToggle
                    showValue={showPassword}
                    type="password"
                    value={formData.password}
                  />
                ) : null}

                {isRegisterMode ? (
                  <CredentialField
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    hasError={fieldErrors.confirmPassword}
                    icon={Lock}
                    isAluno={isAluno}
                    label="Confirmar senha"
                    name="confirmPassword"
                    onChange={handleChange}
                    onToggle={() => setShowConfirmPassword((currentValue) => !currentValue)}
                    placeholder="Repita a senha"
                    showToggle
                    showValue={showConfirmPassword}
                    type="password"
                    value={formData.confirmPassword}
                  />
                ) : null}

                {authError ? (
                  <p className="px-1 text-sm font-medium text-red-300">{authError}</p>
                ) : null}

                {authSuccess ? (
                  <p className="px-1 text-sm font-medium text-emerald-300">{authSuccess}</p>
                ) : null}

                <div className="pt-2">
                  <button
                    className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-semibold text-white transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:cursor-wait disabled:opacity-70 active:scale-[0.98] ${
                      isAluno
                        ? 'bg-cyan-500 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] hover:bg-cyan-400 focus:ring-cyan-500'
                        : 'bg-blue-600 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:bg-blue-500 focus:ring-blue-500'
                    }`}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        {currentCopy.submitLabel}
                        {authMode === 'login' ? <LogIn size={18} className="ml-1 opacity-80" /> : null}
                      </span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 space-y-3">
                {authMode === 'login' ? (
                  <>
                    <button
                      className={`text-sm font-medium transition-colors ${isAluno ? 'text-cyan-300 hover:text-cyan-200' : 'text-blue-300 hover:text-blue-200'}`}
                      onClick={() => handleModeChange('recover')}
                      type="button"
                    >
                      Esqueci a senha
                    </button>
                    <div className="text-sm text-white/50">
                      Ainda não tem conta?{' '}
                      <button
                        className={`font-semibold transition-colors ${isAluno ? 'text-cyan-300 hover:text-cyan-200' : 'text-blue-300 hover:text-blue-200'}`}
                        onClick={() => handleModeChange('register')}
                        type="button"
                      >
                        Criar conta
                      </button>
                    </div>
                  </>
                ) : null}

                {authMode === 'register' ? (
                  <div className="text-sm text-white/50">
                    Já tem acesso?{' '}
                    <button
                      className={`font-semibold transition-colors ${isAluno ? 'text-cyan-300 hover:text-cyan-200' : 'text-blue-300 hover:text-blue-200'}`}
                      onClick={() => handleModeChange('login')}
                      type="button"
                    >
                      Já tenho conta
                    </button>
                  </div>
                ) : null}

                {authMode === 'recover' ? (
                  <button
                    className={`text-sm font-semibold transition-colors ${isAluno ? 'text-cyan-300 hover:text-cyan-200' : 'text-blue-300 hover:text-blue-200'}`}
                    onClick={() => handleModeChange('login')}
                    type="button"
                  >
                    Voltar para login
                  </button>
                ) : null}
              </div>
            </StepPanel>

            <StepPanel active={step === 3} center enter="scale-100" exit="scale-105">
              <div className="relative mb-8 flex items-center justify-center">
                <div className={`absolute inset-0 animate-ping rounded-full opacity-30 ${isAluno ? 'bg-cyan-500' : 'bg-blue-500'}`} />
                <div className={`absolute -inset-4 animate-[spin_4s_linear_infinite] rounded-full border border-dashed opacity-20 ${isAluno ? 'border-cyan-400' : 'border-blue-400'}`} />
                <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border shadow-2xl backdrop-blur-md ${isAluno ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-blue-500/30 bg-blue-500/10'}`}>
                  {isAluno ? (
                    <GraduationCap size={42} className="animate-pulse text-cyan-400" />
                  ) : (
                    <Sparkles size={42} className="animate-pulse text-blue-400" />
                  )}
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
                Preparando ambiente, <br />
                <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isAluno ? 'from-cyan-400 to-blue-400' : 'from-blue-400 to-indigo-400'}`}>
                  {displayName || 'Usuário'}
                </span>
              </h2>

              <div className="relative mb-8 mt-2 h-6 w-full overflow-hidden">
                {RITUAL_TEXTS[profile || 'aluno'].map((text, idx) => (
                  <p
                    key={idx}
                    className={`absolute w-full text-sm text-white/50 transition-all duration-500 ${loadingTextIdx === idx ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  >
                    {text}
                  </p>
                ))}
              </div>

              <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full w-full animate-pulse rounded-full ${isAluno ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]'}`} />
              </div>
            </StepPanel>
          </div>

          <div className="mt-auto pt-6 text-center text-[10px] font-medium uppercase tracking-widest text-white/30 lg:hidden">
            Tecnologia por Cursinho Popular Poli-USP
          </div>
        </div>
      </div>
    </div>
  );
}

const PANEL_TRANSITION_STYLE = {
  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

function BrandingPanel({ active, direction, children }) {
  const directionClass = direction === 'left' ? '-translate-x-12' : 'translate-x-12';

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
        active ? 'translate-x-0 opacity-100 pointer-events-auto' : `${directionClass} opacity-0 pointer-events-none`
      }`}
      style={PANEL_TRANSITION_STYLE}
    >
      {children}
    </div>
  );
}

function FeatureList({ dimmed, features, hoverBorder, iconColor }) {
  return (
    <div className="grid grid-cols-1 gap-4 pr-6">
      {features.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className={`group flex items-start gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4 transition-colors ${dimmed ? 'opacity-50' : 'hover:bg-white/[0.04]'}`}
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.05] transition-colors ${hoverBorder}`}>
            <Icon size={18} className={iconColor} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/90">{title}</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-white/50">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepPanel({ active, center, enter, exit, startAlign, children }) {
  const flexAlign = center ? 'items-center justify-center text-center' : startAlign ? 'justify-start' : 'justify-center';

  return (
    <div
      className={`absolute inset-0 flex flex-col transition-all duration-700 ${flexAlign} ${
        active ? `${enter} z-10 opacity-100 pointer-events-auto` : `${exit} z-0 opacity-0 pointer-events-none`
      }`}
      style={PANEL_TRANSITION_STYLE}
    >
      {children}
    </div>
  );
}

function ProfileButton({ desc, hoverColor, icon: Icon, label, onClick }) {
  const colors = {
    blue: {
      border: 'hover:border-blue-500/40 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
      icon: 'group-hover:text-blue-400',
      ring: 'group-hover:border-blue-500/50 group-hover:bg-blue-500/10',
    },
    cyan: {
      border: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]',
      icon: 'group-hover:text-cyan-400',
      ring: 'group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10',
    },
  }[hoverColor];

  return (
    <button
      className={`group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98] ${colors.border}`}
      onClick={onClick}
      type="button"
    >
      <div className={`mr-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] transition-all group-hover:scale-110 ${colors.ring}`}>
        <Icon size={24} className={`text-white/70 transition-colors ${colors.icon}`} />
      </div>
      <div>
        <h3 className="mb-1 text-lg font-semibold text-white/90 transition-colors group-hover:text-white">{label}</h3>
        <p className="text-[13px] text-white/40">{desc}</p>
      </div>
    </button>
  );
}

function CredentialField({
  autoComplete,
  disabled,
  hasError,
  icon: Icon,
  inputRef,
  isAluno,
  label,
  name,
  onChange,
  onToggle,
  placeholder,
  showToggle,
  showValue,
  type,
  value,
}) {
  const ringClass = hasError
    ? 'border-red-500/50 ring-1 ring-red-500/40'
    : isAluno
      ? 'focus:border-cyan-500/50 focus:ring-cyan-500/50'
      : 'focus:border-blue-500/50 focus:ring-blue-500/50';
  const iconClass = hasError
    ? 'text-red-400/70'
    : isAluno
      ? 'text-white/40 group-focus-within:text-cyan-400'
      : 'text-white/40 group-focus-within:text-blue-400';
  const resolvedType = showToggle ? (showValue ? 'text' : 'password') : type;

  return (
    <div className="group">
      <label className="mb-2 block pl-1 text-[13px] font-medium text-white/60" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Icon size={18} className={`transition-colors ${iconClass}`} />
        </div>
        <input
          autoComplete={autoComplete}
          className={`block w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 disabled:opacity-50 ${ringClass} ${showToggle ? 'pr-12' : ''}`}
          disabled={disabled}
          id={name}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          ref={inputRef}
          required
          type={resolvedType}
          value={value}
        />
        {showToggle ? (
          <button
            aria-label={showValue ? 'Esconder senha' : 'Mostrar senha'}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-white/35 transition-colors hover:text-white/70"
            onClick={onToggle}
            tabIndex={-1}
            type="button"
          >
            {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
