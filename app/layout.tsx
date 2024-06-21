import { Metadata } from "next";

import Providers from "@/app/providers";

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
        <html lang="en" suppressHydrationWarning>
            <body className="overflow-y-scroll">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
