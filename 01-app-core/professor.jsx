import React, { useState, createContext, useContext, useMemo, useRef, useEffect } from 'react';
import { 
  Users, LayoutDashboard, BookOpen, TrendingUp, CheckCircle2, 
  AlertCircle, Clock, Search, ChevronRight, BarChart2, 
  GraduationCap, Calendar, Bell, Menu, FileText, Target,
  AlertTriangle, Trophy, Filter, Settings, HelpCircle, LogOut
} from 'lucide-react';
import { LessonPlannerView } from './prof-planejador-de-aulas.jsx';

// ============================================================================
// 1. DADOS MOCKADOS
// ============================================================================

const teacherProfile = {
  email: 'plfonseca@usp.br',
  name: 'Pedro Fonseca',
  subject: 'História',
  turmas: ['Extensivo Presencial'],
};

const mockStudents = [
  {
    id: 's1', name: 'Diogo Medrado', turma: 'Extensivo Presencial', lastActive: '2026-04-11',
    diagnosis: { avg: 3.2, bySubject: { 'Matemática': 2, 'Português': 4, 'História': 3.5, 'Geografia': 3, 'Biologia': 2.8, 'Física': 2.5, 'Química': 3 } },
    simulados: [
      { date: '2026-02-15', name: 'ENEM 2024 - Completo', acertos: 98, total: 180 },
      { date: '2026-03-08', name: 'FUVEST 2025 - 1ª Fase', acertos: 51, total: 72 },
      { date: '2026-03-29', name: 'ENEM 2023 - Dia 1', acertos: 55, total: 90 },
    ],
    books: { completed: 2, total: 9, reading: 'Caminho de pedras', currentPage: 87 },
    revisions: { total: 18, completedOnTime: 14, late: 3, pending: 1 },
    goals: { weeklyCompleted: 4, weeklyTotal: 6 },
    attendance: { present: 38, total: 42 },
  },
  { 
    id: 's2', name: 'Ana Beatriz Silva', turma: 'Extensivo Presencial', lastActive: '2026-04-12', 
    diagnosis: { avg: 4.1, bySubject: { 'Matemática': 4.5, 'Português': 4, 'História': 3.8, 'Geografia': 4.2, 'Biologia': 4, 'Física': 4.5, 'Química': 3.8 } }, 
    simulados: [{ date: '2026-03-15', name: 'ENEM 2024', acertos: 132, total: 180 }, { date: '2026-03-08', name: 'FUVEST 2025 - 1ª Fase', acertos: 62, total: 72 }], 
    books: { completed: 4, total: 9, reading: 'A paixão segundo G. H.', currentPage: 45 }, 
    revisions: { total: 22, completedOnTime: 20, late: 1, pending: 1 }, 
    goals: { weeklyCompleted: 5, weeklyTotal: 6 }, 
    attendance: { present: 41, total: 42 } 
  },
  { 
    id: 's3', name: 'Carlos Eduardo Santos', turma: 'Extensivo Presencial', lastActive: '2026-04-10', 
    diagnosis: { avg: 2.5, bySubject: { 'Matemática': 1.5, 'Português': 3, 'História': 2.8, 'Geografia': 2.5, 'Biologia': 2.2, 'Física': 1.8, 'Química': 2.3 } }, 
    simulados: [{ date: '2026-02-20', name: 'ENEM 2024', acertos: 78, total: 180 }, { date: '2026-03-08', name: 'FUVEST 2025 - 1ª Fase', acertos: 31, total: 72 }], 
    books: { completed: 1, total: 9, reading: 'Nebulosas', currentPage: 20 }, 
    revisions: { total: 8, completedOnTime: 5, late: 2, pending: 1 }, 
    goals: { weeklyCompleted: 2, weeklyTotal: 6 }, 
    attendance: { present: 28, total: 42 } 
  },
  { 
    id: 's4', name: 'Fernanda Oliveira', turma: 'Extensivo Presencial', lastActive: '2026-04-12', 
    diagnosis: { avg: 3.8, bySubject: { 'Matemática': 3.5, 'Português': 4.2, 'História': 4, 'Geografia': 3.8, 'Biologia': 3.5, 'Física': 3, 'Química': 3.8 } }, 
    simulados: [{ date: '2026-03-10', name: 'FUVEST 2025', acertos: 48, total: 72 }, { date: '2026-03-29', name: 'ENEM 2023 - Dia 1', acertos: 65, total: 90 }], 
    books: { completed: 3, total: 9, reading: 'Memórias de Martha', currentPage: 112 }, 
    revisions: { total: 15, completedOnTime: 13, late: 1, pending: 1 }, 
    goals: { weeklyCompleted: 6, weeklyTotal: 6 }, 
    attendance: { present: 40, total: 42 } 
  },
  { 
    id: 's5', name: 'Gabriel Martins', turma: 'Extensivo Presencial', lastActive: '2026-04-09', 
    diagnosis: { avg: 2.8, bySubject: { 'Matemática': 2, 'Português': 3.5, 'História': 3, 'Geografia': 2.5, 'Biologia': 2.5, 'Física': 2, 'Química': 3 } }, 
    simulados: [], 
    books: { completed: 0, total: 9, reading: null, currentPage: 0 }, 
    revisions: { total: 4, completedOnTime: 2, late: 2, pending: 0 }, 
    goals: { weeklyCompleted: 1, weeklyTotal: 6 }, 
    attendance: { present: 25, total: 42 } 
  },
];

const classSummary = {
  turma: 'Extensivo Presencial',
  totalStudents: mockStudents.length,
  avgDiagnosis: (mockStudents.reduce((s, st) => s + st.diagnosis.avg, 0) / mockStudents.length).toFixed(1),
  avgSimuladoScore: '58%',
  avgAttendance: '81%',
  booksAvgCompletion: '22%',
  revisionsOnTimeRate: '78%',
};

const mockNotifications = [
  { id: 1, title: 'Risco de Evasão', text: 'Gabriel Martins e Carlos Eduardo faltaram às últimas 3 aulas.', type: 'danger', time: 'Há 2h', icon: AlertTriangle },
  { id: 2, title: 'Meta Atingida', text: 'Ana Beatriz atingiu 80% de acertos no último simulado da FUVEST.', type: 'success', time: 'Há 5h', icon: Trophy },
  { id: 3, title: 'Revisões Atrasadas', text: '3 alunos estão com mais de 5 revisões de História acumuladas.', type: 'warning', time: 'Ontem', icon: Clock },
];

const classSimulados = [
  { id: 1, name: 'ENEM 2024 - Completo', avgScore: 56, date: '15 Fev', totalStudents: 4 },
  { id: 2, name: 'FUVEST 2025 - 1ª Fase', avgScore: 48, date: '08 Mar', totalStudents: 4 },
  { id: 3, name: 'ENEM 2023 - Dia 1', avgScore: 66, date: '29 Mar', totalStudents: 2 },
];

// ============================================================================
// 2. CONTEXTO GLOBAL DO PROFESSOR
// ============================================================================

const TeacherContext = createContext();

const TeacherProvider = ({ children, initialView = 'overview' }) => {
  const [currentView, setCurrentView] = useState(initialView);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0].id);

  useEffect(() => {
    if (initialView) {
      setCurrentView(initialView);
    }
  }, [initialView]);

  const navigate = (view) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const selectedStudent = useMemo(
    () => mockStudents.find(s => s.id === selectedStudentId) || mockStudents[0],
    [selectedStudentId]
  );

  return (
    <TeacherContext.Provider value={{ 
      currentView, navigate, 
      sidebarOpen, setSidebarOpen, 
      teacherProfile, mockStudents, classSummary,
      selectedStudentId, setSelectedStudentId, selectedStudent
    }}>
      {children}
    </TeacherContext.Provider>
  );
};

const useTeacher = () => useContext(TeacherContext);

// ============================================================================
// 3. COMPONENTES UI REUTILIZÁVEIS (Glassmorphism)
// ============================================================================

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ progress, max = 100, colorClass = 'bg-indigo-500', heightClass = 'h-2' }) => {
  const percent = Math.min(100, Math.max(0, (progress / max) * 100));
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
        style={{ width: `${percent}%` }} 
      />
    </div>
  );
};

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-teal-50 text-teal-600 border border-teal-100',
    warning: 'bg-orange-50 text-orange-600 border border-orange-100',
    danger: 'bg-red-50 text-red-600 border border-red-100',
    primary: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ============================================================================
// 4. VIEWS DA APLICAÇÃO
// ============================================================================

const OverviewView = () => {
  const { teacherProfile, classSummary, mockStudents, navigate, setSelectedStudentId } = useTeacher();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Banner Principal - Ajustado para exibir "Visão Geral" na tag */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-900 p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="mb-4 bg-indigo-500/20 text-indigo-200 border-indigo-400/20 inline-block">
            Visão Geral da Turma
          </Badge>
          <h2 className="text-3xl font-bold mb-2">Olá, Prof. {teacherProfile.name.split(' ')[0]}!</h2>
          <p className="text-indigo-100/80 mb-6">
            Aqui está o resumo geral de seus alunos. O engajamento médio está ótimo, mas há 2 alunos que precisam de atenção na frequência.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute -bottom-24 right-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
      </div>

      {/* KPIs da Turma */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Média Diagnóstico', value: classSummary.avgDiagnosis, icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50', sub: '/ 5.0' },
          { label: 'Aproveitamento (Sim)', value: classSummary.avgSimuladoScore, icon: TrendingUp, color: 'text-teal-500', bg: 'bg-teal-50' },
          { label: 'Revisões em Dia', value: classSummary.revisionsOnTimeRate, icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Presença Média', value: classSummary.avgAttendance, icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
        ].map((kpi, idx) => (
          <Card key={idx} className="flex flex-col gap-3 p-5 hover:-translate-y-1 transition-transform cursor-default">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color}`}>
              <kpi.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-800 mt-1">
                {kpi.value} <span className="text-sm font-normal text-slate-400">{kpi.sub}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabela de Alunos Rápida */}
      <Card noPadding>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Desempenho por Aluno</h3>
          <button 
            onClick={() => navigate('students')}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Ver Relatório Completo <ChevronRight size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6 w-1/3">Aluno</th>
                <th className="p-4">Nivelamento (Média)</th>
                <th className="p-4">Presença</th>
                <th className="p-4 text-right pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudents.map((student) => (
                <tr 
                  key={student.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    navigate('students');
                  }}
                >
                  <td className="p-4 pl-6 font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                        {student.name.charAt(0)}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3 max-w-[150px]">
                      <span className="font-semibold text-slate-700 w-6">{student.diagnosis.avg}</span>
                      <ProgressBar 
                        progress={student.diagnosis.avg} 
                        max={5} 
                        colorClass={student.diagnosis.avg >= 3.5 ? 'bg-teal-500' : student.diagnosis.avg >= 2.5 ? 'bg-orange-400' : 'bg-red-500'} 
                      />
                    </div>
                  </td>
                  <td className="p-4 align-middle font-medium text-slate-600">
                    {Math.round((student.attendance.present / student.attendance.total) * 100)}%
                  </td>
                  <td className="p-4 text-right pr-6 align-middle">
                    {student.diagnosis.avg < 3.0 || (student.attendance.present / student.attendance.total) < 0.75 ? (
                      <Badge variant="warning">Atenção</Badge>
                    ) : (
                      <Badge variant="success">No Ritmo</Badge>
                    )}
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

const StudentsDetailView = () => {
  const { mockStudents, selectedStudentId, setSelectedStudentId, selectedStudent } = useTeacher();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = mockStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)]">
      
      {/* 1. SIDEBAR DE ALUNOS */}
      <Card className="w-full lg:w-80 flex flex-col flex-shrink-0 h-full overflow-hidden" noPadding>
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users size={18} className="text-indigo-500" />
            Lista de Alunos
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar aluno..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredStudents.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group
                ${selectedStudentId === student.id 
                  ? 'bg-indigo-50 border border-indigo-100 shadow-sm' 
                  : 'hover:bg-slate-50 border border-transparent'
                }`}
            >
              <div className="min-w-0">
                <p className={`font-semibold text-sm truncate ${selectedStudentId === student.id ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-600'}`}>
                  {student.name}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">Visto: {student.lastActive.split('-').reverse().join('/')}</p>
              </div>
              <ChevronRight size={16} className={selectedStudentId === student.id ? 'text-indigo-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'} />
            </button>
          ))}
        </div>
      </Card>

      {/* 2. ÁREA PRINCIPAL: DETALHES DO ALUNO */}
      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {selectedStudent ? (
          <div className="space-y-6">
            <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-indigo-50/30">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-black shadow-sm border border-indigo-200/50">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedStudent.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">Média Global Diagnóstico: <span className="font-bold text-slate-700">{selectedStudent.diagnosis.avg}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={selectedStudent.revisions.late > 2 ? 'warning' : 'success'}>
                  {selectedStudent.revisions.late} Revisões Atrasadas
                </Badge>
              </div>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              <Card>
                <div className="flex items-center gap-2 mb-6">
                  <Target size={18} className="text-indigo-500" />
                  <h4 className="font-bold text-slate-800">Diagnóstico por Disciplina</h4>
                </div>
                <div className="space-y-4">
                  {Object.entries(selectedStudent.diagnosis.bySubject).map(([subject, score]) => (
                    <div key={subject} className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-slate-600 w-24 truncate">{subject}</span>
                      <div className="flex-1">
                        <ProgressBar 
                          progress={score} 
                          max={5} 
                          colorClass={score >= 4 ? 'bg-teal-500' : score >= 3 ? 'bg-blue-500' : 'bg-orange-400'} 
                          heightClass="h-2.5"
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-800 w-8 text-right">{score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-6">
                <Card>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={18} className="text-blue-500" />
                    <h4 className="font-bold text-slate-800">Engajamento & Metas</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Metas da Semana</p>
                      <p className="text-2xl font-black text-slate-800">
                        {selectedStudent.goals.weeklyCompleted} <span className="text-base font-normal text-slate-400">/ {selectedStudent.goals.weeklyTotal}</span>
                      </p>
                      <ProgressBar progress={selectedStudent.goals.weeklyCompleted} max={selectedStudent.goals.weeklyTotal} colorClass="bg-blue-500 mt-3" />
                    </div>
                    
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Presença</p>
                      <p className="text-2xl font-black text-slate-800">
                        {Math.round((selectedStudent.attendance.present / selectedStudent.attendance.total) * 100)}%
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-2">
                        {selectedStudent.attendance.present} de {selectedStudent.attendance.total} aulas
                      </p>
                    </div>
                  </div>

                  {selectedStudent.books.reading && (
                    <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Leitura Atual</p>
                        <p className="font-bold text-slate-800">{selectedStudent.books.reading}</p>
                        <p className="text-sm text-slate-500">Página {selectedStudent.books.currentPage}</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              <Card className="xl:col-span-2" noPadding>
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                  <FileText size={18} className="text-orange-500" />
                  <h4 className="font-bold text-slate-800">Histórico de Simulados</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                        <th className="p-4 pl-6">Data</th>
                        <th className="p-4">Simulado</th>
                        <th className="p-4">Acertos</th>
                        <th className="p-4 text-right pr-6">Aproveitamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedStudent.simulados.length > 0 ? selectedStudent.simulados.map((sim, idx) => {
                        const percent = Math.round((sim.acertos / sim.total) * 100);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 pl-6 text-sm text-slate-600 font-medium">
                              {sim.date.split('-').reverse().join('/')}
                            </td>
                            <td className="p-4 font-bold text-slate-800">{sim.name}</td>
                            <td className="p-4 text-sm font-semibold text-slate-600">
                              {sim.acertos} / {sim.total}
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-sm font-bold border ${
                                percent >= 75 ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                                percent >= 50 ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                'bg-orange-50 text-orange-700 border-orange-200'
                              }`}>
                                {percent}%
                              </span>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-slate-500">
                            Nenhum simulado registrado para este aluno ainda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Users size={48} className="mb-4 opacity-20" />
            <p>Selecione um aluno na lista para ver os detalhes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SimuladosClassView = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <BarChart2 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Desempenho Geral da Turma</h3>
            <p className="text-sm text-slate-500">Média de aproveitamento nos exames realizados.</p>
          </div>
        </div>

        <div className="space-y-6">
          {classSimulados.map(sim => (
            <div key={sim.id} className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-bold text-slate-800">{sim.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Realizado em {sim.date} • {sim.totalStudents} alunos participaram</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-black ${sim.avgScore >= 60 ? 'text-teal-500' : sim.avgScore >= 50 ? 'text-blue-500' : 'text-orange-500'}`}>
                    {sim.avgScore}%
                  </span>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Média Turma</p>
                </div>
              </div>
              <ProgressBar progress={sim.avgScore} colorClass={sim.avgScore >= 60 ? 'bg-teal-500' : sim.avgScore >= 50 ? 'bg-blue-500' : 'bg-orange-500'} heightClass="h-3" />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card noPadding>
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            <h4 className="font-bold text-slate-800">Destaques (Top 3)</h4>
          </div>
          <div className="p-2">
            {mockStudents
              .filter(s => s.simulados.length > 0)
              .sort((a, b) => {
                const avgA = a.simulados.reduce((acc, s) => acc + (s.acertos/s.total), 0) / a.simulados.length;
                const avgB = b.simulados.reduce((acc, s) => acc + (s.acertos/s.total), 0) / b.simulados.length;
                return avgB - avgA;
              })
              .slice(0, 3)
              .map((student, idx) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{student.name}</p>
                </div>
                <Badge variant="success">Excelente</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card noPadding>
          <div className="p-6 border-b border-slate-100 flex items-center gap-2">
            <AlertTriangle size={20} className="text-orange-500" />
            <h4 className="font-bold text-slate-800">Atenção Necessária</h4>
          </div>
          <div className="p-2">
            {mockStudents
              .filter(s => s.simulados.length > 0)
              .sort((a, b) => {
                const avgA = a.simulados.reduce((acc, s) => acc + (s.acertos/s.total), 0) / a.simulados.length;
                const avgB = b.simulados.reduce((acc, s) => acc + (s.acertos/s.total), 0) / b.simulados.length;
                return avgA - avgB;
              })
              .slice(0, 3)
              .map((student) => (
              <div key={student.id} className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
                  <AlertCircle size={14} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{student.name}</p>
                </div>
                <Badge variant="warning">Reforço</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const AttendanceView = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-between items-center h-full">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Frequência da Turma</h3>
              <p className="text-sm text-slate-500 mt-1">Acompanhamento de presença nas aulas regulares.</p>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-indigo-600">81%</span>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Média Global</p>
            </div>
          </div>
        </Card>
        <Card className="flex flex-col justify-center bg-red-50 border-red-100">
           <div className="flex items-center gap-3 mb-2">
             <AlertTriangle className="text-red-500" size={24} />
             <span className="text-2xl font-black text-red-600">2</span>
           </div>
           <p className="text-sm font-semibold text-red-700 leading-tight">Alunos em risco de evasão (&lt; 75%)</p>
        </Card>
      </div>

      <Card noPadding>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h4 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-500"/>
            Relatório de Presença
          </h4>
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            <Filter size={16} /> Filtrar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4 pl-6">Aluno</th>
                <th className="p-4">Presença (%)</th>
                <th className="p-4">Aulas Presentes</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudents
                .sort((a,b) => (a.attendance.present / a.attendance.total) - (b.attendance.present / b.attendance.total))
                .map(student => {
                  const percent = Math.round((student.attendance.present / student.attendance.total) * 100);
                  const isAtRisk = percent < 75;
                  
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-slate-800">{student.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3 max-w-[120px]">
                          <span className={`font-semibold w-8 ${isAtRisk ? 'text-red-600' : 'text-slate-700'}`}>{percent}%</span>
                          <ProgressBar 
                            progress={percent} 
                            colorClass={isAtRisk ? 'bg-red-500' : percent > 90 ? 'bg-teal-500' : 'bg-blue-500'} 
                          />
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 font-medium">
                        {student.attendance.present} <span className="text-slate-400">/ {student.attendance.total}</span>
                      </td>
                      <td className="p-4">
                        {isAtRisk ? (
                          <Badge variant="danger">Risco</Badge>
                        ) : (
                          <Badge variant="success">Regular</Badge>
                        )}
                      </td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


// ============================================================================
// 5. SHELL DE NAVEGAÇÃO DO PROFESSOR E HEADER COMPLETO
// ============================================================================

const SidebarItem = ({ icon: Icon, label, id }) => {
  const { currentView, navigate } = useTeacher();
  const isActive = currentView === id;

  return (
    <button
      onClick={() => navigate(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
        ${isActive ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'}
      `}
    >
      <Icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
      {label}
    </button>
  );
};

const Header = ({ onLogout }) => {
  const { currentView, setSidebarOpen, classSummary } = useTeacher();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getViewTitle = () => {
    switch (currentView) {
      case 'overview': return 'Painel Principal';
      case 'students': return 'Acompanhamento Individual';
      case 'simulados-class': return 'Análise de Simulados';
      case 'attendance': return 'Frequência da Turma';
      case 'planner': return 'Planejador de Aula';
      default: return currentView.replace('-', ' ');
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-30 relative">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-lg text-slate-800 capitalize hidden sm:block">
          {getViewTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Identificador de Turma (Foi movido do Banner para cá) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
          <GraduationCap size={16} className="text-indigo-500" />
          <span className="text-xs font-bold text-indigo-700">{classSummary.turma}</span>
        </div>

        {/* Botão e Popover de Notificações */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative
              ${showNotifications ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-500'}
            `}
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h4 className="font-bold text-slate-800">Notificações</h4>
                <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Marcar como lidas</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100">
                {mockNotifications.map(notif => (
                  <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3">
                    <div className={`p-2 rounded-full h-fit flex-shrink-0
                      ${notif.type === 'danger' ? 'bg-red-50 text-red-500' : 
                        notif.type === 'warning' ? 'bg-orange-50 text-orange-500' : 
                        'bg-teal-50 text-teal-500'}
                    `}>
                      <notif.icon size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.text}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Menu do Professor (Perfil) */}
        <div className="relative" ref={profileDropdownRef}>
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity text-left"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
              {teacherProfile.name.charAt(0)}
            </div>
            <div className="hidden md:block text-sm">
              <p className="font-bold text-slate-800 leading-none">{teacherProfile.name}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">Professor(a)</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-2 flex flex-col">
                <button className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-left">
                  <Settings size={16} /> Configurações
                </button>
                <button className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-left">
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
  );
};

const Layout = ({ onLogout }) => {
  const { currentView, sidebarOpen, setSidebarOpen } = useTeacher();

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-md">
            P
          </div>
          <div>
            <h1 className="font-bold text-slate-800 leading-tight">Painel Docente</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cursinho da Poli</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-6">Gestão</p>
          <SidebarItem id="overview" icon={LayoutDashboard} label="Visão Geral" />
          <SidebarItem id="students" icon={Users} label="Meus Alunos" />
          <SidebarItem id="planner" icon={BookOpen} label="Planejador de Aula" />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-8">Relatórios</p>
          <SidebarItem id="simulados-class" icon={BarChart2} label="Análise de Simulados" />
          <SidebarItem id="attendance" icon={Calendar} label="Frequência" />
        </div>
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
        <Header onLogout={onLogout} />

        {/* Área de Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          {currentView === 'overview' && <OverviewView />}
          {currentView === 'students' && <StudentsDetailView />}
          {currentView === 'planner' && <LessonPlannerView />}
          {currentView === 'simulados-class' && <SimuladosClassView />}
          {currentView === 'attendance' && <AttendanceView />}
        </div>
      </main>
    </div>
  );
};

// ============================================================================
// 6. COMPONENTE RAIZ
// ============================================================================

export default function TeacherApp({ initialView = 'overview', onLogout }) {
  return (
    <TeacherProvider initialView={initialView}>
      <Layout onLogout={onLogout} />
    </TeacherProvider>
  );
}
