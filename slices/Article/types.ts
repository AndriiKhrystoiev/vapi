import { Content } from "@prismicio/client";

/** A sibling slice that can appear in an article's SliceZone. */
export type SiblingSlice =
  | Content.RichTextSlice
  | Content.TableSlice
  | Content.StrategyAccordionSlice
  | Content.ChapterSlice;

/** Context passed from the article page to the Article slice components. */
export type ArticleContext = {
  articles?: Content.ArticlepageDocument[];
  currentUid?: string;
  allSlices?: SiblingSlice[];
  ctaButton?: Content.VoiceAgentPlaybookSliceArticlePagePrimary["cta_button"];
  socialLinks?: Content.SocialsSliceDefaultPrimarySocialLinksItem[];
};
