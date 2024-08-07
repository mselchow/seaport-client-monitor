import { auth } from "@clerk/nextjs";

import { saveExcludedClients } from "@/lib/clerk";

export async function POST(request: Request) {
    const userAuth = auth();

    // get data from request
    const body = await request.json();

    // check for required input
    if (!body.excludedClients) {
        return new Response(
            JSON.stringify({ data: "Excluded client data not found." }),
            { status: 400 }
        );
    }

    const result = await saveExcludedClients(userAuth, body.excludedClients);

    return Response.json(result);
}
