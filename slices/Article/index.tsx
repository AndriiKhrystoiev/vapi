"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import ListenButton from "@/components/shared/ListenButton";
import { ArticleTopBar } from "@/components/TopBar";
import { Checkmark } from "@/components/icons";
import { slugify } from "@/helpers/slugify";
import { getChapterListenData } from "@/helpers/listenTime";
import MobileTOCMenu from "./components/MobileTOCMenu";
import TOCSidebar from "./components/TOCSidebar";
import RightSidebar from "./components/RightSidebar";
import ChapterSection from "./components/ChapterSection";
import SiblingSlices from "./components/SiblingSlices";
import type { ArticleContext } from "./types";

export type StrategyAccordionProps = SliceComponentProps<
  Content.StrategyAccordionSlice,
  ArticleContext
>;

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
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => ids.indexOf(e.target.id))
          .filter((idx) => idx >= 0);
        if (intersecting.length > 0) {
          const idx = Math.min(...intersecting);
          setActiveChapterIndex(idx);
          history.replaceState(null, "", `#${ids[idx]}`);
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

  // Scroll to hash target on initial mount (chapter or section heading)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    // Small delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-background min-h-screen"
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
            <span className="inline-flex items-center justify-center bg-background border border-cream/12 h-10 w-10 rounded-full">
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
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 self-start max-h-[calc(100vh-96px)] overflow-y-auto [&::-webkit-scrollbar]:hidden">
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
                <span className="inline-flex items-center justify-center bg-background h-[26px] px-2 rounded-full">
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

              {/* Sibling slices (RichText, Table, Chapter) rendered inline */}
              <SiblingSlices slices={allSlices} baseChapterCount={chapters.length} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StrategyAccordion;
