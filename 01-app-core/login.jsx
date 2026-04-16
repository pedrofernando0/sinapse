import React, { useState } from 'react';
import { getDemoDisplayName } from '../src/lib/demoSession.js';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Building2,
  LogIn,
  BrainCircuit,
  GraduationCap,
  Sparkles,
  Activity,
  Target,
  CalendarDays,
  Brain,
  Bot,
  LineChart,
  FileQuestion,
  LayoutList
} from 'lucide-react';

export default function App({ onLogin }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    unit: 'Cursinho Popular da Poli-USP'
  });

  const handleProfileSelect = (selectedProfile) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setProfile(selectedProfile);
      setStep(2);
      setIsTransitioning(false);
    }, 400); // Aguarda a animação de saída antes de montar a nova tela
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setProfile(null);
      setIsTransitioning(false);
    }, 400); // Aguarda a animação de saída antes de voltar
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    console.log('--- Tentativa de Login: Sinapse Educação ---');
    console.log('Perfil:', profile);
    console.log('Dados:', formData);
    setIsSubmitting(true);

    try {
      if (typeof onLogin === 'function') {
        await Promise.resolve(onLogin({ profile, formData }));
        return;
      }

      alert('Login realizado com sucesso! Verifique o console.');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Falha ao iniciar sessao no Sinapse.', error);
      setIsSubmitting(false);
    }
  };

  // Dados das Features para animação dinâmica
  const studentFeatures = [
    { icon: Activity, title: 'Raio-X', desc: 'Veja o que mais cai e entre estudando com prioridade.' },
    { icon: Target, title: 'Diagnóstico', desc: 'Entenda seu ponto atual antes de abrir a trilha.' },
    { icon: CalendarDays, title: 'Cronograma', desc: 'Marcos e rotina prontos logo na primeira tela.' },
    { icon: Brain, title: 'Revisões', desc: 'Retome o que vence hoje sem perder tempo procurando.' }
  ];

  const teacherFeatures = [
    { icon: Bot, title: 'Risco de Evasão', desc: 'Sinais de atenção já entram no radar da abertura.' },
    { icon: LineChart, title: 'Analytics', desc: 'Média, frequência e engajamento sem navegação extra.' },
    { icon: FileQuestion, title: 'Questões', desc: 'Conteúdo assistido para acelerar preparação docente.' },
    { icon: LayoutList, title: 'Gestão', desc: 'Planejamento e acompanhamento em uma mesma entrada.' }
  ];
  const displayName = getDemoDisplayName(formData);
  const welcomeTitle = displayName
    ? `Bem-vinda de volta, ${profile === 'professor' ? 'Prof. ' : ''}${displayName}!`
    : 'Bem-vindo de volta!';

  return (
    <div className="h-[100dvh] bg-slate-950 flex items-center justify-center p-3 sm:p-4 lg:p-6 font-sans overflow-hidden relative">
      
      {/* Estilos Globais de Animação em Cascata */}
      <style>{`
        @keyframes featureReveal {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-feature {
          opacity: 1;
          animation: featureReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-feature {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Efeitos de Fundo (Sinapses/Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-duration:10000ms]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Container Principal Split-Screen */}
      <div className="relative z-10 flex h-full max-h-[880px] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-slate-700/50 bg-slate-900/60 shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl lg:flex-row">
        
        {/* ================= LADO ESQUERDO (Branding & Features) ================= */}
        <div className="relative hidden w-5/12 overflow-hidden border-r border-slate-700/50 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 xl:flex xl:p-9">
          {/* Efeito de malha/grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 flex h-full flex-1 flex-col">
            {/* Logo Sempre Visível e Intacta (Fica de fora da transição) */}
            <div className="mb-7 flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <BrainCircuit className="text-cyan-400" size={28} />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                Sinapse Educação
              </h1>
            </div>
            
            {/* Conteúdo Dinâmico com Efeito Blur/Fade nas trocas */}
            <div className={`flex-1 flex flex-col justify-center transition-all duration-500 ease-in-out transform ${
              isTransitioning ? 'opacity-0 -translate-x-8 blur-md' : 'opacity-100 translate-x-0 blur-0'
            }`}>
              
              {step === 1 && (
                <>
                  <h2 className="animate-feature text-4xl font-semibold text-white leading-tight xl:text-[3.25rem]" style={{ animationDelay: '100ms' }}>
                    Conectando mentes,<br/>transformando o futuro.
                  </h2>
                  <p className="animate-feature mt-4 max-w-md text-base leading-relaxed text-slate-400" style={{ animationDelay: '250ms' }}>
                    A plataforma definitiva de inteligência educacional. Potencialize seus resultados com dados e tecnologia.
                  </p>
                </>
              )}

              {step === 2 && profile === 'aluno' && (
                <div className="space-y-4">
                  <div className="animate-feature mb-2" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <GraduationCap className="text-cyan-400" size={24} />
                      Ecossistema do Aluno
                    </h2>
                    <p className="text-slate-400 text-sm">Tecnologia a favor da sua aprovação.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {studentFeatures.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="animate-feature rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 transition-colors hover:border-cyan-500/30"
                        style={{ animationDelay: `${220 + (idx * 90)}ms` }}
                      >
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                          <feat.icon size={16} className="text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{feat.title}</h4>
                          <p className="mt-1 text-xs leading-snug text-slate-400">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && profile === 'professor' && (
                <div className="space-y-4">
                  <div className="animate-feature mb-2" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="text-blue-400" size={24} />
                      Portal do Mestre
                    </h2>
                    <p className="text-slate-400 text-sm">Poder analítico em suas mãos.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {teacherFeatures.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="animate-feature rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 transition-colors hover:border-blue-500/30"
                        style={{ animationDelay: `${220 + (idx * 90)}ms` }}
                      >
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900">
                          <feat.icon size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{feat.title}</h4>
                          <p className="mt-1 text-xs leading-snug text-slate-400">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé Dinâmico - Some de forma suave na troca */}
            <div className={`mt-8 transition-all duration-500 delay-300 ${isTransitioning || step !== 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/50 p-3 backdrop-blur-md">
                <div className="bg-slate-800 p-2 rounded-lg">
                  <Building2 size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Desenvolvido por</p>
                  <p className="text-sm text-white font-medium">Cursinho Popular da Poli-USP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LADO DIREITO (Auth Flow) ================= */}
        <div className="relative flex w-full flex-col justify-center bg-slate-900/40 p-6 sm:p-7 lg:w-7/12 lg:p-8 xl:p-9">
          
          {/* Cabeçalho Mobile */}
          <div className="mb-6 flex flex-col items-center justify-center gap-3 lg:hidden">
             <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <BrainCircuit className="text-cyan-400" size={32} />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Sinapse Educação
              </h1>
          </div>

          {/* Wrapper com fade in/out suave nas trocas */}
          <div className={`relative mx-auto flex h-full w-full max-w-[28rem] flex-col justify-center transition-all duration-500 ease-in-out transform ${
            isTransitioning ? 'opacity-0 translate-x-8 blur-md' : 'opacity-100 translate-x-0 blur-0'
          }`}>
            
            {/* Etapa 1: Seleção de Perfil */}
            {step === 1 && (
              <div>
                <div className="animate-feature mb-8 text-center lg:text-left" style={{ animationDelay: '100ms' }}>
                  <h2 className="text-3xl font-bold text-white mb-3">Acesse sua conta</h2>
                  <p className="text-slate-400">Selecione seu perfil para iniciar a sessão.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleProfileSelect('aluno')}
                    disabled={isSubmitting}
                    className="animate-feature group relative flex items-center overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/50 p-5 text-left transition-all duration-300 hover:bg-slate-800/80 hover:border-cyan-500/50"
                    style={{ animationDelay: '250ms' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="mr-5 rounded-full border border-slate-700 bg-slate-900 p-3.5 transition-all group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] z-10">
                      <GraduationCap size={24} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-cyan-300">Sou Aluno</h3>
                      <p className="text-sm text-slate-400">Entrar com trilha, revisões e simulados prontos.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleProfileSelect('professor')}
                    disabled={isSubmitting}
                    className="animate-feature group relative flex items-center overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-950/50 p-5 text-left transition-all duration-300 hover:bg-slate-800/80 hover:border-blue-500/50"
                    style={{ animationDelay: '400ms' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="mr-5 rounded-full border border-slate-700 bg-slate-900 p-3.5 transition-all group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] z-10">
                      <Sparkles size={24} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-blue-300">Sou Professor</h3>
                      <p className="text-sm text-slate-400">Abrir turma, alertas e dados sem atrito.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Etapa 2: Credenciais */}
            {step === 2 && (
              <div>
                <button 
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="animate-feature group mb-6 flex w-fit items-center text-sm font-medium text-slate-400 transition-colors hover:text-white"
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="p-1.5 rounded-full bg-slate-800 mr-2 group-hover:bg-slate-700 border border-slate-700 group-hover:border-slate-500 transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  Trocar Perfil
                </button>

                <div className="animate-feature mb-6" style={{ animationDelay: '200ms' }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    {profile === 'aluno' ? <GraduationCap size={14} className="text-cyan-400"/> : <Sparkles size={14} className="text-blue-400"/>}
                    Acesso {profile}
                  </div>
                  <h2 className="text-[1.8rem] font-bold leading-tight text-white mb-2">
                    {welcomeTitle}
                  </h2>
                  <p className="text-sm text-slate-400">Insira suas credenciais para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="animate-feature space-y-2" style={{ animationDelay: '300ms' }}>
                    <label className="text-sm font-medium text-slate-300">Unidade Vinculada</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 size={18} className={`text-slate-500 transition-colors ${profile === 'aluno' ? 'group-focus-within:text-cyan-400' : 'group-focus-within:text-blue-400'}`} />
                      </div>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={`block w-full cursor-not-allowed appearance-none rounded-xl border border-slate-700 bg-slate-950/50 p-3 pl-12 text-sm text-slate-300 opacity-80 outline-none transition-all focus:ring-1 ${profile === 'aluno' ? 'focus:border-cyan-500 focus:ring-cyan-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                        title="Unidade fixa"
                      >
                        <option value="Cursinho Popular da Poli-USP">Cursinho Popular da Poli-USP</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock size={14} className="text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="animate-feature space-y-2" style={{ animationDelay: '400ms' }}>
                    <label className="text-sm font-medium text-slate-300">Usuário</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className={`text-slate-500 transition-colors ${profile === 'aluno' ? 'group-focus-within:text-cyan-400' : 'group-focus-within:text-blue-400'}`} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="Digite seu usuário"
                        className={`block w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 pl-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:ring-1 ${profile === 'aluno' ? 'focus:border-cyan-500 focus:ring-cyan-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                    </div>
                  </div>

                  <div className="animate-feature space-y-2" style={{ animationDelay: '500ms' }}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-300">Senha</label>
                      <a href="#" className={`text-xs hover:underline ${profile === 'aluno' ? 'text-cyan-400' : 'text-blue-400'}`}>Esqueceu a senha?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className={`text-slate-500 transition-colors ${profile === 'aluno' ? 'group-focus-within:text-cyan-400' : 'group-focus-within:text-blue-400'}`} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="••••••••"
                        className={`block w-full rounded-xl border border-slate-700 bg-slate-950/80 p-3 pl-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:ring-1 ${profile === 'aluno' ? 'focus:border-cyan-500 focus:ring-cyan-500' : 'focus:border-blue-500 focus:ring-blue-500'}`}
                      />
                    </div>
                  </div>

                  <div className="animate-feature pt-2" style={{ animationDelay: '600ms' }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 hover:-translate-y-0.5 ${
                        profile === 'aluno' 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 shadow-cyan-500/20 hover:shadow-cyan-500/40 focus:ring-cyan-500' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-500/20 hover:shadow-blue-500/40 focus:ring-blue-500'
                      }`}
                    >
                      {isSubmitting ? 'Preparando sua entrada...' : 'Entrar no Sinapse'}
                      <LogIn size={18} />
                    </button>
                    <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-500">
                      O Sinapse prepara um ritual de entrada com contexto do seu perfil antes de abrir o painel.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Rodapé Mobile */}
        <div className={`mt-6 text-center text-[11px] font-medium uppercase tracking-widest text-slate-500 transition-all duration-500 lg:hidden ${isTransitioning || step !== 1 ? 'opacity-0' : 'opacity-100 delay-300'}`}>
          Desenvolvido por Cursinho Popular Poli-USP
        </div>
      </div>
      </div>
    </div>
  );
}
