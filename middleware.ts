import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    afterAuth(auth, req) {
        const hasKey = auth.sessionClaims?.hasClockifyKey ?? false;
        const redirectPaths = ["/charts", "/tables"];
        const reqUrl = req.nextUrl.pathname;
        const redirect = redirectPaths.includes(reqUrl) || reqUrl === "/";

        if (!hasKey && redirect) {
            return NextResponse.redirect(new URL("/settings", req.url));
        }
    },
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
