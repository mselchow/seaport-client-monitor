import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import React from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

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
