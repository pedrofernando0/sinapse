import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  BookDashed,
  BookMarked,
  BookOpen,
  CheckCircle,
  CheckCircle2,
  Edit3,
  Save,
  Target,
} from 'lucide-react';

const INITIAL_BOOKS = [
  {
    id: 1,
    title: 'Opúsculo Humanitário',
    author: 'Nísia Floresta',
    year: 1853,
    deadline: 'Abr–Mai',
    progress: 100,
    status: 'done',
    notes:
      'Obra fundamental para o feminismo no Brasil. Discute a educação das mulheres e critica a sociedade patriarcal da época. Foco nas influências iluministas e no contexto do Segundo Reinado.',
  },
  {
    id: 2,
    title: 'Nebulosas',
    author: 'Narcisa Amália',
    year: 1872,
    deadline: 'Mai',
    progress: 45,
    status: 'doing',
    notes:
      'Poesia romântica com toques de transição. Atentar-se aos poemas com forte engajamento social misturados com a subjetividade romântica.',
  },
  {
    id: 3,
    title: 'Memórias de Martha',
    author: 'Julia Lopes de Almeida',
    year: 1899,
    deadline: 'Jun',
    progress: 10,
    status: 'doing',
    notes:
      'Visão do espaço urbano carioca pelos olhos femininos. Realismo e Naturalismo muito presentes na descrição do determinismo social.',
  },
  {
    id: 4,
    title: 'Caminho de pedras',
    author: 'Rachel de Queiroz',
    year: 1937,
    deadline: 'Jun–Jul',
    progress: 0,
    status: 'todo',
    notes: '',
  },
];

const Card = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${
      onClick ? 'cursor-pointer transition-colors hover:border-blue-300' : ''
    } ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ colorClass = 'bg-blue-500', progress }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
    <div
      className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
      style={{ width: `${progress}%` }}
    />
  </div>
);

const STATUS_OPTIONS = [
  {
    id: 'todo',
    label: 'Não iniciado',
    icon: BookDashed,
    color: 'text-slate-500',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
  },
  {
    id: 'doing',
    label: 'Lendo atualmente',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 'done',
    label: 'Concluído',
    icon: CheckCircle,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
  },
];

export default function Readings() {
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedBook = books.find((book) => book.id === selectedBookId) ?? null;

  useEffect(() => {
    if (selectedBook) {
      setNotesDraft(selectedBook.notes || '');
    }
  }, [selectedBook]);

  const handleStatusChange = (newStatus) => {
    if (!selectedBook) {
      return;
    }

    let newProgress = selectedBook.progress;

    if (newStatus === 'todo') newProgress = 0;
    if (newStatus === 'doing' && newProgress === 0) newProgress = 10;
    if (newStatus === 'doing' && newProgress === 100) newProgress = 90;
    if (newStatus === 'done') newProgress = 100;

    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.id === selectedBookId
          ? { ...book, status: newStatus, progress: newProgress }
          : book,
      ),
    );
  };

  const handleSaveNotes = () => {
    if (!selectedBook) {
      return;
    }

    setIsSaving(true);

    window.setTimeout(() => {
      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book.id === selectedBookId ? { ...book, notes: notesDraft } : book,
        ),
      );
      setIsSaving(false);
    }, 600);
  };

  if (selectedBook) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedBookId(null)}
            className="rounded-xl bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold leading-tight text-slate-800">
              {selectedBook.title}
            </h2>
            <p className="font-medium text-slate-500">
              {selectedBook.author}, {selectedBook.year}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
                Status da leitura
              </h3>

              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((statusOption) => {
                  const isActive = selectedBook.status === statusOption.id;

                  return (
                    <button
                      key={statusOption.id}
                      onClick={() => handleStatusChange(statusOption.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
                        isActive
                          ? `${statusOption.bg} ${statusOption.border} shadow-sm`
                          : 'border-transparent text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className={isActive ? statusOption.color : 'text-slate-400'}>
                        <statusOption.icon size={20} />
                      </div>
                      <span className={`font-semibold ${isActive ? statusOption.color : ''}`}>
                        {statusOption.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8">
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                  <span>Progresso estimado</span>
                  <span className={selectedBook.progress === 100 ? 'text-teal-600' : 'text-blue-600'}>
                    {selectedBook.progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={selectedBook.progress}
                  colorClass={selectedBook.progress === 100 ? 'bg-teal-500' : 'bg-blue-500'}
                />
              </div>
            </Card>

            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="mb-2 flex items-center gap-3">
                <Target size={20} className="text-indigo-500" />
                <h3 className="font-bold text-indigo-900">Prazo sugerido</h3>
              </div>
              <p className="text-sm text-indigo-700">
                Para manter o cronograma, finalize a leitura até o final de{' '}
                <strong>{selectedBook.deadline}</strong>.
              </p>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="flex h-full flex-col overflow-hidden border-yellow-200/50 bg-[#FFFCF2] p-0">
              <div className="flex items-center justify-between border-b border-yellow-200/50 bg-yellow-100/50 p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Edit3 size={20} />
                  <h3 className="font-bold">Fichamento e resumo</h3>
                </div>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSaving}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                    isSaving
                      ? 'bg-teal-500 text-white shadow-md'
                      : notesDraft !== selectedBook.notes
                        ? 'bg-yellow-400 text-yellow-900 shadow-sm hover:bg-yellow-500'
                        : 'bg-transparent text-yellow-700 hover:bg-yellow-200/50'
                  }`}
                >
                  {isSaving ? (
                    <CheckCircle2 size={18} className="animate-pulse" />
                  ) : (
                    <Save size={18} />
                  )}
                  {isSaving ? 'Salvo!' : 'Salvar notas'}
                </button>
              </div>

              <div className="relative flex-1 p-6">
                <div
                  className="pointer-events-none absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(transparent, transparent 31px, #eab308 31px, #eab308 32px)',
                    backgroundPositionY: '8px',
                  }}
                />

                <textarea
                  value={notesDraft}
                  onChange={(event) => setNotesDraft(event.target.value)}
                  placeholder="Escreva aqui seus resumos sobre personagens, enredo, contexto histórico e escola literária."
                  className="relative z-10 h-full min-h-[400px] w-full resize-none bg-transparent font-serif text-lg leading-[32px] text-slate-800 outline-none placeholder:text-yellow-800/30"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Leituras obrigatórias</h2>
        <p className="mt-1 text-slate-500">
          Acompanhe seu progresso nas obras e acesse seus resumos.
        </p>
      </div>

      {books.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 p-16 text-center shadow-sm backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <BookDashed size={40} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Nenhuma leitura cadastrada</h3>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            As obras obrigatórias da FUVEST aparecerão aqui quando forem adicionadas ao seu plano.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {books.map((book) => (
          <Card
            key={book.id}
            className="group flex h-full flex-col"
            onClick={() => setSelectedBookId(book.id)}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`rounded-xl p-3 transition-colors ${
                  book.status === 'done'
                    ? 'bg-teal-50 text-teal-600'
                    : book.status === 'doing'
                      ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                {book.status === 'done' ? (
                  <BookMarked size={24} />
                ) : book.status === 'doing' ? (
                  <BookOpen size={24} />
                ) : (
                  <BookDashed size={24} />
                )}
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold ${
                  book.status === 'done'
                    ? 'border-teal-200 bg-teal-50 text-teal-600'
                    : book.status === 'doing'
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
              >
                {book.status === 'done'
                  ? 'Concluído'
                  : book.status === 'doing'
                    ? 'Lendo'
                    : 'Pendente'}
              </span>
            </div>

            <div className="mb-6 flex-1">
              <h3 className="mb-1 text-lg font-bold leading-tight text-slate-800 transition-colors group-hover:text-blue-600">
                {book.title}
              </h3>
              <p className="text-sm text-slate-500">
                {book.author}, {book.year}
              </p>
            </div>

            <div className="mt-auto">
              <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                <span>Prazo: {book.deadline}</span>
                <span className={book.progress === 100 ? 'text-teal-600' : 'text-blue-600'}>
                  {book.progress}%
                </span>
              </div>
              <ProgressBar
                progress={book.progress}
                colorClass={book.progress === 100 ? 'bg-teal-500' : 'bg-blue-500'}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
