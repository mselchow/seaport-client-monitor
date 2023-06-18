import { clerkClient } from "@clerk/nextjs";
import { SignedInAuthObject, SignedOutAuthObject } from "@clerk/nextjs/server";
import { captureMessage } from "@sentry/nextjs";

export const getClockifyKey = async (
    auth: SignedInAuthObject | SignedOutAuthObject
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const user = await clerkClient.users.getUser(auth.userId);

    const userClockifyKey =
        ((await user.privateMetadata.clockifyKey) as string) || null;

    return userClockifyKey;
};

export const saveClockifyKey = async (
    auth: SignedInAuthObject,
    clockifyKey: string
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

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

export const saveExcludedClients = async (
    auth: SignedInAuthObject,
    excludedClientData: string[]
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const user = await clerkClient.users.getUser(auth.userId);

    const response = await clerkClient.users.updateUserMetadata(user.id, {
        publicMetadata: {
            excludedClients: excludedClientData,
        },
    });

    return response === null ? false : true;
};
