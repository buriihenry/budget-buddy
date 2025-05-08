import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import aj from "@/lib/arcjet";

const isProctedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/account(.*)",
    "/transaction(.*)",
])

export default clerkMiddleware((auth, req) => {
    if (isProctedRoute(req.nextUrl.pathname)) {
        if (!auth.userId) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return Response.redirect(signInUrl);
        }
    }

    // Apply Arcjet protection to transaction routes
    if (req.nextUrl.pathname.startsWith("/transaction")) {
        return aj(req).then((decision) => {
            if (decision.isDenied()) {
                return new NextResponse(
                    JSON.stringify({
                        error: "Too many requests. Please try again later.",
                    }),
                    {
                        status: 429,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
            return NextResponse.next();
        });
    }

    return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};