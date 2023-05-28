import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";
import RefreshPrompt from "./RefreshPrompt";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col justify-start bg-gray-100">
            <Header />
            <main className="container mx-auto flex justify-center px-5 py-5">
                {children}
            </main>
            <div className="flex-grow">{""}</div>
            <RefreshPrompt />
            <SignedIn>
                <Footer />
            </SignedIn>
        </div>
    );
}
