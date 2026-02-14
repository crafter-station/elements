import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/(.*)", // All routes are now public
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  const v0Match = url.pathname.match(/^\/r\/v0\/([^/]+)\.json$/);
  if (v0Match) {
    const componentId = v0Match[1];

    try {
      // Make a request to the original /r/{component_id}.json endpoint
      const originalUrl = new URL(`/r/${componentId}.json`, url.origin);
      const response = await fetch(originalUrl.toString());

      if (!response.ok) {
        return new NextResponse("Not Found", { status: 404 });
      }

      const jsonData = await response.json();

      // Remove css, cssVars, and envVars properties
      // biome-ignore lint/correctness/noUnusedVariables: false positive
      const { css, cssVars, envVars, ...modifiedData } = jsonData;

      // Transform registryDependencies: replace @elements/ with full URL
      if (
        modifiedData.registryDependencies &&
        Array.isArray(modifiedData.registryDependencies)
      ) {
        modifiedData.registryDependencies =
          modifiedData.registryDependencies.map((dep: string) => {
            if (dep.startsWith("@elements/")) {
              const elementName = dep.replace("@elements/", "");
              return `https://www.tryelements.dev/r/v0/${elementName}.json`;
            }
            return dep;
          });
      }

      return NextResponse.json(modifiedData);
    } catch {
      // If request fails or can't be parsed, return 404
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/r/v0/(.*)",
  ],
};
