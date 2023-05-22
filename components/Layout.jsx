import Header from "./Header";

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="container mx-auto flex justify-center  px-5 py-5">
                {children}
            </main>
        </>
    );
}
