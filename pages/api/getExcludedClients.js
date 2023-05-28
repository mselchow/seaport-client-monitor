import { getAuth, clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    const { userId } = getAuth(req);

    // this shouldn't ever happen because of Clerk's middleware, but good to be safe
    if (!userId) {
        res.status(401);
    }

    const user = await clerkClient.users.getUser(userId);

    const excludedClients = user.publicMetadata.excludedClients || null;

    res.status(200).json(excludedClients);
}
