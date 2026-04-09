"use client";

import { useCallback, useMemo, useState } from "react";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { AngleDown, AngleRight } from "@/components/icons";
import { pluralize } from "@/helpers/pluralize";
import { slugify } from "@/helpers/slugify";
import { getArticleSlice, getAllChapterTitlesForArticle } from "@/helpers/article";
import { formatListenMinutes, getArticleListenSeconds } from "@/helpers/listenTime";

interface TOCSidebarProps {
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
  activeChapterIndex: number;
  allChapterTitles: string[];
}

export default function TOCSidebar({
  articles,
  currentUid,
  activeChapterIndex,
  allChapterTitles,
}: TOCSidebarProps) {
  const sorted = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const aNum = getArticleSlice(a)?.primary.part_number ?? 0;
        const bNum = getArticleSlice(b)?.primary.part_number ?? 0;
        return Number(aNum) - Number(bNum);
      }),
    [articles],
  );

  const [expandedUid, setExpandedUid] = useState<string | null>(currentUid ?? null);

  const totalChapters = sorted.reduce((sum, article) => {
    return sum + getAllChapterTitlesForArticle(article).length;
  }, 0);

  // Global 1-based index of the currently-active chapter across all parts.
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

  return (
    <nav className="flex flex-col gap-4 w-full">
      {/* Progress indicator */}
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.96px] leading-5 text-cream">
          <span>{globalChapterIndex}</span>
          <span className="text-cream/60">
            /{totalChapters} {totalChapters === 1 ? "chapter" : "chapters"}
          </span>
        </p>
        <div className="flex items-center w-full">
          <div
            className="bg-accent h-1 rounded-l-sm"
            style={{
              width: `${(globalChapterIndex / Math.max(totalChapters, 1)) * 100}%`,
            }}
          />
          <div className="bg-cream/12 h-1 rounded-r-sm flex-1" />
        </div>
      </div>

      {/* Article list */}
      <div className="flex flex-col w-full">
        {sorted.map((article) => {
          const articleSlice = getArticleSlice(article);
          if (!articleSlice) return null;

          const uid = article.uid;
          const isCurrent = uid === currentUid;
          const isExpanded = expandedUid === uid;
          const partNumber = articleSlice.primary.part_number;
          const partName = articleSlice.primary.part_name;
          const partColor = articleSlice.primary.part_color ?? "#62f6b5";
          // Get all chapter titles from all slices (strategy_accordion + chapter slices)
          const displayTitles = isCurrent ? allChapterTitles : getAllChapterTitlesForArticle(article);
          const chapterCount = displayTitles.length;
          const readingMinutes = formatListenMinutes(getArticleListenSeconds(article));

          return (
            <div key={uid} className="border-t border-cream/12">
              {/* Header row — always toggles expand/collapse */}
              <button
                type="button"
                className="flex items-center w-full py-5 text-left group cursor-pointer"
                onClick={() => handleToggle(uid)}
              >
                <span
                  className="text-sm tracking-[-0.28px] leading-4 font-medium w-[64px] shrink-0"
                  style={{ color: partColor }}
                >
                  Part {partNumber}
                </span>
                <span className="text-sm tracking-[-0.28px] leading-4 font-medium text-cream flex-1">
                  {partName}
                </span>
                <span className="ml-auto shrink-0">
                  {isExpanded ? (
                    <AngleDown color="rgba(255,250,234,0.6)" width={14} height={8} />
                  ) : (
                    <AngleRight color="rgba(255,250,234,0.6)" width={8} height={14} />
                  )}
                </span>
              </button>

              {/* Expanded chapters */}
              {isExpanded && (
                <div className="flex flex-col gap-2 pb-4">
                  {displayTitles.map((title, idx) => {
                    // For current article: track read/active/unread state
                    const isRead = isCurrent && idx < activeChapterIndex;
                    const isActive = isCurrent && idx === activeChapterIndex;
                    const textColor = isRead
                      ? "text-accent"
                      : isActive
                        ? "text-cream font-semibold"
                        : "text-muted";

                    const circleIcon = isRead ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="#62f6b5" strokeWidth="1.2" />
                        <path d="M5.5 8L7 9.5L10.5 6.5" stroke="#62f6b5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : isActive ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="#f5c842" strokeWidth="1.2" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="#52525b" strokeWidth="1.2" />
                      </svg>
                    );

                    const content = (
                      <>
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          {circleIcon}
                        </span>
                        <span className={`text-base leading-6 transition-colors ${textColor} group-hover:text-cream`}>
                          {title}
                        </span>
                      </>
                    );

                    return isCurrent ? (
                      <button
                        key={idx}
                        type="button"
                        className="flex items-center gap-2 w-full text-left cursor-pointer group"
                        onClick={() => title && scrollToChapter(title)}
                      >
                        {content}
                      </button>
                    ) : (
                      <Link
                        key={idx}
                        href={`/${uid}`}
                        className="flex items-center gap-2 w-full text-left group"
                      >
                        {content}
                      </Link>
                    );
                  })}

                  {/* Reading time */}
                  <p className="font-mono text-xs text-cream/60 font-medium uppercase tracking-[0.96px] leading-5 mt-2">
                    ~{readingMinutes} &bull; {pluralize(chapterCount, "chapter")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
