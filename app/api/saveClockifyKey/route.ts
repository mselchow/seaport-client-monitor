import { auth } from "@clerk/nextjs";

import { saveClockifyKey } from "@/lib/clerk";

export async function POST(request: Request) {
    const userAuth = auth();

    // get data from request
    const body = await request.json();

    // check for required input
    if (!body.clockifyKey) {
        return new Response("clockifyKey missing from body of request", {
            status: 400,
        });
    }

    const result = await saveClockifyKey(userAuth, body.clockifyKey);

    return Response.json(result);
}
