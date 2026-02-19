import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    // handle users who aren't authenticated
    if (!userId && !isPublicRoute(req)) {
        return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (!userId) {
        return;
    }

    const hasKey = Boolean(sessionClaims?.hasClockifyKey);
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
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
