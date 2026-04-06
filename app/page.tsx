import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const [page, articles] = await Promise.all([
    client.getSingle("home_page"),
    client.getAllByType("articlepage"),
  ]);

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles }}
    />
  );
}
