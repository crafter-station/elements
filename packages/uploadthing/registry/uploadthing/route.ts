import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next.js App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Optional: Configure logging and error handling
  config: {
    logLevel: "Info",
  },
});
