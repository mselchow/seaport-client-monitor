import { captureMessage } from "@sentry/nextjs";
import React from "react";

import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";

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
                <div className="flex flex-col place-items-center justify-center gap-5">
                    <TypographyH3>Whoah.</TypographyH3>
                    <p>Something went tragically wrong.</p>
                    <Button
                        className="w-32"
                        onClick={() => this.setState({ hasError: false })}
                    >
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
