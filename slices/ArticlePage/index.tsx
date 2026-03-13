import { FC } from "react";
import { Content, asText } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import { DocumentIcon, LinkIcon } from "@/components/icons";
import ArrowLeft from "@/components/icons/arrow-left";
import ArrowRight from "@/components/icons/arrow-right";

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
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="pb-16">
        <div className="mx-auto max-w-[1440px] px-20">
          <div className="max-w-[734px]">
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
              <PrismicRichText field={slice.primary.content} />
            </div>

            {/* Prev / Next Navigation */}
            <div className="border-t border-border mt-16 pt-10">
              <div className="flex items-center justify-between">
                {slice.primary.prevArticle?.text ? (
                  <PrismicNextLink
                    field={slice.primary.prevArticle}
                    className="flex items-center gap-4 group"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e1e22] border border-transparent group-hover:bg-transparent group-hover:border-border-active transition-colors">
                      <ArrowLeft />
                    </span>
                    <span className="text-lg text-muted group-hover:text-cream transition-colors">
                      {slice.primary.prevArticle.text}
                    </span>
                  </PrismicNextLink>
                ) : (
                  <div />
                )}
                {slice.primary.nextArticle?.text && (
                  <PrismicNextLink
                    field={slice.primary.nextArticle}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-lg text-muted group-hover:text-cream transition-colors">
                      {slice.primary.nextArticle.text}
                    </span>
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1e1e22] border border-transparent group-hover:bg-transparent group-hover:border-border-active transition-colors">
                      <ArrowRight />
                    </span>
                  </PrismicNextLink>
                )}
              </div>
            </div>

            {/* Worksheet Section */}
            {slice.primary.worksheetTitle && (
              <div className="mt-12 p-5 border border-border-active bg-surface rounded-[3px]">
                <div className="flex items-center justify-between">
                  <span className="text-cream font-medium text-base">
                    {slice.primary.worksheetTitle}
                  </span>
                  {slice.primary.worksheetCta?.text && (
                    <PrismicNextLink
                      field={slice.primary.worksheetCta}
                      className="flex items-center gap-3 px-4 py-3 border border-border bg-surface hover:bg-background text-link text-sm rounded-[3px] transition-all"
                    >
                      <DocumentIcon />
                      {slice.primary.worksheetCta.text}
                      <LinkIcon />
                    </PrismicNextLink>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCaseDetail;
