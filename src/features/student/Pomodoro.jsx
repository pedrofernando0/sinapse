import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Brain,
  Clock3,
  Coffee,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Square,
} from 'lucide-react';

const MODE_COLORS = {
  focus: {
    bg: 'bg-orange-500',
    text: 'text-orange-500',
    stroke: '#f97316',
    flash: 'bg-orange-500/20',
  },
  shortBreak: {
    bg: 'bg-teal-500',
    text: 'text-teal-500',
    stroke: '#14b8a6',
    flash: 'bg-teal-500/20',
  },
  longBreak: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    stroke: '#3b82f6',
    flash: 'bg-blue-500/20',
  },
};

export default function Pomodoro({ addXp = () => {} }) {
  const [settings, setSettings] = useState({ focus: 25, shortBreak: 5, longBreak: 15 });
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [zenMode, setZenMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [studyLog, setStudyLog] = useState('');
  const [history, setHistory] = useState([
    { id: 1, date: '10:00', subject: 'Matemática Básica', type: 'focus', duration: 25, xp: 25 },
  ]);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(settings[mode] * 60);
    setIsActive(false);
  }, [mode, settings]);

  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      return undefined;
    }

    if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerRef.current);
      setFlashScreen(true);
      window.setTimeout(() => setFlashScreen(false), 2000);

      if (mode === 'focus') {
        setShowLogModal(true);
      } else {
        setMode('focus');
      }

      return undefined;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((currentTimeLeft) => currentTimeLeft - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, mode, timeLeft]);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const saveSession = (event) => {
    event.preventDefault();

    if (!studyLog.trim()) {
      return;
    }

    const xpGained = 25;
    addXp(xpGained);

    setHistory((currentHistory) => [
      {
        id: Date.now(),
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: studyLog,
        type: 'focus',
        duration: settings.focus,
        xp: xpGained,
      },
      ...currentHistory,
    ]);

    setStudyLog('');
    setShowLogModal(false);
    setMode('shortBreak');
  };

  const currentColors = MODE_COLORS[mode];
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = settings[mode] * 60;
  const percent = (timeLeft / totalSeconds) * 100;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const MainContainer = ({ children }) =>
    zenMode ? (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 animate-in fade-in duration-500">
        {flashScreen ? (
          <div className={`absolute inset-0 z-0 animate-pulse ${currentColors.flash}`} />
        ) : null}
        <div className="relative z-10 flex w-full max-w-xl flex-col items-center p-8">
          <button
            onClick={() => setZenMode(false)}
            className="absolute right-4 top-0 flex items-center gap-2 p-2 text-slate-400 hover:text-white"
          >
            <Minimize size={20} />
            <span className="text-sm font-bold">Sair do modo zen</span>
          </button>
          {children}
        </div>
      </div>
    ) : (
      <div className="relative mx-auto max-w-4xl space-y-6">
        {flashScreen ? (
          <div className={`pointer-events-none fixed inset-0 z-50 animate-pulse ${currentColors.flash}`} />
        ) : null}
        {children}
      </div>
    );

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <MainContainer>
      {!zenMode ? (
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Foco profundo</h2>
            <p className="mt-1 text-slate-500">Sessões de Pomodoro com registro de XP.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => setZenMode(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-800 p-3 font-bold text-white transition-colors hover:bg-slate-700"
            >
              <Maximize size={20} />
              <span className="hidden sm:inline">Modo zen</span>
            </button>
          </div>
        </div>
      ) : null}

      <div className={`flex flex-col items-center ${zenMode ? 'text-white' : 'text-slate-800'}`}>
        <div className={`mb-10 flex gap-2 rounded-full p-1.5 ${zenMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {[
            { id: 'focus', label: 'Foco', icon: Brain },
            { id: 'shortBreak', label: 'Pausa curta', icon: Coffee },
            { id: 'longBreak', label: 'Pausa longa', icon: Coffee },
          ].map((currentMode) => (
            <button
              key={currentMode.id}
              onClick={() => setMode(currentMode.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                mode === currentMode.id
                  ? `${currentColors.bg} text-white shadow-md`
                  : zenMode
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <currentMode.icon size={16} />
              <span className="hidden sm:inline">{currentMode.label}</span>
            </button>
          ))}
        </div>

        <div className="relative mb-10 flex items-center justify-center">
          <svg width="320" height="320" className="-rotate-90 transform">
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={zenMode ? '#1e293b' : '#e2e8f0'}
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="160"
              cy="160"
              r={radius}
              stroke={currentColors.stroke}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute flex flex-col items-center text-center">
            <div className={`font-mono text-6xl font-black tracking-tighter sm:text-7xl ${zenMode ? 'text-white' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className={`mt-2 text-sm font-bold uppercase tracking-widest ${currentColors.text}`}>
              {mode === 'focus' ? 'Em foco' : 'Descansando'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive((currentValue) => !currentValue)}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 ${currentColors.bg}`}
          >
            {isActive ? (
              <Pause size={32} fill="currentColor" />
            ) : (
              <Play size={32} fill="currentColor" className="ml-2" />
            )}
          </button>
          <button
            onClick={resetTimer}
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all ${
              zenMode
                ? 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
                : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
            }`}
          >
            <Square size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {!zenMode ? (
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Sessões de hoje</h3>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-600">
              {history.length} ciclos
            </span>
          </div>

          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center font-medium text-slate-400">
                Nenhum ciclo concluído ainda hoje.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{item.subject}</p>
                      <p className="text-xs font-medium text-slate-500">
                        {item.date} • {item.duration} minutos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-500">
                    <Award size={16} />
                    +{item.xp} XP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {showLogModal ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <Award size={32} />
            </div>
            <h3 className="mb-2 text-center text-2xl font-bold text-slate-800">
              Foco concluído!
            </h3>
            <p className="mb-6 text-center text-slate-500">
              Excelente trabalho. O que você estudou nestes últimos {settings.focus} minutos?
            </p>

            <form onSubmit={saveSession}>
              <input
                type="text"
                autoFocus
                placeholder="Ex: Exercícios de Estequiometria"
                className="mb-6 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-medium text-slate-800 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                value={studyLog}
                onChange={(event) => setStudyLog(event.target.value)}
              />
              <button
                type="submit"
                disabled={!studyLog.trim()}
                className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Salvar e ganhar +25 XP
              </button>
            </form>
          </div>
        </div>
      ) : null}

      {showSettings ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 md:p-8">
            <h3 className="mb-6 text-xl font-bold text-slate-800">
              Configurações do Pomodoro
            </h3>

            <div className="mb-8 space-y-6">
              <div>
                <label className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                  <span>Tempo de foco</span>
                  <span className="text-orange-500">{settings.focus}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={settings.focus}
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      focus: Number(event.target.value),
                    }))
                  }
                  className="w-full accent-orange-500"
                />
              </div>
              <div>
                <label className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                  <span>Pausa curta</span>
                  <span className="text-teal-500">{settings.shortBreak}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={settings.shortBreak}
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      shortBreak: Number(event.target.value),
                    }))
                  }
                  className="w-full accent-teal-500"
                />
              </div>
              <div>
                <label className="mb-2 flex justify-between text-sm font-bold text-slate-700">
                  <span>Pausa longa</span>
                  <span className="text-blue-500">{settings.longBreak}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="5"
                  value={settings.longBreak}
                  onChange={(event) =>
                    setSettings((currentSettings) => ({
                      ...currentSettings,
                      longBreak: Number(event.target.value),
                    }))
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="w-full rounded-xl bg-slate-800 py-3 font-bold text-white transition-colors hover:bg-slate-700"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      ) : null}
    </MainContainer>
  );
}
