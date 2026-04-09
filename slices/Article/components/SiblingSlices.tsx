"use client";

import { ReactNode, useMemo } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicTable } from "@prismicio/react";
import ChapterSection from "./ChapterSection";
import type { SiblingSlice } from "../types";

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
