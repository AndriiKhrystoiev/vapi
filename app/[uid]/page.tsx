import { SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getArticleSlice } from "@/helpers/article";

export async function generateStaticParams() {
  const client = createClient();
  const articles = await client.getAllByType("articlepage");
  return articles.map((article) => ({ uid: article.uid }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const client = createClient();
  const page = await client.getByUID("articlepage", uid);
  const articleSlice = getArticleSlice(page);
  const partName = articleSlice?.primary.part_name ?? uid;
  return {
    title: `${partName} | Voice Agent Playbook`,
    description: (articleSlice?.primary as Record<string, unknown>)?.summary_description as string ?? "",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const client = createClient();
  const [page, articles, topBar, socialLinksDoc] = await Promise.all([
    client.getByUID("articlepage", uid),
    client.getAllByType("articlepage"),
    client.getSingle("top_bar"),
    client.getSingle("sociallinks").catch(() => null),
  ]);

  const ctaButton = topBar.data.slices[0]?.primary.cta_button;

  // Extract social links from the sociallinks document
  const socialsSlice = socialLinksDoc?.data.slices.find(
    (s): s is Content.SocialsSlice => s.slice_type === "socials",
  );
  const socialLinks = socialsSlice?.primary.social_links ?? [];

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles, currentUid: uid, allSlices: page.data.slices, ctaButton, socialLinks }}
    />
  );
}
