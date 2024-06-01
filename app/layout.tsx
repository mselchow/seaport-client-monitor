import ClientLayout from "@/app/ClientLayout";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="shortcut icon"
                    href="/favicon.png"
                    type="image/x-icon"
                />
            </head>
            <body className="overflow-y-scroll">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
