import { AnimatePresence, motion } from 'framer-motion';
import { differenceInDays, format, isPast, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Info,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const EXAMS_CONFIG = [
  {
    id: 'enem',
    name: 'ENEM',
    color: '#3b82f6',
    theme: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      ring: 'ring-blue-500/10',
    },
  },
  {
    id: 'fuvest',
    name: 'FUVEST',
    color: '#f97316',
    theme: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-600',
      ring: 'ring-orange-500/10',
    },
  },
  {
    id: 'unicamp',
    name: 'UNICAMP',
    color: '#ef4444',
    theme: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-600',
      ring: 'ring-red-500/10',
    },
  },
  {
    id: 'uerj',
    name: 'UERJ',
    color: '#14b8a6',
    theme: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-600',
      ring: 'ring-teal-500/10',
    },
  },
];

const EXAM_EVENTS = [
  { id: 'e1', examId: 'enem', title: 'Isencao de taxa', date: '2026-04-13' },
  { id: 'e2', examId: 'enem', title: 'Periodo de inscricoes', date: '2026-05-15' },
  { id: 'f1', examId: 'fuvest', title: 'Pedido de isencao', date: '2026-05-20' },
  { id: 'u1', examId: 'unicamp', title: 'Inscricoes', date: '2026-08-01' },
  { id: 'rj1', examId: 'uerj', title: '1o exame de qualificacao', date: '2026-06-09' },
  { id: 'f2', examId: 'fuvest', title: 'Inscricoes', date: '2026-08-17' },
  { id: 'e3', examId: 'enem', title: 'Provas dos dois domingos', date: '2026-11-01' },
  { id: 'u2', examId: 'unicamp', title: 'Provas da 1a fase', date: '2026-10-20' },
  { id: 'f3', examId: 'fuvest', title: 'Provas da 1a fase', date: '2026-11-15' },
  { id: 'f4', examId: 'fuvest', title: 'Provas da 2a fase', date: '2026-12-13' },
  { id: 'u3', examId: 'unicamp', title: 'Provas da 2a fase', date: '2026-12-01' },
];

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-3xl border border-white/40 bg-white/70 p-6 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl ${className}`}
  >
    {children}
  </motion.div>
);

const buildFilteredEvents = (selectedExams) =>
  EXAM_EVENTS.filter((event) => selectedExams.includes(event.examId))
    .map((event) => {
      const parsedDate = parseISO(event.date);

      return {
        ...event,
        parsedDate,
        isPast: isPast(parsedDate) && !isToday(parsedDate),
        daysLeft: differenceInDays(parsedDate, new Date()),
      };
    })
    .sort((firstEvent, secondEvent) => firstEvent.parsedDate - secondEvent.parsedDate);

const buildChartData = (selectedExams) =>
  selectedExams
    .map((examId) => {
      const exam = EXAMS_CONFIG.find((config) => config.id === examId);

      if (!exam) {
        return null;
      }

      return {
        name: exam.name,
        value: EXAM_EVENTS.filter((event) => event.examId === examId).length,
        color: exam.color,
      };
    })
    .filter(Boolean);

export default function CalendarView() {
  const [selectedExams, setSelectedExams] = useState(['enem', 'fuvest']);
  const [integratedEvents, setIntegratedEvents] = useState([]);

  const filteredEvents = useMemo(
    () => buildFilteredEvents(selectedExams),
    [selectedExams],
  );

  const chartData = useMemo(() => buildChartData(selectedExams), [selectedExams]);

  const toggleExam = (examId) => {
    setSelectedExams((currentExams) =>
      currentExams.includes(examId)
        ? currentExams.filter((currentExamId) => currentExamId !== examId)
        : [...currentExams, examId],
    );
  };

  const toggleIntegration = (eventId) => {
    setIntegratedEvents((currentEvents) =>
      currentEvents.includes(eventId)
        ? currentEvents.filter((currentEventId) => currentEventId !== eventId)
        : [...currentEvents, eventId],
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Filtro de exames</h2>
              <p className="text-sm text-slate-500">Quais provas voce quer priorizar agora?</p>
            </div>
            <TrendingUp className="opacity-20 text-blue-500" size={32} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EXAMS_CONFIG.map((exam) => {
              const isActive = selectedExams.includes(exam.id);

              return (
                <motion.button
                  key={exam.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleExam(exam.id)}
                  className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                    isActive
                      ? `${exam.theme.border} ${exam.theme.ring} bg-white shadow-lg ring-2`
                      : 'border-transparent bg-slate-50/50 text-slate-400 opacity-60'
                  }`}
                >
                  <div className={`rounded-full p-2 ${isActive ? exam.theme.bg : 'bg-slate-200'}`}>
                    {isActive ? (
                      <CheckCircle2 size={16} className={exam.theme.text} />
                    ) : (
                      <Circle size={16} />
                    )}
                  </div>
                  <span className="text-xs font-bold tracking-tight">{exam.name}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="relative flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute left-6 top-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Distribuicao
            </h3>
          </div>
          <div className="mt-4 h-48 w-full">
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
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center pt-8">
              <div className="text-center">
                <span className="block text-2xl font-black leading-none text-slate-800">
                  {filteredEvents.length}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Marcos
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Calendar className="text-blue-600" size={24} />
            Cronograma de batalha
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
            {filteredEvents.filter((event) => !event.isPast).length} ativos
          </span>
        </div>

        <GlassCard className="overflow-hidden border-none bg-transparent p-0 shadow-none">
          <div className="relative ml-4 space-y-6 border-l-2 border-slate-200 py-4">
            <AnimatePresence mode="popLayout">
              {filteredEvents.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 pl-8 text-center"
                >
                  <Info className="mx-auto mb-2 text-slate-300" size={40} />
                  <p className="font-medium text-slate-500">
                    Nenhum vestibular selecionado para exibicao.
                  </p>
                </motion.div>
              ) : (
                filteredEvents.map((event, index) => {
                  const exam = EXAMS_CONFIG.find((config) => config.id === event.examId);
                  const isIntegrated = integratedEvents.includes(event.id);

                  if (!exam) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative pl-8"
                    >
                      <div
                        className={`absolute -left-[9px] top-6 h-4 w-4 rounded-full border-4 border-slate-50 transition-transform duration-300 group-hover:scale-125 ${
                          event.isPast
                            ? 'bg-slate-300'
                            : 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                        }`}
                      />

                      <div
                        className={`flex flex-col justify-between gap-4 rounded-3xl border p-5 transition-all md:flex-row md:items-center ${
                          isIntegrated
                            ? 'border-emerald-100 bg-emerald-50/50'
                            : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5'
                        } ${event.isPast ? 'grayscale-[0.5] opacity-60' : ''}`}
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tight ${exam.theme.bg} ${exam.theme.text}`}
                            >
                              {exam.name}
                            </span>
                            <span className="text-xs font-bold text-slate-400">
                              {format(event.parsedDate, "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                            {!event.isPast && event.daysLeft >= 0 ? (
                              <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-500">
                                em {event.daysLeft} dias
                              </span>
                            ) : null}
                          </div>
                          <h4
                            className={`text-base font-bold text-slate-800 ${
                              event.isPast ? 'text-slate-400 line-through' : ''
                            }`}
                          >
                            {event.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3">
                          <motion.button
                            type="button"
                            whileHover={!event.isPast ? { scale: 1.05 } : undefined}
                            whileTap={!event.isPast ? { scale: 0.95 } : undefined}
                            onClick={() => toggleIntegration(event.id)}
                            disabled={event.isPast}
                            className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-black transition-all ${
                              event.isPast
                                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                : isIntegrated
                                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                                  : 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:bg-blue-600'
                            }`}
                          >
                            {isIntegrated ? (
                              <>
                                <CalendarCheck size={18} />
                                No cronograma
                              </>
                            ) : (
                              <>
                                <CalendarPlus size={18} />
                                Integrar
                              </>
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
}
