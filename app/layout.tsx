import { Metadata } from "next";

import ClientLayout from "@/app/ClientLayout";

export const metadata: Metadata = {
    title: {
        template: "%s | Seaport Client Monitor",
        default: "Seaport Client Monitor",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="overflow-y-scroll">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
