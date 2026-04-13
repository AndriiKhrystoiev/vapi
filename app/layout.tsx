import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LinkField, Content } from "@prismicio/client";
import { createClient } from "@/prismicio";
import TopBar from "@/components/TopBar";
import FooterSlice from "@/slices/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voice Agent Playbook",
  description: "A comprehensive guide to building voice agents with Vapi",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let headerLinks: LinkField[] = [];
  let ctaButton: LinkField = {} as LinkField;
  let footerSlice: Content.CtaSlice | null = null;
  let socialLinks: Content.SocialsSliceDefaultPrimarySocialLinksItem[] = [];

  try {
    const client = createClient();
    const [topBar, footerDoc, socialLinksDoc] = await Promise.all([
      client.getSingle("top_bar"),
      client.getSingle("footer").catch(() => null),
      client.getSingle("sociallinks").catch(() => null),
    ]);

    const defaultSlice = topBar.data.slices.find((s) => s.variation === "default");
    const primary = defaultSlice?.primary as Record<string, unknown> | undefined;
    headerLinks = (primary?.header_link ?? []) as LinkField[];
    ctaButton = (primary?.cta_button ?? {}) as LinkField;

    footerSlice = (footerDoc?.data.slices.find(
      (s): s is Content.CtaSlice => s.slice_type === "cta",
    ) ?? null);

    const socialsSlice = socialLinksDoc?.data.slices.find(
      (s): s is Content.SocialsSlice => s.slice_type === "socials",
    );
    socialLinks = socialsSlice?.primary.social_links ?? [];
  } catch {
    // Site renders without nav/footer rather than hard-crashing
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopBar headerLinks={headerLinks} ctaButton={ctaButton} />
        <div className="pt-15">
          {children}
        </div>
        {footerSlice && (
          <FooterSlice slice={footerSlice} socialLinks={socialLinks} />
        )}
      </body>
    </html>
  );
}
