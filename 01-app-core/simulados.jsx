import React, { useState, createContext, useContext, useMemo } from 'react';
import { 
  Home, Activity, Calendar, Clock, BookOpen, RotateCcw, 
  CheckSquare, TrendingUp, Menu, Bell, Zap, Play, Search,
  CheckCircle2, AlertCircle, Clock3, ChevronRight, BookMarked,
  Target, Trash2, Edit2, PlusCircle, Save, XCircle, BarChart2,
  Award, Sparkles, ArrowUpRight, ArrowDownRight, Minus
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
  }
};

const booksData = [
  { id: 1, title: 'Opúsculo Humanitário', author: 'Nísia Floresta', year: 1853, deadline: 'Abr–Mai', progress: 100 },
  { id: 2, title: 'Nebulosas', author: 'Narcisa Amália', year: 1872, deadline: 'Mai', progress: 45 },
];

const revisoesData = [
  { id: 1, subject: 'Matemática', topic: 'Geometria Espacial', status: 'pending', date: 'Hoje' },
  { id: 2, subject: 'Biologia', topic: 'Ecologia (Relações)', status: 'done', date: 'Ontem' },
];

const diagnosticData = [
  { 
    area: 'Matemática e Suas Tecnologias', 
    topics: ['Matemática Básica', 'Funções', 'Geometria Plana', 'Estatística e Probabilidade'] 
  }
];

const scheduleData = {
  days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  slots: [
    { time: '07:30 - 09:00', seg: { subject: 'Física', type: 'class', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', type: 'class', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'História', type: 'class', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Química', type: 'class', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', type: 'class', color: 'bg-teal-100 text-teal-700' } },
  ]
};

// ============================================================================
// 2. CONTEXTO GLOBAL
// ============================================================================

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('simulados'); // Iniciando na view nova
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState({ name: 'Diogo Medrado', turma: 'Extensivo', xp: 1250, level: 12 });

  const navigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <AppContext.Provider value={{ currentView, navigate, sidebarOpen, setSidebarOpen, user }}>
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => useContext(AppContext);

// ============================================================================
// 3. COMPONENTES UI REUTILIZÁVEIS
// ============================================================================

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
// 4. NOVA VIEW: MockExamTrackerView (Substitui SimuladosView)
// ============================================================================

const initialSimuladosData = [
  { id: 1, name: 'ENEM 2024 - Dia 1', date: '2026-02-15', acertos: 72, total: 90, level: 'good', time: '04:15' },
  { id: 2, name: 'ENEM 2024 - Dia 2', date: '2026-02-22', acertos: 60, total: 90, level: 'average', time: '04:50' },
  { id: 3, name: 'FUVEST 2025 - 1ª Fase', date: '2026-03-08', acertos: 38, total: 90, level: 'bad', time: '04:00' },
];

export const MockExamTrackerView = () => {
  const [simulados, setSimulados] = useState(initialSimuladosData);
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0], // Hoje
    total: '',
    acertos: '',
    time: ''
  });

  // Métricas Dinâmicas Avançadas
  const metrics = useMemo(() => {
    if (simulados.length === 0) return { avgPercentage: 0, totalExams: 0, trend: 'neutral', bestScore: 0, avgTimeStr: '00:00' };
    
    let totalAcertos = 0;
    let totalQuestoes = 0;
    let bestScore = 0;
    let totalMinutes = 0;

    simulados.forEach(sim => {
      totalAcertos += Number(sim.acertos);
      totalQuestoes += Number(sim.total);
      
      const score = Math.round((Number(sim.acertos) / Number(sim.total)) * 100);
      if (score > bestScore) bestScore = score;

      // Cálculo de tempo
      const timeParts = String(sim.time).split(':');
      if (timeParts.length === 2) {
        totalMinutes += (Number(timeParts[0]) * 60) + Number(timeParts[1]);
      }
    });

    const avgPercentage = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
    const avgMins = Math.round(totalMinutes / simulados.length);
    const avgTimeStr = `${String(Math.floor(avgMins / 60)).padStart(2, '0')}h${String(avgMins % 60).padStart(2, '0')}m`;
    
    return {
      avgPercentage,
      totalExams: simulados.length,
      trend: avgPercentage >= 70 ? 'up' : avgPercentage >= 50 ? 'neutral' : 'down',
      bestScore,
      avgTimeStr
    };
  }, [simulados]);

  // Handlers do Formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (simulado) => {
    setForm(simulado);
    setEditingId(simulado.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if(window.confirm('Tem certeza que deseja apagar este simulado?')) {
      setSimulados(simulados.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação básica
    if (Number(form.acertos) > Number(form.total)) {
      alert('O número de acertos não pode ser maior que o total de questões!');
      return;
    }

    // Cálculo do Level
    const pct = Number(form.acertos) / Number(form.total);
    let level = 'bad';
    if (pct >= 0.7) level = 'good';
    else if (pct >= 0.5) level = 'average';

    const newExam = {
      ...form,
      id: editingId || Date.now(),
      acertos: Number(form.acertos),
      total: Number(form.total),
      level
    };

    if (editingId) {
      setSimulados(simulados.map(s => s.id === editingId ? newExam : s));
    } else {
      // Ordenando os simulados por data (mais recente primeiro)
      const newSimuladosList = [newExam, ...simulados].sort((a, b) => new Date(b.date) - new Date(a.date));
      setSimulados(newSimuladosList);
    }

    // Reset do formulário
    setForm({ name: '', date: new Date().toISOString().split('T')[0], total: '', acertos: '', time: '' });
    setEditingId(null);
    setIsFormVisible(false);
  };

  const resetForm = () => {
    setForm({ name: '', date: new Date().toISOString().split('T')[0], total: '', acertos: '', time: '' });
    setEditingId(null);
    setIsFormVisible(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Simulados & Métricas</h2>
          <p className="text-slate-500 mt-1">Cadastre seus resultados e analise sua evolução de dados.</p>
        </div>
        {!isFormVisible && (
          <button 
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Novo Resultado</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lado Esquerdo: Formulário (se visível) ou Histórico */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Formulário de Cadastro */}
          {isFormVisible && (
            <Card className="border-blue-200 shadow-md bg-gradient-to-br from-white to-blue-50/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {editingId ? <Edit2 size={20} className="text-blue-600" /> : <PlusCircle size={20} className="text-blue-600" />}
                  {editingId ? 'Editar Resultado' : 'Cadastrar Simulado'}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-red-500 transition-colors">
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Nome do Simulado</label>
                    <input 
                      type="text" required name="name" value={form.name} onChange={handleChange}
                      placeholder="Ex: FUVEST 1ª Fase"
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Data</label>
                    <input 
                      type="date" required name="date" value={form.date} onChange={handleChange}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Total de Questões</label>
                    <input 
                      type="number" min="1" required name="total" value={form.total} onChange={handleChange}
                      placeholder="Ex: 90"
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Acertos</label>
                    <input 
                      type="number" min="0" required name="acertos" value={form.acertos} onChange={handleChange}
                      placeholder="Ex: 65"
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tempo Gasto (HH:MM)</label>
                    <input 
                      type="text" required name="time" value={form.time} onChange={handleChange}
                      pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Formato de hora válido: HH:MM"
                      placeholder="04:30"
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button type="button" onClick={resetForm} className="px-5 py-2 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" className="px-5 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Save size={18} />
                    {editingId ? 'Atualizar' : 'Salvar Dados'}
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* Histórico Editável de Simulados */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare size={20} className="text-slate-500" />
              Histórico de Resultados
            </h3>
            
            {simulados.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-slate-500">
                Nenhum simulado cadastrado ainda.
              </div>
            ) : (
              simulados.map((sim) => {
                // Cálculo de exibição individual
                const formatedDate = new Date(sim.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const percentage = Math.round((sim.acertos / sim.total) * 100);
                
                const getLevelUI = (level) => {
                  switch(level) {
                    case 'good': return { color: 'text-teal-500', bg: 'bg-teal-50', label: 'Bom' };
                    case 'average': return { color: 'text-orange-500', bg: 'bg-orange-50', label: 'Médio' };
                    case 'bad': return { color: 'text-red-500', bg: 'bg-red-50', label: 'Ruim' };
                    default: return { color: 'text-slate-500', bg: 'bg-slate-50', label: 'N/A' };
                  }
                };

                const ui = getLevelUI(sim.level);

                return (
                  <Card key={sim.id} className="group hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-base font-bold text-slate-800">{sim.name}</h4>
                          <span className="text-xs font-bold text-slate-400">{formatedDate}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${ui.bg} ${ui.color}`}>
                          {ui.label}
                        </span>
                      </div>
                      
                      <div className="flex gap-4 sm:gap-8 mt-2">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Acertos</p>
                          <p className="text-lg font-black text-slate-700">
                            {sim.acertos} <span className="text-sm font-normal text-slate-400">/ {sim.total}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Taxa</p>
                          <p className={`text-lg font-black ${ui.color}`}>{percentage}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempo</p>
                          <p className="text-lg font-bold text-slate-600">{sim.time}h</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Ações: Editar e Deletar */}
                    <div className="flex sm:flex-col gap-2 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-4">
                      <button 
                        onClick={() => handleEdit(sim)}
                        className="flex-1 sm:flex-none p-2 flex items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(sim.id)}
                        className="flex-1 sm:flex-none p-2 flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Apagar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Lado Direito: Painel de Inteligência de Dados (Estética Clean e Integrada) */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-md flex flex-col">
            
            {/* Header do Painel */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <BarChart2 size={18} className="text-blue-600" />
                Performance Global
              </h3>
              <span className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-500">
                {metrics.totalExams} EXAMES
              </span>
            </div>

            {/* Gráfico Radial Clean */}
            <div className="flex justify-center mb-8 relative">
              <div className="w-40 h-40 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                  {/* Trilha de fundo */}
                  <circle cx="80" cy="80" r="70" className="text-slate-100 stroke-current" strokeWidth="12" fill="transparent" />
                  {/* Trilha de progresso */}
                  <circle 
                    cx="80" cy="80" r="70" 
                    className={`${
                      metrics.avgPercentage >= 70 ? 'text-teal-500' : 
                      metrics.avgPercentage >= 50 ? 'text-blue-500' : 'text-rose-500'
                    } stroke-current transition-all duration-1000 ease-out`} 
                    strokeWidth="12" 
                    fill="transparent" 
                    strokeDasharray="439.8" 
                    strokeDashoffset={439.8 - (metrics.avgPercentage / 100) * 439.8} 
                    strokeLinecap="round" 
                  />
                </svg>
                {/* Texto central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-800 tracking-tighter">
                    {metrics.avgPercentage}<span className="text-2xl text-slate-400 font-bold">%</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Média</span>
                </div>
              </div>
            </div>

            {/* Grid de Micro-Métricas em Cards Claros */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center hover:bg-slate-100/50 transition-colors">
                <Award size={20} className="text-amber-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Melhor Marca</p>
                <p className="text-2xl font-black text-slate-800">{metrics.bestScore}%</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center hover:bg-slate-100/50 transition-colors">
                <Clock size={20} className="text-blue-500 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pace Médio</p>
                <p className="text-2xl font-black text-slate-800">{metrics.avgTimeStr}</p>
              </div>
            </div>

            {/* Mini-Gráfico de Evolução (Barras Minimalistas) */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Histórico Recente</p>
                {metrics.trend === 'up' ? <TrendingUp size={16} className="text-teal-500" /> : 
                 metrics.trend === 'down' ? <TrendingUp size={16} className="text-rose-500 transform rotate-180" /> : 
                 <Minus size={16} className="text-slate-400" />}
              </div>
              
              <div className="flex items-end gap-2 h-16 w-full px-2">
                {simulados.slice(0, 7).reverse().map((sim, i) => {
                  const score = Math.round((sim.acertos/sim.total)*100);
                  const isBest = score === metrics.bestScore && score > 0;
                  return (
                    <div key={i} className="flex-1 bg-slate-50 rounded-t-md relative group h-full flex items-end justify-center overflow-hidden">
                      <div 
                        className={`w-full rounded-t-md transition-all duration-700 ${
                          isBest ? 'bg-amber-400' : 'bg-blue-200 group-hover:bg-blue-300'
                        }`}
                        style={{ height: `${score}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Card de Inteligência / Dica de Estudo */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -top-4 text-indigo-500/10 rotate-12 pointer-events-none">
              <Sparkles size={80} />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-widest">
                <Sparkles size={16} className="text-indigo-500" />
                Inteligência de Dados
              </h4>
              <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">
                Seu rendimento atual sugere viabilidade. Reduzir <strong className="text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-100 shadow-sm mx-1">15 min</strong> do pace fortalecerá sua vantagem competitiva.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};


// ============================================================================
// 5. VIEWS RESTANTES (Minificadas p/ contexto, sem alterações bruscas)
// ============================================================================

const DashboardView = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-lg">
      <div className="relative z-10 max-w-lg">
        <h2 className="text-3xl font-bold mb-2">Bom dia!</h2>
        <p className="text-blue-100/80 mb-6">Faltam 206 dias para o ENEM.</p>
      </div>
    </div>
  </div>
);

// ... Outras views mantidas como placeholders para navegação funcional
const TimelineView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Calendário (Placeholder)</h2></Card></div>;
const RaioXView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Raio-X (Placeholder)</h2></Card></div>;
const DiagnosticoView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Diagnóstico (Placeholder)</h2></Card></div>;
const CronogramaView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Cronograma (Placeholder)</h2></Card></div>;
const LeiturasView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Leituras (Placeholder)</h2></Card></div>;
const RevisoesView = () => <div className="p-8"><Card><h2 className="text-xl font-bold">Revisões (Placeholder)</h2></Card></div>;

// ============================================================================
// 6. SHELL DE NAVEGAÇÃO
// ============================================================================

const SidebarItem = ({ icon: Icon, label, id }) => {
  const { currentView, navigate } = useApp();
  const isActive = currentView === id;

  return (
    <button
      onClick={() => navigate(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${isActive ? 'bg-blue-500/10 text-blue-600' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}
      `}
    >
      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
      {label}
    </button>
  );
};

const Navigation = () => (
  <div className="space-y-1">
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Estudos</p>
    <SidebarItem id="dashboard" icon={Home} label="Início" />
    <SidebarItem id="raio-x" icon={Search} label="Raio-X Enem" />
    <SidebarItem id="diagnostico" icon={Activity} label="Diagnóstico" />
    
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Organização</p>
    <SidebarItem id="calendario" icon={Calendar} label="Calendário" />
    <SidebarItem id="cronograma" icon={Clock} label="Cronograma" />
    <SidebarItem id="leituras" icon={BookOpen} label="Leituras" />
    
    <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Prática</p>
    <SidebarItem id="revisoes" icon={RotateCcw} label="Revisões" />
    <SidebarItem id="simulados" icon={CheckSquare} label="Simulados" />
  </div>
);

const Layout = () => {
  const { currentView, sidebarOpen, setSidebarOpen, user } = useApp();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">P</div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">Cursinho da Poli</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ferramentas de Estudo</p>
          </div>
        </div>
        <Navigation />
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lvl {user.level}</span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-orange-500 rounded-full" /></div>
              <span className="text-xs font-bold text-slate-800">{user.xp} XP</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendario' && <TimelineView />}
          {currentView === 'raio-x' && <RaioXView />}
          {currentView === 'diagnostico' && <DiagnosticoView />}
          {currentView === 'cronograma' && <CronogramaView />}
          {currentView === 'leituras' && <LeiturasView />}
          {currentView === 'revisoes' && <RevisoesView />}
          {currentView === 'simulados' && <MockExamTrackerView />}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
