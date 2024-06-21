import { clerkClient, auth } from "@clerk/nextjs";

export async function POST(request: Request) {
    const { userId } = auth();

    if (userId === null) {
        return new Response("User ID not found", { status: 400 });
    }

    // get data from request
    const goals = await request.json();

    // check for required input
    if (!goals) {
        return new Response("Request body missing value for 'goals'.", {
            status: 400,
        });
    }
    console.log(goals);

    const result = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            goals: goals.goals,
        },
    });

    return Response.json(result);
}
