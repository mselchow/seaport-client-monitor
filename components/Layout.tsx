import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";
import RefreshPrompt from "./RefreshPrompt";
import Footer from "./Footer";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="container flex flex-grow px-4 py-4">
                <div className="w-full">{children}</div>
            </main>

            <SignedIn>
                <RefreshPrompt />
                <Footer />
            </SignedIn>
        </div>
    );
}
