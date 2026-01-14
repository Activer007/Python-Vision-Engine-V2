import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  maxRetries?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
  maxRetriesReached: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      maxRetriesReached: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Preserve retryCount and maxRetriesReached when error occurs again
    this.setState(prevState => ({
      retryCount: prevState.retryCount,
      maxRetriesReached: prevState.maxRetriesReached,
    }));

    // TODO: Send error to error tracking service (e.g., Sentry)
    if (import.meta.env.PROD) {
      // In production, send to error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    const { onReset, maxRetries = 3 } = this.props;
    const { retryCount, maxRetriesReached } = this.state;

    // Check if max retries exceeded
    if (maxRetriesReached || retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) exceeded. Please refresh the page.`);
      // Mark as max retries reached
      this.setState({ maxRetriesReached: true });
      return;
    }

    // Increment retry count and reset error state
    this.setState(
      prevState => ({
        hasError: false,
        error: null,
        retryCount: prevState.retryCount + 1,
      }),
      () => {
        // Call onReset callback if provided
        if (onReset) {
          onReset();
        }
      }
    );
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

                {this.state.error && import.meta.env.DEV && (
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

                {this.state.error && import.meta.env.PROD && (
                  <p className="text-xs text-slate-500 mb-4">错误代码: {this.state.error.name}</p>
                )}

                {this.state.retryCount > 0 && !this.state.maxRetriesReached && (
                  <p className="text-xs text-pve-amber mb-4">
                    重试次数: {this.state.retryCount}/{this.props.maxRetries || 3}
                  </p>
                )}

                {this.state.maxRetriesReached && (
                  <p className="text-xs text-pve-red mb-4 font-bold">
                    已达到最大重试次数，请刷新页面
                  </p>
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
