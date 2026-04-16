import React, { Suspense, lazy, useEffect, useRef, useState, createContext, useContext } from 'react';
import { 
  Home, Activity, Calendar, Clock, BookOpen, RotateCcw, 
  CheckSquare, TrendingUp, Menu, X, Bell, Zap, Play, Search,
  CheckCircle2, AlertCircle, Clock3, ChevronRight, BookMarked,
  Target, BarChart2, FileText, PenTool, Heart, HeartHandshake,
  Users, Sparkles, Settings, HelpCircle, LogOut
} from 'lucide-react';
import { AccountHelpModal, AccountSettingsModal } from '../src/components/ProfileActionPanels.jsx';

const CalendarManagerView = lazy(() =>
  import('./calendario.jsx').then((module) => ({ default: module.CalendarManagerView }))
);
const EditableScheduleView = lazy(() =>
  import('./cronograma.jsx').then((module) => ({ default: module.EditableScheduleView }))
);
const ReadingHubView = lazy(() =>
  import('./leituras.jsx').then((module) => ({ default: module.ReadingHubView }))
);
const SmartRevisoesView = lazy(() =>
  import('./revisoes.jsx').then((module) => ({ default: module.RevisoesView }))
);
const MockExamTrackerView = lazy(() =>
  import('./simulados.jsx').then((module) => ({ default: module.MockExamTrackerView }))
);
const PomodoroFocusView = lazy(() =>
  import('./pomodoro.jsx').then((module) => ({ default: module.PomodoroFocusView }))
);
const StrategicStudyHub = lazy(() => import('./aprovacao-fuvest.jsx'));
const SecondPhaseDiscursive = lazy(() => import('./discursiva-ia.jsx'));
const FuvestEssayLab = lazy(() => import('./redacao-ia-fuvest.jsx'));
const ScoreSimulator = lazy(() => import('./simulador-tri.jsx'));
const AiTutoringHub = lazy(() => import('./tutoria-ia.jsx'));
const MentorshipHub = lazy(() => import('./tutoria.jsx'));
const MoodTracker = lazy(() => import('./medidor-de-humor.jsx'));
const SupportNetwork = lazy(() => import('./rede-de-apoio.jsx'));

// ============================================================================
// 1. DADOS MOCKADOS (Extraídos dos seus arquivos .js)
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

// Dados extraídos do seu exams_raiox.js
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

// Novos dados extraídos dos seus arquivos base
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

const INITIAL_STUDENT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Revisão agendada para hoje',
    text: 'Sua revisão de Biologia sobre Ecologia vence às 19h.',
    time: 'Agora',
    type: 'warning',
    unread: true,
    icon: Clock3,
  },
  {
    id: 2,
    title: 'Tutoria com IA liberada',
    text: 'Seu tutor já pode montar um plano para o próximo simulado.',
    time: 'Há 1h',
    type: 'success',
    unread: true,
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: 'Prazo importante',
    text: 'As inscrições do ENEM entram na janela de atenção nesta semana.',
    time: 'Ontem',
    type: 'danger',
    unread: false,
    icon: AlertCircle,
  },
];

const diagnosticData = [
  { 
    area: 'Matemática e Suas Tecnologias', 
    topics: ['Matemática Básica', 'Funções', 'Geometria Plana', 'Estatística e Probabilidade'] 
  },
  { 
    area: 'Ciências da Natureza', 
    topics: ['Mecânica', 'Eletrodinâmica', 'Química Geral', 'Fisiologia Humana'] 
  }
];

const scheduleData = {
  days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  slots: [
    { time: '07:30 - 09:00', seg: { subject: 'Física', type: 'class', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', type: 'class', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'História', type: 'class', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Química', type: 'class', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', type: 'class', color: 'bg-teal-100 text-teal-700' } },
    { time: '09:00 - 10:30', seg: { subject: 'Física', type: 'class', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', type: 'class', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'Geografia', type: 'class', color: 'bg-orange-100 text-orange-700' }, qui: { subject: 'Química', type: 'class', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', type: 'class', color: 'bg-teal-100 text-teal-700' } },
    { time: '10:30 - 11:00', seg: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' }, ter: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' }, qua: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' }, qui: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' }, sex: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' } },
    { time: '11:00 - 12:30', seg: { subject: 'Estudo: Listas', type: 'study', color: 'bg-slate-800 text-white' }, ter: { subject: 'Redação', type: 'class', color: 'bg-pink-100 text-pink-700' }, qua: { subject: 'Filosofia', type: 'class', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Literatura', type: 'class', color: 'bg-pink-100 text-pink-700' }, sex: { subject: 'Estudo: Simulado', type: 'study', color: 'bg-slate-800 text-white' } },
  ]
};

const DEFAULT_STUDENT_USER = {
  name: 'Diogo Medrado',
  turma: 'Extensivo',
  xp: 1250,
  level: 12,
};

const getHiddenStudentViews = (session) => session?.hiddenStudentViews ?? [];

const sanitizeStudentView = (view, hiddenViews) =>
  hiddenViews.includes(view) ? 'dashboard' : view;

const buildStudentUser = (session) => ({
  ...DEFAULT_STUDENT_USER,
  ...(session?.name ? { name: session.name } : {}),
});

const getFirstName = (name = '') => {
  const [firstName] = name.trim().split(/\s+/);
  return firstName || DEFAULT_STUDENT_USER.name.split(' ')[0];
};

const getNameInitial = (name = '') => getFirstName(name).charAt(0).toUpperCase();

// ============================================================================
// 2. CONTEXTO GLOBAL (Substitui a injeção manual do Hexagonal para UI State)
// ============================================================================

const AppContext = createContext();

const AppProvider = ({ children, initialView = 'dashboard', session = null }) => {
  const hiddenViews = getHiddenStudentViews(session);
  const hiddenViewsKey = hiddenViews.join('|');
  const [currentView, setCurrentView] = useState(() => sanitizeStudentView(initialView, hiddenViews));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(() => buildStudentUser(session));

  useEffect(() => {
    setCurrentView(sanitizeStudentView(initialView, hiddenViews));
  }, [hiddenViewsKey, initialView]);

  useEffect(() => {
    setUser(buildStudentUser(session));
  }, [session?.name]);

  const navigate = (view) => {
    setCurrentView(sanitizeStudentView(view, hiddenViews));
    setSidebarOpen(false); // Fecha sidebar no mobile ao navegar
  };

  const addXp = (amount) => {
    setUser((prev) => {
      const nextXp = prev.xp + amount;
      return {
        ...prev,
        xp: nextXp,
        level: Math.floor(nextXp / 100) + 1,
      };
    });
  };

  return (
    <AppContext.Provider value={{ currentView, navigate, sidebarOpen, setSidebarOpen, user, addXp, hiddenViews }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

const VIEW_TITLES = {
  dashboard: 'Início',
  'raio-x': 'Raio-X Enem',
  diagnostico: 'Diagnóstico',
  calendario: 'Calendário',
  cronograma: 'Cronograma',
  leituras: 'Leituras',
  pomodoro: 'Pomodoro',
  revisoes: 'Revisões',
  simulados: 'Simulados',
  'aprovacao-fuvest': 'Aprovação FUVEST',
  'discursiva-ia': 'Discursiva IA',
  'redacao-ia-fuvest': 'Redação IA FUVEST',
  'simulador-tri': 'Simulador TRI',
  tutoria: 'Tutoria com IA',
  mentoria: 'Mentoria',
  humor: 'Medidor de Humor',
  'rede-de-apoio': 'Rede de Apoio',
};

const IMMERSIVE_VIEWS = new Set([
  'aprovacao-fuvest',
  'discursiva-ia',
  'redacao-ia-fuvest',
  'simulador-tri',
  'tutoria',
  'mentoria',
  'humor',
  'rede-de-apoio',
]);

const NAVIGATION_SECTIONS = [
  {
    id: 'essencial',
    title: 'Estudos',
    items: [
      { id: 'dashboard', icon: Home, label: 'Início' },
      { id: 'raio-x', icon: Search, label: 'Raio-X Enem' },
      { id: 'diagnostico', icon: Activity, label: 'Diagnóstico' },
    ],
  },
  {
    id: 'organizacao',
    title: 'Organização',
    items: [
      { id: 'calendario', icon: Calendar, label: 'Calendário' },
      { id: 'cronograma', icon: Clock, label: 'Cronograma' },
      { id: 'leituras', icon: BookOpen, label: 'Leituras' },
      { id: 'pomodoro', icon: Play, label: 'Pomodoro' },
    ],
  },
  {
    id: 'pratica',
    title: 'Prática',
    items: [
      { id: 'revisoes', icon: RotateCcw, label: 'Revisões' },
      { id: 'simulados', icon: CheckSquare, label: 'Simulados' },
    ],
  },
  {
    id: 'estrategia',
    title: 'Aprovação',
    items: [
      { id: 'aprovacao-fuvest', icon: Target, label: 'Aprovação FUVEST' },
      { id: 'simulador-tri', icon: Sparkles, label: 'Simulador TRI' },
    ],
  },
  {
    id: 'ia',
    title: 'IA',
    items: [
      { id: 'discursiva-ia', icon: FileText, label: 'Discursiva IA', hiddenWhen: 'discursiva-ia' },
      { id: 'redacao-ia-fuvest', icon: PenTool, label: 'Redação IA' },
      { id: 'tutoria', icon: Sparkles, label: 'Tutoria com IA' },
    ],
  },
  {
    id: 'apoio',
    title: 'Apoio',
    items: [
      { id: 'mentoria', icon: Users, label: 'Mentoria' },
      { id: 'humor', icon: Heart, label: 'Medidor de Humor' },
      { id: 'rede-de-apoio', icon: HeartHandshake, label: 'Rede de Apoio' },
    ],
  },
];

// ============================================================================
// 3. COMPONENTES UI REUTILIZÁVEIS (Substitui o components.css)
// ============================================================================

// Substitui o painel com Glassmorphism
const Card = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl p-6 ${className}`}>
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

const DashboardView = () => {
  const { user } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Banner Principal (Substitui .dashboard-banner) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold mb-2">Bom dia, {getFirstName(user.name)}!</h2>
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
        
        {/* Elementos visuais decorativos convertidos para Tailwind */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 right-12 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
      </div>

      {/* Grid de KPIs (Substitui .kpi-grid) */}
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

      {/* Progresso dos Cursos (Substitui .course-progress-panel) */}
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
                <ProgressBar 
                  progress={course.progress} 
                  colorClass={course.status === 'done' ? 'bg-teal-500' : 'bg-blue-500'} 
                />
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

const TimelineView = () => {
  return (
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
                {/* Ponto na timeline */}
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  isPast ? 'bg-slate-400' : isCurrent ? 'bg-orange-500 ring-4 ring-orange-500/20' : 'bg-blue-500'
                }`} />
                
                <div className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
                  isCurrent ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-slate-200'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                    isPast ? 'bg-slate-100 text-slate-500' : isCurrent ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
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
};

const RaioXView = () => {
  const [activeExam, setActiveExam] = useState('enem');
  const currentData = raioXData[activeExam];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header do Raio-X */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Raio-X de Incidência</h2>
          <p className="text-slate-500 mt-1">O que mais cai em cada vestibular com base em Big Data.</p>
        </div>
        
        {/* Seletor de Vestibular (Substitui o .exam-tab-selector) */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          {Object.values(raioXData).map(exam => (
            <button
              key={exam.id}
              onClick={() => setActiveExam(exam.id)}
              className={`flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                activeExam === exam.id 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
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

      {/* Tabela de Incidência (Substitui o .data-table do CSS antigo) */}
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
                  <td className="p-4 font-bold text-slate-800 align-top">
                    {subject.name}
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {subject.high.split(',').map((topic, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-white border border-red-200 text-slate-700 text-sm rounded-md shadow-sm">
                          {topic.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {subject.med.split(',').map((topic, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-white border border-orange-200 text-slate-700 text-sm rounded-md shadow-sm">
                          {topic.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      {subject.reg.split(',').map((topic, i) => (
                        <span key={i} className="inline-block px-2 py-1 bg-white border border-teal-200 text-slate-700 text-sm rounded-md shadow-sm">
                          {topic.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const LeiturasView = () => {
  return (
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
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                book.progress === 100 ? 'bg-teal-50 text-teal-600 border-teal-200' :
                book.progress > 0 ? 'bg-blue-50 text-blue-600 border-blue-200' :
                'bg-slate-50 text-slate-500 border-slate-200'
              }`}>
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
              <ProgressBar 
                progress={book.progress} 
                colorClass={book.progress === 100 ? 'bg-teal-500' : 'bg-blue-500'} 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RevisoesView = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Revisões Espaçadas</h2>
          <p className="text-slate-500 mt-1">A curva do esquecimento não perdoa. Mantenha-se em dia.</p>
        </div>
        <button className="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors">
          Nova Revisão
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {revisoesData.map((rev) => (
            <div key={rev.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full flex-shrink-0 ${
                  rev.status === 'done' ? 'bg-teal-50 text-teal-500' :
                  rev.status === 'late' ? 'bg-red-50 text-red-500' :
                  'bg-orange-50 text-orange-500'
                }`}>
                  {rev.status === 'done' ? <CheckCircle2 size={24} /> : 
                   rev.status === 'late' ? <AlertCircle size={24} /> : 
                   <Clock3 size={24} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{rev.subject}</p>
                  <h4 className="text-base font-bold text-slate-800">{rev.topic}</h4>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg w-full sm:w-auto text-center">
                  {rev.date}
                </span>
                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const SimuladosView = () => {
  return (
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
                    <p className="text-xl font-black text-slate-800">
                      {sim.acertos} <span className="text-sm font-normal text-slate-400">/ {sim.total}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Desempenho</p>
                    <p className={`text-xl font-black ${sim.level === 'good' ? 'text-teal-500' : 'text-orange-500'}`}>
                      {Math.round((sim.acertos / sim.total) * 100)}%
                    </p>
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
};

const DiagnosticoView = () => {
  // Estado para armazenar o nível (1 a 5) de cada tópico
  const [levels, setLevels] = useState({});

  const handleLevelSelect = (topic, level) => {
    setLevels(prev => ({ ...prev, [topic]: level }));
  };

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
                        <button
                          key={num}
                          onClick={() => handleLevelSelect(topic, num)}
                          className={`flex-1 h-10 rounded-md border font-bold text-sm transition-all duration-200 flex items-center justify-center
                            ${isSelected ? `${getLevelColor(num)} shadow-sm scale-105` : 
                              isPast ? `${getLevelColor(num)} opacity-60` : 
                              'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'}
                          `}
                        >
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
      
      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">
          Salvar Diagnóstico
        </button>
      </div>
    </div>
  );
};

const CronogramaView = () => {
  return (
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
                {scheduleData.days.map(day => (
                  <th key={day} className="p-4 text-sm uppercase tracking-wider text-slate-700 font-bold text-center border-l border-slate-200">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scheduleData.slots.map((slot, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-4 text-xs font-bold text-slate-500 align-middle">
                    {slot.time}
                  </td>
                  {['seg', 'ter', 'qua', 'qui', 'sex'].map(dayKey => {
                    const block = slot[dayKey];
                    return (
                      <td key={dayKey} className="p-2 border-l border-slate-100 align-middle h-full">
                        <div className={`w-full h-full p-3 rounded-lg text-center flex items-center justify-center font-bold text-sm ${block.color}`}>
                          {block.subject}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Visualização Mobile do Cronograma (Apenas o dia atual mockado) */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-slate-800">Terça-feira (Hoje)</h3>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Semana 12</span>
        </div>
        
        <div className="space-y-3">
          {scheduleData.slots.map((slot, idx) => {
            const block = slot['ter']; // Forçando "Terça" para o mobile view
            return (
              <Card key={idx} className="p-4 flex items-center gap-4 border-l-4 border-l-blue-500">
                <div className="text-sm font-bold text-slate-500 w-24">
                  {slot.time.split(' - ')[0]}
                </div>
                <div className={`flex-1 p-3 rounded-lg font-bold text-sm text-center ${block.color}`}>
                  {block.subject}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. SHELL DE NAVEGAÇÃO (Sidebar, Header, Layout)
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

const Navigation = () => {
  const { hiddenViews } = useApp();

  return (
    <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
      <div className="space-y-1 pb-6">
        {NAVIGATION_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => !item.hiddenWhen || !hiddenViews.includes(item.hiddenWhen));

          if (!visibleItems.length) {
            return null;
          }

          return (
            <section key={section.id} className="pt-6 first:pt-6">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                {section.title}
              </p>
              {visibleItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  label={item.label}
                  disabled={item.disabled}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
};

const Layout = ({ onLogout }) => {
  const { currentView, navigate, sidebarOpen, setSidebarOpen, user, addXp, hiddenViews } = useApp();
  const isImmersiveView = IMMERSIVE_VIEWS.has(currentView);
  const [notifications, setNotifications] = useState(INITIAL_STUDENT_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const notificationsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const unreadNotificationsCount = notifications.filter((notification) => notification.unread).length;

  const markNotificationAsRead = (notificationId) => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((previousNotifications) =>
      previousNotifications.map((notification) =>
        notification.unread ? { ...notification, unread: false } : notification
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
              {VIEW_TITLES[currentView] || currentView.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Gamification Badge (Substitui o .xp-badge) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lvl {user.level}</span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${user.xp % 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-800">{user.xp} XP</span>
            </div>

            <div className="relative" ref={notificationsDropdownRef}>
              <button
                onClick={() => {
                  setShowNotifications((previousValue) => !previousValue);
                  setShowProfileMenu(false);
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative ${
                  showNotifications ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-2 h-2 px-1 rounded-full bg-red-500 border-2 border-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-800">Notificações</h4>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                        {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} nova(s)` : 'Tudo em dia'}
                      </p>
                    </div>
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-300"
                      disabled={unreadNotificationsCount === 0}
                    >
                      Marcar como lidas
                    </button>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`w-full p-4 text-left transition-colors flex gap-3 ${
                          notification.unread ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-full h-fit flex-shrink-0 ${
                            notification.type === 'danger'
                              ? 'bg-red-50 text-red-500'
                              : notification.type === 'warning'
                                ? 'bg-orange-50 text-orange-500'
                                : 'bg-teal-50 text-teal-500'
                          }`}
                        >
                          <notification.icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className="font-bold text-sm text-slate-800">{notification.title}</p>
                            {notification.unread && <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notification.text}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{notification.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  setShowProfileMenu((prev) => !prev);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                  {getNameInitial(user.name)}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 flex flex-col">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowSettingsModal(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
                    >
                      <Settings size={16} /> Configurações
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowHelpModal(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-left"
                    >
                      <HelpCircle size={16} /> Ajuda
                    </button>
                    <div className="h-px bg-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (typeof onLogout === 'function') {
                          onLogout();
                        }
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Rolável */}
        <div className={`flex-1 overflow-y-auto ${isImmersiveView ? 'bg-slate-50' : 'p-4 md:p-8 pb-24 md:pb-8'}`}>
          <Suspense
            fallback={
              <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-slate-500">
                Carregando módulo...
              </div>
            }
          >
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'calendario' && <CalendarManagerView />}
            {currentView === 'raio-x' && <RaioXView />}
            {currentView === 'diagnostico' && <DiagnosticoView />}
            {currentView === 'cronograma' && <EditableScheduleView />}
            {currentView === 'leituras' && <ReadingHubView />}
            {currentView === 'revisoes' && <SmartRevisoesView />}
            {currentView === 'simulados' && <MockExamTrackerView />}
            {currentView === 'pomodoro' && <PomodoroFocusView addXp={addXp} />}
            {currentView === 'aprovacao-fuvest' && <StrategicStudyHub />}
            {currentView === 'discursiva-ia' && !hiddenViews.includes('discursiva-ia') && <SecondPhaseDiscursive />}
            {currentView === 'redacao-ia-fuvest' && <FuvestEssayLab />}
            {currentView === 'simulador-tri' && <ScoreSimulator />}
            {currentView === 'tutoria' && <AiTutoringHub user={user} />}
            {currentView === 'mentoria' && <MentorshipHub />}
            {currentView === 'humor' && <MoodTracker />}
            {currentView === 'rede-de-apoio' && <SupportNetwork />}
          </Suspense>
        </div>

        {/* FAB de Pomodoro Mockado */}
        {!isImmersiveView && (
          <button
            onClick={() => navigate('pomodoro')}
            className="fixed bottom-20 md:bottom-8 right-4 md:right-8 bg-slate-800 text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3 group z-40"
          >
            <Play size={20} className="text-orange-400 group-hover:text-orange-300" />
            <span className="font-bold font-mono tracking-widest text-lg">25:00</span>
          </button>
        )}

        <AccountSettingsModal
          open={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          profile="student"
          userName={getFirstName(user.name)}
        />
        <AccountHelpModal
          open={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          profile="student"
          userName={getFirstName(user.name)}
        />

      </main>

      {/* Bottom Nav Mobile (Aparece apenas em telas pequenas) */}
      {!isImmersiveView && (
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
          {[
            { id: 'dashboard', icon: Home, label: 'Início' },
            { id: 'calendario', icon: Calendar, label: 'Calendário' },
            { id: 'revisoes', icon: RotateCcw, label: 'Revisões' },
            { id: 'tutoria', icon: Sparkles, label: 'Tutoria IA' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => useApp().navigate(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${
                currentView === item.id ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} className="mb-1" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      )}

    </div>
  );
};

// ============================================================================
// 6. COMPONENTE RAIZ
// ============================================================================

export default function App({ initialView = 'dashboard', onLogout, session = null }) {
  return (
    <AppProvider initialView={initialView} session={session}>
      <Layout onLogout={onLogout} />
    </AppProvider>
  );
}
