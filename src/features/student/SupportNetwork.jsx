import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Check, 
  AlertCircle, 
  Search,
  Filter,
  Users,
  Brain,
  Heart,
  X,
  PhoneCall,
  ExternalLink,
  Info
} from 'lucide-react';

// --- DADOS FICTÍCIOS ---
const MOCK_RESOURCES = [
  {
    id: 1,
    name: 'Clínica Escola USP',
    specialty: 'Psicologia',
    priceType: 'Gratuito',
    location: 'Cidade Universitária, São Paulo - SP',
    mode: 'Presencial',
    phone: '11999991111',
    phoneDisplay: '(11) 99999-1111',
    description: 'Atendimento psicoterapêutico realizado por alunos do último ano com supervisão de professores doutores.',
    tags: ['Terapia Breve', 'Plantão Psicológico'],
    available: true
  },
  {
    id: 2,
    name: 'Instituto Acolher',
    specialty: 'Assistência Social',
    priceType: 'Social',
    location: 'Online e Presencial (Vila Mariana)',
    mode: 'Híbrido',
    phone: '11988882222',
    phoneDisplay: '(11) 98888-2222',
    description: 'Apoio psicossocial com valores adaptados à renda do estudante. Foco em ansiedade pré-vestibular.',
    tags: ['Valor Social', 'Orientação Vocacional'],
    available: true
  },
  {
    id: 3,
    name: 'Roda de Escuta Poli',
    specialty: 'Grupos de Estudo',
    priceType: 'Gratuito',
    location: 'Prédio da Engenharia Civil - Sala 12',
    mode: 'Presencial',
    phone: '11977773333',
    phoneDisplay: '(11) 97777-3333',
    description: 'Encontros semanais mediados por psicólogos para debater as pressões da vida acadêmica e vestibular.',
    tags: ['Apoio Mútuo', 'Gestão de Estresse'],
    available: true
  },
  {
    id: 4,
    name: 'Projeto Mente Limpa',
    specialty: 'Psicologia',
    priceType: 'Social',
    location: 'Atendimento 100% Online',
    mode: 'Online',
    phone: '11966664444',
    phoneDisplay: '(11) 96666-4444',
    description: 'Rede de psicólogos voluntários focados em vestibulandos de baixa renda de todo o Brasil.',
    tags: ['Terapia Cognitivo-Comportamental'],
    available: false // Exemplo de lista de espera
  },
  {
    id: 5,
    name: 'Centro de Apoio ao Estudante',
    specialty: 'Assistência Social',
    priceType: 'Gratuito',
    location: 'Centro, São Paulo - SP',
    mode: 'Presencial',
    phone: '11955555555',
    phoneDisplay: '(11) 95555-5555',
    description: 'Assistência integral incluindo auxílio com documentação para isenções e suporte psicológico básico.',
    tags: ['Bolsas', 'Acolhimento'],
    available: true
  },
  {
    id: 6,
    name: 'Comunidade Foco & Calma',
    specialty: 'Grupos de Estudo',
    priceType: 'Gratuito',
    location: 'Discord / Google Meet',
    mode: 'Online',
    phone: '11944446666',
    phoneDisplay: '(11) 94444-6666',
    description: 'Salas de estudo virtuais com pausas guiadas para meditação e controle de ansiedade.',
    tags: ['Meditação', 'Técnica Pomodoro'],
    available: true
  }
];

export default function SupportNetwork() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [copiedId, setCopiedId] = useState(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Constantes de Filtro
  const FILTERS = [
    { label: 'Todos', icon: Filter },
    { label: 'Psicologia', icon: Brain },
    { label: 'Assistência Social', icon: Heart },
    { label: 'Grupos de Estudo', icon: Users }
  ];

  // Lógica de Filtro e Busca
  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesFilter = activeFilter === 'Todos' || resource.specialty === activeFilter;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Função para copiar para a área de transferência usando execCommand (compatível com iFrames)
  const handleCopyPhone = (phoneDisplay, id) => {
    const textArea = document.createElement("textarea");
    textArea.value = phoneDisplay;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500); // Reseta o ícone após 2.5s
    } catch (err) {
      console.error('Falha ao copiar telefone', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-600">
              <HeartHandshake size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">Rede de Apoio</h1>
              <p className="text-xs text-slate-500 font-medium">Saúde Mental & Bem-Estar</p>
            </div>
          </div>

          {/* BOTÃO DE EMERGÊNCIA (Desktop & Mobile) */}
          <button 
            onClick={() => setIsEmergencyModalOpen(true)}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 px-4 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-red-500/25 group relative"
          >
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <AlertCircle size={18} className="group-hover:animate-pulse" />
            <span className="hidden sm:inline">Preciso de Ajuda Agora</span>
            <span className="sm:hidden">Ajuda</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* SESSÃO DE INTRODUÇÃO & BUSCA */}
        <div className="mb-8 space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Você não está sozinho nessa jornada.
            </h2>
            <p className="text-slate-600 text-lg">
              Encontre profissionais, clínicas com valor social e grupos de apoio focados em estudantes e vestibulandos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Barra de Busca */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar clínicas, especialidades..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-sm text-sm"
              />
            </div>

            {/* Filtros Rápidos (Pills) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {FILTERS.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.label;
                return (
                  <button
                    key={filter.label}
                    onClick={() => setActiveFilter(filter.label)}
                    className={`whitespace-nowrap flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-teal-400' : 'text-slate-400'} />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* GRID DE RESULTADOS (Marketplace Style) */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Cabeçalho do Card: Badges */}
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      resource.priceType === 'Gratuito' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {resource.priceType}
                    </span>
                    <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {resource.specialty}
                    </span>
                  </div>

                  {/* Nome e Descrição */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">
                    {resource.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {resource.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-medium text-slate-500 border border-slate-200 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Informações de Local e Status */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      <span className="leading-snug">{resource.location}</span>
                    </div>
                    {!resource.available && (
                      <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 p-2 rounded-lg">
                        <Info size={16} />
                        Atualmente com lista de espera
                      </div>
                    )}
                  </div>
                </div>

                {/* Área de Ação (Rodapé do Card) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
                  <div className="flex gap-2">
                    {/* Botão de WhatsApp Dinâmico */}
                    <a 
                      href={`https://wa.me/55${resource.phone}?text=Olá! Encontrei o contato de vocês na Rede de Apoio Sinapse.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                        resource.available 
                          ? 'bg-teal-600 text-white hover:bg-teal-700' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !resource.available && e.preventDefault()}
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </a>

                    {/* Botão de Copiar Telefone */}
                    <button
                      onClick={() => handleCopyPhone(resource.phoneDisplay, resource.id)}
                      disabled={!resource.available}
                      className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium transition-all border ${
                        copiedId === resource.id
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          : resource.available
                            ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                      title="Copiar número"
                    >
                      {copiedId === resource.id ? (
                        <>
                          <Check size={18} className="text-emerald-600 animate-in zoom-in" />
                          <span className="sr-only">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Phone size={18} />
                          <span className="sr-only">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 border-dashed">
            <Search size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Nenhum recurso encontrado</h3>
            <p className="text-slate-500">Tente ajustar seus filtros ou termos de busca.</p>
            <button 
              onClick={() => {setActiveFilter('Todos'); setSearchQuery('');}}
              className="mt-4 text-teal-600 font-medium hover:text-teal-700 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>

      {/* MODAL DE EMERGÊNCIA (CVV) */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsEmergencyModalOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Faixa Superior Vermelha */}
            <div className="bg-red-600 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <HeartHandshake size={32} className="text-white" />
              </div>
              <h2 className="text-2xl font-black mb-1">Você é importante.</h2>
              <p className="text-red-100 font-medium">Se estiver em crise, peça ajuda imediatamente.</p>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              
              {/* Destaque CVV */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center shadow-inner">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Ligue para o CVV</h3>
                <div className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
                  188
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Centro de Valorização da Vida. Atendimento 24h, gratuito e sob total sigilo.
                </p>
                <a 
                  href="tel:188"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold text-lg transition-colors"
                >
                  <PhoneCall size={20} />
                  Ligar 188 Agora
                </a>
              </div>

              {/* Chat Alternativo */}
              <div className="flex flex-col gap-3">
                <p className="text-center text-sm font-medium text-slate-500">Outras formas de contato:</p>
                <a 
                  href="https://www.cvv.org.br/chat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                      <MessageCircle size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Chat Online</h4>
                      <p className="text-xs text-slate-500">Atendimento por texto</p>
                    </div>
                  </div>
                  <ExternalLink size={18} className="text-slate-400 group-hover:text-slate-600" />
                </a>
              </div>
            </div>

            <button 
              onClick={() => setIsEmergencyModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Estilos customizados para esconder scrollbar nos filtros em dispositivos móveis */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
