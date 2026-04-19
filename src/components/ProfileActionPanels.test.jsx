import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AccountSettingsModal } from './ProfileActionPanels.jsx';

describe('AccountSettingsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
      },
    });
  });

  it('updates the profile name together with the local preferences', async () => {
    const onUpdateProfile = vi.fn().mockResolvedValue({
      session: {
        hiddenStudentViews: [],
        profile: 'aluno',
        user: {
          email: 'valentina@example.com',
          id: 'user-1',
        },
      },
      user: {
        email: 'valentina@example.com',
        fullName: 'Valentina Castro',
        id: 'user-1',
        profile: 'aluno',
      },
    });
    const user = userEvent.setup();

    render(
      <AccountSettingsModal
        onClose={vi.fn()}
        onUpdateProfile={onUpdateProfile}
        open
        profile="student"
        userEmail="valentina@example.com"
        userName="Valentina Souza"
      />,
    );

    const nameField = screen.getByLabelText('Nome exibido');
    await user.clear(nameField);
    await user.type(nameField, 'Valentina Castro');
    await user.click(screen.getByRole('button', { name: 'Salvar preferencias' }));

    await waitFor(() => {
      expect(onUpdateProfile).toHaveBeenCalledWith({ fullName: 'Valentina Castro' });
    });

    expect(await screen.findByText('Perfil e preferencias salvos com sucesso.')).toBeInTheDocument();
  });
});
