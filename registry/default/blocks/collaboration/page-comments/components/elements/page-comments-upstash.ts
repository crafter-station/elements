import type {
  PageCommentsAdapter,
  PageCommentsComment,
} from "./page-comments-adapters";

interface UpstashAdapterOptions {
  url: string;
  token: string;
  prefix?: string;
}

export function upstashAdapter({
  url,
  token,
  prefix = "page-comments",
}: UpstashAdapterOptions): PageCommentsAdapter {
  async function redis(command: string, ...args: string[]) {
    const res = await fetch(`${url}/${command}/${args.join("/")}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data.result;
  }

  async function getAll(pageId: string): Promise<PageCommentsComment[]> {
    const result = await redis("get", `${prefix}:${pageId}`);
    if (!result) return [];
    return typeof result === "string" ? JSON.parse(result) : result;
  }

  async function setAll(pageId: string, comments: PageCommentsComment[]) {
    await redis("set", `${prefix}:${pageId}`, JSON.stringify(comments));
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
