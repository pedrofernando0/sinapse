import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  parseISO, 
  isPast, 
  isFuture, 
  differenceInDays,
  isToday 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  Calendar, 
  CalendarPlus, 
  CalendarCheck, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Filter,
  TrendingUp,
  Info
} from 'lucide-react';

// ============================================================================
// 1. DADOS MOCKADOS E CONFIGURAÇÕES
// ============================================================================

const EXAMS_CONFIG = [
  { id: 'enem', name: 'ENEM', color: '#3b82f6', 
    theme: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', ring: 'ring-blue-500', activeBg: 'bg-blue-600' } },
  { id: 'fuvest', name: 'FUVEST', color: '#f97316', 
    theme: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', ring: 'ring-orange-500', activeBg: 'bg-orange-600' } },
  { id: 'unicamp', name: 'UNICAMP', color: '#ef4444', 
    theme: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', ring: 'ring-red-500', activeBg: 'bg-red-600' } },
  { id: 'uerj', name: 'UERJ', color: '#14b8a6', 
    theme: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', ring: 'ring-teal-500', activeBg: 'bg-teal-600' } },
];

const EXAM_EVENTS = [
  { id: 'e1', examId: 'enem', title: 'Isenção de taxa', date: '2026-04-13' },
  { id: 'e2', examId: 'enem', title: 'Período de Inscrições', date: '2026-05-15' },
  { id: 'f1', examId: 'fuvest', title: 'Pedido de Isenção', date: '2026-05-20' },
  { id: 'u1', examId: 'unicamp', title: 'Inscrições', date: '2026-08-01' },
  { id: 'rj1', examId: 'uerj', title: '1º Exame de Qualificação', date: '2026-06-09' },
  { id: 'f2', examId: 'fuvest', title: 'Inscrições', date: '2026-08-17' },
  { id: 'e3', examId: 'enem', title: 'Provas (1º e 2º Domingo)', date: '2026-11-01' },
  { id: 'u2', examId: 'unicamp', title: 'Provas da 1ª Fase', date: '2026-10-20' },
  { id: 'f3', examId: 'fuvest', title: 'Provas da 1ª Fase', date: '2026-11-15' },
  { id: 'f4', examId: 'fuvest', title: 'Provas da 2ª Fase', date: '2026-12-13' },
  { id: 'u3', examId: 'unicamp', title: 'Provas da 2ª Fase', date: '2026-12-01' },
];

// ============================================================================
// 2. COMPONENTES DE UI
// ============================================================================

const GlassCard = ({ children, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================

export const CalendarManagerView = () => {
  const [selectedExams, setSelectedExams] = useState(['enem', 'fuvest']);
  const [integratedEvents, setIntegratedEvents] = useState([]);

  // Lógica de Filtro e Ordenação com date-fns
  const filteredEvents = useMemo(() => {
    return EXAM_EVENTS
      .filter(event => selectedExams.includes(event.examId))
      .map(event => ({
        ...event,
        parsedDate: parseISO(event.date),
        isPast: isPast(parseISO(event.date)) && !isToday(parseISO(event.date)),
        daysLeft: differenceInDays(parseISO(event.date), new Date())
      }))
      .sort((a, b) => a.parsedDate - b.parsedDate);
  }, [selectedExams]);

  // Dados para o Gráfico de Rosca
  const chartData = useMemo(() => {
    return selectedExams.map(id => {
      const config = EXAMS_CONFIG.find(c => c.id === id);
      const count = EXAM_EVENTS.filter(e => e.examId === id).length;
      return { name: config.name, value: count, color: config.color };
    });
  }, [selectedExams]);

  const toggleExam = (id) => {
    setSelectedExams(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleIntegration = (id) => {
    setIntegratedEvents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* SEÇÃO SUPERIOR: DASHBOARD SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Seletor de Vestibulares */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Filtro de Exames</h2>
              <p className="text-sm text-slate-500">Quais provas você está focando?</p>
            </div>
            <TrendingUp className="text-blue-500 opacity-20" size={32} />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EXAMS_CONFIG.map((exam) => {
              const active = selectedExams.includes(exam.id);
              return (
                <motion.button
                  key={exam.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleExam(exam.id)}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2
                    ${active ? `${exam.theme.border} bg-white shadow-lg ring-2 ${exam.theme.ring}/10` : 'bg-slate-50/50 border-transparent text-slate-400 opacity-60'}
                  `}
                >
                  <div className={`p-2 rounded-full ${active ? exam.theme.bg : 'bg-slate-200'}`}>
                    {active ? <CheckCircle2 size={16} className={exam.theme.text} /> : <Circle size={16} />}
                  </div>
                  <span className="font-bold text-xs tracking-tighter">{exam.name}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        {/* Mini Gráfico de Distribuição */}
        <GlassCard className="flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-6">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Distribuição</h3>
          </div>
          <div className="w-full h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-8">
              <div className="text-center">
                <span className="block text-2xl font-black text-slate-800 leading-none">{filteredEvents.length}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Marcos</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* LINHA DO TEMPO COM FRAMER MOTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={24} />
            Cronograma de Batalha
          </h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
              {filteredEvents.filter(e => !e.isPast).length} Ativos
            </span>
          </div>
        </div>

        <GlassCard className="p-0 overflow-hidden border-none shadow-none bg-transparent">
          <div className="relative ml-4 border-l-2 border-slate-200 space-y-6 py-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="pl-8 py-12 text-center"
                >
                  <Info className="mx-auto text-slate-300 mb-2" size={40} />
                  <p className="text-slate-500 font-medium">Nenhum vestibular selecionado para exibição.</p>
                </motion.div>
              ) : (
                filteredEvents.map((event, idx) => {
                  const exam = EXAMS_CONFIG.find(e => e.id === event.examId);
                  const isIntegrated = integratedEvents.includes(event.id);
                  
                  return (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="relative pl-8 group"
                    >
                      {/* Indicador da Timeline */}
                      <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-slate-50 transition-transform duration-300 group-hover:scale-125
                        ${event.isPast ? 'bg-slate-300' : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'}
                      `} />

                      <div className={`
                        flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl border transition-all
                        ${isIntegrated ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'}
                        ${event.isPast ? 'opacity-60 grayscale-[0.5]' : ''}
                      `}>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter ${exam.theme.bg} ${exam.theme.text}`}>
                              {exam.name}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {format(event.parsedDate, "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                            {!event.isPast && event.daysLeft >= 0 && (
                              <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                                em {event.daysLeft} dias
                              </span>
                            )}
                          </div>
                          <h4 className={`text-base font-bold text-slate-800 ${event.isPast ? 'line-through text-slate-400' : ''}`}>
                            {event.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={!event.isPast ? { scale: 1.05 } : {}}
                            whileTap={!event.isPast ? { scale: 0.95 } : {}}
                            onClick={() => toggleIntegration(event.id)}
                            disabled={event.isPast}
                            className={`
                              flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black transition-all
                              ${event.isPast 
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : isIntegrated
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                  : 'bg-slate-900 text-white hover:bg-blue-600 shadow-lg shadow-slate-200'
                              }
                            `}
                          >
                            {isIntegrated ? (
                              <><CalendarCheck size={18} /> No Cronograma</>
                            ) : (
                              <><CalendarPlus size={18} /> Integrar</>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

// ============================================================================
// 4. PREVIEW SHELL
// ============================================================================
export default function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-5xl mx-auto mb-10 flex items-end justify-between">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-2"
          >
            <div className="w-2 h-6 bg-blue-600 rounded-full" />
            <h1 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Strategy Panel</h1>
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gerenciador de Calendário</h2>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Data Atual</p>
          <p className="text-sm font-black text-slate-800">{format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })}</p>
        </div>
      </div>
      
      <CalendarManagerView />
    </div>
  );
}
