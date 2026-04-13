import { SliceZone } from "@prismicio/react";

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
    description: articleSlice?.primary.summary_description ?? "",
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const client = createClient();
  const [page, articles, topBar] = await Promise.all([
    client.getByUID("articlepage", uid),
    client.getAllByType("articlepage"),
    client.getSingle("top_bar"),
  ]);

  const ctaButton = topBar.data.slices[0]?.primary.cta_button;

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles, currentUid: uid, allSlices: page.data.slices, ctaButton }}
    />
  );
}
