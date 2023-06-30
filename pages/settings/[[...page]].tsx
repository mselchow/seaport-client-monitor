import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Page() {
    const router = useRouter();

    const settingsNav = [
        {
            title: "Clockify",
            href: "/settings",
            content: <p>Clockify</p>,
        },
        {
            title: "Clients",
            href: "/settings/clients",
            content: <p>Clients</p>,
        },
        {
            title: "Goals",
            href: "/settings/goals",
            content: <p>Goals</p>,
        },
        {
            title: "Display",
            href: "/settings/display",
            content: <p>Display</p>,
        },
    ];

    const page = settingsNav.find(({ href }) => href === router.asPath);
    const pageContent =
        page !== undefined ? page.content : "An error occurred.";

    return (
        <>
            <Head>
                <title>Settings | Seaport Client Monitor</title>
            </Head>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Settings</CardTitle>
                    <CardDescription className="text-base">
                        Manage your Client Monitor settings.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Separator className="mb-6" />

                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
                        <aside className="lg:w-1/5">
                            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                                {settingsNav.map((nav) => (
                                    <Button
                                        variant="ghost"
                                        key={nav.href}
                                        className={cn(
                                            router.asPath === nav.href
                                                ? "bg-muted hover:bg-muted"
                                                : "hover:bg-transparent hover:underline",
                                            "justify-start"
                                        )}
                                        asChild
                                    >
                                        <Link href={nav.href}>{nav.title}</Link>
                                    </Button>
                                ))}
                            </nav>
                        </aside>
                        <div className="flex-1 lg:max-w-2xl">{pageContent}</div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
