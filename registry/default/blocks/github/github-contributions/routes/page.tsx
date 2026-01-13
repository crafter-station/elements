import { GitHubContributions } from "@/registry/default/blocks/github/github-contributions/components/elements/github-contributions";

export default function GitHubContributionsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">GitHub Contributions</h1>
            <p className="text-muted-foreground">
              Display contribution activity grid like GitHub&apos;s profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GitHubContributions owner="shadcn-ui" repo="ui" />
            <GitHubContributions owner="vercel" repo="next.js" />
          </div>

          <div className="bg-card border rounded-lg p-6 text-left space-y-4">
            <h2 className="text-lg font-semibold">Features</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Fetches real-time contribution data from GitHub API</li>
              <li>Shows commit activity over last 12 weeks</li>
              <li>Uses HeatmapGrid primitive for visualization</li>
              <li>Loading and error states included</li>
              <li>Handles GitHub API rate limiting gracefully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
