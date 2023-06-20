import React from "react";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class">
            <ClerkProvider {...pageProps}>
                <QueryClientProvider client={queryClient}>
                    <Layout>
                        <ErrorBoundary>
                            <Component {...pageProps} />
                        </ErrorBoundary>
                    </Layout>
                    <Toaster />
                </QueryClientProvider>
            </ClerkProvider>
        </ThemeProvider>
    );
}
