import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";
import { AngleDown, AngleRight, CircleInButton } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";
import { pluralize } from "@/helpers/pluralize";
import { formatListenMinutes, getArticleListenSeconds } from "@/helpers/listenTime";
import { sortArticlesByPartNumber, getArticleSlice } from "@/helpers/article";
import LearningOutcomes from "./components/LearningOutcomes";

type HomeContext = {
  articles?: Content.ArticlepageDocument[];
  socialLinks?: Content.SocialsSliceDefaultPrimarySocialLinksItem[];
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
  const articles = sortArticlesByPartNumber(context?.articles ?? []);
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
        <div className="mx-auto max-w-360 px-4 lg:px-30 pt-10 lg:pt-16 pb-16 lg:pb-24">
          <div className="relative max-w-[650px]">
            <div className="[&_h1]:text-[36px] lg:[&_h1]:text-[60px] [&_h1]:leading-[1.04] [&_h1]:tracking-[-0.72px] lg:[&_h1]:tracking-[-1.2px] [&_h1]:text-cream [&_h1]:font-normal">
              <PrismicRichText field={slice.primary.heading} />
            </div>
            <div className="mt-6 lg:mt-8 [&_p]:text-sm lg:[&_p]:text-base [&_p]:leading-[22px] lg:[&_p]:leading-[24px] [&_p]:text-body-text">
              <PrismicRichText field={slice.primary.description} />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-8 lg:mt-10">
              <PrismicNextLink field={slice.primary.cta_button}>
                <CTAButton as="span" className="px-8 lg:px-12" icon={<AngleRight />} variant="primary">
                  {slice.primary.cta_button.text}
                </CTAButton>
              </PrismicNextLink>
              {slice.primary.newsletter_button?.text && (
                <PrismicNextLink field={slice.primary.newsletter_button}>
                  <CTAButton as="span" className="px-8 lg:px-12" icon={<CircleInButton color="#09090B" />} variant="cream">
                    {slice.primary.newsletter_button.text}
                  </CTAButton>
                </PrismicNextLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      {slice.primary.table_of_contents_description && (
        <section className="border-b border-border">
          <div className="mx-auto max-w-360 px-4 lg:px-30 pt-12 pb-4 lg:pb-6">
            <div className="mb-4 lg:mb-[24px]">
              <p className="font-mono text-[12px] text-[rgba(255,250,234,0.6)] font-medium uppercase tracking-[0.96px] leading-[20px] mb-4 lg:mb-[24px]">
                {articles.length} chapters
              </p>
              <p className="mt-6 lg:mt-8 text-sm text-base text-body-text">
                {slice.primary.table_of_contents_description}
              </p>
            </div>
          </div>
          <div className="border-t border-border" />
          <div className="mx-auto max-w-360 px-4 lg:px-30 -mb-[1px]">
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: Content.ArticlepageDocument, index: number) => {
              const articleSlice = getArticleSlice(article);
              if (!articleSlice) return null;
              const { brief_description, part_number, part_name, part_color, chapter } = articleSlice.primary;
              const chapterCount = chapter?.length ?? 0;
              const readingMinutes = formatListenMinutes(getArticleListenSeconds(article));
              const isLastRow = index >= articles.length - (articles.length % 3 || 3);
              return (
                <div
                  key={article.id}
                  className={`group relative grid grid-rows-[subgrid] row-span-4 gap-4 lg:gap-6 min-h-[240px] lg:min-h-[376px] md:px-[24px] pt-8 lg:pt-[48px] pb-4 lg:pb-6 border-b border-border ${
                    index % 3 !== 0 ? "md:border-l md:border-l-border" : ""
                  } ${isLastRow ? "border-b-[rgba(255,250,235,0.12)]" : ""}`}
                >
                  <div className="self-start">
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
                  {brief_description && (
                    <p className="text-[14px] lg:text-[16px] leading-[22px] lg:leading-[24px] text-body-text opacity-60 self-end">
                      {brief_description}
                    </p>
                  )}
                  <div className="flex items-center justify-between self-end">
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
                  </div>
                  <div className="flex items-center gap-4 justify-between">
                    <a
                      href={`/api/pdf/${article.uid}`}
                      className="w-1/2"
                      download
                    >
                      <CTAButton className="w-full text-center" as="span" variant="secondary" size="small" icon={<AngleDown />}>
                        PDF
                      </CTAButton>
                    </a>
                    <Link className="w-1/2" href={article.url ?? "#"}>
                      <CTAButton className="w-full" as="span" variant="primary" size="small">
                        View
                      </CTAButton>
                    </Link>
                  </div>
                </div>
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
        <section id="overview" className="scroll-mt-16.75 mx-auto max-w-360 px-4 lg:px-30 py-12">
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
            <LearningOutcomes outcomes={slice.primary.learning_outcomes} />
          </div>
        </section>
      )}

      {/* Who this playbook is for */}
      {slice.primary.audience_section_heading && (
        <section id="audience" className="scroll-mt-16.75 mx-auto max-w-360 px-4 lg:px-30 pb-12 lg:pb-24">
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
                className={`relative px-4 lg:px-[24px] py-6 lg:pt-[24px] lg:pb-6 min-h-50 lg:min-h-80 flex flex-col justify-between ${
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
                  <div className="[&_p]:text-[14px] lg:[&_p]:text-[16px] [&_p]:leading-[22px] lg:[&_p]:leading-[24px] [&_p]:text-body-text [&_p]:opacity-60 lg:w-[90%]">
                    <PrismicRichText field={card.audience_description} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default GuidePlaybookHero;
