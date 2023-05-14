import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/Layout";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ThemeProvider>
            <ClerkProvider {...pageProps}>
                <QueryClientProvider client={queryClient}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </QueryClientProvider>
            </ClerkProvider>
        </ThemeProvider>
    );
}
