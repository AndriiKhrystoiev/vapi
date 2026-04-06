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
  const [page, articles] = await Promise.all([
    client.getByUID("articlepage", uid),
    client.getAllByType("articlepage"),
  ]);

  // Pass all slices so the Article component can render sibling slices (RichText, Table) inline
  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles, currentUid: uid, allSlices: page.data.slices }}
    />
  );
}
