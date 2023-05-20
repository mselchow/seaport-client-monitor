import Header from "./Header";

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="container mx-auto flex justify-center overflow-y-scroll px-5 py-5">
                {children}
            </main>
        </>
    );
}
