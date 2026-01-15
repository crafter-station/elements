"use client";

import { ErrorBoundaryUi } from "@/registry/default/blocks/devtools/error-boundary-ui/components/elements/error-boundary-ui";

const sampleError = new Error(
  "Cannot read properties of undefined (reading 'map')",
);
sampleError.stack = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (src/components/UserList.tsx:15:23)
    at renderWithHooks (node_modules/react-dom/cjs/react-dom.development.js:14985:18)
    at mountIndeterminateComponent (node_modules/react-dom/cjs/react-dom.development.js:17811:13)`;

export default function ErrorBoundaryUiDemo() {
  return (
    <div className="w-full max-w-2xl p-4">
      <ErrorBoundaryUi
        error={sampleError}
        resetError={() => console.log("Reset clicked")}
        isDev={true}
      />
    </div>
  );
}
