import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

type ChapterContext = { allSlices?: unknown[] };

/**
 * Props for `Chapter`.
 */
export type ChapterProps = SliceComponentProps<Content.ChapterSlice, ChapterContext>;

/**
 * Component for "Chapter" Slices.
 * Returns null on article pages — rendered inline by the Article component.
 */
const Chapter: FC<ChapterProps> = ({ context }) => {
  if (context?.allSlices) return null;

  return null;
};

export default Chapter;
