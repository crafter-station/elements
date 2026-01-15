import { create } from "zustand";

export interface CodeBlock {
  language: string;
  code: string;
  imports: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  codeBlocks?: CodeBlock[];
  status: "pending" | "streaming" | "complete" | "error";
  createdAt: Date;
}

interface ChatState {
  messages: ChatMessage[];
  isGenerating: boolean;
  currentModel: string;

  addMessage: (message: Omit<ChatMessage, "id" | "createdAt">) => string;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setGenerating: (value: boolean) => void;
  setModel: (model: string) => void;
  clearMessages: () => void;
}

const createId = () => Math.random().toString(36).slice(2, 9);

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isGenerating: false,
  currentModel: "gpt-4o",

  addMessage: (message) => {
    const id = createId();
    set((state) => ({
      messages: [...state.messages, { ...message, id, createdAt: new Date() }],
    }));
    return id;
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg,
      ),
    }));
  },

  setGenerating: (value) => set({ isGenerating: value }),

  setModel: (model) => set({ currentModel: model }),

  clearMessages: () => set({ messages: [] }),
}));
