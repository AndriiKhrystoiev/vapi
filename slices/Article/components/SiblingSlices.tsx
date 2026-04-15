"use client";

import { useMemo } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicTable } from "@prismicio/react";
import { articleProseClasses } from "@/lib/proseClasses";
import { richTextComponents } from "@/lib/richTextComponents";
import { prismicTableComponents } from "@/lib/tableComponents";
import ChapterSection from "./ChapterSection";
import type { SiblingSlice } from "../types";

function InlineRichText({ slice }: { slice: Content.RichTextSlice }) {
  return (
    <div className={articleProseClasses}>
      <PrismicRichText field={slice.primary.rich_text} components={richTextComponents} />
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
        <div className="[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-body-text [&_p]:mb-4">
          <PrismicRichText field={slice.primary.table_description} />
        </div>
      )}
      {slice.primary.table_data && (
        <div className="overflow-x-auto rounded-[3px] border border-border">
          <PrismicTable
            field={slice.primary.table_data}
            components={prismicTableComponents}
          />
        </div>
      )}
    </div>
  );
}

function InlineChapterSlice({
  slice,
  chapterOffset,
}: {
  slice: Content.ChapterSlice;
  chapterOffset: number;
}) {
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

interface SiblingSlicesProps {
  slices: SiblingSlice[];
  baseChapterCount: number;
}

export default function SiblingSlices({ slices, baseChapterCount }: SiblingSlicesProps) {
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
          return (
            <InlineChapterSlice
              key={i}
              slice={s as Content.ChapterSlice}
              chapterOffset={chapterOffsets[i]}
            />
          );
        }
        return null;
      })}
    </>
  );
}
