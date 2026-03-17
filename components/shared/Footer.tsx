"use client";

import Input from "@/components/ui/Input";
import CTAButton from "@/components/ui/CTAButton";
import { CircleInButton } from "@/components/icons";

interface FooterProps {
  description?: string;
}

export default function Footer({
  description = "32 chapters. 9 parts. New content every two weeks.",
}: FooterProps) {
  return (
    <footer className="mx-auto px-20 pt-8 pb-14 border-t border-border">
      <div className="flex flex-col items-center gap-8">
        <p className="font-mono text-sm text-muted text-center">
          {description}
        </p>
        <div className="flex items-center gap-3">
          <Input
            type="email"
            placeholder="you@company.com"
            className="w-52 rounded-lg bg-transparent border-[#3f3f46] text-sm text-white placeholder:text-[#52525b] font-mono"
          />
          <CTAButton as="button" variant="primary" className="whitespace-nowrap shrink-0" icon={<CircleInButton color="#09090B" />}>
            Follow the series
          </CTAButton>
        </div>
      </div>
    </footer>
  );
}
