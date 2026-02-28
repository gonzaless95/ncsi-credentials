import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-50 text-red-800 rounded-lg m-4">
                    <h2 className="font-bold text-lg mb-2">Designer Crashed</h2>
                    <p className="mb-4">Something went wrong while loading the visual designer.</p>
                    <pre className="bg-red-100 p-4 rounded overflow-auto text-sm">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={() => {
                            localStorage.removeItem('designer-enterprise-storage-v1');
                            window.location.reload();
                        }}
                    >
                        Clear Cache & Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
