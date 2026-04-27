"use client";

import { useCallback } from "react";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { ArticleTopBar } from "@/components/TopBar";
import { AngleDown, AngleRight } from "@/components/icons";
import ChapterStatusIcon from "@/components/shared/ChapterStatusIcon";
import { pluralize } from "@/helpers/pluralize";
import { getArticleSlice, getAllChapterTitlesForArticle } from "@/helpers/article";
import { useTOCState } from "@/helpers/useTOCState";
import type { ArticleContext } from "../types";

interface MobileTOCMenuProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
  activeChapterIndex: number;
  allChapterTitles: string[];
  ctaButton?: ArticleContext["ctaButton"];
  readChapters?: Set<number>;
}

export default function MobileTOCMenu({
  isOpen,
  onClose,
  articles,
  currentUid,
  currentSlice,
  activeChapterIndex,
  allChapterTitles,
  readChapters,
}: MobileTOCMenuProps) {
  const {
    sorted,
    expandedUid,
    totalChapters,
    globalChapterIndex,
    handleToggle,
    scrollToChapter: baseScrollToChapter,
    formatListenMinutes,
    getArticleListenSeconds,
  } = useTOCState(articles, currentUid, activeChapterIndex);

  const scrollToChapter = useCallback(
    (chapterTitle: string) => {
      baseScrollToChapter(chapterTitle);
      onClose();
    },
    [baseScrollToChapter, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background flex flex-col lg:hidden">
      <ArticleTopBar partName={currentSlice.primary.part_name} onMenuClick={onClose} isMenuOpen={true} />

      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-4">
        {/* Progress indicator */}
        <div className="flex flex-col gap-2 mb-4">
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
            const readingMinutes = formatListenMinutes(getArticleListenSeconds(article));

            return (
              <div key={uid} className="border-t border-cream/12">
                <div className="flex items-center w-full py-5">
                  <Link
                    href={`/${uid}`}
                    className="flex items-center flex-1 min-w-0 group"
                    onClick={onClose}
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
                      const isRead = isCurrent && (readChapters?.has(idx) || idx <= activeChapterIndex);
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
                          <span className={`text-base leading-6 ${textColor}`}>
                            {title}
                          </span>
                        </>
                      );

                      return isCurrent ? (
                        <button
                          key={idx}
                          type="button"
                          className="flex items-center gap-2 w-full text-left cursor-pointer"
                          onClick={() => title && scrollToChapter(title)}
                        >
                          {content}
                        </button>
                      ) : (
                        <Link
                          key={idx}
                          href={`/${uid}`}
                          className="flex items-center gap-2 w-full text-left"
                          onClick={onClose}
                        >
                          {content}
                        </Link>
                      );
                    })}

                    <p className="font-mono text-xs text-cream/60 font-medium uppercase tracking-[0.96px] leading-5 mt-2">
                      ~{readingMinutes} &bull; {pluralize(displayTitles.length, "chapter")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
