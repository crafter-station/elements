import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Shadow properties schema
const shadowPropertiesSchema = z.object({
  color: z.string().describe("Shadow color in hex format (e.g., '#000000')"),
  opacity: z.string().describe("Shadow opacity as decimal (e.g., '0.1')"),
  blur: z.string().describe("Blur radius (e.g., '4px')"),
  spread: z.string().describe("Spread radius (e.g., '0px')"),
  offset_x: z.string().describe("Horizontal offset (e.g., '0px')"),
  offset_y: z.string().describe("Vertical offset (e.g., '2px')"),
});

// Complete shadcn palette schema - this is what the AI will fill in
const shadcnPaletteSchema = z.object({
  background: z.string().describe("Background color in OKLCH format"),
  foreground: z.string().describe("Foreground text color in OKLCH format"),
  card: z.string().describe("Card background color in OKLCH format"),
  "card-foreground": z.string().describe("Card text color in OKLCH format"),
  popover: z.string().describe("Popover background in OKLCH format"),
  "popover-foreground": z.string().describe("Popover text in OKLCH format"),
  primary: z.string().describe("Primary brand color in OKLCH format"),
  "primary-foreground": z.string().describe("Text on primary in OKLCH format"),
  secondary: z.string().describe("Secondary color in OKLCH format"),
  "secondary-foreground": z
    .string()
    .describe("Text on secondary in OKLCH format"),
  muted: z.string().describe("Muted background in OKLCH format"),
  "muted-foreground": z.string().describe("Muted text in OKLCH format"),
  accent: z.string().describe("Accent color in OKLCH format"),
  "accent-foreground": z.string().describe("Text on accent in OKLCH format"),
  destructive: z.string().describe("Destructive/error color in OKLCH format"),
  "destructive-foreground": z
    .string()
    .describe("Text on destructive in OKLCH format"),
  border: z.string().describe("Border color in OKLCH format"),
  input: z.string().describe("Input border color in OKLCH format"),
  ring: z.string().describe("Focus ring color in OKLCH format"),
  "chart-1": z.string().describe("Chart color 1 in OKLCH format"),
  "chart-2": z.string().describe("Chart color 2 in OKLCH format"),
  "chart-3": z.string().describe("Chart color 3 in OKLCH format"),
  "chart-4": z.string().describe("Chart color 4 in OKLCH format"),
  "chart-5": z.string().describe("Chart color 5 in OKLCH format"),
  sidebar: z.string().describe("Sidebar background in OKLCH format"),
  "sidebar-foreground": z.string().describe("Sidebar text in OKLCH format"),
  "sidebar-primary": z.string().describe("Sidebar primary in OKLCH format"),
  "sidebar-primary-foreground": z
    .string()
    .describe("Sidebar primary text in OKLCH format"),
  "sidebar-accent": z.string().describe("Sidebar accent in OKLCH format"),
  "sidebar-accent-foreground": z
    .string()
    .describe("Sidebar accent text in OKLCH format"),
  "sidebar-border": z.string().describe("Sidebar border in OKLCH format"),
  "sidebar-ring": z.string().describe("Sidebar focus ring in OKLCH format"),
  shadow: shadowPropertiesSchema.optional().describe("Shadow configuration"),
});

export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const openai = createOpenAI({ apiKey });

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(5),
      system: `You are a shadcn/ui theme expert. You help users create beautiful, accessible design systems with complete color palettes, typography, spacing, and shadows using OKLCH color format.

IMPORTANT RULES FOR COLORS:
1. Always use OKLCH format: oklch(lightness chroma hue)
   - Lightness: 0-1 (0 = black, 1 = white)
   - Chroma: 0-0.4 (saturation, 0 = gray)
   - Hue: 0-360 (color angle)
   - For transparency: oklch(L C H / alpha%)
   - Examples:
     * Pure white: oklch(1 0 0)
     * Pure black: oklch(0 0 0)
     * Blue primary: oklch(0.5 0.2 240)
     * Semi-transparent border: oklch(1 0 0 / 10%)

2. Ensure proper contrast ratios for accessibility (WCAG AA minimum):
   - foreground on background: 4.5:1 minimum
   - primary-foreground on primary: 4.5:1 minimum
   - All text on their backgrounds must be readable

3. Light mode color guidance:
   - Background: Very light (lightness 0.95-1.0)
   - Foreground: Very dark (lightness 0.1-0.2)
   - Primary: Medium lightness with saturation (e.g., oklch(0.5 0.2 HUE))
   - Borders: Light gray (e.g., oklch(0.92 0 0))

4. Dark mode color guidance:
   - Background: Very dark (lightness 0.1-0.2)
   - Foreground: Very light (lightness 0.95-1.0)
   - Primary: Lighter than light mode (e.g., oklch(0.7 0.2 HUE))
   - Borders: Use transparency (e.g., oklch(1 0 0 / 10%))

5. Chart colors should use different hues spread across the color wheel

TYPOGRAPHY GUIDANCE:
- Sans: Modern, clean fonts (e.g., Inter, Poppins, Work Sans, DM Sans, Outfit)
- Serif: Traditional, elegant fonts (e.g., Playfair Display, Merriweather, Lora, Crimson Pro)
- Mono: Code fonts (e.g., JetBrains Mono, Fira Code, IBM Plex Mono, Source Code Pro)

RADIUS GUIDANCE:
- sm: 0.125rem - 0.25rem (sharp to slightly rounded)
- md: 0.375rem - 0.5rem (moderately rounded)
- lg: 0.5rem - 0.75rem (well rounded)
- xl: 0.75rem - 1rem (very rounded)

SHADOW GUIDANCE:
- Use subtle shadows for depth (opacity 0.05-0.15)
- Larger blur for elevated elements
- Keep shadows consistent with theme mood

When generating a theme:
1. Analyze the user's description carefully
2. Choose a primary hue that matches their request
3. Create harmonious color palettes for both light and dark modes
4. Select appropriate fonts that match the theme mood
5. Choose radius values that fit the design style
6. Configure shadows for proper depth
7. Explain your design choices briefly after generation`,
      tools: {
        "generate-theme": tool({
          description:
            "Generate a complete shadcn/ui theme with all color tokens, fonts, spacing, radius, and shadows for both light and dark modes. The AI must provide ALL color tokens in OKLCH format.",
          inputSchema: z.object({
            title: z
              .string()
              .max(30)
              .describe(
                "Short theme title, maximum 2-3 words (e.g., 'Ocean Breeze', 'Dark Forest')",
              ),
            concept: z.string().describe("Brief theme description and mood"),
            light: shadcnPaletteSchema.describe(
              "Complete light mode palette - ALL tokens required in OKLCH format with proper contrast. Background should be very light, foreground very dark.",
            ),
            dark: shadcnPaletteSchema.describe(
              "Complete dark mode palette - ALL tokens required in OKLCH format with proper contrast. Background should be very dark, foreground very light.",
            ),
            fonts: z
              .object({
                sans: z
                  .string()
                  .describe(
                    "Primary sans-serif font family from Google Fonts (e.g., 'Inter', 'Poppins')",
                  ),
                serif: z
                  .string()
                  .describe(
                    "Serif font family from Google Fonts (e.g., 'Playfair Display', 'Merriweather')",
                  ),
                mono: z
                  .string()
                  .describe(
                    "Monospace font family from Google Fonts (e.g., 'JetBrains Mono', 'Fira Code')",
                  ),
              })
              .describe("Google Fonts selection for theme typography"),
            radius: z
              .object({
                sm: z
                  .string()
                  .describe("Small border radius (e.g., '0.125rem', '2px')"),
                md: z
                  .string()
                  .describe("Medium border radius (e.g., '0.375rem', '6px')"),
                lg: z
                  .string()
                  .describe("Large border radius (e.g., '0.5rem', '8px')"),
                xl: z
                  .string()
                  .describe(
                    "Extra large border radius (e.g., '0.75rem', '12px')",
                  ),
              })
              .describe("Border radius scale for rounded corners"),
            letter_spacing: z
              .string()
              .default("0em")
              .describe(
                "Letter spacing for body text (e.g., '0em', '0.025em')",
              ),
            shadows: z
              .object({
                color: z
                  .string()
                  .describe("Shadow color in hex format (e.g., '#000000')"),
                opacity: z
                  .string()
                  .describe(
                    "Shadow opacity as decimal string (e.g., '0.1', '0.25')",
                  ),
                offsetX: z
                  .string()
                  .describe("Shadow horizontal offset (e.g., '0px', '2px')"),
                offsetY: z
                  .string()
                  .describe("Shadow vertical offset (e.g., '2px', '4px')"),
                blur: z
                  .string()
                  .describe("Shadow blur radius (e.g., '4px', '8px')"),
                spread: z
                  .string()
                  .describe("Shadow spread radius (e.g., '0px', '1px')"),
              })
              .describe("Shadow system configuration"),
          }),
          execute: async ({
            title,
            concept,
            light,
            dark,
            fonts,
            radius,
            letter_spacing,
            shadows,
          }) => {
            // Transform shadow format from offsetX/offsetY to offset_x/offset_y
            const shadowProps = {
              color: shadows.color,
              opacity: shadows.opacity,
              blur: shadows.blur,
              spread: shadows.spread,
              offset_x: shadows.offsetX,
              offset_y: shadows.offsetY,
            };

            // Add shadows to light and dark palettes if not already included
            const lightWithShadow = {
              ...light,
              shadow: light.shadow || shadowProps,
            };
            const darkWithShadow = {
              ...dark,
              shadow: dark.shadow || shadowProps,
            };

            return {
              title,
              concept,
              light: lightWithShadow,
              dark: darkWithShadow,
              fonts,
              radius,
              letter_spacing,
              shadows: shadowProps,
              success: true,
              timestamp: new Date().toISOString(),
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
