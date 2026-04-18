import { useMemo, useState } from 'react';
import {
  Award,
  BarChart2,
  CheckSquare,
  Clock,
  Edit2,
  Minus,
  PlusCircle,
  Save,
  Sparkles,
  Trash2,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

const RADAR_DATA = [
  { subject: 'Matemática', score: 72 },
  { subject: 'Humanas', score: 65 },
  { subject: 'Linguagens', score: 80 },
  { subject: 'Natureza', score: 58 },
];

const LineTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-black text-slate-800">{payload[0].value}%</p>
      <p className="text-[11px] font-semibold text-slate-500">{payload[0].payload.name}</p>
    </div>
  );
};

const INITIAL_SIMULADOS = [
  { id: 1, name: 'ENEM 2024 - Dia 1', date: '2026-02-15', acertos: 72, total: 90, level: 'good', time: '04:15' },
  { id: 2, name: 'ENEM 2024 - Dia 2', date: '2026-02-22', acertos: 60, total: 90, level: 'average', time: '04:50' },
  { id: 3, name: 'FUVEST 2025 - 1ª Fase', date: '2026-03-08', acertos: 38, total: 90, level: 'bad', time: '04:00' },
];

const getTodayInput = () => new Date().toISOString().split('T')[0];

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${className}`}>
    {children}
  </div>
);

const EMPTY_FORM = {
  name: '',
  date: getTodayInput(),
  total: '',
  acertos: '',
  time: '',
};

export default function Simulados() {
  const [simulados, setSimulados] = useState(INITIAL_SIMULADOS);
  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const metrics = useMemo(() => {
    if (simulados.length === 0) {
      return {
        avgPercentage: 0,
        totalExams: 0,
        trend: 'neutral',
        bestScore: 0,
        avgTimeStr: '00h00m',
      };
    }

    let totalAcertos = 0;
    let totalQuestoes = 0;
    let bestScore = 0;
    let totalMinutes = 0;

    simulados.forEach((simulado) => {
      totalAcertos += Number(simulado.acertos);
      totalQuestoes += Number(simulado.total);

      const score = Math.round((Number(simulado.acertos) / Number(simulado.total)) * 100);

      if (score > bestScore) {
        bestScore = score;
      }

      const [hours = '0', minutes = '0'] = String(simulado.time).split(':');
      totalMinutes += Number(hours) * 60 + Number(minutes);
    });

    const avgPercentage =
      totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;
    const avgMins = Math.round(totalMinutes / simulados.length);

    return {
      avgPercentage,
      totalExams: simulados.length,
      trend: avgPercentage >= 70 ? 'up' : avgPercentage >= 50 ? 'neutral' : 'down',
      bestScore,
      avgTimeStr: `${String(Math.floor(avgMins / 60)).padStart(2, '0')}h${String(
        avgMins % 60,
      ).padStart(2, '0')}m`,
    };
  }, [simulados]);

  const chartData = useMemo(
    () =>
      [...simulados]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((s) => ({
          name: s.name.length > 14 ? `${s.name.substring(0, 14)}…` : s.name,
          score: Math.round((s.acertos / s.total) * 100),
        })),
    [simulados],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsFormVisible(false);
  };

  const handleEdit = (simulado) => {
    setForm(simulado);
    setEditingId(simulado.id);
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja apagar este simulado?')) {
      setSimulados((currentSimulados) =>
        currentSimulados.filter((simulado) => simulado.id !== id),
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Number(form.acertos) > Number(form.total)) {
      alert('O número de acertos não pode ser maior que o total de questões!');
      return;
    }

    const percentage = Number(form.acertos) / Number(form.total);
    let level = 'bad';

    if (percentage >= 0.7) level = 'good';
    else if (percentage >= 0.5) level = 'average';

    const newExam = {
      ...form,
      id: editingId || Date.now(),
      acertos: Number(form.acertos),
      total: Number(form.total),
      level,
    };

    if (editingId) {
      setSimulados((currentSimulados) =>
        currentSimulados.map((simulado) =>
          simulado.id === editingId ? newExam : simulado,
        ),
      );
    } else {
      setSimulados((currentSimulados) =>
        [newExam, ...currentSimulados].sort(
          (firstExam, secondExam) =>
            new Date(secondExam.date) - new Date(firstExam.date),
        ),
      );
    }

    resetForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Simulados e métricas</h2>
          <p className="mt-1 text-slate-500">
            Cadastre seus resultados e acompanhe sua evolução.
          </p>
        </div>
        {!isFormVisible ? (
          <button
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Novo resultado</span>
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {isFormVisible ? (
            <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/50 shadow-md">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  {editingId ? (
                    <Edit2 size={20} className="text-blue-600" />
                  ) : (
                    <PlusCircle size={20} className="text-blue-600" />
                  )}
                  {editingId ? 'Editar resultado' : 'Cadastrar simulado'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-slate-400 transition-colors hover:text-red-500"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Nome do simulado
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: FUVEST 1ª Fase"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">Data</label>
                    <input
                      type="date"
                      required
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-700 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Total de questões
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      name="total"
                      value={form.total}
                      onChange={handleChange}
                      placeholder="Ex: 90"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Acertos
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      name="acertos"
                      value={form.acertos}
                      onChange={handleChange}
                      placeholder="Ex: 65"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold uppercase text-slate-500">
                      Tempo gasto (HH:MM)
                    </label>
                    <input
                      type="text"
                      required
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"
                      title="Formato de hora válido: HH:MM"
                      placeholder="04:30"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl px-5 py-2 font-bold text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2 font-bold text-white transition-colors hover:bg-slate-700"
                  >
                    <Save size={18} />
                    {editingId ? 'Atualizar' : 'Salvar dados'}
                  </button>
                </div>
              </form>
            </Card>
          ) : null}

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <CheckSquare size={20} className="text-slate-500" />
              Histórico de resultados
            </h3>

            {simulados.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                Nenhum simulado cadastrado ainda.
              </div>
            ) : (
              simulados.map((simulado) => {
                const formattedDate = new Date(simulado.date).toLocaleDateString('pt-BR', {
                  timeZone: 'UTC',
                });
                const percentage = Math.round((simulado.acertos / simulado.total) * 100);
                const ui =
                  simulado.level === 'good'
                    ? { color: 'text-teal-500', bg: 'bg-teal-50', label: 'Bom' }
                    : simulado.level === 'average'
                      ? { color: 'text-orange-500', bg: 'bg-orange-50', label: 'Médio' }
                      : { color: 'text-red-500', bg: 'bg-red-50', label: 'Ruim' };

                return (
                  <Card
                    key={simulado.id}
                    className="group flex flex-col justify-between gap-4 transition-colors hover:border-slate-300 sm:flex-row sm:items-center"
                  >
                    <div className="w-full flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-800">{simulado.name}</h4>
                          <span className="text-xs font-bold text-slate-400">{formattedDate}</span>
                        </div>
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${ui.bg} ${ui.color}`}>
                          {ui.label}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-4 sm:gap-8">
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Acertos
                          </p>
                          <p className="text-lg font-black text-slate-700">
                            {simulado.acertos}{' '}
                            <span className="text-sm font-normal text-slate-400">
                              / {simulado.total}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Taxa
                          </p>
                          <p className={`text-lg font-black ${ui.color}`}>{percentage}%</p>
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Tempo
                          </p>
                          <p className="text-lg font-bold text-slate-600">{simulado.time}h</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-100 pt-4 sm:flex-col sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                      <button
                        onClick={() => handleEdit(simulado)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(simulado.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:flex-none"
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

        <div className="space-y-6">
          <Card className="flex flex-col border-slate-200 bg-white shadow-md">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-800">
                <BarChart2 size={18} className="text-blue-600" />
                Performance global
              </h3>
              <span className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500">
                {metrics.totalExams} exames
              </span>
            </div>

            <div className="relative mb-8 flex justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform drop-shadow-sm">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className="stroke-current text-slate-100"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    className={`stroke-current transition-all duration-1000 ease-out ${
                      metrics.avgPercentage >= 70
                        ? 'text-teal-500'
                        : metrics.avgPercentage >= 50
                          ? 'text-blue-500'
                          : 'text-rose-500'
                    }`}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray="439.8"
                    strokeDashoffset={439.8 - (metrics.avgPercentage / 100) * 439.8}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black tracking-tighter text-slate-800">
                    {metrics.avgPercentage}
                    <span className="text-2xl font-bold text-slate-400">%</span>
                  </span>
                  <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Média
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100/50">
                <Award size={20} className="mb-2 text-amber-500" />
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Melhor marca
                </p>
                <p className="text-2xl font-black text-slate-800">{metrics.bestScore}%</p>
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center transition-colors hover:bg-slate-100/50">
                <Clock size={20} className="mb-2 text-blue-500" />
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Pace médio
                </p>
                <p className="text-2xl font-black text-slate-800">{metrics.avgTimeStr}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Evolução de notas
                </p>
                {metrics.trend === 'up' ? (
                  <TrendingUp size={16} className="text-teal-500" />
                ) : metrics.trend === 'down' ? (
                  <TrendingUp size={16} className="rotate-180 transform text-rose-500" />
                ) : (
                  <Minus size={16} className="text-slate-400" />
                )}
              </div>

              <ResponsiveContainer width="100%" height={110}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="relative overflow-hidden border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm">
            <div className="pointer-events-none absolute -right-4 -top-4 rotate-12 text-indigo-500/10">
              <Sparkles size={80} />
            </div>
            <div className="relative z-10">
              <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-900">
                <Sparkles size={16} className="text-indigo-500" />
                Inteligência de dados
              </h4>
              <p className="text-sm font-medium leading-relaxed text-indigo-900/80">
                Seu rendimento atual sugere viabilidade. Reduzir{' '}
                <strong className="mx-1 rounded border border-indigo-100 bg-white px-1.5 py-0.5 text-indigo-700 shadow-sm">
                  15 min
                </strong>
                do pace fortalecerá sua vantagem competitiva.
              </p>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white shadow-md">
            <div className="mb-4 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800">
                Radar de áreas
              </h3>
            </div>
            <p className="mb-4 text-xs font-medium text-slate-500">
              Pontos fortes e vulnerabilidades por grande área do ENEM.
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                />
                <Radar
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Aproveitamento']}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
