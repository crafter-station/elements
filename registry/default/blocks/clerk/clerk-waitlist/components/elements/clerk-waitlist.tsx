"use client";

import * as React from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export interface ClerkWaitlistProps {
  className?: string;
  onSubmit?: (email: string) => void;
  heading?: string;
  description?: string;
  ctaText?: string;
  successMessage?: string;
}

export function ClerkWaitlist({
  className,
  onSubmit,
  heading = "Get early access",
  description = "Join the waitlist to be the first to know when we launch.",
  ctaText = "Join waitlist",
  successMessage = "You're on the list!",
}: ClerkWaitlistProps) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [queuePosition] = React.useState(
    () => Math.floor(Math.random() * 400) + 127,
  );

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim()) return;
      onSubmit?.(email);
      setSubmitted(true);
    },
    [email, onSubmit],
  );

  return (
    <div
      data-slot="clerk-waitlist"
      className={cn(
        "w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm",
        className,
      )}
    >
      {!submitted ? (
        <div data-slot="clerk-waitlist-form" className="space-y-4">
          <div data-slot="clerk-waitlist-header" className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              {heading}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                data-slot="clerk-waitlist-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              />
            </div>
            <button
              data-slot="clerk-waitlist-submit"
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {ctaText}
              <ArrowRightIcon className="size-4" />
            </button>
          </form>
        </div>
      ) : (
        <div
          data-slot="clerk-waitlist-success"
          className="flex flex-col items-center space-y-3 py-2 text-center"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
            <CheckIcon className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              {successMessage}
            </p>
            <p className="text-sm text-muted-foreground">
              You are #{queuePosition} in line
            </p>
          </div>
          <div className="w-full rounded-lg bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">
              We&apos;ll notify you at{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
