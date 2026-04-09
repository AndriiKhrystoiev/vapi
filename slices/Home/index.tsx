import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";
import Footer from "@/components/shared/Footer";
import { AngleDown, AngleRight } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { pluralize } from "@/helpers/pluralize";
import { formatListenMinutes, getArticleListenSeconds } from "@/helpers/listenTime";

type HomeContext = {
  articles?: Content.ArticlepageDocument[];
};

/**
 * Props for `GuidePlaybookHero`.
 */
export type GuidePlaybookHeroProps =
  SliceComponentProps<Content.GuidePlaybookHeroSlice, HomeContext>;

/**
 * Component for "GuidePlaybookHero" Slices.
 */
const GuidePlaybookHero: FC<GuidePlaybookHeroProps> = ({ slice, context }) => {
  const articles = [...(context?.articles ?? [])].sort((a, b) => {
    const aNum = (a.data.slices[0] as Content.StrategyAccordionSlice | undefined)?.primary.part_number ?? 0;
    const bNum = (b.data.slices[0] as Content.StrategyAccordionSlice | undefined)?.primary.part_number ?? 0;
    return Number(aNum) - Number(bNum);
  });
  return (
    <div
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-no-repeat bg-right bg-contain pointer-events-none"
          style={{ backgroundImage: "url('/images/hero-background.png')" }}
        />
        <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] pt-10 lg:pt-16 pb-16 lg:pb-[96px]">
          <div className="relative max-w-[650px]">
            <div className="[&_h1]:text-[36px] lg:[&_h1]:text-[60px] [&_h1]:leading-[1.04] [&_h1]:tracking-[-0.72px] lg:[&_h1]:tracking-[-1.2px] [&_h1]:text-cream [&_h1]:font-normal">
              <PrismicRichText field={slice.primary.heading} />
            </div>
            <div className="mt-6 lg:mt-8 [&_p]:text-sm lg:[&_p]:text-base [&_p]:leading-[22px] lg:[&_p]:leading-[24px] [&_p]:text-[#d8d7d4] [&_p]:opacity-60">
              <PrismicRichText field={slice.primary.description} />
            </div>
            <div className="mt-8 lg:mt-10">
              <PrismicNextLink field={slice.primary.cta_button}>
                <CTAButton className="px-8 lg:px-12" icon={<AngleRight />} variant="primary">
                  {slice.primary.cta_button.text}
                </CTAButton>
              </PrismicNextLink>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      {slice.primary.table_of_contents_heading && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] pt-12 lg:pt-[96px] pb-4 lg:pb-[24px]">
            <div className="mb-4 lg:mb-[24px]">
              <p className="font-mono text-[12px] text-[rgba(255,250,234,0.6)] font-medium uppercase tracking-[0.96px] leading-[20px] mb-4 lg:mb-[24px]">
                {articles.length} chapters
              </p>
              <h2 className="text-[24px] lg:text-[32px] leading-none tracking-[-0.48px] lg:tracking-[-0.64px] text-cream font-normal">
                {slice.primary.table_of_contents_heading}
              </h2>
            </div>
          </div>
          <div className="border-t border-border" />
          <div className="mx-auto max-w-[1440px] px-4 lg:px-[120px] -mb-[1px]">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => {
              const articleSlice = article.data.slices[0] as Content.StrategyAccordionSlice | undefined;
              if (!articleSlice) return null;
              const { part_number, part_name, part_color, summary_description, chapter } = articleSlice.primary;
              const chapterCount = chapter?.length ?? 0;
              const readingMinutes = formatListenMinutes(getArticleListenSeconds(article));
              const isLastRow = index >= articles.length - (articles.length % 3 || 3);
              return (
                <Link
                  key={article.id}
                  href={article.url ?? "#"}
                  className={`group relative flex flex-col justify-between min-h-[240px] lg:min-h-[376px] md:px-[24px] pt-8 lg:pt-[48px] pb-4 lg:pb-[24px] border-b border-border ${
                    index % 3 !== 0 ? "md:border-l md:border-l-border" : ""
                  } ${isLastRow ? "border-b-[rgba(255,250,235,0.12)]" : ""}`}
                >
                  <div>
                    {part_number != null && (
                      <p
                        className="font-medium text-[14px] lg:text-[16px] leading-[1.24] mb-3 lg:mb-[24px]"
                        style={{ color: part_color ?? "#62f6b5" }}
                      >
                        Part {part_number}
                      </p>
                    )}
                    <h3 className="text-[28px] lg:text-[40px] leading-[1.2] tracking-[-0.56px] lg:tracking-[-0.8px] text-cream font-normal">
                      {part_name}
                    </h3>
                  </div>
                  <div>
                    {summary_description && (
                      <p className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] text-[#d8d7d4] opacity-60 mb-4 lg:mb-[24px]">
                        {summary_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-[20px]">
                        {chapterCount > 0 && (
                          <>
                            <span className="text-[rgba(255,250,234,0.6)]">
                              ~{readingMinutes} &bull;
                            </span>
                            <span className="text-cream">
                              {" "}{pluralize(chapterCount, "chapter")}
                            </span>
                          </>
                        )}
                      </p>
                      <AngleDown className="text-muted group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
            {/* Bottom border */}
            <div className="border-b border-border" />
          </div>
        </section>
      )}

      {/* What you'll learn */}
      {slice.primary.learning_section_heading && (
        <section className="mx-auto max-w-[1440px] px-4 lg:px-[120px] py-12 lg:py-24">
          <div className="flex flex-col gap-4 lg:gap-[24px] mb-8 lg:mb-[48px]">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-[20px] text-[#e96b34]">
              overview
            </p>
            <h2 className="text-[32px] lg:text-[60px] leading-[1.04] tracking-[-0.64px] lg:tracking-[-1.2px] text-cream font-normal">
              {slice.primary.learning_section_heading}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-[24px]">
            {/* Illustration (left side) — hidden on mobile */}
            <div className="w-[588px] shrink-0 hidden lg:flex items-center justify-center">
              <Image
                src="/images/content-image-3.png"
                alt="Illustration"
                width={588}
                height={696}
                className="object-contain"
              />
            </div>

            {/* Learning outcomes list */}
            <div className="flex flex-col w-full lg:w-[588px]">
              {slice.primary.learning_outcomes.map((outcome, index) => {
                const isLast = index === slice.primary.learning_outcomes.length - 1;
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-4 lg:gap-28 py-4 lg:py-0 lg:h-[120px] lg:pt-[16px] ${
                      !isLast ? "border-b border-border" : ""
                    }`}
                  >
                    {outcome.outcome_image?.url && (
                      <div className="w-[24px] h-[24px] flex-shrink-0 mt-[4px]">
                        <PrismicNextImage
                          alt=""
                          field={outcome.outcome_image}
                          width={24}
                          height={24}
                          className="w-[24px] h-[24px] object-contain"
                        />
                      </div>
                    )}
                    <div className="[&_p]:text-[18px] lg:[&_p]:text-[24px] [&_p]:leading-[26px] lg:[&_p]:leading-[32px] [&_p]:text-[#d8d7d4] [&_p]:font-normal">
                      <PrismicRichText field={outcome.outcome_text} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Who this playbook is for */}
      {slice.primary.audience_section_heading && (
        <section className="mx-auto max-w-[1440px] px-4 lg:px-[120px] pb-12 lg:pb-[96px]">
          <div className="flex flex-col gap-4 lg:gap-[24px] mb-10 lg:mb-[96px]">
            <p className="font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-[20px] text-[#9977ff]">
              audience
            </p>
            <h2 className="text-[32px] lg:text-[60px] leading-[1.04] tracking-[-0.64px] lg:tracking-[-1.2px] text-[#fffaeb] font-normal">
              {slice.primary.audience_section_heading}
            </h2>
          </div>

          <div className="border border-border grid grid-cols-1 lg:grid-cols-3">
            {slice.primary.audience_cards.map((card, index) => (
              <div
                key={index}
                className={`relative px-4 lg:px-[24px] py-6 lg:pt-[24px] lg:pb-[24px] min-h-[200px] lg:min-h-[320px] flex flex-col justify-between ${
                  index !== 0 ? "border-t lg:border-t-0 lg:border-l border-border" : ""
                }`}
              >
                <div>
                  {card.audience_label && (
                    <span className="inline-flex items-center justify-center px-[8px] h-[26px] rounded-full border border-[#a1a1aa] font-mono text-[12px] font-medium uppercase tracking-[0.96px] leading-[20px] text-[#a1a1aa]">
                      {String(index + 1).padStart(3, "0")}
                    </span>
                  )}
                </div>
                <div>
                  {card.audience_title && (
                    <h3 className="text-[24px] lg:text-[32px] leading-none tracking-[-0.48px] lg:tracking-[-0.64px] text-cream font-normal mb-[8px]">
                      {card.audience_title}
                    </h3>
                  )}
                  <div className="[&_p]:text-[14px] lg:[&_p]:text-[16px] [&_p]:leading-[22px] lg:[&_p]:leading-[24px] [&_p]:text-[#d8d7d4] [&_p]:opacity-60 lg:w-[90%]">
                    <PrismicRichText field={card.audience_description} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GuidePlaybookHero;
