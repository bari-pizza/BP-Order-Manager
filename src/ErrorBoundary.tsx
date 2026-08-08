import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
    showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({ errorInfo });
        
        // Send error to Sentry in production
        if (import.meta.env.PROD) {
            Sentry.captureException(error, {
                contexts: {
                    react: {
                        componentStack: errorInfo.componentStack,
                    },
                },
            });
        }
    }

    toggleDetails = () => {
        this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
    };

    render() {
        if (this.state.hasError && this.state.error) {
            return (
                <div style={{ border: '1px solid red', padding: '10px', margin: '10px' }}>
                    <h1>Something went wrong.</h1>
                    <button onClick={this.toggleDetails}>
                        {this.state.showDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                    {this.state.showDetails && (
                        <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                            <p>
                                <strong>Error:</strong> {this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <p>
                                    <strong>Stack Trace:</strong>
                                    <br />
                                    {this.state.errorInfo.componentStack}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
