"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import {
  inMemoryAdapter,
  type NewComment,
  type PageCommentsAdapter,
  type PageCommentsComment,
} from "./page-comments-adapters";

interface SelectionPopup {
  x: number;
  y: number;
  text: string;
}

export interface PageCommentsUser {
  name: string;
  avatar?: string;
  color?: string;
}

export interface PageCommentsProps {
  pageId: string;
  adapter?: PageCommentsAdapter;
  contentSelector?: string;
  user: PageCommentsUser;
  keyboard?: boolean;
  highlightStyle?: "notion" | "minimal" | "none";
  onComment?: (comment: PageCommentsComment) => void;
  onResolve?: (commentId: string) => void;
  pollInterval?: number;
}

const COLORS = [
  "#E93D82",
  "#3E63DD",
  "#30A46C",
  "#E5484D",
  "#6E56CF",
  "#F76B15",
  "#12A594",
  "#7C66DC",
];

function getColor(name: string, override?: string) {
  if (override) return override;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function makeCursor(fillColor: string) {
  const encoded = encodeURIComponent(fillColor);
  return `url("data:image/svg+xml,%3Csvg width='22' height='26' viewBox='0 0 396 434' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M49.7 29.8L346.2 199.7L202.3 244l-82.9 119.1L49.7 29.8Z' fill='${encoded}' stroke='white' stroke-width='20'/%3E%3C/svg%3E") 3 1, crosshair`;
}

function highlightQuotes(
  quotes: { text: string; active: boolean; commentId?: string }[],
  contentSelector: string,
) {
  for (const el of document.querySelectorAll("mark[data-slot='highlight']")) {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ""), el);
      parent.normalize();
    }
  }
  if (quotes.length === 0) return;

  const sel = window.getSelection();
  if (!sel) return;

  for (const q of quotes) {
    if (!q.text) continue;
    sel.removeAllRanges();

    const found = (
      window as unknown as { find: (...args: unknown[]) => boolean }
    ).find(q.text, false, false, true, false, true, false);
    if (!found) continue;

    const range = sel.getRangeAt(0);
    const container = document.querySelector(contentSelector);
    if (container && !container.contains(range.commonAncestorContainer))
      continue;

    const mark = document.createElement("mark");
    mark.setAttribute("data-slot", "highlight");
    if (q.commentId) mark.setAttribute("data-comment-id", q.commentId);

    mark.className = [
      "rounded-sm px-0 py-px text-inherit underline cursor-pointer",
      "decoration-2 underline-offset-[3px]",
      "transition-[background,text-decoration-color] duration-150 ease-in-out",
    ].join(" ");

    if (q.active) {
      mark.setAttribute("data-active", "");
      mark.style.background =
        "var(--highlight-bg-active, oklch(0.85 0.15 85 / 0.25))";
      mark.style.textDecorationColor =
        "var(--highlight-underline-active, oklch(0.75 0.15 85 / 0.6))";
    } else {
      mark.style.background = "var(--highlight-bg, oklch(0.85 0.15 85 / 0.1))";
      mark.style.textDecorationColor =
        "var(--highlight-underline, oklch(0.75 0.15 85 / 0.25))";
    }

    try {
      range.surroundContents(mark);
    } catch {
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
    }
  }
  sel.removeAllRanges();
}

export function PageComments({
  pageId,
  adapter: adapterProp,
  contentSelector = ".prose",
  user,
  keyboard = true,
  highlightStyle = "notion",
  onComment,
  onResolve,
  pollInterval = 10000,
}: PageCommentsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adapter] = useState(() => adapterProp ?? inMemoryAdapter());
  const [comments, setComments] = useState<PageCommentsComment[]>([]);
  const [placing, setPlacing] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [pendingText, setPendingText] = useState("");
  const [pendingQuote, setPendingQuote] = useState("");
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [selectionPopup, setSelectionPopup] = useState<SelectionPopup | null>(
    null,
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const selectionPopupRef = useRef<HTMLDivElement>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const color = getColor(user.name, user.color);
  const avatar = user.avatar ?? user.name[0]?.toUpperCase() ?? "?";

  const unresolvedComments = comments
    .filter((c) => !c.resolved)
    .sort((a, b) => a.y - b.y);
  const resolvedComments = comments
    .filter((c) => c.resolved)
    .sort((a, b) => a.y - b.y);
  const navComments = [...unresolvedComments, ...resolvedComments];

  const getParentRect = useCallback(() => {
    const el = portalTarget ?? containerRef.current?.parentElement;
    return (
      el?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      }
    );
  }, [portalTarget]);

  const toRelativeCoords = useCallback(
    (clientX: number, clientY: number) => {
      const rect = getParentRect();
      const el = portalTarget ?? containerRef.current?.parentElement;
      const xPercent = ((clientX - rect.left) / rect.width) * 100;
      const yPx = clientY - rect.top + (el?.scrollTop ?? 0);
      return { x: xPercent, y: yPx };
    },
    [getParentRect, portalTarget],
  );

  const getSelectionRelative = useCallback((): SelectionPopup | null => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) return null;
    const range = sel.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const rect = getParentRect();
    return {
      x: rangeRect.left + rangeRect.width / 2 - rect.left,
      y: rangeRect.top - rect.top,
      text: sel.toString().trim(),
    };
  }, [getParentRect]);

  const fetchComments = useCallback(async () => {
    const result = await adapter.getComments(pageId);
    setComments(result);
  }, [adapter, pageId]);

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, pollInterval);
    return () => clearInterval(interval);
  }, [fetchComments, pollInterval]);

  useEffect(() => {
    if (pendingPos && inputRef.current) inputRef.current.focus();
  }, [pendingPos]);

  const stateRef = useRef({ focusedIdx, navComments, placing });
  stateRef.current = { focusedIdx, navComments, placing };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const highlightMark = target.closest("mark[data-comment-id]");
      if (highlightMark) {
        const cid = highlightMark.getAttribute("data-comment-id");
        if (cid) {
          setActiveComment(cid);
          const nc = stateRef.current.navComments;
          setFocusedIdx(nc.findIndex((c) => c.id === cid));
          return;
        }
      }
      if (
        target.closest("[data-slot='pin']") ||
        target.closest("[data-slot='input']")
      )
        return;
      if (target.closest("[data-slot='toolbar']")) return;
      if (stateRef.current.focusedIdx !== -1) {
        setActiveComment(null);
        setFocusedIdx(-1);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (highlightStyle === "none") return;
    const quotes: { text: string; active: boolean; commentId?: string }[] = [];
    for (const c of comments) {
      if (c.quote && !c.resolved) {
        quotes.push({
          text: c.quote,
          active: c.id === activeComment,
          commentId: c.id,
        });
      }
    }
    if (pendingQuote) {
      quotes.push({ text: pendingQuote, active: true });
    }
    highlightQuotes(quotes, contentSelector);
    return () => highlightQuotes([], contentSelector);
  }, [activeComment, comments, pendingQuote, contentSelector, highlightStyle]);

  useEffect(() => {
    if (replyingTo && replyInputRef.current) replyInputRef.current.focus();
  }, [replyingTo]);

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const info = getSelectionRelative();
        if (info && !pendingPos) setSelectionPopup(info);
        else setSelectionPopup(null);
      }, 10);
    };
    const handleMouseDown = (e: MouseEvent) => {
      if (selectionPopupRef.current?.contains(e.target as Node)) return;
      setSelectionPopup(null);
    };
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [pendingPos, getSelectionRelative]);

  const scrollToComment = useCallback(
    (yInContainer: number) => {
      const rect = getParentRect();
      const absY = rect.top + window.scrollY + yInContainer;
      window.scrollTo({
        top: absY - window.innerHeight / 3,
        behavior: "smooth",
      });
    },
    [getParentRect],
  );

  useEffect(() => {
    if (!keyboard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const { focusedIdx: fi, navComments: nc, placing: pl } = stateRef.current;

      if (e.key === "ArrowDown" && nc.length > 0) {
        e.preventDefault();
        const next = fi < nc.length - 1 ? fi + 1 : 0;
        setFocusedIdx(next);
        setActiveComment(nc[next].id);
        scrollToComment(nc[next].y);
      } else if (e.key === "ArrowUp" && nc.length > 0) {
        e.preventDefault();
        const prev = fi > 0 ? fi - 1 : nc.length - 1;
        setFocusedIdx(prev);
        setActiveComment(nc[prev].id);
        scrollToComment(nc[prev].y);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setPlacing(!pl);
        setPendingPos(null);
        setPendingQuote("");
        setActiveComment(null);
        setSelectionPopup(null);
      } else if (e.key === "Escape") {
        setActiveComment(null);
        setFocusedIdx(-1);
        setPendingPos(null);
        setPendingText("");
        setPendingQuote("");
        if (pl) setPlacing(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [keyboard, scrollToComment]);

  const navigateComments = (dir: "up" | "down") => {
    if (navComments.length === 0) return;
    let next: number;
    if (dir === "down") {
      next = focusedIdx < navComments.length - 1 ? focusedIdx + 1 : 0;
    } else {
      next = focusedIdx > 0 ? focusedIdx - 1 : navComments.length - 1;
    }
    setFocusedIdx(next);
    setActiveComment(navComments[next].id);
    scrollToComment(navComments[next].y);
  };

  const startCommentFromSelection = (selInfo: SelectionPopup) => {
    const rect = getParentRect();
    const el = portalTarget ?? containerRef.current?.parentElement;
    const xPercent = (selInfo.x / rect.width) * 100;
    const yPx = selInfo.y + (el?.scrollTop ?? 0);
    setPendingPos({ x: xPercent, y: yPx });
    setPendingQuote(selInfo.text);
    setPendingText("");
    setSelectionPopup(null);
    setActiveComment(null);
    window.getSelection()?.removeAllRanges();
    if (!placing) setPlacing(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!placing) return;
    if ((e.target as HTMLElement).closest("[data-slot='pin']")) return;
    if ((e.target as HTMLElement).closest("[data-slot='input']")) return;

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.toString().trim()) {
      const info = getSelectionRelative();
      if (info) {
        startCommentFromSelection(info);
        return;
      }
    }

    const { x, y } = toRelativeCoords(e.clientX, e.clientY);
    setPendingPos({ x, y });
    setPendingQuote("");
    setPendingText("");
    setActiveComment(null);
  };

  const submitComment = async () => {
    if (!pendingText.trim() || !pendingPos) return;
    const newComment: NewComment = {
      name: user.name,
      text: pendingText.trim(),
      quote: pendingQuote || undefined,
      x: pendingPos.x,
      y: pendingPos.y,
    };
    const comment = await adapter.addComment(pageId, newComment);
    setComments((prev) => [...prev, comment]);
    setPendingPos(null);
    setPendingText("");
    setPendingQuote("");
    if (comment.quote) setActiveComment(comment.id);
    onComment?.(comment);
  };

  const toggleResolve = async (commentId: string) => {
    const updated = await adapter.updateComment(pageId, commentId, {
      action: "resolve",
    });
    if (updated) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c)),
      );
      onResolve?.(commentId);
    }
  };

  const submitReply = async (commentId: string) => {
    if (!replyText.trim()) return;
    const updated = await adapter.updateComment(pageId, commentId, {
      action: "reply",
      name: user.name,
      text: replyText.trim(),
    });
    if (updated) {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c)),
      );
    }
    setReplyText("");
    setReplyingTo(null);
  };

  const deleteComment = async (commentId: string) => {
    await adapter.deleteComment(pageId, commentId, user.name);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setActiveComment(null);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const parent = el.parentElement;
    if (parent) {
      const pos = getComputedStyle(parent).position;
      if (pos === "static") parent.style.position = "relative";
      setPortalTarget(parent);
    }
  }, []);

  const overlayContent = portalTarget && (
    <>
      {/* Comment overlay */}
      {placing && (
        <button
          type="button"
          onClick={handleOverlayClick}
          className="absolute inset-0 z-[9990] border-none bg-transparent p-0 m-0"
          style={{ cursor: makeCursor(color) }}
        />
      )}

      {/* Text selection tooltip */}
      {selectionPopup && !placing && !pendingPos && (
        <div
          ref={selectionPopupRef}
          className="absolute z-[9997] animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: selectionPopup.x,
            top: selectionPopup.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <button
            type="button"
            onClick={() => startCommentFromSelection(selectionPopup)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border bg-popover px-2.5 py-1.5 text-xs text-muted-foreground shadow-lg transition-colors hover:border-primary hover:text-foreground"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 4h12M2 8h8M2 12h10" />
            </svg>
            Comment on selection
          </button>
          <div className="absolute -bottom-1 left-1/2 -ml-1 size-2 rotate-45 border-b border-r bg-popover" />
        </div>
      )}

      {/* Comment pins */}
      {comments.map((c) => {
        const isActive = activeComment === c.id;
        const cColor = getColor(c.name);
        return (
          <div
            key={c.id}
            data-slot="pin"
            className="absolute -translate-x-3 -translate-y-3"
            style={{
              left: `${c.x}%`,
              top: c.y,
              zIndex: isActive ? 9996 : 9995,
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const newActive = isActive ? null : c.id;
                setActiveComment(newActive);
                setFocusedIdx(
                  newActive
                    ? navComments.findIndex((nc) => nc.id === c.id)
                    : -1,
                );
                setReplyingTo(null);
                setReplyText("");
              }}
              className={`flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold shadow-md transition-transform hover:scale-[1.2] ${c.resolved ? "border-emerald-300 text-emerald-950 ring-1 ring-emerald-400/50" : "border-background text-white"}`}
              style={{
                background: c.resolved ? "#34d399" : cColor,
              }}
            >
              {c.resolved ? "\u2713" : c.name[0].toUpperCase()}
            </button>

            {isActive && (
              <div className="absolute top-[30px] left-0 min-w-[260px] max-w-[320px] overflow-hidden rounded-xl border bg-popover shadow-lg animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-2">
                  <div
                    className="flex size-[18px] items-center justify-center rounded-full text-[9px] font-semibold text-white"
                    style={{ background: cColor }}
                  >
                    {c.name[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-foreground">
                    {c.name}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {timeAgo(c.timestamp)}
                  </span>
                </div>

                <p className="m-0 px-3 pb-2 text-[13px] leading-relaxed text-muted-foreground">
                  {c.text}
                </p>

                {c.replies && c.replies.length > 0 && (
                  <div className="border-t">
                    {c.replies.map((r) => (
                      <div key={r.id} className="border-b px-3 py-2">
                        <div className="mb-0.5 flex items-center gap-1">
                          <div
                            className="flex size-3.5 items-center justify-center rounded-full text-[7px] font-semibold text-white"
                            style={{ background: getColor(r.name) }}
                          >
                            {r.name[0].toUpperCase()}
                          </div>
                          <span className="text-[11px] font-medium text-foreground">
                            {r.name}
                          </span>
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            {timeAgo(r.timestamp)}
                          </span>
                        </div>
                        <p className="m-0 pl-[18px] text-xs leading-snug text-muted-foreground">
                          {r.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {replyingTo === c.id && (
                  <div className="border-t px-3 py-2">
                    <input
                      ref={replyInputRef}
                      type="text"
                      placeholder="Reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submitReply(c.id);
                        if (e.key === "Escape") {
                          setReplyingTo(null);
                          setReplyText("");
                        }
                      }}
                      className="w-full border-none bg-transparent p-0 text-xs text-foreground outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                )}

                <div className="flex border-t">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleResolve(c.id);
                    }}
                    className="flex flex-1 items-center justify-center gap-1 border-r py-[7px] text-[11px] text-muted-foreground transition-colors hover:text-green-500"
                    style={{ color: c.resolved ? "#30A46C" : undefined }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8.5l3.5 3.5 6.5-8" />
                    </svg>
                    {c.resolved ? "Reopen" : "Resolve"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplyingTo(replyingTo === c.id ? null : c.id);
                      setReplyText("");
                    }}
                    className={`flex flex-1 items-center justify-center gap-1 py-[7px] text-[11px] text-muted-foreground transition-colors hover:text-foreground ${c.name === user.name ? "border-r" : ""}`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 10c0 .55-.2 1.05-.59 1.41-.38.37-.88.59-1.41.59H5l-3 3V4c0-.55.2-1.05.59-1.41C2.97 2.2 3.45 2 4 2h8c.55 0 1.05.2 1.41.59.37.38.59.88.59 1.41v6z" />
                    </svg>
                    Reply
                  </button>
                  {c.name === user.name && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteComment(c.id);
                      }}
                      className="flex flex-1 items-center justify-center gap-1 py-[7px] text-[11px] text-muted-foreground transition-colors hover:text-destructive"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4M12.67 4v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Pending comment input */}
      {pendingPos && (
        <div
          data-slot="input"
          className="absolute -translate-x-3 -translate-y-3 z-[9996]"
          style={{ left: `${pendingPos.x}%`, top: pendingPos.y }}
        >
          <div
            className="flex size-6 items-center justify-center rounded-full border-2 border-background text-[10px] font-semibold text-white shadow-md"
            style={{ background: color }}
          >
            {avatar}
          </div>
          <div
            className="absolute top-7 left-0 min-w-[240px] rounded-lg border bg-popover p-2 shadow-lg animate-in fade-in zoom-in-95 duration-150"
            style={{ borderColor: color }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              value={pendingText}
              onChange={(e) => setPendingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitComment();
                if (e.key === "Escape") {
                  setPendingPos(null);
                  setPendingText("");
                  setPendingQuote("");
                }
              }}
              className="w-full border-none bg-transparent p-0 text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-2 flex justify-end gap-1">
              <button
                type="button"
                onClick={() => {
                  setPendingPos(null);
                  setPendingText("");
                  setPendingQuote("");
                }}
                className="rounded px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitComment}
                disabled={!pendingText.trim()}
                className="rounded px-2.5 py-0.5 text-xs font-medium text-white transition-opacity disabled:opacity-40"
                style={{ background: color }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div ref={containerRef} data-slot="page-comments">
      {/* Floating toolbar */}
      <div
        data-slot="toolbar"
        className="sticky bottom-6 z-[9998] mx-auto w-fit flex items-center gap-1.5 rounded-xl border bg-popover px-2.5 py-1.5 shadow-lg transition-colors"
        style={{ borderColor: placing ? color : undefined }}
      >
        <div
          className="flex size-[22px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ background: color }}
        >
          {avatar}
        </div>
        <span className="text-[13px] text-muted-foreground">{user.name}</span>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={() => {
            setPlacing(!placing);
            setPendingPos(null);
            setPendingQuote("");
            setActiveComment(null);
            setSelectionPopup(null);
          }}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[13px] transition-colors"
          style={{
            background: placing ? color : "transparent",
            color: placing ? "#fff" : undefined,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 2l10 5.5L8 9l-1.5 5z" />
          </svg>
          {placing ? "Click anywhere..." : "Comment"}
        </button>
        <div className="mx-0.5 h-4 w-px bg-border" />
        <span className="min-w-5 text-center text-xs text-muted-foreground">
          {comments.length}
        </span>
        {comments.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => navigateComments("up")}
              title="Previous comment (Arrow Up)"
              className="flex items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 3v10M3 8l5-5 5 5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigateComments("down")}
              title="Next comment (Arrow Down)"
              className="flex items-center justify-center rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M8 13V3M3 8l5 5 5-5" />
              </svg>
            </button>
          </>
        )}
      </div>

      {portalTarget && createPortal(overlayContent, portalTarget)}

      <style>{`
				mark[data-slot="highlight"]:not([data-active]):hover {
					background: var(--highlight-bg-hover, oklch(0.85 0.15 85 / 0.18)) !important;
					text-decoration-color: var(--highlight-underline-hover, oklch(0.75 0.15 85 / 0.45)) !important;
				}
				mark[data-slot="highlight"][data-active]:hover {
					background: var(--highlight-bg-active-hover, oklch(0.85 0.15 85 / 0.32)) !important;
					text-decoration-color: var(--highlight-underline-active-hover, oklch(0.75 0.15 85 / 0.7)) !important;
				}
			`}</style>
    </div>
  );
}
