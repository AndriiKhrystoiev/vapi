import { SliceZone } from "@prismicio/react";
import { Content } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();
  const [page, articles, socialLinksDoc] = await Promise.all([
    client.getSingle("home_page"),
    client.getAllByType("articlepage"),
    client.getSingle("sociallinks").catch(() => null),
  ]);

  // Extract social links from the sociallinks document
  const socialsSlice = socialLinksDoc?.data.slices.find(
    (s): s is Content.SocialsSlice => s.slice_type === "socials",
  );
  const socialLinks = socialsSlice?.primary.social_links ?? [];

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ articles, socialLinks }}
    />
  );
}
