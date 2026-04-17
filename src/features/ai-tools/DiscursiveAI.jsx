import React, { useState, useRef, useEffect } from 'react';
import { 
  SplitSquareHorizontal, PenTool, CheckCircle2, XCircle, 
  Lightbulb, BrainCircuit, AlertCircle, ChevronRight, 
  Keyboard, Sparkles, BookOpen, RotateCcw, FileText
} from 'lucide-react';

// ============================================================================
// DADOS MOCKADOS: Questão estilo FUVEST 2ª Fase (Biologia / Geografia)
// ============================================================================
const mockQuestion = {
  id: 'fuv-2024-bio-01',
  exam: 'FUVEST 2024 - 2ª Fase',
  subject: 'Biologia e Geografia',
  enunciado: `O fenômeno conhecido como "Rios Voadores" refere-se a imensas massas de vapor de água que são transportadas por correntes de ar, fundamentais para o regime de chuvas no Brasil. 

Recentemente, cientistas alertaram que o desmatamento acelerado da Floresta Amazônica pode comprometer severamente esse fenômeno.

a) Explique o mecanismo biológico e físico de formação dos "Rios Voadores".
b) Qual a principal consequência hidrológica e econômica do enfraquecimento desse fenômeno para a região Centro-Sul do Brasil?`,
  criteria: [
    { id: 1, keyword: 'evapotranspiração', weight: 1, desc: 'Mencionou o processo de evapotranspiração pelas árvores da Amazônia.' },
    { id: 2, keyword: 'andes', weight: 1, desc: 'Mencionou a barreira natural da Cordilheira dos Andes que desvia a umidade.' },
    { id: 3, keyword: 'chuvas', weight: 1, desc: 'Explicou a precipitação / chuvas no Centro-Sul.' },
    { id: 4, keyword: 'agricultura', weight: 1, desc: 'Mencionou prejuízos econômicos à agricultura (quebra de safra/agronegócio).' },
  ],
  resolucaoOficial: `a) Os "Rios Voadores" são formados primariamente pela intensa evapotranspiração da Floresta Amazônica. As árvores bombeiam água do solo e a liberam na atmosfera como vapor. Essas massas de ar úmido são empurradas pelos ventos alísios em direção ao oeste, onde encontram a barreira física da Cordilheira dos Andes, sendo então desviadas para as regiões Centro-Oeste, Sudeste e Sul do Brasil.\n\nb) A consequência hidrológica é a diminuição drástica no regime de chuvas (escassez hídrica) na região Centro-Sul. Economicamente, isso afeta diretamente a agricultura (agronegócio), causando quebras de safras por falta de irrigação natural, além de impactar o abastecimento urbano e a geração de energia em hidrelétricas.`
};

// Símbolos para o teclado auxiliar
const SYMBOLS = [
  '°', 'α', 'β', 'γ', 'Δ', 'π', 'θ', 'λ', 'μ', 
  '→', '⇌', '±', '×', '÷', '√', '∞', 'H₂O', 'CO₂'
];

// ============================================================================
// COMPONENTES AUXILIARES
// ============================================================================

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '' }) => {
  const baseStyle = "px-6 py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg disabled:bg-blue-300",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function DiscursiveAI() {
  const [activeTab, setActiveTab] = useState('resposta'); // 'rascunho' | 'resposta'
  const [draftText, setDraftText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [status, setStatus] = useState('answering'); // 'answering' | 'evaluating' | 'evaluated'
  const [evaluation, setEvaluation] = useState(null);
  const [showResolution, setShowResolution] = useState(false);
  
  const textAreaRef = useRef(null);

  // Inserção de símbolos na posição do cursor
  const handleInsertSymbol = (symbol) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeTab === 'resposta' ? answerText : draftText;
    const newText = currentText.substring(0, start) + symbol + currentText.substring(end);
    
    if (activeTab === 'resposta') setAnswerText(newText);
    else setDraftText(newText);

    // Reposiciona o cursor após o símbolo inserido logo após a renderização
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + symbol.length, start + symbol.length);
    }, 0);
  };

  // Simulação de Correção por Inteligência Artificial
  const handleSubmit = () => {
    if (!answerText.trim()) return;
    
    setStatus('evaluating');
    
    // Simula tempo de processamento da IA
    setTimeout(() => {
      const textToEvaluate = answerText.toLowerCase();
      let score = 0;
      let matches = [];
      let missing = [];

      mockQuestion.criteria.forEach(criterion => {
        // Lógica simplificada de match (idealmente usaria NLP)
        if (textToEvaluate.includes(criterion.keyword.toLowerCase())) {
          score += criterion.weight;
          matches.push(criterion);
        } else {
          missing.push(criterion);
        }
      });

      // Feedback textual baseado na nota (Máximo 4)
      let feedbackMsg = "";
      if (score === 4) feedbackMsg = "Excelente! Você abordou todos os pontos esperados pela banca.";
      else if (score >= 2) feedbackMsg = "Boa resposta, mas faltaram alguns detalhes técnicos cruciais.";
      else feedbackMsg = "Resposta incompleta. Releia o enunciado e tente conectar melhor os conceitos.";

      setEvaluation({
        score,
        maxScore: 4,
        matches,
        missing,
        feedbackMsg
      });
      setStatus('evaluated');
      setShowResolution(true);
    }, 2500); // 2.5s de delay para criar suspense
  };

  const handleRetry = () => {
    setStatus('answering');
    setEvaluation(null);
    setShowResolution(false);
    // Não limpa o texto para permitir que o aluno edite e melhore
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center">
      
      {/* HEADER DA QUESTÃO */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg">
              {mockQuestion.exam}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {mockQuestion.subject}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Questão Discursiva 01</h1>
        </div>

        <div className="flex items-center gap-2">
          {status === 'evaluated' && (
            <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl border border-teal-100 animate-in fade-in zoom-in duration-500">
              <Sparkles size={20} className="text-teal-500" />
              <span className="font-bold text-teal-700">Correção IA Concluída</span>
            </div>
          )}
          <Button variant="outline" className="hidden md:flex">
            <SplitSquareHorizontal size={18} /> Mudar Layout
          </Button>
        </div>
      </div>

      {/* SPLIT SCREEN LAYOUT */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PAINEL ESQUERDO: ENUNCIADO & RESOLUÇÃO */}
        <div className="space-y-6">
          <Card className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <FileText size={24} className="text-blue-500" />
              <h2 className="text-xl font-bold text-slate-800">Enunciado</h2>
            </div>
            
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap">
              {mockQuestion.enunciado}
            </div>
          </Card>

          {/* ÁREA DE RESOLUÇÃO (Expande após avaliação) */}
          <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showResolution ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <Card className="p-6 md:p-8 bg-blue-50/50 border-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb size={24} className="text-yellow-500" />
                <h2 className="text-xl font-bold text-slate-800">Resolução Esperada (Padrão)</h2>
              </div>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-6 rounded-xl border border-blue-100">
                {mockQuestion.resolucaoOficial}
              </div>
            </Card>
          </div>
        </div>

        {/* PAINEL DIREITO: EDITOR E CORREÇÃO */}
        <div className="space-y-6 flex flex-col h-full">
          
          {/* SE AINDA NÃO FOI AVALIADO (OU ESTÁ SENDO) */}
          {status !== 'evaluated' && (
            <Card className="flex flex-col flex-grow relative overflow-hidden">
              
              {/* Overlay de Loading da IA */}
              {status === 'evaluating' && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <BrainCircuit size={48} className="text-blue-500 animate-pulse mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">IA analisando sua resposta...</h3>
                  <p className="text-slate-500">Comparando com o padrão de resposta FUVEST</p>
                  
                  {/* Fake Progress Bar */}
                  <div className="w-64 h-2 bg-slate-100 rounded-full mt-6 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]" />
                  </div>
                </div>
              )}

              {/* Tabs: Rascunho / Resposta */}
              <div className="flex border-b border-slate-200 bg-slate-50">
                <button 
                  onClick={() => setActiveTab('rascunho')}
                  className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 flex justify-center items-center gap-2
                    ${activeTab === 'rascunho' ? 'border-orange-500 text-orange-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                >
                  <PenTool size={16} /> Rascunho
                </button>
                <button 
                  onClick={() => setActiveTab('resposta')}
                  className={`flex-1 py-4 font-bold text-sm transition-colors border-b-2 flex justify-center items-center gap-2
                    ${activeTab === 'resposta' ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                >
                  <BookOpen size={16} /> Resposta Oficial
                </button>
              </div>

              {/* Teclado Auxiliar (Matemática/Química) */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
                <Keyboard size={16} className="text-slate-400 flex-shrink-0" />
                <div className="flex gap-1">
                  {SYMBOLS.map((sym, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleInsertSymbol(sym)}
                      className="px-2.5 py-1 min-w-[32px] text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex-shrink-0"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="flex-grow p-4 md:p-6 bg-white min-h-[400px] flex flex-col">
                <textarea
                  ref={textAreaRef}
                  value={activeTab === 'resposta' ? answerText : draftText}
                  onChange={(e) => activeTab === 'resposta' ? setAnswerText(e.target.value) : setDraftText(e.target.value)}
                  placeholder={activeTab === 'resposta' ? "Digite sua resposta final aqui..." : "Use este espaço para anotações soltas, ideias e esquemas..."}
                  className="w-full h-full flex-grow resize-none outline-none text-slate-700 leading-relaxed font-serif text-lg bg-transparent"
                  style={{ backgroundImage: 'linear-gradient(transparent, transparent 31px, #f1f5f9 31px, #f1f5f9 32px)', backgroundSize: '100% 32px', lineHeight: '32px' }}
                />
              </div>

              {/* Footer & Ações */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                <div className="text-xs font-semibold text-slate-400">
                  {activeTab === 'resposta' ? answerText.length : draftText.length} caracteres
                </div>
                {activeTab === 'resposta' ? (
                  <Button onClick={handleSubmit} disabled={!answerText.trim()}>
                    <BrainCircuit size={18} /> Avaliar com IA
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setActiveTab('resposta')}>
                    Ir para Resposta Oficial <ChevronRight size={18} />
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* TELA DE FEEDBACK DA IA (Pós-avaliação) */}
          {status === 'evaluated' && evaluation && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              
              {/* Card de Nota Final */}
              <Card className="overflow-hidden">
                <div className={`p-6 text-white text-center ${
                  evaluation.score === 4 ? 'bg-teal-500' : 
                  evaluation.score >= 2 ? 'bg-blue-500' : 'bg-orange-500'
                }`}>
                  <h3 className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Nota FUVEST Simulada</h3>
                  <div className="flex justify-center items-end gap-2">
                    <span className="text-7xl font-black leading-none">{evaluation.score}</span>
                    <span className="text-3xl font-bold opacity-80 mb-2">/ {evaluation.maxScore}</span>
                  </div>
                  <p className="mt-4 font-medium text-white/90">{evaluation.feedbackMsg}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Resposta do Aluno (Read Only) */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sua Resposta</h4>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 italic">
                      "{answerText}"
                    </div>
                  </div>

                  {/* Grade de Correção FUVEST */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Grade de Correção (Palavras-Chave)</h4>
                    <div className="space-y-3">
                      {mockQuestion.criteria.map((crit) => {
                        const isMatch = evaluation.matches.find(m => m.id === crit.id);
                        return (
                          <div key={crit.id} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                            isMatch ? 'bg-teal-50 border-teal-100' : 'bg-red-50 border-red-100'
                          }`}>
                            <div className="mt-0.5">
                              {isMatch ? (
                                <CheckCircle2 size={20} className="text-teal-500" />
                              ) : (
                                <AlertCircle size={20} className="text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${isMatch ? 'text-teal-800' : 'text-red-800'}`}>
                                {crit.desc}
                              </p>
                              <p className={`text-xs mt-1 ${isMatch ? 'text-teal-600' : 'text-red-600'}`}>
                                Palavra-chave esperada: <span className="font-mono font-bold">{crit.keyword}</span>
                                {isMatch && ' (Encontrada +1 pt)'}
                                {!isMatch && ' (Não encontrada +0 pt)'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Ações pós-feedback */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                  <Button variant="outline" onClick={handleRetry}>
                    <RotateCcw size={18} /> Reescrever
                  </Button>
                  <Button variant="primary">
                    Próxima Questão <ChevronRight size={18} />
                  </Button>
                </div>
              </Card>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
