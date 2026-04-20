import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { ERROR_SEVERITY } from '../utils/errorHandler';

/**
 * Error Display Component
 * Shows errors with appropriate styling and actions
 */
const ErrorAlert = ({
  error,
  onRetry,
  onDismiss,
  showDetails = false,
  severity = ERROR_SEVERITY.ERROR
}) => {
  const [showingDetails, setShowingDetails] = React.useState(showDetails);

  if (!error) return null;

  const getBgColor = () => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return 'bg-red-900/30 border-red-700';
      case ERROR_SEVERITY.ERROR:
        return 'bg-red-900/30 border-red-700';
      case ERROR_SEVERITY.WARNING:
        return 'bg-amber-900/30 border-amber-700';
      case ERROR_SEVERITY.INFO:
        return 'bg-blue-900/30 border-blue-700';
      default:
        return 'bg-red-900/30 border-red-700';
    }
  };

  const getTextColor = () => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.ERROR:
        return 'text-red-400';
      case ERROR_SEVERITY.WARNING:
        return 'text-amber-400';
      case ERROR_SEVERITY.INFO:
        return 'text-blue-400';
      default:
        return 'text-red-400';
    }
  };

  const getButtonColor = () => {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.ERROR:
        return 'bg-red-700 hover:bg-red-600';
      case ERROR_SEVERITY.WARNING:
        return 'bg-amber-700 hover:bg-amber-600';
      case ERROR_SEVERITY.INFO:
        return 'bg-blue-700 hover:bg-blue-600';
      default:
        return 'bg-red-700 hover:bg-red-600';
    }
  };

  const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <div className={`${getBgColor()} border rounded-lg p-4 mb-4 backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <AlertCircle className={`w-5 h-5 ${getTextColor()} flex-shrink-0 mt-0.5`} />
        
        <div className="flex-1">
          <h3 className={`${getTextColor()} font-semibold mb-1`}>
            Error
          </h3>
          <p className="text-slate-300 text-sm mb-3">
            {errorMessage}
          </p>

          {showingDetails && (typeof error === 'object' && error.details) && (
            <div className="bg-slate-900 rounded p-2 mb-3 text-xs text-slate-400 max-h-32 overflow-auto font-mono">
              {error.details}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`${getButtonColor()} text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1 transition`}
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            )}

            {error.details && (
              <button
                onClick={() => setShowingDetails(!showingDetails)}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded text-sm font-medium transition"
              >
                {showingDetails ? 'Hide' : 'Show'} Details
              </button>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-slate-400 hover:text-slate-300 p-1 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
