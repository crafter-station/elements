import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary mx-auto"></div>
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Completing authentication
          </h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we securely sign you in...
          </p>
        </div>
        <AuthenticateWithRedirectCallback
          signInForceRedirectUrl="/0-dashboard"
          signUpForceRedirectUrl="/0-dashboard"
          signInFallbackRedirectUrl="/0-dashboard"
          signUpFallbackRedirectUrl="/0-dashboard"
        />
      </div>
    </div>
  );
}
