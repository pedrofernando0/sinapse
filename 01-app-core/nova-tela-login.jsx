import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Bot,
  Brain,
  BrainCircuit,
  Building2,
  CalendarDays,
  FileQuestion,
  GraduationCap,
  LayoutList,
  LineChart,
  Lock,
  LogIn,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import { getDemoDisplayName } from '../src/lib/demoSession.js';

const INITIAL_FORM_DATA = {
  username: '',
  password: '',
  unit: 'Cursinho Popular da Poli-USP',
};

export default function App({ onLogin }) {
    const [step, setStep] = useState(1);
    const [profile, setProfile] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [loadingTextIdx, setLoadingTextIdx] = useState(0);
    
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    // Efeito de montagem inicial suave
    useEffect(() => {
      setMounted(true);
    }, []);

    // Efeito para alternar os textos do ritual de carregamento (Step 3)
    useEffect(() => {
      let interval;
      if (step === 3) {
        setLoadingTextIdx(0);
        interval = setInterval(() => {
          setLoadingTextIdx((prev) => (prev < 3 ? prev + 1 : prev));
        }, 1200);
      }
      return () => clearInterval(interval);
    }, [step]);

    const handleProfileSelect = (selectedProfile) => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      setTimeout(() => {
        setProfile(selectedProfile);
        setStep(2);
        setIsTransitioning(false);
      }, 500); 
    };

    const handleBack = () => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setTimeout(() => {
        setStep(1);
        setProfile(null);
        setFormData(prev => ({ ...prev, password: '' })); 
        setIsTransitioning(false);
      }, 500);
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      setIsSubmitting(true);

      // 1. Simula tempo inicial de autenticação de rede
      await new Promise(resolve => setTimeout(resolve, 600));

      // 2. Transição para o Ritual de Carregamento (Step 3)
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(3);
        setIsTransitioning(false);

        // 3. Aguarda o tempo do ritual (animação de textos dinâmicos) e volta ao início
        setTimeout(() => {
          setIsTransitioning(true);
          setTimeout(() => {
            
            // Ao fim do ritual, o wrapper de rota persiste a sessao e redireciona
            // para o espaco correto sem alterar o fluxo visual desta tela.
            
            setStep(1);
            setProfile(null);
            setFormData(INITIAL_FORM_DATA);
            setIsSubmitting(false);
            setIsTransitioning(false);
            
            if (typeof onLogin === 'function') {
              onLogin({ profile, formData });
            }
          }, 700); // Tempo de fade out final
        }, 4800); // Duração total do ritual
        
      }, 500);
    };

    // Conteúdos Dinâmicos
    const displayName = getDemoDisplayName(formData) || '';
    const welcomeTitle = displayName
      ? `Bem-vindo(a), ${profile === 'professor' ? 'Prof. ' : ''}${displayName}!`
      : 'Bem-vindo(a) de volta!';

    const ritualTexts = {
      aluno: [
        'Autenticando credenciais...',
        'Sincronizando suas trilhas de estudo...',
        'Carregando o Raio-X de desempenho...',
        'Ambiente pronto. Iniciando sessão...'
      ],
      professor: [
        'Verificando permissões docentes...',
        'Atualizando dados de turmas...',
        'Gerando relatórios preditivos...',
        'Portal preparado. Iniciando sessão...'
      ]
    };

    const studentFeatures = [
      { icon: Activity, title: 'Raio-X', desc: 'Análise de prioridades de estudo.' },
      { icon: Target, title: 'Diagnóstico', desc: 'Avaliação inicial de conhecimentos.' },
      { icon: CalendarDays, title: 'Cronograma', desc: 'Rotinas e metas pré-definidas.' },
      { icon: Brain, title: 'Revisões', desc: 'Retomada inteligente de conteúdos.' }
    ];

    const teacherFeatures = [
      { icon: Bot, title: 'Risco de Evasão', desc: 'Sinais de alerta de alunos.' },
      { icon: LineChart, title: 'Analytics', desc: 'Métricas de desempenho e foco.' },
      { icon: FileQuestion, title: 'Questões', desc: 'Base de dados otimizada.' },
      { icon: LayoutList, title: 'Gestão', desc: 'Planejamento unificado de turmas.' }
    ];

    return (
      <div className="h-[100dvh] w-full bg-[#050505] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* =========================================
          ESTILOS GLOBAIS & ANIMAÇÕES
          ========================================= */}
        <style>{`
          .bg-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.04;
            mix-blend-mode: overlay;
            pointer-events: none;
          }

          /* Fluid Background Animation (Atrás do Widget) */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 12s infinite alternate ease-in-out;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }

          @keyframes springSlideUp {
            0% { opacity: 0; transform: translateY(30px) scale(0.97); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          .animate-spring {
            opacity: 0;
            animation: springSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Loading Bar Animation */
          @keyframes loadingProgress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-progress {
            animation: loadingProgress 4.8s linear forwards;
          }

          ::-webkit-scrollbar { width: 0px; background: transparent; }
        `}</style>

        {/* Camada 1: Ruído de Fundo */}
        <div className="absolute inset-0 z-0 bg-noise"></div>

        {/* Camada 2: Fluid Blobs (Fundo vivo) */}
        <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-[45vw] h-[45vw] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[55vw] h-[55vw] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-blob animation-delay-4000"></div>

        {/* =========================================
          CONTAINER PRINCIPAL (GLASSMORPHISM)
          ========================================= */}
        <div className={`relative z-10 flex h-full max-h-[850px] w-full max-w-[1200px] flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-white/[0.02] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-3xl lg:flex-row transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          {/* LADO ESQUERDO: Branding & Features */}
          <div className="relative hidden w-5/12 flex-col justify-between overflow-hidden border-r border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-10 lg:flex">
            
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10 opacity-50"></div>

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
              
              {/* Texto Padrão (Step 1) */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] absolute inset-0 flex flex-col justify-center ${
                step === 1 && !isTransitioning ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-12 pointer-events-none'
              }`}>
                <h2 className="text-[2.75rem] font-semibold text-white leading-[1.1] tracking-tight mb-6">
                  Inteligência <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    educacional
                  </span>
                </h2>
                <p className="text-lg leading-relaxed text-white/50 max-w-sm">
                  Uma experiência fluida e analítica. Ligue os pontos da sua jornada acadêmica com precisão e tecnologia de ponta.
                </p>
              </div>

              {/* Features do Estudante (Step 2 e 3) */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] absolute inset-0 flex flex-col justify-center ${
                (step === 2 || step === 3) && profile === 'aluno' && !isTransitioning ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
              }`}>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
                    <GraduationCap size={14} /> Espaço do Estudante
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">O seu ecossistema.</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 pr-6">
                  {studentFeatures.map((feat, idx) => (
                    <div key={idx} className={`group flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-colors ${step === 3 ? 'opacity-50' : 'hover:bg-white/[0.04]'}`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.05] group-hover:border-cyan-500/30 transition-colors">
                        <feat.icon size={18} className="text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white/90">{feat.title}</h4>
                        <p className="mt-1 text-[13px] leading-relaxed text-white/50">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features do Professor (Step 2 e 3) */}
              <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] absolute inset-0 flex flex-col justify-center ${
                (step === 2 || step === 3) && profile === 'professor' && !isTransitioning ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-12 pointer-events-none'
              }`}>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-4">
                    <Sparkles size={14} /> Portal do Docente
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Poder analítico.</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 pr-6">
                  {teacherFeatures.map((feat, idx) => (
                    <div key={idx} className={`group flex items-start gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-colors ${step === 3 ? 'opacity-50' : 'hover:bg-white/[0.04]'}`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.05] group-hover:border-blue-500/30 transition-colors">
                        <feat.icon size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white/90">{feat.title}</h4>
                        <p className="mt-1 text-[13px] leading-relaxed text-white/50">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

          {/* LADO DIREITO: Interações dinâmicas */}
          <div className="relative flex w-full flex-col justify-center p-6 sm:p-10 lg:w-7/12 xl:p-16">
            
            <div className="mb-10 flex flex-col items-center justify-center gap-4 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] shadow-inner backdrop-blur-md">
                <BrainCircuit className="text-cyan-400" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Sinapse Educação
              </h1>
            </div>

            <div className="relative mx-auto w-full max-w-[400px] h-[450px]">
              
              {/* ETAPA 1: Seleção de Perfil */}
              <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                step === 1 && !isTransitioning ? 'opacity-100 scale-100 pointer-events-auto z-10' : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}>
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Acessar conta</h2>
                  <p className="text-white/50 text-sm">Selecione o seu perfil para prosseguir para o painel.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleProfileSelect('aluno')}
                    className="group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-cyan-500/40 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] active:scale-[0.98]"
                  >
                    <div className="mr-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] transition-all group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10">
                      <GraduationCap size={24} className="text-white/70 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white/90 group-hover:text-white transition-colors">Sou Estudante</h3>
                      <p className="text-[13px] text-white/40">Acessar trilhas, revisões e métricas.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleProfileSelect('professor')}
                    className="group relative flex items-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-blue-500/40 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] active:scale-[0.98]"
                  >
                    <div className="mr-5 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] transition-all group-hover:scale-110 group-hover:border-blue-500/50 group-hover:bg-blue-500/10">
                      <Sparkles size={24} className="text-white/70 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-white/90 group-hover:text-white transition-colors">Sou Professor</h3>
                      <p className="text-[13px] text-white/40">Gestão de turmas e alertas preditivos.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* ETAPA 2: Formulário de Credenciais */}
              <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                step === 2 && !isTransitioning ? 'opacity-100 translate-y-0 pointer-events-auto z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'
              }`}>
                
                <button 
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="group mb-8 flex w-fit items-center text-[13px] font-medium text-white/40 transition-colors hover:text-white/90 disabled:opacity-50"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 mr-2.5 transition-all group-hover:bg-white/10">
                    <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  Alterar Perfil
                </button>

                <div className="mb-8">
                  <h2 className="text-[1.75rem] font-bold leading-tight text-white mb-2 tracking-tight">
                    {welcomeTitle}
                  </h2>
                  <p className="text-sm text-white/50">Insira suas credenciais para acessar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-white/60 pl-1">Unidade</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 size={18} className="text-white/30" />
                      </div>
                      <select
                        disabled={isSubmitting}
                        className="block w-full cursor-not-allowed appearance-none rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white/50 outline-none transition-all focus:border-white/20 focus:bg-white/10"
                      >
                        <option>Cursinho Popular da Poli-USP</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock size={14} className="text-white/20" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-white/60 pl-1">Usuário</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className={`transition-colors ${profile === 'aluno' ? 'group-focus-within:text-cyan-400 text-white/40' : 'group-focus-within:text-blue-400 text-white/40'}`} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="ex: joao.silva"
                        className={`block w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 disabled:opacity-50 ${profile === 'aluno' ? 'focus:border-cyan-500/50 focus:ring-cyan-500/50' : 'focus:border-blue-500/50 focus:ring-blue-500/50'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between pl-1">
                      <label className="text-[13px] font-medium text-white/60">Senha</label>
                      <a href="#" className={`text-xs font-medium hover:underline disabled:opacity-50 ${profile === 'aluno' ? 'text-cyan-400/80 hover:text-cyan-300' : 'text-blue-400/80 hover:text-blue-300'}`}>Esqueceu a senha?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={`transition-colors ${profile === 'aluno' ? 'group-focus-within:text-cyan-400 text-white/40' : 'group-focus-within:text-blue-400 text-white/40'}`} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        className={`block w-full rounded-2xl border border-white/10 bg-white/5 p-4 pl-12 text-sm text-white outline-none transition-all placeholder:text-white/20 focus:bg-white/[0.07] focus:ring-1 disabled:opacity-50 ${profile === 'aluno' ? 'focus:border-cyan-500/50 focus:ring-cyan-500/50' : 'focus:border-blue-500/50 focus:ring-blue-500/50'}`}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-4 py-4 text-sm font-semibold text-white transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050505] disabled:opacity-90 disabled:cursor-wait active:scale-[0.98] ${
                        profile === 'aluno' 
                          ? 'bg-cyan-500 hover:bg-cyan-400 focus:ring-cyan-500 shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]' 
                          : 'bg-blue-600 hover:bg-blue-500 focus:ring-blue-500 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        Acessar Painel
                        <LogIn size={18} className="ml-1 opacity-80" />
                      </div>
                    </button>
                  </div>
                </form>
              </div>

              {/* ETAPA 3: RITUAL DE CARREGAMENTO */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                step === 3 && !isTransitioning ? 'opacity-100 scale-100 pointer-events-auto z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}>
                
                {/* [LLM-NOTE: WIDGET DE CARREGAMENTO (FORMA)] 
                    IA futura: O usuário mencionou que este elemento (atualmente circular com anéis pulsantes)
                    não deverá ser circular quando ocorrer a integração real de outras telas. 
                    Modifique a estrutura abaixo (como retirar o 'rounded-full' e 'rounded-3xl') de acordo
                    com o novo componente de Loading desejado. */}
                <div className="relative mb-8 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${profile === 'aluno' ? 'bg-cyan-500' : 'bg-blue-500'}`}></div>
                  <div className={`absolute -inset-4 rounded-full border border-dashed opacity-20 animate-[spin_4s_linear_infinite] ${profile === 'aluno' ? 'border-cyan-400' : 'border-blue-400'}`}></div>
                  
                  <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-3xl border backdrop-blur-md shadow-2xl ${
                    profile === 'aluno' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    {profile === 'aluno' ? (
                      <GraduationCap size={42} className="text-cyan-400 animate-pulse" />
                    ) : (
                      <Sparkles size={42} className="text-blue-400 animate-pulse" />
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Preparando ambiente, <br/>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${profile === 'aluno' ? 'from-cyan-400 to-blue-400' : 'from-blue-400 to-indigo-400'}`}>
                    {displayName || 'Usuário'}
                  </span>
                </h2>
                
                {/* Textos dinâmicos do ritual */}
                <div className="h-6 mt-2 mb-8 relative w-full overflow-hidden">
                  {ritualTexts[profile || 'aluno'].map((text, idx) => (
                    <p key={idx} className={`absolute w-full text-sm text-white/50 transition-all duration-500 ${
                      loadingTextIdx === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      {text}
                    </p>
                  ))}
                </div>

                {/* Barra de Progresso Animada */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full animate-progress rounded-full ${
                    profile === 'aluno' ? 'bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]'
                  }`}></div>
                </div>

              </div>

            </div>
            
            <div className={`mt-auto pt-8 text-center text-[10px] font-medium uppercase tracking-widest text-white/30 transition-all duration-700 lg:hidden ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              Tecnologia por Cursinho Popular Poli-USP
            </div>
          </div>
        </div>
      </div>
    );
  }
