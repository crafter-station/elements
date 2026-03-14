import type {
  PageCommentsAdapter,
  PageCommentsComment,
} from "./page-comments-adapters";

interface SupabaseAdapterOptions {
  client: {
    // biome-ignore lint/suspicious/noExplicitAny: Supabase client returns dynamic query builders
    from: (table: string) => any;
  };
  table?: string;
}

export function supabaseAdapter({
  client,
  table = "page_comments",
}: SupabaseAdapterOptions): PageCommentsAdapter {
  return {
    async getComments(pageId) {
      const { data } = await client
        .from(table)
        .select("data")
        .eq("page_id", pageId)
        .single();
      return data?.data ?? [];
    },
    async addComment(pageId, newComment) {
      const comments = await this.getComments(pageId);
      const comment: PageCommentsComment = {
        id: crypto.randomUUID().slice(0, 8),
        name: newComment.name,
        text: newComment.text,
        ...(newComment.quote ? { quote: newComment.quote } : {}),
        x: newComment.x,
        y: newComment.y,
        timestamp: Date.now(),
        resolved: false,
      };
      const updated = [...comments, comment];
      await client
        .from(table)
        .upsert({ page_id: pageId, data: updated }, { onConflict: "page_id" });
      return comment;
    },
    async updateComment(pageId, commentId, data) {
      const comments = await this.getComments(pageId);
      const idx = comments.findIndex(
        (c: PageCommentsComment) => c.id === commentId,
      );
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
      await client
        .from(table)
        .upsert({ page_id: pageId, data: comments }, { onConflict: "page_id" });
      return comments[idx];
    },
    async deleteComment(pageId, commentId) {
      const comments = await this.getComments(pageId);
      const filtered = comments.filter(
        (c: PageCommentsComment) => c.id !== commentId,
      );
      await client
        .from(table)
        .upsert({ page_id: pageId, data: filtered }, { onConflict: "page_id" });
    },
  };
}
