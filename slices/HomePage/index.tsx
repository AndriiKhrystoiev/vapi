import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type GuideRoadmapProps = SliceComponentProps<Content.GuideRoadmapSlice>;

const GuideRoadmap: FC<GuideRoadmapProps> = ({ slice }) => {
  const parts = slice.primary.parts;

  // Pre-compute global section start index for each part
  const partStartIndices = parts.reduce<number[]>((acc, _part, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + parts[i - 1].sections.length];
  }, []);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-background min-h-screen"
    >
      {/* Hero */}
      <div className="mx-auto max-w-[814px] px-10 pt-[170px] pb-16">
        <div className="mb-9 [&_h1]:text-[72px] [&_h1]:leading-[90px] [&_h1]:tracking-[-0.5px] [&_h1]:text-cream [&_h1]:font-medium">
          <PrismicRichText field={slice.primary.title} />
        </div>
        <div className="mb-9 max-w-[550px] [&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-muted">
          <PrismicRichText field={slice.primary.subtitle} />
        </div>
        <div className="flex items-center gap-3">
          {slice.primary.cta_buttons.map((button, index) => (
            <PrismicNextLink
              key={index}
              field={button}
              className={
                button.variant === "Primary"
                  ? "inline-flex items-center gap-2.5 h-[45px] px-4 py-2.5 rounded-full bg-accent text-[#0a0a0a] font-mono text-xs font-medium uppercase tracking-[1.5px]"
                  : "inline-flex items-center gap-2.5 h-[45px] px-4 py-2.5 rounded-full bg-[#09090b] border border-[#3f3f46] text-white font-mono text-xs font-medium uppercase tracking-[1.5px]"
              }
            />
          ))}
        </div>
      </div>

      {/* Roadmap Parts */}
      <div className="mx-auto max-w-[814px] px-10 pb-20 flex flex-col gap-16">
        {parts.map((part, partIndex) => {
          const startIndex = partStartIndices[partIndex];
          const completedCount = part.sections.filter(
            (s) => s.expanded,
          ).length;
          const totalCount = part.sections.length;

          return (
            <div key={partIndex} className="flex flex-col gap-4">
              {/* Part Header */}
              <div className="flex flex-col gap-1">
                <span className="font-mono text-base leading-[31.35px] text-muted uppercase">
                  Part {part.part_number}
                </span>
                <div className="flex items-center justify-between">
                  <h2 className="text-[28px] leading-9 tracking-[-0.5px] text-accent font-medium">
                    {part.part_title}
                  </h2>
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-2.5">
                      {part.sections.map((section, i) => (
                        <div
                          key={i}
                          className={`w-[13px] h-[30px] rounded-full ${
                            section.expanded
                              ? "bg-accent"
                              : "bg-pill-empty border border-border"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-base leading-[31.35px] text-muted uppercase">
                      {completedCount}/{totalCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sections List */}
              <div className="flex flex-col rounded-[3px]">
                {part.sections.map((section, sectionIndex) => {
                  const globalNum = startIndex + sectionIndex + 1;
                  const numStr = globalNum.toString().padStart(2, "0");
                  const isAvailable = section.expanded;
                  const isFirst = sectionIndex === 0;
                  const isLast = sectionIndex === part.sections.length - 1;

                  return (
                    <div
                      key={sectionIndex}
                      className={`p-5 ${
                        isAvailable
                          ? "bg-surface border-border-active"
                          : "border-border"
                      } ${
                        isFirst
                          ? "border-l border-r border-t rounded-t-[3px]"
                          : isLast
                            ? "border rounded-b-[3px]"
                            : "border-l border-r border-t"
                      }`}
                    >
                      <div
                        className={`flex items-start justify-between w-full ${
                          !isAvailable ? "opacity-40" : ""
                        }`}
                      >
                        <span className="font-mono text-base leading-[31.35px] text-muted uppercase shrink-0">
                          {numStr}
                        </span>
                        <div className="flex flex-col gap-1 items-start flex-1 ml-6">
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="text-xl leading-7 text-cream font-medium">
                              {section.section_title}
                            </span>
                            <span
                              className={`shrink-0 inline-flex items-center justify-center h-7 px-3 rounded-full border text-[10px] font-mono font-medium uppercase tracking-[1.5px] ${
                                isAvailable
                                  ? "bg-[#09090b] border-[#3f3f46] text-accent"
                                  : "bg-[#09090b] border-[#3f3f46] text-muted"
                              }`}
                            >
                              {isAvailable ? "read chapter" : "Coming soon"}
                            </span>
                          </div>
                          {isAvailable && (
                            <div className="text-sm leading-6 text-muted w-full [&_p]:leading-6">
                              <PrismicRichText
                                field={section.section_description}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GuideRoadmap;
