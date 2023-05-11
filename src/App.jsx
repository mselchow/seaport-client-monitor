import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header";
import Charts from "./Charts";
import "./index.css";

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
    throw new Error("Missing Clerk publishable key.");
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            cacheTime: Infinity,
        },
    },
});

function App() {
    return (
        <ClerkProvider publishableKey={clerkPubKey}>
            <SignedIn>
                <BrowserRouter>
                    <QueryClientProvider client={queryClient}>
                        <Header />

                        <Routes>
                            <Route path="/" element={<Charts />} />
                        </Routes>
                    </QueryClientProvider>
                </BrowserRouter>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </ClerkProvider>
    );
}

export default App;
