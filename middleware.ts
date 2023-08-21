import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    afterAuth(auth, req) {
        // handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        const hasKey = auth.sessionClaims?.hasClockifyKey ?? false;
        const redirectPaths = [
            "/charts",
            "/tables",
            "/settings/clients",
            "/settings/display",
            "/settings/goals",
        ];
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
