"use client";

export interface PageCommentsReply {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

export interface PageCommentsComment {
  id: string;
  name: string;
  text: string;
  quote?: string;
  x: number;
  y: number;
  timestamp: number;
  resolved: boolean;
  replies?: PageCommentsReply[];
}

export interface NewComment {
  name: string;
  text: string;
  quote?: string;
  x: number;
  y: number;
}

export interface PageCommentsAdapter {
  getComments(pageId: string): Promise<PageCommentsComment[]>;
  addComment(pageId: string, comment: NewComment): Promise<PageCommentsComment>;
  updateComment(
    pageId: string,
    commentId: string,
    data:
      | { action: "resolve" }
      | { action: "reply"; name: string; text: string },
  ): Promise<PageCommentsComment | null>;
  deleteComment(pageId: string, commentId: string, name: string): Promise<void>;
}

export function inMemoryAdapter(): PageCommentsAdapter {
  const store = new Map<string, PageCommentsComment[]>();

  return {
    async getComments(pageId) {
      return store.get(pageId) ?? [];
    },
    async addComment(pageId, data) {
      const comments = store.get(pageId) ?? [];
      const comment: PageCommentsComment = {
        id: Math.random().toString(36).slice(2, 10),
        name: data.name,
        text: data.text,
        ...(data.quote ? { quote: data.quote } : {}),
        x: data.x,
        y: data.y,
        timestamp: Date.now(),
        resolved: false,
      };
      comments.push(comment);
      store.set(pageId, comments);
      return comment;
    },
    async updateComment(pageId, commentId, data) {
      const comments = store.get(pageId) ?? [];
      const idx = comments.findIndex((c) => c.id === commentId);
      if (idx === -1) return null;

      if (data.action === "resolve") {
        comments[idx].resolved = !comments[idx].resolved;
      } else if (data.action === "reply") {
        if (!comments[idx].replies) comments[idx].replies = [];
        comments[idx].replies?.push({
          id: Math.random().toString(36).slice(2, 10),
          name: data.name,
          text: data.text,
          timestamp: Date.now(),
        });
      }
      store.set(pageId, comments);
      return comments[idx];
    },
    async deleteComment(pageId, commentId) {
      const comments = store.get(pageId) ?? [];
      store.set(
        pageId,
        comments.filter((c) => c.id !== commentId),
      );
    },
  };
}
