import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ClerkProvider {...pageProps}>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <Toaster />
            </QueryClientProvider>
        </ClerkProvider>
    );
}
