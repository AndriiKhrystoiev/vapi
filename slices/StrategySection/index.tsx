import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `StrategySection`.
 */
export type StrategySectionProps =
  SliceComponentProps<Content.StrategySectionSlice, { inline?: boolean }>;

/**
 * Component for "StrategySection" Slices.
 */
const StrategySection: FC<StrategySectionProps> = ({ slice, context }) => {
  // When rendered in the SliceZone flow, return null — GuideRoadmap renders this inline as a sidebar
  if (!context?.inline) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="w-full rounded-[3px] bg-[#18181b] border border-border p-5"
    >
      <div className="flex flex-col gap-5">
        {/* Title & description */}
        <div className="flex flex-col gap-4">
          <div className="[&_h1]:text-xl [&_h1]:leading-7 [&_h1]:text-cream [&_h1]:font-medium">
            <PrismicRichText field={slice.primary.title} />
          </div>
          <div className="[&_p]:text-sm [&_p]:leading-[22px] [&_p]:text-muted">
            <PrismicRichText field={slice.primary.description} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-muted">
            <span className="text-accent font-medium">{slice.primary.chapters_count}</span> Chapters
          </p>
          <p className="text-xs text-muted">
            <span className="text-accent font-medium">{slice.primary.tools_count}</span> Practical Tools
          </p>
          <p className="text-xs text-muted">
            <span className="text-accent font-medium">{slice.primary.read_time}</span> min read
          </p>
        </div>

        {/* Key outcomes */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs text-muted uppercase tracking-[1.5px]">
            {slice.primary.key_outcomes_label}
          </h3>
          <ul className="flex flex-col gap-2">
            {slice.primary.outcomes.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 w-[6px] h-[6px] rounded-full bg-accent shrink-0" />
                <div className="text-sm text-[#d4d4d8] [&_p]:text-sm [&_p]:text-[#d4d4d8]">
                  <PrismicRichText field={item.outcome_text} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StrategySection;
