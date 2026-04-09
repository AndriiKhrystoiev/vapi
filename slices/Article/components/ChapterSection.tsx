"use client";

import { useMemo } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import ListenButton from "@/components/shared/ListenButton";
import { Checkmark } from "@/components/icons";
import { slugify } from "@/helpers/slugify";
import { getChapterListenData } from "@/helpers/listenTime";

interface ChapterSectionProps {
  chapter: Content.StrategyAccordionSliceDefaultPrimaryChapterItem;
  index: number;
  isLast: boolean;
}

export default function ChapterSection({ chapter, index, isLast }: ChapterSectionProps) {
  const chapterId = chapter.chapter_title ? slugify(chapter.chapter_title) : `chapter-${index}`;
  const listenData = useMemo(
    () => getChapterListenData(chapter.chapter_content),
    [chapter.chapter_content],
  );

  return (
    <div id={chapterId} className="scroll-mt-[140px] lg:scroll-mt-24">
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
