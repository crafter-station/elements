import Link from "next/link";

export default async function ProviderPlayground({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-gray-400 hover:text-white mb-6 inline-block"
        >
          ← Back to home
        </Link>

        <h1 className="text-4xl font-bold mb-4 capitalize">
          {provider} Playground
        </h1>

        <div className="p-6 border border-gray-800 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Development Area</h2>
          <p className="text-gray-400 mb-4">
            Import and test your {provider} components here
          </p>

          <div className="bg-gray-900 p-4 rounded border border-gray-800">
            <p className="text-sm text-gray-500 mb-2">Example:</p>
            <pre className="text-sm text-green-400">
              {`import { MyComponent } from "@registry/${provider}/my-component";

export default function Page() {
  return <MyComponent />;
}`}
            </pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-950/20 border border-blue-900/50 rounded">
            <h3 className="text-blue-400 font-semibold mb-2">
              💡 Development Tips
            </h3>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Components auto-reload when you save changes</li>
              <li>
                Use{" "}
                <code className="bg-gray-800 px-1 rounded">
                  @registry/{provider}/*
                </code>{" "}
                imports
              </li>
              <li>
                Keep experimental code in{" "}
                <code className="bg-gray-800 px-1 rounded">
                  components/temp/
                </code>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-green-950/20 border border-green-900/50 rounded">
            <h3 className="text-green-400 font-semibold mb-2">
              ✅ When Ready to Ship
            </h3>
            <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
              <li>
                Run{" "}
                <code className="bg-gray-800 px-1 rounded">
                  bun run move-component
                </code>
              </li>
              <li>Tell Claude to add it to the registry</li>
              <li>
                Test in the main app at{" "}
                <code className="bg-gray-800 px-1 rounded">
                  localhost:3000/docs/{provider}
                </code>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
