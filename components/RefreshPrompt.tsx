import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBuildId } from "@/lib/useBuildId";

export default function RefreshPrompt() {
    const router = useRouter();
    const buildData = useBuildId();

    let buildId = null;

    if (buildData.isFetched) {
        buildId = buildData.data.buildId;
    }

    const alertMessage =
        "Hey! There's a sweet new version of the app available.";

    const newBuildAvailable =
        buildId && process.env.BUILD_ID && buildId !== process.env.BUILD_ID;

    return newBuildAvailable ? (
        <Card className="fixed bottom-5 z-10 mx-5 w-11/12 border-foreground shadow-md sm:w-72">
            <CardContent className="pt-5">
                <p>{alertMessage}</p>
            </CardContent>
            <CardFooter>
                <Button className="" onClick={() => router.reload()}>
                    Reload
                </Button>
            </CardFooter>
        </Card>
    ) : null;
}
