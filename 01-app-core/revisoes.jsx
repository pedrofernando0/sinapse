import React, { useState, createContext, useContext, useEffect } from 'react';
import { 
  Home, Activity, Calendar, Clock, BookOpen, RotateCcw, 
  CheckSquare, TrendingUp, Menu, Bell, Zap, Play, Search,
  CheckCircle2, AlertCircle, Clock3, ChevronRight, BookMarked,
  Target, Trash2, Edit2, Plus, X, Circle
} from 'lucide-react';

// ============================================================================
// FUNÇÕES AUXILIARES PARA DATAS DINÂMICAS
// ============================================================================
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getToday = () => getRelativeDate(0);

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
    source: 'Dados compilados via Aprova Total (Raio-X ENEM 2024).',
    subjects: [
      { name: 'Matemática', high: 'Matemática Básica, Estatística', med: 'Funções, Geometria Plana', reg: 'Geometria Analítica' },
      { name: 'Linguagens', high: 'Interpretação de Texto, Gêneros Textuais', med: 'Funções da Linguagem', reg: 'Arte Contemporânea' },
    ]
  }
};

const booksData = [
  { id: 1, title: 'Opúsculo Humanitário', author: 'Nísia Floresta', year: 1853, deadline: 'Abr–Mai', progress: 100 },
  { id: 2, title: 'Nebulosas', author: 'Narcisa Amália', year: 1872, deadline: 'Mai', progress: 45 },
];

const simuladosData = [
  { id: 1, name: 'ENEM 2024 - Dia 1', date: '15 Fev 2026', acertos: 72, total: 90, level: 'good', time: '4h 15m' },
  { id: 2, name: 'ENEM 2024 - Dia 2', date: '22 Fev 2026', acertos: 60, total: 90, level: 'average', time: '4h 50m' },
];

const diagnosticData = [
  { area: 'Matemática e Suas Tecnologias', topics: ['Matemática Básica', 'Funções'] },
  { area: 'Ciências da Natureza', topics: ['Mecânica', 'Química Geral'] }
];

const scheduleData = {
  days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  slots: [
    { time: '07:30 - 09:00', seg: { subject: 'Física', color: 'bg-purple-100 text-purple-700' }, ter: { subject: 'Matemática', color: 'bg-blue-100 text-blue-700' }, qua: { subject: 'História', color: 'bg-yellow-100 text-yellow-700' }, qui: { subject: 'Química', color: 'bg-green-100 text-green-700' }, sex: { subject: 'Biologia', color: 'bg-teal-100 text-teal-700' } },
  ]
};

// ============================================================================
// 2. CONTEXTO GLOBAL
// ============================================================================

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('revisoes'); // Iniciando direto em Revisões para testar
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
    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} style={{ width: `${progress}%` }} />
  </div>
);

// ============================================================================
// 4. NOVA TELA DE REVISÕES (CRUD + FILTROS)
// ============================================================================

export const RevisoesView = () => {
  const [revisions, setRevisions] = useState([
    { id: 1, subject: 'Matemática', topic: 'Geometria Espacial', date: getToday(), status: 'pending' },
    { id: 2, subject: 'Biologia', topic: 'Ecologia (Relações)', date: getRelativeDate(-2), status: 'done' },
    { id: 3, subject: 'Química', topic: 'Estequiometria', date: getRelativeDate(-1), status: 'pending' },
    { id: 4, subject: 'Física', topic: 'Eletrodinâmica', date: getRelativeDate(2), status: 'pending' },
  ]);

  const [filter, setFilter] = useState('hoje');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // Controle do modal de exclusão
  const [completingIds, setCompletingIds] = useState([]); // Controle da animação ao concluir
  
  const [formData, setFormData] = useState({ id: null, subject: '', topic: '', date: getToday() });

  const subjects = ['Matemática', 'Física', 'Química', 'Biologia', 'História', 'Geografia', 'Português', 'Literatura', 'Redação', 'Inglês'];

  const openModal = (revision = null) => {
    if (revision) {
      setFormData(revision);
    } else {
      setFormData({ id: null, subject: subjects[0], topic: '', date: getToday() });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    if (formData.id) {
      setRevisions(prev => prev.map(r => r.id === formData.id ? { ...formData, status: r.status } : r));
    } else {
      const newRev = { ...formData, id: Date.now(), status: 'pending' };
      setRevisions([...revisions, newRev]);
    }
    closeModal();
  };

  // --- Fluxo de Exclusão ---
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    setRevisions(prev => prev.filter(r => r.id !== itemToDelete));
    setItemToDelete(null);
  };

  // --- Fluxo de Conclusão (Com Animação) ---
  const toggleStatus = (id, currentStatus) => {
    if (currentStatus === 'pending') {
      // 1. Inicia animação visual (riscado + check verde)
      setCompletingIds(prev => [...prev, id]);
      
      // 2. Aguarda a animação terminar para efetivamente atualizar o status e sumir da lista
      setTimeout(() => {
        setRevisions(prev => prev.map(r => {
          if (r.id === id) return { ...r, status: 'done' };
          return r;
        }));
        setCompletingIds(prev => prev.filter(item => item !== id));
      }, 600); // 600ms de transição
    } else {
      // Se já estava concluído (desmarcando)
      setRevisions(prev => prev.map(r => {
        if (r.id === id) return { ...r, status: 'pending' };
        return r;
      }));
    }
  };

  // Filtragem
  const todayStr = getToday();
  const filteredRevisions = revisions.filter(rev => {
    if (filter === 'concluidas') return rev.status === 'done';
    if (rev.status === 'done') return false; 

    if (filter === 'hoje') return rev.date === todayStr;
    if (filter === 'atrasadas') return rev.date < todayStr;
    if (filter === 'proximas') return rev.date > todayStr;
    return true;
  });

  filteredRevisions.sort((a, b) => new Date(a.date) - new Date(b.date));

  const counts = {
    hoje: revisions.filter(r => r.date === todayStr && r.status !== 'done').length,
    atrasadas: revisions.filter(r => r.date < todayStr && r.status !== 'done').length,
    proximas: revisions.filter(r => r.date > todayStr && r.status !== 'done').length,
    concluidas: revisions.filter(r => r.status === 'done').length,
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto pb-20 md:pb-0">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Revisões Espaçadas</h2>
          <p className="text-slate-500 mt-1">A curva do esquecimento não perdoa. Mantenha-se em dia.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md shadow-blue-500/20"
        >
          <Plus size={20} />
          Nova Revisão
        </button>
      </div>

      {/* Abas de Filtros */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl w-full overflow-x-auto shadow-inner no-scrollbar">
        {[
          { id: 'hoje', label: 'Hoje', count: counts.hoje, color: 'text-orange-600', activeClass: 'bg-white shadow-sm text-orange-600' },
          { id: 'atrasadas', label: 'Atrasadas', count: counts.atrasadas, color: 'text-red-600', activeClass: 'bg-white shadow-sm text-red-600' },
          { id: 'proximas', label: 'Próximas', count: counts.proximas, color: 'text-blue-600', activeClass: 'bg-white shadow-sm text-blue-600' },
          { id: 'concluidas', label: 'Concluídas', count: counts.concluidas, color: 'text-teal-600', activeClass: 'bg-white shadow-sm text-teal-600' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 active:scale-95 whitespace-nowrap
              ${filter === tab.id ? tab.activeClass : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}
            `}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] transition-colors ${filter === tab.id ? tab.color : 'text-slate-400 bg-slate-200/50'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Lista de Revisões */}
      <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
        {filteredRevisions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <CheckCircle2 size={48} className="text-slate-200 mb-4 animate-in zoom-in duration-500" />
            <h3 className="text-lg font-bold text-slate-800">Tudo limpo por aqui!</h3>
            <p className="text-slate-500 mt-1">Você não tem revisões nesta categoria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRevisions.map((rev) => {
              const isDone = rev.status === 'done';
              const isLate = filter === 'atrasadas' && !isDone;
              const isCompleting = completingIds.includes(rev.id); // Flag se está tocando a animação agora
              
              return (
                <div 
                  key={rev.id} 
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500 hover:bg-slate-50/80 group
                    ${isDone ? 'bg-slate-50/50' : ''}
                    ${isCompleting ? 'opacity-0 scale-95 translate-x-4 bg-teal-50/30' : 'opacity-100 translate-x-0'}
                  `}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Botão de Checkmark Animado */}
                    <button 
                      onClick={() => toggleStatus(rev.id, rev.status)}
                      className={`p-1 rounded-full transition-all duration-300 flex-shrink-0 active:scale-75
                        ${isDone || isCompleting ? 'text-teal-500 hover:text-teal-600 scale-110' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'}
                      `}
                    >
                      {isDone || isCompleting ? <CheckCircle2 size={28} className="fill-teal-50 animate-in zoom-in duration-300" /> : <Circle size={28} />}
                    </button>
                    
                    {/* Conteúdo Principal com Line-Through */}
                    <div className={`transition-all duration-500 ${isDone || isCompleting ? 'opacity-50 line-through' : ''}`}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors duration-300
                          ${isLate ? 'bg-red-100 text-red-600' : isDone || isCompleting ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-500'}
                        `}>
                          {rev.subject}
                        </span>
                        {isLate && !isCompleting && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 animate-pulse"><AlertCircle size={12}/> Atrasada</span>}
                      </div>
                      <h4 className={`text-base font-bold transition-colors duration-300 ${isDone || isCompleting ? 'text-slate-500' : 'text-slate-800'}`}>
                        {rev.topic}
                      </h4>
                    </div>
                  </div>
                  
                  {/* Ações e Data */}
                  <div className="flex items-center gap-3 w-full sm:w-auto pl-12 sm:pl-0">
                    <span className={`text-sm font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors duration-300
                      ${isLate ? 'bg-red-50 text-red-600' : isDone || isCompleting ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}
                    `}>
                      <Calendar size={14} />
                      {new Date(rev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>

                    {/* Controles Editar/Excluir */}
                    <div className={`flex gap-1 transition-all duration-300 ${isDone || isCompleting ? 'opacity-0 pointer-events-none' : 'opacity-100 sm:opacity-0 group-hover:opacity-100'}`}>
                      <button onClick={() => openModal(rev)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDeleteClick(rev.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* --- AVISO DE CONFIRMAÇÃO DE EXCLUSÃO (BLUR) --- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="p-6 text-center pt-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                <Trash2 size={28} className="relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Revisão?</h3>
              <p className="text-slate-500 text-sm px-2">Esta ação não pode ser desfeita. Tem certeza que deseja apagar este tópico da sua lista?</p>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setItemToDelete(null)} 
                className="flex-1 px-4 py-4 text-slate-600 font-bold hover:bg-slate-100 transition-colors active:bg-slate-200"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 px-4 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors active:bg-red-100 border-l border-slate-100"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / DRAWER DE CRIAÇÃO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">
                {formData.id ? 'Editar Revisão' : 'Nova Revisão'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200 active:scale-90">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Disciplina</label>
                <select 
                  required
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none font-medium"
                >
                  {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Tópico</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Revolução Industrial..."
                  value={formData.topic}
                  onChange={e => setFormData({...formData, topic: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Data Programada</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  {formData.id ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// ============================================================================
// VIEWS MANTIDAS DO CÓDIGO ORIGINAL (SIMPLIFICADAS PARA ESPAÇO)
// ============================================================================
const DashboardView = () => <div className="p-4 text-slate-500">Dashboard Base</div>;
const TimelineView = () => <div className="p-4 text-slate-500">Timeline Base</div>;
const RaioXView = () => <div className="p-4 text-slate-500">Raio-X Base</div>;
const DiagnosticoView = () => <div className="p-4 text-slate-500">Diagnóstico Base</div>;
const CronogramaView = () => <div className="p-4 text-slate-500">Cronograma Base</div>;
const LeiturasView = () => <div className="p-4 text-slate-500">Leituras Base</div>;
const SimuladosView = () => <div className="p-4 text-slate-500">Simulados Base</div>;

// ============================================================================
// 5. SHELL DE NAVEGAÇÃO E LAYOUT MAIN
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
      
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
            P
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">Cursinho da Poli</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ferramentas</p>
          </div>
        </div>
        <Navigation />
      </aside>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Área Principal */}
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
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-orange-500 rounded-full" />
              </div>
              <span className="text-xs font-bold text-slate-800">{user.xp} XP</span>
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

        {/* View Router */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'calendario' && <TimelineView />}
          {currentView === 'raio-x' && <RaioXView />}
          {currentView === 'diagnostico' && <DiagnosticoView />}
          {currentView === 'cronograma' && <CronogramaView />}
          {currentView === 'leituras' && <LeiturasView />}
          {currentView === 'revisoes' && <RevisoesView />}
          {currentView === 'simulados' && <SimuladosView />}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
        {[
          { id: 'dashboard', icon: Home, label: 'Início' },
          { id: 'calendario', icon: Calendar, label: 'Calendário' },
          { id: 'revisoes', icon: RotateCcw, label: 'Revisões' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => useApp().navigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

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
