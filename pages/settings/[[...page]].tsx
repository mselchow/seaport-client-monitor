import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import ClockifySettings from "@/components/settings/ClockifySettings";
import DisplaySettings from "@/components/settings/DisplaySettings";
import ExcludedClientSettings from "@/components/settings/ExcludedClientSettings";
import GoalSettings from "@/components/settings/GoalSettings";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SettingsNavType {
    title: string;
    href: string;
    content: JSX.Element | false;
    disabled: boolean;
}

export default function Page() {
    const router = useRouter();
    const { user, isLoaded } = useUser();

    const userHasClockifyKey =
        isLoaded && user
            ? (user.publicMetadata.hasClockifyKey as boolean)
            : false;

    const settingsNav: SettingsNavType[] = [
        {
            title: "Clockify",
            href: "/settings",
            content: <ClockifySettings />,
            disabled: false,
        },
        {
            title: "Clients",
            href: "/settings/clients",
            content: userHasClockifyKey && isLoaded && (
                <ExcludedClientSettings />
            ),
            disabled: !userHasClockifyKey,
        },
        {
            title: "Goals",
            href: "/settings/goals",
            content: <GoalSettings />,
            disabled: !userHasClockifyKey,
        },
        {
            title: "Display",
            href: "/settings/display",
            content: <DisplaySettings />,
            disabled: !userHasClockifyKey,
        },
    ];

    const page = settingsNav.find(({ href }) => href === router.asPath);
    const pageContent =
        page !== undefined ? page.content : "That settings page doesn't exist!";

    return (
        <>
            <Head>
                <title>Settings | Seaport Client Monitor</title>
            </Head>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Settings</CardTitle>
                    <CardDescription className="text-base">
                        Manage your Client Monitor settings.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Separator className="mb-6" />

                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="lg:w-1/5">
                            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                                {settingsNav.map((nav) => (
                                    <Button
                                        variant="ghost"
                                        key={nav.href}
                                        className={cn(
                                            router.asPath === nav.href
                                                ? "bg-muted hover:bg-muted"
                                                : "hover:bg-transparent",
                                            nav.disabled
                                                ? "cursor-default text-muted-foreground hover:text-muted-foreground"
                                                : "hover:underline",
                                            "justify-start"
                                        )}
                                        asChild
                                    >
                                        <Link
                                            href={nav.disabled ? {} : nav.href}
                                        >
                                            {nav.title}
                                        </Link>
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
