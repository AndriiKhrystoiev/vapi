import { SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const client = createClient();
  const [page, homePage] = await Promise.all([
    client.getByUID("article_page", uid),
    client.getSingle("home_page"),
  ]);

  // Find which part/chapter this article belongs to
  const articleUrl = `/${uid}`;
  let partNumber: number | null = null;
  let partTitle: string | null = null;
  let chapterNumber: number | null = null;

  const roadmapSlice = homePage.data.slices.find(
    (s) => s.slice_type === "guide_roadmap",
  ) as Content.GuideRoadmapSlice | undefined;

  if (roadmapSlice) {
    for (const part of roadmapSlice.primary.parts) {
      for (let i = 0; i < part.sections.length; i++) {
        const section = part.sections[i];
        if (
          section.chapter_link &&
          "url" in section.chapter_link &&
          section.chapter_link.url === articleUrl
        ) {
          partNumber = part.part_number;
          partTitle = part.part_title;
          chapterNumber = i + 1;
          break;
        }
      }
      if (partNumber !== null) break;
    }
  }

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ partNumber, partTitle, chapterNumber }}
    />
  );
}
