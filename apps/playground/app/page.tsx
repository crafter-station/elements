import Link from "next/link";

export default function PlaygroundHome() {
  const providers = [
    { name: "Clerk", href: "/clerk", description: "Authentication components" },
    {
      name: "Polar",
      href: "/polar",
      description: "Monetization components",
    },
    {
      name: "UploadThing",
      href: "/uploadthing",
      description: "File upload components",
    },
    { name: "Theme", href: "/theme", description: "Theme switcher components" },
    { name: "Logos", href: "/logos", description: "Brand logo components" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">⚡ Elements Playground</h1>
          <p className="text-gray-400 text-lg">
            Fast development environment for prototyping and testing components
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Running on <span className="text-green-400">localhost:3001</span>
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Available Providers</h2>

          <div className="grid gap-4">
            {providers.map((provider) => (
              <Link
                key={provider.href}
                href={provider.href}
                className="block p-6 border border-gray-800 rounded-lg hover:border-gray-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                <p className="text-gray-400">{provider.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12 p-6 border border-yellow-900/50 bg-yellow-950/20 rounded-lg">
          <h3 className="text-yellow-400 font-semibold mb-2">🚀 Quick Start</h3>
          <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
            <li>
              Create components in{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">
                apps/playground/components/temp/
              </code>
            </li>
            <li>Import and test them in provider pages above</li>
            <li>
              When ready, run{" "}
              <code className="bg-gray-800 px-2 py-1 rounded">
                bun run move-component
              </code>
            </li>
            <li>Tell Claude to update the registry.json</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
