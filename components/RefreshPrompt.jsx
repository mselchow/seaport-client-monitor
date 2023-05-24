import { Alert, Button, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useBuildId } from "@/lib/useBuildId";

export default function RefreshPrompt() {
    const buildData = useBuildId().data;
    const buildId = "12345"; //buildData.buildId;

    const alertMessage =
        "Hey! There's a sweet new version of the app available.";

    const newBuildAvailable =
        buildId && process.env.BUILD_ID && buildId !== process.env.BUILD_ID;

    return newBuildAvailable ? (
        <Alert
            className="fixed bottom-5 z-10 mx-5 w-11/12 md:w-96"
            icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
        >
            <p>{alertMessage}</p>
            <Button color="white" size="sm" className="mt-3">
                Reload
            </Button>
        </Alert>
    ) : null;
}
