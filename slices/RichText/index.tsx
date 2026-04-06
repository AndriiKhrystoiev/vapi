import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

/**
 * Props for `RichText`.
 */
type RichTextContext = { allSlices?: unknown[] };

export type RichTextProps = SliceComponentProps<Content.RichTextSlice, RichTextContext>;

/**
 * Component for "RichText" Slices.
 * Returns null on article pages — rendered inline by the Article component.
 */
const RichText: FC<RichTextProps> = ({ slice, context }) => {
  if (context?.allSlices) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto max-w-[1440px] px-[120px]"
    >
      <div
        className={[
          "max-w-[734px]",
          "[&_p]:text-base [&_p]:leading-[27.2px] [&_p]:text-muted [&_p]:mb-6",
          "[&_h3]:text-xl [&_h3]:leading-7 [&_h3]:text-cream [&_h3]:font-medium [&_h3]:mt-8 [&_h3]:mb-3",
          "[&_strong]:text-cream [&_strong]:font-semibold",
          "[&_em]:italic",
          "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-accent",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:text-muted",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:text-muted",
          "[&_li]:text-base [&_li]:leading-[27.2px] [&_li]:mb-2",
          "[&_img]:rounded-[3px] [&_img]:my-8 [&_img]:w-full",
          "[&_pre]:bg-surface [&_pre]:border [&_pre]:border-border [&_pre]:rounded-[3px] [&_pre]:p-4 [&_pre]:mb-6 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:text-muted",
        ].join(" ")}
      >
        <PrismicRichText field={slice.primary.rich_text} />
      </div>
    </section>
  );
};

export default RichText;
