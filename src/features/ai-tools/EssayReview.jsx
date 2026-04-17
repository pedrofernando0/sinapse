import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, Minimize2, Play, Pause, RotateCcw, 
  CheckCircle2, AlertTriangle, Sparkles, X, 
  Info, PenLine, BookOpen, Layers, Type, Award
} from 'lucide-react';

// ============================================================================
// DADOS MOCKADOS E CONFIGURAÇÕES
// ============================================================================

const TEMA_ATUAL = "As diferentes faces do riso na sociedade contemporânea";

const TEXTO_INICIAL = `O riso, uma expressão humana universal, mascara frequentemente os conflitos subjacentes da sociedade contemporânea. No filme "Coringa", vemos como o humor pode ser um mecanismo de defesa trágico contra o abandono estatal e a invisibilidade.

Em primeiro lugar, vale ressaltar que a indústria do entretenimento padronizou o que deve ser engraçado, corroborando para uma alienação das massas. As redes sociais promovem vídeos curtos que geram um riso efêmero e impensado, desprovido de qualquer catarse real.

Por outro lado, o humor crítico, como as tradicionais charges políticas, tem perdido espaço para memes superficiais na era digital. Esses conteudos são substituidos muito rapidamente nos feeds infinitos, impedindo reflexões mais profundas sobre a estrutura de poder. 

Sendo assim, compreende-se que o riso contemporâneo reflete muito mais a ansiedade de uma sociedade do cansaço do que uma alegria genuína ou um alívio cômico, tornando-se, ironicamente, um sintoma do nosso esgotamento mental.`;

const MOCK_ISSUES = [
  { 
    id: 1, text: 'corroborando para', 
    criteria: 'III', criteriaName: 'Expressão', 
    type: 'error', color: 'bg-red-200 text-red-900 border-red-300',
    comment: 'Erro de regência verbal. O verbo "corroborar" no sentido de confirmar é transitivo direto. O correto seria "corroborando uma alienação".' 
  },
  { 
    id: 2, text: 'conteudos', 
    criteria: 'III', criteriaName: 'Expressão', 
    type: 'error', color: 'bg-red-200 text-red-900 border-red-300',
    comment: 'Erro de acentuação. Palavra paroxítona com "u" tônico formando hiato: "conteúdos".' 
  },
  { 
    id: 3, text: 'substituidos', 
    criteria: 'III', criteriaName: 'Expressão', 
    type: 'error', color: 'bg-red-200 text-red-900 border-red-300',
    comment: 'Falta de acento agudo. Regra do hiato ("í"): "substituídos".' 
  },
  { 
    id: 4, text: 'Em primeiro lugar, vale ressaltar que', 
    criteria: 'II', criteriaName: 'Estrutura', 
    type: 'warning', color: 'bg-yellow-200 text-yellow-900 border-yellow-300',
    comment: 'Conectivo considerado "clichê" ou engessado. Tente articular o parágrafo de forma mais orgânica com o contexto anterior.' 
  },
  { 
    id: 5, text: 'No filme "Coringa", vemos como o humor pode ser um mecanismo de defesa trágico contra o abandono estatal', 
    criteria: 'I', criteriaName: 'Tema', 
    type: 'success', color: 'bg-blue-200 text-blue-900 border-blue-300',
    comment: 'Excelente mobilização de repertório sociocultural! O exemplo cinematográfico está perfeitamente articulado com a tese.' 
  },
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const Timer = ({ initialSeconds = 14400 }) => { // 4 horas padrão FUVEST
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
      <div className="text-xl font-mono font-bold text-slate-700 w-24 text-center">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-1 border-l border-slate-300 pl-3">
        <button onClick={() => setIsRunning(!isRunning)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={() => { setIsRunning(false); setSeconds(initialSeconds); }} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function EssayReview() {
  const [text, setText] = useState(TEXTO_INICIAL);
  const [focusMode, setFocusMode] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' | 'analyzing' | 'review'
  const [hoveredIssue, setHoveredIssue] = useState(null);

  // Calcula contagem de linhas e palavras (Aproximação)
  const linesCount = text.split('\n').length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleAnalyze = () => {
    setViewMode('analyzing');
    setTimeout(() => {
      setViewMode('review');
      if (focusMode) setFocusMode(false); // Sai do modo foco para ver o painel
    }, 2500); // Fake delay da IA
  };

  // Renderizador de texto com highlights
  const renderHighlightedText = () => {
    let elements = [text];
    
    MOCK_ISSUES.forEach(issue => {
      elements = elements.flatMap((el, idx) => {
        if (typeof el !== 'string') return [el];
        
        const parts = el.split(issue.text);
        if (parts.length === 1) return [el]; // Não achou
        
        const result = [];
        for (let i = 0; i < parts.length; i++) {
          result.push(parts[i]);
          if (i < parts.length - 1) {
            const isHovered = hoveredIssue === issue.id;
            result.push(
              <span 
                key={`${issue.id}-${idx}-${i}`} 
                onMouseEnter={() => setHoveredIssue(issue.id)}
                onMouseLeave={() => setHoveredIssue(null)}
                className={`
                  cursor-help rounded-sm border-b-2 px-0.5 transition-all duration-200
                  ${issue.color} 
                  ${isHovered ? 'ring-2 ring-offset-1 opacity-100' : 'opacity-80'}
                `}
                title={issue.comment}
              >
                {issue.text}
              </span>
            );
          }
        }
        return result;
      });
    });

    return (
      <div 
        className="w-full h-full font-serif text-[17px] text-slate-800 whitespace-pre-wrap outline-none relative z-10"
        style={{ lineHeight: '32px' }}
      >
        {elements}
      </div>
    );
  };

  return (
    <div className={`flex flex-col font-sans transition-all duration-500 bg-slate-100 ${focusMode ? 'fixed inset-0 z-50' : 'min-h-screen relative'}`}>
      
      {/* ------------------------------------------------------------------ */}
      {/* HEADER / TOOLBAR */}
      {/* ------------------------------------------------------------------ */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
            <PenLine className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-tight">Laboratório de Redação</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Simulador FUVEST</p>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Timer />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
              focusMode ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {focusMode ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            <span className="hidden sm:block">{focusMode ? 'Sair do Foco' : 'Modo Foco'}</span>
          </button>

          {viewMode === 'edit' ? (
            <button 
              onClick={handleAnalyze}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <Sparkles size={18} />
              Analisar com IA
            </button>
          ) : (
            <button 
              onClick={() => { setViewMode('edit'); setHoveredIssue(null); }}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-700 transition-all"
            >
              <PenLine size={18} />
              Voltar a Editar
            </button>
          )}
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* ÁREA PRINCIPAL DE TRABALHO */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Container da Folha de Redação */}
        <div className={`flex-1 overflow-y-auto pb-20 pt-8 flex justify-center transition-all duration-500 ${viewMode === 'review' ? 'pr-0 lg:pr-10' : ''}`}>
          
          <div className="w-full max-w-[850px] px-4 flex flex-col gap-4">
            
            {/* Header da Prova */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-md mb-2">
                Proposta 04/2026
              </span>
              <h2 className="text-xl font-bold text-slate-800">TEMA: {TEMA_ATUAL}</h2>
            </div>

            {/* A FOLHA DE REDAÇÃO */}
            <div className="bg-white shadow-xl shadow-slate-200/50 rounded-lg border border-slate-300 flex overflow-hidden relative" style={{ height: '1024px' }}>
              
              {/* Overlay de Análise (Loading) */}
              {viewMode === 'analyzing' && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">A IA está corrigindo seu texto...</h3>
                  <p className="text-slate-500 font-medium">Analisando Tema, Estrutura e Expressão.</p>
                </div>
              )}

              {/* Margem Esquerda (Números) */}
              <div className="w-12 shrink-0 border-r-2 border-red-300/60 bg-red-50/10 flex flex-col pt-8 pb-8 select-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="h-[32px] flex items-center justify-center text-[11px] text-slate-400 font-mono font-medium">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Área de Texto Pautada */}
              <div className="flex-1 relative pt-8 pb-8 pr-8 pl-4">
                
                {/* Linhas de Fundo */}
                <div className="absolute inset-0 pt-8 pb-8 pr-8 pl-4 pointer-events-none flex flex-col">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="h-[32px] border-b border-blue-200/60 w-full" />
                  ))}
                </div>

                {/* Textarea Mágico ou Renderizador (Match perfeito com o LineHeight de 32px) */}
                {viewMode === 'edit' ? (
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-full bg-transparent resize-none outline-none font-serif text-[17px] text-slate-800 relative z-10 custom-scrollbar"
                    style={{ lineHeight: '32px' }}
                    spellCheck="false"
                    placeholder="Comece sua redação aqui. Padrão FUVEST: Use caneta azul ou preta..."
                  />
                ) : viewMode === 'review' ? (
                  renderHighlightedText()
                ) : null}

              </div>
            </div>

            {/* Rodapé da Folha */}
            <div className="flex justify-between text-sm font-semibold text-slate-500 px-2">
              <p>Total de Linhas Estimadas: <span className={linesCount > 30 ? 'text-red-500' : 'text-slate-800'}>{Math.min(linesCount, 30)}/30</span></p>
              <p>{wordCount} palavras escritas</p>
            </div>
            
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* SIDEBAR DE FEEDBACK DA IA (Aparece em 'review') */}
        {/* ------------------------------------------------------------------ */}
        <div className={`w-[400px] shrink-0 bg-white border-l border-slate-200 shadow-2xl transition-transform duration-500 ease-out z-40 overflow-y-auto absolute right-0 top-0 bottom-0 lg:static
          ${viewMode === 'review' ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}>
          <div className="p-6">
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Award size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Resultado</h2>
              </div>
              <button 
                onClick={() => setViewMode('edit')}
                className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nota Geral */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 text-center shadow-lg relative overflow-hidden mb-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Nota Estimada FUVEST</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black">40</span>
                <span className="text-xl text-slate-400 font-bold">/ 50</span>
              </div>
            </div>

            {/* Critérios FUVEST */}
            <div className="space-y-6">
              
              {/* I. Tema */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    I. Desenvolvimento do Tema
                  </h3>
                  <span className="font-bold text-blue-600">5/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-full rounded-full" />
                </div>
                
                {/* Issues do Critério I */}
                <div className="mt-3 space-y-2">
                  {MOCK_ISSUES.filter(i => i.criteria === 'I').map(issue => (
                    <div 
                      key={issue.id}
                      onMouseEnter={() => setHoveredIssue(issue.id)}
                      onMouseLeave={() => setHoveredIssue(null)}
                      className={`p-3 rounded-xl text-sm border transition-all cursor-default ${hoveredIssue === issue.id ? 'bg-blue-50 border-blue-200 scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <p>{issue.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* II. Estrutura */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Layers size={16} className="text-yellow-500" />
                    II. Estrutura e Argumentação
                  </h3>
                  <span className="font-bold text-yellow-600">4/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 w-4/5 rounded-full" />
                </div>

                {/* Issues do Critério II */}
                <div className="mt-3 space-y-2">
                  {MOCK_ISSUES.filter(i => i.criteria === 'II').map(issue => (
                    <div 
                      key={issue.id}
                      onMouseEnter={() => setHoveredIssue(issue.id)}
                      onMouseLeave={() => setHoveredIssue(null)}
                      className={`p-3 rounded-xl text-sm border transition-all cursor-default ${hoveredIssue === issue.id ? 'bg-yellow-50 border-yellow-300 scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-start gap-2 text-slate-700">
                        <Info size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                        <p>{issue.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* III. Expressão */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Type size={16} className="text-red-500" />
                    III. Correção e Adequação
                  </h3>
                  <span className="font-bold text-red-600">3/5</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 w-3/5 rounded-full" />
                </div>

                {/* Issues do Critério III */}
                <div className="mt-3 space-y-2">
                  {MOCK_ISSUES.filter(i => i.criteria === 'III').map(issue => (
                    <div 
                      key={issue.id}
                      onMouseEnter={() => setHoveredIssue(issue.id)}
                      onMouseLeave={() => setHoveredIssue(null)}
                      className={`p-3 rounded-xl text-sm border transition-all cursor-default ${hoveredIssue === issue.id ? 'bg-red-50 border-red-300 scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <div className="flex items-start gap-2 text-slate-700">
                        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p><span className="line-through text-slate-400 mr-2">"{issue.text}"</span> {issue.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>

      {/* Estilo CSS customizado para esconder scrollbar do Textarea mantendo a funcionalidade */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.3);
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
