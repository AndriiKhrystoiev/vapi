import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type SocialsProps = SliceComponentProps<Content.SocialsSlice>;

/**
 * Social links are rendered via Footer — this slice returns null.
 */
const Socials: FC<SocialsProps> = () => {
  return null;
};

export default Socials;
