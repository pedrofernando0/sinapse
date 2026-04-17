import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  BrainCircuit,
  ChevronRight,
  Heart,
  Info,
  Send,
  Settings2,
  Shield,
} from 'lucide-react';

const DEFAULT_TUTOR_USER = {
  name: 'Estudante',
  xp: 1250,
  level: 12,
};

const getFirstName = (name = '') => {
  const [firstName] = name.trim().split(/\s+/);
  return firstName || DEFAULT_TUTOR_USER.name;
};

const getInitial = (name = '') => getFirstName(name).charAt(0).toUpperCase();

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${className}`}>
    {children}
  </div>
);

export default function Tutoria({ user }) {
  const student = {
    ...DEFAULT_TUTOR_USER,
    ...user,
    name: user?.name?.trim() || DEFAULT_TUTOR_USER.name,
  };

  const [phase, setPhase] = useState('welcome');
  const [prefName, setPrefName] = useState(() => getFirstName(student.name));
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const introTimeoutRef = useRef(null);
  const replyTimeoutRef = useRef(null);

  useEffect(() => {
    setPrefName(getFirstName(student.name));
  }, [student.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => () => {
    window.clearTimeout(introTimeoutRef.current);
    window.clearTimeout(replyTimeoutRef.current);
  }, []);

  const personas = [
    {
      id: 'amigavel',
      title: 'O Amigável',
      desc: 'Focado em motivação, acolhimento e apoio emocional constante.',
      icon: Heart,
      color: 'bg-teal-500',
      lightBg: 'bg-teal-50',
      textColor: 'text-teal-600',
      introMessage: (name) =>
        `Olá, ${name}! 🌟 Que alegria falar com você. Percebi que você está no Nível ${student.level} e já chegou a 85% de progresso no Raio-X de Matemática! Isso é incrível! Vamos juntos finalizar esses 15% que faltam? Lembre-se, estou aqui para te apoiar e celebrar cada vitória sua no cursinho!`,
      reply:
        'Entendi! Vamos organizar um cronograma para isso. Mais alguma dúvida em que eu possa ajudar com os dados que tenho aqui?',
    },
    {
      id: 'rigoroso',
      title: 'O Rigoroso',
      desc: 'Focado em disciplina militar, metas agressivas e sem rodeios.',
      icon: Shield,
      color: 'bg-red-600',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600',
      introMessage: (name) =>
        `Atenção, recruta ${name}. Vi que você está com 85% de progresso no Raio-X de Matemática. Isso significa que ainda faltam 15%. Na prova, 15% é a diferença entre a aprovação e mais um ano de cursinho. Seu Nível ${student.level} mostra potencial. Vamos focar no que importa e fechar essa lacuna agora.`,
      reply: 'Afirmativo. Sem desculpas amanhã. Qual o próximo tópico que você vai devorar hoje?',
    },
    {
      id: 'cientista',
      title: 'O Cientista',
      desc: 'Focado em estatística, probabilidade, dados lógicos e eficiência.',
      icon: BrainCircuit,
      color: 'bg-indigo-600',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      introMessage: (name) =>
        `Saudações, ${name}. Analisando seus logs de dados: você possui ${student.xp} XP (Nível ${student.level}). Sua taxa de conclusão no Raio-X de Conteúdos é de 85%. Estatisticamente, cobrir os 15% restantes aumentará sua probabilidade de sucesso nos simulados em até 12,4%. Iniciamos o protocolo de otimização de estudos?`,
      reply:
        'Processando requisição. Recomendo alocar 45 minutos no método Pomodoro para maximizar a retenção dessa informação.',
    },
  ];

  const clearPendingResponses = () => {
    window.clearTimeout(introTimeoutRef.current);
    window.clearTimeout(replyTimeoutRef.current);
  };

  const handleStartChat = (personaId) => {
    const persona = personas.find((item) => item.id === personaId);
    if (!persona) {
      return;
    }

    clearPendingResponses();
    setSelectedPersona(persona);
    setPhase('chat');
    setMessages([]);
    setInputValue('');
    setIsTyping(true);

    introTimeoutRef.current = window.setTimeout(() => {
      setMessages([
        {
          id: Date.now(),
          sender: 'ai',
          text: persona.introMessage(prefName),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!inputValue.trim() || !selectedPersona) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    clearPendingResponses();
    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    replyTimeoutRef.current = window.setTimeout(() => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: selectedPersona.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-5xl flex-col animate-in fade-in duration-500">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl mix-blend-multiply" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl mix-blend-multiply" />

      {phase === 'welcome' && (
        <div className="flex flex-1 flex-col items-center justify-center p-4">
          <Card className="z-10 w-full max-w-lg border-blue-100 shadow-xl shadow-blue-900/5">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 -rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Bot size={32} className="text-white" />
              </div>
            </div>

            <h2 className="mb-2 text-center text-2xl font-bold text-slate-800">Configuração do Tutor</h2>
            <p className="mb-8 text-center text-slate-500">Antes de iniciarmos, vamos personalizar nossa interação.</p>

            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <Info size={20} className="mt-0.5 flex-shrink-0 text-blue-500" />
              <p className="text-sm font-medium leading-relaxed text-blue-900/80">
                <strong>Disclaimer:</strong> Eu sou um assistente de IA projetado para te guiar baseando-se nos seus dados do sistema. Não substituo seus professores e o contato humano no Cursinho da Poli.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Como você prefere que eu te chame?</label>
                <input
                  type="text"
                  value={prefName}
                  onChange={(event) => setPrefName(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Seu nome ou apelido"
                />
              </div>

              <button
                onClick={() => setPhase('persona')}
                disabled={!prefName.trim()}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 py-3.5 font-bold text-white shadow-md transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Avançar <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {phase === 'persona' && (
        <div className="z-10 flex flex-1 flex-col px-4 py-8 animate-in slide-in-from-right-8 duration-500">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-slate-800">Escolha a dinâmica</h2>
            <p className="text-slate-500">Como você prefere que eu atue nos seus estudos hoje, {prefName}?</p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className="group flex h-full cursor-pointer flex-col border-2 border-transparent transition-all duration-300 hover:-translate-y-1 hover:border-slate-300"
              >
                <button onClick={() => handleStartChat(persona.id)} className="flex h-full flex-1 flex-col text-left">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${persona.lightBg} ${persona.textColor} transition-transform group-hover:scale-110`}>
                    <persona.icon size={28} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-800">{persona.title}</h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500">{persona.desc}</p>

                  <span className={`w-full rounded-lg py-2.5 text-center text-sm font-bold transition-colors ${persona.lightBg} ${persona.textColor}`}>
                    Selecionar
                  </span>
                </button>
              </Card>
            ))}
          </div>

          <button
            onClick={() => setPhase('welcome')}
            className="mx-auto mt-8 flex items-center gap-1 text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            <ChevronRight size={16} className="rotate-180" /> Voltar
          </button>
        </div>
      )}

      {phase === 'chat' && selectedPersona && (
        <div className="z-10 mb-4 flex h-full max-h-full flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/50 bg-white/60 shadow-xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/50 bg-white/80 px-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedPersona.lightBg} ${selectedPersona.textColor}`}>
                <selectedPersona.icon size={20} />
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-bold text-slate-800">
                  Tutor IA
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${selectedPersona.lightBg} ${selectedPersona.textColor}`}>
                    {selectedPersona.title}
                  </span>
                </h3>
                <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Online e analisando dados
                </p>
              </div>
            </div>

            <button
              onClick={() => setPhase('persona')}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              title="Trocar dinâmica"
            >
              <Settings2 size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/50 p-4 scroll-smooth sm:p-6">
            {messages.map((message) => {
              const isAi = message.sender === 'ai';

              return (
                <div key={message.id} className={`flex w-full animate-in slide-in-from-bottom-2 fade-in duration-300 ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex max-w-[85%] gap-3 sm:max-w-[75%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="mt-auto flex-shrink-0">
                      {isAi ? (
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border border-white shadow-sm ${selectedPersona.lightBg} ${selectedPersona.textColor}`}>
                          <selectedPersona.icon size={14} />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-slate-800 text-xs font-bold text-white shadow-sm">
                          {getInitial(prefName)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        className={`rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                          isAi
                            ? 'rounded-bl-none border border-slate-200 bg-white text-slate-800'
                            : 'rounded-br-none bg-blue-600 text-white'
                        }`}
                      >
                        {message.text}
                      </div>
                      <span className={`text-[10px] font-semibold text-slate-400 ${isAi ? 'ml-1' : 'mr-1 text-right'}`}>
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex w-full animate-in fade-in duration-200 justify-start">
                <div className="flex flex-row gap-3">
                  <div className={`mt-auto flex h-8 w-8 items-center justify-center rounded-full ${selectedPersona.lightBg} ${selectedPersona.textColor}`}>
                    <selectedPersona.icon size={14} />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex-shrink-0 border-t border-slate-200/50 bg-white p-4">
            <form onSubmit={handleSendMessage} className="relative mx-auto flex max-w-4xl items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Pergunte algo sobre seus estudos, metas ou dados..."
                className="w-full rounded-full border border-slate-200 bg-slate-100/50 py-3.5 pl-6 pr-14 text-sm font-medium text-slate-800 outline-none transition-all placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
            <div className="mt-2 text-center">
              <p className="text-[10px] font-semibold text-slate-400">
                Tutor IA pode cometer erros. Considere verificar informações com seus professores.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
