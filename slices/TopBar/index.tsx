import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

/**
 * Props for `TopBar`.
 */
export type TopBarProps =
  SliceComponentProps<Content.VoiceAgentPlaybookSlice>;

/**
 * Component for "TopBar" Slices.
 */
const TopBar: FC<TopBarProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <PrismicNextLink field={slice.primary.cta_button} />
    </section>
  );
};

export default TopBar;
