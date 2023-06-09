import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";
import RefreshPrompt from "./RefreshPrompt";
import Footer from "./Footer";

export default function Layout({ children }) {
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
