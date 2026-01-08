import { cn } from "@/lib/utils";
import { AlertTriangle, Home, MessageCircle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-white">
          <div className="flex flex-col items-center w-full max-w-lg text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. This might be a temporary issue.
              Please try refreshing the page or return to the homepage.
            </p>

            {/* Error details (collapsible) */}
            <details className="w-full mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Show error details
              </summary>
              <div className="mt-2 p-4 rounded-lg bg-gray-50 overflow-auto max-h-40">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
                  {this.state.error?.message || "Unknown error"}
                </pre>
              </div>
            </details>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
                  "bg-emerald-600 text-white font-medium",
                  "hover:bg-emerald-700 transition-colors"
                )}
              >
                <RotateCcw size={18} />
                Refresh Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3 rounded-lg",
                  "bg-gray-100 text-gray-700 font-medium",
                  "hover:bg-gray-200 transition-colors"
                )}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>

            {/* Feedback link */}
            <a 
              href="mailto:support@example.com?subject=Error Report"
              className="mt-6 text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1"
            >
              <MessageCircle size={14} />
              Report this issue
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
