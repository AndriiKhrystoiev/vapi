import { FC } from "react";
import { Content, asText, RichTextField } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";
import { ArrowRight } from "@/components/icons";
import CTAButton from "@/components/ui/CTAButton";
import DocumentLinkList from "@/components/shared/DocumentLinkList";
import ChapterNavLink from "@/components/shared/ChapterNavLink";
import ArticleTOC from "@/components/shared/ArticleTOC";
import FollowSeries from "@/components/shared/FollowSeries";
import Footer from "@/components/shared/Footer";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractH2Headings(field: RichTextField): { id: string; text: string }[] {
  if (!field) return [];
  return field
    .filter((node) => node.type === "heading2")
    .map((node) => {
      const text = "text" in node ? node.text : "";
      return { id: slugify(text), text };
    });
}

interface ArticleContext {
  partNumber?: number | null;
  partTitle?: string | null;
  chapterNumber?: number | null;
}

/**
 * Props for `UseCaseDetail`.
 */
export type UseCaseDetailProps =
  SliceComponentProps<Content.UseCaseDetailSlice, ArticleContext>;

/**
 * Component for "UseCaseDetail" Slices.
 */
const UseCaseDetail: FC<UseCaseDetailProps> = ({ slice, context }) => {
  const headingText = asText(slice.primary.heading);
  const chapterStr = context?.chapterNumber
    ? String(context.chapterNumber).padStart(2, "0")
    : null;
  const h2Headings = extractH2Headings(slice.primary.content);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-background min-h-screen"
    >
      {/* Article Header */}
      <header className="pt-4 pb-4">
        <div className="mx-auto max-w-[1440px] px-20">
          <div className="max-w-[734px]">
            {/* Breadcrumb */}
            <nav className="mb-16 text-sm text-muted">
              <Link href="/" className="hover:text-cream transition-colors">
                Playbook
              </Link>
              <span className="mx-2">/</span>
              <span>{headingText}</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="pb-16">
        <div className="mx-auto max-w-[1440px] px-20">
          <div className="flex gap-12">
          <div className="max-w-[734px] min-w-0">
            {/* Part & Chapter metadata */}
            {context?.partNumber != null && (
              <p className="mb-4 font-mono text-sm text-muted uppercase tracking-[1.5px]">
                Part {context.partNumber}
                <span className="mx-2">&bull;</span>
                <span>{context.partTitle}</span>
                {chapterStr && (
                  <>
                    <span className="mx-2">&bull;</span>
                    Chapter {chapterStr}
                  </>
                )}
              </p>
            )}

            <div className="mb-6 [&_h1]:text-[48px] [&_h1]:leading-[58px] [&_h1]:tracking-[-0.5px] [&_h1]:text-cream [&_h1]:font-medium">
              <PrismicRichText field={slice.primary.heading} />
            </div>
            {/* Rich text content with full typography styling */}
            <div
              className={[
                "[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-muted [&_p]:mb-6",
                "[&_h2]:text-[28px] [&_h2]:leading-9 [&_h2]:tracking-[-0.5px] [&_h2]:text-cream [&_h2]:font-medium [&_h2]:mt-12 [&_h2]:mb-4",
                "[&_h3]:text-xl [&_h3]:leading-7 [&_h3]:text-cream [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3",
                "[&_strong]:text-cream [&_strong]:font-semibold",
                "[&_em]:italic",
                "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-accent",
                "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-muted",
                "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-muted",
                "[&_li]:text-base [&_li]:leading-[27.2px] [&_li]:mb-2",
                "[&_img]:rounded-[3px] [&_img]:my-8 [&_img]:w-full",
              ].join(" ")}
            >
              <PrismicRichText
                field={slice.primary.content}
                components={{
                  heading2: ({ children, node }) => (
                    <h2 id={slugify(node.text)} className="scroll-mt-28">{children}</h2>
                  ),
                }}
              />
            </div>

            {/* Worksheet Section */}
            {slice.primary.worksheetTitle && slice.primary.worksheetCta?.text && (
              <div className="mt-16 flex flex-col gap-4">
                <h3 className="font-mono text-xs text-muted uppercase tracking-[1.5px]">
                  {slice.primary.worksheetTitle}
                </h3>
                <DocumentLinkList links={[slice.primary.worksheetCta]} />
              </div>
            )}

            {/* Callout Block */}
            {slice.primary.calloutBlock && slice.primary.calloutBlock.length > 0 && (
              <div className="mt-12 border-l-[3px] border-accent bg-[#142121] rounded-r-lg px-8 py-8 [&_p]:text-lg [&_p]:leading-8 [&_p]:text-cream">
                <PrismicRichText field={slice.primary.calloutBlock} />
              </div>
            )}

            {/* CTA Cards */}
            {slice.primary.ctacards && slice.primary.ctacards.length > 0 && (
              <div className="mt-12 flex flex-col gap-6">
                {slice.primary.ctacards.map((card, index) => (
                  <div
                    key={index}
                    className="rounded-[8px] border border-border-active bg-surface p-6 flex flex-col gap-3"
                  >
                    {card.title && (
                      <h3 className="text-xl leading-7 text-cream font-semibold">
                        {card.title}
                      </h3>
                    )}
                    {card.cta_description && (
                      <p className="text-sm leading-[22px] text-muted">
                        {card.cta_description}
                      </p>
                    )}
                    {card.cta_link?.text && (
                      <div className="mt-2">
                        <PrismicNextLink field={card.cta_link}>
                          <CTAButton variant="primary" icon={<ArrowRight color="#09090B" />}>
                            {card.cta_link.text}
                          </CTAButton>
                        </PrismicNextLink>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Prev / Next Navigation */}
            <div className="border-t border-border mt-16 pt-10">
              <div className="flex items-center justify-between">
                {slice.primary.prevArticle?.text ? (
                  <ChapterNavLink field={slice.primary.prevArticle} direction="prev" />
                ) : (
                  <div />
                )}
                <ChapterNavLink field={slice.primary.nextArticle} direction="next" />
              </div>
            </div>

          </div>

          {/* TOC Sidebar — sticky, scrolls with content then sticks to top */}
          
            <div className="hidden lg:block w-[320px] shrink-0">
              <div className="sticky top-24 flex flex-col gap-4">
                {h2Headings.length > 0 && (
                  <ArticleTOC
                    headings={h2Headings}
                    chapterLabel={chapterStr ? `Chapter ${chapterStr}` : undefined}
                    totalSections={h2Headings.length}
                  />
                )}

                {slice.primary.worksheetTitle && slice.primary.worksheetCta?.text && (
                  <div className="rounded-[3px] bg-surface border border-border p-5 flex flex-col gap-4">
                    <h3 className="font-mono text-xs text-muted uppercase tracking-[1.5px]">
                      {slice.primary.worksheetTitle}
                    </h3>
                    <DocumentLinkList links={[slice.primary.worksheetCta]} />
                  </div>
                )}

                <FollowSeries />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer CTA */}
      <Footer />
    </section>
  );
};

export default UseCaseDetail;
