// import React, { Component, ReactNode } from 'react';

// interface ErrorBoundaryProps {
//     children: ReactNode;
// }

// interface ErrorBoundaryState {
//     hasError: boolean;
// }

// export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
//     constructor(props: ErrorBoundaryProps) {
//         super(props);
//         this.state = { hasError: false };
//     }

//     static getDerivedStateFromError(): ErrorBoundaryState {
//         // Update state so the next render will show the fallback UI.
//         return { hasError: true };
//     }

//     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//         // You can also log the error to an error reporting service
//         console.error(error, errorInfo, 'ErrorBoundary');
//     }

//     render() {
//         if (this.state.hasError) {
//             // You can customize this error message
//             return <h1>Something went wrong.</h1>;
//         }

//         return this.props.children;
//     }
// }

import React, { Component, ReactNode } from 'react';

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
