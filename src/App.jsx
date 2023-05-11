import {
    ClerkProvider,
    SignedIn,
    SignedOut,
    RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./Header";
import ChartsPage from "./ChartsPage";
import TablesPage from "./TablesPage";
import SettingsPage from "./SettingsPage";
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
                        <div className="flex justify-center py-5">
                            <Routes>
                                <Route path="charts" element={<ChartsPage />} />
                                <Route path="tables" element={<TablesPage />} />
                                <Route
                                    path="settings"
                                    element={<SettingsPage />}
                                />
                                <Route
                                    path=""
                                    element={<Navigate to="/charts" />}
                                />
                            </Routes>
                        </div>
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
