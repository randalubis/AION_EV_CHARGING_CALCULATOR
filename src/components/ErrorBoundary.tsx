import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen bg-forest-dark flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Terjadi Kesalahan
            </h1>
            <p className="text-white/60 mb-6">
              Mohon maaf, halaman tidak dapat dimuat. Silakan refresh halaman atau coba lagi nanti.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#FFC300] hover:bg-[#FFD60A] text-forest-dark font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
