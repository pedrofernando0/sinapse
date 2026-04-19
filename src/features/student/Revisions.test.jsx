import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Revisions from './Revisions.jsx';
import {
  deleteStudentRevision,
  getStudentRevisions,
  saveStudentRevision,
  updateStudentRevisionStatus,
} from '../../services/student.js';

vi.mock('../../services/student.js', () => ({
  deleteStudentRevision: vi.fn(),
  getStudentRevisions: vi.fn(),
  saveStudentRevision: vi.fn(),
  updateStudentRevisionStatus: vi.fn(),
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

    expect(screen.getByText('Carregando revisoes...')).toBeInTheDocument();

    resolveRequest([]);

    await waitFor(() => {
      expect(screen.getByText('Dia livre de revisoes!')).toBeInTheDocument();
    });
  });

  it('renders the error state and retries', async () => {
    getStudentRevisions
      .mockRejectedValueOnce(new Error('Falha ao carregar revisoes'))
      .mockResolvedValueOnce([]);

    const user = userEvent.setup();

    render(<Revisions />);

    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar revisoes')).toBeInTheDocument();
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
        date: '2026-04-19',
        status: 'pending',
        subject: 'Matematica',
        topic: 'Geometria Espacial',
      },
    ]);
    saveStudentRevision
      .mockResolvedValueOnce({
        id: 'revision-2',
        date: '2026-04-19',
        status: 'pending',
        subject: 'Biologia',
        topic: 'Ecologia',
      })
      .mockResolvedValueOnce({
        id: 'revision-1',
        date: '2026-04-19',
        status: 'pending',
        subject: 'Matematica',
        topic: 'Geometria Analitica',
      });
    updateStudentRevisionStatus.mockResolvedValue({
      id: 'revision-1',
      date: '2026-04-19',
      status: 'done',
      subject: 'Matematica',
      topic: 'Geometria Analitica',
    });
    deleteStudentRevision.mockResolvedValue({ ok: true });

    const user = userEvent.setup();

    render(<Revisions />);

    await screen.findByText('Geometria Espacial');

    await user.click(screen.getByRole('button', { name: 'Nova revisao' }));
    await user.type(screen.getByLabelText('Topico'), 'Ecologia');
    await user.click(screen.getByRole('button', { name: 'Salvar revisao' }));

    await waitFor(() => {
      expect(saveStudentRevision).toHaveBeenCalledWith(
        expect.objectContaining({ topic: 'Ecologia' }),
      );
    });

    await user.click(screen.getAllByRole('button', { name: 'Editar revisao' })[0]);
    const topicInput = screen.getByLabelText('Topico');
    await user.clear(topicInput);
    await user.type(topicInput, 'Geometria Analitica');
    await user.click(screen.getByRole('button', { name: 'Salvar revisao' }));

    await waitFor(() => {
      expect(saveStudentRevision).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'revision-1', topic: 'Geometria Analitica' }),
      );
    });

    await user.click(screen.getAllByRole('button', { name: 'Marcar revisao como concluida' })[0]);

    await waitFor(() => {
      expect(updateStudentRevisionStatus).toHaveBeenCalledWith('revision-1', 'done');
    });

    await user.click(screen.getByRole('button', { name: 'Excluir revisao' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar exclusao' }));

    await waitFor(() => {
      expect(deleteStudentRevision).toHaveBeenCalledWith('revision-2');
    });
  });
});
