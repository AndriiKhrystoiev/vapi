"use client";

import { FC, useState, useCallback, useMemo, ReactNode } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText, PrismicTable } from "@prismicio/react";
import Link from "next/link";
import Image from "next/image";
import CTAButton from "@/components/ui/CTAButton";
import { AngleDown, AngleRight } from "@/components/icons";
import { pluralize } from "@/helpers/pluralize";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SiblingSlice = Content.RichTextSlice | Content.TableSlice | Content.StrategyAccordionSlice;

type ArticleContext = {
  articles?: Content.ArticlepageDocument[];
  currentUid?: string;
  allSlices?: SiblingSlice[];
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

/* ------------------------------------------------------------------ */
/*  Left Sidebar TOC                                                   */
/* ------------------------------------------------------------------ */

interface TOCSidebarProps {
  articles: Content.ArticlepageDocument[];
  currentUid?: string;
  currentSlice: Content.StrategyAccordionSlice;
}

function TOCSidebar({ articles, currentUid, currentSlice }: TOCSidebarProps) {
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
    const s = getArticleSlice(article);
    return sum + (s?.primary.chapter?.length ?? 0);
  }, 0);

  const currentChapterCount = currentSlice.primary.chapter?.length ?? 0;

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
          <span>{currentChapterCount}</span>
          <span className="text-cream/60">
            /{totalChapters} {totalChapters === 1 ? "chapter" : "chapters"}
          </span>
        </p>
        <div className="flex items-center w-full">
          <div
            className="bg-accent h-1 rounded-l-sm"
            style={{
              width: `${(currentChapterCount / Math.max(totalChapters, 1)) * 100}%`,
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
          const chapters = articleSlice.primary.chapter ?? [];
          const chapterCount = chapters.length;

          return (
            <div key={uid} className="border-t border-cream/12">
              {/* Collapsed / Header row */}
              <button
                type="button"
                className="flex items-center w-full py-5 text-left group cursor-pointer"
                onClick={() => {
                  if (isCurrent) {
                    handleToggle(uid);
                  } else {
                    /* navigate handled by Link below */
                  }
                }}
              >
                <span
                  className="text-sm tracking-[-0.28px] leading-4 font-medium w-[64px] shrink-0"
                  style={{ color: partColor }}
                >
                  Part {partNumber}
                </span>
                <span className="text-sm tracking-[-0.28px] leading-4 font-medium text-cream flex-1">
                  {isCurrent ? (
                    partName
                  ) : (
                    <Link href={`/${uid}`} className="hover:opacity-80">
                      {partName}
                    </Link>
                  )}
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
              {isExpanded && isCurrent && (
                <div className="flex flex-col gap-2 pb-4">
                  {chapters.map((chapter, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="flex items-center gap-2 w-full text-left cursor-pointer group"
                      onClick={() =>
                        chapter.chapter_title &&
                        scrollToChapter(chapter.chapter_title)
                      }
                    >
                      <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="6"
                            stroke={partColor}
                            strokeWidth="1.2"
                            fill="none"
                            opacity="0.6"
                          />
                        </svg>
                      </span>
                      <span className="text-base leading-6 text-[#d8d7d4] group-hover:text-cream transition-colors">
                        {chapter.chapter_title}
                      </span>
                    </button>
                  ))}

                  {/* Reading time */}
                  <p className="font-mono text-xs text-cream/60 font-medium uppercase tracking-[0.96px] leading-5 mt-2">
                    ~45 min &bull; {pluralize(chapterCount, "chapter")}
                  </p>
                </div>
              )}

              {/* Collapsed but not current: show as link */}
              {!isCurrent && !isExpanded && null}
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
}

function RightSidebar({ slice }: RightSidebarProps) {
  const learnItems = slice.primary.you_will_learn_items ?? [];
  const chapters = useMemo(() => slice.primary.chapter ?? [], [slice.primary.chapter]);
  const chapterCount = chapters.length;

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
    <div className="flex flex-col gap-6 w-full">
      {/* You will learn */}
      {learnItems.length > 0 && (
        <div className="flex justify-between items-center gap-3 mt-6">
          <p className="text-base leading-6 text-white/60">You will learn</p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
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
                <span className="text-base leading-6 text-white font-medium whitespace-nowrap">
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
      <div className="flex items-start justify-between gap-6">
        <p className="text-2xl leading-8 tracking-[-0.48px] text-cream max-w-[454px]">
          {slice.primary.summary_description}
        </p>
        <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5 text-right whitespace-nowrap shrink-0">
          ~45 min &bull; {pluralize(chapterCount, "chapter")}
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

  return (
    <div id={chapterId}>
      {/* Chapter header */}
      <div className="flex flex-col gap-4 mb-6">
        <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5">
          Chapter {index + 1}
        </p>
        <div className="flex items-center gap-2">
          <h2 className="text-[32px] leading-[48px] tracking-[-0.64px] text-cream">
            {chapter.chapter_title}
          </h2>
          {index === 0 && (
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <span className="inline-flex items-center gap-3 bg-cream h-12 px-5 rounded-full">
                <span className="font-mono text-sm font-medium text-[#0e0e12] uppercase tracking-[1.12px] leading-5">
                  Listen{" "}
                  <span className="text-[#0e0e12]/60">4:48</span>
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6C2 3.79086 3.79086 2 6 2H10C12.2091 2 14 3.79086 14 6V9" stroke="#0e0e12" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M4 10V12C4 13.1046 4.89543 14 6 14" stroke="#0e0e12" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M12 10V12C12 13.1046 11.1046 14 10 14" stroke="#0e0e12" strokeWidth="1.2" strokeLinecap="round" />
                  <rect x="1" y="6" width="3" height="4" rx="1" stroke="#0e0e12" strokeWidth="1.2" />
                  <rect x="12" y="6" width="3" height="4" rx="1" stroke="#0e0e12" strokeWidth="1.2" />
                </svg>
              </span>
              <span className="inline-flex items-center justify-center bg-[#0e0e12] border border-cream/12 h-12 w-12 rounded-full">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L6.5 11.5L13 4.5" stroke="#fffae9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          )}
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

function SiblingSlices({ slices }: { slices: SiblingSlice[] }) {
  // Render all slices that come after the first strategy_accordion slice
  const siblingSlices = slices.slice(
    slices.findIndex((s) => s.slice_type === "strategy_accordion") + 1,
  );

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
  const allSlices = context?.allSlices ?? [];
  const partNumber = slice.primary.part_number;
  const partName = slice.primary.part_name;
  const partColor = slice.primary.part_color ?? "#62f6b5";
  const chapters = slice.primary.chapter ?? [];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#0e0e12] min-h-screen"
    >
      {/* Three-column layout */}
      <div className="mx-auto max-w-[1440px] px-[120px] mt-2">
        <div className="flex gap-6">
          {/* Left sidebar TOC */}
          <aside className="w-[280px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-96px)] overflow-y-auto scrollbar-none">
            <TOCSidebar
              articles={articles}
              currentUid={currentUid}
              currentSlice={slice}
            />
          </aside>

          {/* Vertical divider */}
          <div className="w-px bg-cream/12 shrink-0 self-stretch" />

          {/* Main content */}
          <main className="flex-1 min-w-0 pb-24 pt-6">
            <div
              className="relative overflow-hidden rounded-xs w-full"
              style={{
                background: `linear-gradient(90deg, rgba(14,14,18,0.48) 0%, rgba(14,14,18,0.48) 100%), ${partColor}`,
              }}
            >
              <Image
                src="/images/part-hero-rectangle.png"
                alt="Illustration"
                width={784}
                height={240}
                className="object-contain w-full"
              />
              <div className="absolute left-6 top-6">
                <span className="inline-flex items-center justify-center bg-[#0e0e12] h-[26px] px-2 rounded-full">
                  <span className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5">
                    Part {partNumber}
                  </span>
                </span>
              </div>
              <h1 className="absolute left-6 bottom-6 text-[60px] leading-[1.04] tracking-[-1.2px] text-cream">
                {partName}
              </h1>
            </div>
            <div className="mx-6">
              {/* Right sidebar info (above content on large screens, inline) */}
              <div className="mb-10">
                <RightSidebar slice={slice} />
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
              <SiblingSlices slices={allSlices} />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default StrategyAccordion;
