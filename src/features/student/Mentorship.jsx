import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Target, MessageSquare, Search, Award, BookOpen, 
  Briefcase, GraduationCap, ChevronLeft, Send, Sparkles,
  TrendingUp, Activity, CheckCircle2, Star, Clock
} from 'lucide-react';

// ============================================================================
// 1. DADOS MOCKADOS
// ============================================================================

const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Ana Carolina Silva',
    course: 'Engenharia de Computação',
    university: 'Poli-USP (Turma 2018)',
    role: 'Software Engineer',
    company: 'Nubank',
    bio: 'Passei por muita ansiedade no vestibular. Hoje trabalho com tecnologia financeira e adoro ajudar vestibulandos a organizarem a rotina de estudos e entenderem lógica de programação.',
    tags: ['Carreira em Tech', 'Algoritmos', 'Ansiedade'],
    avatar: 'https://i.pravatar.cc/150?u=ana',
    rating: 4.9,
    mentees: 12
  },
  {
    id: 2,
    name: 'Carlos Eduardo Santos',
    course: 'Engenharia Mecânica',
    university: 'Poli-USP (Turma 2020)',
    role: 'Trainee de Projetos',
    company: 'Embraer',
    bio: 'Física sempre foi meu forte. Posso te ajudar a desmistificar a Mecânica Clássica e a montar um cronograma de revisões que realmente funciona na reta final.',
    tags: ['Física II', 'Organização', 'Cronogramas'],
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    rating: 5.0,
    mentees: 8
  },
  {
    id: 3,
    name: 'Beatriz Souza',
    course: 'Engenharia de Produção',
    university: 'Poli-USP (Turma 2019)',
    role: 'Consultora Estratégica',
    company: 'McKinsey & Company',
    bio: 'Sou apaixonada por otimização de tempo. No meu ano de vestibular, criei métodos de estudo que me salvaram. Também posso dar dicas valiosas de Redação e atualidades.',
    tags: ['Redação', 'Gestão de Tempo', 'Consultoria'],
    avatar: 'https://i.pravatar.cc/150?u=bia',
    rating: 4.8,
    mentees: 15
  },
  {
    id: 4,
    name: 'Rafael Mendes',
    course: 'Engenharia Elétrica',
    university: 'Poli-USP (Turma 2021)',
    role: 'Pesquisador',
    company: 'Instituto de Pesquisas Tecnológicas',
    bio: 'Matemática pesada é comigo. Ajudo alunos a focarem no que mais cai na FUVEST e como manter a calma em provas exaustivas.',
    tags: ['FUVEST', 'Matemática', 'Foco'],
    avatar: 'https://i.pravatar.cc/150?u=rafael',
    rating: 4.7,
    mentees: 5
  }
];

const MOCK_CHAT_HISTORY = [
  { id: 1, sender: 'mentor', text: 'Oi! Vi que você aceitou a conexão. Como estão os estudos essa semana?', time: '10:00' },
  { id: 2, sender: 'student', text: 'Oi Ana! Estão indo, mas estou travando muito em Física II.', time: '10:05' },
  { id: 3, sender: 'mentor', text: 'Super normal! Aconteceu comigo também. Quer marcar um papo rápido na quinta para revisarmos a teoria?', time: '10:15' },
];

const MOCK_PROGRESS = [
  { subject: 'Matemática', progress: 85, color: 'bg-blue-500' },
  { subject: 'Física', progress: 60, color: 'bg-orange-500' },
  { subject: 'Química', progress: 75, color: 'bg-teal-500' },
  { subject: 'Redação', progress: 90, color: 'bg-purple-500' },
  { subject: 'Biologia', progress: 45, color: 'bg-red-500' },
];

const CHAT_SUGGESTIONS = [
  "Como organizar a revisão de Física?",
  "Dicas para controlar a ansiedade?",
  "O que focar na reta final da FUVEST?",
  "Como é o mercado de trabalho?"
];

// ============================================================================
// 2. COMPONENTE DE CONFETE CUSTOMIZADO (Levinho e sem dependências)
// ============================================================================

const Confetti = ({ active }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: fall 2.5s ease-in forwards;
        }
      `}</style>
      {[...Array(60)].map((_, i) => {
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 0.5;
        const colors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${animationDelay}s`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
            }}
          />
        );
      })}
    </div>
  );
};

// ============================================================================
// 3. COMPONENTES DE UI
// ============================================================================

const Card = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

const Tag = ({ text, color = 'bg-blue-50 text-blue-600' }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${color}`}>
    {text}
  </span>
);

const ProgressBar = ({ progress, colorClass = 'bg-blue-500' }) => (
  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`} 
      style={{ width: `${progress}%` }} 
    />
  </div>
);

// ============================================================================
// 4. TELAS DA APLICAÇÃO
// ============================================================================

const DiscoveryView = ({ onSelectMentor }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMentors = MOCK_MENTORS.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    m.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rede Poli-Alumni</h2>
          <p className="text-slate-500">Encontre ex-alunos para guiar sua jornada até a aprovação.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por tag, curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMentors.map(mentor => (
          <Card key={mentor.id} onClick={() => onSelectMentor(mentor)} className="flex flex-col h-full group">
            <div className="flex items-start gap-4 mb-4">
              <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 group-hover:border-blue-200 transition-colors" />
              <div>
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{mentor.course}</p>
                <div className="flex items-center gap-1 mt-1 text-orange-400">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-bold text-slate-600">{mentor.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Briefcase size={16} className="text-slate-400" />
              <span>{mentor.role} na <span className="font-semibold text-slate-800">{mentor.company}</span></span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <GraduationCap size={16} className="text-slate-400" />
              <span>{mentor.university}</span>
            </div>

            <div className="mt-auto flex flex-wrap gap-2">
              {mentor.tags.map(tag => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ProfileView = ({ mentor, onBack, onRequestSuccess }) => {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      setRequested(true);
      onRequestSuccess(); // Dispara confete e altera visão se necessário
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-semibold text-sm transition-colors"
      >
        <ChevronLeft size={20} /> Voltar para Descoberta
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute -bottom-12 left-8">
            <img src={mentor.avatar} alt={mentor.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white" />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{mentor.name}</h2>
              <p className="text-slate-500 font-medium text-lg">{mentor.course}</p>
            </div>
            <button 
              onClick={handleRequest}
              disabled={requested || requesting}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm ${
                requested 
                  ? 'bg-teal-50 text-teal-600 border border-teal-200 cursor-default' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
              }`}
            >
              {requesting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : requested ? (
                <><CheckCircle2 size={20} /> Mentoria Solicitada</>
              ) : (
                <><Sparkles size={20} /> Solicitar Mentoria</>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
              <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Empresa Atual</p>
                <p className="font-bold text-slate-700">{mentor.company}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
              <div className="p-3 bg-white rounded-lg shadow-sm text-orange-500">
                <Award size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Formação</p>
                <p className="font-bold text-slate-700">{mentor.university}</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 border border-slate-100">
              <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-500">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Mentorados</p>
                <p className="font-bold text-slate-700">{mentor.mentees} alunos</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Por que sou mentor?</h3>
              <p className="text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-xl border border-blue-50 border-l-4 border-l-blue-500">
                "{mentor.bio}"
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Especialidades & Ajuda</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.tags.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-sm border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatView = () => {
  const mentor = MOCK_MENTORS[0]; // Mentor ativo default
  const [messages, setMessages] = useState(MOCK_CHAT_HISTORY);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    
    setMessages([...messages, { 
      id: Date.now(), 
      sender: 'student', 
      text: text, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    }]);
    setInput('');
    
    // Simulate mentor typing response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'mentor', 
        text: 'Excelente pergunta! Vamos marcar uma call rápida para falar sobre isso?', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header do Chat */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-800">{mentor.name}</h2>
            <p className="text-xs text-slate-500 font-medium">Mentor • {mentor.company}</p>
          </div>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
          Ver Perfil
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
        <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest my-4">Hoje</div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${
              msg.sender === 'student' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 font-semibold text-right ${
                msg.sender === 'student' ? 'text-blue-200' : 'text-slate-400'
              }`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Pautas Sugeridas & Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="mb-3 flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center shrink-0 pr-2">Pautas:</span>
          {CHAT_SUGGESTIONS.map((sug, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(sug)}
              className="shrink-0 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full transition-colors border border-indigo-100 whitespace-nowrap"
            >
              {sug}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem para a Ana..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Send size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardView = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Desempenho Compartilhado</h2>
          <p className="text-slate-500 mt-1">O que seus mentores podem visualizar sobre seu progresso.</p>
        </div>
        <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-lg text-sm font-bold border border-teal-100">
          <Target size={18} />
          Visão do Mentor Ativada
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" /> Domínio por Disciplina
              </h3>
              <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">Últimos 30 dias</span>
            </div>
            
            <div className="space-y-5">
              {MOCK_PROGRESS.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-slate-700 text-sm">{item.subject}</span>
                    <span className="font-bold text-slate-500 text-sm">{item.progress}%</span>
                  </div>
                  <ProgressBar progress={item.progress} colorClass={item.color} />
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Activity size={24} />
                </div>
              </div>
              <p className="text-blue-100 font-semibold mb-1">Simulados Feitos</p>
              <h4 className="text-4xl font-black">12</h4>
              <p className="text-sm text-blue-200 mt-4 border-t border-white/20 pt-4">
                Média geral: <span className="font-bold text-white">68% de acertos</span>
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" /> Horas Estudadas
              </h3>
              <div className="text-4xl font-black text-slate-800 mb-2">142<span className="text-lg font-bold text-slate-400">h</span></div>
              <p className="text-sm font-semibold text-teal-600 flex items-center gap-1">
                <TrendingUp size={14} /> +15% em relação ao mês anterior
              </p>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-indigo-500" /> Foco da Semana
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 text-sm">Revisão de Mecânica</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sugerido por Carlos Eduardo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-700 text-sm">Redação: Eixo Tecnologia</p>
                  <p className="text-xs text-slate-500 mt-0.5">Sugerido por Beatriz Souza</p>
                </div>
              </li>
              <li className="flex items-start gap-3 opacity-50">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <p className="font-bold text-slate-500 text-sm line-through">Lista de Logaritmos</p>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. SHELL PRINCIPAL (Layout e Navegação)
// ============================================================================

export default function Mentorship() {
  const [currentView, setCurrentView] = useState('discovery'); // discovery, profile, chat, dashboard
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = (view) => {
    setCurrentView(view);
    if (view !== 'profile') setSelectedMentor(null);
  };

  const handleSelectMentor = (mentor) => {
    setSelectedMentor(mentor);
    setCurrentView('profile');
  };

  const handleRequestSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('chat'); // Redireciona pro chat com o mentor após o confete
    }, 3500);
  };

  const SidebarItem = ({ icon: Icon, label, id, badge }) => {
    const isActive = currentView === id || (id === 'discovery' && currentView === 'profile');
    return (
      <button
        onClick={() => navigate(id)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all
          ${isActive ? 'bg-blue-500/10 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'}
        `}
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
          {label}
        </div>
        {badge && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      <Confetti active={showConfetti} />

      {/* Sidebar Lateral */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 p-4 z-20">
        <div className="flex items-center gap-3 px-2 mb-8 mt-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Users size={20} />
          </div>
          <div>
            <h1 className="font-black text-slate-800 tracking-tight text-lg leading-none">Poli-Alumni</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mentoria Hub</p>
          </div>
        </div>

        <div className="space-y-1 flex-1">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-4">Conexões</p>
          <SidebarItem id="discovery" icon={Search} label="Encontrar Mentor" />
          <SidebarItem id="chat" icon={MessageSquare} label="Minhas Mentorias" badge="1" />
          
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 mt-8">Acompanhamento</p>
          <SidebarItem id="dashboard" icon={TrendingUp} label="Meu Desempenho" />
        </div>

        <div className="mt-auto bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center">
          <p className="text-xs text-blue-800 font-semibold mb-2">Seja protagonista da sua aprovação!</p>
          <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header Superior (Mobile/Desktop) */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
          <h2 className="font-bold text-slate-800 md:hidden">Poli-Alumni Mentoria</h2>
          <div className="hidden md:flex flex-1"></div>
          
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:opacity-90">
              A
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {currentView === 'discovery' && <DiscoveryView onSelectMentor={handleSelectMentor} />}
          {currentView === 'profile' && selectedMentor && (
            <ProfileView mentor={selectedMentor} onBack={() => navigate('discovery')} onRequestSuccess={handleRequestSuccess} />
          )}
          {currentView === 'chat' && <ChatView />}
          {currentView === 'dashboard' && <DashboardView />}
        </div>
      </main>

      {/* Bottom Nav Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
        {[
          { id: 'discovery', icon: Search, label: 'Descobrir' },
          { id: 'chat', icon: MessageSquare, label: 'Chat' },
          { id: 'dashboard', icon: TrendingUp, label: 'Progresso' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors ${
              (currentView === item.id || (item.id === 'discovery' && currentView === 'profile')) 
                ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <item.icon size={22} className="mb-1" />
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
