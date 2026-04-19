import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      hasError: false,
      retryKey: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      error,
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info);
    }
  }

  handleRetry = () => {
    this.setState((currentState) => ({
      error: null,
      hasError: false,
      retryKey: currentState.retryKey + 1,
    }));

    if (typeof this.props.onRetry === 'function') {
      this.props.onRetry();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-white">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Algo saiu do trilho.</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              A aplicação encontrou uma falha inesperada durante a renderização.
              Tente carregar a interface novamente.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
            >
              <RotateCcw size={16} />
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>;
  }
}
