"use client";

import { useCallback, useState } from "react";

export type AvatarStyle =
  | "pixel-art"
  | "anime"
  | "cartoon"
  | "realistic"
  | "sketch";

export interface UseAiAvatarOptions {
  /** API endpoint for avatar generation */
  endpoint?: string;
  /** Style of avatar to generate */
  style?: AvatarStyle;
  /** Custom prompt additions */
  promptAdditions?: string;
  /** Whether to convert to grayscale */
  grayscale?: boolean;
  /** Whether to remove background */
  removeBackground?: boolean;
  /** Output size */
  outputSize?: { width: number; height: number };
}

export interface GenerateAvatarParams {
  /** Source image URL or File */
  image: string | File;
  /** Override options for this generation */
  options?: Partial<UseAiAvatarOptions>;
}

export interface UseAiAvatarReturn {
  /** Generate an AI avatar from an image */
  generateAvatar: (params: GenerateAvatarParams) => Promise<string | null>;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Current generation progress (0-100) */
  progress: number;
  /** Current status message */
  status: string | null;
  /** Error if generation failed */
  error: Error | null;
  /** The generated avatar URL */
  avatarUrl: string | null;
  /** Reset the hook state */
  reset: () => void;
}

const DEFAULT_PROMPTS: Record<AvatarStyle, string> = {
  "pixel-art": `8-bit pixel-art portrait, chest-up view. Use a simple solid background for easy cutout.
Apply flat grayscale shading with four tones. Style should be printed, cartoonish, anime inspired, and cute tender soft.
Preserve the facial structure. The character should fit entirely within the frame, with no labels or text.
IMPORTANT: Maintain proper proportions. If the image appears too large, zoom out to ensure the full figure fits.`,
  anime: `Anime style portrait, clean lines, vibrant but soft coloring.
Preserve facial features and expression. Simple background.
High quality illustration style.`,
  cartoon: `Cartoon style portrait with bold outlines and flat colors.
Exaggerated features in a friendly, approachable style.
Clean simple background.`,
  realistic: `Photorealistic portrait enhancement.
Improve lighting and composition while maintaining likeness.
Professional headshot style.`,
  sketch: `Hand-drawn sketch style portrait with pencil texture.
Artistic interpretation while preserving likeness.
White paper background with subtle shading.`,
};

/**
 * Hook for generating AI avatars from photos
 *
 * @example
 * ```tsx
 * const { generateAvatar, isGenerating, avatarUrl } = useAiAvatar({
 *   endpoint: "/api/generate-avatar",
 *   style: "pixel-art",
 * });
 *
 * const handleUpload = async (file: File) => {
 *   const url = await generateAvatar({ image: file });
 *   if (url) {
 *     setProfilePicture(url);
 *   }
 * };
 * ```
 */
export function useAiAvatar(
  options: UseAiAvatarOptions = {},
): UseAiAvatarReturn {
  const {
    endpoint = "/api/generate-avatar",
    style = "pixel-art",
    promptAdditions = "",
    grayscale = true,
    removeBackground = true,
    outputSize = { width: 684, height: 577 },
  } = options;

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setStatus(null);
    setError(null);
    setAvatarUrl(null);
  }, []);

  const generateAvatar = useCallback(
    async (params: GenerateAvatarParams): Promise<string | null> => {
      const { image, options: overrideOptions = {} } = params;

      const finalStyle = overrideOptions.style ?? style;
      const finalPromptAdditions =
        overrideOptions.promptAdditions ?? promptAdditions;
      const finalGrayscale = overrideOptions.grayscale ?? grayscale;
      const finalRemoveBackground =
        overrideOptions.removeBackground ?? removeBackground;
      const finalOutputSize = overrideOptions.outputSize ?? outputSize;

      setIsGenerating(true);
      setProgress(0);
      setStatus("Preparing image...");
      setError(null);

      try {
        // Convert File to base64 if needed
        let imageUrl: string;

        if (image instanceof File) {
          setProgress(10);
          setStatus("Uploading image...");

          imageUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(image);
          });
        } else {
          imageUrl = image;
        }

        setProgress(20);
        setStatus("Generating AI avatar...");

        // Build the prompt
        const basePrompt = DEFAULT_PROMPTS[finalStyle];
        const fullPrompt = finalPromptAdditions
          ? `${basePrompt}\n\n${finalPromptAdditions}`
          : basePrompt;

        // Call the API endpoint
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            prompt: fullPrompt,
            style: finalStyle,
            grayscale: finalGrayscale,
            removeBackground: finalRemoveBackground,
            outputSize: finalOutputSize,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Generation failed: ${response.status}`,
          );
        }

        setProgress(80);
        setStatus("Processing result...");

        const data = await response.json();

        if (!data.url) {
          throw new Error("No avatar URL in response");
        }

        setProgress(100);
        setStatus("Complete!");
        setAvatarUrl(data.url);

        return data.url;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Avatar generation failed");
        setError(error);
        setStatus("Failed");
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [endpoint, style, promptAdditions, grayscale, removeBackground, outputSize],
  );

  return {
    generateAvatar,
    isGenerating,
    progress,
    status,
    error,
    avatarUrl,
    reset,
  };
}

/**
 * Server-side helper for generating AI avatars using FAL AI
 *
 * This is meant to be used in an API route. Example:
 *
 * ```ts
 * // app/api/generate-avatar/route.ts
 * import { generateAiAvatar } from "@/components/elements/use-ai-avatar";
 *
 * export async function POST(req: Request) {
 *   const body = await req.json();
 *   const result = await generateAiAvatar(body);
 *   return Response.json(result);
 * }
 * ```
 */
export interface GenerateAiAvatarServerParams {
  imageUrl: string;
  prompt: string;
  style?: AvatarStyle;
  grayscale?: boolean;
  removeBackground?: boolean;
  outputSize?: { width: number; height: number };
}

// Note: The actual FAL AI integration should be done in the user's API route
// This is just the type definitions and client-side hook
