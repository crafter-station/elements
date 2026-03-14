import type {
  PageCommentsAdapter,
  PageCommentsComment,
} from "./page-comments-adapters";

interface RedisAdapterOptions {
  client: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<unknown>;
  };
  prefix?: string;
}

export function redisAdapter({
  client,
  prefix = "page-comments",
}: RedisAdapterOptions): PageCommentsAdapter {
  async function getAll(pageId: string): Promise<PageCommentsComment[]> {
    const raw = await client.get(`${prefix}:${pageId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  }

  async function setAll(pageId: string, comments: PageCommentsComment[]) {
    await client.set(`${prefix}:${pageId}`, JSON.stringify(comments));
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
