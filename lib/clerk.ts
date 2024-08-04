import type {
    SignedInAuthObject,
    SignedOutAuthObject,
} from "@clerk/nextjs/server";

import { clerkClient } from "@clerk/nextjs";
import { captureMessage } from "@sentry/nextjs";
import SimpleCrypto from "simple-crypto-js";

export const getClockifyKey = async (
    auth: SignedInAuthObject | SignedOutAuthObject
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const clockifyEncryptionKey =
        process.env.CLOCKIFY_ENCRYPTION_KEY + auth.userId;
    const simpleCrypto = new SimpleCrypto(clockifyEncryptionKey);

    const user = await clerkClient.users.getUser(auth.userId);

    const userClockifyKey =
        ((await user.privateMetadata.clockifyKey) as string) || null;

    return userClockifyKey === null
        ? userClockifyKey
        : (simpleCrypto.decrypt(userClockifyKey) as string);
};

export const saveClockifyKey = async (
    auth: SignedInAuthObject | SignedOutAuthObject,
    clockifyKey: string
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const clockifyEncryptionKey =
        process.env.CLOCKIFY_ENCRYPTION_KEY + auth.userId;
    const simpleCrypto = new SimpleCrypto(clockifyEncryptionKey);
    const encryptedKey = simpleCrypto.encrypt(clockifyKey);

    const user = await clerkClient.users.getUser(auth.userId);

    // TODO: check status of save on Settings page
    const response = await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
            encryptedKey,
        },
        publicMetadata: {
            hasClockifyKey: true,
        },
    });

    return response === null ? false : true;
};

export const saveExcludedClients = async (
    auth: SignedInAuthObject | SignedOutAuthObject,
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
