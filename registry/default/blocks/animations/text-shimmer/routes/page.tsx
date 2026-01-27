import { TextShimmer } from "@/registry/default/blocks/animations/text-shimmer/components/elements/text-shimmer";

export default function TextShimmerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Text Shimmer</h1>
            <p className="text-muted-foreground">
              Animated shimmer effect for text with customizable timing and
              spread.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8">
            <TextShimmer className="text-4xl font-bold" duration={2}>
              Shimmer Effect
            </TextShimmer>
            <TextShimmer className="text-2xl font-medium" duration={1.5}>
              Loading content...
            </TextShimmer>
            <TextShimmer className="text-lg" duration={3} spread={3}>
              Custom spread and duration
            </TextShimmer>
          </div>
        </div>
      </div>
    </div>
  );
}
