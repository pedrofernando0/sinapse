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
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { getDemoDisplayName, isDemoLoginAllowed } from '../../lib/demoSession.js';

const INITIAL_FORM_DATA = {
  username: '',
  password: '',
  unit: 'Cursinho Popular da Poli-USP',
};

const STUDENT_FEATURES = [
  { icon: Activity,     title: 'Raio-X',      desc: 'Análise de prioridades de estudo.' },
  { icon: Target,       title: 'Diagnóstico',  desc: 'Avaliação inicial de conhecimentos.' },
  { icon: CalendarDays, title: 'Cronograma',   desc: 'Rotinas e metas pré-definidas.' },
  { icon: Brain,        title: 'Revisões',     desc: 'Retomada inteligente de conteúdos.' },
];

const TEACHER_FEATURES = [
  { icon: Bot,          title: 'Risco de Evasão', desc: 'Sinais de alerta de alunos.' },
  { icon: LineChart,    title: 'Analytics',        desc: 'Métricas de desempenho e foco.' },
  { icon: FileQuestion, title: 'Questões',          desc: 'Base de dados otimizada.' },
  { icon: LayoutList,   title: 'Gestão',            desc: 'Planejamento unificado de turmas.' },
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

export default function Login({ onLogin }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ username: false, password: false });
  const [authError, setAuthError] = useState('');
  const usernameRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (step !== 3) return;
    setLoadingTextIdx(0);
    const interval = setInterval(() => {
      setLoadingTextIdx((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  // Auto-focus username when entering step 2 — desktop only (avoids mobile keyboard pop-up)
  useEffect(() => {
    if (step !== 2 || isTransitioning) return;
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const t = setTimeout(() => usernameRef.current?.focus(), 650);
      return () => clearTimeout(t);
    }
  }, [step, isTransitioning]);

  const transition = (fn) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => { fn(); setIsTransitioning(false); }, 500);
  };

  const handleProfileSelect = (selectedProfile) =>
    transition(() => { setProfile(selectedProfile); setStep(2); });

  const handleBack = () =>
    transition(() => {
      setStep(1);
      setProfile(null);
      setFormData((prev) => ({ ...prev, password: '' }));
      setShowPassword(false);
      setFieldErrors({ username: false, password: false });
      setAuthError('');
    });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: false } : prev));
    if (authError) {
      setAuthError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors = {
      username: !formData.username.trim(),
      password: !formData.password.trim(),
    };
    if (errors.username || errors.password) {
      setFieldErrors(errors);
      setTimeout(() => setFieldErrors({ username: false, password: false }), 820);
      return;
    }

    if (!isDemoLoginAllowed({ profile, formData })) {
      setFieldErrors({ username: true, password: true });
      setAuthError('Usuário ou senha inválidos para o ambiente do estudante.');
      setTimeout(() => setFieldErrors({ username: false, password: false }), 820);
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsTransitioning(true);
    setTimeout(() => {
      setStep(3);
      setIsTransitioning(false);

      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setStep(1);
          setProfile(null);
          setFormData(INITIAL_FORM_DATA);
          setIsSubmitting(false);
          setShowPassword(false);
          setAuthError('');
          setIsTransitioning(false);
          onLogin?.({ profile, formData });
        }, 700);
      }, 4800);
    }, 500);
  };

  const displayName = getDemoDisplayName(formData) || '';
  const welcomeTitle = displayName
    ? `Bem-vindo(a), ${profile === 'professor' ? 'Prof. ' : ''}${displayName}!`
    : 'Bem-vindo(a) de volta!';

  const isAluno = profile === 'aluno';

  return (
    <div className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">

      <style>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.04; mix-blend-mode: overlay; pointer-events: none;
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
        @keyframes loadingProgress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: loadingProgress 4.8s linear forwards; }
        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}</style>

      <div className="absolute inset-0 z-0 bg-noise" />
      <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-[45vw] h-[45vw] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-[55vw] h-[55vw] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob animation-delay-4000" />

      {/* Container glassmorphism */}
      <div className={`relative z-10 flex h-full max-h-[870px] w-full max-w-[1200px] flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-3xl lg:flex-row transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

        {/* ── Lado esquerdo — Branding ── */}
        <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-10 lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-50" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] shadow-inner backdrop-blur-md">
                <BrainCircuit className="text-cyan-400" size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Sinapse
              </h1>
            </div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-center mt-12">
            <BrandingPanel active={step === 1 && !isTransitioning} direction="left">
              <h2 className="text-[2.75rem] font-semibold text-white leading-[1.1] tracking-tight mb-6">
                Inteligência <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  educacional
                </span>
              </h2>
              <p className="text-lg leading-relaxed text-white/50 max-w-sm">
                Uma experiência fluida e analítica. Ligue os pontos da sua jornada acadêmica com precisão e tecnologia de ponta.
              </p>
            </BrandingPanel>

            <BrandingPanel active={(step === 2 || step === 3) && isAluno && !isTransitioning} direction="right">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
                  <GraduationCap size={14} /> Espaço do Estudante
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">O seu ecossistema.</h2>
              </div>
              <FeatureList features={STUDENT_FEATURES} iconColor="text-cyan-400" dimmed={step === 3} hoverBorder="group-hover:border-cyan-500/30" />
            </BrandingPanel>

            <BrandingPanel active={(step === 2 || step === 3) && !isAluno && profile !== null && !isTransitioning} direction="right">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-4">
                  <Sparkles size={14} /> Portal do Docente
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Poder analítico.</h2>
              </div>
              <FeatureList features={TEACHER_FEATURES} iconColor="text-blue-400" dimmed={step === 3} hoverBorder="group-hover:border-blue-500/30" />
            </BrandingPanel>
          </div>

          <div className="relative z-10 mt-12">
            <div className={`transition-all duration-700 flex items-center gap-3 ${step === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <Building2 size={20} className="text-white/30" />
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold mb-0.5">Tecnologia por</p>
                <p className="text-sm text-white/70 font-medium">Cursinho Popular da Poli-USP</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Lado direito — Interações ── */}
        <div className="relative flex w-full flex-col justify-center p-6 sm:p-10 lg:w-7/12 xl:p-16">

          {/* Logo mobile */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] shadow-inner backdrop-blur-md">
              <BrainCircuit className="text-cyan-400" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Sinapse Educação
            </h1>
          </div>

          {/* Step container — altura fixa para animações de overlay */}
          <div className="relative mx-auto w-full max-w-[400px] h-[600px]">

            {/* ── Step 1 — Seleção de perfil ── */}
            <StepPanel active={step === 1 && !isTransitioning} enter="scale-100" exit="scale-95">
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Acessar conta</h2>
                <p className="text-white/50 text-sm">Selecione o seu perfil para prosseguir para o painel.</p>
              </div>
              <div className="flex flex-col gap-4">
                <ProfileButton
                  onClick={() => handleProfileSelect('aluno')}
                  icon={GraduationCap}
                  label="Sou Estudante"
                  desc="Acessar trilhas, revisões e métricas."
                  hoverColor="cyan"
                />
                <ProfileButton
                  onClick={() => handleProfileSelect('professor')}
                  icon={Sparkles}
                  label="Sou Professor"
                  desc="Gestão de turmas e alertas preditivos."
                  hoverColor="blue"
                />
              </div>
            </StepPanel>

            {/* ── Step 2 — Formulário ── */}
            <StepPanel active={step === 2 && !isTransitioning} enter="translate-y-0" exit="translate-y-8" startAlign>
              {/* Voltar */}
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="group mb-6 flex w-fit items-center text-[13px] font-medium text-white/40 transition-colors hover:text-white/90 disabled:opacity-50"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 mr-2.5 transition-all group-hover:bg-white/10">
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Alterar Perfil
              </button>

              {/* Cabeçalho */}
              <div className="mb-5">
                <h2 className="text-[1.65rem] font-bold leading-tight text-white mb-1.5 tracking-tight">
                  {welcomeTitle}
                </h2>
                <p className="text-sm text-white/50">Insira suas credenciais para acessar.</p>
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                  <Building2 size={11} className="text-white/30" />
                  <span className="text-[10px] font-medium text-white/35">Cursinho Popular da Poli-USP</span>
                </div>
              </div>

              {/* SSO — acesso social */}
              <div className="flex flex-col gap-2.5 mb-5">
                <SsoButton icon={<GoogleIcon />} label="Continuar com Google" />
                <SsoButton icon={<AppleIcon />} label="Continuar com Apple" />
              </div>

              {/* Divisor */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Usuário */}
                <CredentialField
                  label="Usuário"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="ex: joao.silva"
                  icon={User}
                  isAluno={isAluno}
                  inputRef={usernameRef}
                  autoComplete="username"
                  hasError={fieldErrors.username}
                />

                {/* Senha */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-[13px] font-medium text-white/60">Senha</label>
                    <a
                      href="#"
                      className={`text-xs font-medium hover:underline ${isAluno ? 'text-cyan-400/80 hover:text-cyan-300' : 'text-blue-400/80 hover:text-blue-300'}`}
                    >
                      Esqueceu a senha?
                    </a>
                  </div>
                  <CredentialField
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="••••••••"
                    icon={Lock}
                    isAluno={isAluno}
                    noLabel
                    showToggle
                    showValue={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    autoComplete="current-password"
                    hasError={fieldErrors.password}
                  />
                </div>

                {authError && (
                  <p className="px-1 text-sm font-medium text-red-300">
                    {authError}
                  </p>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-semibold text-white transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-70 disabled:cursor-wait active:scale-[0.98] ${
                      isAluno
                        ? 'bg-cyan-500 hover:bg-cyan-400 focus:ring-cyan-500 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]'
                        : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        Acessar Painel <LogIn size={18} className="ml-1 opacity-80" />
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </StepPanel>

            {/* ── Step 3 — Ritual de carregamento ── */}
            <StepPanel active={step === 3 && !isTransitioning} enter="scale-100" exit="scale-105" center>
              {/* [LLM-NOTE: WIDGET DE CARREGAMENTO (FORMA)]
                  IA futura: este elemento (circular com anéis pulsantes) não deve ser circular
                  na integração real. Remova 'rounded-full' / 'rounded-3xl' conforme o novo design. */}
              <div className="relative mb-8 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${isAluno ? 'bg-cyan-500' : 'bg-blue-500'}`} />
                <div className={`absolute -inset-4 rounded-full border border-dashed opacity-20 animate-[spin_4s_linear_infinite] ${isAluno ? 'border-cyan-400' : 'border-blue-400'}`} />
                <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border backdrop-blur-md shadow-2xl ${isAluno ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                  {isAluno
                    ? <GraduationCap size={42} className="text-cyan-400 animate-pulse" />
                    : <Sparkles      size={42} className="text-blue-400 animate-pulse" />
                  }
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                Preparando ambiente, <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isAluno ? 'from-cyan-400 to-blue-400' : 'from-blue-400 to-indigo-400'}`}>
                  {displayName || 'Usuário'}
                </span>
              </h2>

              <div className="h-6 mt-2 mb-8 relative w-full overflow-hidden">
                {RITUAL_TEXTS[profile || 'aluno'].map((text, idx) => (
                  <p
                    key={idx}
                    className={`absolute w-full text-sm text-white/50 transition-all duration-500 ${loadingTextIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  >
                    {text}
                  </p>
                ))}
              </div>

              <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full animate-progress rounded-full ${isAluno ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]'}`} />
              </div>
            </StepPanel>
          </div>

          <div className={`mt-auto pt-6 text-center text-[10px] font-medium uppercase tracking-widest text-white/30 transition-all duration-700 lg:hidden ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            Tecnologia por Cursinho Popular Poli-USP
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Subcomponentes presentacionais ─────────────── */

const PANEL_TRANSITION_STYLE = {
  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

function BrandingPanel({ active, direction, children }) {
  const dirClass = direction === 'left' ? '-translate-x-12' : 'translate-x-12';
  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${
        active ? 'opacity-100 translate-x-0 pointer-events-auto' : `opacity-0 ${dirClass} pointer-events-none`
      }`}
      style={PANEL_TRANSITION_STYLE}
    >
      {children}
    </div>
  );
}

function FeatureList({ features, iconColor, dimmed, hoverBorder }) {
  return (
    <div className="grid grid-cols-1 gap-4 pr-6">
      {features.map(({ icon: Icon, title, desc }, idx) => (
        <div
          key={idx}
          className={`group flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-colors ${dimmed ? 'opacity-50' : 'hover:bg-white/[0.04]'}`}
        >
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.05] ${hoverBorder} transition-colors`}>
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

function StepPanel({ active, enter, exit, center, startAlign, children }) {
  const flexAlign = center
    ? 'items-center justify-center text-center'
    : startAlign
      ? 'justify-start'
      : 'justify-center';
  return (
    <div
      className={`absolute inset-0 flex flex-col transition-all duration-700 ${flexAlign} ${
        active ? `opacity-100 ${enter} pointer-events-auto z-10` : `opacity-0 ${exit} pointer-events-none z-0`
      }`}
      style={PANEL_TRANSITION_STYLE}
    >
      {children}
    </div>
  );
}

function ProfileButton({ onClick, icon: Icon, label, desc, hoverColor }) {
  const colors = {
    cyan: {
      border: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]',
      ring:   'group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10',
      icon:   'group-hover:text-cyan-400',
    },
    blue: {
      border: 'hover:border-blue-500/40 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
      ring:   'group-hover:border-blue-500/50 group-hover:bg-blue-500/10',
      icon:   'group-hover:text-blue-400',
    },
  }[hoverColor];

  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:bg-white/[0.06] active:scale-[0.98] ${colors.border}`}
    >
      <div className={`mr-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] transition-all group-hover:scale-110 ${colors.ring}`}>
        <Icon size={24} className={`text-white/70 transition-colors ${colors.icon}`} />
      </div>
      <div>
        <h3 className="mb-1 text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{label}</h3>
        <p className="text-[13px] text-white/40">{desc}</p>
      </div>
    </button>
  );
}

function CredentialField({
  label, type, name, value, onChange, disabled, placeholder,
  icon: Icon, isAluno, noLabel,
  showToggle, showValue, onToggle,
  hasError, inputRef, autoComplete,
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
    <div className={`group ${hasError ? 'animate-shake' : ''}`}>
      {!noLabel && label && (
        <label className="text-[13px] font-medium text-white/60 pl-1 block mb-2">{label}</label>
      )}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon size={18} className={`transition-colors ${iconClass}`} />
        </div>
        <input
          ref={inputRef}
          type={resolvedType}
          name={name}
          required
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`block w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 disabled:opacity-50 ${ringClass} ${showToggle ? 'pr-12' : ''}`}
        />
        {showToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={onToggle}
            aria-label={showValue ? 'Esconder senha' : 'Mostrar senha'}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/35 hover:text-white/70 transition-colors"
          >
            {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}

function SsoButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/75 transition-all hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white/90 active:scale-[0.98]"
    >
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        {icon}
      </span>
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}
