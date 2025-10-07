/**
 * Brand website URLs for logo components
 * Maps logo names to their official websites
 */
export const brandUrls: Record<string, string> = {
  "apple-logo": "https://www.apple.com",
  "linear-logo": "https://linear.app",
  "microsoft-logo": "https://www.microsoft.com",
  "github-logo": "https://github.com",
  "spotify-logo": "https://www.spotify.com",
  "slack-logo": "https://slack.com",
  "twitch-logo": "https://www.twitch.tv",
  "twitter-logo": "https://twitter.com",
  "x-logo": "https://x.com",
  "discord-logo": "https://discord.com",
  "notion-logo": "https://www.notion.so",
  "google-logo": "https://www.google.com",
  "qwen-logo": "https://www.alibabacloud.com/solutions/generative-ai/qwen",
  "cohere-logo": "https://cohere.com",
  "anthropic-logo": "https://www.anthropic.com",
  "hugging-face-logo": "https://huggingface.co",
  "groq-logo": "https://groq.com",
  "grok-logo": "https://grok.x.ai",
  "gemini-logo": "https://gemini.google.com",
  "lovable-logo": "https://lovable.dev",
  "perplexity-logo": "https://www.perplexity.ai",
  "v0-logo": "https://v0.dev",
  "claude-logo": "https://www.anthropic.com/claude",
  "mistral-logo": "https://mistral.ai",
  "meta-logo": "https://about.meta.com",
  "kimi-logo": "https://kimi.ai",
  "supabase-logo": "https://supabase.com",
  "stripe-logo": "https://stripe.com",
  "resend-logo": "https://resend.com",
  "better-auth-logo": "https://www.better-auth.com",
  "upstash-logo": "https://upstash.com",
  "vercel-logo": "https://vercel.com",
  "nextjs-logo": "https://nextjs.org",
  "react-logo": "https://react.dev",
  "vue-logo": "https://vuejs.org",
  "svelte-logo": "https://svelte.dev",
  "angular-logo": "https://angular.io",
  "tailwind-logo": "https://tailwindcss.com",
  "shadcn-logo": "https://ui.shadcn.com",
  "figma-logo": "https://www.figma.com",
  "framer-logo": "https://www.framer.com",
  "crafter-station-logo": "https://www.crafterstation.com",
  "kebo-logo": "https://www.kebo.app",
};

export function getBrandUrl(logoName: string): string | undefined {
  return brandUrls[logoName];
}
