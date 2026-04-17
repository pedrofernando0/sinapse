import React, { useState } from 'react';
import { Search, Star } from 'lucide-react';

// ============================================================================
// RAIO-X DATA — ranked topics with incidence % (últimos 10 anos)
// ============================================================================

const RAIOX_DATA = {
  enem: {
    id: 'enem',
    title: 'ENEM',
    accent: 'blue',
    source: 'Aprova Total (Raio-X ENEM 2024) e Estratégia Vestibulares.',
    subjects: [
      {
        name: 'Matemática',
        topics: [
          { name: 'Matemática Básica', incidence: 92 },
          { name: 'Estatística e Probabilidade', incidence: 85 },
          { name: 'Geometria Espacial', incidence: 78 },
          { name: 'Funções', incidence: 72 },
          { name: 'Geometria Plana', incidence: 65 },
          { name: 'Probabilidade', incidence: 58 },
        ],
      },
      {
        name: 'Linguagens',
        topics: [
          { name: 'Interpretação de Texto', incidence: 96 },
          { name: 'Gêneros Textuais', incidence: 88 },
          { name: 'Variação Linguística', incidence: 75 },
          { name: 'Funções da Linguagem', incidence: 62 },
          { name: 'Figuras de Linguagem', incidence: 54 },
        ],
      },
      {
        name: 'Biologia',
        topics: [
          { name: 'Ecologia', incidence: 90 },
          { name: 'Fisiologia Humana', incidence: 86 },
          { name: 'Citologia', incidence: 76 },
          { name: 'Genética', incidence: 68 },
          { name: 'Evolução', incidence: 52 },
        ],
      },
    ],
  },
  fuvest: {
    id: 'fuvest',
    title: 'FUVEST',
    accent: 'indigo',
    source: 'Poliedro (últimos 10 anos) e SAS Educação.',
    subjects: [
      {
        name: 'Matemática',
        topics: [
          { name: 'Geometria Plana', incidence: 94 },
          { name: 'Funções', incidence: 88 },
          { name: 'Geometria Espacial', incidence: 82 },
          { name: 'Geometria Analítica', incidence: 76 },
          { name: 'Análise Combinatória', incidence: 68 },
          { name: 'Matrizes', incidence: 45 },
        ],
      },
      {
        name: 'Português',
        topics: [
          { name: 'Literatura Brasileira', incidence: 95 },
          { name: 'Interpretação Crítica', incidence: 90 },
          { name: 'Sintaxe', incidence: 72 },
          { name: 'Movimentos Literários', incidence: 65 },
          { name: 'Ortografia', incidence: 40 },
        ],
      },
      {
        name: 'Biologia',
        topics: [
          { name: 'Ecologia', incidence: 91 },
          { name: 'Genética Clássica', incidence: 85 },
          { name: 'Fisiologia', incidence: 79 },
          { name: 'Botânica', incidence: 62 },
          { name: 'Zoologia', incidence: 55 },
        ],
      },
    ],
  },
  unesp: {
    id: 'unesp',
    title: 'UNESP',
    accent: 'teal',
    source: 'Análise das provas da UNESP dos últimos 10 anos (Vunesp).',
    subjects: [
      {
        name: 'Matemática',
        topics: [
          { name: 'Funções', incidence: 90 },
          { name: 'Geometria Analítica', incidence: 82 },
          { name: 'Progressões', incidence: 74 },
          { name: 'Combinatória', incidence: 68 },
          { name: 'Matrizes e Sistemas', incidence: 58 },
          { name: 'Números Complexos', incidence: 44 },
        ],
      },
      {
        name: 'Química',
        topics: [
          { name: 'Equilíbrio Químico', incidence: 88 },
          { name: 'Eletroquímica', incidence: 82 },
          { name: 'Termoquímica', incidence: 73 },
          { name: 'Cinética Química', incidence: 65 },
          { name: 'Orgânica Avançada', incidence: 54 },
        ],
      },
      {
        name: 'Física',
        topics: [
          { name: 'Óptica', incidence: 87 },
          { name: 'Eletromagnetismo', incidence: 84 },
          { name: 'Ondulatória', incidence: 71 },
          { name: 'Termodinâmica', incidence: 65 },
          { name: 'Física Moderna', incidence: 48 },
        ],
      },
    ],
  },
  unicamp: {
    id: 'unicamp',
    title: 'UNICAMP',
    accent: 'rose',
    source: 'Comvest (UNICAMP) — análise dos últimos 10 anos de provas.',
    subjects: [
      {
        name: 'Redação',
        topics: [
          { name: 'Carta Argumentativa', incidence: 95 },
          { name: 'Ensaio Crítico', incidence: 88 },
          { name: 'Proposta Dissertativa', incidence: 70 },
          { name: 'Texto de Opinião', incidence: 55 },
        ],
      },
      {
        name: 'Matemática',
        topics: [
          { name: 'Geometria (plana/espacial)', incidence: 90 },
          { name: 'Funções e Análise', incidence: 83 },
          { name: 'Combinatória/Probabilidade', incidence: 76 },
          { name: 'Trigonometria', incidence: 67 },
          { name: 'Polinômios', incidence: 48 },
        ],
      },
      {
        name: 'Biologia',
        topics: [
          { name: 'Genética Molecular', incidence: 93 },
          { name: 'Ecossistemas', incidence: 85 },
          { name: 'Fisiologia Vegetal e Animal', incidence: 74 },
          { name: 'Evolução', incidence: 64 },
          { name: 'Paleontologia', incidence: 38 },
        ],
      },
    ],
  },
};

const ACCENT_COLORS = {
  blue: {
    bar: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    activeTab: 'bg-white text-blue-700 shadow-sm',
  },
  indigo: {
    bar: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    activeTab: 'bg-white text-indigo-700 shadow-sm',
  },
  teal: {
    bar: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    activeTab: 'bg-white text-teal-700 shadow-sm',
  },
  rose: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    activeTab: 'bg-white text-rose-700 shadow-sm',
  },
};

// ============================================================================
// RAIO-X SECTION
// ============================================================================

const TopicBar = ({ name, incidence, barColor }) => (
  <div className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-700 font-medium w-44 sm:w-48 flex-shrink-0 truncate" title={name}>
      {name}
    </span>
    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${incidence}%` }}
      />
    </div>
    <span className="text-xs font-bold text-slate-500 w-9 text-right flex-shrink-0">{incidence}%</span>
  </div>
);

export const RaioXSection = () => {
  const [activeExam, setActiveExam] = useState('enem');
  const exam = RAIOX_DATA[activeExam];
  const colors = ACCENT_COLORS[exam.accent];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Raio-X de Incidência</h2>
        <p className="text-slate-500 mt-1 text-sm">
          Assuntos que mais caíram nos últimos 10 anos — filtre por vestibular.
        </p>
      </div>

      {/* Exam tabs */}
      <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
        {Object.values(RAIOX_DATA).map((e) => {
          const isActive = activeExam === e.id;
          const ac = ACCENT_COLORS[e.accent];
          return (
            <button
              key={e.id}
              onClick={() => setActiveExam(e.id)}
              className={`flex-1 min-w-[80px] px-4 py-2.5 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                isActive ? ac.activeTab : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {e.title}
            </button>
          );
        })}
      </div>

      {/* Source */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <Search size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Fonte dos dados</p>
          <p className="text-sm text-slate-600">{exam.source}</p>
        </div>
      </div>

      {/* Subject cards with ranked bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {exam.subjects.map((subject) => (
          <div
            key={subject.name}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800">{subject.name}</h3>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${colors.badge}`}
              >
                {exam.title}
              </span>
            </div>
            <div>
              {subject.topics.map((topic) => (
                <TopicBar
                  key={topic.name}
                  name={topic.name}
                  incidence={topic.incidence}
                  barColor={colors.bar}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MENTORIA VIEW — banner sobre ex-alunos + slot para o hub
// ============================================================================

export const MentoriaView = ({ children }) => (
  <div>
    <div className="bg-blue-900 text-white px-5 sm:px-8 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-blue-800/60">
      <div className="p-2 bg-yellow-400/20 rounded-xl flex-shrink-0">
        <Star size={20} className="text-yellow-400" />
      </div>

      <div className="min-w-0">
        <p className="font-bold text-sm sm:text-base leading-tight">
          Ex-alunos do Cursinho Popular da Poli
        </p>
        <p className="text-blue-200 text-xs mt-0.5">
          Conselhos de carreira · Papo de vida · Organização e estudos
        </p>
      </div>

      <div className="ml-auto hidden md:flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1.5 flex-shrink-0">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <span className="text-yellow-300 text-xs font-bold whitespace-nowrap">
          Mentores aprovados
        </span>
      </div>
    </div>

    {children}
  </div>
);
