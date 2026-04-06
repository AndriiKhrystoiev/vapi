import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

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

  // Use the CTA button from the first (Default) TopBar slice
  const ctaButton = topBar.data.slices[0]?.primary.cta_button;

  // Pass all slices so the Article component can render sibling slices (RichText, Table) inline
  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles, currentUid: uid, allSlices: page.data.slices, ctaButton }}
    />
  );
}
