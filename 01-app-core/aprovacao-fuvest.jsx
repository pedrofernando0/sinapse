import React, { useState, useEffect } from 'react';
import { 
  Flame, BookOpen, GitMerge, Zap, ChevronLeft, 
  CheckCircle2, Brain, AlertTriangle, ArrowRight, 
  Target, Maximize2, PenTool, Lightbulb, ChevronRight, Check
} from 'lucide-react';

// ============================================================================
// 1. DADOS MOCKADOS PREMIUM (FUVEST Alta Incidência)
// ============================================================================

const fuvestData = [
  {
    subject: 'Biologia',
    topics: [
      { 
        id: 'bio1', 
        name: 'Ecologia: Relações Ecológicas e Ciclos', 
        incidence: 18.5, 
        isExtreme: true,
        content: {
          text: "A Ecologia representa quase 1/5 da prova de Biologia da FUVEST. O foco principal não é a decoreba, mas a inter-relação dos fenômenos. Atenção especial à sucessão ecológica em diferentes biomas, à poluição antropogênica (como eutrofização e magnificação trófica) e aos ciclos biogeoquímicos do Nitrogênio e Carbono. A banca adora contextualizar esses processos ecológicos com o clima e a geografia brasileira (ex: fogo natural no Cerrado vs. desmatamento na Amazônia).",
          howItFalls: "A FUVEST raramente cobra o conceito isolado. Ela apresentará um gráfico complexo (ex: curva de oxigênio dissolvido em um rio ao longo do tempo) ou uma tirinha, exigindo que você conecte o despejo de matéria orgânica à proliferação bacteriana e à consequente hipóxia.",
          glossary: [
            { term: 'Eutrofização', def: 'Acúmulo excessivo de nutrientes (N e P) na água, gerando proliferação superficial de algas e consequente morte de seres aeróbios por falta de luz e O2.' },
            { term: 'Magnificação Trófica', def: 'Acúmulo de substâncias não biodegradáveis ao longo da cadeia alimentar (níveis tróficos superiores concentram mais toxinas).' },
            { term: 'Hipóxia', def: 'Baixa concentração de oxigênio em um ambiente ou tecido.' }
          ],
          mindmap: {
            root: 'Ecologia (FUVEST)',
            branches: [
              { 
                title: 'Poluição Aquática', 
                nodes: [
                  { name: 'Eutrofização', detail: 'Excesso N/P → Algas → Hipóxia' },
                  { name: 'Magnificação Trófica', detail: 'Toxinas nos níveis superiores' }
                ] 
              },
              { 
                title: 'Ciclos Biogeoquímicos', 
                nodes: [
                  { name: 'Nitrogênio', detail: 'Fixação (Rizóbios) e Nitrificação' },
                  { name: 'Carbono', detail: 'Fotossíntese x Respiração/Combustão' }
                ] 
              },
              { 
                title: 'Biomas Brasileiros', 
                nodes: [
                  { name: 'Cerrado', detail: 'Fogo natural, raízes profundas' },
                  { name: 'Mata Atlântica', detail: 'Alto endemismo, hot-spot' }
                ] 
              }
            ]
          },
          flashcards: [
            { front: "Qual a diferença fisiológica entre Magnificação Trófica e Bioacumulação?", back: "Bioacumulação ocorre no indivíduo ao longo de sua vida. Magnificação ocorre ao longo da cadeia alimentar, onde o predador de topo acumula as toxinas de todas as presas ingeridas." },
            { front: "Quais são as duas etapas da Nitrificação no ciclo do Nitrogênio?", back: "1. Nitrosação (Amônia em Nitrito pelas Nitrossomonas)\n2. Nitratação (Nitrito em Nitrato pelas Nitrobacter)" },
            { front: "Como a eutrofização causa a morte de peixes?", back: "Algas bloqueiam a luz solar → Algas submersas morrem → Bactérias aeróbias se multiplicam decompondo a matéria → Esgotam o O2 da água (Hipóxia) → Peixes morrem asfixiados." }
          ],
          exercise: {
            statement: "(FUVEST) O gráfico a seguir (hipotético) ilustra a variação na concentração de oxigênio dissolvido e de microrganismos ao longo de um rio a partir de um ponto de despejo de esgoto não tratado.\n\nCom base na dinâmica da eutrofização, é correto afirmar que:",
            options: [
              { id: 'A', text: "A mortandade de peixes ocorre imediatamente no ponto de despejo devido à toxicidade intrínseca do esgoto." },
              { id: 'B', text: "As bactérias aeróbicas decompositoras se multiplicam rapidamente consumindo a matéria orgânica e esgotando o oxigênio da água.", isCorrect: true },
              { id: 'C', text: "A Demanda Bioquímica de Oxigênio (DBO) diminui progressivamente assim que o esgoto entra em contato com as algas." },
              { id: 'D', text: "Os organismos fotossintetizantes do fundo do rio aumentam sua taxa metabólica, compensando a perda de oxigênio." }
            ],
            explanation: "O despejo de esgoto introduz excesso de matéria orgânica no corpo d'água. Isso causa uma explosão populacional de bactérias aeróbicas decompositoras. Ao respirarem, essas bactérias consomem o oxigênio dissolvido na água (aumentando a DBO). É essa falta de oxigênio (hipóxia) que causa a morte de peixes e outros seres aeróbicos."
          }
        }
      },
      // ... Outros tópicos omitidos para focar na arquitetura do bio1 ...
      { id: 'bio2', name: 'Fisiologia: Sistema Endócrino', incidence: 14.2, isExtreme: true, content: { text: "Em construção..." } },
      { id: 'bio3', name: 'Genética: Mendel e Mutações', incidence: 10.5, isExtreme: false, content: { text: "Em construção..." } }
    ]
  },
  {
    subject: 'Física',
    topics: [
      { id: 'fis1', name: 'Mecânica: Conservação de Energia', incidence: 22.0, isExtreme: true, content: { text: "Em construção..." } }
    ]
  }
];

// ============================================================================
// 2. COMPONENTES DE UI REUTILIZÁVEIS E PREMIUM
// ============================================================================

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300' : ''} ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ progress, target = 80 }) => {
  const percentage = Math.min((progress / target) * 100, 100);
  return (
    <div className="relative pt-4">
      <div className="flex mb-2 items-center justify-between">
        <div>
          <span className="text-xs font-bold inline-block text-slate-800 uppercase tracking-wider">
            Cobertura Crítica
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-black inline-block text-indigo-600">
            {progress.toFixed(1)}% <span className="text-xs text-slate-400 font-medium">/ {target}%</span>
          </span>
        </div>
      </div>
      <div className="overflow-hidden h-3.5 mb-2 text-xs flex rounded-full bg-slate-100 shadow-inner relative">
        <div 
          style={{ width: `${percentage}%` }} 
          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
        />
        <div className="absolute top-0 bottom-0 w-1 bg-teal-400 z-10 right-0 shadow-[0_0_8px_rgba(45,212,191,0.8)]" title="Alvo de 80% (Pareto)"></div>
      </div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
        <Target size={12} /> Princípio de Pareto (80/20) para máxima conversão.
      </p>
    </div>
  );
};

// ============================================================================
// 3. SUB-MÓDULOS DE ESTUDO (TEORIA, MAPA, FLASHCARDS, EXERCÍCIO)
// ============================================================================

const TeoriaView = ({ content }) => {
  // Highlight glossary words in text
  const renderTextWithGlossary = (text, glossary) => {
    if (!glossary) return text;
    let parts = [{ type: 'text', val: text }];
    
    glossary.forEach(g => {
      let newParts = [];
      parts.forEach(p => {
        if (p.type === 'term') {
          newParts.push(p);
          return;
        }
        const regex = new RegExp(`(${g.term})`, 'gi');
        const split = p.val.split(regex);
        split.forEach(s => {
          if (s.toLowerCase() === g.term.toLowerCase()) {
            newParts.push({ type: 'term', val: s, def: g.def });
          } else if (s) {
            newParts.push({ type: 'text', val: s });
          }
        });
      });
      parts = newParts;
    });

    return parts.map((p, i) => 
      p.type === 'term' ? (
        <span key={i} className="relative group inline-block font-semibold text-indigo-700 bg-indigo-50 px-1 rounded cursor-help border-b border-indigo-200">
          {p.val}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl block">
            <span className="font-bold text-indigo-300 block mb-1">{p.val}</span>
            {p.def}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 block"></span>
          </span>
        </span>
      ) : <span key={i}>{p.val}</span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Texto Base */}
      <div className="prose prose-slate prose-lg max-w-none">
        <div className="text-slate-700 leading-relaxed font-medium text-[1.1rem]">
          {renderTextWithGlossary(content.text, content.glossary)}
        </div>
      </div>

      {/* Como Costuma Cair (Premium Insight) */}
      {content.howItFalls && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Flame size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-sm mb-4">
              <Lightbulb size={18} /> Padrão da Banca (FUVEST)
            </h3>
            <p className="text-slate-200 leading-relaxed font-medium">
              {content.howItFalls}
            </p>
          </div>
        </div>
      )}

      {/* Glossário Destacado */}
      {content.glossary && content.glossary.length > 0 && (
        <div className="mt-8 border border-slate-200 rounded-2xl bg-slate-50/50 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-slate-400" /> Dicionário de Alta Frequência
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.glossary.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                <span className="block font-bold text-indigo-700 mb-1">{item.term}</span>
                <span className="text-sm text-slate-600 font-medium">{item.def}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MindMapView = ({ mindmap }) => {
  if (!mindmap) return <div className="text-center p-12 text-slate-400">Mapa mental não disponível.</div>;

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-x-auto animate-in zoom-in-95 duration-500 hide-scrollbar">
      <div className="min-w-[600px] flex flex-col items-center">
        {/* NÓ CENTRAL */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] border border-indigo-400/30 z-10 relative">
          {mindmap.root}
          {/* Linha vertical descendo do nó raiz */}
          <div className="absolute left-1/2 bottom-[-24px] w-0.5 h-6 bg-slate-700 -translate-x-1/2"></div>
        </div>

        {/* ESTRUTURA DE RAMIFICAÇÕES */}
        <div className="flex gap-4 sm:gap-12 mt-6 relative w-full justify-center">
          {/* Linha horizontal conectando as ramificações */}
          <div className="absolute top-0 left-[15%] right-[15%] h-0.5 bg-slate-700"></div>

          {mindmap.branches.map((branch, i) => (
            <div key={i} className="flex flex-col items-center relative flex-1">
              {/* Linha vertical conectando a linha horizontal ao ramo */}
              <div className="w-0.5 h-6 bg-slate-700 mb-2"></div>
              
              {/* Título do Ramo */}
              <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl font-bold text-sm text-indigo-300 whitespace-nowrap z-10 mb-6 shadow-lg">
                {branch.title}
              </div>

              {/* Sub-nós */}
              <div className="flex flex-col gap-3 w-full max-w-[220px]">
                {branch.nodes.map((node, j) => (
                  <div key={j} className="relative group">
                    <div className="bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 p-4 rounded-xl transition-colors text-left relative z-10">
                      <div className="w-1.5 h-1.5 bg-teal-400 rounded-full absolute left-4 top-[22px]"></div>
                      <h4 className="font-bold text-slate-200 text-sm pl-4 mb-1 leading-tight">{node.name}</h4>
                      <p className="text-xs text-slate-400 pl-4 leading-snug">{node.detail}</p>
                    </div>
                    {/* Linha conectando os sub-nós */}
                    {j !== branch.nodes.length - 1 && (
                      <div className="absolute left-1/2 -bottom-3 w-0.5 h-3 bg-slate-700/50 -translate-x-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Flashcard = ({ card }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[280px] cursor-pointer group perspective-1000"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={`w-full h-full transition-all duration-500 ease-out preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
        
        {/* FRENTE */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-sm hover:border-indigo-300 transition-colors">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 flex-shrink-0">
            <Zap size={20} />
          </div>
          <div className="flex-1 flex items-center justify-center overflow-y-auto w-full hide-scrollbar">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 text-center leading-snug">
              {card.front}
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 flex items-center gap-1 flex-shrink-0">
            Clique para virar <ArrowRight size={12} />
          </span>
        </div>

        {/* VERSO */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-lg">
          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-indigo-200 mb-4 flex-shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div className="flex-1 flex items-center justify-center overflow-y-auto w-full hide-scrollbar">
            <p className="text-base sm:text-lg font-medium text-white text-center leading-relaxed">
              {card.back}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

const ActiveRecallView = ({ flashcards }) => {
  if (!flashcards || flashcards.length === 0) return <div className="text-center p-12 text-slate-400">Flashcards não disponíveis.</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h3 className="text-lg font-bold text-slate-800">Revisão Ativa (Active Recall)</h3>
        <p className="text-sm text-slate-500 font-medium">Forçar a lembrança cria caminhos neurais mais fortes que apenas reler.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {flashcards.map((card, idx) => (
          <Flashcard key={idx} card={card} />
        ))}
      </div>
    </div>
  );
};

const ExerciseModelView = ({ exercise }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!exercise) return <div className="text-center p-12 text-slate-400">Exercício não disponível para este tópico ainda.</div>;

  const handleSelect = (opt) => {
    if (showExplanation) return; // Trava após responder
    setSelectedOption(opt);
    setShowExplanation(true);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Etiqueta */}
        <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Exercício-Modelo
          </span>
        </div>

        {/* Enunciado */}
        <p className="text-lg font-semibold text-slate-800 leading-relaxed mb-8 whitespace-pre-wrap">
          {exercise.statement}
        </p>

        {/* Alternativas */}
        <div className="space-y-3">
          {exercise.options.map((opt) => {
            const isSelected = selectedOption?.id === opt.id;
            const isCorrect = opt.isCorrect;
            
            let stateClass = "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 cursor-pointer";
            
            if (showExplanation) {
              if (isCorrect) {
                stateClass = "bg-teal-50 border-teal-400 text-teal-800 font-medium ring-2 ring-teal-400/20";
              } else if (isSelected && !isCorrect) {
                stateClass = "bg-red-50 border-red-400 text-red-800 opacity-60";
              } else {
                stateClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-50 cursor-not-allowed";
              }
            }

            return (
              <div 
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={`flex gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${stateClass}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                  ${showExplanation && isCorrect ? 'bg-teal-500 text-white' : 
                    showExplanation && isSelected ? 'bg-red-500 text-white' : 
                    'bg-white border border-slate-200'}
                `}>
                  {showExplanation && isCorrect ? <Check size={16} /> : opt.id}
                </div>
                <div className="flex-1 mt-1 text-sm sm:text-base">{opt.text}</div>
              </div>
            );
          })}
        </div>

        {/* Resolução */}
        {showExplanation && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
              <PenTool size={18} className="text-indigo-500" /> Resolução Passo a Passo
            </h4>
            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 text-slate-700 text-sm leading-relaxed font-medium">
              {exercise.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AvaliacaoView = ({ onComplete }) => (
  <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="text-center mb-10 relative z-10">
        <h3 className="text-2xl md:text-3xl font-black mb-3">Autoavaliação Cognitiva</h3>
        <p className="text-sm md:text-base text-indigo-200 font-medium max-w-2xl mx-auto">
          Você concluiu a esteira de estudos para este tópico. Seja honesto para calibrar o algoritmo de Revisão Espaçada: Qual o seu nível de domínio agora?
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 relative z-10">
        {[
          { level: 1, label: 'Perdido', bg: 'bg-red-500/10 hover:bg-red-500', text: 'text-red-400 hover:text-white', border: 'border-red-500/30' },
          { level: 2, label: 'Inseguro', bg: 'bg-orange-500/10 hover:bg-orange-500', text: 'text-orange-400 hover:text-white', border: 'border-orange-500/30' },
          { level: 3, label: 'Médio', bg: 'bg-amber-400/10 hover:bg-amber-400', text: 'text-amber-300 hover:text-slate-900', border: 'border-amber-400/30' },
          { level: 4, label: 'Bem', bg: 'bg-emerald-500/10 hover:bg-emerald-500', text: 'text-emerald-400 hover:text-white', border: 'border-emerald-500/30' },
          { level: 5, label: 'Domínio', bg: 'bg-teal-400/10 hover:bg-teal-400', text: 'text-teal-300 hover:text-slate-900', border: 'border-teal-400/30' }
        ].map((btn) => (
          <button
            key={btn.level}
            onClick={() => onComplete(btn.level)}
            className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border ${btn.border} ${btn.bg} ${btn.text} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg font-bold group`}
          >
            <span className="text-3xl md:text-4xl mb-2">{btn.level}</span>
            <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-80 group-hover:opacity-100">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);


// ============================================================================
// 4. O COMPONENTE PRINCIPAL (HUB)
// ============================================================================

export default function StrategicStudyHub() {
  const [activeSubject, setActiveSubject] = useState(fuvestData[0].subject);
  const [activeTopic, setActiveTopic] = useState(null); 
  const [studiedTopics, setStudiedTopics] = useState({}); 
  const [toast, setToast] = useState(null);

  const currentSubjectData = fuvestData.find(s => s.subject === activeSubject);
  
  const currentProgress = Object.keys(studiedTopics).reduce((acc, topicId) => {
    let incidence = 0;
    fuvestData.forEach(sub => {
      const t = sub.topics.find(top => top.id === topicId);
      if (t) incidence = t.incidence;
    });
    return acc + incidence;
  }, 0);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleStudyComplete = (confidence) => {
    setStudiedTopics(prev => ({
      ...prev,
      [activeTopic.id]: { confidence, date: new Date().toISOString() }
    }));

    if (confidence < 4) {
      setToast({
        type: 'warning',
        title: 'Revisão Automatizada',
        message: 'Algoritmo detectou fragilidade. Adicionado à Revisão Espaçada (24h).'
      });
    } else {
      setToast({
        type: 'success',
        title: 'Domínio Confirmado',
        message: 'Excelente. Espaçamento máximo aplicado a este tópico.'
      });
    }

    setTimeout(() => {
      setActiveTopic(null);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-200">
      
      {/* Toast CSS Inject for 3D flip (Workaround for single file without external css) */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 z-50 max-w-sm w-full transition-all duration-500 transform ${toast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        {toast && (
          <div className={`p-4 rounded-2xl shadow-2xl flex gap-4 items-start border backdrop-blur-md ${toast.type === 'warning' ? 'bg-amber-50/90 border-amber-200 text-amber-900' : 'bg-teal-50/90 border-teal-200 text-teal-900'}`}>
            <div className={`mt-0.5 ${toast.type === 'warning' ? 'text-amber-500' : 'text-teal-500'}`}>
              {toast.type === 'warning' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wide">{toast.title}</h4>
              <p className="text-xs mt-1 opacity-80 font-medium">{toast.message}</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {!activeTopic && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <Target size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hub Estratégico FUVEST</h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">Inteligência de dados aplicada à sua aprovação.</p>
              </div>
            </div>

            <Card className="p-6 sm:p-8 bg-white border-0 shadow-xl shadow-slate-200/40">
              <ProgressBar progress={currentProgress} target={80} />
            </Card>

            <div className="flex gap-3 overflow-x-auto pb-4 mt-10 hide-scrollbar">
              {fuvestData.map((sub) => (
                <button
                  key={sub.subject}
                  onClick={() => setActiveSubject(sub.subject)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${
                    activeSubject === sub.subject 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                      : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {sub.subject}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          
          {!activeTopic && currentSubjectData?.topics && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center px-2 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Heatmap Top-Down</h3>
              </div>

              {currentSubjectData.topics.sort((a, b) => b.incidence - a.incidence).map((topic, index) => {
                const isStudied = studiedTopics[topic.id];
                
                return (
                  <Card 
                    key={topic.id} 
                    onClick={() => setActiveTopic(topic)}
                    className="p-4 sm:p-6 group flex items-center gap-4 sm:gap-6 relative"
                  >
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors z-10">
                      <span className="text-xl sm:text-2xl font-black text-slate-800 group-hover:text-indigo-600">{topic.incidence}%</span>
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400">da prova</span>
                    </div>

                    <div className="flex-1 min-w-0 z-10">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className={`text-base sm:text-lg font-bold truncate ${isStudied ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
                          {index + 1}. {topic.name}
                        </h4>
                        {topic.isExtreme && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black bg-amber-100 text-amber-700 uppercase tracking-widest shadow-sm">
                            <Flame size={12} /> Extremo
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                        <Brain size={14} className={topic.isExtreme ? "text-amber-500" : "text-slate-400"} /> 
                        Carga Cognitiva: {topic.isExtreme ? 'Alta (Requer foco absoluto)' : 'Média'}
                      </p>
                    </div>

                    <div className="flex-shrink-0 z-10 hidden sm:block">
                      {isStudied ? (
                        <div className="flex flex-col items-center">
                          <CheckCircle2 size={28} className="text-teal-500 mb-1" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Rev. Agendada</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm group-hover:shadow-md">
                          <ChevronRight size={24} />
                        </div>
                      )}
                    </div>

                    {topic.isExtreme && !isStudied && (
                      <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {activeTopic && (
            <StudyFlow 
              topic={activeTopic} 
              onClose={() => setActiveTopic(null)} 
              onComplete={handleStudyComplete} 
            />
          )}

        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. MÓDULO DE ESTUDO (FLOW STATE)
// ============================================================================

const StudyFlow = ({ topic, onClose, onComplete }) => {
  const [activeTab, setActiveTab] = useState('teoria'); // teoria, mapa, flashcards, pratica, avaliacao

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const tabsOrder = [
    { id: 'teoria', label: 'Teoria Base', icon: BookOpen },
    { id: 'mapa', label: 'Mapa Mental', icon: GitMerge },
    { id: 'flashcards', label: 'Active Recall', icon: Zap },
    { id: 'pratica', label: 'Prática', icon: PenTool },
    { id: 'avaliacao', label: 'Autoavaliação', icon: CheckCircle2 },
  ];

  const currentTabIndex = tabsOrder.findIndex(t => t.id === activeTab);

  const handleNextStep = () => {
    if (currentTabIndex < tabsOrder.length - 1) {
      setActiveTab(tabsOrder[currentTabIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-400 ease-out bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden min-h-[85vh] flex flex-col relative z-20">
      
      {/* HEADER MINIMALISTA */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-xl z-50">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 px-4 py-2.5 rounded-full hover:bg-slate-100 border border-slate-200/50"
        >
          <ChevronLeft size={18} /> Voltar ao Hub
        </button>
        <div className="flex items-center gap-2">
          <Maximize2 size={16} className="text-slate-300 hidden sm:block" />
          <span className="text-[10px] sm:text-xs font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Flow State Ativo</span>
        </div>
      </div>

      <div className="p-6 md:p-12 flex-1 flex flex-col max-w-5xl mx-auto w-full">
        
        <div className="mb-12 text-center max-w-3xl mx-auto">
          {topic.isExtreme && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-amber-200 shadow-sm">
              <Flame size={16} /> Tópico de Incidência Extrema ({topic.incidence}%)
            </div>
          )}
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            {topic.name}
          </h2>
        </div>

        {/* NAVEGAÇÃO CHUNKING (ESTEIRA) */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full max-w-3xl mx-auto mb-12 shadow-inner overflow-x-auto hide-scrollbar relative">
          {tabsOrder.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5' 
                  : idx < currentTabIndex
                    ? 'text-indigo-400 hover:text-indigo-600 hover:bg-slate-200/50' 
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200/50'
              }`}
            >
              {idx < currentTabIndex ? <CheckCircle2 size={16} /> : <tab.icon size={16} />}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div className="flex-1 w-full pb-8">
          {activeTab === 'teoria' && <TeoriaView content={topic.content} />}
          {activeTab === 'mapa' && <MindMapView mindmap={topic.content.mindmap} />}
          {activeTab === 'flashcards' && <ActiveRecallView flashcards={topic.content.flashcards} />}
          {activeTab === 'pratica' && <ExerciseModelView exercise={topic.content.exercise} />}
          {activeTab === 'avaliacao' && <AvaliacaoView onComplete={onComplete} />}
        </div>
        
        {/* BOTÃO "PRÓXIMA ETAPA" DA ESTEIRA */}
        {activeTab !== 'avaliacao' && (
          <div className="mt-8 flex justify-end border-t border-slate-100 pt-8 animate-in fade-in duration-500">
            <button
              onClick={handleNextStep}
              className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg hover:shadow-indigo-500/30 group"
            >
              <span>Avançar para: {tabsOrder[currentTabIndex + 1].label}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
