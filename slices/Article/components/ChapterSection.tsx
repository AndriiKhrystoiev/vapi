"use client";

import { useMemo } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import ListenButton from "@/components/shared/ListenButton";
import { Checkmark } from "@/components/icons";
import { slugify } from "@/helpers/slugify";
import { getChapterListenData } from "@/helpers/listenTime";
import { articleProseClasses } from "@/lib/proseClasses";
import { richTextComponents } from "@/lib/richTextComponents";

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
            <span className="inline-flex items-center justify-center bg-background border border-cream/12 h-12 w-12 rounded-full">
              <Checkmark />
            </span>
          </div>
        </div>
      </div>

      {/* Chapter rich text content */}
      <div className={articleProseClasses}>
        <PrismicRichText field={chapter.chapter_content} components={richTextComponents} />
      </div>

      {/* Divider between chapters */}
      {!isLast && <div className="w-full h-px bg-cream/12 my-10" />}
    </div>
  );
}
