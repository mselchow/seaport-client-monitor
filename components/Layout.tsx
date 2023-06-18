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
            <main className="container px-4 py-4">{children}</main>
            <div className="flex-grow">{""}</div>
            <SignedIn>
                <RefreshPrompt />
                <Footer />
            </SignedIn>
        </div>
    );
}
