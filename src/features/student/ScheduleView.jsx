import { useState } from 'react';
import { Clock3, Edit2, Edit3 } from 'lucide-react';
import { ModalFrame } from '../../components/ProfileActionPanels.jsx';

const INITIAL_SCHEDULE = {
  days: ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta'],
  slots: [
    {
      time: '07:30 - 09:00',
      seg: { subject: 'Fisica', type: 'class', color: 'bg-purple-100 text-purple-700' },
      ter: { subject: 'Matematica', type: 'class', color: 'bg-blue-100 text-blue-700' },
      qua: { subject: 'Historia', type: 'class', color: 'bg-yellow-100 text-yellow-700' },
      qui: { subject: 'Quimica', type: 'class', color: 'bg-green-100 text-green-700' },
      sex: { subject: 'Biologia', type: 'class', color: 'bg-teal-100 text-teal-700' },
    },
    {
      time: '09:00 - 10:30',
      seg: { subject: 'Fisica', type: 'class', color: 'bg-purple-100 text-purple-700' },
      ter: { subject: 'Matematica', type: 'class', color: 'bg-blue-100 text-blue-700' },
      qua: { subject: 'Geografia', type: 'class', color: 'bg-orange-100 text-orange-700' },
      qui: { subject: 'Quimica', type: 'class', color: 'bg-green-100 text-green-700' },
      sex: { subject: 'Biologia', type: 'class', color: 'bg-teal-100 text-teal-700' },
    },
    {
      time: '10:30 - 11:00',
      seg: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' },
      ter: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' },
      qua: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' },
      qui: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' },
      sex: { subject: 'Intervalo', type: 'break', color: 'bg-slate-100 text-slate-500' },
    },
    {
      time: '11:00 - 12:30',
      seg: { subject: 'Estudo: Listas', type: 'study', color: 'bg-slate-800 text-white' },
      ter: { subject: 'Redacao', type: 'class', color: 'bg-pink-100 text-pink-700' },
      qua: { subject: 'Filosofia', type: 'class', color: 'bg-yellow-100 text-yellow-700' },
      qui: { subject: 'Literatura', type: 'class', color: 'bg-pink-100 text-pink-700' },
      sex: { subject: 'Estudo: Simulado', type: 'study', color: 'bg-slate-800 text-white' },
    },
  ],
};

const DAY_KEYS = [
  { key: 'seg', label: 'Segunda' },
  { key: 'ter', label: 'Terca' },
  { key: 'qua', label: 'Quarta' },
  { key: 'qui', label: 'Quinta' },
  { key: 'sex', label: 'Sexta' },
];

const COLOR_OPTIONS = [
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  { bg: 'bg-green-100', text: 'text-green-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-slate-100', text: 'text-slate-500' },
  { bg: 'bg-slate-800', text: 'text-white' },
];

const STUDENT_MODAL_THEME = {
  gradient: 'from-blue-950 via-blue-900 to-blue-800',
  softSurface: 'bg-yellow-50',
  softText: 'text-blue-900',
  softBorder: 'border-yellow-200',
};

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${className}`}>
    {children}
  </div>
);

const updateScheduleCell = (schedule, rowIndex, dayKey, nextCellState) => ({
  ...schedule,
  slots: schedule.slots.map((slot, currentIndex) =>
    currentIndex !== rowIndex
      ? slot
      : {
          ...slot,
          [dayKey]: {
            ...slot[dayKey],
            ...nextCellState,
          },
        },
  ),
});

const updateScheduleTime = (schedule, rowIndex, nextTime) => ({
  ...schedule,
  slots: schedule.slots.map((slot, currentIndex) =>
    currentIndex !== rowIndex
      ? slot
      : {
          ...slot,
          time: nextTime,
        },
  ),
});

export default function ScheduleView() {
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [editMode, setEditMode] = useState(null);
  const [editContext, setEditContext] = useState({ rowIndex: null, dayKey: null });
  const [draft, setDraft] = useState({ subject: '', color: '', time: '' });
  const [activeMobileDay, setActiveMobileDay] = useState('seg');

  const openCellEdit = (rowIndex, dayKey) => {
    const cell = schedule.slots[rowIndex][dayKey];

    setDraft({ subject: cell.subject, color: cell.color, time: '' });
    setEditContext({ rowIndex, dayKey });
    setEditMode('cell');
  };

  const openTimeEdit = (rowIndex) => {
    setDraft({ time: schedule.slots[rowIndex].time, subject: '', color: '' });
    setEditContext({ rowIndex, dayKey: null });
    setEditMode('time');
  };

  const closeModal = () => {
    setEditMode(null);
    setEditContext({ rowIndex: null, dayKey: null });
  };

  const saveEdit = () => {
    if (editMode === 'cell' && editContext.dayKey) {
      setSchedule((currentSchedule) =>
        updateScheduleCell(currentSchedule, editContext.rowIndex, editContext.dayKey, {
          subject: draft.subject,
          color: draft.color,
        }),
      );
    }

    if (editMode === 'time') {
      setSchedule((currentSchedule) =>
        updateScheduleTime(currentSchedule, editContext.rowIndex, draft.time),
      );
    }

    closeModal();
  };

  const activeDayLabel =
    DAY_KEYS.find((day) => day.key === activeMobileDay)?.label ?? DAY_KEYS[0].label;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Construtor de cronograma</h2>
          <p className="mt-1 text-slate-500">
            Clique em qualquer bloco ou horario para ajustar a sua rotina.
          </p>
        </div>
      </div>

      <Card className="hidden overflow-hidden p-0 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-32 p-4 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                  Horario
                </th>
                {schedule.days.map((day) => (
                  <th
                    key={day}
                    className="border-l border-slate-200 p-4 text-center text-sm font-bold uppercase tracking-wider text-slate-700"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedule.slots.map((slot, rowIndex) => (
                <tr key={slot.time} className="transition-colors hover:bg-slate-50/50">
                  <td
                    className="group relative cursor-pointer p-4 text-center text-xs font-bold text-slate-500 transition-colors hover:bg-slate-100"
                    onClick={() => openTimeEdit(rowIndex)}
                  >
                    <span className="transition-opacity group-hover:opacity-0">{slot.time}</span>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 text-blue-500">
                      <Edit3 size={16} />
                    </div>
                  </td>

                  {DAY_KEYS.map((day) => {
                    const block = slot[day.key];

                    return (
                      <td key={day.key} className="h-full border-l border-slate-100 p-2 align-middle">
                        <button
                          type="button"
                          onClick={() => openCellEdit(rowIndex, day.key)}
                          className={`group relative flex min-h-[56px] h-full w-full items-center justify-center rounded-lg p-3 text-center text-sm font-bold transition-all hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 ${block.color}`}
                        >
                          {block.subject}
                          <span className="absolute right-1 top-1 rounded bg-white/30 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                            <Edit2 size={12} />
                          </span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="space-y-4 md:hidden">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
          {DAY_KEYS.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setActiveMobileDay(day.key)}
              className={`flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                activeMobileDay === day.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between px-2">
          <h3 className="font-bold text-slate-800">{activeDayLabel}</h3>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
            Toque para editar
          </span>
        </div>

        <div className="space-y-3 pb-4">
          {schedule.slots.map((slot, rowIndex) => {
            const block = slot[activeMobileDay];

            return (
              <div key={`${slot.time}-${activeMobileDay}`} className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openTimeEdit(rowIndex)}
                  className="w-24 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-500 transition-transform active:scale-95"
                >
                  {slot.time.split(' - ')[0]}
                  <br />
                  {slot.time.split(' - ')[1]}
                </button>
                <button
                  type="button"
                  onClick={() => openCellEdit(rowIndex, activeMobileDay)}
                  className={`relative flex flex-1 items-center justify-between rounded-xl p-4 text-sm font-bold transition-transform active:scale-95 ${block.color}`}
                >
                  <span className="flex-1">{block.subject}</span>
                  <Edit2 size={16} className="opacity-50" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ModalFrame
        open={editMode !== null}
        onClose={closeModal}
        theme={STUDENT_MODAL_THEME}
        eyebrow="Cronograma semanal"
        title={editMode === 'cell' ? 'Editar atividade' : 'Editar horario'}
        description={
          editMode === 'cell'
            ? 'Atualize a materia e a aparencia do bloco selecionado.'
            : 'Ajuste a faixa de horario para refletir a sua rotina real.'
        }
        icon={Clock3}
      >
        <div className="space-y-5">
          {editMode === 'cell' ? (
            <>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Materia ou descricao
                </label>
                <input
                  type="text"
                  value={draft.subject}
                  onChange={(event) =>
                    setDraft((currentDraft) => ({
                      ...currentDraft,
                      subject: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Matematica basica"
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cor do bloco
                </label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_OPTIONS.map((colorOption, index) => {
                    const className = `${colorOption.bg} ${colorOption.text}`;
                    const isSelected = draft.color === className;

                    return (
                      <button
                        key={className}
                        type="button"
                        onClick={() =>
                          setDraft((currentDraft) => ({
                            ...currentDraft,
                            color: className,
                          }))
                        }
                        className={`h-10 w-10 rounded-full transition-all ${
                          isSelected
                            ? 'scale-110 ring-2 ring-blue-500 ring-offset-2 shadow-sm'
                            : 'border border-black/5 hover:scale-105'
                        } ${colorOption.bg}`}
                        aria-label={`Selecionar cor ${index + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Intervalo
              </label>
              <input
                type="text"
                value={draft.time}
                onChange={(event) =>
                  setDraft((currentDraft) => ({
                    ...currentDraft,
                    time: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00:00 - 00:00"
              />
            </div>
          )}

          <button
            type="button"
            onClick={saveEdit}
            className="w-full rounded-xl bg-blue-900 py-3 font-bold text-white transition-colors hover:bg-blue-800"
          >
            Salvar alteracoes
          </button>
        </div>
      </ModalFrame>
    </div>
  );
}
