import { auth } from "@clerk/nextjs";
import { captureMessage } from "@sentry/nextjs";

import { getClockifyKey } from "@/lib/clerk";

export async function GET() {
    const userAuth = auth();

    const clockifyKey = await getClockifyKey(userAuth);
    if (clockifyKey === null) {
        return new Response(
            "Clockify API key not found for user. Go to the Settings page to add your API key.",
            { status: 400 }
        );
    }

    const apiURL = "https://api.clockify.me/api/v1/user";
    const apiHeaders = { "X-Api-Key": clockifyKey };
    const apiRes = await fetch(apiURL, { headers: apiHeaders });
    const data = await apiRes.json();

    if (!apiRes.ok) {
        const error = `error communicating with Clockify ${apiRes.status}: ${apiRes.statusText}`;
        captureMessage(error);
        throw new Error(error);
    }

    return Response.json(data);
}
