"use client";

import { useEffect, useRef, useState } from "react";

interface ArticleTOCProps {
  headings: { id: string; text: string }[];
  chapterLabel?: string;
  totalSections?: number;
  currentSection?: number;
}

export default function ArticleTOC({
  headings,
  chapterLabel,
  totalSections,
  currentSection = 1,
}: ArticleTOCProps) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" },
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const passedCount = activeIndex >= 0 ? activeIndex + 1 : 0;

  return (
    <div className="rounded-[3px] bg-surface border border-border p-5 flex flex-col gap-4">
      {/* Chapter label + progress pills */}
      {(chapterLabel || totalSections) && (
        <div className="flex items-center justify-between">
          {chapterLabel && (
            <span className="font-mono text-xs text-muted uppercase tracking-[1.5px]">
              {chapterLabel}
            </span>
          )}
          {totalSections && (
            <div className="flex items-center gap-2">
              <div className="flex gap-[6px]">
                {Array.from({ length: totalSections }, (_, i) => (
                  <div
                    key={i}
                    className={`w-[24px] h-[10px] rounded-full ${
                      i < passedCount
                        ? "bg-accent"
                        : "bg-pill-empty border border-border"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-muted">
                {passedCount}/{totalSections}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Heading links */}
      <nav className="flex flex-col gap-1.5">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <button
              key={heading.id}
              onClick={() => {
                const el = document.getElementById(heading.id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className={`text-left text-sm leading-6 transition-colors ${
                isActive ? "text-cream font-medium" : "text-muted hover:text-cream"
              }`}
            >
              {heading.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
