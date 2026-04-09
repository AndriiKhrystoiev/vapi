"use client";

import { FC, useState, useCallback, useMemo, useEffect, useRef, ReactNode } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicTable } from "@prismicio/react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/shared/Footer";
import ListenButton from "@/components/shared/ListenButton";
import CTAButton from "@/components/ui/CTAButton";
import { ArticleTopBar } from "@/components/TopBar";
import { AngleDown, AngleRight, Checkmark } from "@/components/icons";
import { pluralize } from "@/helpers/pluralize";
import {
  formatListenMinutes,
  getArticleListenSeconds,
  getChapterListenData,
  getSliceListenSeconds,
} from "@/helpers/listenTime";

/* ------------------------------------------------------------------ */
/*  Mobile TOC Menu                                                     */
/* ------------------------------------------------------------------ */

interface MobileTOCMenuProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
  activeChapterIndex: number;
  allChapterTitles: string[];
  ctaButton?: ArticleContext["ctaButton"];
}

function MobileTOCMenu({
  isOpen,
  onClose,
  articles,
  currentUid,
  currentSlice,
  activeChapterIndex,
  allChapterTitles,
  ctaButton,
}: MobileTOCMenuProps) {
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
  // = (chapters in all earlier parts) + (activeChapterIndex within current part + 1)
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

  const scrollToChapter = useCallback(
    (chapterTitle: string) => {
      const id = slugify(chapterTitle);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-[#0e0e12] flex flex-col lg:hidden">
      <ArticleTopBar partName={currentSlice.primary.part_name} onMenuClick={onClose} isMenuOpen={true} />

      {/* Scrollable content */}
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
                {/* Header row */}
                <button
                  type="button"
                  className="flex items-center w-full py-5 text-left cursor-pointer"
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

      {/* Fixed bottom CTA */}
      {ctaButton && "text" in ctaButton && ctaButton.text && (
        <div className="shrink-0 px-4 py-6 border-t border-cream/12">
          <Link href={(ctaButton as { url?: string }).url ?? "#"} onClick={onClose}>
            <CTAButton variant="outline" size="small">
              {(ctaButton as { text?: string }).text}
            </CTAButton>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SiblingSlice = Content.RichTextSlice | Content.TableSlice | Content.StrategyAccordionSlice | Content.ChapterSlice;

type ArticleContext = {
  articles?: Content.ArticlepageDocument[];
  currentUid?: string;
  allSlices?: SiblingSlice[];
  ctaButton?: Content.VoiceAgentPlaybookSliceArticlePagePrimary["cta_button"];
};

export type StrategyAccordionProps = SliceComponentProps<
  Content.StrategyAccordionSlice,
  ArticleContext
>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getArticleSlice(article: Content.ArticlepageDocument) {
  return article.data.slices[0] as Content.StrategyAccordionSlice | undefined;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Get all chapter titles from an article's slices (strategy_accordion + chapter slices) */
function getAllChapterTitlesForArticle(article: Content.ArticlepageDocument): string[] {
  const titles: string[] = [];
  for (const s of article.data.slices) {
    if (s.slice_type === "strategy_accordion") {
      const slice = s as Content.StrategyAccordionSlice;
      for (const ch of slice.primary.chapter ?? []) {
        if (ch.chapter_title) titles.push(ch.chapter_title);
      }
    } else if (s.slice_type === "chapter") {
      const slice = s as Content.ChapterSlice;
      for (const ch of slice.primary.chapter ?? []) {
        if (ch.chapter_title) titles.push(ch.chapter_title);
      }
    }
  }
  return titles;
}

/* ------------------------------------------------------------------ */
/*  Left Sidebar TOC                                                   */
/* ------------------------------------------------------------------ */

interface TOCSidebarProps {
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
  activeChapterIndex: number;
  allChapterTitles: string[];
}

function TOCSidebar({ articles, currentUid, currentSlice, activeChapterIndex, allChapterTitles }: TOCSidebarProps) {
  const sorted = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const aNum = getArticleSlice(a)?.primary.part_number ?? 0;
        const bNum = getArticleSlice(b)?.primary.part_number ?? 0;
        return Number(aNum) - Number(bNum);
      }),
    [articles],
  );

  const [expandedUid, setExpandedUid] = useState<string | null>(
    currentUid ?? null,
  );

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

  const handleToggle = useCallback(
    (uid: string) => {
      setExpandedUid((prev) => (prev === uid ? null : uid));
    },
    [],
  );

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
                    // Text color
                    const textColor = isRead
                      ? "text-accent"
                      : isActive
                        ? "text-cream font-semibold"
                        : "text-muted";

                    // Circle icon
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

/* ------------------------------------------------------------------ */
/*  Right Sidebar                                                      */
/* ------------------------------------------------------------------ */

interface RightSidebarProps {
  slice: Content.StrategyAccordionSlice;
  allSlices: SiblingSlice[];
}

function RightSidebar({ slice, allSlices }: RightSidebarProps) {
  const learnItems = slice.primary.you_will_learn_items ?? [];
  const chapters = useMemo(() => slice.primary.chapter ?? [], [slice.primary.chapter]);

  // Total chapter count = main slice chapters + any sibling Chapter slices
  const chapterCount = useMemo(() => {
    let count = chapters.length;
    for (const s of allSlices) {
      if (s.slice_type === "chapter") {
        count += (s as Content.ChapterSlice).primary.chapter?.length ?? 0;
      }
    }
    return count;
  }, [chapters, allSlices]);

  // Total reading time = sum across the main slice + every sibling chapter slice
  const readingMinutes = useMemo(() => {
    let seconds = getSliceListenSeconds(slice);
    for (const s of allSlices) {
      if (s.slice_type === "chapter") {
        seconds += getSliceListenSeconds(s as Content.ChapterSlice);
      }
    }
    return formatListenMinutes(seconds);
  }, [slice, allSlices]);

  const scrollToFirstChapter = useCallback(() => {
    const first = chapters[0];
    if (first?.chapter_title) {
      const id = slugify(first.chapter_title);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [chapters]);

  return (
    <div className="flex flex-col gap-6 w-full items-start">
      {/* You will learn */}
      {learnItems.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 lg:gap-3 mt-6 w-full">
          <p className="text-sm lg:text-base leading-5 lg:leading-6 text-white/60">You will learn</p>
          <div className="flex flex-wrap gap-x-3 lg:gap-x-8 gap-y-2">
            {learnItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <circle cx="8" cy="8" r="6" stroke="#62f6b5" strokeWidth="1.2" />
                  <path
                    d="M5.5 8L7 9.5L10.5 6.5"
                    stroke="#62f6b5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm lg:text-base leading-5 lg:leading-6 text-white font-medium whitespace-nowrap">
                  {item.learn_item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-cream/12" />

      {/* Summary + meta */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 w-full">
        <p className="text-xl lg:text-2xl leading-7 lg:leading-8 tracking-[-0.4px] lg:tracking-[-0.48px] text-cream lg:max-w-[454px]">
          {slice.primary.summary_description}
        </p>
        <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5 lg:text-right whitespace-nowrap shrink-0">
          ~{readingMinutes} &bull; {pluralize(chapterCount, "chapter")}
        </p>
      </div>

      {/* Start Chapter CTA */}
      <button
        type="button"
        onClick={scrollToFirstChapter}
        className="cursor-pointer"
      >
        <CTAButton variant="primary" icon={<AngleRight />}>
          Start Chapter 1
        </CTAButton>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chapter Section                                                    */
/* ------------------------------------------------------------------ */

interface ChapterSectionProps {
  chapter: Content.StrategyAccordionSliceDefaultPrimaryChapterItem;
  index: number;
  isLast: boolean;
}

function ChapterSection({ chapter, index, isLast }: ChapterSectionProps) {
  const chapterId = chapter.chapter_title ? slugify(chapter.chapter_title) : `chapter-${index}`;
  const listenData = useMemo(
    () => getChapterListenData(chapter.chapter_content),
    [chapter.chapter_content],
  );

  return (
    <div id={chapterId}>
      {/* Chapter header */}
      <div className="flex flex-col gap-4 mb-6">
        <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5">
          Chapter {index + 1}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-2xl lg:text-[32px] leading-8 lg:leading-[48px] tracking-[-0.48px] lg:tracking-[-0.64px] text-cream">
            {chapter.chapter_title}
          </h2>
          {/* Listen + Checkmark — desktop only (mobile version is fixed bar) */}
          <div className="hidden lg:flex items-center gap-2 sm:ml-auto shrink-0">
            <ListenButton
              text={listenData.text}
              duration={listenData.formatted}
              size="md"
            />
            <span className="inline-flex items-center justify-center bg-[#0e0e12] border border-cream/12 h-12 w-12 rounded-full">
              <Checkmark />
            </span>
          </div>
        </div>
      </div>

      {/* Chapter rich text content */}
      <div
        className={[
          "[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-[#d8d7d4] [&_p]:mb-6",
          "[&_h3]:text-xl [&_h3]:leading-7 [&_h3]:text-cream [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3",
          "[&_strong]:text-cream [&_strong]:font-semibold",
          "[&_a]:text-[#67ADDC] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-[#d8d7d4]",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-[#d8d7d4]",
          "[&_li]:text-base [&_li]:leading-[27.2px] [&_li]:mb-2",
          "[&_img]:rounded-[3px] [&_img]:my-8 [&_img]:w-full",
        ].join(" ")}
      >
        <PrismicRichText field={chapter.chapter_content} />
      </div>

      {/* Divider between chapters */}
      {!isLast && <div className="w-full h-px bg-cream/12 my-10" />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline Sibling Slice Renderer                                      */
/* ------------------------------------------------------------------ */

function InlineRichText({ slice }: { slice: Content.RichTextSlice }) {
  return (
    <div
      className={[
        "[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-[#d8d7d4] [&_p]:mb-6",
        "[&_h3]:text-xl [&_h3]:leading-7 [&_h3]:text-cream [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3",
        "[&_strong]:text-cream [&_strong]:font-semibold",
        "[&_a]:text-[#67ADDC] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-[#d8d7d4]",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-[#d8d7d4]",
        "[&_li]:text-base [&_li]:leading-[27.2px] [&_li]:mb-2",
        "[&_img]:rounded-[3px] [&_img]:my-8 [&_img]:w-full",
        "[&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:rounded-[3px] [&_pre]:p-4 [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:text-[#d8d7d4]",
      ].join(" ")}
    >
      <PrismicRichText field={slice.primary.rich_text} />
    </div>
  );
}

function InlineTable({ slice }: { slice: Content.TableSlice }) {
  return (
    <div className="my-8">
      {slice.primary.table_heading && (
        <h4 className="text-xl leading-7 text-cream font-medium mb-3">
          {slice.primary.table_heading}
        </h4>
      )}
      {slice.primary.table_description && (
        <div className="[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-[#d8d7d4] [&_p]:mb-4">
          <PrismicRichText field={slice.primary.table_description} />
        </div>
      )}
      {slice.primary.table_data && (
        <div className="overflow-x-auto rounded-[3px] border border-border">
          <PrismicTable
            field={slice.primary.table_data}
            components={{
              table: ({ children }: { children: ReactNode }) => (
                <table className="w-full text-sm">{children}</table>
              ),
              thead: ({ children }: { children: ReactNode }) => (
                <thead className="bg-surface">{children}</thead>
              ),
              tbody: ({ children }: { children: ReactNode }) => (
                <tbody>{children}</tbody>
              ),
              tr: ({ children }: { children: ReactNode }) => (
                <tr className="border-b border-border last:border-b-0">{children}</tr>
              ),
              th: ({ children }: { children: ReactNode }) => (
                <th className="text-left px-4 py-3 text-cream font-medium text-xs uppercase tracking-[0.96px] font-mono border-r border-border last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }: { children: ReactNode }) => (
                <td className="px-4 py-3 text-[#d8d7d4] leading-[22px] border-r border-border last:border-r-0">
                  {children}
                </td>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}

function InlineChapterSlice({ slice, chapterOffset }: { slice: Content.ChapterSlice; chapterOffset: number }) {
  const chapters = slice.primary.chapter ?? [];
  return (
    <>
      {/* Divider before chapter slice content */}
      <div className="w-full h-px bg-cream/12 my-10" />
      {chapters.map((chapter, idx) => (
        <ChapterSection
          key={`chapter-slice-${idx}`}
          chapter={chapter as Content.StrategyAccordionSliceDefaultPrimaryChapterItem}
          index={chapterOffset + idx}
          isLast={idx === chapters.length - 1}
        />
      ))}
    </>
  );
}

function SiblingSlices({ slices, baseChapterCount }: { slices: SiblingSlice[]; baseChapterCount: number }) {
  // Render all slices that come after the first strategy_accordion slice
  const siblingSlices = useMemo(
    () => slices.slice(slices.findIndex((s) => s.slice_type === "strategy_accordion") + 1),
    [slices],
  );

  // Pre-compute chapter offsets for each Chapter slice
  const chapterOffsets = useMemo(() => {
    const offsets: number[] = [];
    let offset = baseChapterCount;
    for (const s of siblingSlices) {
      offsets.push(offset);
      if (s.slice_type === "chapter") {
        offset += ((s as Content.ChapterSlice).primary.chapter?.length ?? 0);
      }
    }
    return offsets;
  }, [siblingSlices, baseChapterCount]);

  if (siblingSlices.length === 0) return null;

  return (
    <>
      {siblingSlices.map((s, i) => {
        if (s.slice_type === "rich_text") {
          return <InlineRichText key={i} slice={s as Content.RichTextSlice} />;
        }
        if (s.slice_type === "table") {
          return <InlineTable key={i} slice={s as Content.TableSlice} />;
        }
        if (s.slice_type === "chapter") {
          return <InlineChapterSlice key={i} slice={s as Content.ChapterSlice} chapterOffset={chapterOffsets[i]} />;
        }
        return null;
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

const StrategyAccordion: FC<StrategyAccordionProps> = ({ slice, context }) => {
  const articles = context?.articles ?? [];
  const currentUid = context?.currentUid;
  const allSlices = useMemo(() => context?.allSlices ?? [], [context?.allSlices]);
  const ctaButton = context?.ctaButton;
  const partNumber = slice.primary.part_number;
  const partName = slice.primary.part_name;
  const partColor = slice.primary.part_color ?? "#62f6b5";
  const chapters = useMemo(() => slice.primary.chapter ?? [], [slice.primary.chapter]);

  // Collect all chapters (from Article slice + sibling Chapter slices) for TOC, observer, and TTS
  const allChapters = useMemo(() => {
    const list: Content.StrategyAccordionSliceDefaultPrimaryChapterItem[] = [];
    // From the main Article slice
    for (const ch of chapters) {
      if (ch.chapter_title) list.push(ch);
    }
    // From sibling Chapter slices
    const siblingStart = allSlices.findIndex((s) => s.slice_type === "strategy_accordion") + 1;
    for (let i = siblingStart; i < allSlices.length; i++) {
      const s = allSlices[i];
      if (s.slice_type === "chapter") {
        const chapterSlice = s as Content.ChapterSlice;
        for (const ch of chapterSlice.primary.chapter ?? []) {
          if (ch.chapter_title) {
            list.push(ch as Content.StrategyAccordionSliceDefaultPrimaryChapterItem);
          }
        }
      }
    }
    return list;
  }, [chapters, allSlices]);

  const allChapterTitles = useMemo(
    () => allChapters.map((ch) => ch.chapter_title ?? ""),
    [allChapters],
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track active chapter via IntersectionObserver
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Listen data for the currently-active chapter (drives the mobile fixed bar)
  const activeListenData = useMemo(
    () => getChapterListenData(allChapters[activeChapterIndex]?.chapter_content),
    [allChapters, activeChapterIndex],
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const ids = allChapterTitles.map((title) => slugify(title));

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx >= 0) setActiveChapterIndex(idx);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [allChapterTitles]);

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#0e0e12] min-h-screen"
    >
      {/* Article-specific top bar overlaying the global one */}
      <ArticleTopBar
        partName={partName}
        ctaButton={ctaButton}
        onMenuClick={() => setMobileMenuOpen((prev) => !prev)}
        isMenuOpen={mobileMenuOpen}
      />

      {/* Mobile fixed chapter bar — under the header */}
      <div className="fixed top-[67px] left-0 right-0 z-[55] bg-background border-b border-border lg:hidden">
        <div className="flex items-center justify-between px-4 h-14">
          <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5">
            Chapter {activeChapterIndex + 1}
          </p>
          <div className="flex items-center gap-2">
            <ListenButton
              key={`listen-${activeChapterIndex}`}
              text={activeListenData.text}
              duration={activeListenData.formatted}
              size="sm"
            />
            <span className="inline-flex items-center justify-center bg-[#0e0e12] border border-cream/12 h-10 w-10 rounded-full">
              <Checkmark />
            </span>
          </div>
        </div>
      </div>

      {/* Mobile TOC Menu */}
      <MobileTOCMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        articles={articles}
        currentUid={currentUid}
        currentSlice={slice}
        activeChapterIndex={activeChapterIndex}
        allChapterTitles={allChapterTitles}
        ctaButton={ctaButton}
      />

      {/* Three-column layout */}
      <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] mt-2">
        <div className="flex gap-6">
          {/* Left sidebar TOC — hidden on mobile */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-96px)] overflow-y-auto scrollbar-none">
            <TOCSidebar
              articles={articles}
              currentUid={currentUid}
              currentSlice={slice}
              activeChapterIndex={activeChapterIndex}
              allChapterTitles={allChapterTitles}
            />
          </aside>

          {/* Vertical divider — hidden on mobile */}
          <div className="hidden lg:block w-px bg-cream/12 shrink-0 self-stretch" />

          {/* Main content */}
          <main className="flex-1 min-w-0 pb-16 lg:pb-24 pt-[70px] lg:pt-6">
            <div
              className="relative overflow-hidden rounded-xs w-full h-[180px] lg:h-auto"
              style={{
                background: `linear-gradient(90deg, rgba(14,14,18,0.48) 0%, rgba(14,14,18,0.48) 100%), ${partColor}`,
              }}
            >
              <Image
                src="/images/part-hero-rectangle.png"
                alt="Illustration"
                width={784}
                height={240}
                className="object-cover w-full h-full lg:object-contain lg:h-auto"
              />
              <div className="absolute left-4 lg:left-6 top-3 lg:top-6">
                <span className="inline-flex items-center justify-center bg-[#0e0e12] h-[26px] px-2 rounded-full">
                  <span className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5">
                    Part {partNumber}
                  </span>
                </span>
              </div>
              <h1 className="absolute left-4 lg:left-6 bottom-3 lg:bottom-6 text-[36px] lg:text-[60px] leading-[1.04] tracking-[-0.72px] lg:tracking-[-1.2px] text-cream">
                {partName}
              </h1>
            </div>
            <div className="mx-0 lg:mx-6">
              {/* Right sidebar info (above content on large screens, inline) */}
              <div className="mb-10">
                <RightSidebar slice={slice} allSlices={allSlices} />
              </div>

              {/* Chapters */}
              <div className="flex flex-col">
                {chapters.map((chapter, index) => (
                  <ChapterSection
                    key={index}
                    chapter={chapter}
                    index={index}
                    isLast={index === chapters.length - 1}
                  />
                ))}
              </div>

              {/* Sibling slices (RichText, Table) rendered inline */}
              <SiblingSlices slices={allSlices} baseChapterCount={chapters.length} />
            </div>
          </main>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StrategyAccordion;
