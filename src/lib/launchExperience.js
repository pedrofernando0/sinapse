import {
  Activity,
  BellRing,
  BrainCircuit,
  CalendarCheck2,
  ChartNoAxesCombined,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
} from 'lucide-react';

const launchExperiences = {
  aluno: {
    roleLabel: 'Jornada do aluno',
    identityFallback: 'Aluno',
    shellLabel: 'Painel do aluno',
    headline: (firstName) =>
      firstName
        ? `${firstName}, seu ambiente de estudo esta pousando com foco total.`
        : 'Seu ambiente de estudo esta pousando com foco total.',
    description:
      'O Sinapse organiza a entrada para voce com contexto, prioridades claras e o menor atrito possivel entre login e estudo.',
    readyTitle: 'Tudo pronto para entrar no painel',
    readyDescription:
      'Dashboard, revisoes e atalhos principais ja estao sincronizados para o primeiro clique.',
    words: ['Foco', 'Trilha', 'Ritmo'],
    colors: {
      accent: '#67e8f9',
      accentAlt: '#60a5fa',
      accentDeep: '#2563eb',
      accentText: '#cffafe',
      panelBorder: 'rgba(103, 232, 249, 0.16)',
      panelSoft: 'rgba(103, 232, 249, 0.10)',
      softBorder: 'rgba(125, 211, 252, 0.18)',
      highlightBg: 'rgba(8, 47, 73, 0.58)',
      glowA: 'rgba(34, 211, 238, 0.26)',
      glowB: 'rgba(59, 130, 246, 0.22)',
      glowC: 'rgba(8, 145, 178, 0.18)',
      orbShadow: '0 36px 90px rgba(14, 165, 233, 0.34)',
      progressTrack: 'rgba(255, 255, 255, 0.12)',
    },
    highlights: [
      { label: 'Foco de entrada', value: 'Matematica + Biologia', hint: 'prioridade do dia' },
      { label: 'Primeiro pouso', value: 'Dashboard e revisoes', hint: 'sem ruido visual' },
      { label: 'Ritmo', value: 'Atalhos ja prontos', hint: 'continuidade imediata' },
    ],
    previewPanels: [
      {
        title: 'Dashboard inicial',
        description: 'Marcos estrategicos, metas curtas e leitura do seu momento.',
        icon: LayoutDashboard,
      },
      {
        title: 'Revisoes do dia',
        description: 'Sequencia priorizada com o que nao pode esperar.',
        icon: Compass,
      },
      {
        title: 'Simulados e progresso',
        description: 'Historico, vulnerabilidades e proximo bloco de treino.',
        icon: ChartNoAxesCombined,
      },
    ],
    steps: [
      {
        title: 'Lendo seu contexto academico',
        description: 'Reconhecendo unidade, trilha ativa e o ponto ideal de retomada.',
        icon: BrainCircuit,
        progress: 28,
      },
      {
        title: 'Costurando sua trilha de hoje',
        description: 'Conectando revisoes, metas e atalhos com o seu ritmo de estudo.',
        icon: Waypoints,
        progress: 62,
      },
      {
        title: 'Ativando apoio inteligente',
        description: 'Preparando tutoria, insights e modulos que mais ajudam agora.',
        icon: Sparkles,
        progress: 88,
      },
    ],
  },
  professor: {
    roleLabel: 'Jornada docente',
    identityFallback: 'Professor',
    shellLabel: 'Painel docente',
    headline: (firstName) =>
      firstName
        ? `${firstName}, seu cockpit pedagogico esta sendo alinhado em tempo real.`
        : 'Seu cockpit pedagogico esta sendo alinhado em tempo real.',
    description:
      'A entrada do professor precisa abrir com leitura de turma, sinais prioritarios e inteligencia de acompanhamento ja posicionadas.',
    readyTitle: 'Painel docente pronto para abrir',
    readyDescription:
      'Visao geral, alertas e camada analitica de turma ja estao em estado de leitura.',
    words: ['Turma', 'Radar', 'Acao'],
    colors: {
      accent: '#a5b4fc',
      accentAlt: '#60a5fa',
      accentDeep: '#3730a3',
      accentText: '#e0e7ff',
      panelBorder: 'rgba(165, 180, 252, 0.18)',
      panelSoft: 'rgba(129, 140, 248, 0.10)',
      softBorder: 'rgba(165, 180, 252, 0.20)',
      highlightBg: 'rgba(30, 41, 99, 0.58)',
      glowA: 'rgba(129, 140, 248, 0.24)',
      glowB: 'rgba(96, 165, 250, 0.20)',
      glowC: 'rgba(55, 48, 163, 0.18)',
      orbShadow: '0 36px 90px rgba(79, 70, 229, 0.34)',
      progressTrack: 'rgba(255, 255, 255, 0.12)',
    },
    highlights: [
      { label: 'Panorama inicial', value: 'Turma + alertas', hint: 'leitura consolidada' },
      { label: 'Sinal prioritario', value: 'Risco de evasao', hint: 'visivel na entrada' },
      { label: 'Pronto para agir', value: 'Planejamento e dados', hint: 'fluxo continuo' },
    ],
    previewPanels: [
      {
        title: 'Visao geral da turma',
        description: 'Resumo executivo com frequencia, simulados e pontos de atencao.',
        icon: Users,
      },
      {
        title: 'Radar de alertas',
        description: 'Sinais de evasao, quedas de engajamento e prioridades abertas.',
        icon: BellRing,
      },
      {
        title: 'Rota de acompanhamento',
        description: 'Detalhes por aluno e proximo passo recomendado para a turma.',
        icon: LineChart,
      },
    ],
    steps: [
      {
        title: 'Validando camada docente',
        description: 'Confirmando perfil, turmas vinculadas e escopo de analise.',
        icon: ShieldCheck,
        progress: 28,
      },
      {
        title: 'Conectando sinais da turma',
        description: 'Trazendo frequencia, simulados e estudantes que pedem atencao.',
        icon: Radar,
        progress: 64,
      },
      {
        title: 'Armando o cockpit pedagogico',
        description: 'Posicionando relatorios, alertas e o fluxo de acompanhamento.',
        icon: CalendarCheck2,
        progress: 89,
      },
    ],
  },
  generic: {
    roleLabel: 'Transicao Sinapse',
    identityFallback: 'Sinapse',
    shellLabel: 'Plataforma',
    headline: () => 'Estamos preparando a proxima etapa da experiencia.',
    description:
      'Carregando a interface e as camadas principais para que a entrada seja continua e sem quebra.',
    readyTitle: 'Ambiente pronto',
    readyDescription: 'A proxima tela ja esta carregada e pronta para assumir a experiencia.',
    words: ['Fluxo', 'Sinal', 'Sinapse'],
    colors: {
      accent: '#93c5fd',
      accentAlt: '#60a5fa',
      accentDeep: '#1d4ed8',
      accentText: '#dbeafe',
      panelBorder: 'rgba(147, 197, 253, 0.16)',
      panelSoft: 'rgba(96, 165, 250, 0.10)',
      softBorder: 'rgba(147, 197, 253, 0.18)',
      highlightBg: 'rgba(15, 23, 42, 0.58)',
      glowA: 'rgba(96, 165, 250, 0.24)',
      glowB: 'rgba(59, 130, 246, 0.18)',
      glowC: 'rgba(30, 64, 175, 0.16)',
      orbShadow: '0 36px 90px rgba(37, 99, 235, 0.32)',
      progressTrack: 'rgba(255, 255, 255, 0.12)',
    },
    highlights: [
      { label: 'Entrada', value: 'Carregamento premium', hint: 'sem tela vazia' },
      { label: 'Continuacao', value: 'Transicao suave', hint: 'mais contexto visual' },
      { label: 'Destino', value: 'Shell ja pronta', hint: 'menos salto de interface' },
    ],
    previewPanels: [
      {
        title: 'Carregando layout principal',
        description: 'Preparando a composicao base e a leitura inicial do painel.',
        icon: LayoutDashboard,
      },
      {
        title: 'Sincronizando componentes',
        description: 'Montando os blocos mais importantes antes da troca de tela.',
        icon: Activity,
      },
      {
        title: 'Abrindo a experiencia',
        description: 'Entregando a rota final assim que tudo estiver pronto.',
        icon: GraduationCap,
      },
    ],
    steps: [
      {
        title: 'Validando a proxima rota',
        description: 'Checando os modulos necessarios para abrir a experiencia.',
        icon: ShieldCheck,
        progress: 30,
      },
      {
        title: 'Montando a interface principal',
        description: 'Sincronizando a composicao visual e os dados iniciais.',
        icon: Waypoints,
        progress: 63,
      },
      {
        title: 'Finalizando a troca de contexto',
        description: 'Preparando a entrega da tela final sem ruptura visual.',
        icon: Sparkles,
        progress: 88,
      },
    ],
  },
};

export function normalizeLaunchProfile(profile) {
  return profile === 'professor' ? 'professor' : 'aluno';
}

export function getLaunchExperience(profile = 'generic') {
  return launchExperiences[profile] ?? launchExperiences.generic;
}

export function getLaunchDestination(profile) {
  return normalizeLaunchProfile(profile) === 'professor' ? '/professor' : '/aluno';
}
