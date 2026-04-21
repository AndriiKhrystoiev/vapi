"use client";

import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { AngleDown } from "@/components/icons";

export type AudienceGridProps = SliceComponentProps<Content.AudienceGridSlice>;

function AudienceCard({
  card,
  index,
}: {
  card: Content.AudienceGridSliceDefaultPrimaryCardsItem;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const chapters = card.chapters_list ?? [];

  return (
    <div
      className={`relative px-4 lg:px-6 pb-6 pt-8 min-h-50 lg:min-h-80 grid grid-rows-[subgrid] row-span-4 gap-6 ${
        index !== 0 ? "border-t lg:border-t-0 lg:border-l border-border" : ""
      }`}
    >
      {/* Title */}
      <div className="[&_h3]:text-[24px] lg:[&_h3]:text-[32px] [&_h3]:leading-none [&_h3]:tracking-[-0.48px] lg:[&_h3]:tracking-[-0.64px] [&_h3]:text-cream [&_h3]:font-normal">
        <PrismicRichText field={card.title} />
      </div>

      {/* Description */}
      <div className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] text-body-text opacity-60 self-start">
        <PrismicRichText field={card.description} />
      </div>

      {/* Chapter range info */}
      <div className="self-start">
        {card.chapters_info && (
          <p className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] text-body-text opacity-60">
            {card.chapters_info}
          </p>
        )}
      </div>

      {/* See key chapters toggle + list */}
      <div className="self-end">
        {chapters.length > 0 && (
          <>
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer mb-2"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <span
                className={`shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              >
                <AngleDown color="#e96b34" width={14} height={8} />
              </span>
              <span className="font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-5 text-[#e96b34]">
                See key chapters
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col pt-2">
                  {chapters.map((chapter, idx) => (
                    <PrismicNextLink
                      key={idx}
                      field={chapter.chapter_link}
                      className="flex items-center justify-between py-2 border-t border-border group"
                    >
                      <span className="text-[14px] leading-[22px] text-body-text group-hover:text-cream transition-colors">
                        {chapter.chapter_link.text}
                      </span>
                      {chapter.chapter_number && (
                        <span className="font-mono text-[12px] font-medium tracking-[0.96px] text-[#e96b34] shrink-0 ml-4">
                          {chapter.chapter_number}
                        </span>
                      )}
                    </PrismicNextLink>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const AudienceGrid: FC<AudienceGridProps> = ({ slice }) => {
  return (
    <section
      id="audience"
      className="scroll-mt-16.75 mx-auto max-w-360 px-4 lg:px-30 pb-12 lg:pb-24"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="flex flex-col gap-4 lg:gap-[24px] mb-10 lg:mb-[96px]">
        {slice.primary.label && (
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-[20px] text-[#9977ff]">
            {slice.primary.label}
          </p>
        )}
        <div className="[&_h2]:text-[32px] lg:[&_h2]:text-[60px] [&_h2]:leading-[1.04] [&_h2]:tracking-[-0.64px] lg:[&_h2]:tracking-[-1.2px] [&_h2]:text-[#fffaeb] [&_h2]:font-normal">
          <PrismicRichText field={slice.primary.heading} />
        </div>
      </div>

      <div className="border border-border grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-[auto]">
        {slice.primary.cards.map((card, index) => (
          <AudienceCard key={index} card={card} index={index} />
        ))}
      </div>
    </section>
  );
};

export default AudienceGrid;
