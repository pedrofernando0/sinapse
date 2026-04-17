import React, { useState, useMemo } from 'react';
import { 
  Target, Info, MapPin, Users, BookOpen, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  ChevronRight, Award, Sliders
} from 'lucide-react';

// ============================================================================
// 1. DADOS MOCKADOS (Configurações de Cursos e Histórico)
// ============================================================================

const universities = [
  { id: 'usp', name: 'USP (Universidade de São Paulo)' },
  { id: 'ufrj', name: 'UFRJ (Universidade Federal do Rio de Janeiro)' },
  { id: 'ufmg', name: 'UFMG (Universidade Federal de Minas Gerais)' },
];

const quotas = [
  { id: 'ac', name: 'Ampla Concorrência (AC)' },
  { id: 'ep', name: 'Escola Pública (EP)' },
  { id: 'ppi', name: 'Pretos, Pardos e Indígenas (PPI)' },
];

const coursesData = [
  {
    id: 'med',
    name: 'Medicina',
    weights: { usp: { mat: 1, nat: 3, hum: 1, lin: 2, red: 2 }, ufrj: { mat: 2, nat: 3, hum: 1, lin: 2, red: 3 }, ufmg: { mat: 1, nat: 1, hum: 1, lin: 1, red: 1 } },
    cutoffs: {
      usp: {
        ac: [812, 815, 810, 818, 820],
        ep: [775, 780, 778, 785, 790],
        ppi: [750, 755, 750, 760, 765],
      },
      ufrj: {
        ac: [795, 800, 798, 805, 808],
        ep: [760, 765, 762, 770, 775],
        ppi: [740, 745, 742, 750, 755],
      },
      ufmg: {
        ac: [790, 795, 792, 798, 802],
        ep: [755, 760, 758, 765, 770],
        ppi: [735, 740, 738, 745, 750],
      }
    }
  },
  {
    id: 'comp',
    name: 'Engenharia da Computação',
    weights: { usp: { mat: 3, nat: 2, hum: 1, lin: 1, red: 1 }, ufrj: { mat: 3, nat: 2, hum: 1, lin: 1, red: 2 }, ufmg: { mat: 1, nat: 1, hum: 1, lin: 1, red: 1 } },
    cutoffs: {
      usp: {
        ac: [780, 785, 790, 795, 805],
        ep: [745, 750, 755, 760, 770],
        ppi: [720, 725, 730, 735, 745],
      },
      ufrj: {
        ac: [770, 775, 780, 785, 790],
        ep: [735, 740, 745, 750, 755],
        ppi: [710, 715, 720, 725, 730],
      },
      ufmg: {
        ac: [765, 770, 775, 780, 785],
        ep: [730, 735, 740, 745, 750],
        ppi: [705, 710, 715, 720, 725],
      }
    }
  },
  {
    id: 'dir',
    name: 'Direito',
    weights: { usp: { mat: 1, nat: 1, hum: 3, lin: 3, red: 2 }, ufrj: { mat: 1, nat: 1, hum: 3, lin: 2, red: 3 }, ufmg: { mat: 1, nat: 1, hum: 1, lin: 1, red: 1 } },
    cutoffs: {
      usp: {
        ac: [760, 765, 762, 768, 770],
        ep: [725, 730, 728, 735, 738],
        ppi: [700, 705, 702, 710, 712],
      },
      ufrj: {
        ac: [750, 755, 752, 758, 760],
        ep: [715, 720, 718, 725, 728],
        ppi: [690, 695, 692, 700, 702],
      },
      ufmg: {
        ac: [745, 750, 748, 754, 756],
        ep: [710, 715, 712, 718, 720],
        ppi: [685, 690, 688, 695, 698],
      }
    }
  }
];

const areasList = [
  { id: 'mat', label: 'Matemática e Suas Tecnologias', color: 'bg-blue-500', min: 300, max: 985 },
  { id: 'nat', label: 'Ciências da Natureza', color: 'bg-green-500', min: 300, max: 890 },
  { id: 'hum', label: 'Ciências Humanas', color: 'bg-orange-500', min: 300, max: 860 },
  { id: 'lin', label: 'Linguagens e Códigos', color: 'bg-purple-500', min: 300, max: 820 },
  { id: 'red', label: 'Redação', color: 'bg-pink-500', min: 0, max: 1000 },
];

const years = [2021, 2022, 2023, 2024, 2025];

// ============================================================================
// 2. COMPONENTES VISUAIS AUXILIARES
// ============================================================================

// Gráfico Radial / Velocímetro
const ProbabilityGauge = ({ probability }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Meio círculo:
  const strokeDashoffset = circumference - (probability / 100) * (circumference / 2);

  let color = 'text-red-500';
  if (probability >= 75) color = 'text-teal-500';
  else if (probability >= 40) color = 'text-yellow-500';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-48 h-28 transform rotate-180" viewBox="0 0 140 70">
        {/* Background Arc */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={circumference / 2}
          className="text-slate-100"
          strokeLinecap="round"
        />
        {/* Foreground Arc */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-12 flex flex-col items-center">
        <span className={`text-4xl font-black ${color}`}>{probability}%</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Chances</span>
      </div>
    </div>
  );
};

// Gráfico de Linha (Dispersão/Histórico) Customizado via SVG
const HistoricalChart = ({ historicalData, currentScore }) => {
  const minScore = Math.min(...historicalData, currentScore) - 20;
  const maxScore = Math.max(...historicalData, currentScore) + 20;
  
  const normalizeY = (score) => {
    return 180 - ((score - minScore) / (maxScore - minScore)) * 140; // SVG height is 200, padding 20
  };

  const normalizeX = (index) => {
    return 40 + (index * (320 / 4)); // SVG width is 400, padding 40
  };

  const points = historicalData.map((score, i) => `${normalizeX(i)},${normalizeY(score)}`).join(' L ');
  const userScoreY = normalizeY(currentScore);

  return (
    <div className="w-full relative bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <svg viewBox="0 0 400 220" className="w-full h-auto overflow-visible">
        {/* Eixos Y (Linhas guias) */}
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 180 - (ratio * 140);
          const scoreLabel = Math.round(minScore + (ratio * (maxScore - minScore)));
          return (
            <g key={i}>
              <line x1="30" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1" />
              <text x="25" y={y + 4} fontSize="10" fill="#94a3b8" textAnchor="end">{scoreLabel}</text>
            </g>
          );
        })}

        {/* Linha da Nota do Usuário */}
        <line x1="30" y1={userScoreY} x2="380" y2={userScoreY} stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" />
        <rect x="345" y={userScoreY - 10} width="45" height="20" rx="10" fill="#3b82f6" />
        <text x="367.5" y={userScoreY + 4} fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">Sua Nota</text>

        {/* Caminho Histórico */}
        <path d={`M ${points}`} fill="none" stroke="#94a3b8" strokeWidth="3" />
        
        {/* Pontos Históricos */}
        {historicalData.map((score, i) => (
          <g key={i}>
            <circle cx={normalizeX(i)} cy={normalizeY(score)} r="5" fill="white" stroke="#64748b" strokeWidth="2" />
            <text x={normalizeX(i)} y={normalizeY(score) - 12} fontSize="11" fill="#475569" fontWeight="bold" textAnchor="middle">
              {score}
            </text>
            {/* Eixo X Labels */}
            <text x={normalizeX(i)} y="205" fontSize="12" fill="#64748b" fontWeight="bold" textAnchor="middle">
              {years[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================

export default function TriSimulator() {
  const [scores, setScores] = useState({
    mat: 720,
    nat: 680,
    hum: 700,
    lin: 690,
    red: 880,
  });

  const [filters, setFilters] = useState({
    course: 'med',
    university: 'usp',
    quota: 'ac',
  });

  const handleScoreChange = (area, value) => {
    setScores(prev => ({ ...prev, [area]: Number(value) }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Cálculos Derivados
  const simulationResult = useMemo(() => {
    const selectedCourse = coursesData.find(c => c.id === filters.course);
    const weights = selectedCourse.weights[filters.university];
    const historicalCutoffs = selectedCourse.cutoffs[filters.university][filters.quota];
    const latestCutoff = historicalCutoffs[historicalCutoffs.length - 1];

    // Calcula nota ponderada
    let totalWeight = 0;
    let weightedSum = 0;
    
    Object.keys(weights).forEach(area => {
      weightedSum += scores[area] * weights[area];
      totalWeight += weights[area];
    });

    const finalScore = parseFloat((weightedSum / totalWeight).toFixed(2));
    
    // Motor Simples de Probabilidade (Distância da Nota de Corte)
    // Se nota >= cutoff + 15 -> 99%
    // Se nota == cutoff -> 50%
    // Se nota <= cutoff - 40 -> 5%
    const difference = finalScore - latestCutoff;
    let prob = 50 + (difference * 2.5); // Multiplicador ajustado para suavidade
    prob = Math.max(1, Math.min(99, prob)); // Trava entre 1 e 99

    return {
      finalScore,
      latestCutoff,
      difference,
      probability: Math.round(prob),
      historicalCutoffs,
      weights
    };

  }, [scores, filters]);

  return (
    <div className="min-h-screen bg-slate-100/50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                <Target size={24} />
              </div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Simulador TRI</h1>
            </div>
            <p className="text-slate-500 font-medium">Estime suas chances de aprovação com base nas notas históricas do SiSU e FUVEST.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
            <Info size={16} />
            Como funciona o TRI?
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lado Esquerdo: Filtros e Inputs (5 colunas) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card de Filtros */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
                <Sliders size={20} className="text-slate-400" />
                Configurar Meta
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <BookOpen size={14} className="inline mr-1 -mt-1" /> Curso
                  </label>
                  <select 
                    value={filters.course}
                    onChange={(e) => handleFilterChange('course', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {coursesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <MapPin size={14} className="inline mr-1 -mt-1" /> Instituição
                  </label>
                  <select 
                    value={filters.university}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Users size={14} className="inline mr-1 -mt-1" /> Modalidade (Cota)
                  </label>
                  <select 
                    value={filters.quota}
                    onChange={(e) => handleFilterChange('quota', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    {quotas.map(q => <option key={q.id} value={q.id}>{q.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Card de Notas */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-6">
                <Award size={20} className="text-slate-400" />
                Simular Notas
              </h2>
              
              <div className="space-y-6">
                {areasList.map(area => (
                  <div key={area.id} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${area.color}`} />
                        {area.label}
                      </label>
                      <input 
                        type="number"
                        min={area.min}
                        max={area.max}
                        value={scores[area.id]}
                        onChange={(e) => handleScoreChange(area.id, e.target.value)}
                        className="w-20 text-right bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full ${area.color} opacity-20`}
                        style={{ width: '100%' }}
                      />
                      <input 
                        type="range"
                        min={area.min}
                        max={area.max}
                        value={scores[area.id]}
                        onChange={(e) => handleScoreChange(area.id, e.target.value)}
                        className={`absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10`}
                      />
                      <div 
                        className={`h-full rounded-full ${area.color} transition-all duration-150 ease-out`}
                        style={{ width: `${((scores[area.id] - area.min) / (area.max - area.min)) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-400 uppercase">
                      <span>Peso: {simulationResult.weights[area.id]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Lado Direito: Resultados e Gráficos (7 colunas) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Painel de Resultados Principal */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-teal-50 rounded-full blur-3xl -z-10 opacity-50 transform translate-x-1/2 -translate-y-1/2" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Nota Ponderada</h3>
                  <div className="text-5xl font-black text-slate-800 mb-2">{simulationResult.finalScore}</div>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold ${
                    simulationResult.difference >= 0 ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {simulationResult.difference >= 0 ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    {simulationResult.difference > 0 ? '+' : ''}{simulationResult.difference.toFixed(2)} pts da nota de corte
                  </div>
                  
                  <p className="text-slate-500 text-sm mt-4 leading-relaxed">
                    A nota de corte no último ano foi <strong className="text-slate-700">{simulationResult.latestCutoff}</strong>.
                    Com base nos pesos estipulados pela universidade, este é o seu cenário atual.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                  <ProbabilityGauge probability={simulationResult.probability} />
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-slate-800">
                      {simulationResult.probability >= 75 ? 'Excelente Margem de Segurança' :
                       simulationResult.probability >= 40 ? 'Na Zona de Competição' :
                       'Abaixo da Zona Segura'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Estimativa baseada em TRI e desvio padrão histórico.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Gráfico Comparativo Histórico */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Evolução da Nota de Corte</h3>
                  <p className="text-sm text-slate-500 mt-1">Comparativo da sua nota simulada com os últimos 5 anos.</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 rounded-full bg-slate-400" />
                    Histórico
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 border-t-2 border-dashed border-blue-500" />
                    Sua Nota
                  </div>
                </div>
              </div>

              <HistoricalChart 
                historicalData={simulationResult.historicalCutoffs} 
                currentScore={simulationResult.finalScore} 
              />
            </div>

            {/* Dica sobre o TRI */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
                <Info size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Como a Teoria da Resposta ao Item (TRI) afeta isso?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  No ENEM, o valor da sua nota não depende apenas do número de acertos, mas da coerência pedagógica. 
                  Acertar questões fáceis e errar as difíceis gera uma nota maior do que o inverso. 
                  As notas máximas variam a cada ano de acordo com o nível da prova.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
