import type {
  PageCommentsAdapter,
  PageCommentsComment,
} from "./page-comments-adapters";

interface KvAdapterOptions {
  url: string;
  token: string;
  prefix?: string;
}

export function kvAdapter({
  url,
  token,
  prefix = "page-comments",
}: KvAdapterOptions): PageCommentsAdapter {
  async function kvFetch(method: string, args: unknown[]) {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([method, ...args]),
    });
    const data = await res.json();
    return data.result;
  }

  async function getAll(pageId: string): Promise<PageCommentsComment[]> {
    const result = await kvFetch("get", [`${prefix}:${pageId}`]);
    if (!result) return [];
    return typeof result === "string" ? JSON.parse(result) : result;
  }

  async function setAll(pageId: string, comments: PageCommentsComment[]) {
    await kvFetch("set", [`${prefix}:${pageId}`, JSON.stringify(comments)]);
  }

  return {
    async getComments(pageId) {
      return getAll(pageId);
    },
    async addComment(pageId, data) {
      const comments = await getAll(pageId);
      const comment: PageCommentsComment = {
        id: crypto.randomUUID().slice(0, 8),
        name: data.name,
        text: data.text,
        ...(data.quote ? { quote: data.quote } : {}),
        x: data.x,
        y: data.y,
        timestamp: Date.now(),
        resolved: false,
      };
      comments.push(comment);
      await setAll(pageId, comments);
      return comment;
    },
    async updateComment(pageId, commentId, data) {
      const comments = await getAll(pageId);
      const idx = comments.findIndex((c) => c.id === commentId);
      if (idx === -1) return null;

      if (data.action === "resolve") {
        comments[idx].resolved = !comments[idx].resolved;
      } else if (data.action === "reply") {
        if (!comments[idx].replies) comments[idx].replies = [];
        comments[idx].replies?.push({
          id: crypto.randomUUID().slice(0, 8),
          name: data.name,
          text: data.text,
          timestamp: Date.now(),
        });
      }
      await setAll(pageId, comments);
      return comments[idx];
    },
    async deleteComment(pageId, commentId) {
      const comments = await getAll(pageId);
      await setAll(
        pageId,
        comments.filter((c) => c.id !== commentId),
      );
    },
  };
}
