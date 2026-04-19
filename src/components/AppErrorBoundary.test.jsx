import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { AppErrorBoundary } from './AppErrorBoundary.jsx';

function Thrower({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Kaboom');
  }

  return <p>Aplicação recuperada</p>;
}

function Harness() {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <AppErrorBoundary onRetry={() => setShouldThrow(false)}>
      <Thrower shouldThrow={shouldThrow} />
    </AppErrorBoundary>
  );
}

describe('AppErrorBoundary', () => {
  it('shows a fallback and recovers on retry', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Harness />);

    expect(screen.getByText('Algo saiu do trilho.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));

    expect(screen.getByText('Aplicação recuperada')).toBeInTheDocument();

    errorSpy.mockRestore();
  });
});
