import { WaitlistShadcn } from "./waitlist";

export default function WaitlistTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Waitlist Test</h1>
          <p className="text-muted-foreground">
            Test your waitlist element with Clerk integration
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
            ⚠️ Setup Required
          </p>
          <p className="text-amber-700 dark:text-amber-300 text-xs">
            Wrap your root layout with{" "}
            <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded text-xs">
              &lt;ClerkProvider&gt;
            </code>{" "}
            and enable waitlist mode in your Clerk dashboard.
          </p>
        </div>

        <WaitlistShadcn />
      </div>
    </div>
  );
}
