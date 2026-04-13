"use client";

import { useCallback, useMemo, useState } from "react";
import { Content } from "@prismicio/client";
import { slugify } from "@/helpers/slugify";
import { sortArticlesByPartNumber, getAllChapterTitlesForArticle } from "@/helpers/article";
import { formatListenMinutes, getArticleListenSeconds } from "@/helpers/listenTime";

export function useTOCState(
  articles: Content.ArticlepageDocument[],
  currentUid?: string,
  activeChapterIndex = 0,
) {
  const sorted = useMemo(
    () => sortArticlesByPartNumber(articles),
    [articles],
  );

  const [expandedUid, setExpandedUid] = useState<string | null>(currentUid ?? null);

  const totalChapters = useMemo(
    () => sorted.reduce((sum, a) => sum + getAllChapterTitlesForArticle(a).length, 0),
    [sorted],
  );

  const globalChapterIndex = useMemo(() => {
    let count = 0;
    for (const article of sorted) {
      if (article.uid === currentUid) {
        return count + activeChapterIndex + 1;
      }
      count += getAllChapterTitlesForArticle(article).length;
    }
    return 0;
  }, [sorted, currentUid, activeChapterIndex]);

  const handleToggle = useCallback((uid: string) => {
    setExpandedUid((prev) => (prev === uid ? null : uid));
  }, []);

  const scrollToChapter = useCallback((chapterTitle: string) => {
    const id = slugify(chapterTitle);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return {
    sorted,
    expandedUid,
    totalChapters,
    globalChapterIndex,
    handleToggle,
    scrollToChapter,
    formatListenMinutes,
    getArticleListenSeconds,
  };
}
