import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Circle,
  Edit2,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
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

export default function Revisions() {
  const [revisions, setRevisions] = useState([
    { id: 1, subject: 'Matemática', topic: 'Geometria Espacial', date: getToday(), status: 'pending' },
    { id: 2, subject: 'Biologia', topic: 'Ecologia (Relações)', date: getRelativeDate(-2), status: 'done' },
    { id: 3, subject: 'Química', topic: 'Estequiometria', date: getRelativeDate(-1), status: 'pending' },
    { id: 4, subject: 'Física', topic: 'Eletrodinâmica', date: getRelativeDate(2), status: 'pending' },
  ]);
  const [filter, setFilter] = useState('hoje');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [completingIds, setCompletingIds] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    subject: SUBJECTS[0],
    topic: '',
    date: getToday(),
  });

  const openModal = (revision = null) => {
    setFormData(
      revision ?? {
        id: null,
        subject: SUBJECTS[0],
        topic: '',
        date: getToday(),
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = (event) => {
    event.preventDefault();

    if (!formData.topic.trim()) {
      return;
    }

    if (formData.id) {
      setRevisions((currentRevisions) =>
        currentRevisions.map((revision) =>
          revision.id === formData.id
            ? { ...formData, status: revision.status }
            : revision,
        ),
      );
    } else {
      setRevisions((currentRevisions) => [
        ...currentRevisions,
        { ...formData, id: Date.now(), status: 'pending' },
      ]);
    }

    closeModal();
  };

  const confirmDelete = () => {
    setRevisions((currentRevisions) =>
      currentRevisions.filter((revision) => revision.id !== itemToDelete),
    );
    setItemToDelete(null);
  };

  const toggleStatus = (id, currentStatus) => {
    if (currentStatus === 'pending') {
      setCompletingIds((currentIds) => [...currentIds, id]);

      window.setTimeout(() => {
        setRevisions((currentRevisions) =>
          currentRevisions.map((revision) =>
            revision.id === id ? { ...revision, status: 'done' } : revision,
          ),
        );
        setCompletingIds((currentIds) => currentIds.filter((currentId) => currentId !== id));
      }, 600);

      return;
    }

    setRevisions((currentRevisions) =>
      currentRevisions.map((revision) =>
        revision.id === id ? { ...revision, status: 'pending' } : revision,
      ),
    );
  };

  const today = getToday();
  const filteredRevisions = revisions
    .filter((revision) => {
      if (filter === 'concluidas') return revision.status === 'done';
      if (revision.status === 'done') return false;
      if (filter === 'hoje') return revision.date === today;
      if (filter === 'atrasadas') return revision.date < today;
      if (filter === 'proximas') return revision.date > today;
      return true;
    })
    .sort((firstRevision, secondRevision) => new Date(firstRevision.date) - new Date(secondRevision.date));

  const counts = {
    hoje: revisions.filter((revision) => revision.date === today && revision.status !== 'done').length,
    atrasadas: revisions.filter((revision) => revision.date < today && revision.status !== 'done').length,
    proximas: revisions.filter((revision) => revision.date > today && revision.status !== 'done').length,
    concluidas: revisions.filter((revision) => revision.status === 'done').length,
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
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-bold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 active:scale-95"
        >
          <Plus size={20} />
          Nova revisão
        </button>
      </div>

      <div className="no-scrollbar flex w-full overflow-x-auto rounded-xl bg-slate-100 p-1.5 shadow-inner">
        {[
          { id: 'hoje', label: 'Hoje', count: counts.hoje, color: 'text-orange-600', activeClass: 'bg-white text-orange-600 shadow-sm' },
          { id: 'atrasadas', label: 'Atrasadas', count: counts.atrasadas, color: 'text-red-600', activeClass: 'bg-white text-red-600 shadow-sm' },
          { id: 'proximas', label: 'Próximas', count: counts.proximas, color: 'text-blue-600', activeClass: 'bg-white text-blue-600 shadow-sm' },
          { id: 'concluidas', label: 'Concluídas', count: counts.concluidas, color: 'text-teal-600', activeClass: 'bg-white text-teal-600 shadow-sm' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 md:flex-none ${
              filter === tab.id
                ? tab.activeClass
                : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {tab.count > 0 ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                  filter === tab.id ? tab.color : 'bg-slate-200/50 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden border border-slate-200 p-0 shadow-sm">
        {filteredRevisions.length === 0 ? (
          <div className="flex flex-col items-center p-12 text-center">
            <CheckCircle2 size={48} className="mb-4 text-slate-200 animate-in zoom-in duration-500" />
            <h3 className="text-lg font-bold text-slate-800">Tudo limpo por aqui!</h3>
            <p className="mt-1 text-slate-500">Você não tem revisões nesta categoria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRevisions.map((revision) => {
              const isDone = revision.status === 'done';
              const isLate = filter === 'atrasadas' && !isDone;
              const isCompleting = completingIds.includes(revision.id);

              return (
                <div
                  key={revision.id}
                  className={`group flex flex-col items-start justify-between gap-4 p-4 transition-all duration-500 hover:bg-slate-50/80 sm:flex-row sm:items-center sm:p-5 ${
                    isDone ? 'bg-slate-50/50' : ''
                  } ${isCompleting ? 'translate-x-4 scale-95 bg-teal-50/30 opacity-0' : 'translate-x-0 opacity-100'}`}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <button
                      onClick={() => toggleStatus(revision.id, revision.status)}
                      className={`flex-shrink-0 rounded-full p-1 transition-all duration-300 active:scale-75 ${
                        isDone || isCompleting
                          ? 'scale-110 text-teal-500 hover:text-teal-600'
                          : 'text-slate-300 hover:bg-blue-50 hover:text-blue-500'
                      }`}
                    >
                      {isDone || isCompleting ? (
                        <CheckCircle2 size={28} className="fill-teal-50 animate-in zoom-in duration-300" />
                      ) : (
                        <Circle size={28} />
                      )}
                    </button>

                    <div className={`transition-all duration-500 ${isDone || isCompleting ? 'line-through opacity-50' : ''}`}>
                      <div className="mb-0.5 flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                            isLate
                              ? 'bg-red-100 text-red-600'
                              : isDone || isCompleting
                                ? 'bg-slate-200 text-slate-500'
                                : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {revision.subject}
                        </span>
                        {isLate && !isCompleting ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-pulse">
                            <AlertCircle size={12} />
                            Atrasada
                          </span>
                        ) : null}
                      </div>
                      <h4 className={`text-base font-bold ${isDone || isCompleting ? 'text-slate-500' : 'text-slate-800'}`}>
                        {revision.topic}
                      </h4>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-3 pl-12 sm:w-auto sm:pl-0">
                    <span
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        isLate
                          ? 'bg-red-50 text-red-600'
                          : isDone || isCompleting
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <Calendar size={14} />
                      {new Date(revision.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>

                    <div
                      className={`flex gap-1 transition-all duration-300 ${
                        isDone || isCompleting
                          ? 'pointer-events-none opacity-0'
                          : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'
                      }`}
                    >
                      <button
                        onClick={() => openModal(revision)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-90"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setItemToDelete(revision.id)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {itemToDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 pt-8 text-center">
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <Trash2 size={28} className="relative z-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-800">Excluir revisão?</h3>
              <p className="px-2 text-sm text-slate-500">
                Esta ação não pode ser desfeita. Tem certeza que deseja apagar este tópico da sua lista?
              </p>
            </div>
            <div className="flex border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 px-4 py-4 font-bold text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 border-l border-slate-100 px-4 py-4 font-bold text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
              >
                Sim, excluir
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-5">
              <h3 className="text-lg font-bold text-slate-800">
                {formData.id ? 'Editar revisão' : 'Nova revisão'}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Disciplina</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(event) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      subject: event.target.value,
                    }))
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Tópico</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Revolução Industrial"
                  value={formData.topic}
                  onChange={(event) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      topic: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800 transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Data programada</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(event) =>
                    setFormData((currentFormData) => ({
                      ...currentFormData,
                      date: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 active:scale-95"
                >
                  {formData.id ? 'Salvar alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
