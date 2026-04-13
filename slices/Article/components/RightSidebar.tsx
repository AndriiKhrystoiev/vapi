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
  const learnItems = (slice.primary as Record<string, unknown>).you_will_learn_items as { learn_item?: string }[] ?? [];
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
    <div className="flex flex-col gap-6 w-full items-start pt-6">
      {/* Summary + meta */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 w-full">
        {/* Start Chapter CTA */}
        <button type="button" onClick={scrollToFirstChapter} className="cursor-pointer">
          <CTAButton as="span" variant="primary" icon={<AngleRight />}>
            Start Chapter 1
          </CTAButton>
        </button>
        <p className="font-mono text-xs font-medium text-cream uppercase tracking-[0.96px] leading-5 lg:text-right whitespace-nowrap shrink-0">
          ~{readingMinutes} &bull; {pluralize(chapterCount, "chapter")}
        </p>
      </div>
    </div>
  );
}
