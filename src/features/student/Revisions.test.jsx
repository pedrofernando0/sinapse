import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Revisions from './Revisions.jsx';
import {
  createStudentRevision,
  deleteStudentRevision,
  getStudentRevisions,
  updateStudentRevision,
} from '../../services/student.js';

vi.mock('../../services/student.js', () => ({
  createStudentRevision: vi.fn(),
  deleteStudentRevision: vi.fn(),
  getStudentRevisions: vi.fn(),
  updateStudentRevision: vi.fn(),
}));

describe('Revisions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading and empty states', async () => {
    let resolveRequest;
    getStudentRevisions.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    render(<Revisions />);

    expect(screen.getByText('Carregando revisões...')).toBeInTheDocument();

    resolveRequest([]);

    await waitFor(() => {
      expect(screen.getByText('Dia livre de revisões!')).toBeInTheDocument();
    });
  });

  it('renders the error state and retries', async () => {
    getStudentRevisions
      .mockRejectedValueOnce(new Error('Falha ao carregar revisões'))
      .mockResolvedValueOnce([]);

    const user = userEvent.setup();

    render(<Revisions />);

    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar revisões')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    await waitFor(() => {
      expect(getStudentRevisions).toHaveBeenCalledTimes(2);
    });
  });

  it('creates, updates and deletes revisions through the service layer', async () => {
    getStudentRevisions.mockResolvedValue([
      {
        id: 'revision-1',
        date: '2026-04-18',
        status: 'pending',
        subject: 'Matemática',
        topic: 'Geometria Espacial',
      },
    ]);
    createStudentRevision.mockResolvedValue({
      id: 'revision-2',
      date: '2026-04-19',
      status: 'pending',
      subject: 'Biologia',
      topic: 'Ecologia',
    });
    updateStudentRevision.mockResolvedValue({
      id: 'revision-1',
      date: '2026-04-18',
      status: 'done',
      subject: 'Matemática',
      topic: 'Geometria Espacial',
    });
    deleteStudentRevision.mockResolvedValue({ ok: true });

    const user = userEvent.setup();

    render(<Revisions />);

    await screen.findByText('Geometria Espacial');

    await user.click(screen.getByRole('button', { name: 'Nova revisão' }));
    await user.type(screen.getByLabelText('Tópico'), 'Ecologia');
    await user.click(screen.getByRole('button', { name: 'Salvar revisão' }));

    await waitFor(() => {
      expect(createStudentRevision).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'Ecologia' }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Editar revisão' }));
    const topicInput = screen.getByLabelText('Tópico');
    await user.clear(topicInput);
    await user.type(topicInput, 'Geometria Analítica');
    await user.click(screen.getByRole('button', { name: 'Salvar revisão' }));

    await waitFor(() => {
      expect(updateStudentRevision).toHaveBeenCalledWith(
        'revision-1',
        expect.objectContaining({ topic: 'Geometria Analítica' }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Marcar revisão como concluída' }));

    await waitFor(() => {
      expect(updateStudentRevision).toHaveBeenCalledWith(
        'revision-1',
        expect.objectContaining({ status: 'done' }),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Excluir revisão' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));

    await waitFor(() => {
      expect(deleteStudentRevision).toHaveBeenCalledWith('revision-1');
    });
  });
});
