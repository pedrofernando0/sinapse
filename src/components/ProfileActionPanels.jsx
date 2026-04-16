import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, HelpCircle, Mail, Settings2, Sparkles, X } from 'lucide-react';

export const SUPPORT_EMAIL = 'plfonseca@usp.br';

const PROFILE_CONTENT = {
  student: {
    badge: 'Experiencia do Aluno',
    roleLabel: 'Aluno',
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    softSurface: 'bg-blue-50',
    softText: 'text-blue-700',
    softBorder: 'border-blue-200/70',
    primaryButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    secondaryButton: 'border-blue-200 text-blue-700 hover:bg-blue-50',
    settingsStorageKey: 'sinapse.student-settings',
    settingsTitle: 'Configurações do seu ambiente',
    settingsDescription: 'Ajuste o ritmo da plataforma, o tipo de lembrete e a intensidade da experiencia de estudo.',
    helpDescription: 'Se algo travar, confundir ou puder ficar melhor, envie o feedback diretamente para plfonseca@usp.br.',
    settings: [
      {
        key: 'smartReminders',
        title: 'Lembretes inteligentes',
        description: 'Prioriza revisões, tutorias e marcos do vestibular nas suas notificações.',
      },
      {
        key: 'aiSignals',
        title: 'Sinais da tutoria IA',
        description: 'Mostra atalhos e nudges da tutoria quando houver uma recomendação relevante.',
      },
      {
        key: 'focusSurface',
        title: 'Modo foco em destaque',
        description: 'Destaca cronograma, pomodoro e blocos de estudo assim que você entrar.',
      },
      {
        key: 'weeklyDigest',
        title: 'Resumo semanal',
        description: 'Mantem um resumo de progresso e pendencias sempre pronto no seu painel.',
      },
    ],
    defaultSettings: {
      smartReminders: true,
      aiSignals: true,
      focusSurface: false,
      weeklyDigest: true,
    },
    helpHighlights: [
      'Inclua o modulo em que voce estava e o que esperava ver.',
      'Se houver bug, descreva o passo a passo para reproduzir.',
      'Sugestoes de UX e visual tambem devem ir para o mesmo canal.',
    ],
  },
  teacher: {
    badge: 'Experiencia do Professor',
    roleLabel: 'Professor(a)',
    gradient: 'from-indigo-500 via-indigo-600 to-blue-700',
    softSurface: 'bg-indigo-50',
    softText: 'text-indigo-700',
    softBorder: 'border-indigo-200/70',
    primaryButton: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondaryButton: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50',
    settingsStorageKey: 'sinapse.teacher-settings',
    settingsTitle: 'Configurações do painel docente',
    settingsDescription: 'Defina como o Sinapse prioriza alertas de turma, leituras do painel e sinais operacionais.',
    helpDescription: 'Feedback pedagógico, bugs e pedidos de melhoria devem ser enviados para plfonseca@usp.br.',
    settings: [
      {
        key: 'riskAlerts',
        title: 'Alertas de risco de evasão',
        description: 'Mantem notificações de presenca, engajamento e sinais de afastamento em primeiro plano.',
      },
      {
        key: 'simuladoDigest',
        title: 'Resumo de simulados',
        description: 'Destaca novas medias, picos de desempenho e quedas abruptas da turma.',
      },
      {
        key: 'attendanceWatch',
        title: 'Radar de frequencia',
        description: 'Amplifica avisos de faltas recorrentes e quedas de assiduidade.',
      },
      {
        key: 'compactPanels',
        title: 'Painel compacto',
        description: 'Mostra cards mais densos para leitura rapida e acompanhamento intensivo.',
      },
    ],
    defaultSettings: {
      riskAlerts: true,
      simuladoDigest: true,
      attendanceWatch: true,
      compactPanels: false,
    },
    helpHighlights: [
      'Descreva a turma, o modulo e o tipo de problema observado.',
      'Se o ponto for pedagogico, diga qual decisao voce queria tomar.',
      'Para bugs, inclua reproducoes e impacto na rotina docente.',
    ],
  },
};

const loadStoredSettings = (storageKey, defaultSettings) => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(rawValue),
    };
  } catch (error) {
    return defaultSettings;
  }
};

const ModalFrame = ({ open, onClose, theme, eyebrow, title, description, icon: Icon, children, footer }) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Fechar modal"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_32px_120px_rgba(15,23,42,0.24)]">
        <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-r ${theme.gradient} opacity-95`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

        <div className="relative p-6 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="max-w-xl">
              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] ${theme.softSurface} ${theme.softText} ${theme.softBorder}`}>
                <Icon size={14} />
                {eyebrow}
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-[2.1rem]">{title}</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80">{description}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="rounded-[1.6rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            {children}
          </div>

          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
};

const ToggleField = ({ checked, description, label, onChange, theme }) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
    <div className="min-w-0">
      <p className="font-bold text-slate-800">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative mt-1 flex h-8 w-14 flex-shrink-0 items-center rounded-full border transition-colors ${
        checked ? `${theme.softSurface} ${theme.softBorder}` : 'border-slate-200 bg-white'
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full shadow-sm transition-transform ${
          checked
            ? `translate-x-7 bg-gradient-to-br ${theme.gradient}`
            : 'translate-x-1 bg-slate-300'
        }`}
      />
    </button>
  </div>
);

export function AccountSettingsModal({ onClose, open, profile, userName }) {
  const content = PROFILE_CONTENT[profile];
  const [settings, setSettings] = useState(content.defaultSettings);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setSettings(loadStoredSettings(content.settingsStorageKey, content.defaultSettings));
    setSavedMessage('');
  }, [content.defaultSettings, content.settingsStorageKey, open]);

  const title = useMemo(() => `${userName || 'Voce'}, personalize seu ambiente`, [userName]);

  const handleToggle = (key) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: !previousSettings[key],
    }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(content.settingsStorageKey, JSON.stringify(settings));
    }

    setSavedMessage('Preferencias salvas com sucesso.');
  };

  return (
    <ModalFrame
      open={open}
      onClose={onClose}
      theme={content}
      eyebrow={content.badge}
      title={title}
      description={content.settingsDescription}
      icon={Settings2}
      footer={
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="min-h-5 text-sm font-semibold text-slate-500">{savedMessage}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${content.secondaryButton}`}
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors focus:outline-none focus:ring-2 ${content.primaryButton}`}
            >
              Salvar preferencias
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {content.settings.map((field) => (
          <ToggleField
            key={field.key}
            checked={Boolean(settings[field.key])}
            description={field.description}
            label={field.title}
            onChange={() => handleToggle(field.key)}
            theme={content}
          />
        ))}
      </div>
    </ModalFrame>
  );
}

export function AccountHelpModal({ onClose, open, profile, userName }) {
  const content = PROFILE_CONTENT[profile];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) {
      setCopied(false);
    }
  }, [open]);

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
  };

  const handleMail = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const subject = encodeURIComponent(`Feedback Sinapse | ${content.roleLabel} | ${userName || 'Usuario'}`);
    const body = encodeURIComponent(
      `Nome: ${userName || 'N/A'}\nPerfil: ${content.roleLabel}\n\nContexto:\n- Modulo:\n- O que aconteceu:\n- Passos para reproduzir:\n- Sugestao de melhoria:\n`
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <ModalFrame
      open={open}
      onClose={onClose}
      theme={content}
      eyebrow={`${content.badge} | suporte`}
      title={`${userName || 'Voce'}, conte o que precisa`}
      description={content.helpDescription}
      icon={HelpCircle}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleMail}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-colors focus:outline-none focus:ring-2 ${content.primaryButton}`}
          >
            <Mail size={16} /> Enviar feedback
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors ${content.secondaryButton}`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Contato copiado' : 'Copiar e-mail'}
          </button>
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className={`rounded-[1.4rem] border p-5 ${content.softSurface} ${content.softBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 ${content.softText}`}>
              <Mail size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Canal oficial</p>
              <p className="mt-1 text-lg font-black text-slate-900">{SUPPORT_EMAIL}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Este e o contato principal para bugs, feedback de experiencia, ajustes de fluxo e melhorias do Sinapse.
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${content.gradient}`}>
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Para agilizar</p>
              <p className="mt-1 text-lg font-black text-slate-900">Mande contexto junto</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {content.helpHighlights.map((highlight) => (
              <div key={highlight} className="flex gap-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br ${content.gradient}`} />
                <p className="text-sm leading-relaxed text-slate-600">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalFrame>
  );
}
