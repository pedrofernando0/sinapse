import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Clock, Sparkles, FileText, 
  Eye, Edit3, Save, Download, LayoutDashboard, Target,
  Lightbulb, Wrench, Share2, Loader2, CheckCircle2
} from 'lucide-react';

// ============================================================================
// COMPONENTES UI REUTILIZÁVEIS (Design System do App)
// ============================================================================

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl ${noPadding ? '' : 'p-6'} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    ai: 'bg-purple-50 text-purple-600 border border-purple-100',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: LESSON PLANNER VIEW
// ============================================================================

export const LessonPlannerView = () => {
  // Estados do Formulário
  const [formData, setFormData] = useState({
    title: '',
    subject: 'História', // Padrão baseado no perfil do professor
    objectives: '',
    methodology: '',
    resources: '',
    date: '',
    time: ''
  });

  // Estados de Controle de UI
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  // Manipulador de Mudanças nos Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  // Simulação de Geração de IA
  const handleAISuggestion = (field) => {
    if (!formData.title) {
      alert("Por favor, preencha o 'Título da Aula' primeiro para que a IA tenha contexto.");
      return;
    }

    // Ativa o estado de carregamento para o campo específico
    setIsGenerating(prev => ({ ...prev, [field]: true }));

    // Simula tempo de resposta da API (1.5s)
    setTimeout(() => {
      let suggestion = '';
      const baseTitle = formData.title.toLowerCase();

      switch (field) {
        case 'objectives':
          suggestion = `1. Compreender os conceitos fundamentais de ${formData.title}.\n2. Analisar criticamente as aplicações práticas deste tema no contexto atual.\n3. Desenvolver habilidades de resolução de problemas focados em ${formData.title}.`;
          if (baseTitle.includes('revolução') || baseTitle.includes('guerra')) {
            suggestion = `1. Identificar as principais causas sociais e econômicas do conflito.\n2. Mapear as fases principais e os atores envolvidos na ${formData.title}.\n3. Discutir as consequências de longo prazo para a sociedade moderna.`;
          }
          break;
        case 'methodology':
          suggestion = `A aula será conduzida através da metodologia de Sala de Aula Invertida.\n\n- 15 min: Aquecimento e discussão baseada na leitura prévia.\n- 30 min: Exposição dialogada dos pontos mais complexos sobre ${formData.title}.\n- 35 min: Trabalho em pequenos grupos para resolução de estudo de caso.\n- 10 min: Fechamento e consolidação dos conceitos.`;
          break;
        case 'resources':
          suggestion = `- Slides de apresentação (Tema: ${formData.title})\n- Lousa e marcadores coloridos\n- Cópias impressas do texto base de apoio\n- Acesso à internet para demonstração interativa`;
          break;
        default:
          suggestion = "Sugestão gerada pela IA baseada no título da aula.";
      }

      setFormData(prev => ({ ...prev, [field]: suggestion }));
      setIsGenerating(prev => ({ ...prev, [field]: false }));
    }, 1500);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: MODO DE EDIÇÃO
  // --------------------------------------------------------------------------
  const renderEditor = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Informações Básicas */}
      <Card className="border-t-4 border-t-indigo-500">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-500" />
          Informações Básicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Título da Aula</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: A Revolução Francesa e o Iluminismo"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Disciplina</label>
            <select 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
            >
              <option>História</option>
              <option>Geografia</option>
              <option>Filosofia</option>
              <option>Sociologia</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Estrutura Pedagógica com IA */}
      <Card>
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" />
          Estrutura Pedagógica
        </h3>
        
        <div className="space-y-8">
          {/* Objetivos */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Objetivos de Aprendizagem</label>
              <button 
                onClick={() => handleAISuggestion('objectives')}
                disabled={isGenerating.objectives}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGenerating.objectives ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating.objectives ? 'Gerando...' : 'Sugerir com IA'}
              </button>
            </div>
            <textarea 
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows={4}
              placeholder="O que os alunos devem ser capazes de fazer ao final desta aula?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-y"
            />
          </div>

          {/* Metodologia */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Metodologia e Dinâmica</label>
              <button 
                onClick={() => handleAISuggestion('methodology')}
                disabled={isGenerating.methodology}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGenerating.methodology ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating.methodology ? 'Gerando...' : 'Sugerir com IA'}
              </button>
            </div>
            <textarea 
              name="methodology"
              value={formData.methodology}
              onChange={handleChange}
              rows={5}
              placeholder="Como a aula será conduzida? Divisão de tempo, atividades..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-y"
            />
          </div>

          {/* Recursos */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Recursos Necessários</label>
              <button 
                onClick={() => handleAISuggestion('resources')}
                disabled={isGenerating.resources}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGenerating.resources ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating.resources ? 'Gerando...' : 'Sugerir com IA'}
              </button>
            </div>
            <textarea 
              name="resources"
              value={formData.resources}
              onChange={handleChange}
              rows={3}
              placeholder="Materiais, links, livros ou equipamentos."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 resize-y"
            />
          </div>
        </div>
      </Card>

      {/* Agendamento */}
      <Card className="bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-slate-500" />
          Agendar no Cronograma da Turma
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Data da Aula</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wide">Horário Início</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="time" 
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO: MODO PREVIEW
  // --------------------------------------------------------------------------
  const renderPreview = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden min-h-[800px]">
        {/* Cabeçalho do Documento */}
        <div className="bg-slate-800 text-white p-8">
          <div className="flex justify-between items-start mb-6">
            <Badge variant="primary" className="bg-indigo-500/20 text-indigo-200 border-indigo-400/30">
              Plano de Aula
            </Badge>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-300">Cursinho da Poli</p>
              <p className="text-xs text-slate-400 mt-1">Disciplina: {formData.subject || 'Não definida'}</p>
            </div>
          </div>
          <h1 className="text-3xl font-black leading-tight mb-4">
            {formData.title || 'Título da Aula Não Definido'}
          </h1>
          
          {(formData.date || formData.time) && (
            <div className="flex items-center gap-4 text-slate-300 text-sm font-medium bg-slate-900/50 w-fit px-4 py-2 rounded-lg">
              {formData.date && <span className="flex items-center gap-2"><Calendar size={16}/> {formData.date.split('-').reverse().join('/')}</span>}
              {formData.time && <span className="flex items-center gap-2"><Clock size={16}/> {formData.time}h</span>}
            </div>
          )}
        </div>

        {/* Corpo do Documento */}
        <div className="p-8 space-y-10">
          <section>
            <h2 className="text-lg font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Target size={20} /> Objetivos de Aprendizagem
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-2">
              {formData.objectives || <span className="italic text-slate-400">Nenhum objetivo definido.</span>}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lightbulb size={20} /> Metodologia e Dinâmica
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-2">
              {formData.methodology || <span className="italic text-slate-400">Nenhuma metodologia definida.</span>}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Wrench size={20} /> Recursos Necessários
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap pl-2">
              {formData.resources || <span className="italic text-slate-400">Nenhum recurso definido.</span>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header específico da View */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm sticky top-0 z-10">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Criador de Aulas</h2>
          <p className="text-slate-500 text-sm mt-1">Estruture seu conteúdo com apoio de Inteligência Artificial.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
          >
            {isPreviewMode ? <><Edit3 size={18} /> Editar</> : <><Eye size={18} /> Preview</>}
          </button>
          
          <button 
            onClick={handleSave}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 font-bold rounded-xl transition-all
              ${isSaved 
                ? 'bg-teal-500 text-white hover:bg-teal-600' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20'
              }`}
          >
            {isSaved ? <><CheckCircle2 size={18} /> Salvo!</> : <><Save size={18} /> Salvar Plano</>}
          </button>

          {isPreviewMode && (
            <button className="flex items-center justify-center p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors border border-transparent hover:border-indigo-100">
               <Download size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Área de Conteúdo */}
      <div className="flex-1 pb-12">
        {isPreviewMode ? renderPreview() : renderEditor()}
      </div>
    </div>
  );
};


// ============================================================================
// SHELL SIMULADO DO APP DO PROFESSOR (Apenas para visualização no Canvas)
// ============================================================================

export default function App() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Falsa */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-4">
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
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer">
            <LayoutDashboard size={20} /> Visão Geral
          </div>
          <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 cursor-pointer">
            <BookOpen size={20} className="text-indigo-600" /> Planejador de Aula
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 shrink-0">
          <h1 className="font-bold text-lg text-slate-800">Planejador de Aula</h1>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <LessonPlannerView />
        </div>
      </main>
    </div>
  );
}
