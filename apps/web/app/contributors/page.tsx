"use client";

import { track } from "@vercel/analytics";

import { ClerkLogo } from "@/components/clerk-logo";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrambleText } from "@/components/scramble-text";
import { Badge } from "@/components/ui/badge";
import { CrafterStationLogo } from "@/components/ui/logos/crafter-station";
import { GitHubLogo } from "@/components/ui/logos/github";

const contributors = [
  {
    username: "Railly",
    name: "Railly Hugo",
    role: "Creator & Maintainer",
    commits: 83,
    additions: 37079,
    deletions: 11404,
    avatar: "https://github.com/Railly.png",
    githubUrl: "https://github.com/Railly",
    isCreator: true,
    companyBadge: {
      name: "Crafter Station",
      icon: <CrafterStationLogo className="w-3 h-3" />,
    },
  },
  {
    username: "cuevaio",
    name: "Anthony Cueva",
    role: "Contributor",
    commits: 10,
    additions: 2147,
    deletions: 1776,
    avatar: "https://github.com/cuevaio.png",
    githubUrl: "https://github.com/cuevaio",
    isCreator: false,
    companyBadge: {
      name: "Crafter Station",
      icon: <CrafterStationLogo className="w-3 h-3" />,
    },
  },
  {
    username: "alexcarpenter",
    name: "Alex Carpenter",
    role: "Contributor",
    commits: 3,
    additions: 17,
    deletions: 9,
    avatar: "https://github.com/alexcarpenter.png",
    githubUrl: "https://github.com/alexcarpenter",
    isCreator: false,
    companyBadge: { name: "Clerk", icon: <ClerkLogo className="w-3 h-3" /> },
  },
  {
    username: "rajofearth",
    name: "Yashraj Maher",
    role: "Contributor",
    commits: 1,
    additions: 3,
    deletions: 11,
    avatar: "https://github.com/rajofearth.png",
    githubUrl: "https://github.com/rajofearth",
    isCreator: false,
  },
];

export default function ContributorsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 w-full max-w-screen-xl border-border border-dotted border-x mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="w-full pt-12 px-8 lg:px-16">
            <div className="text-center max-w-4xl mx-auto space-y-8">
              <div className="space-y-6">
                <div className="text-lg uppercase tracking-[0.2em] font-mono text-primary/70">
                  [OPEN SOURCE]
                </div>
                <h1 className="font-dotted font-black text-5xl lg:text-7xl leading-tight tracking-tight">
                  <ScrambleText text="Contributors" />
                </h1>
                <p className="text-muted-foreground text-md lg:text-lg leading-relaxed max-w-2xl mx-auto">
                  The amazing developers who make Elements possible through
                  their contributions and dedication.
                </p>
              </div>

              <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-primary" />
                  <span>{contributors.length} contributors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 bg-primary" />
                  <span>
                    {contributors.reduce((sum, c) => sum + c.commits, 0)}{" "}
                    commits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contributors Grid */}
        <div className="w-full border-t border-border border-dotted px-8 py-16">
          <div className="space-y-8">
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {contributors.map((contributor) => (
                <a
                  key={contributor.username}
                  href={contributor.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("Contributor Profile Click", {
                      username: contributor.username,
                      name: contributor.name,
                      is_creator: contributor.isCreator,
                      source: "contributors_page",
                      action: "external_link_github",
                    })
                  }
                  className="group relative flex flex-col border border-border hover:border-foreground/20 transition-all duration-300 bg-card/30 hover:bg-accent/20"
                >
                  {/* Corner decorations */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-border"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-border"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-border"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-border"></div>

                  {contributor.isCreator && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Creator
                    </Badge>
                  )}

                  <div className="p-8 space-y-6">
                    {/* Avatar and Basic Info */}
                    <div className="flex items-start gap-4">
                      <img
                        src={contributor.avatar}
                        alt={`${contributor.name} avatar`}
                        className="w-16 h-16 rounded-full border border-border group-hover:border-primary/50 transition-colors"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {contributor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            @{contributor.username}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Badge
                            variant={
                              contributor.isCreator ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {contributor.role}
                          </Badge>
                          {contributor.companyBadge && (
                            <Badge
                              variant="outline"
                              className="text-xs flex items-center gap-1"
                            >
                              {contributor.companyBadge.icon}
                              {contributor.companyBadge.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <GitHubLogo className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Commits</span>
                        <span className="font-medium">
                          {contributor.commits}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Lines added
                        </span>
                        <span className="font-medium text-green-600">
                          +{contributor.additions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Lines removed
                        </span>
                        <span className="font-medium text-red-600">
                          -{contributor.deletions.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="h-[1px] w-full bg-border"></div>

                    {/* GitHub Link */}
                    <div className="flex items-center justify-center">
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        View on GitHub
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="w-full border-t border-border border-dotted px-8 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="font-dotted font-black text-3xl lg:text-5xl">
              <ScrambleText text="Want to Contribute?" />
            </h2>
            <p className="text-muted-foreground text-lg">
              Join our community of developers building the future of full-stack
              components. Every contribution matters!
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/crafter-station/elements"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  track("Contribute CTA Click", {
                    source: "contributors_page",
                    action: "external_link_github",
                  })
                }
                className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium gap-2"
              >
                <GitHubLogo className="w-4 h-4" />
                Contribute on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
