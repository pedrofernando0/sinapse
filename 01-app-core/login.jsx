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
  BookMarked,
  Brain,
  BarChart3,
  Bot,
  LineChart,
  FileQuestion,
  LayoutList
} from 'lucide-react';

export default function App({ onLogin }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('--- Tentativa de Login: Sinapse Educação ---');
    console.log('Perfil:', profile);
    console.log('Dados:', formData);
    if (typeof onLogin === 'function') {
      onLogin({ profile, formData });
      return;
    }
    alert('Login realizado com sucesso! Verifique o console.');
  };

  // Dados das Features para animação dinâmica
  const studentFeatures = [
    { icon: Activity, title: 'Raio-X de Incidência', desc: 'O que mais cai em cada vestibular com base em Big Data.' },
    { icon: Target, title: 'Diagnóstico de Nivelamento', desc: 'Avalie sua proficiência atual e adapte seu cronograma.' },
    { icon: CalendarDays, title: 'Cronograma & Marcos', desc: 'Rotina semanal e datas estratégicas dos vestibulares.' },
    { icon: BookMarked, title: 'Leituras Obrigatórias', desc: 'Acompanhe seu progresso nas obras literárias da FUVEST.' },
    { icon: Brain, title: 'Revisões Espaçadas', desc: 'A curva do esquecimento não perdoa. Mantenha-se em dia.' },
    { icon: BarChart3, title: 'Simulados & Métricas', desc: 'Desempenho histórico e análise de vulnerabilidades.' }
  ];

  const teacherFeatures = [
    { icon: Bot, title: 'IA de Prevenção de Evasão', desc: 'Mapeamento preditivo de alunos que estão com risco de evasão.' },
    { icon: LineChart, title: 'Analytics de Turmas', desc: 'Média de simulados, controle de frequência e engajamento.' },
    { icon: FileQuestion, title: 'Criador de Questões', desc: 'Geração inteligente de conteúdo para otimizar seu tempo.' },
    { icon: LayoutList, title: 'Gestão Completa', desc: 'Listas de exercício, simulados e planos de aula unificados.' }
  ];
  const displayName = getDemoDisplayName(formData);
  const welcomeTitle = displayName
    ? `Bem-vinda de volta, ${profile === 'professor' ? 'Prof. ' : ''}${displayName}!`
    : 'Bem-vindo de volta!';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 font-sans overflow-hidden relative">
      
      {/* Estilos Globais de Animação em Cascata */}
      <style>{`
        @keyframes featureReveal {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-feature {
          opacity: 0;
          animation: featureReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Efeitos de Fundo (Sinapses/Glow) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-duration:10000ms]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Container Principal Split-Screen */}
      <div className="relative z-10 w-full max-w-6xl bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden min-h-[650px]">
        
        {/* ================= LADO ESQUERDO (Branding & Features) ================= */}
        <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 border-r border-slate-700/50 p-10 xl:p-12 flex-col relative overflow-hidden">
          {/* Efeito de malha/grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Logo Sempre Visível e Intacta (Fica de fora da transição) */}
            <div className="flex items-center gap-3 mb-10">
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
                  <h2 className="animate-feature text-4xl xl:text-5xl font-semibold text-white leading-tight mb-6" style={{ animationDelay: '100ms' }}>
                    Conectando mentes,<br/>transformando o futuro.
                  </h2>
                  <p className="animate-feature text-slate-400 text-lg leading-relaxed" style={{ animationDelay: '250ms' }}>
                    A plataforma definitiva de inteligência educacional. Potencialize seus resultados com dados e tecnologia.
                  </p>
                </>
              )}

              {step === 2 && profile === 'aluno' && (
                <div className="space-y-4">
                  <div className="animate-feature mb-6" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <GraduationCap className="text-cyan-400" size={24} />
                      Ecossistema do Aluno
                    </h2>
                    <p className="text-slate-400 text-sm">Tecnologia a favor da sua aprovação.</p>
                  </div>
                  <div className="space-y-3">
                    {studentFeatures.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="animate-feature flex gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-colors"
                        style={{ animationDelay: `${250 + (idx * 100)}ms` }}
                      >
                        <div className="mt-0.5 p-2 bg-slate-900 rounded-lg h-fit border border-slate-700">
                          <feat.icon size={16} className="text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{feat.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-snug">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && profile === 'professor' && (
                <div className="space-y-4">
                  <div className="animate-feature mb-6" style={{ animationDelay: '100ms' }}>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Sparkles className="text-blue-400" size={24} />
                      Portal do Mestre
                    </h2>
                    <p className="text-slate-400 text-sm">Poder analítico em suas mãos.</p>
                  </div>
                  <div className="space-y-3">
                    {teacherFeatures.map((feat, idx) => (
                      <div 
                        key={idx} 
                        className="animate-feature flex gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-colors"
                        style={{ animationDelay: `${250 + (idx * 150)}ms` }}
                      >
                        <div className="mt-0.5 p-2 bg-slate-900 rounded-lg h-fit border border-slate-700">
                          <feat.icon size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-200">{feat.title}</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-snug">{feat.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rodapé Dinâmico - Some de forma suave na troca */}
            <div className={`mt-12 transition-all duration-500 delay-300 ${isTransitioning || step !== 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <div className="inline-flex items-center gap-3 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-700/50 backdrop-blur-md">
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
        <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-slate-900/40">
          
          {/* Cabeçalho Mobile */}
          <div className="lg:hidden flex flex-col items-center justify-center gap-3 mb-10">
             <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <BrainCircuit className="text-cyan-400" size={32} />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Sinapse Educação
              </h1>
          </div>

          {/* Wrapper com fade in/out suave nas trocas */}
          <div className={`w-full max-w-md mx-auto relative h-full flex flex-col justify-center transition-all duration-500 ease-in-out transform ${
            isTransitioning ? 'opacity-0 translate-x-8 blur-md' : 'opacity-100 translate-x-0 blur-0'
          }`}>
            
            {/* Etapa 1: Seleção de Perfil */}
            {step === 1 && (
              <div>
                <div className="animate-feature mb-10 text-center lg:text-left" style={{ animationDelay: '100ms' }}>
                  <h2 className="text-3xl font-bold text-white mb-3">Acesse sua conta</h2>
                  <p className="text-slate-400">Selecione seu perfil para iniciar a sessão.</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleProfileSelect('aluno')}
                    className="animate-feature group relative flex items-center p-6 bg-slate-950/50 hover:bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 overflow-hidden text-left"
                    style={{ animationDelay: '250ms' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="p-4 bg-slate-900 rounded-full border border-slate-700 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all mr-6 z-10">
                      <GraduationCap size={28} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-cyan-300 transition-colors">Sou Aluno</h3>
                      <p className="text-sm text-slate-400">Acessar trilhas, materiais e simulados</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleProfileSelect('professor')}
                    className="animate-feature group relative flex items-center p-6 bg-slate-950/50 hover:bg-slate-800/80 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl transition-all duration-300 overflow-hidden text-left"
                    style={{ animationDelay: '400ms' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="p-4 bg-slate-900 rounded-full border border-slate-700 group-hover:border-blue-500/30 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all mr-6 z-10">
                      <Sparkles size={28} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <div className="z-10">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">Sou Professor</h3>
                      <p className="text-sm text-slate-400">Gerenciar turmas e inteligência de dados</p>
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
                  className="animate-feature flex items-center w-fit text-sm font-medium text-slate-400 hover:text-white mb-8 transition-colors group"
                  style={{ animationDelay: '100ms' }}
                >
                  <div className="p-1.5 rounded-full bg-slate-800 mr-2 group-hover:bg-slate-700 border border-slate-700 group-hover:border-slate-500 transition-all">
                    <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                  Trocar Perfil
                </button>

                <div className="animate-feature mb-8" style={{ animationDelay: '200ms' }}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-4">
                    {profile === 'aluno' ? <GraduationCap size={14} className="text-cyan-400"/> : <Sparkles size={14} className="text-blue-400"/>}
                    Acesso {profile}
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {welcomeTitle}
                  </h2>
                  <p className="text-slate-400">Insira suas credenciais para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        className={`w-full bg-slate-950/50 border border-slate-700 text-slate-300 text-sm rounded-xl focus:ring-1 block pl-12 p-3.5 appearance-none cursor-not-allowed opacity-80 transition-all outline-none ${profile === 'aluno' ? 'focus:ring-cyan-500 focus:border-cyan-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
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
                        placeholder="Digite seu usuário"
                        className={`w-full bg-slate-950/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-1 block pl-12 p-3.5 placeholder-slate-600 transition-all outline-none ${profile === 'aluno' ? 'focus:ring-cyan-500 focus:border-cyan-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
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
                        placeholder="••••••••"
                        className={`w-full bg-slate-950/80 border border-slate-700 text-white text-sm rounded-xl focus:ring-1 block pl-12 p-3.5 placeholder-slate-600 transition-all outline-none ${profile === 'aluno' ? 'focus:ring-cyan-500 focus:border-cyan-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                      />
                    </div>
                  </div>

                  <div className="animate-feature pt-4" style={{ animationDelay: '600ms' }}>
                    <button
                      type="submit"
                      className={`w-full flex justify-center items-center gap-2 py-4 px-4 rounded-xl text-sm font-semibold text-white shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                        profile === 'aluno' 
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 shadow-cyan-500/20 hover:shadow-cyan-500/40 focus:ring-cyan-500' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 shadow-blue-500/20 hover:shadow-blue-500/40 focus:ring-blue-500'
                      }`}
                    >
                      Entrar no Sinapse
                      <LogIn size={18} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          {/* Rodapé Mobile */}
          <div className={`lg:hidden mt-12 text-center text-slate-500 text-xs font-medium uppercase tracking-widest transition-all duration-500 ${isTransitioning || step !== 1 ? 'opacity-0' : 'opacity-100 delay-300'}`}>
            Desenvolvido por Cursinho Popular Poli-USP
          </div>
        </div>
      </div>
    </div>
  );
}
