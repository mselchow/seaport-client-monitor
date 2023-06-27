import { useRouter } from "next/router";
import Head from "next/head";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const router = useRouter();

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
                        <aside className="lg:w-1/5">Aside</aside>
                        <div className="flex-1 lg:max-w-2xl">
                            {router.query.page}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
