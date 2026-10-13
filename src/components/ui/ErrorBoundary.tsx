import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NEXORA Error Boundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-card max-w-lg w-full p-8 text-center border-red-500/30">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">
              {this.props.fallbackTitle || 'Section Encountered an Error'}
            </h3>
            <p className="text-xs text-[#9E9AA8] mt-2 mb-6">
              {this.state.error?.message || 'An unexpected rendering error occurred. You can retry safely.'}
            </p>
            <Button
              variant="outline"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-[#00E5FF]" />
              <span>Retry Component</span>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
