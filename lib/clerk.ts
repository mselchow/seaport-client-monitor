import { clerkClient } from "@clerk/nextjs/server";
import { captureMessage } from "@sentry/nextjs";
import SimpleCrypto from "simple-crypto-js";

interface AuthUser {
    userId: string | null;
}

export const getClockifyKey = async (auth: AuthUser) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const clockifyEncryptionKey =
        process.env.CLOCKIFY_ENCRYPTION_KEY + auth.userId;
    const simpleCrypto = new SimpleCrypto(clockifyEncryptionKey);

    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);

    const userClockifyKey =
        ((await user.privateMetadata.clockifyKey) as string) || null;

    return userClockifyKey === null
        ? userClockifyKey
        : (simpleCrypto.decrypt(userClockifyKey) as string);
};

export const saveClockifyKey = async (auth: AuthUser, clockifyKey: string) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const clockifyEncryptionKey =
        process.env.CLOCKIFY_ENCRYPTION_KEY + auth.userId;
    const simpleCrypto = new SimpleCrypto(clockifyEncryptionKey);
    const encryptedKey = simpleCrypto.encrypt(clockifyKey);

    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);

    // TODO: check status of save on Settings page
    const response = await client.users.updateUserMetadata(user.id, {
        privateMetadata: {
            clockifyKey: encryptedKey,
        },
        publicMetadata: {
            hasClockifyKey: true,
        },
    });

    return response === null ? false : true;
};

export const saveExcludedClients = async (
    auth: AuthUser,
    excludedClientData: string[]
) => {
    if (!auth.userId) {
        captureMessage("Clerk userId missing");
        throw new Error("Clerk userId missing");
    }

    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);

    const response = await client.users.updateUserMetadata(user.id, {
        publicMetadata: {
            excludedClients: excludedClientData,
        },
    });

    return response === null ? false : true;
};
