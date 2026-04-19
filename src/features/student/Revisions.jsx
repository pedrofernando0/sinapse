import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Edit2,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import {
  createStudentRevision,
  deleteStudentRevision,
  getStudentRevisions,
  updateStudentRevision,
} from '../../services/student.js';

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return formatDateInput(date);
};

const getToday = () => getRelativeDate(0);

const SUBJECTS = [
  'Matemática',
  'Física',
  'Química',
  'Biologia',
  'História',
  'Geografia',
  'Português',
  'Literatura',
  'Redação',
  'Inglês',
];

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${className}`}>
    {children}
  </div>
);

const EMPTY_STATES = {
  atrasadas: {
    cta: null,
    icon: CheckCircle2,
    iconClass: 'text-teal-400',
    message: 'Você está em dia com tudo. Continue assim!',
    title: 'Nenhuma revisão atrasada!',
  },
  concluidas: {
    cta: null,
    icon: CheckCircle2,
    iconClass: 'text-slate-300',
    message: 'Complete uma revisão e ela aparecerá aqui.',
    title: 'Nenhuma revisão concluída ainda',
  },
  hoje: {
    cta: 'Agendar revisão para hoje',
    icon: CheckCircle2,
    iconClass: 'text-teal-400',
    message: 'Ótimo momento para adiantar um novo tópico ou fazer um simulado.',
    title: 'Dia livre de revisões!',
  },
  proximas: {
    cta: 'Agendar próxima revisão',
    icon: Calendar,
    iconClass: 'text-blue-300',
    message: 'Programe as próximas revisões para manter o ritmo da curva de memória.',
    title: 'Sem revisões agendadas',
  },
};

const EmptyRevisions = ({ filter, onAdd }) => {
  const config = EMPTY_STATES[filter] ?? EMPTY_STATES.hoje;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center p-12 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
        <Icon size={40} className={config.iconClass} />
      </div>
      <h3 className="text-lg font-bold text-slate-800">{config.title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{config.message}</p>
      {config.cta ? (
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
        >
          <Plus size={16} />
          {config.cta}
        </button>
      ) : null}
    </div>
  );
};

const INITIAL_FORM = {
  date: getToday(),
  id: null,
  subject: SUBJECTS[0],
  topic: '',
};

export default function Revisions() {
  const [revisions, setRevisions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('hoje');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const loadRevisions = async () => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await getStudentRevisions();
      setRevisions(response);
      setStatus('success');
    } catch (error) {
      setErrorMessage(error.message || 'Não foi possível carregar as revisões.');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadRevisions();
  }, []);

  const openModal = (revision = null) => {
    setFormData(revision ?? INITIAL_FORM);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setFormData(INITIAL_FORM);
    setIsModalOpen(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!formData.topic.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      if (formData.id) {
        const currentRevision = revisions.find((revision) => revision.id === formData.id);
        const updatedRevisionResponse = await updateStudentRevision(formData.id, formData);
        const updatedRevision = {
          ...updatedRevisionResponse,
          status: formData.status ?? currentRevision?.status ?? updatedRevisionResponse.status,
        };

        setRevisions((currentRevisions) =>
          currentRevisions.map((revision) =>
            revision.id === formData.id ? updatedRevision : revision,
          ),
        );
      } else {
        const createdRevision = await createStudentRevision(formData);
        setRevisions((currentRevisions) => [...currentRevisions, createdRevision]);
      }

      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) {
      return;
    }

    await deleteStudentRevision(itemToDelete);
    setRevisions((currentRevisions) =>
      currentRevisions.filter((revision) => revision.id !== itemToDelete),
    );
    setItemToDelete(null);
  };

  const toggleStatus = async (revision) => {
    const nextStatus = revision.status === 'done' ? 'pending' : 'done';
    const updatedRevision = await updateStudentRevision(revision.id, {
      ...revision,
      status: nextStatus,
    });

    setRevisions((currentRevisions) =>
      currentRevisions.map((currentRevision) =>
        currentRevision.id === revision.id ? updatedRevision : currentRevision,
      ),
    );
  };

  const today = getToday();
  const filteredRevisions = useMemo(
    () =>
      revisions
        .filter((revision) => {
          if (filter === 'concluidas') {
            return revision.status === 'done';
          }

          if (filter === 'hoje') {
            return revision.date === today;
          }

          if (filter === 'atrasadas') {
            return revision.date < today;
          }

          if (filter === 'proximas') {
            return revision.date > today;
          }

          return true;
        })
        .sort(
          (firstRevision, secondRevision) =>
            new Date(firstRevision.date) - new Date(secondRevision.date),
        ),
    [filter, revisions, today],
  );

  const counts = {
    atrasadas: revisions.filter((revision) => revision.date < today && revision.status !== 'done').length,
    concluidas: revisions.filter((revision) => revision.status === 'done').length,
    hoje: revisions.filter((revision) => revision.date === today && revision.status !== 'done').length,
    proximas: revisions.filter((revision) => revision.date > today && revision.status !== 'done').length,
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-20 duration-500 md:pb-0">
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Revisões espaçadas</h2>
          <p className="mt-1 text-slate-500">
            A curva do esquecimento não perdoa. Mantenha-se em dia.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 active:scale-95"
        >
          <Plus size={20} />
          Nova revisão
        </button>
      </div>

      <div className="no-scrollbar flex w-full overflow-x-auto rounded-xl bg-slate-100 p-1.5 shadow-inner">
        {[
          { id: 'hoje', label: 'Hoje' },
          { id: 'atrasadas', label: 'Atrasadas' },
          { id: 'proximas', label: 'Próximas' },
          { id: 'concluidas', label: 'Concluídas' },
        ].map((tab) => {
          const isActive = filter === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 md:flex-none ${
                isActive
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                  isActive ? 'text-orange-600' : 'bg-slate-200/50 text-slate-400'
                }`}
              >
                {counts[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {status === 'loading' ? (
        <Card className="flex items-center gap-3">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-600">
            Carregando revisões...
          </p>
        </Card>
      ) : null}

      {status === 'error' ? (
        <Card className="border-red-100 bg-red-50/70">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 text-red-500" />
              <div>
                <h3 className="font-bold text-red-700">Não foi possível carregar as revisões</h3>
                <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={loadRevisions}
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
            >
              Tentar novamente
            </button>
          </div>
        </Card>
      ) : null}

      {status === 'success' ? (
        <Card className="overflow-hidden border border-slate-200 p-0 shadow-sm">
          {filteredRevisions.length === 0 ? (
            <EmptyRevisions filter={filter} onAdd={() => openModal()} />
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredRevisions.map((revision) => (
                <div
                  key={revision.id}
                  className="group flex flex-col items-start justify-between gap-4 p-4 transition-all duration-500 hover:bg-slate-50/80 sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex flex-1 items-center gap-4">
                    <button
                      type="button"
                      aria-label={
                        revision.status === 'done'
                          ? 'Marcar revisão como pendente'
                          : 'Marcar revisão como concluída'
                      }
                      onClick={() => toggleStatus(revision)}
                      className={`flex-shrink-0 rounded-full p-1 transition-all duration-300 active:scale-75 ${
                        revision.status === 'done'
                          ? 'text-teal-500'
                          : 'text-slate-300 hover:bg-blue-50 hover:text-blue-500'
                      }`}
                    >
                      {revision.status === 'done' ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                    </button>

                    <div className="transition-all duration-500">
                      <div className="mb-0.5 flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {revision.subject}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800">{revision.topic}</h4>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-3 pl-12 sm:w-auto sm:pl-0">
                    <span className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-600">
                      <Calendar size={14} />
                      {new Date(`${revision.date}T12:00:00`).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>

                    <div className="flex gap-1 transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label="Editar revisão"
                        onClick={() => openModal(revision)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-90"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir revisão"
                        onClick={() => setItemToDelete(revision.id)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Fechar modal"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={closeModal}
          />
          <Card className="relative z-10 w-full max-w-lg border-blue-100 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {formData.id ? 'Editar revisão' : 'Nova revisão'}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Defina o tópico, a disciplina e a próxima data de revisão.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSave}>
              <div className="space-y-2">
                <label htmlFor="revision-subject" className="text-sm font-bold text-slate-700">
                  Disciplina
                </label>
                <select
                  id="revision-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={({ target: { value } }) =>
                    setFormData((currentForm) => ({ ...currentForm, subject: value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="revision-topic" className="text-sm font-bold text-slate-700">
                  Tópico
                </label>
                <input
                  id="revision-topic"
                  name="topic"
                  value={formData.topic}
                  onChange={({ target: { value } }) =>
                    setFormData((currentForm) => ({ ...currentForm, topic: value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                  placeholder="Geometria Espacial"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="revision-date" className="text-sm font-bold text-slate-700">
                  Data
                </label>
                <input
                  id="revision-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={({ target: { value } }) =>
                    setFormData((currentForm) => ({ ...currentForm, date: value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Salvar revisão
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {itemToDelete ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Fechar modal de exclusão"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={() => setItemToDelete(null)}
          />
          <Card className="relative z-10 w-full max-w-md border-red-100 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800">Excluir revisão?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Esta ação remove a revisão da sua fila e não pode ser desfeita.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Confirmar exclusão
              </button>
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
