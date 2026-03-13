import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import Image from "next/image";
import { AngleRight, CircleInButton } from "@/components/icons";
import CTAButton from "@/components/ui/CTAButton";
import DocumentLinkList from "@/components/shared/DocumentLinkList";
import StrategySection from "@/slices/StrategySection";
import TOCItem from "./TOCItem";

export type GuideRoadmapProps = SliceComponentProps<
  Content.GuideRoadmapSlice,
  { slices: Content.HomePageDocumentDataSlicesSlice[] }
>;

const GuideRoadmap: FC<GuideRoadmapProps> = ({ slice, context }) => {
  const strategySlice = context?.slices?.find(
    (s): s is Content.StrategySectionSlice => s.slice_type === "strategy_section",
  );
  const parts = slice.primary.parts;

  // Pre-compute global section start index for each part
  const partStartIndices = parts.reduce<number[]>((acc, _part, i) => {
    if (i === 0) return [0];
    return [...acc, acc[i - 1] + parts[i - 1].sections.length];
  }, []);

  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-background min-h-screen"
    >
      {/* Hero */}
      <header className="relative pt-40 pb-16 overflow-hidden min-h-[100vh]">
        <div className="max-w-[1440px] px-20 relative z-1 mx-auto">
          <div className="max-w-[800px]">
            <div className="mb-9 [&_h1]:text-[72px] [&_h1]:leading-[90px] [&_h1]:tracking-[-0.5px] [&_h1]:text-cream [&_h1]:font-medium">
              <PrismicRichText field={slice.primary.title} />
            </div>
            <div className="mb-9 [&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-muted">
              <PrismicRichText field={slice.primary.subtitle} />
            </div>
            <div className="flex items-center gap-3">
              <PrismicNextLink field={slice.primary.cta_buttons[0]}>
                <CTAButton variant="primary" icon={<AngleRight color="#09090B" />}>
                  {slice.primary.cta_buttons[0]?.text}
                </CTAButton>
              </PrismicNextLink>
              <PrismicNextLink field={slice.primary.cta_buttons[1]}>
                <CTAButton variant="secondary" icon={<CircleInButton color="#D8D7D4" />}>
                  {slice.primary.cta_buttons[1]?.text}
                </CTAButton>
              </PrismicNextLink>
            </div>
          </div>
        </div>

        {/* Hero background graphic */}
        <div className="absolute top-0 right-0 left-0 bottom-0 pointer-events-none z-0" aria-hidden="true">
          <Image
            src="/images/hero-background.png"
            alt=""
            fill
            className="object-cover object-center-top"
            priority
          />
        </div>
      </header>

      {/* Table of Contents */}
      <div className="bg-surface py-20">
        <nav aria-label="Table of contents" className="mx-auto max-w-[1440px] px-20">
          <div className="grid grid-cols-3 gap-x-10 gap-y-3">
            {(() => {
              const colCount = 3;
              const perCol = Math.ceil(parts.length / colCount);
              return Array.from({ length: colCount }, (_, colIndex) => {
                const start = colIndex * perCol;
                const colParts = parts.slice(start, start + perCol);
                return (
                  <div key={colIndex} className="flex flex-col gap-3">
                    {colParts.map((part, i) => {
                      const globalIndex = start + i;
                      return (
                        <TOCItem
                          key={globalIndex}
                          part={part}
                          partIndex={globalIndex}
                        />
                      );
                    })}
                  </div>
                );
              });
            })()}
          </div>
        </nav>
      </div>

      {/* Roadmap Parts */}
      <section className="relative mx-auto max-w-[1440px] px-20 py-24">
        <div className="flex flex-col gap-16 z-1 relative">
          {parts.map((part, partIndex) => {
            const startIndex = partStartIndices[partIndex];
            const completedCount = part.sections.filter(
              (s) => s.expanded,
            ).length;
            const totalCount = part.sections.length;

            return (
              <div key={partIndex} className="relative">
                <div className="max-w-[734px] flex flex-col gap-4">
                  {/* Part Header */}
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-sm leading-[31.35px] text-muted uppercase">
                      Part {part.part_number}
                    </span>
                    <div className="flex items-center justify-between">
                      <h2 className="text-[28px] leading-9 tracking-[-0.5px] text-accent font-medium">
                        {part.part_title}
                      </h2>
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-[10px]">
                          {part.sections.map((section, i) => (
                            <div
                              key={i}
                              className={`w-[30px] h-[13px] rounded-full ${
                                section.expanded
                                  ? "bg-accent"
                                  : "bg-pill-empty border border-border"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-sm leading-[31.35px] text-muted uppercase">
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
                            className={`flex items-start w-full ${
                              !isAvailable ? "opacity-40" : ""
                            }`}
                          >
                            <span className="font-mono text-base leading-[31.35px] text-muted uppercase shrink-0 w-[20px]">
                              {numStr}
                            </span>
                            <div className="flex flex-col gap-1 items-start flex-1 ml-6">
                              <div className="flex items-center justify-between w-full gap-4">
                                <span className="text-xl leading-7 text-cream font-medium">
                                  {section.section_title}
                                </span>
                                {isAvailable ? (
                                  <PrismicNextLink
                                    field={section.chapter_link}
                                    className="shrink-0 inline-flex items-center justify-center h-7 px-3 rounded-full border text-[10px] font-mono font-medium uppercase tracking-[1.5px] bg-[#09090b] border-[#3f3f46] text-accent"
                                  >
                                    read chapter
                                  </PrismicNextLink>
                                ) : (
                                  <span className="shrink-0 inline-flex items-center justify-center h-7 px-3 rounded-full border text-[10px] font-mono font-medium uppercase tracking-[1.5px] bg-[#09090b] border-[#3f3f46] text-muted">
                                    Coming soon
                                  </span>
                                )}
                              </div>
                              {isAvailable && (
                                <>
                                  <div className="text-sm leading-6 text-muted w-full [&_p]:leading-6">
                                    <PrismicRichText
                                      field={section.section_description}
                                    />
                                  </div>
                                  {section.document_link?.length > 0 && (
                                    <div className="mt-2 w-full">
                                      <DocumentLinkList links={section.document_link} />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar card for first part */}
                {partIndex === 0 && strategySlice && (
                  <div className="absolute top-[88px] left-[804px] w-[366px] hidden lg:block">
                    <StrategySection slice={strategySlice} index={0} slices={[]} context={{ inline: true }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[413px] h-[370px] pointer-events-none hidden lg:block z-0" aria-hidden="true">
          <Image
            src="/images/content-image-1.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-30 right-80 w-[212px] h-[264px] pointer-events-none hidden lg:block z-0" aria-hidden="true">
          <Image
            src="/images/content-image-2.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="mx-auto px-20 pt-8 pb-14 border-t border-border">
        <div className="flex flex-col items-center gap-8">
          <p className="font-mono text-sm text-muted text-center">
            32 chapters. 9 parts. New content every two weeks.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="email"
              placeholder="you@company.com"
              className="h-[45px] w-56 px-4 bg-transparent border border-[#3f3f46] rounded-lg text-sm text-white placeholder:text-[#52525b] font-mono focus:outline-none focus:border-accent"
            />
            <CTAButton as="button" variant="primary" icon={<CircleInButton color="#09090B" />}>
              Follow the series
            </CTAButton>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default GuideRoadmap;
