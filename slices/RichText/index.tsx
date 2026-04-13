import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { articleProseClasses } from "@/lib/proseClasses";

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
      <div className={`max-w-[734px] ${articleProseClasses}`}>
        <PrismicRichText field={slice.primary.rich_text} />
      </div>
    </section>
  );
};

export default RichText;
