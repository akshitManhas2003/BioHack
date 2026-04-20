import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches and displays React component errors gracefully
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log error to tracking service
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.toString(),
      stack: errorInfo.componentStack,
      severity: 'critical'
    };

    console.error('[Error Boundary Log]', errorLog);
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-red-900/20 border-2 border-red-700 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-12 h-12 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-red-300 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-red-200 mb-4">
                  The application encountered an unexpected error. Please try again or contact support if the problem persists.
                </p>

                {isDevelopment && (
                  <div className="mt-6 pt-6 border-t border-red-700">
                    <h2 className="text-lg font-semibold text-red-300 mb-2">Debug Information (Development Only)</h2>
                    <div className="bg-slate-900 rounded p-4 text-sm mb-4">
                      <p className="text-red-400 font-mono whitespace-pre-wrap break-words">
                        {this.state.error?.toString()}
                      </p>
                    </div>
                    {this.state.errorInfo && (
                      <div className="bg-slate-900 rounded p-4 text-sm max-h-48 overflow-auto">
                        <p className="text-slate-300 font-mono text-xs whitespace-pre-wrap break-words">
                          {this.state.errorInfo.componentStack}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={this.resetError}
                    className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold transition"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
