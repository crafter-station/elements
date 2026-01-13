import { GitHubStars } from "@/registry/default/blocks/github/github-stars/components/elements/github-stars";

export default function GitHubStarsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">GitHub Stars</h1>
            <p className="text-muted-foreground">
              Display repository star history with area chart visualization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GitHubStars owner="shadcn-ui" repo="ui" />
            <GitHubStars owner="vercel" repo="next.js" />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Fetches real-time star count from GitHub API</li>
              <li>Shows star history over configurable time period</li>
              <li>Uses AreaChart primitive for visualization</li>
              <li>Loading and error states included</li>
              <li>Client-side data fetching with caching</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
