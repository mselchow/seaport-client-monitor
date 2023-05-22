import { clerkClient } from "@clerk/nextjs";

export const getClockifyKey = async (auth) => {
    const user = await clerkClient.users.getUser(auth.userId);

    const userClockifyKey = (await user.privateMetadata.clockifyKey) || null;

    return userClockifyKey;
};

export const saveClockifyKey = async (auth, clockifyKey) => {
    const user = await clerkClient.users.getUser(auth.userId);

    // TODO: check status of save on Settings page
    const response = await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            clockifyKey,
        },
        publicMetadata: {
            hasClockifyKey: true,
        },
    });

    return response === null ? false : true;
};
