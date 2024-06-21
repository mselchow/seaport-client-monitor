import { clerkClient, auth } from "@clerk/nextjs";

export async function PUT(request: Request) {
    const { userId } = auth();

    // get data from request
    const goals = await request.json();

    // check for required input
    if (!goals) {
        return new Response("Request body missing value for 'goals'.", {
            status: 400,
        });
    }

    const result = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            goals,
        },
    });

    return Response.json(result);
}
