import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: Send error to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
          <div className="max-w-md w-full bg-slate-800 border border-pve-red rounded-xl p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="bg-pve-red/10 p-3 rounded-full">
                <AlertCircle className="text-pve-red" size={32} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">
                  糟糕，出错了！(Something went wrong)
                </h2>
                <p className="text-slate-400 text-sm mb-4">
                  应用程序遇到了意外错误。我们已记录此问题。
                </p>

                {this.state.error && (
                  <details className="mb-4">
                    <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 mb-2">
                      查看技术详情 (Technical Details)
                    </summary>
                    <pre className="text-xs bg-slate-950 text-red-400 p-3 rounded overflow-auto max-h-32 font-mono">
                      {this.state.error.toString()}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}

                <button
                  onClick={this.handleReset}
                  className="w-full bg-pve-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  重新加载 (Reload)
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
