"use client";

import { Content } from "@prismicio/client";
import Link from "next/link";
import { AngleDown, AngleRight } from "@/components/icons";
import ChapterStatusIcon from "@/components/shared/ChapterStatusIcon";
import { pluralize } from "@/helpers/pluralize";
import { getArticleSlice, getAllChapterTitlesForArticle } from "@/helpers/article";
import { useTOCState } from "@/helpers/useTOCState";

interface TOCSidebarProps {
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
  activeChapterIndex: number;
  allChapterTitles: string[];
  readChapters?: Set<number>;
}

export default function TOCSidebar({
  articles,
  currentUid,
  activeChapterIndex,
  allChapterTitles,
  readChapters,
}: TOCSidebarProps) {
  const {
    sorted,
    expandedUid,
    totalChapters,
    globalChapterIndex,
    handleToggle,
    scrollToChapter,
    formatListenMinutes,
    getArticleListenSeconds,
  } = useTOCState(articles, currentUid, activeChapterIndex);

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
          const displayTitles = isCurrent ? allChapterTitles : getAllChapterTitlesForArticle(article);
          const chapterCount = displayTitles.length;
          const readingMinutes = formatListenMinutes(getArticleListenSeconds(article));

          return (
            <div key={uid} className="border-t border-cream/12">
              <div className="flex items-center w-full py-5">
                <Link
                  href={`/${uid}`}
                  className="flex items-center flex-1 min-w-0 group"
                >
                  <span
                    className="text-sm tracking-[-0.28px] leading-4 font-medium w-[64px] shrink-0"
                    style={{ color: partColor }}
                  >
                    Part {partNumber}
                  </span>
                  <span className="text-sm tracking-[-0.28px] leading-4 font-medium text-cream flex-1 group-hover:text-accent transition-colors">
                    {partName}
                  </span>
                </Link>
                <button
                  type="button"
                  className="shrink-0 w-8 h-8 flex items-center justify-center cursor-pointer"
                  onClick={() => handleToggle(uid)}
                >
                  {isExpanded ? (
                    <AngleDown color="rgba(255,250,234,0.6)" width={14} height={8} />
                  ) : (
                    <AngleRight color="rgba(255,250,234,0.6)" width={8} height={14} />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="flex flex-col gap-2 pb-4">
                  {displayTitles.map((title, idx) => {
                    const isRead = isCurrent && (readChapters?.has(idx) || idx < activeChapterIndex);
                    const isActive = isCurrent && idx === activeChapterIndex;
                    const textColor = isRead
                      ? "text-accent"
                      : isActive
                        ? "text-cream font-semibold"
                        : "text-muted";
                    const status = isRead ? "read" : isActive ? "active" : "unread";

                    const content = (
                      <>
                        <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                          <ChapterStatusIcon status={status} />
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
