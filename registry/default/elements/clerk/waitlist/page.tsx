import { Waitlist } from "@clerk/nextjs";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-[25rem] space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Join Waitlist</h1>
          <p className="text-muted-foreground">
            Join the waitlist using Clerk's built-in component
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm">
          <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">
            ⚠️ Setup Required
          </p>
          <div className="text-amber-700 dark:text-amber-300 text-xs space-y-1">
            <p>1. Wrap your root layout with ClerkProvider:</p>
            <pre className="bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded text-xs overflow-x-auto">
              <code className="block text-xs whitespace-pre-wrap break-words">{`import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/themes";

<ClerkProvider
  appearance={{ theme: shadcn }}
  waitlistUrl="/waitlist"
>
  {children}
</ClerkProvider>`}</code>
            </pre>
            <p>
              2. Enable waitlist mode in Clerk dashboard (Configure →
              Restrictions → Sign-up mode)
            </p>
            <p>3. Configure your API keys in .env.local</p>
          </div>
        </div>

        <Waitlist />
      </div>
    </div>
  );
}
