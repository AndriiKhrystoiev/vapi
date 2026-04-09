"use client";

import { useCallback, useMemo } from "react";
import { Content } from "@prismicio/client";
import CTAButton from "@/components/ui/CTAButton";
import { AngleRight } from "@/components/icons";
import { pluralize } from "@/helpers/pluralize";
import { slugify } from "@/helpers/slugify";
import { formatListenMinutes, getSliceListenSeconds } from "@/helpers/listenTime";
import type { SiblingSlice } from "../types";

interface RightSidebarProps {
  slice: Content.StrategyAccordionSlice;
  allSlices: SiblingSlice[];
}

export default function RightSidebar({ slice, allSlices }: RightSidebarProps) {
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
      <button type="button" onClick={scrollToFirstChapter} className="cursor-pointer">
        <CTAButton variant="primary" icon={<AngleRight />}>
          Start Chapter 1
        </CTAButton>
      </button>
    </div>
  );
}
