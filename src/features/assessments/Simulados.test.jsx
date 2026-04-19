import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Simulados from './Simulados.jsx';
import {
  deleteStudentMockExam,
  getStudentMockExams,
  saveStudentMockExam,
} from '../../services/student.js';

vi.mock('../../services/student.js', () => ({
  deleteStudentMockExam: vi.fn(),
  getStudentMockExams: vi.fn(),
  saveStudentMockExam: vi.fn(),
}));

describe('Simulados', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading and empty states', async () => {
    let resolveRequest;
    getStudentMockExams.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<Simulados />);

    expect(screen.getByText('Carregando simulados...')).toBeInTheDocument();

    resolveRequest([]);

    await waitFor(() => {
      expect(screen.getByText('Nenhum simulado cadastrado ainda.')).toBeInTheDocument();
    });
  });

  it('renders the error state and retries', async () => {
    getStudentMockExams
      .mockRejectedValueOnce(new Error('Falha ao carregar'))
      .mockResolvedValueOnce([]);

    const user = userEvent.setup();

    render(<Simulados />);

    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    await waitFor(() => {
      expect(getStudentMockExams).toHaveBeenCalledTimes(2);
    });
  });

  it('creates, updates and deletes exams through the service layer', async () => {
    getStudentMockExams.mockResolvedValue([
      {
        id: 'exam-1',
        name: 'ENEM 2024 - Dia 1',
        date: '2026-02-15',
        total: 90,
        acertos: 72,
        time: '04:15',
      },
    ]);
    saveStudentMockExam
      .mockResolvedValueOnce({
        id: 'exam-2',
        name: 'FUVEST 2025',
        date: '2026-03-08',
        total: 90,
        acertos: 80,
        time: '04:00',
      })
      .mockResolvedValueOnce({
        id: 'exam-1',
        name: 'ENEM 2024 - Dia 1',
        date: '2026-02-15',
        total: 90,
        acertos: 75,
        time: '04:15',
      });
    deleteStudentMockExam.mockResolvedValue({ ok: true });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const user = userEvent.setup();

    render(<Simulados />);

    await screen.findByText('ENEM 2024 - Dia 1');

    await user.click(screen.getByRole('button', { name: 'Novo resultado' }));
    await user.type(screen.getByLabelText('Nome do simulado'), 'FUVEST 2025');
    await user.clear(screen.getByLabelText('Total de questoes'));
    await user.type(screen.getByLabelText('Total de questoes'), '90');
    await user.clear(screen.getByLabelText('Acertos'));
    await user.type(screen.getByLabelText('Acertos'), '80');
    await user.clear(screen.getByLabelText('Tempo'));
    await user.type(screen.getByLabelText('Tempo'), '04:00');
    await user.click(screen.getByRole('button', { name: 'Salvar resultado' }));

    await waitFor(() => {
      expect(saveStudentMockExam).toHaveBeenCalledWith(
        expect.objectContaining({
          acertos: '80',
          date: expect.any(String),
          id: null,
          name: 'FUVEST 2025',
          time: '04:00',
          total: '90',
        }),
      );
    });

    await user.click(screen.getAllByRole('button', { name: 'Editar simulado' })[0]);
    const acertosInput = screen.getByLabelText('Acertos');
    await user.clear(acertosInput);
    await user.type(acertosInput, '75');
    await user.click(screen.getByRole('button', { name: 'Salvar resultado' }));

    await waitFor(() => {
      expect(saveStudentMockExam).toHaveBeenCalledWith(
        expect.objectContaining({ acertos: '75', id: 'exam-2' }),
      );
    });

    await user.click(screen.getAllByRole('button', { name: 'Excluir simulado' })[0]);

    await waitFor(() => {
      expect(deleteStudentMockExam).toHaveBeenCalledWith('exam-1');
    });
  });
});
