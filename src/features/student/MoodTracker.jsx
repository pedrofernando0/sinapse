import React, { useState, useEffect } from 'react';
import { Calendar, PenTool, Heart, Sparkles, Wind, CloudRain, Zap } from 'lucide-react';

// --- CONFIGURAÇÃO DE HUMORES E FRASES ---
const MOODS = [
  { 
    id: 'amazing', 
    icon: <Sparkles className="w-8 h-8" />, 
    label: 'Incrível', 
    color: 'bg-emerald-100', 
    activeColor: 'bg-emerald-200 border-emerald-400',
    textColor: 'text-emerald-700', 
    quotes: [
      "Hoje é o seu dia de brilhar! Use essa energia para devorar aquele assunto difícil.", 
      "O topo é o seu limite hoje. Celebre as pequenas vitórias!",
      "Sua mente está afiada como nunca. Aproveite o fluxo!"
    ] 
  },
  { 
    id: 'good', 
    icon: <Heart className="w-8 h-8" />, 
    label: 'Bem', 
    color: 'bg-sky-100', 
    activeColor: 'bg-sky-200 border-sky-400',
    textColor: 'text-sky-700', 
    quotes: [
      "Um passo de cada vez. Você está indo no caminho certo.", 
      "Mantenha o ritmo, o progresso constante é o segredo da aprovação.",
      "Respire fundo e continue o excelente trabalho."
    ] 
  },
  { 
    id: 'neutral', 
    icon: <Wind className="w-8 h-8" />, 
    label: 'Neutro', 
    color: 'bg-gray-100', 
    activeColor: 'bg-gray-200 border-gray-400',
    textColor: 'text-gray-700', 
    quotes: [
      "Tudo bem ter dias comuns. A constância é mais importante que a intensidade.", 
      "O equilíbrio também faz parte da jornada. Faça o básico bem feito hoje.",
      "Dias tranquilos preparam o terreno para grandes saltos."
    ] 
  },
  { 
    id: 'sad', 
    icon: <CloudRain className="w-8 h-8" />, 
    label: 'Triste', 
    color: 'bg-indigo-100', 
    activeColor: 'bg-indigo-200 border-indigo-400',
    textColor: 'text-indigo-700', 
    quotes: [
      "A jornada é longa, mas você não está sozinho. Pegue leve com você mesmo.", 
      "Descanse hoje se precisar. O amanhã trará novas forças e clareza.",
      "Chorar limpa a alma. Tudo bem não ser produtivo 100% do tempo."
    ] 
  },
  { 
    id: 'stressed', 
    icon: <Zap className="w-8 h-8" />, 
    label: 'Estressado', 
    color: 'bg-rose-100', 
    activeColor: 'bg-rose-200 border-rose-400',
    textColor: 'text-rose-700', 
    quotes: [
      "Feche os olhos, respire fundo 3 vezes. Você dá conta. Uma coisa de cada vez.", 
      "Pausa. A sua saúde mental importa infinitamente mais do que qualquer prova.",
      "Afaste-se dos livros por 15 minutos. Vá beber uma água, você merece."
    ] 
  },
];

// --- GERADOR DE DADOS FICTÍCIOS PARA O CALENDÁRIO ---
const generateMockMonth = () => {
  const days = [];
  const daysInMonth = 30;
  for (let i = 1; i <= daysInMonth; i++) {
    // Escolhe um humor aleatório pesando mais para 'good' e 'neutral' (vida real)
    const randomSeed = Math.random();
    let moodId = 'neutral';
    if (randomSeed > 0.8) moodId = 'stressed';
    else if (randomSeed > 0.6) moodId = 'sad';
    else if (randomSeed > 0.4) moodId = 'amazing';
    else if (randomSeed > 0.2) moodId = 'good';
    
    // Deixa os últimos 3 dias sem dados para simular o futuro/hoje
    if (i > 27) moodId = null; 

    days.push({ day: i, mood: moodId });
  }
  return days;
};

const MOCK_CALENDAR = generateMockMonth();

// --- COMPONENTE PRINCIPAL ---
export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState(null);
  const [quote, setQuote] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [note, setNote] = useState("");

  const handleMoodSelect = (mood) => {
    if (currentMood?.id === mood.id) return;
    
    setCurrentMood(mood);
    setIsAnimating(true);
    
    // Pega uma frase aleatória baseada no humor
    const randomQuote = mood.quotes[Math.floor(Math.random() * mood.quotes.length)];
    setQuote(randomQuote);

    // Remove a classe de animação para poder trigar novamente
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans p-4 md:p-8 flex justify-center items-start">
      {/* Estilos globais para a animação de fade-in */}
      <style>{`
        @keyframes customFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: customFadeIn 0.5s ease-out forwards;
        }
        .post-it {
          background: linear-gradient(135deg, #fef08a 0%, #fde047 100%);
          box-shadow: 2px 4px 10px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,0.4);
          border-bottom-right-radius: 20px 200px;
          border-bottom-left-radius: 10px;
        }
      `}</style>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Cabeçalho */}
        <div className="md:col-span-12 text-center md:text-left mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-700 tracking-tight mb-2">
            Meu Bem-Estar <span className="text-indigo-400">Diário</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Como está o seu coração de vestibulando hoje?
          </p>
        </div>

        {/* COLUNA ESQUERDA: Check-in, Painel e Desabafo */}
        <div className="md:col-span-7 space-y-8">
          
          {/* Seção 1: Check-in Diário */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Check-in de Humor
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {MOODS.map((mood) => {
                const isActive = currentMood?.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    className={`flex flex-col items-center justify-center w-20 h-24 rounded-2xl transition-all duration-300 ease-in-out border-2 
                      ${isActive ? mood.activeColor : 'border-transparent hover:scale-105 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`p-3 rounded-full mb-2 ${mood.color} ${mood.textColor} transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                      {mood.icon}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? mood.textColor : 'text-slate-500'}`}>
                      {mood.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Seção 2: Painel Motivacional */}
          <section 
            className={`transition-all duration-500 rounded-3xl p-8 border 
              ${currentMood ? currentMood.color : 'bg-slate-50 border-slate-100'} 
              ${currentMood ? currentMood.textColor : 'text-slate-400'}
              min-h-[160px] flex flex-col justify-center
            `}
          >
            {currentMood ? (
              <div className={isAnimating ? '' : 'animate-fade-in'}>
                <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-center">
                  "{quote}"
                </p>
              </div>
            ) : (
              <p className="text-center text-lg">
                Selecione como você se sente hoje para receber uma mensagem.
              </p>
            )}
          </section>

          {/* Seção 3: Notas de Desabafo (Post-it) */}
          <section>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2 ml-2">
              <PenTool className="w-5 h-5 text-yellow-500" />
              Espaço de Desabafo
            </h2>
            <div className="post-it p-6 relative group transition-transform hover:-translate-y-1 duration-300">
              {/* Detalhe visual de fita adesiva */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-white/40 rotate-2 backdrop-blur-sm shadow-sm rounded-sm z-10"></div>
              
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Escreva livremente. Ninguém vai ler isso além de você. Como foi o simulado? A ansiedade bateu? Solta aqui..."
                className="w-full h-40 bg-transparent border-none resize-none focus:ring-0 text-slate-800 placeholder-slate-600/60 font-medium text-lg leading-relaxed mt-2"
                style={{ outline: 'none' }}
              />
              <div className="absolute bottom-4 right-4 text-xs font-medium text-yellow-700/60 group-hover:opacity-100 opacity-50 transition-opacity">
                {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>
          </section>

        </div>

        {/* COLUNA DIREITA: Calendário de Sentimentos */}
        <div className="md:col-span-5">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Seu Mês
              </h2>
              <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                Outubro
              </span>
            </div>

            {/* Cabeçalho dias da semana */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-xs font-bold text-slate-400">{day}</div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {MOCK_CALENDAR.map((data, index) => {
                const moodData = data.mood ? MOODS.find(m => m.id === data.mood) : null;
                const isToday = data.day === 28; // Simulando que hoje é dia 28

                return (
                  <div 
                    key={index} 
                    className="aspect-square flex items-center justify-center relative group cursor-default"
                  >
                    <div className={`
                      w-full h-full rounded-xl flex items-center justify-center text-xs font-medium transition-all
                      ${moodData ? moodData.color : 'bg-slate-50 border border-slate-100 text-slate-300'}
                      ${moodData ? moodData.textColor : ''}
                      ${isToday ? 'ring-2 ring-offset-2 ring-indigo-400 scale-110 shadow-md' : 'hover:scale-105 hover:shadow-sm'}
                    `}>
                      {/* Mostrar emoji em vez de número para os dias já passados */}
                      {moodData ? (
                        <span className="opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          {React.cloneElement(moodData.icon, { className: 'w-4 h-4' })}
                        </span>
                      ) : (
                        <span>{data.day}</span>
                      )}
                    </div>
                    
                    {/* Tooltip on hover */}
                    {moodData && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        Dia {data.day}: {moodData.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legenda do Calendário */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Legenda</p>
              <div className="grid grid-cols-2 gap-3">
                {MOODS.map(mood => (
                  <div key={`legend-${mood.id}`} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${mood.color}`}></div>
                    <span className="text-xs font-medium text-slate-500">{mood.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
