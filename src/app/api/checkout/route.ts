import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  successUrl: process.env.POLAR_SUCCESS_URL || "",
  server: "production", // Use sandbox for testing - change to "production" when ready
  theme: "dark",
});
