import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { 
  Home, Activity, Calendar, Clock, BookOpen, RotateCcw, 
  CheckSquare, TrendingUp, Menu, Bell, Zap, Play, Search,
  CheckCircle2, AlertCircle, Clock3, ChevronRight, BookMarked,
  Target, Pause, Square, Settings, Maximize, Minimize, Brain, 
  Coffee, ListPlus, Award, Plus
} from 'lucide-react';

// ============================================================================
// 1. DADOS MOCKADOS
// ============================================================================

const mockDashboard = {
  kpis: { coursesCompleted: 36, testsCompleted: 17, totalHours: 124, currentStreak: 5 },
  courseProgress: [
    { id: 'raio-x', icon: Search, name: 'Raio-X de Conteúdos', hoursSpent: 12, progress: 85, status: 'active' },
    { id: 'diagnostico', icon: Activity, name: 'Diagnóstico Pessoal', hoursSpent: 8, progress: 60, status: 'active' },
    { id: 'calendario', icon: Calendar, name: 'Marcos Estratégicos', hoursSpent: 2, progress: 100, status: 'done' },
    { id: 'cronograma', icon: Clock, name: 'Cronograma Semanal', hoursSpent: 15, progress: 45, status: 'active' },
  ]
};

const timelineData = [
  { period: '13–24 abr 2026', event: 'ENEM: Isenção de taxa', date: '2026-04-13', status: 'past' },
  { period: 'Maio 2026', event: 'ENEM: Inscrições', date: '2026-05-15', status: 'current' },
  { period: 'Jun–Jul 2026', event: 'Revisão do 1º ciclo', date: '2026-06-01', status: 'future' },
  { period: '17 ago – 9 out 2026', event: 'FUVEST: Inscrições', date: '2026-08-17', status: 'future' },
];

const raioXData = {
  enem: {
    id: 'enem',
    title: 'ENEM',
    source: 'Dados compilados via Aprova Total (Raio-X ENEM 2024) e Estratégia Vestibulares.',
    subjects: [
      { name: 'Matemática', high: 'Matemática Básica, Estatística, Geometria Espacial', med: 'Funções, Geometria Plana, Probabilidade', reg: 'Geometria Analítica, Análise Combinatória' },
      { name: 'Linguagens', high: 'Interpretação de Texto, Gêneros Textuais, Variação Linguística', med: 'Funções da Linguagem, Figuras de Linguagem', reg: 'Arte Contemporânea, Literatura Moderna' },
      { name: 'Biologia', high: 'Ecologia, Fisiologia Humana e Citologia', med: 'Genética, Bioenergética', reg: 'Evolução, Zoologia' },
    ]
  },
  fuvest: {
    id: 'fuvest',
    title: 'FUVEST (USP)',
    source: 'Dados baseados nas estatísticas do Poliedro (últimos 10 anos) e SAS Educação.',
    subjects: [
      { name: 'Matemática', high: 'Geometria Plana e Espacial, Funções', med: 'Geometria Analítica, Análise Combinatória', reg: 'Matrizes, Polinômios' },
      { name: 'Português', high: 'Literatura Brasileira (Obras Obrigatórias), Interpretação Crítica', med: 'Sintaxe, Movimentos Literários', reg: 'Ortografia' },
      { name: 'Biologia', high: 'Ecologia, Genética Clássica, Fisiologia', med: 'Botânica, Zoologia, Evolução', reg: 'Imunologia' },
    ]
  }
};

const booksData = [
  { id: 1, title: 'Opúsculo Humanitário', author: 'Nísia Floresta', year: 1853, deadline: 'Abr–Mai', progress: 100 },
  { id: 2, title: 'Nebulosas', author: 'Narcisa Amália', year: 1872, deadline: 'Mai', progress: 45 },
  { id: 3, title: 'Memórias de Martha', author: 'Julia Lopes de Almeida', year: 1899, deadline: 'Jun', progress: 10 },
  { id: 4, title: 'Caminho de pedras', author: 'Rachel de Queiroz', year: 1937, deadline: 'Jun–Jul', progress: 0 },
];

const revisoesData = [
  { id: 1, subject: 'Matemática', topic: 'Geometria Espacial', status: 'pending', date: 'Hoje' },
  { id: 2, subject: 'Biologia', topic: 'Ecologia (Relações)', status: 'done', date: 'Ontem' },
  { id: 3, subject: 'Química', topic: 'Estequiometria', status: 'late', date: '12 Abr' },
  { id: 4, subject: 'Física', topic: 'Eletrodinâmica', status: 'pending', date: 'Amanhã' },
];

const simuladosData = [
  { id: 1, name: 'ENEM 2024 - Dia 1', date: '15 Fev 2026', acertos: 72, total: 90, level: 'good', time: '4h 15m' },
  { id: 2, name: 'ENEM 2024 - Dia 2', date: '22 Fev 2026', acertos: 60, total: 90, level: 'average', time: '4h 50m' },
  { id: 3, name: 'FUVEST 2025 - 1ª Fase', date: '08 Mar 2026', acertos: 51, total: 90, level: 'average', time: '4h 00m' },
];

const diagnosticData = [
  { area: 'Matemática e Suas Tecnologias', topics: ['Matemática Básica', 'Funções', 'Geometria Plana', 'Estatística e Probabilidade'] },
  { area: 'Ciências da Natureza', topics: ['Mecânica', 'Eletrodinâmica', 'Química Geral', 'Fisiologia Humana'] }
];

const scheduleData = {
  days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  slots: [
    { time: '07:30 - 09:00', seg: { subject: 'Física', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'História', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Química', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', color: 'bg-teal-100 text-teal-700' } },
    { time: '09:00 - 10:30', seg: { subject: 'Física', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'Geografia', color: 'bg-orange-100 text-orange-700' }, qui: { subject: 'Química', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', color: 'bg-teal-100 text-teal-700' } },
    { time: '10:30 - 11:00', seg: { subject: 'Intervalo', color: 'bg-slate-100 text-slate-500' }, ter: { subject: 'Intervalo', color: 'bg-slate-100 text-slate-500' }, qua: { subject: 'Intervalo', color: 'bg-slate-100 text-slate-500' }, qui: { subject: 'Intervalo', color: 'bg-slate-100 text-slate-500' }, sex: { subject: 'Intervalo', color: 'bg-slate-100 text-slate-500' } },
    { time: '11:00 - 12:30', seg: { subject: 'Estudo: Listas', color: 'bg-slate-800 text-white' }, ter: { subject: 'Redação', color: 'bg-pink-100 text-pink-700' }, qua: { subject: 'Filosofia', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Literatura', color: 'bg-pink-100 text-pink-700' }, sex: { subject: 'Estudo: Simulado', color: 'bg-slate-800 text-white' } },
  ]
};

// ============================================================================
// 2. CONTEXTO GLOBAL E ESTADO
// ============================================================================

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Diogo Medrado', turma: 'Extensivo', xp: 1250, level: 12 });

  const navigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const addXp = (amount) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1; // Lógica simples: 100 XP por level
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  return (
    <AppContext.Provider value={{ currentView, navigate, sidebarOpen, setSidebarOpen, user, addXp }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// ============================================================================
// 3. COMPONENTES UI REUTILIZÁVEIS
// ============================================================================

const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ progress, colorClass = 'bg-blue-500' }) => (
  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
      style={{ width: `${progress}%` }} 
    />
  </div>
);

// ============================================================================
// 4. VIEWS DA APLICAÇÃO
// ============================================================================

// --- NOVA VIEW: POMODORO FOCUS ---
export const PomodoroFocusView = ({ addXp: externalAddXp }) => {
  const app = useApp();
  const addXp = externalAddXp ?? app?.addXp ?? (() => {});
  
  const [settings, setSettings] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [mode, setMode] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  
  const [zenMode, setZenMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  
  const [studyLog, setStudyLog] = useState('');
  const [history, setHistory] = useState([
    { id: 1, date: '10:00', subject: 'Matemática Básica', type: 'focus', duration: 25, xp: 25 }
  ]);

  const timerRef = useRef(null);

  // Inicializa o tempo quando o modo ou configurações mudam
  useEffect(() => {
    setTimeLeft(settings[mode] * 60);
    setIsActive(false);
  }, [mode, settings]);

  // Lógica principal do Timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    // Feedback visual em vez de som forçado
    setFlashScreen(true);
    setTimeout(() => setFlashScreen(false), 2000);

    if (mode === 'focus') {
      setShowLogModal(true);
    } else {
      setMode('focus');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const saveSession = (e) => {
    e.preventDefault();
    if (!studyLog.trim()) return;

    const xpGained = 25;
    addXp(xpGained);
    
    setHistory(prev => [{
      id: Date.now(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: studyLog,
      type: 'focus',
      duration: settings.focus,
      xp: xpGained
    }, ...prev]);

    setStudyLog('');
    setShowLogModal(false);
    setMode('shortBreak');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Cálculos do SVG
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = settings[mode] * 60;
  const percent = (timeLeft / totalSeconds) * 100;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const modeColors = {
    focus: { bg: 'bg-orange-500', text: 'text-orange-500', stroke: '#f97316', flash: 'bg-orange-500/20' },
    shortBreak: { bg: 'bg-teal-500', text: 'text-teal-500', stroke: '#14b8a6', flash: 'bg-teal-500/20' },
    longBreak: { bg: 'bg-blue-500', text: 'text-blue-500', stroke: '#3b82f6', flash: 'bg-blue-500/20' }
  };

  const currentColors = modeColors[mode];

  const MainContainer = ({ children }) => {
    if (zenMode) {
      return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500">
          {/* Fundo de notificação visual piscante */}
          {flashScreen && <div className={`absolute inset-0 z-0 animate-pulse ${currentColors.flash}`} />}
          <div className="z-10 w-full max-w-xl p-8 relative flex flex-col items-center">
            <button 
              onClick={() => setZenMode(false)}
              className="absolute top-0 right-4 text-slate-400 hover:text-white p-2 flex items-center gap-2"
            >
              <Minimize size={20} />
              <span className="text-sm font-bold">Sair do Modo Zen</span>
            </button>
            {children}
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-6 max-w-4xl mx-auto relative">
        {flashScreen && <div className={`fixed inset-0 z-50 pointer-events-none animate-pulse ${currentColors.flash}`} />}
        {children}
      </div>
    );
  };

  return (
    <MainContainer>
      
      {!zenMode && (
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Foco Profundo</h2>
            <p className="text-slate-500 mt-1">Sessões de Pomodoro com registro de XP.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowSettings(true)} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={() => setZenMode(true)} className="p-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold">
              <Maximize size={20} />
              <span className="hidden sm:inline">Modo Zen</span>
            </button>
          </div>
        </div>
      )}

      {/* Container Central do Timer */}
      <div className={`flex flex-col items-center ${zenMode ? 'text-white' : 'text-slate-800'}`}>
        
        {/* Seletor de Modo */}
        <div className={`flex gap-2 p-1.5 rounded-full mb-10 ${zenMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {[
            { id: 'focus', label: 'Foco', icon: Brain },
            { id: 'shortBreak', label: 'Pausa Curta', icon: Coffee },
            { id: 'longBreak', label: 'Pausa Longa', icon: Coffee }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                mode === m.id 
                  ? `${currentColors.bg} text-white shadow-md` 
                  : `${zenMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`
              }`}
            >
              <m.icon size={16} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Círculo do Timer Animado */}
        <div className="relative flex items-center justify-center mb-10">
          <svg width="320" height="320" className="transform -rotate-90">
            {/* Background Circle */}
            <circle 
              cx="160" cy="160" r={radius} 
              stroke={zenMode ? '#1e293b' : '#e2e8f0'} 
              strokeWidth="12" fill="transparent" 
            />
            {/* Progress Circle */}
            <circle 
              cx="160" cy="160" r={radius} 
              stroke={currentColors.stroke} 
              strokeWidth="12" 
              fill="transparent" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center text-center">
            <div className={`text-6xl sm:text-7xl font-black font-mono tracking-tighter ${zenMode ? 'text-white' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`text-sm font-bold uppercase tracking-widest mt-2 ${currentColors.text}`}>
              {mode === 'focus' ? 'Em Foco' : 'Descansando'}
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTimer}
            className={`w-20 h-20 flex items-center justify-center rounded-full text-white shadow-lg shadow-${currentColors.bg}/30 hover:scale-105 transition-all ${currentColors.bg}`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
          </button>
          <button 
            onClick={resetTimer}
            className={`w-14 h-14 flex items-center justify-center rounded-full border-2 transition-all ${
              zenMode ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500' : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
            }`}
          >
            <Square size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Histórico (Apenas fora do modo Zen) */}
      {!zenMode && (
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Sessões de Hoje</h3>
            <span className="text-sm font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
              {history.length} ciclos
            </span>
          </div>
          
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 font-medium">
                Nenhum ciclo concluído ainda hoje.
              </div>
            ) : (
              history.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.subject}</p>
                      <p className="text-xs text-slate-500 font-medium">{item.date} • {item.duration} minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-lg">
                    <Award size={16} />
                    +{item.xp} XP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal de Registro de Sessão (Aparece ao terminar um Foco) */}
      {showLogModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-2">Foco Concluído!</h3>
            <p className="text-center text-slate-500 mb-6">Excelente trabalho. O que você estudou nestes últimos {settings.focus} minutos?</p>
            
            <form onSubmit={saveSession}>
              <input 
                type="text" 
                autoFocus
                placeholder="Ex: Exercícios de Estequiometria" 
                className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 mb-6"
                value={studyLog}
                onChange={(e) => setStudyLog(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!studyLog.trim()}
                className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Salvar & Ganhar +25 XP
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Configurações */}
      {showSettings && (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Configurações do Pomodoro</h3>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Tempo de Foco (min)</span>
                  <span className="text-orange-500">{settings.focus}</span>
                </label>
                <input type="range" min="5" max="60" step="5" value={settings.focus} onChange={(e) => setSettings({...settings, focus: Number(e.target.value)})} className="w-full accent-orange-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Pausa Curta (min)</span>
                  <span className="text-teal-500">{settings.shortBreak}</span>
                </label>
                <input type="range" min="1" max="15" step="1" value={settings.shortBreak} onChange={(e) => setSettings({...settings, shortBreak: Number(e.target.value)})} className="w-full accent-teal-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>Pausa Longa (min)</span>
                  <span className="text-blue-500">{settings.longBreak}</span>
                </label>
                <input type="range" min="10" max="45" step="5" value={settings.longBreak} onChange={(e) => setSettings({...settings, longBreak: Number(e.target.value)})} className="w-full accent-blue-500" />
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      )}
    </MainContainer>
  );
};

// --- VIEWS EXISTENTES RESTRUTURADAS ---

const DashboardView = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-lg">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-blue-200 uppercase bg-blue-500/20 rounded-full backdrop-blur-md border border-blue-400/20">
            Sprint 20.5
          </span>
          <h2 className="text-3xl font-bold mb-2">Bom dia, {user.name.split(' ')[0]}!</h2>
          <p className="text-blue-100/80 mb-6 line-clamp-2">
            Faltam 206 dias para o ENEM. Seu foco hoje é Matemática Básica e revisão de Biologia.
          </p>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">ENEM</p>
              <p className="text-3xl font-black">206 <span className="text-sm font-normal text-blue-200">dias</span></p>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div>
              <p className="text-xs text-orange-300 font-semibold uppercase tracking-wider mb-1">FUVEST</p>
              <p className="text-3xl font-black">213 <span className="text-sm font-normal text-orange-200">dias</span></p>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 right-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Horas Estudadas', value: mockDashboard.kpis.totalHours, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Ofensiva Atual', value: `${mockDashboard.kpis.currentStreak} dias`, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Módulos', value: mockDashboard.kpis.coursesCompleted, icon: CheckSquare, color: 'text-teal-500', bg: 'bg-teal-50' },
          { label: 'Simulados', value: mockDashboard.kpis.testsCompleted, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        ].map((kpi, idx) => (
          <Card key={idx} className="flex items-center gap-4 p-5 hover:-translate-y-1 transition-transform cursor-default">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl font-bold text-slate-800">{kpi.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Seu Progresso</h3>
          <button className="text-sm font-semibold text-blue-500 hover:text-blue-600">Ver tudo</button>
        </div>
        <div className="space-y-4">
          {mockDashboard.courseProgress.map((course) => (
            <div key={course.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
              <div className={`p-3 rounded-xl ${course.status === 'done' ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
                <course.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">{course.name}</p>
                <ProgressBar progress={course.progress} colorClass={course.status === 'done' ? 'bg-teal-500' : 'bg-blue-500'} />
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-slate-800">{course.progress}%</p>
                <p className="text-xs text-slate-500">{course.hoursSpent}h</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const TimelineView = () => (
  <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Marcos Estratégicos</h2>
      <p className="text-slate-500 text-sm mb-8">Acompanhe as datas importantes dos vestibulares.</p>
      
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
        {timelineData.map((item, idx) => {
          const isPast = item.status === 'past';
          const isCurrent = item.status === 'current';
          return (
            <div key={idx} className="relative pl-8">
              <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${isPast ? 'bg-slate-400' : isCurrent ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-blue-500'}`} />
              <div className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${isCurrent ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isPast ? 'bg-slate-100 text-slate-500' : isCurrent ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                  {item.period}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-2">{item.event}</h3>
                <p className="text-sm text-slate-500 mt-1">Data oficial: {new Date(item.date).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

const RaioXView = () => {
  const [activeExam, setActiveExam] = useState('enem');
  const currentData = raioXData[activeExam];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Raio-X de Incidência</h2>
          <p className="text-slate-500 mt-1">O que mais cai em cada vestibular com base em Big Data.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {Object.values(raioXData).map(exam => (
            <button
              key={exam.id}
              onClick={() => setActiveExam(exam.id)}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeExam === exam.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {exam.title}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/30 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Search size={24} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Fonte dos Dados</h3>
            <p className="text-slate-600 text-sm mt-1">{currentData.source}</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 w-1/4">Disciplina</th>
                <th className="p-4 w-1/4"><span className="text-red-500 px-2 py-1 bg-red-50 rounded-full">Alta (Top 30%)</span></th>
                <th className="p-4 w-1/4"><span className="text-orange-500 px-2 py-1 bg-orange-50 rounded-full">Média</span></th>
                <th className="p-4 w-1/4"><span className="text-teal-500 px-2 py-1 bg-teal-50 rounded-full">Regular</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.subjects.map((subject, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 align-top">{subject.name}</td>
                  <td className="p-4 align-top"><div className="flex flex-wrap gap-2">{subject.high.split(',').map((topic, i) => <span key={i} className="inline-block px-2 py-1 bg-white border border-red-200 text-slate-700 text-sm rounded-md shadow-sm">{topic.trim()}</span>)}</div></td>
                  <td className="p-4 align-top"><div className="flex flex-wrap gap-2">{subject.med.split(',').map((topic, i) => <span key={i} className="inline-block px-2 py-1 bg-white border border-orange-200 text-slate-700 text-sm rounded-md shadow-sm">{topic.trim()}</span>)}</div></td>
                  <td className="p-4 align-top"><div className="flex flex-wrap gap-2">{subject.reg.split(',').map((topic, i) => <span key={i} className="inline-block px-2 py-1 bg-white border border-teal-200 text-slate-700 text-sm rounded-md shadow-sm">{topic.trim()}</span>)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const LeiturasView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Leituras Obrigatórias</h2>
      <p className="text-slate-500 mt-1">Acompanhe o seu progresso nas obras literárias da FUVEST.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {booksData.map((book) => (
        <Card key={book.id} className="flex flex-col h-full hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <BookMarked size={24} />
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${book.progress === 100 ? 'bg-teal-50 text-teal-600 border-teal-200' : book.progress > 0 ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {book.progress === 100 ? 'Concluído' : book.progress > 0 ? 'Lendo' : 'Pendente'}
            </span>
          </div>
          <div className="flex-1 mb-6">
            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{book.title}</h3>
            <p className="text-sm text-slate-500">{book.author}, {book.year}</p>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-xs text-slate-500 mb-2 font-semibold">
              <span>Prazo: {book.deadline}</span>
              <span className={book.progress === 100 ? 'text-teal-600' : 'text-blue-600'}>{book.progress}%</span>
            </div>
            <ProgressBar progress={book.progress} colorClass={book.progress === 100 ? 'bg-teal-500' : 'bg-blue-500'} />
          </div>
        </Card>
      ))}
    </div>
  </div>
);

const RevisoesView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Revisões Espaçadas</h2>
        <p className="text-slate-500 mt-1">A curva do esquecimento não perdoa. Mantenha-se em dia.</p>
      </div>
      <button className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">Nova Revisão</button>
    </div>
    <Card className="p-0 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {revisoesData.map((rev) => (
          <div key={rev.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full flex-shrink-0 ${rev.status === 'done' ? 'bg-teal-50 text-teal-500' : rev.status === 'late' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
                {rev.status === 'done' ? <CheckCircle2 size={24} /> : rev.status === 'late' ? <AlertCircle size={24} /> : <Clock3 size={24} />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{rev.subject}</p>
                <h4 className="text-base font-bold text-slate-800">{rev.topic}</h4>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg w-full sm:w-auto text-center">{rev.date}</span>
              <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const SimuladosView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">Simulados & Métricas</h2>
      <p className="text-slate-500 mt-1">Desempenho histórico e análise de vulnerabilidades.</p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {simuladosData.map((sim) => (
          <Card key={sim.id} className="flex flex-col sm:flex-row items-center gap-6 hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{sim.name}</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{sim.date}</span>
              </div>
              <div className="flex gap-6 mt-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Acertos</p>
                  <p className="text-xl font-black text-slate-800">{sim.acertos} <span className="text-sm font-normal text-slate-400">/ {sim.total}</span></p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Desempenho</p>
                  <p className={`text-xl font-black ${sim.level === 'good' ? 'text-teal-500' : 'text-orange-500'}`}>{Math.round((sim.acertos / sim.total) * 100)}%</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tempo</p>
                  <p className="text-xl font-bold text-slate-700">{sim.time}</p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-16 h-2 sm:h-16 bg-slate-100 rounded-full flex-shrink-0 flex items-center justify-center">
              <ChevronRight size={24} className="hidden sm:block text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </Card>
        ))}
      </div>
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-none">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Aproveitamento Médio</h3>
          <div className="text-5xl font-black mb-2">68<span className="text-2xl text-slate-400">%</span></div>
          <p className="text-sm text-slate-400">Você está <span className="text-teal-400 font-bold">+12%</span> acima da média da sua turma.</p>
        </Card>
      </div>
    </div>
  </div>
);

const DiagnosticoView = () => {
  const [levels, setLevels] = useState({});
  const handleLevelSelect = (topic, level) => setLevels(prev => ({ ...prev, [topic]: level }));
  
  const getLevelColor = (level) => {
    switch(level) {
      case 1: return 'bg-red-500 border-red-600 text-white';
      case 2: return 'bg-orange-400 border-orange-500 text-white';
      case 3: return 'bg-yellow-400 border-yellow-500 text-slate-800';
      case 4: return 'bg-lime-400 border-lime-500 text-slate-800';
      case 5: return 'bg-teal-500 border-teal-600 text-white';
      default: return 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Diagnóstico de Nivelamento</h2>
          <p className="text-slate-500 mt-1">Avalie sua proficiência atual para que possamos adaptar seu cronograma.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm">
          <Target size={18} />
          <span>{Object.keys(levels).length} avaliados</span>
        </div>
      </div>
      <div className="space-y-8">
        {diagnosticData.map((area, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">{area.area}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {area.topics.map((topic, tIdx) => (
                <Card key={tIdx} className="p-4 flex flex-col justify-between">
                  <p className="font-bold text-slate-700 mb-4">{topic}</p>
                  <div className="flex justify-between gap-1 mt-auto">
                    {[1, 2, 3, 4, 5].map((num) => {
                      const isSelected = levels[topic] === num;
                      const isPast = levels[topic] >= num;
                      return (
                        <button key={num} onClick={() => handleLevelSelect(topic, num)} className={`flex-1 h-10 rounded-md border font-bold text-sm transition-all duration-200 flex items-center justify-center ${isSelected ? `${getLevelColor(num)} shadow-sm scale-105` : isPast ? `${getLevelColor(num)} opacity-60` : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}`}>
                          {num}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mt-2">
                    <span>Iniciante</span>
                    <span>Dominante</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CronogramaView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Cronograma Semanal</h2>
        <p className="text-slate-500 mt-1">Sua rotina de estudos presencial e autônoma.</p>
      </div>
    </div>
    <Card className="p-0 overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 w-32 text-xs uppercase tracking-wider text-slate-400 font-bold">Horário</th>
              {scheduleData.days.map(day => <th key={day} className="p-4 text-sm uppercase tracking-wider text-slate-700 font-bold text-center border-l border-slate-200">{day}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scheduleData.slots.map((slot, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-4 text-xs font-bold text-slate-500 align-middle">{slot.time}</td>
                {['seg', 'ter', 'qua', 'qui', 'sex'].map(dayKey => (
                  <td key={dayKey} className="p-2 border-l border-slate-100 align-middle h-full">
                    <div className={`w-full h-full p-3 rounded-lg text-center flex items-center justify-center font-bold text-sm ${slot[dayKey].color}`}>{slot[dayKey].subject}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
    <div className="md:hidden space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-slate-800">Terça-feira (Hoje)</h3>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Semana 12</span>
      </div>
      <div className="space-y-3">
        {scheduleData.slots.map((slot, idx) => (
          <Card key={idx} className="p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="text-sm font-bold text-slate-500 w-24">{slot.time.split(' - ')[0]}</div>
            <div className={`flex-1 p-3 rounded-lg font-bold text-sm text-center ${slot['ter'].color}`}>{slot['ter'].subject}</div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// 5. SHELL DE NAVEGAÇÃO E LAYOUT
// ============================================================================

const SidebarItem = ({ icon: Icon, label, id, disabled }) => {
  const { currentView, navigate } = useApp();
  const isActive = currentView === id;

  return (
    <button
      onClick={() => !disabled && navigate(id)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${isActive ? 'bg-blue-500/10 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
      {label}
    </button>
  );
};

const Navigation = () => (
  <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-100px)] pb-20 scrollbar-hide">
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Estudos</p>
    <SidebarItem id="dashboard" icon={Home} label="Início" />
    <SidebarItem id="raio-x" icon={Search} label="Raio-X Enem" />
    <SidebarItem id="diagnostico" icon={Activity} label="Diagnóstico" />
    
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Organização</p>
    <SidebarItem id="calendario" icon={Calendar} label="Calendário" />
    <SidebarItem id="cronograma" icon={Clock} label="Cronograma" />
    <SidebarItem id="leituras" icon={BookOpen} label="Leituras" />
    
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Prática</p>
    <SidebarItem id="pomodoro" icon={Brain} label="Foco Profundo" />
    <SidebarItem id="revisoes" icon={RotateCcw} label="Revisões" />
    <SidebarItem id="simulados" icon={CheckSquare} label="Simulados" />
  </div>
);

const Layout = () => {
  const { currentView, sidebarOpen, setSidebarOpen, user, navigate } = useApp();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            P
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">Cursinho da Poli</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ferramentas de Estudo</p>
          </div>
        </div>
        <Navigation />
      </aside>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Área Principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800 capitalize hidden sm:block">
              {currentView.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Gamification Badge atualizado com estado Real */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 transition-all duration-500 ease-in-out">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lvl {user.level}</span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${(user.xp % 100)}%` }}
                />
              </div>
              <span className="text-xs font-bold text-orange-600">{user.xp} XP</span>
            </div>

            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendario' && <TimelineView />}
          {currentView === 'raio-x' && <RaioXView />}
          {currentView === 'diagnostico' && <DiagnosticoView />}
          {currentView === 'cronograma' && <CronogramaView />}
          {currentView === 'leituras' && <LeiturasView />}
          {currentView === 'revisoes' && <RevisoesView />}
          {currentView === 'simulados' && <SimuladosView />}
          {currentView === 'pomodoro' && <PomodoroFocusView />}
        </div>

        {/* FAB agora direciona pro Pomodoro */}
        {currentView !== 'pomodoro' && (
          <button 
            onClick={() => navigate('pomodoro')}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-slate-800 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3 group z-40"
          >
            <Play size={20} className="text-orange-400 group-hover:text-orange-300" />
            <span className="font-bold font-mono tracking-widest text-lg">25:00</span>
          </button>
        )}

      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-40">
        {[
          { id: 'dashboard', icon: Home, label: 'Início' },
          { id: 'calendario', icon: Calendar, label: 'Calendário' },
          { id: 'pomodoro', icon: Brain, label: 'Foco' },
          { id: 'revisoes', icon: RotateCcw, label: 'Revisões' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${
              currentView === item.id ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
};

// ============================================================================
// 6. COMPONENTE RAIZ
// ============================================================================

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
