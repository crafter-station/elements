"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CheckoutData {
  id: string;
  status: string;
  amount: number;
  currency: string;
  product_name?: string;
  customer_email?: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkoutId = searchParams.get("checkout_id");

  useEffect(() => {
    if (checkoutId) {
      // You can optionally fetch checkout details from Polar API here
      // For now, we'll just show a generic success message
      setCheckoutData({
        id: checkoutId,
        status: "completed",
        amount: 0,
        currency: "USD",
      });
    }
    setIsLoading(false);
  }, [checkoutId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Processing your sponsorship...
          </p>
        </div>
      </div>
    );
  }

  if (!checkoutId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-destructive">
              Invalid Access
            </h1>
            <p className="text-muted-foreground">
              This page can only be accessed after a successful sponsorship
              checkout.
            </p>
          </div>
          <Button onClick={() => router.push("/sponsor")}>
            Go to Sponsorship Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Success checkmark"
            role="img"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">Thank You!</h1>
          <p className="text-xl text-muted-foreground">
            Your sponsorship means the world to us!
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We've received your sponsorship and you'll get a confirmation email
            shortly. Your support helps us continue building amazing tools.
          </p>
        </div>

        {/* Checkout Details */}
        {checkoutData && (
          <div className="bg-card border rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-4">Sponsorship Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Checkout ID:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {checkoutData.id}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="default" className="text-xs">
                  {checkoutData.status}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* What's Next */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What's Next?</h3>
          <div className="text-sm text-muted-foreground space-y-3">
            <div className="flex items-start gap-3">
              <svg
                className="size-4 text-primary mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Question Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Check your email for a receipt and confirmation</span>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="size-4 text-primary mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Question Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>You'll be added to our sponsors page within 24 hours</span>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="size-4 text-primary mt-0.5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Question Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Feel free to reach out if you have any questions</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.push("/")} variant="default">
            Back to Home
          </Button>
          <Button onClick={() => router.push("/sponsor")} variant="outline">
            View Sponsorship Page
          </Button>
        </div>

        {/* Contact */}
        <p className="text-sm text-muted-foreground">
          Questions?{" "}
          <a href="#contact" className="underline hover:text-foreground">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
