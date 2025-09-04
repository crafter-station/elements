"use server";

import { createClerkClient } from "@clerk/backend";
import { ClerkAPIResponseError } from "@clerk/shared";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is not set");
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

type WaitlistState = {
  success?: boolean;
  error?: string;
  message?: string;
};

export async function addToWaitlist(
  _prevState: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  try {
    await clerkClient.waitlistEntries.create({
      emailAddress: email,
      notify: true,
    });

    return { success: true, message: "You're on the list." };
  } catch (error) {
    console.error("Failed to add to waitlist:", error);

    if (
      error instanceof ClerkAPIResponseError &&
      error.errors[0].code === "form_identifier_exists"
    ) {
      return { error: "You're already on the waitlist!" };
    }

    if (
      error instanceof ClerkAPIResponseError &&
      error.errors[0].code === "form_invalid_email_address"
    ) {
      return { error: "Please enter a valid email address" };
    }

    return { error: "Failed to join waitlist. Please try again." };
  }
}
