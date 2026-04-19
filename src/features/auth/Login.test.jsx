import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login.jsx';

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the auth error returned by the server login flow', async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error('Credenciais inválidas.'));
    const user = userEvent.setup();

    render(<Login onLogin={onLogin} />);

    await user.click(screen.getByRole('button', { name: 'Sou Estudante Acessar trilhas, revisões e métricas.' }));
    await user.type(screen.getByLabelText('E-mail'), 'valentina@example.com');
    await user.type(screen.getByLabelText('Senha'), 'senha-incorreta');
    await user.click(screen.getByRole('button', { name: 'Acessar painel' }));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith({
        formData: {
          confirmPassword: '',
          email: 'valentina@example.com',
          fullName: '',
          password: 'senha-incorreta',
          unit: 'Cursinho Popular da Poli-USP',
        },
        profile: 'aluno',
      });
    });

    expect(await screen.findByText('Credenciais inválidas.')).toBeInTheDocument();
  });

  it('submits the register flow and shows the confirmation message', async () => {
    const onRegister = vi.fn().mockResolvedValue({ requiresEmailConfirmation: true });
    const user = userEvent.setup();

    render(<Login onLogin={vi.fn()} onRegister={onRegister} />);

    await user.click(screen.getByRole('button', { name: 'Sou Estudante Acessar trilhas, revisões e métricas.' }));
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));
    await user.type(screen.getByLabelText('Nome completo'), 'Valentina Souza');
    await user.type(screen.getByLabelText('E-mail'), 'valentina@example.com');
    await user.type(screen.getByLabelText('Senha'), 'SenhaSegura123!');
    await user.type(screen.getByLabelText('Confirmar senha'), 'SenhaSegura123!');
    await user.click(screen.getByRole('button', { name: 'Cadastrar agora' }));

    await waitFor(() => {
      expect(onRegister).toHaveBeenCalledWith({
        email: 'valentina@example.com',
        fullName: 'Valentina Souza',
        password: 'SenhaSegura123!',
        profile: 'aluno',
      });
    });

    expect(
      await screen.findByText('Conta criada. Verifique seu e-mail para confirmar o cadastro.'),
    ).toBeInTheDocument();
  });

  it('submits the recovery flow and confirms the e-mail dispatch', async () => {
    const onRecover = vi.fn().mockResolvedValue({ ok: true });
    const user = userEvent.setup();

    render(<Login onLogin={vi.fn()} onRecover={onRecover} />);

    await user.click(screen.getByRole('button', { name: 'Sou Professor Gestão de turmas e alertas preditivos.' }));
    await user.click(screen.getByRole('button', { name: 'Esqueci a senha' }));
    await user.type(screen.getByLabelText('E-mail'), 'prof@example.com');
    await user.click(screen.getByRole('button', { name: 'Enviar recuperação' }));

    await waitFor(() => {
      expect(onRecover).toHaveBeenCalledWith('prof@example.com');
    });

    expect(
      await screen.findByText('Se existir uma conta para esse e-mail, você receberá o link de recuperação.'),
    ).toBeInTheDocument();
  });
});
