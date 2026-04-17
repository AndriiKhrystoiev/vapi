"use client";

import { useState } from "react";
import { asText, Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { AngleDown } from "@/components/icons";

type Outcome = Content.GuidePlaybookHeroSliceDefaultPrimaryLearningOutcomesItem;

export default function LearningOutcomes({ outcomes }: { outcomes: Outcome[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full lg:w-[588px]">
      {outcomes.map((outcome, index) => {
        const isLast = index === outcomes.length - 1;
        const isExpanded = expandedIndex === index;

        return (
          <div
            key={index}
            className={`py-4 lg:py-5 ${!isLast ? "border-b border-border" : ""}`}
          >
            <button
              type="button"
              className="flex items-center gap-4 w-full text-left cursor-pointer"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              {outcome.outcome_image?.url && (
                <div className="w-6 h-6 flex-shrink-0">
                  <PrismicNextImage
                    alt=""
                    field={outcome.outcome_image}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
              )}
              <span className="flex-1 text-[16px] lg:text-[18px] leading-[24px] lg:leading-[26px] text-cream font-medium">
                {outcome.outcome_heading || asText(outcome.outcome_text)}
              </span>
              <span
                className={`shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              >
                <AngleDown color="rgba(255,250,234,0.6)" width={14} height={8} />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-3 pl-10 [&_p]:text-[14px] lg:[&_p]:text-[16px] [&_p]:leading-[22px] lg:[&_p]:leading-[24px] [&_p]:text-body-text [&_p]:opacity-60">
                  <PrismicRichText field={outcome.outcome_text} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
