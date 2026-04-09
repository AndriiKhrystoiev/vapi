import { Content } from "@prismicio/client";

/**
 * Returns the primary StrategyAccordion slice of an article (always slot 0).
 * Returns undefined if the article has no slices.
 */
export function getArticleSlice(
  article: Content.ArticlepageDocument,
): Content.StrategyAccordionSlice | undefined {
  return article.data.slices[0] as Content.StrategyAccordionSlice | undefined;
}

/**
 * Get all chapter titles from an article's slices
 * (both strategy_accordion and standalone chapter slices).
 */
export function getAllChapterTitlesForArticle(
  article: Content.ArticlepageDocument,
): string[] {
  const titles: string[] = [];
  for (const s of article.data.slices) {
    if (s.slice_type === "strategy_accordion") {
      const slice = s as Content.StrategyAccordionSlice;
      for (const ch of slice.primary.chapter ?? []) {
        if (ch.chapter_title) titles.push(ch.chapter_title);
      }
    } else if (s.slice_type === "chapter") {
      const slice = s as Content.ChapterSlice;
      for (const ch of slice.primary.chapter ?? []) {
        if (ch.chapter_title) titles.push(ch.chapter_title);
      }
    }
  }
  return titles;
}
