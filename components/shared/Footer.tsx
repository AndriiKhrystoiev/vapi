"use client";

import CTAButton from "@/components/ui/CTAButton";
import { AngleRight } from "@/components/icons";

interface FooterProps {
  chapterCount?: number;
  partCount?: number;
}

export default function Footer({
  chapterCount,
  partCount,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-no-repeat bg-cover" style={{ backgroundImage: "url('/images/footer-background.png')" }}>
      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-0 py-16 lg:py-24 flex flex-col items-center gap-8 lg:gap-10">
        <p className="text-3xl lg:text-6xl leading-[1.15] tracking-[-0.64px] text-cream font-normal text-center max-w-[850px]">
          {chapterCount ?? 32} chapters. {partCount ?? 9} parts.
          <br />
          New content every two weeks.
        </p>
        <div className="flex items-center rounded-full border border-border bg-[#0e0e12] p-1.5 pl-6 w-full max-w-sm lg:max-w-none lg:w-auto">
          <input
            type="email"
            placeholder="Email address..."
            className="bg-transparent text-sm text-cream placeholder:text-muted font-mono focus:outline-none flex-1 lg:flex-none lg:w-56"
          />
          <CTAButton as="button" variant="cream" size="default" className="whitespace-nowrap shrink-0 px-7" icon={<AngleRight color="#09090B" />}>
            Subscribe
          </CTAButton>
        </div>
      </div>
    </footer>
  );
}
