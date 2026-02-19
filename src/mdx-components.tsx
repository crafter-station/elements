import { Children, isValidElement } from "react";

import type { MDXComponents } from "mdx/types";

import { ComponentPreview } from "@/components/component-preview";
import { ComponentPreviewItem } from "@/components/component-preview-item";
import { SfxPlayer } from "@/components/sfx-player";
import { CodeBlockCopyButton } from "@/components/ui/code-block-copy-button";

import AiAgentContextDemo from "@/registry/default/examples/ai-agent-context-demo";
import AiAgentRosterDemo from "@/registry/default/examples/ai-agent-roster-demo";
import AiAgentStatusDemo from "@/registry/default/examples/ai-agent-status-demo";
import AiArtifactDemo from "@/registry/default/examples/ai-artifact-demo";
// Badges
import AIBadgeDemo from "@/registry/default/examples/ai-badge-demo";
import AiChainOfThoughtDemo from "@/registry/default/examples/ai-chain-of-thought-demo";
import AiChatDemo from "@/registry/default/examples/ai-chat-demo";
import AiChatInputDemo from "@/registry/default/examples/ai-chat-input-demo";
import AiConfirmationDemo from "@/registry/default/examples/ai-confirmation-demo";
import AiConversationTreeDemo from "@/registry/default/examples/ai-conversation-tree-demo";
import AiGuardrailsDemo from "@/registry/default/examples/ai-guardrails-demo";
import AiHandoffChainDemo from "@/registry/default/examples/ai-handoff-chain-demo";
import AiLatencyMeterDemo from "@/registry/default/examples/ai-latency-meter-demo";
import AiMemoryViewerDemo from "@/registry/default/examples/ai-memory-viewer-demo";
import AiMessageBubbleDemo from "@/registry/default/examples/ai-message-bubble-demo";
import AiMessagesDemo from "@/registry/default/examples/ai-messages-demo";
import AiModelInfoDemo from "@/registry/default/examples/ai-model-info-demo";
import AiModelSelectorDemo from "@/registry/default/examples/ai-model-selector-demo";
import AiPipelineDemo from "@/registry/default/examples/ai-pipeline-demo";
import AiPlanDemo from "@/registry/default/examples/ai-plan-demo";
import AiPromptDiffDemo from "@/registry/default/examples/ai-prompt-diff-demo";
import AiReasoningDemo from "@/registry/default/examples/ai-reasoning-demo";
import AiRequestInspectorDemo from "@/registry/default/examples/ai-request-inspector-demo";
import AiResponseActionsDemo from "@/registry/default/examples/ai-response-actions-demo";
import AiRoutingIndicatorDemo from "@/registry/default/examples/ai-routing-indicator-demo";
import AiSourcesDemo from "@/registry/default/examples/ai-sources-demo";
import AiStreamDebuggerDemo from "@/registry/default/examples/ai-stream-debugger-demo";
import AiStreamingTextDemo from "@/registry/default/examples/ai-streaming-text-demo";
import AiSuggestedActionsDemo from "@/registry/default/examples/ai-suggested-actions-demo";
import AiTaskListDemo from "@/registry/default/examples/ai-task-list-demo";
import AiTemperatureSliderDemo from "@/registry/default/examples/ai-temperature-slider-demo";
import AiThinkingIndicatorDemo from "@/registry/default/examples/ai-thinking-indicator-demo";
import AiTokenCounterDemo from "@/registry/default/examples/ai-token-counter-demo";
import AiTokenViewerDemo from "@/registry/default/examples/ai-token-viewer-demo";
import AiToolCallDemo from "@/registry/default/examples/ai-tool-call-demo";
import AiToolInspectorDemo from "@/registry/default/examples/ai-tool-inspector-demo";
import ApiResponseViewerDemo from "@/registry/default/examples/api-response-viewer-demo";
import CliOutputDemo from "@/registry/default/examples/cli-output-demo";
import CodeDiffViewerDemo from "@/registry/default/examples/code-diff-viewer-demo";
import EnvEditorDemo from "@/registry/default/examples/env-editor-demo";
import ErrorBoundaryUiDemo from "@/registry/default/examples/error-boundary-ui-demo";
import GenerateBadgeDemo from "@/registry/default/examples/generate-badge-demo";
import GitHubActivityCalendarDemo from "@/registry/default/examples/github-activity-calendar-demo";
import GitHubContributionsDemo from "@/registry/default/examples/github-contributions-demo";
import GitHubLanguagesDemo from "@/registry/default/examples/github-languages-demo";
import GitHubProfileCardDemo from "@/registry/default/examples/github-profile-card-demo";
import GitHubRepoCardDemo from "@/registry/default/examples/github-repo-card-demo";
import GitHubStarButtonDemo from "@/registry/default/examples/github-star-button-demo";
import GitHubStarsDemo from "@/registry/default/examples/github-stars-demo";
import JsonViewerDemo from "@/registry/default/examples/json-viewer-demo";
import OgImageExplorerDemo from "@/registry/default/examples/og-image-explorer-demo";
import PolarLicenseKeyDemo from "@/registry/default/examples/polar-license-key-demo";
// Polar
import PolarPricingCardDemo from "@/registry/default/examples/polar-pricing-card-demo";
import PolarRevenueCardDemo from "@/registry/default/examples/polar-revenue-card-demo";
import PolarSponsorGridDemo from "@/registry/default/examples/polar-sponsor-grid-demo";
import PolarSubscriptionBadgeDemo from "@/registry/default/examples/polar-subscription-badge-demo";
import SchemaViewerDemo from "@/registry/default/examples/schema-viewer-demo";
import TextShimmerDemo from "@/registry/default/examples/text-shimmer-demo";
import ThemeSwitcherButtonDemo from "@/registry/default/examples/theme-switcher-button-demo";
import ThemeSwitcherDemo from "@/registry/default/examples/theme-switcher-demo";
import ThemeSwitcherDropdownDemo from "@/registry/default/examples/theme-switcher-dropdown-demo";
import ThemeSwitcherMultiButtonDemo from "@/registry/default/examples/theme-switcher-multi-button-demo";
import ThemeSwitcherSwitchDemo from "@/registry/default/examples/theme-switcher-switch-demo";
import ThemeSwitcherToggleDemo from "@/registry/default/examples/theme-switcher-toggle-demo";
import TinteEditorDemo from "@/registry/default/examples/tinte-editor-demo";
import UploadthingAvatarDemo from "@/registry/default/examples/uploadthing-avatar-demo";
import UploadthingButtonDemo from "@/registry/default/examples/uploadthing-button-demo";
import UploadthingDropzoneDemo from "@/registry/default/examples/uploadthing-dropzone-demo";
import UploadthingFileCardDemo from "@/registry/default/examples/uploadthing-file-card-demo";
import UploadthingImageGridDemo from "@/registry/default/examples/uploadthing-image-grid-demo";
import UploadthingPasteDemo from "@/registry/default/examples/uploadthing-paste-demo";
import UploadthingProgressDemo from "@/registry/default/examples/uploadthing-progress-demo";
import UpstashCacheBadgeDemo from "@/registry/default/examples/upstash-cache-badge-demo";
import UpstashCounterDemo from "@/registry/default/examples/upstash-counter-demo";
import UpstashLeaderboardDemo from "@/registry/default/examples/upstash-leaderboard-demo";
import UpstashQueueCardDemo from "@/registry/default/examples/upstash-queue-card-demo";
import UpstashRatelimitDemo from "@/registry/default/examples/upstash-ratelimit-demo";
import UseAiAvatarDemo from "@/registry/default/examples/use-ai-avatar-demo";
import WebhookTesterDemo from "@/registry/default/examples/webhook-tester-demo";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ComponentPreview,
    ComponentPreviewItem,
    // Theme Components
    ThemeSwitcher: ThemeSwitcherDemo,
    ThemeSwitcherClassic: ThemeSwitcherDemo, // Alias for classic variant
    ThemeSwitcherButton: ThemeSwitcherButtonDemo,
    ThemeSwitcherDropdown: ThemeSwitcherDropdownDemo,
    ThemeSwitcherMultiButton: ThemeSwitcherMultiButtonDemo,
    ThemeSwitcherSwitch: ThemeSwitcherSwitchDemo,
    ThemeSwitcherToggle: ThemeSwitcherToggleDemo,
    // Animations
    TextShimmer: TextShimmerDemo,
    // Tinte Editor
    TinteEditor: TinteEditorDemo,
    // Polar
    PolarPricingCardDemo: PolarPricingCardDemo,
    PolarSponsorGridDemo: PolarSponsorGridDemo,
    PolarSubscriptionBadgeDemo: PolarSubscriptionBadgeDemo,
    PolarRevenueCardDemo: PolarRevenueCardDemo,
    PolarLicenseKeyDemo: PolarLicenseKeyDemo,
    // UploadThing
    UploadThingButton: UploadthingButtonDemo,
    UploadThingDropzone: UploadthingDropzoneDemo,
    UploadThingAvatar: UploadthingAvatarDemo,
    UploadThingImageGrid: UploadthingImageGridDemo,
    UploadThingFileCard: UploadthingFileCardDemo,
    UploadThingPaste: UploadthingPasteDemo,
    UploadThingProgress: UploadthingProgressDemo,
    UploadButtonPreview: UploadthingButtonDemo, // Legacy alias
    UploadDropzonePreview: UploadthingDropzoneDemo, // Legacy alias
    // GitHub
    GitHubStars: GitHubStarsDemo,
    GitHubContributions: GitHubContributionsDemo,
    GitHubRepoCard: GitHubRepoCardDemo,
    GitHubLanguages: GitHubLanguagesDemo,
    GitHubStarButton: GitHubStarButtonDemo,
    GitHubProfileCard: GitHubProfileCardDemo,
    GitHubActivityCalendar: GitHubActivityCalendarDemo,
    // Upstash
    UpstashRatelimit: UpstashRatelimitDemo,
    UpstashCounter: UpstashCounterDemo,
    UpstashQueueCard: UpstashQueueCardDemo,
    UpstashLeaderboard: UpstashLeaderboardDemo,
    UpstashCacheBadge: UpstashCacheBadgeDemo,
    // Dev Tools
    OgImageExplorer: OgImageExplorerDemo,
    JsonViewer: JsonViewerDemo,
    CodeDiffViewer: CodeDiffViewerDemo,
    CliOutput: CliOutputDemo,
    ApiResponseViewer: ApiResponseViewerDemo,
    ErrorBoundaryUi: ErrorBoundaryUiDemo,
    EnvEditor: EnvEditorDemo,
    SchemaViewer: SchemaViewerDemo,
    WebhookTester: WebhookTesterDemo,
    // AI Elements - Chat (new names without Ai prefix)
    AiChat: AiChatDemo,
    AiMessages: AiMessagesDemo,
    AiSuggestedActions: AiSuggestedActionsDemo,
    ModelSelector: AiModelSelectorDemo,
    ChatInput: AiChatInputDemo,
    MessageBubble: AiMessageBubbleDemo,
    StreamingText: AiStreamingTextDemo,
    ThinkingIndicator: AiThinkingIndicatorDemo,
    ResponseActions: AiResponseActionsDemo,
    TokenCounter: AiTokenCounterDemo,
    TemperatureSlider: AiTemperatureSliderDemo,
    // AI Elements - Agentic (new names without Ai prefix)
    ToolCall: AiToolCallDemo,
    Confirmation: AiConfirmationDemo,
    TaskList: AiTaskListDemo,
    Reasoning: AiReasoningDemo,
    ChainOfThought: AiChainOfThoughtDemo,
    Plan: AiPlanDemo,
    Artifact: AiArtifactDemo,
    Sources: AiSourcesDemo,
    // AI Elements - Devtools (new names without Ai prefix)
    RequestInspector: AiRequestInspectorDemo,
    StreamDebugger: AiStreamDebuggerDemo,
    LatencyMeter: AiLatencyMeterDemo,
    TokenViewer: AiTokenViewerDemo,
    ToolInspector: AiToolInspectorDemo,
    PromptDiff: AiPromptDiffDemo,
    ConversationTree: AiConversationTreeDemo,
    ModelInfo: AiModelInfoDemo,
    // AI Elements - Multi-Agent (new names without Ai prefix)
    AgentStatus: AiAgentStatusDemo,
    HandoffChain: AiHandoffChainDemo,
    Pipeline: AiPipelineDemo,
    MemoryViewer: AiMemoryViewerDemo,
    AgentRoster: AiAgentRosterDemo,
    Guardrails: AiGuardrailsDemo,
    AgentContext: AiAgentContextDemo,
    RoutingIndicator: AiRoutingIndicatorDemo,
    // Legacy AI Components (backward compatibility)
    AiModelSelector: AiModelSelectorDemo,
    AiChatInput: AiChatInputDemo,
    AiMessageBubble: AiMessageBubbleDemo,
    AiStreamingText: AiStreamingTextDemo,
    AiThinkingIndicator: AiThinkingIndicatorDemo,
    AiResponseActions: AiResponseActionsDemo,
    AiTokenCounter: AiTokenCounterDemo,
    AiTemperatureSlider: AiTemperatureSliderDemo,
    AiToolCall: AiToolCallDemo,
    AiConfirmation: AiConfirmationDemo,
    AiTaskList: AiTaskListDemo,
    AiReasoning: AiReasoningDemo,
    AiChainOfThought: AiChainOfThoughtDemo,
    AiPlan: AiPlanDemo,
    AiArtifact: AiArtifactDemo,
    AiSources: AiSourcesDemo,
    AiRequestInspector: AiRequestInspectorDemo,
    AiStreamDebugger: AiStreamDebuggerDemo,
    AiLatencyMeter: AiLatencyMeterDemo,
    AiTokenViewer: AiTokenViewerDemo,
    AiToolInspector: AiToolInspectorDemo,
    AiPromptDiff: AiPromptDiffDemo,
    AiConversationTree: AiConversationTreeDemo,
    AiModelInfo: AiModelInfoDemo,
    AiAgentStatus: AiAgentStatusDemo,
    AiHandoffChain: AiHandoffChainDemo,
    AiPipeline: AiPipelineDemo,
    AiMemoryViewer: AiMemoryViewerDemo,
    AiAgentRoster: AiAgentRosterDemo,
    AiGuardrails: AiGuardrailsDemo,
    AiAgentContext: AiAgentContextDemo,
    AiRoutingIndicator: AiRoutingIndicatorDemo,
    // Badges
    AIBadge: AIBadgeDemo,
    GenerateBadge: GenerateBadgeDemo,
    UseAiAvatar: UseAiAvatarDemo,
    // SFX
    SfxPlayer,
    pre: ({ children, ...props }: any) => {
      const isShikiBlock = props.className?.includes("shiki") || props.style;

      // Extract raw code from children for copy functionality
      const extractCode = (node: any): string => {
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(extractCode).join("");
        if (node?.props?.children) return extractCode(node.props.children);
        return "";
      };

      const rawCode = extractCode(children);

      if (isShikiBlock) {
        return (
          <div className="my-6 max-w-full overflow-hidden rounded-lg border border-border relative group bg-muted/30">
            <CodeBlockCopyButton code={rawCode} />
            <pre
              {...props}
              className={`${props.className || ""} p-4 overflow-x-auto leading-relaxed`}
              style={{
                ...props.style,
                fontSize: "13px",
                backgroundColor: "transparent",
              }}
            >
              {children}
            </pre>
          </div>
        );
      }

      return (
        <div className="my-6 max-w-full overflow-hidden relative group">
          <CodeBlockCopyButton code={rawCode} />
          <pre
            className="min-w-full w-max bg-muted p-4 rounded-lg overflow-x-auto border border-border text-sm"
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    code: ({ className, children, ...props }: any) => {
      const childArray = Children.toArray(children);
      const hasReactElements = childArray.some((child) =>
        isValidElement(child),
      );

      if (hasReactElements || className || props.style) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      }

      // Otherwise, it's inline code - apply custom styling
      return (
        <code
          className="bg-muted/50 px-1.5 py-0.5 rounded text-xs font-mono border border-border/50"
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }) => (
      <h1 className="scroll-mt-16 text-2xl font-medium tracking-tight first:mt-0 mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="scroll-mt-16 text-xl font-medium tracking-tight mt-12 mb-6 pb-3 border-b border-border/60">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-mt-16 text-lg font-medium tracking-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-foreground/70 text-base leading-7 mb-6 text-pretty">
        {children}
      </p>
    ),
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="decoration-underline relative inline-flex items-baseline gap-1 underline decoration-[0.09375rem] underline-offset-2 hover:text-primary transition-colors"
        >
          {children}
          {isExternal && (
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="text-muted-foreground inline-block h-[0.85lh] w-4 shrink-0"
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M7 17L17 7M17 7H7M17 7V17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7 pl-1">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-[3px] border-muted-foreground/30 pl-6 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="my-8 w-full overflow-x-auto">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted/30 border-b-2 border-border">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-medium text-sm text-muted-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-sm text-muted-foreground">{children}</td>
    ),
    hr: () => <hr className="my-8 border-t border-border/60" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
