import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import CTAButton from "@/components/ui/CTAButton";
import { AngleRight } from "@/components/icons";
import Link from "next/link";
import Image from "next/image";

interface TopBarProps {
  headerLinks: LinkField[];
  ctaButton: LinkField;
}

export default function TopBar({ headerLinks, ctaButton }: TopBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-[1440px] px-[120px] flex items-center h-[67px]">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3 font-mono text-base font-medium uppercase tracking-[1.5px]">
          <Image src="/logo.svg" alt="Vapi" width={32} height={16} />
          <span className="text-white">Voice Agent Playbook</span>
        </Link>

        {/* Nav Links — centered */}
        <div className="flex-1 flex items-center justify-center gap-10">
          {headerLinks.map((link, i) => (
            <PrismicNextLink
              key={i}
              field={link}
              className="font-mono text-xs font-medium uppercase tracking-[1.5px] text-muted hover:text-cream transition-colors"
            />
          ))}
        </div>

        {/* CTA Button */}
        <PrismicNextLink field={ctaButton}>
          <CTAButton variant="outline" size="small">
            {ctaButton.text}
          </CTAButton>
        </PrismicNextLink>
      </div>
    </nav>
  );
}

interface ArticleTopBarProps {
  partName?: string | null;
  ctaButton?: LinkField;
}

export function ArticleTopBar({ partName, ctaButton }: ArticleTopBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-background border-b border-border">
      <div className="mx-auto max-w-[1440px] px-[120px] flex items-center h-[67px]">
        {/* Logo + Breadcrumb */}
        <div className="flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-[1.5px]">
          <Link href="/">
            <Image src="/logo.svg" alt="Vapi" width={32} height={16} />
          </Link>
          <Link href="/" className="text-muted hover:text-cream transition-colors">
            Playbook
          </Link>
          {partName && (
            <>
              <AngleRight color="#a1a1ab" />
              <span className="text-cream">{partName}</span>
            </>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA Button */}
        {ctaButton && "text" in ctaButton && ctaButton.text && (
          <PrismicNextLink field={ctaButton}>
            <CTAButton variant="outline" size="small">
              {ctaButton.text}
            </CTAButton>
          </PrismicNextLink>
        )}
      </div>
    </nav>
  );
}
