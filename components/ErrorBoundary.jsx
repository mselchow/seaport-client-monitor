import { captureMessage } from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        captureMessage(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="flex flex-col gap-5 text-center">
                    <h2>Whoah.</h2>
                    <p>Something went tragically wrong. </p>
                    <Button onClick={() => this.setState({ hasError: false })}>
                        Try again?
                    </Button>
                </div>
            );
        }

        // Return children in case of no error
        return this.props.children;
    }
}

export default ErrorBoundary;
