"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import React from "react";

import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "@/components/Layout";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class">
            <ClerkProvider>
                <QueryClientProvider client={queryClient}>
                    <Layout>
                        <ErrorBoundary>
                            {children}
                            <SpeedInsights />
                        </ErrorBoundary>
                    </Layout>
                    <Toaster />
                </QueryClientProvider>
            </ClerkProvider>
        </ThemeProvider>
    );
}
