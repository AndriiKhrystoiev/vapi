import { asText, Content, RichTextField } from "@prismicio/client";

// Average TTS / audiobook pace in English (words per minute).
const WPM = 150;

export interface ChapterListenData {
  text: string;
  seconds: number;
  formatted: string;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Estimate listen time for a single chapter's rich-text body.
 * Returns the flattened text, total seconds, and an `m:ss` label used
 * by the per-chapter ListenButton.
 */
export function getChapterListenData(
  field: RichTextField | null | undefined,
): ChapterListenData {
  const text = field ? asText(field).trim() : "";

  if (!text) {
    return { text: "", seconds: 0, formatted: "0:00" };
  }

  const words = text.split(/\s+/).filter(Boolean).length;
  const seconds = Math.max(1, Math.round((words / WPM) * 60));

  return {
    text,
    seconds,
    formatted: formatDuration(seconds),
  };
}

type ChapterBearingSlice = Content.StrategyAccordionSlice | Content.ChapterSlice;

/**
 * Sum listen time in seconds across every chapter in a single slice
 * (either a StrategyAccordion or a standalone Chapter slice).
 */
export function getSliceListenSeconds(slice: ChapterBearingSlice): number {
  const chapters = slice.primary.chapter ?? [];
  let total = 0;
  for (const ch of chapters) {
    total += getChapterListenData(ch.chapter_content).seconds;
  }
  return total;
}

/**
 * Sum listen time in seconds across every chapter in an entire article
 * document — main StrategyAccordion slice plus any sibling Chapter slices.
 */
export function getArticleListenSeconds(
  article: Content.ArticlepageDocument,
): number {
  let total = 0;
  for (const s of article.data.slices) {
    if (s.slice_type === "strategy_accordion" || s.slice_type === "chapter") {
      total += getSliceListenSeconds(s as ChapterBearingSlice);
    }
  }
  return total;
}

/**
 * Format a seconds total as a minutes label, e.g. "45 min".
 * Always at least "1 min" for any non-zero content so the UI never shows "0 min".
 */
export function formatListenMinutes(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 min";
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} min`;
}
