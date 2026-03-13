"use client";

import { useState } from "react";
import { Content } from "@prismicio/client";
import AngleDown from "@/components/icons/angle-down";

interface TOCItemProps {
  part: Content.GuideRoadmapSliceDefaultPrimaryPartsItem;
  partIndex: number;
}

export default function TOCItem({ part, partIndex }: TOCItemProps) {
  const [isExpanded, setIsExpanded] = useState(partIndex === 0);

  return (
    <div className="rounded-[3px] border border-border bg-background">
      {/* Header row - clickable */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex items-center justify-between px-4 py-3 w-full text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted uppercase tracking-[1.5px]">
            Part {part.part_number}
          </span>
          <span className="text-sm font-medium text-accent">
            {part.part_title}
          </span>
        </div>
        <span
          className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        >
          <AngleDown />
        </span>
      </button>

      {/* Expanded chapter list */}
      {isExpanded && (
        <div className="px-4 pb-3 flex flex-col gap-1">
          {part.sections.map((section, i) => {
            const globalNum = (i + 1).toString().padStart(2, "0");
            return (
              <div key={i} className="flex items-center gap-3 py-1">
                <span className="font-mono text-xs text-muted">
                  {globalNum}
                </span>
                <span className="text-xs text-[#d4d4d8]">
                  {section.section_title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
