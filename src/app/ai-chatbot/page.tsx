import type { Metadata } from "next";

import { ChatDemo } from "./components/chat-demo";

export const metadata: Metadata = {
  title: "AI Chatbot Demo",
  description:
    "Production-ready AI chat interface built with Elements components. Features streaming responses, reasoning display, and model selection.",
};

export default function AiChatbotPage() {
  return <ChatDemo />;
}
