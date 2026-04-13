import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LinkField } from "@prismicio/client";
import { createClient } from "@/prismicio";
import TopBar from "@/components/TopBar";
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

  try {
    const client = createClient();
    const topBar = await client.getSingle("top_bar");
    const defaultSlice = topBar.data.slices.find((s) => s.variation === "default");
    const primary = defaultSlice?.primary as Record<string, unknown> | undefined;
    headerLinks = (primary?.header_link ?? []) as LinkField[];
    ctaButton = (primary?.cta_button ?? {}) as LinkField;
  } catch {
    // Site renders without nav rather than hard-crashing
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopBar headerLinks={headerLinks} ctaButton={ctaButton} />
        <div className="pt-15">
          {children}
        </div>
      </body>
    </html>
  );
}
