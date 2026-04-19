import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckSquare,
  Clock,
  Edit2,
  Loader2,
  PlusCircle,
  Save,
  Trash2,
  TrendingUp,
  Trophy,
  XCircle,
} from 'lucide-react'
import {
  deleteStudentMockExam,
  getStudentMockExams,
  saveStudentMockExam,
} from '../../services/student.js'

const getTodayInput = () => new Date().toISOString().split('T')[0]

const EMPTY_FORM = {
  acertos: '',
  date: getTodayInput(),
  name: '',
  time: '',
  total: '',
}

const Card = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-md ${className}`}>
    {children}
  </div>
)

const formatLongDuration = (value = '00:00') => {
  const [hours = '00', minutes = '00'] = String(value).split(':')
  return `${hours}h${minutes}m`
}

const getExamLevel = ({ acertos, total }) => {
  const percentage = Number(total) > 0 ? Number(acertos) / Number(total) : 0

  if (percentage >= 0.7) {
    return 'good'
  }

  if (percentage >= 0.5) {
    return 'average'
  }

  return 'bad'
}

const getLevelBadge = (level) => {
  if (level === 'good') {
    return 'bg-teal-50 text-teal-500'
  }

  if (level === 'average') {
    return 'bg-orange-50 text-orange-500'
  }

  return 'bg-red-50 text-red-500'
}

const getLevelLabel = (level) => {
  if (level === 'good') {
    return 'Bom'
  }

  if (level === 'average') {
    return 'Estavel'
  }

  return 'Atencao'
}

export default function Simulados() {
  const [simulados, setSimulados] = useState([])
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadSimulados = async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await getStudentMockExams()
      setSimulados(response)
      setStatus('success')
    } catch (error) {
      setErrorMessage(error.message || 'Nao foi possivel carregar os simulados.')
      setStatus('error')
    }
  }

  useEffect(() => {
    loadSimulados()
  }, [])

  const metrics = useMemo(() => {
    if (simulados.length === 0) {
      return {
        averageDuration: '00h00m',
        averageScore: 0,
        bestScore: 0,
        totalExams: 0,
      }
    }

    const totals = simulados.reduce(
      (accumulator, exam) => {
        const [hours = '0', minutes = '0'] = String(exam.time).split(':')

        return {
          correctAnswers: accumulator.correctAnswers + Number(exam.acertos),
          durationMinutes:
            accumulator.durationMinutes + Number(hours) * 60 + Number(minutes),
          totalQuestions: accumulator.totalQuestions + Number(exam.total),
        }
      },
      {
        correctAnswers: 0,
        durationMinutes: 0,
        totalQuestions: 0,
      }
    )

    const averageDurationMinutes = Math.round(
      totals.durationMinutes / simulados.length
    )
    const averageScore =
      totals.totalQuestions > 0
        ? Math.round((totals.correctAnswers / totals.totalQuestions) * 100)
        : 0
    const bestScore = Math.max(
      ...simulados.map((exam) =>
        Math.round((Number(exam.acertos) / Number(exam.total)) * 100)
      )
    )

    return {
      averageDuration: `${String(Math.floor(averageDurationMinutes / 60)).padStart(2, '0')}h${String(
        averageDurationMinutes % 60
      ).padStart(2, '0')}m`,
      averageScore,
      bestScore,
      totalExams: simulados.length,
    }
  }, [simulados])

  const handleChange = ({ target: { name, value } }) => {
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setIsFormVisible(false)
  }

  const handleEdit = (exam) => {
    setEditingId(exam.id)
    setForm({
      acertos: String(exam.acertos),
      date: exam.date,
      name: exam.name,
      time: exam.time,
      total: String(exam.total),
    })
    setIsFormVisible(true)
  }

  const handleDelete = async (examId) => {
    if (!window.confirm('Tem certeza que deseja apagar este simulado?')) {
      return
    }

    try {
      await deleteStudentMockExam(examId)
      setSimulados((currentSimulados) =>
        currentSimulados.filter((exam) => exam.id !== examId)
      )
    } catch (error) {
      setErrorMessage(error.message || 'Nao foi possivel excluir o simulado.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      return
    }

    if (Number(form.acertos) > Number(form.total)) {
      window.alert('O numero de acertos nao pode ser maior que o total de questoes!')
      return
    }

    setIsSaving(true)

    try {
      const savedExam = await saveStudentMockExam({
        ...form,
        id: editingId,
      })

      setSimulados((currentSimulados) => {
        if (editingId) {
          return currentSimulados.map((exam) =>
            exam.id === editingId ? savedExam : exam
          )
        }

        return [...currentSimulados, savedExam].sort(
          (firstExam, secondExam) =>
            new Date(secondExam.date) - new Date(firstExam.date)
        )
      })

      resetForm()
    } catch (error) {
      setErrorMessage(error.message || 'Nao foi possivel salvar o simulado.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Simulados e metricas</h2>
          <p className="mt-1 text-slate-500">
            Cadastre seus resultados e acompanhe sua evolucao.
          </p>
        </div>
        {!isFormVisible ? (
          <button
            type="button"
            onClick={() => setIsFormVisible(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <PlusCircle size={20} />
            Novo resultado
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {isFormVisible ? (
            <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50/50 shadow-md">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="mock-exam-name" className="text-sm font-bold text-slate-700">
                      Nome do simulado
                    </label>
                    <input
                      id="mock-exam-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                      placeholder="ENEM 2024 - Dia 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mock-exam-date" className="text-sm font-bold text-slate-700">
                      Data
                    </label>
                    <input
                      id="mock-exam-date"
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mock-exam-time" className="text-sm font-bold text-slate-700">
                      Tempo
                    </label>
                    <input
                      id="mock-exam-time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                      placeholder="04:00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mock-exam-total" className="text-sm font-bold text-slate-700">
                      Total de questoes
                    </label>
                    <input
                      id="mock-exam-total"
                      type="number"
                      min="1"
                      name="total"
                      value={form.total}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="mock-exam-correct" className="text-sm font-bold text-slate-700">
                      Acertos
                    </label>
                    <input
                      id="mock-exam-correct"
                      type="number"
                      min="0"
                      name="acertos"
                      value={form.acertos}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar resultado
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    <XCircle size={18} />
                    Cancelar
                  </button>
                </div>
              </form>
            </Card>
          ) : null}

          {status === 'loading' ? (
            <Card className="flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-blue-600" />
              <p className="text-sm font-semibold text-slate-600">
                Carregando simulados...
              </p>
            </Card>
          ) : null}

          {status === 'error' ? (
            <Card className="border-red-100 bg-red-50/70">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="mt-0.5 text-red-500" />
                  <div>
                    <h3 className="font-bold text-red-700">Nao foi possivel carregar os simulados</h3>
                    <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={loadSimulados}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100"
                >
                  Tentar novamente
                </button>
              </div>
            </Card>
          ) : null}

          {status === 'success' && simulados.length === 0 ? (
            <Card className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                <CheckSquare size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                Nenhum simulado cadastrado ainda.
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Comece registrando seu primeiro resultado para acompanhar sua evolucao.
              </p>
            </Card>
          ) : null}

          {status === 'success' && simulados.length > 0 ? (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <CheckSquare size={20} className="text-slate-500" />
                Historico de resultados
              </h3>

              {simulados.map((exam) => {
                const level = getExamLevel(exam)
                const score = Number(exam.total) > 0
                  ? Math.round((Number(exam.acertos) / Number(exam.total)) * 100)
                  : 0

                return (
                  <Card
                    key={exam.id}
                    className="group flex flex-col justify-between gap-4 transition-colors hover:border-slate-300 sm:flex-row sm:items-center"
                  >
                    <div className="w-full flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-slate-800">{exam.name}</h4>
                          <span className="text-xs font-bold text-slate-400">
                            {new Date(`${exam.date}T12:00:00`).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${getLevelBadge(level)}`}>
                          {getLevelLabel(level)}
                        </span>
                      </div>

                      <div className="mt-2 flex gap-4 sm:gap-8">
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Acertos
                          </p>
                          <p className="text-lg font-black text-slate-700">
                            {exam.acertos}{' '}
                            <span className="text-sm font-normal text-slate-400">
                              / {exam.total}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Taxa
                          </p>
                          <p className="text-lg font-black text-teal-500">{score}%</p>
                        </div>
                        <div>
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Tempo
                          </p>
                          <p className="text-lg font-black text-slate-700">
                            {formatLongDuration(exam.time)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      <button
                        type="button"
                        aria-label="Editar simulado"
                        onClick={() => handleEdit(exam)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-90"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        type="button"
                        aria-label="Excluir simulado"
                        onClick={() => handleDelete(exam.id)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600 active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-bold text-slate-800">Visao rapida</h3>
            <div className="space-y-4">
              <div className="rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-blue-700">
                  <TrendingUp size={18} />
                  <span className="text-sm font-bold">Media geral</span>
                </div>
                <p className="mt-2 text-3xl font-black text-blue-900">
                  {metrics.averageScore}%
                </p>
              </div>

              <div className="rounded-2xl bg-teal-50 p-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <Trophy size={18} />
                  <span className="text-sm font-bold">Melhor resultado</span>
                </div>
                <p className="mt-2 text-3xl font-black text-teal-900">
                  {metrics.bestScore}%
                </p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={18} />
                  <span className="text-sm font-bold">Tempo medio</span>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-800">
                  {metrics.averageDuration}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
