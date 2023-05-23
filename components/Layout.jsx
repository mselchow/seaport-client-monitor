import { SignedIn } from "@clerk/nextjs";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen flex-col justify-start">
            <Header />
            <main className="container mx-auto flex justify-center px-5 py-5">
                {children}
            </main>
            <div className="flex-grow">{""}</div>
            <SignedIn>
                <Footer />
            </SignedIn>
        </div>
    );
}
